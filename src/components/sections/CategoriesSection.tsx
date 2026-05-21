import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { ChevronRight, ChevronDown, SlidersHorizontal, Store } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useBrandDiscounts, getBrandDiscount } from "@/hooks/useBrandDiscounts";
import { ProductPagination } from "@/components/ui/ProductPagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfluencerSection } from "@/components/sections/InfluencerSection";
import { AdvertiserCTA } from "@/components/sections/AdvertiserCTA";

const categories = [
  "All", "Anti-Aging", "General Wellness", "Cellular Health", "Longevity",
  "Brain Health", "Recovery", "Weight Loss", "Sexual Health", "Hair Loss",
  "Devices", "NAD+", "Supplements",
];

const brandList = [
  "All Brands", "agemate", "alchimie-forever", "blueprint", "bodyalign", "currentbody", "donotage",
  "elle-sera", "goli", "healf", "jinfiniti", "Ketone", "natureslab", "noblepanacea", "nordic",
  "novoslabs", "nuskin", "skincaregenerics", "ubeauty", "wowmd",
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
];

const sortOptions = [
  { label: "Best Selling", value: "sales_count" as const, ascending: false },
  { label: "Most Viewed", value: "views" as const, ascending: false },
  { label: "Price: Low to High", value: "price" as const, ascending: true },
  { label: "Price: High to Low", value: "price" as const, ascending: false },
];

export function CategoriesSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [sortIndex, setSortIndex] = useState(0);
  const navigate = useNavigate();
  const sort = sortOptions[sortIndex];

  const { products, loading, page, setPage, totalPages, totalCount } = useProducts({
    category: activeCategory,
    perPage: 12,
    orderBy: sort.value,
    ascending: sort.ascending,
    brand: activeBrand !== "All Brands" ? activeBrand : undefined,
  });

  const { data: brandDiscounts = [] } = useBrandDiscounts();

  useEffect(() => {
    const handleSetCategory = (event: CustomEvent<{ category: string }>) => {
      if (categories.some(c => c === event.detail.category)) {
        setActiveCategory(event.detail.category);
      }
    };
    window.addEventListener('setCategoryFilter', handleSetCategory as EventListener);
    return () => window.removeEventListener('setCategoryFilter', handleSetCategory as EventListener);
  }, []);

  return (
    <section id="categories-section" className="py-6 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">The Longevity & Health Marketplace</h2>
          <p className="text-[10px] md:text-sm text-muted-foreground mt-1">Top-rated wellness products trusted by leading luxury and lifestyle brands.</p>
          <p className="text-[10px] md:text-sm text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
            Exclusive DISCOUNT CODES for anti-aging supplements, functional beauty treatments, longevity solutions & age-reversal experiences — no prescription needed.
            <br />
            Elevate your health. Enhance your confidence. Become the best version of yourself. NOW.
          </p>
        </div>

        {/* Promote Your Product CTA — sits above filters */}
        <div className="mb-6 md:mb-8">
          <AdvertiserCTA />
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeCategory === "All" ? "All" : activeCategory}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }} className={cn("cursor-pointer", activeCategory === cat && "bg-primary/10 text-primary font-medium")}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          <button onClick={() => { navigate("/search"); window.scrollTo(0, 0); }} className="ml-auto flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Browse by Goal Tabs */}
        <div
          className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-4 md:mb-6 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {goalTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveCategory(tab.value); setPage(1); }}
              className={cn(
                "snap-start shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                activeCategory === tab.value
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 md:gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => {
                const bd = getBrandDiscount(brandDiscounts, product.brand);
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.product_name}
                    brand={product.brand}
                    image={product.images?.[0] || "/placeholder.svg"}
                    price={product.price}
                    originalPrice={product.original_price ?? undefined}
                    rating={4.5 + (product.sales_count % 5) * 0.1}
                    reviewCount={product.views || Math.floor(Math.random() * 2000 + 100)}
                    discountCode={bd?.discount_code || product.discount_code}
                    discountPercent={bd?.discount_percent}
                    productUrl={product.product_url}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full"
                    showDiscountBanner
                  />
                );
              })
          }
        </div>

        <ProductPagination page={page} totalPages={totalPages} onPageChange={setPage} totalCount={totalCount} />

      </div>
    </section>
  );
}
