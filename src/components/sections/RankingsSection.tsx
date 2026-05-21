import { useNavigate } from "react-router-dom";
import { Star, ArrowUp, ArrowDown, Minus, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import logoPlaceholder from "@/assets/logo-youthsoul-dark.png";

const getChangeIcon = (index: number) => {
  if (index % 3 === 0) return <ArrowUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />;
  if (index % 3 === 1) return <Minus className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />;
  return <ArrowDown className="w-3 h-3 md:w-4 md:h-4 text-red-500" />;
};

export function RankingsSection() {
  const navigate = useNavigate();
  const { products, loading } = useProducts({ perPage: 5, orderBy: "views" });

  return (
    <section className="py-6 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-10">
          <div>
            <h2 className="text-lg md:text-3xl text-foreground">Weekly Rankings</h2>
            <p className="text-[10px] md:text-sm text-muted-foreground">Based on reviews & sales</p>
          </div>
          <button onClick={() => navigate("/search")} className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <span className="hidden sm:inline">Full rankings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Rankings List */}
        <div className="space-y-2 md:space-y-0 md:bg-card md:rounded-2xl md:border md:border-border/50 md:shadow-soft md:overflow-hidden">
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-secondary/50 border-b border-border/50 text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Reviews</div>
            <div className="col-span-2 text-right">Score</div>
          </div>

          <div className="space-y-2 md:space-y-0 md:divide-y md:divide-border/50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-12 h-4" />
                  </div>
                ))
              : products.map((item, index) => {
                  const rank = index + 1;
                  const score = 98 - index * 2;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="w-full flex items-center gap-3 p-3 md:p-0 bg-card md:bg-transparent rounded-xl md:rounded-none border border-border/50 md:border-0 shadow-soft md:shadow-none md:grid md:grid-cols-12 md:gap-4 md:px-6 md:py-4 hover:bg-secondary/30 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-1.5 md:col-span-1">
                        <span className={`text-lg md:text-2xl font-bold ${
                          rank === 1 ? "text-accent" : rank === 2 ? "text-muted-foreground" : rank === 3 ? "text-amber-700" : "text-foreground"
                        }`}>
                          #{rank}
                        </span>
                        {getChangeIcon(index)}
                      </div>

                      <div className="flex items-center gap-2.5 flex-1 min-w-0 md:col-span-5">
                        <img
                          src={item.images?.[0] || logoPlaceholder}
                          alt={item.product_name}
                          onError={(e) => { (e.target as HTMLImageElement).src = logoPlaceholder; }}
                          className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-foreground text-xs md:text-base truncate">{item.product_name}</h4>
                          <p className="text-[10px] md:text-sm text-muted-foreground">{item.brand}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 md:hidden">
                        <div className="w-10 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                        </div>
                        <span className="font-semibold text-sm text-foreground">{score}</span>
                      </div>

                      <div className="hidden md:block md:col-span-2">
                        <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">{item.category}</span>
                      </div>

                      <div className="hidden md:flex md:col-span-2 items-center gap-1.5">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm text-foreground">{(item.views || 0).toLocaleString()}</span>
                      </div>

                      <div className="hidden md:block md:col-span-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                          </div>
                          <span className="font-semibold text-foreground">{score}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
            }
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <button onClick={() => navigate("/search")} className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
            View Full Rankings
          </button>
        </div>
      </div>
    </section>
  );
}
