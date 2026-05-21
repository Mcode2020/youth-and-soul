import { useNavigate } from "react-router-dom";
import { Megaphone, ArrowRight } from "lucide-react";

export function AdvertiserCTA() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-4 py-2">
      <div className="relative overflow-hidden p-6 md:p-10 bg-gradient-to-r from-card via-card to-primary/5 rounded-2xl md:rounded-3xl border border-border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="hidden sm:flex w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 items-center justify-center shrink-0">
            <Megaphone className="w-7 h-7 md:w-8 md:h-8 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-black text-xl md:text-3xl text-foreground mb-1 tracking-tight">
              Want your product featured?
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Get premium visibility and reach thousands of buyers
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/list-product")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors shrink-0 shadow-lg"
        >
          Promote Your Product
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
