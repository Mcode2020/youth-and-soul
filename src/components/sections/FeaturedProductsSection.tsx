import { useState } from "react";
import { Star, TrendingUp, ChevronRight, ChevronDown, Sparkles, Award, SlidersHorizontal, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductPagination } from "@/components/ui/ProductPagination";
import { cn } from "@/lib/utils";
import { getCategoryOrFilter } from "@/lib/categoryMapping";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfluencerSection } from "@/components/sections/InfluencerSection";

const getBadgeStyle = (index: number) => {
  if (index === 0) return "bg-gradient-to-r from-accent to-gold text-foreground";
  if (index < 3) return "bg-primary text-primary-foreground";
  return "bg-secondary text-secondary-foreground";
};

const getBadgeIcon = (index: number) => {
  if (index === 0) return Sparkles;
  if (index < 3) return Award;
  return TrendingUp;
};

const taglines = ["Best Seller", "Editor's Choice", "Science Backed", "Daily Essential", "Top Pick", "Fan Favorite", "Trending", "Must Have", "Staff Pick"];

export function FeaturedProductsSection() {
  const navigate = useNavigate();
  const categories = ["All", "Anti-Aging", "General Wellness", "Cellular Health", "Longevity", "Brain Health", "Recovery", "Weight Loss", "Sexual Health", "Hair Loss", "Devices", "Peptides", "NAD+", "Supplements"];
  const brandList = ["All Brands", "Goli", "wowMD", "Jinfiniti", "HEALF", "NuSkin", "Novos Labs", "Qualialife", "Renue By Science", "ProHealth", "DoNotAge", "Verso Skincare", "Currentbody"];
  const sortOptions = [
    { label: "Best Selling", value: "sales_count" as const, ascending: false },
    { label: "Most Viewed", value: "views" as const, ascending: false },
    { label: "Price: Low to High", value: "price" as const, ascending: true },
    { label: "Price: High to Low", value: "price" as const, ascending: false },
  ];
  const goalTabs = [
    { label: "All", value: "All" },
    { label: "Anti-Aging", value: "Anti-Aging" },
    { label: "General Wellness", value: "General Wellness" },
    { label: "Longevity", value: "Longevity" },
    { label: "Brain Health", value: "Brain Health" },
    { label: "Recovery", value: "Recovery" },
    { label: "Weight Loss", value: "Weight Loss" },
    { label: "Sexual Health", value: "Sexual Health" },
    { label: "Hair Loss", value: "Hair Loss" },
    { label: "Cellular Health", value: "Cellular Health" },
    { label: "Devices", value: "Devices" },
    { label: "Peptides", value: "Peptides" },
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [activeGoalTab, setActiveGoalTab] = useState("All");
  const [sortIndex, setSortIndex] = useState(0);
  const sort = sortOptions[sortIndex];
  
  // Use activeGoalTab for filtering (tabs take priority over dropdown)
  const filterCategory = activeGoalTab !== "All" ? activeGoalTab : activeCategory;
  const { products, loading, page, setPage, totalPages, totalCount } = useProducts({ 
    category: filterCategory, 
    perPage: 12, 
    orderBy: sort.value, 
    ascending: sort.ascending,
    brand: activeBrand !== "All Brands" ? activeBrand : undefined,
  });

  return (
    <section className="py-6 md:py-16 bg-gradient-to-r from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-foreground">Featured Products</h2>
              <p className="text-[10px] md:text-sm text-muted-foreground">Promoted by top brands</p>
            </div>
          </div>
          <button onClick={() => { navigate("/search"); window.scrollTo(0, 0); }} className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <span className="hidden sm:inline">View all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeCategory === "All" ? "All" : activeCategory}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => { setActiveCategory(cat); setActiveGoalTab(cat === "All" ? "All" : cat); setPage(1); }} className={cn("cursor-pointer", activeCategory === cat && "bg-primary/10 text-primary font-medium")}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Brand Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              <Store className="w-3.5 h-3.5" />
              {activeBrand}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 max-h-64 overflow-y-auto">
              {brandList.map((brand) => (
                <DropdownMenuItem key={brand} onClick={() => { setActiveBrand(brand); setPage(1); }} className={cn("cursor-pointer", activeBrand === brand && "bg-primary/10 text-primary font-medium")}>
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              {sort.label}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50">
              {sortOptions.map((opt, i) => (
                <DropdownMenuItem key={i} onClick={() => { setSortIndex(i); setPage(1); }} className={cn("cursor-pointer", sortIndex === i && "bg-primary/10 text-primary font-medium")}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Browse by Goal Tabs */}
        <div 
          className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-4 md:mb-6 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {goalTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveGoalTab(tab.value); setActiveCategory(tab.value === "All" ? "All" : tab.value); setPage(1); }}
              className={cn(
                "snap-start shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                activeGoalTab === tab.value
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Featured Products Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-2 md:p-5 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))
            : products.map((product, index) => {
                const BadgeIcon = getBadgeIcon(index);
                const tagline = taglines[index % taglines.length];
                return (
                  <button
                    key={product.id}
                    onClick={() => product.product_url ? window.open(product.product_url, "_blank", "noopener,noreferrer") : navigate(`/product/${product.id}`)}
                    className="group flex flex-col h-full bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden hover:shadow-medium hover:border-primary/50 hover:ring-1 hover:ring-primary/30 transition-all duration-300 text-left"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.product_name}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.querySelector('.placeholder-logo')?.classList.remove('hidden'); }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : null}
                      <div className={cn("absolute inset-0 flex items-center justify-center bg-muted/20 p-2", product.images?.[0] ? "hidden placeholder-logo" : "placeholder-logo")}>
                        <span className="text-sm sm:text-xl md:text-2xl font-serif font-bold select-none tracking-wider text-center leading-tight" style={{ color: '#d1d5db', textShadow: '0 0 8px rgba(255,255,255,0.9), 1px 1px 2px rgba(255,255,255,0.8)' }}>Youth&Soul</span>
                      </div>
                      {/* Discount pill top-left */}
                      {product.discount_code && (
                        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-10">
                          <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 bg-pink-100 text-pink-700 rounded-full text-[8px] md:text-[10px] font-bold tracking-wide shadow-sm">
                            {product.discount_code}
                          </span>
                        </div>
                      )}
                      {/* Badge top-left (only if no discount) */}
                      {!product.discount_code && (
                        <div className={`absolute top-1.5 left-1.5 md:top-2 md:left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] md:text-xs font-medium ${getBadgeStyle(index)}`}>
                          <BadgeIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                          <span className="hidden md:inline">{tagline}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-2 md:p-3">
                      <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5 truncate block">
                        {product.brand}
                      </span>
                      <h3 className="font-medium text-xs md:text-sm text-foreground mb-1 line-clamp-2 leading-tight">
                        {product.product_name}
                      </h3>
                      <div className="flex items-center gap-0.5 mb-1">
                        <span className="text-[11px] md:text-sm font-semibold text-foreground">
                          {(4.5 + (product.sales_count % 5) * 0.1).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 md:gap-2">
                        {product.price > 0 ? (
                          <>
                            <span className="font-semibold text-sm md:text-lg text-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.original_price && product.original_price > 0 && (
                              <span className="text-[10px] md:text-sm text-muted-foreground line-through">
                                ${product.original_price.toFixed(2)}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="font-semibold text-xs md:text-sm text-primary">View Price</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-primary px-2 py-2 md:px-3 md:py-2.5 flex items-center justify-center mt-auto">
                      <span className="text-[8px] md:text-xs font-bold text-primary-foreground whitespace-nowrap leading-none tracking-wide">
                        Discount: 20% / Code_Name
                      </span>
                    </div>
                  </button>
                );
              })
          }
        </div>

        <ProductPagination page={page} totalPages={totalPages} onPageChange={setPage} totalCount={totalCount} />

        {/* Influencer Section */}
        <InfluencerSection />
      </div>
    </section>
  );
}
