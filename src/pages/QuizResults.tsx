import { useParams, useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { ChevronRight, ArrowRight } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { JoinHealthPlansCTA } from "@/components/sections/JoinHealthPlansCTA";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";

const areaConfig: Record<string, { title: string; subtitle: string; categories?: string[]; goal?: string; searchQuery: string }> = {
  "weight-loss": {
    title: "Weight Loss Solutions",
    subtitle: "GLP-1 peptides, body contouring, and proven weight-loss products.",
    categories: ["weight loss peptides", "General Wellness"],
    searchQuery: "weight+loss+peptides",
  },
  "longevity": {
    title: "Longevity & Vitality",
    subtitle: "NAD+, NMN, Resveratrol, and performance-enhancing treatments.",
    categories: ["longevity", "NAD+ longevity", "Longevity / Heart Health", "Anti-Aging"],
    searchQuery: "longevity",
  },
  "anti-aging": {
    title: "Anti-Aging & Skin",
    subtitle: "Treatments for wrinkles, elasticity, and total skin rejuvenation.",
    categories: ["Anti-Aging", "Wrinkles skincare", "Wrinkles / Skin Care", "Wrinkles", "Anti Aging / Wrinkles", "Anti aging"],
    searchQuery: "anti-aging",
  },
  "std-cures": {
    title: "STD Treatments",
    subtitle: "Discreet, doctor-prescribed treatments for common STDs.",
    categories: ["General Wellness"],
    searchQuery: "STD",
  },
  "brain-activity": {
    title: "Brain & Focus",
    subtitle: "Nootropics, focus enhancers, and cognitive performance support.",
    categories: ["Brain and Focus", "brain health"],
    searchQuery: "brain+focus",
  },
  "energy": {
    title: "Energy & Stamina",
    subtitle: "Boost stamina, reduce fatigue, and optimize daily energy levels.",
    categories: ["Energy and Vitality", "General Wellness", "Daily wellness trio bundle - energy vitality"],
    searchQuery: "energy",
  },
  "skincare": {
    title: "Skincare & Wrinkles",
    subtitle: "Medical-grade skincare for fine lines, texture, and glow.",
    categories: ["Wrinkles skincare", "Wrinkles / Skin Care", "Wrinkles", "Body Skin Care", "Skin Care / Discoloration", "Skin Care / Sun Care", "Funcitonal Beauty - Eyes"],
    searchQuery: "skincare",
  },
  "pain-relief": {
    title: "Pain Relief & Recovery",
    subtitle: "Targeted solutions for chronic pain, inflammation, and recovery.",
    categories: ["recovery peptides", "General Wellness"],
    searchQuery: "pain+relief",
  },
};

export default function QuizResults() {
  const { area } = useParams();
  const navigate = useNavigate();
  const config = areaConfig[area || ""] || areaConfig["weight-loss"];

  useSEOHead({
    title: `${config.title} — Your Personalized Recommendations`,
    description: `${config.subtitle} Personalized product matches from Youth & Soul based on your health quiz answers.`,
    path: `/quiz-results/${area || ""}`,
    keywords: `${config.title.toLowerCase()}, personalized recommendations, ${area}, supplements, telehealth`,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { products, loading } = useProducts({
    categories: config.categories,
    goal: config.goal,
    perPage: 12,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 text-center">
          <p className="text-sm font-medium text-primary mb-2">Your personalised results</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{config.title}</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">{config.subtitle}</p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Recommended for You</h2>
          <button onClick={() => navigate(`/search?q=${config.searchQuery}`)} className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.product_name}
                  brand={product.brand}
                  image={product.images?.[0] || ""}
                  price={product.price}
                  originalPrice={product.original_price ?? undefined}
                  rating={4.5 + ((product.sales_count || 0) % 5) * 0.1}
                  reviewCount={product.views || 100}
                  discountCode={product.discount_code}
                  productUrl={product.product_url}
                  onClick={() => navigate(`/product/${product.id}`)}
                  showDiscountBanner
                />
              ))
          }
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found for this category yet.</p>
            <button onClick={() => navigate("/search")} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Not what you're looking for?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Retake the quiz or browse our full marketplace.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(`/health-quiz/${area}`)} className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-xl font-medium text-sm hover:bg-secondary transition-colors">
            Retake Quiz
          </button>
          <button onClick={() => navigate("/search")} className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <JoinHealthPlansCTA />
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
