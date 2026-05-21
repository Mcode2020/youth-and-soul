import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { ProductPagination } from "@/components/ui/ProductPagination";
import { useBrandDiscounts, getBrandDiscount } from "@/hooks/useBrandDiscounts";

const peptideTabs = [
  { label: "Weight Loss", category: "weight loss peptides" },
  { label: "Recovery", category: "recovery peptides" },
  { label: "Hormonal", category: "hormonal peptides" },
  { label: "Brain Health", category: "brain health" },
  { label: "All", category: "All" },
];

// All peptide-specific categories for the "All" tab
const allPeptideCategories = ["weight loss peptides", "recovery peptides", "hormonal peptides"];

export function PeptidesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const tab = peptideTabs[activeTab];
  const isAll = tab.category === "All";

  const { products, loading, page, setPage, totalPages, totalCount } = useProducts({
    category: !isAll ? tab.category : undefined,
    categories: isAll ? allPeptideCategories : undefined,
    perPage: 9,
  });

  const { data: brandDiscounts = [] } = useBrandDiscounts();

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 mb-4">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-foreground">Peptides</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Powered by <a href="https://www.peptideslabs.us" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">PeptidesLabs.us <ExternalLink className="w-3 h-3" /></a>
            </p>
          </div>
          <button onClick={() => navigate("/search?category=Peptides")} className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div
          className="flex gap-0 px-4 mb-5 overflow-x-auto scrollbar-hide border-b border-border/30"
          style={{ scrollbarWidth: "none" }}
        >
          {peptideTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => { setActiveTab(i); setPage(1); }}
              className={cn(
                "px-4 py-2.5 text-xs md:text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === i ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t.label}
              {activeTab === i && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 md:grid-cols-4 lg:grid-cols-6 md:gap-4">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((peptide) => {
                const bd = getBrandDiscount(brandDiscounts, peptide.brand);
                return (
                  <ProductCard
                    key={peptide.id}
                    id={peptide.id}
                    name={peptide.product_name}
                    brand={peptide.brand}
                    image={peptide.images?.[0] || "/placeholder.svg"}
                    price={peptide.price}
                    originalPrice={peptide.original_price ?? undefined}
                    rating={4.5 + ((peptide.sales_count || 0) % 5) * 0.1}
                    reviewCount={peptide.views || Math.floor(Math.random() * 2000 + 100)}
                    discountCode={bd?.discount_code || peptide.discount_code}
                    discountPercent={bd?.discount_percent}
                    productUrl={peptide.product_url}
                    onClick={() => navigate(`/product/${peptide.id}`)}
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
