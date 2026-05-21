import { useNavigate } from "react-router-dom";
import { AISearchBar } from "@/components/ui/AISearchBar";

export function SearchBarSection() {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-10" style={{ background: 'hsl(0, 0%, 12%)' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-4">
          <h3 className="text-base md:text-2xl font-bold text-white mb-1">
            Search the Marketplace
          </h3>
          <p className="text-xs md:text-sm text-white/60">
            Ask our AI to find the perfect products for your goals
          </p>
        </div>
        <div className="relative z-[9999]">
          <AISearchBar
            onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => navigate("/search")}
            className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Ask AI
          </button>
          <span className="text-muted-foreground text-xs">•</span>
          <button
            onClick={() => navigate("/goals/longevity-basics")}
            className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Goals
          </button>
          <span className="text-muted-foreground text-xs">•</span>
          <button
            onClick={() => navigate("/list-product")}
            className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            List Your Product
          </button>
        </div>
      </div>
    </section>
  );
}
