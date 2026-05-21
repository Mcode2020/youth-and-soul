import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Stethoscope, Truck } from "lucide-react";

export function JoinHealthPlansCTA() {
  const navigate = useNavigate();

  return (
    <section className="mt-8 bg-primary/5 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 text-center">
        <p className="text-foreground font-semibold text-xs md:text-sm tracking-wide mb-2">
          Trusted by medical experts
        </p>
        <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
          Join Our Monthly Health Programs
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mb-4 max-w-lg mx-auto">
          Doctor-prescribed treatments shipped discreetly to your door. Get approved in under 5 minutes.
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-[11px] md:text-sm">Doctor-reviewed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-[11px] md:text-sm">24/7 support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground text-[11px] md:text-sm">Discreet shipping</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/");
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm md:text-base hover:bg-primary/90 transition-colors"
          >
            Join Health Plans
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => navigate("/weightloss-glp-intake")}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-secondary transition-colors"
          >
            From $79/mo
          </button>
        </div>
      </div>
    </section>
  );
}
