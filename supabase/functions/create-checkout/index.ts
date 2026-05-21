import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, quantity, customerEmail, userId, returnUrl, environment, programSlug, programTitle, programDescription, programImage, tierName, tierPrice, tierIncludes } = await req.json();
    if (!priceId || typeof priceId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      return new Response(JSON.stringify({ error: "Invalid priceId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const env = (environment || 'sandbox') as StripeEnv;
    const stripe = createStripeClient(env);

    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!Array.isArray(prices?.data)) {
      console.error("Stripe price lookup failed", { priceId, env, response: prices });
      return new Response(JSON.stringify({ error: "Payments are not ready for this environment" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripePrice = prices.data[0];
    const fallbackAmount = Number(String(tierPrice || "").replace(/[^0-9.]/g, ""));
    if (!stripePrice && (!fallbackAmount || fallbackAmount < 1)) {
      return new Response(JSON.stringify({ error: "Price not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isRecurring = stripePrice ? stripePrice.type === "recurring" : true;

    const metadata: Record<string, string> = {};
    if (userId) metadata.userId = userId;
    if (programSlug) metadata.programSlug = programSlug;
    if (programTitle) metadata.programTitle = programTitle;
    if (programDescription) metadata.programDescription = programDescription;
    if (programImage) metadata.programImage = programImage;
    if (tierName) metadata.tierName = tierName;
    if (tierPrice) metadata.tierPrice = tierPrice;
    if (Array.isArray(tierIncludes)) metadata.tierIncludes = JSON.stringify(tierIncludes);

    const lineItem = stripePrice
      ? { price: stripePrice.id, quantity: quantity || 1 }
      : {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(fallbackAmount * 100),
            recurring: { interval: "month" },
            product_data: {
              name: `${programTitle || "Youth & Soul Program"} — ${tierName || priceId}`,
              ...(programDescription && { description: programDescription }),
            },
          },
          quantity: quantity || 1,
        };

    const session = await stripe.checkout.sessions.create({
      line_items: [lineItem],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded",
      return_url: returnUrl || `${req.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(Object.keys(metadata).length > 0 && {
        metadata,
        ...(isRecurring && { subscription_data: { metadata } }),
      }),
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
