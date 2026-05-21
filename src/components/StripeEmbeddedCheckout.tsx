import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
  programSlug?: string;
  programTitle?: string;
  programDescription?: string;
  programImage?: string;
  tierName?: string;
  tierPrice?: string;
  tierIncludes?: string[];
  onReady?: () => void;
}

export function StripeEmbeddedCheckout({
  priceId,
  quantity,
  customerEmail,
  userId,
  returnUrl,
  programSlug,
  programTitle,
  programDescription,
  programImage,
  tierName,
  tierPrice,
  tierIncludes,
  onReady,
}: StripeEmbeddedCheckoutProps) {
  const [checkoutKey, setCheckoutKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sharedAnalyticsPayload = useMemo(() => ({
    priceId,
    quantity: quantity || 1,
    programSlug,
    tierName,
    environment: getStripeEnvironment(),
  }), [priceId, quantity, programSlug, tierName]);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    setErrorMessage(null);
    trackAnalyticsEvent("checkout_start", sharedAnalyticsPayload);
    trackAnalyticsEvent("checkout_step_viewed", {
      ...sharedAnalyticsPayload,
      step: "stripe_embedded_form",
    });

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        quantity,
        customerEmail,
        userId,
        returnUrl,
        environment: getStripeEnvironment(),
        programSlug,
        programTitle,
        programDescription,
        programImage,
        tierName,
        tierPrice,
        tierIncludes,
      },
    });
    if (error || !data?.clientSecret) {
      const reason = error?.message || data?.error || "missing_client_secret";
      setErrorMessage(reason);
      trackAnalyticsEvent("payment_failure", {
        priceId,
        programSlug,
        tierName,
        environment: getStripeEnvironment(),
        reason,
      });
      throw new Error(reason || "Failed to create checkout session");
    }
    onReady?.();
    return data.clientSecret;
  }, [priceId, quantity, customerEmail, userId, returnUrl, programSlug, programTitle, programDescription, programImage, tierName, tierPrice, tierIncludes, onReady, sharedAnalyticsPayload]);

  const handleCheckoutComplete = useCallback(() => {
    trackAnalyticsEvent("checkout_form_completed", sharedAnalyticsPayload);
  }, [sharedAnalyticsPayload]);

  const handleReloadCheckout = () => {
    setErrorMessage(null);
    setCheckoutKey((key) => key + 1);
  };

  return (
    <div id="checkout" className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-foreground">Secure checkout</p>
          {errorMessage && <p className="text-xs text-muted-foreground mt-0.5">We couldn’t load the payment form. Please retry.</p>}
        </div>
        <button
          type="button"
          onClick={handleReloadCheckout}
          className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Reload checkout
        </button>
      </div>
      {errorMessage && (
        <div className="mx-4 mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-foreground">
          Checkout is temporarily unavailable. Reload the secure checkout or contact support if it keeps happening.
        </div>
      )}
      <div className="min-h-[560px] bg-background px-1 py-2 sm:px-3">
      <EmbeddedCheckoutProvider
        key={`${priceId}-${checkoutKey}`}
        stripe={getStripe()}
        options={{
          fetchClientSecret,
          onComplete: handleCheckoutComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
