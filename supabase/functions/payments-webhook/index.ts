import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const FUNCTIONS_URL = Deno.env.get("SUPABASE_URL")?.replace(".co", ".co/functions/v1");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object, env);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env);
        break;
      case "invoice.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  console.log("Checkout completed:", session.id, "mode:", session.mode);
  // Update enrollment status if program metadata exists
  if (session.metadata?.programSlug && session.customer_email) {
    await supabase
      .from("enrollments")
      .update({ status: "paid" })
      .eq("email", session.customer_email)
      .eq("program_slug", session.metadata.programSlug)
      .eq("status", "pending");
  }

  await sendPostPurchaseEmail(session);
}

async function sendPostPurchaseEmail(session: any) {
  const email = session.customer_details?.email || session.customer_email;
  if (!email || !session.metadata?.programSlug) return;

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!FUNCTIONS_URL || !serviceKey) return;

  let tierIncludes: string[] = [];
  try {
    tierIncludes = session.metadata.tierIncludes ? JSON.parse(session.metadata.tierIncludes) : [];
  } catch (_) {
    tierIncludes = [];
  }

  try {
    const res = await fetch(`${FUNCTIONS_URL}/send-enrollment-notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "payment_confirmation",
        firstName: session.customer_details?.name?.split(" ")?.[0] || "",
        email,
        programSlug: session.metadata.programSlug,
        programTitle: session.metadata.programTitle,
        programDescription: session.metadata.programDescription,
        programImage: session.metadata.programImage,
        tierName: session.metadata.tierName,
        tierPrice: session.metadata.tierPrice,
        tierIncludes,
      }),
    });
    if (!res.ok) console.error("Post-purchase email failed:", await res.text());
  } catch (error) {
    console.error("Post-purchase email error:", error);
  }
}

async function handleSubscriptionCreated(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = subscription.current_period_start;
  const periodEnd = subscription.current_period_end;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId || null,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function handleSubscriptionUpdated(subscription: any, env: StripeEnv) {
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = subscription.current_period_start;
  const periodEnd = subscription.current_period_end;

  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      product_id: productId,
      price_id: priceId,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}
