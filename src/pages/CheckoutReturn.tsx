import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useSEOHead } from "@/hooks/useSEOHead";
import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  useSEOHead({
    title: "Payment Confirmation",
    description: "Your Youth & Soul payment has been received. Next steps will be sent to your email.",
    path: "/checkout/return",
    noIndex: true,
  });

  useEffect(() => {
    trackAnalyticsEvent(sessionId ? "payment_success" : "payment_failure", {
      sessionId,
      source: "checkout_return",
    });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate("/dashboard?checkout=success", { replace: true });
    });
  }, [navigate, sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {sessionId ? (
          <>
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-3xl font-black text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your subscription is now active. Create your account with the same email to view your health plan, care updates, and delivery information.
            </p>
            <button
              onClick={() => navigate(`/auth?mode=signup${email ? `&email=${encodeURIComponent(email)}` : ""}`)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Create Account & View Dashboard
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">No session information found. Please try again.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
