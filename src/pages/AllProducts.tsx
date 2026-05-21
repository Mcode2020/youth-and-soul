import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, SlidersHorizontal } from "lucide-react";
import { AISearchBar } from "@/components/ui/AISearchBar";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { ProductPagination } from "@/components/ui/ProductPagination";
import { useProducts } from "@/hooks/useProducts";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSEOHead } from "@/hooks/useSEOHead";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  "All",
  "Anti-Aging",
  "General Wellness",
  "Cellular Health",
];

const sortOptions = [
  { label: "Best Selling", value: "sales_count" as const, ascending: false },
  { label: "Most Viewed", value: "views" as const, ascending: false },
  { label: "Price: Low to High", value: "price" as const, ascending: true },
  { label: "Price: High to Low", value: "price" as const, ascending: false },
  { label: "Newest", value: "created_at" as const, ascending: false },
];

interface AllProductsProps {
  title: string;
  defaultOrderBy?: "sales_count" | "views" | "price" | "created_at";
}

export default function AllProducts({ title, defaultOrderBy = "sales_count" }: AllProductsProps) {
  const navigate = useNavigate();
  useSEOHead({
    title: `${title} — Browse Health & Longevity Products`,
    description: `Browse ${title.toLowerCase()} on Youth & Soul. Discover top-rated supplements, peptides, skincare, and longevity products with exclusive discount codes.`,
    path: defaultOrderBy === "views" ? "/products/featured" : "/products/top-rated",
    keywords: "best health supplements, longevity products, top rated supplements, anti-aging products, peptides, skincare",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      url: `https://youthandsoul.com${defaultOrderBy === "views" ? "/products/featured" : "/products/top-rated"}`,
      isPartOf: { "@id": "https://youthandsoul.com/#website" },
    },
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortIndex, setSortIndex] = useState(
    defaultOrderBy === "views" ? 1 : 0
  );

  const sort = sortOptions[sortIndex];
  const { products, loading, page, setPage, totalPages, totalCount } = useProducts({
    category: activeCategory,
    perPage: 24,
    orderBy: sort.value,
    ascending: sort.ascending,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: title }]} />
      {/* Top Banner with AI Search */}
      <div className="bg-gradient-to-b from-primary/10 via-accent/5 to-background px-4 pt-4 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 md:hidden">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg md:text-3xl text-foreground">{title}</h1>
              <span className="text-xs md:text-sm text-muted-foreground">({totalCount} products)</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-3">
            Ask our AI to find the perfect products for your goals
          </p>
          <AISearchBar onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Filters Row */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeCategory === "All" ? "Category" : activeCategory}
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 min-w-[160px]">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={cn(
                    "cursor-pointer",
                    activeCategory === cat && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
              {sort.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 min-w-[180px]">
              {sortOptions.map((opt, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => { setSortIndex(i); setPage(1); }}
                  className={cn(
                    "cursor-pointer",
                    sortIndex === i && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category Tabs (horizontal scroll on mobile) */}
        <div
          className="flex gap-0 mb-5 md:mb-8 overflow-x-auto scrollbar-hide border-b border-border/30"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={cn(
                "px-4 py-2.5 text-xs md:text-sm font-medium whitespace-nowrap transition-colors relative",
                activeCategory === cat ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 md:gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 24 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => (
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
                  discountCode={product.discount_code}
                  productUrl={product.product_url}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full"
                  showDiscountBanner
                />
              ))
          }
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}

        <ProductPagination page={page} totalPages={totalPages} onPageChange={setPage} totalCount={totalCount} />
      </main>

      <Footer />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
