import { useNavigate } from "react-router-dom";
import { Package, Stethoscope, Sparkles, ArrowRight } from "lucide-react";

const sellerTypes = [
  {
    icon: Package,
    title: "List & Service Products",
    description: "Brands & manufacturers can list supplements, beauty products & devices",
    features: ["No upfront costs", "15% commission on sales", "Full control"],
    cta: "Start Selling",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Stethoscope,
    title: "Earn Affiliates",
    description: "Join our affiliate program and earn commissions on every referral",
    features: ["Up to 20% commission", "Real-time dashboard", "Exclusive codes"],
    cta: "Apply Now",
    gradient: "from-sage/20 to-sage/5",
  },
  {
    icon: Sparkles,
    title: "Influencer Deals",
    description: "Content creators earn from promoting verified products",
    features: ["Brand matching", "Referral commissions", "Campaigns"],
    cta: "Join Program",
    gradient: "from-accent/20 to-accent/5",
  },
];

// Stats removed - replaced by affiliate banner

export function SellerSection() {
  const navigate = useNavigate();

  const handleCtaClick = (title: string) => {
    if (title === "List & Service Products") {
      navigate("/list-product");
    } else if (title === "Earn Affiliates") {
      navigate("/earn-affiliate");
    } else if (title === "Influencer Deals") {
      navigate("/apply-influencer");
    }
  };

  return (
    <section className="py-6 md:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-16">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-medium mb-2 md:mb-4">
            Join the Longevity Marketplace
          </span>
          <h2 className="text-xl md:text-4xl text-foreground mb-2 md:mb-3">
            Your Platform. Your Revenue.
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-2xl mx-auto">
            Join the marketplace connecting millions to better health
          </p>
        </div>

        {/* Seller Types - Horizontal scroll on mobile */}
        <div 
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sellerTypes.map((type) => (
            <div 
              key={type.title}
              className={`snap-start shrink-0 w-[260px] md:w-full group flex flex-col p-4 md:p-6 bg-gradient-to-br ${type.gradient} rounded-2xl border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/20 transition-all duration-300`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-card rounded-xl mb-3 md:mb-4 shadow-soft">
                <type.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                {type.title}
              </h3>
              
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 flex-1 line-clamp-2">
                {type.description}
              </p>

              <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs md:text-sm text-foreground">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCtaClick(type.title)}
                className="w-full flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors group-hover:shadow-soft"
              >
                {type.cta}
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-[10px] md:text-sm text-muted-foreground mt-5 md:mt-12">
          All sellers verified. Products meet our quality standards.
        </p>
      </div>
    </section>
  );
}