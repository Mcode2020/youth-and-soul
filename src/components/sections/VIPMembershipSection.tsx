import { Crown, Check, Sparkles, Gift, Phone, Tag, ArrowRight, Star } from "lucide-react";

const vipBenefits = [
  {
    icon: Tag,
    title: "20% Off Everything",
    description: "Exclusive member discount on all products",
  },
  {
    icon: Sparkles,
    title: "Early Access",
    description: "Shop new launches 48 hours before anyone else",
  },
  {
    icon: Phone,
    title: "2 Free Consultations",
    description: "Monthly expert calls worth $50 included",
  },
  {
    icon: Gift,
    title: "Member-Only Deals",
    description: "Flash sales and bundles just for VIPs",
  },
];

const plans = [
  {
    name: "Monthly",
    price: 19.99,
    period: "/month",
    popular: false,
    savings: null,
  },
  {
    name: "Annual",
    price: 149.99,
    period: "/year",
    popular: true,
    savings: "Save $90",
  },
];

export function VIPMembershipSection() {
  return (
    <section className="py-6 md:py-20 bg-gradient-to-br from-accent/10 via-background to-primary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-accent/20 rounded-full mb-3 md:mb-4">
            <Crown className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
            <span className="text-xs md:text-sm font-semibold text-accent-foreground">VIP Membership</span>
          </div>
          <h2 className="text-xl md:text-4xl text-foreground mb-2 md:mb-3">
            Unlock Exclusive Benefits
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-xl mx-auto">
            Join our VIP program for members-only discounts, early access, and free consultations
          </p>
        </div>

        {/* Benefits Grid - Horizontal scroll on mobile */}
        <div 
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 mb-6 md:mb-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {vipBenefits.map((benefit) => (
            <div 
              key={benefit.title}
              className="snap-start shrink-0 w-[180px] md:w-full flex flex-col items-center text-center p-4 md:p-6 bg-card rounded-xl md:rounded-2xl border border-accent/20 shadow-soft"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-accent/20 rounded-xl mb-3">
                <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold text-sm md:text-base text-foreground mb-1">{benefit.title}</h4>
              <p className="text-[10px] md:text-sm text-muted-foreground line-clamp-2">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex-1 relative p-5 md:p-6 rounded-2xl border-2 transition-all ${
                plan.popular 
                  ? "bg-card border-primary shadow-medium" 
                  : "bg-card/50 border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg md:text-xl text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                {plan.savings && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {plan.savings}
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-5">
                {["20% off all products", "Early access (48hrs)", "2 free consultations/mo", "Exclusive deals"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs md:text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Join VIP
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-6 md:mt-10 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">2,847</span> members saving an average of <span className="font-semibold text-primary">$340/year</span>
          </p>
        </div>
      </div>
    </section>
  );
}