import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { ProductPagination } from "@/components/ui/ProductPagination";
import { AISearchBar } from "@/components/ui/AISearchBar";
import { useProducts } from "@/hooks/useProducts";
import { JoinHealthPlansCTA } from "@/components/sections/JoinHealthPlansCTA";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const goalMeta: Record<string, { title: string; subtitle: string; description: string; category: string }> = {
  "wrinkles-skin-aging": {
    title: "Wrinkles & Skin Aging",
    subtitle: "Turn Back the Clock on Your Skin",
    description: "Explore clinically-backed products targeting fine lines, wrinkles, and skin aging — from retinoids and peptides to collagen boosters and professional-grade serums.",
    category: "Anti-Aging",
  },
  "energy-vitality": {
    title: "Energy & Vitality",
    subtitle: "Fuel Your Body, Boost Your Day",
    description: "Discover supplements and protocols designed to restore natural energy, support mitochondrial health, and combat fatigue — without the crash.",
    category: "General Wellness",
  },
  "brain-focus": {
    title: "Brain & Focus",
    subtitle: "Sharpen Your Mind, Enhance Clarity",
    description: "Browse nootropics, adaptogens, and cognitive-support supplements that help improve memory, focus, and long-term brain health.",
    category: "Brain Health",
  },
  "hormonal-balance": {
    title: "Hormonal Balance",
    subtitle: "Restore Your Body's Natural Rhythm",
    description: "Find hormone-support products including HRT alternatives, adaptogens, and wellness protocols for men and women at every stage of life.",
    category: "General Wellness",
  },
  "recovery-inflammation": {
    title: "Recovery & Inflammation",
    subtitle: "Heal Faster, Move Better",
    description: "Shop recovery-focused products from topical pain creams and joint support to anti-inflammatory protocols backed by science.",
    category: "Recovery",
  },
  "longevity-basics": {
    title: "Longevity Basics",
    subtitle: "The Foundation of a Longer Life",
    description: "Start your longevity journey with foundational supplements like NAD+, Resveratrol, Metformin, and evidence-based anti-aging stacks.",
    category: "Longevity",
  },
  "weight-loss": {
    title: "Weight Loss & Metabolic Reset",
    subtitle: "Science-Backed Solutions for Lasting Results",
    description: "Explore GLP-1 peptides, Metformin, metabolic boosters, and doctor-guided weight loss programs designed for sustainable fat loss.",
    category: "Weight Loss",
  },
  "sexual-health": {
    title: "Libido & Sexual Health",
    subtitle: "Restore Confidence & Intimacy",
    description: "Browse ED treatments, Sildenafil, Tadalafil, libido support supplements, and intimacy-enhancing products for men and women.",
    category: "Sexual Health",
  },
  "pain-recovery": {
    title: "Pain & Recovery",
    subtitle: "Relief That Actually Works",
    description: "Find multi-compound topical creams, joint support, anti-inflammatory protocols, and recovery tools for chronic pain management.",
    category: "Recovery",
  },
  "menopause-hrt": {
    title: "Menopause & Hormonal Support",
    subtitle: "Navigate Change With Confidence",
    description: "Explore estrogen therapy, HRT programs, vaginal health treatments, and hormone-balancing supplements tailored for menopause.",
    category: "General Wellness",
  },
  "skin-hair": {
    title: "Skin, Hair & Anti-Aging",
    subtitle: "Look Your Best at Any Age",
    description: "Discover Minoxidil, Tretinoin, Finasteride, collagen peptides, and anti-aging stacks for radiant skin and fuller hair.",
    category: "Anti-Aging",
  },
  "nad-longevity": {
    title: "NAD+ & Longevity Protocols",
    subtitle: "Cellular Energy for a Longer Life",
    description: "Browse NAD+ supplements, Sermorelin, LDN, Methylene Blue, and cutting-edge longevity protocols backed by research.",
    category: "Longevity",
  },
};

const categoryTabs = ["All", "Anti-Aging", "General Wellness", "Cellular Health", "Brain Health", "Recovery", "Longevity"];

const sortOptions = [
  { label: "Best Selling", value: "sales_count" as const, ascending: false },
  { label: "Most Viewed", value: "views" as const, ascending: false },
  { label: "Price: Low to High", value: "price" as const, ascending: true },
  { label: "Price: High to Low", value: "price" as const, ascending: false },
];

export default function Goals() {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const meta = goalMeta[goalId || ""] || { title: "Goals", subtitle: "", description: "", category: "" };

  useSEOHead({
    title: `${meta.title} — ${meta.subtitle || "Health Goals"}`,
    description: meta.description || "Browse curated health, longevity and beauty products by goal on Youth & Soul.",
    path: `/goals/${goalId || ""}`,
    keywords: `${meta.title.toLowerCase()}, ${meta.category.toLowerCase()}, health goals, longevity, supplements, ${goalId}`,
  });

  useEffect(() => { window.scrollTo(0, 0); }, [goalId]);

  const [activeCategory, setActiveCategory] = useState(meta.category || "All");
  const [sortIndex, setSortIndex] = useState(0);

  const effectiveCategory = activeCategory === "All" ? meta.category : activeCategory;
  const { products, loading, totalCount } = useProducts({
    category: effectiveCategory,
    orderBy: sortOptions[sortIndex].value,
    ascending: sortOptions[sortIndex].ascending,
  });

  const handleSearch = (q: string) => {
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: meta.title }]} />

      {/* Hero header like Featured Products page */}
      <div className="bg-gradient-to-b from-primary/10 via-accent/5 to-background px-4 pt-2 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground">{meta.title}</h1>
              {meta.subtitle && (
                <p className="text-sm md:text-base text-primary font-medium mt-0.5">{meta.subtitle}</p>
              )}
              {meta.description && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">{meta.description}</p>
              )}
            </div>
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap mt-1">
              ({totalCount ?? products.length} products)
            </span>
          </div>

          <p className="text-center text-muted-foreground text-xs sm:text-sm mb-3 mt-4">
            Ask our AI to find the perfect products for your goals
          </p>
          <div className="max-w-2xl mx-auto">
            <AISearchBar onSearch={handleSearch} />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                {activeCategory === "All" ? meta.category : activeCategory}
                <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categoryTabs.map((cat) => (
                  <DropdownMenuItem key={cat} onClick={() => setActiveCategory(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium">
                {sortOptions[sortIndex].label}
                <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortOptions.map((opt, i) => (
                  <DropdownMenuItem key={i} onClick={() => setSortIndex(i)}>
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border-b-2",
                  (activeCategory === cat || (activeCategory === "All" && cat === "All"))
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.product_name}
                brand={p.brand}
                image={p.images?.[0] || ""}
                price={p.price}
                originalPrice={p.original_price ?? undefined}
                rating={4.5}
                reviewCount={p.views || 0}
                discountCode={p.discount_code}
                productUrl={p.product_url}
                onClick={() => navigate(`/product/${p.id}`)}
                showDiscountBanner
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products found for this goal yet.</p>
          </div>
        )}
      </main>
      <JoinHealthPlansCTA />
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
