import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function InfluencerSection() {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main CTA Banner */}
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ background: 'hsl(0, 0%, 12%)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium mb-3">
              <TrendingUp className="w-3 h-3" />
              Influencer Program
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              Turn Influence Into Income
            </h2>
            <p className="text-sm text-white/60">
              Join health & wellness creators earning by promoting products.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigate("/apply-influencer")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
