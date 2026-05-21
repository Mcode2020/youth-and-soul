import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AffiliateBanner() {
  const navigate = useNavigate();

  return (
    <aside
      aria-label="Youth and Soul affiliate program — earn money promoting telehealth"
      className="max-w-6xl mx-auto px-4 py-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl bg-gradient-to-r from-[hsl(0,0%,92%)] via-[hsl(0,0%,98%)] to-[hsl(140,25%,88%)]">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 md:p-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
              <h3 className="text-lg md:text-3xl font-black text-foreground mb-1 tracking-tight">
              Earn Money with us Today. Become an Affiliate
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Did you know Telehealth affiliates are among the highest-payout partners in the industry. Promote Youth&Soul across TikTok, email, blogs, Instagram, YouTube, or your own Facebook and TikTok ads for instant payouts.
            </p>
          </div>
          <button
            onClick={() => navigate("/earn-affiliate")}
            aria-label="Apply now to become a Youth and Soul affiliate"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
