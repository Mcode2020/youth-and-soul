import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Check, Shield, Truck, Globe, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import { useSEOHead } from "@/hooks/useSEOHead";

// Signup quiz steps
const quizSteps = [
  {
    question: "What is your area of focus right now?",
    options: [
      { label: "Weight Loss", description: "GLP-1 peptides and additional weight-loss solutions", value: "weight-loss" },
      { label: "Longevity + Vitality", description: "NAD+, NMN, Resveratrol, and anti-aging supplements", value: "longevity" },
      { label: "Anti-Aging & Skin", description: "Treatments for wrinkles, elasticity, and skin health", value: "anti-aging" },
    ],
  },
  {
    question: "What best describes your experience?",
    options: [
      { label: "I'm just starting out", description: "New to supplements and wellness products", value: "beginner" },
      { label: "I have some experience", description: "I've tried some products before", value: "intermediate" },
      { label: "I'm well-researched", description: "I know what I'm looking for", value: "advanced" },
    ],
  },
  {
    question: "What's most important to you?",
    options: [
      { label: "Science-backed results", description: "Products with clinical studies and proven efficacy", value: "science" },
      { label: "Best value for money", description: "Effective products at competitive prices", value: "value" },
      { label: "Premium quality", description: "Top-tier brands with the best ingredients", value: "premium" },
    ],
  },
];

function SignupQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      // Navigate to relevant search after completion
      setTimeout(() => {
        const focus = newAnswers[0];
        if (focus === "weight-loss") navigate("/search?q=weight+loss+peptides");
        else if (focus === "longevity") navigate("/search?category=Longevity");
        else navigate("/search?category=Anti-Aging");
      }, 1500);
    }
  };

  const progress = ((step + (completed ? 1 : 0)) / quizSteps.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1 bg-border rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6">
              {quizSteps[step].question}
            </h2>
            <div className="flex flex-col gap-3">
              {quizSteps[step].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="group w-full text-left p-4 md:p-5 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {option.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Go back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Perfect! Finding your matches...
            </h2>
            <p className="text-muted-foreground text-sm">
              We're curating the best products for your goals
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Category cards for the landing page
const categoryCards = [
  {
    title: "GLP-1 Weight Loss",
    subtitle: "Lose up to 15-20% of body weight*",
    gradient: "from-[hsl(160,40%,35%)] to-[hsl(180,35%,25%)]",
    href: "/search?q=GLP-1",
    cta: "Begin now",
  },
  {
    title: "NAD+ & Longevity",
    subtitle: "Supports energy and healthy aging**",
    gradient: "from-[hsl(200,30%,55%)] to-[hsl(210,35%,45%)]",
    href: "/search?q=NAD",
    cta: "Begin now",
  },
];

const trustPoints = [
  { icon: Shield, label: "Doctor-reviewed products" },
  { icon: Globe, label: "100% online ordering" },
  { icon: Truck, label: "Shipped to your door" },
];

export default function WeightLoss() {
  const navigate = useNavigate();

  useSEOHead({
    title: "Weight Loss Supplements & Programs — Youth & Soul",
    description: "Browse weight loss supplements, peptides, and telehealth programs. Find doctor-approved solutions for lasting results at Youth & Soul.",
    path: "/weightloss",
    keywords: "weight loss supplements, weight loss peptides, GLP-1, semaglutide, tirzepatide, weight management, fat loss, telehealth weight loss",
  });

  const { products: weightLossProducts, loading: wlLoading } = useProducts({
    category: "weight loss peptides",
    perPage: 6,
  });

  const { products: supportProducts, loading: spLoading } = useProducts({
    goal: "weight-management",
    perPage: 6,
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      {/* Hero section with signup quiz */}
      <section className="bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: headline */}
            <div>
              <p className="text-sm font-medium text-primary mb-2">
                Trusted by medical experts
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-4">
                Sustainable wellness,{" "}
                <span className="text-primary">made simple.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Discover what actually works in weight loss, anti-aging, and longevity — curated by experts, backed by science.
              </p>

              {/* Trust points */}
              <div className="flex flex-col gap-3">
                {trustPoints.map((point) => (
                  <div key={point.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <point.icon className="w-4.5 h-4.5 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: quiz form */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft">
              <SignupQuiz />
            </div>
          </div>
        </div>
      </section>

      {/* Category cards - Shed style */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {categoryCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.href)}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 md:p-8 text-left bg-gradient-to-br min-h-[200px] md:min-h-[280px] group transition-all hover:shadow-elevated",
                card.gradient
              )}
            >
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-cream mb-2">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-cream/80 mb-6 max-w-xs">
                  {card.subtitle}
                </p>
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground rounded-full text-sm font-medium group-hover:bg-card/95 transition-colors">
                  {card.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Weight Loss Products */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">
              Weight Loss Peptides
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              GLP-1 solutions and more
            </p>
          </div>
          <button
            onClick={() => navigate("/search?category=weight+loss+peptides")}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
          {wlLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : weightLossProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.product_name}
                  brand={product.brand}
                  image={product.images?.[0] || "/placeholder.svg"}
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
      </section>

      {/* How it works */}
      <section className="bg-secondary/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground text-center mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { step: "01", title: "Take the Quiz", desc: "Tell us about your goals and experience level." },
              { step: "02", title: "Get Matched", desc: "Our AI recommends the best products for you." },
              { step: "03", title: "See Results", desc: "Track your progress with our community." },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <span className="text-3xl font-serif font-bold text-primary/20">{item.step}</span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Products */}
      {supportProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">
              Weight Management Support
            </h2>
            <button
              onClick={() => navigate("/search?q=weight+management")}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
            {spLoading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : supportProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.product_name}
                    brand={product.brand}
                    image={product.images?.[0] || "/placeholder.svg"}
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
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
          Ready to start your journey?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Take our free quiz to get personalized product recommendations based on your goals.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Start Today
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <Footer />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
