import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { ProductPagination } from "@/components/ui/ProductPagination";
import { AISearchBar } from "@/components/ui/AISearchBar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JoinHealthPlansCTA } from "@/components/sections/JoinHealthPlansCTA";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryOrFilter } from "@/lib/categoryMapping";
import { useSEOHead } from "@/hooks/useSEOHead";
import { useBrandDiscounts, getBrandDiscount } from "@/hooks/useBrandDiscounts";
import { Sparkles, Loader2, SlidersHorizontal, ChevronDown, Store } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductResult {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  images: string[] | null;
  views: number;
  sales_count: number;
  discount_code: string | null;
  product_url: string | null;
}

interface AIAnswer {
  answer: string;
  relatedTopics?: string[];
  productSuggestions?: { name: string; category: string }[];
}

const categoryTabs = ["All", "Anti-Aging", "General Wellness", "Longevity", "Brain Health", "Recovery", "Weight Loss", "Sexual Health", "Hair Loss", "Cellular Health", "Devices", "Peptides"];

const brandList = [
  "All Brands", "agemate", "alchimie-forever", "blueprint", "bodyalign", "currentbody", "donotage",
  "elle-sera", "goli", "healf", "jinfiniti", "Ketone", "natureslab", "noblepanacea", "nordic",
  "novoslabs", "nuskin", "originalpeptide", "peptidelabs", "peptipure", "qualialife",
  "renuebyscience", "skincaregenerics", "ubeauty", "wowmd",
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

const sortOptions = [
  { label: "Best Selling", value: "sales_count", ascending: false },
  { label: "Most Viewed", value: "views", ascending: false },
  { label: "Price: Low to High", value: "price", ascending: true },
  { label: "Price: High to Low", value: "price", ascending: false },
];

const perPage = 30;

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read all filter state from URL params
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlBrand = searchParams.get("brand") || "All Brands";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlSort = parseInt(searchParams.get("sort") || "0", 10);

  const [products, setProducts] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [aiAnswer, setAiAnswer] = useState<AIAnswer | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const sort = sortOptions[urlSort] || sortOptions[0];
  const totalPages = Math.ceil(totalCount / perPage);
  const { data: brandDiscounts = [] } = useBrandDiscounts();

  // SEO meta tags based on current filters
  const seoTitle = urlCategory !== "All"
    ? `${urlCategory} Products — Page ${urlPage} | Youth & Soul`
    : urlQuery
      ? `Search: ${urlQuery} — Page ${urlPage} | Youth & Soul`
      : `Browse All Health & Longevity Products — Page ${urlPage} | Youth & Soul`;

  const seoDesc = urlCategory !== "All"
    ? `Browse top-rated ${urlCategory} products with exclusive discount codes. Page ${urlPage} of ${totalPages || 1}.`
    : `Search ${totalCount}+ anti-aging supplements, peptides, and longevity products with exclusive discount codes.`;

  useSEOHead({
    title: seoTitle,
    description: seoDesc,
    path: `/search${window.location.search}`,
    keywords: `${urlCategory !== "All" ? urlCategory + ", " : ""}longevity products, health supplements, discount codes`,
  });

  // Helper to update URL params
  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "All" || value === "All Brands" || value === "0" || value === "1" && key === "page") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    }
    setSearchParams(newParams, { replace: true });
    window.scrollTo(0, 0);
  };

  const fixImages = (data: any[]) =>
    data.map((p: any) => ({
      ...p,
      images: p.images?.flatMap((img: string) => {
        const urls = img.includes(', http') ? img.split(', ').map((u: string) => u.trim()) : [img];
        return urls.map((url: string) => {
          if (url.includes('healf.com/_next/image')) {
            try { const u = new URL(url).searchParams.get('url'); if (u) return u; } catch {}
            const match = url.match(/url=([^&]+)/);
            if (match) return decodeURIComponent(match[1]);
          }
          return url;
        });
      }) || null,
    }));

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let countQuery = supabase.from("seller_products").select("*", { count: "exact", head: true }).eq("status", "approved");
      let dataQuery = supabase.from("seller_products")
        .select("id, product_name, brand, category, price, original_price, images, views, sales_count, discount_code, product_url")
        .eq("status", "approved")
        .order(sort.value, { ascending: sort.ascending });

      if (urlQuery.trim()) {
        const search = `%${urlQuery.trim()}%`;
        const orFilter = `product_name.ilike.${search},brand.ilike.${search},category.ilike.${search},description.ilike.${search}`;
        countQuery = countQuery.or(orFilter);
        dataQuery = dataQuery.or(orFilter);
      }

      if (urlCategory !== "All") {
        const orFilter = getCategoryOrFilter(urlCategory);
        if (orFilter) {
          countQuery = countQuery.or(orFilter);
          dataQuery = dataQuery.or(orFilter);
        } else {
          countQuery = countQuery.ilike("category", `%${urlCategory}%`);
          dataQuery = dataQuery.ilike("category", `%${urlCategory}%`);
        }
      }

      if (urlBrand !== "All Brands") {
        countQuery = countQuery.ilike("brand", `%${urlBrand}%`);
        dataQuery = dataQuery.ilike("brand", `%${urlBrand}%`);
      }

      const from = (urlPage - 1) * perPage;
      dataQuery = dataQuery.range(from, from + perPage - 1);

      const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery]);
      if (error) throw error;

      setProducts(fixImages(data || []) as ProductResult[]);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIAnswer = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-search", { body: { query: searchQuery.trim() } });
      if (!error && data && !data.error) setAiAnswer(data as AIAnswer);
    } catch (err) { console.error("AI answer error:", err); }
    finally { setAiLoading(false); }
  };

  // Fetch products whenever URL params change
  useEffect(() => {
    fetchProducts();
    if (urlQuery.trim()) fetchAIAnswer(urlQuery);
    window.scrollTo(0, 0);
  }, [urlQuery, urlCategory, urlBrand, urlPage, urlSort]);

  const handleSearch = (q: string) => {
    if (q.trim()) updateParams({ q: q.trim(), page: "1" });
  };

  const handlePageChange = (p: number) => {
    updateParams({ page: String(p) });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <MobileHeader />

      <Breadcrumbs items={[{
        label: urlCategory !== "All" ? urlCategory : urlQuery ? `Search: ${urlQuery}` : "Search"
      }]} />

      {/* Top Banner with AI Search — solid white on mobile, subtle gradient on desktop */}
      <div className="bg-background md:bg-gradient-to-b md:from-primary/10 md:via-accent/5 md:to-background px-4 pt-2 pb-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-3">
            Ask our AI to find the perfect products for your goals
          </p>
          <AISearchBar onSearch={handleSearch} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* AI Answer */}
        {(aiLoading || aiAnswer) && urlQuery && (
          <div className="mb-6 p-4 sm:p-6 bg-card rounded-2xl border border-primary/20 shadow-soft">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">AI Answer</h2>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Researching your question...</span>
              </div>
            ) : aiAnswer ? (
              <div>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  <ReactMarkdown>{aiAnswer.answer}</ReactMarkdown>
                </div>
                {aiAnswer.relatedTopics && aiAnswer.relatedTopics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Related searches</p>
                    <div className="flex flex-wrap gap-2">
                      {aiAnswer.relatedTopics.map((topic, i) => (
                        <button key={i} onClick={() => handleSearch(topic)} className="px-3 py-1.5 text-xs bg-secondary rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors">
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Discount Alert */}
        <div className="mb-5 p-4 bg-gradient-to-r from-pink-50 to-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-lg">🏷️</span>
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-sm font-bold text-foreground">Save on every product!</p>
            <p className="text-xs text-muted-foreground">Use the discount code shown on each product at checkout.</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shrink-0">
            <span className="text-xs text-muted-foreground">Example:</span>
            <span className="text-sm font-bold text-primary tracking-wide">Code_Name</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {urlCategory === "All" ? "All" : urlCategory}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 max-h-64 overflow-y-auto">
              {categoryTabs.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => updateParams({ category: cat, page: "1" })} className={cn("cursor-pointer", urlCategory === cat && "bg-primary/10 text-primary font-medium")}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium bg-card border border-border rounded-full hover:bg-secondary transition-colors">
              <Store className="w-3.5 h-3.5" />
              {urlBrand}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-border z-50 max-h-64 overflow-y-auto">
              {brandList.map((b) => (
                <DropdownMenuItem key={b} onClick={() => updateParams({ brand: b, page: "1" })} className={cn("cursor-pointer", urlBrand === b && "bg-primary/10 text-primary font-medium")}>
                  {b}
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
                <DropdownMenuItem key={i} onClick={() => updateParams({ sort: String(i), page: "1" })} className={cn("cursor-pointer", urlSort === i && "bg-primary/10 text-primary font-medium")}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Goal Tabs */}
        <div
          className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-4 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {goalTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateParams({ category: tab.value, page: "1" })}
              className={cn(
                "snap-start shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                urlCategory === tab.value
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {urlQuery && <span>Results for "<strong>{urlQuery}</strong>" — </span>}
          {urlCategory !== "All" && <span>{urlCategory} — </span>}
          {urlBrand !== "All Brands" && <span>{urlBrand} — </span>}
          {totalCount} products found
          {urlPage > 1 && <span> — Page {urlPage}</span>}
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
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
                    image={product.images?.[0] || ""}
                    price={product.price}
                    originalPrice={product.original_price ?? undefined}
                    rating={4.5 + (product.sales_count % 5) * 0.1}
                    reviewCount={product.views || 100}
                    discountCode={bd?.discount_code || product.discount_code}
                    discountPercent={bd?.discount_percent}
                    productUrl={product.product_url}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="min-w-0"
                    showDiscountBanner
                  />
                );
              })
          }
        </div>

        {totalPages > 1 && (
          <ProductPagination page={urlPage} totalPages={totalPages} onPageChange={handlePageChange} totalCount={totalCount} />
        )}

        {/* No results */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-bold text-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
            <button onClick={() => updateParams({ q: "", category: "All", brand: "All Brands", page: "1", sort: "0" })} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              Browse All Products
            </button>
          </div>
        )}
      </main>

      <JoinHealthPlansCTA />
      <Footer />
    </div>
  );
}
