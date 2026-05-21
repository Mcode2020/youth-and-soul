import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { telehealthPrograms } from "@/data/telehealthPrograms";

export function MonthlyProgramSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-2 pb-10 md:py-24 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Health Programs
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 md:mb-4 tracking-tight">
            Ready to make a real change?
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill out the forms, connect with a doctor today, and start your personalized treatment.
          </p>
        </div>

        {/* Program Cards - DESKTOP ONLY (mobile cards are in HealthProgramsCTA) */}
        {/* Flex wrap so any orphan card on the last row stays centered */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 md:gap-6 mb-10 md:mb-16">
          {(() => {
            const filtered = telehealthPrograms.filter((p) => p.slug !== "gut-health");
            const desiredOrder = ["weight-loss", "menopause-hrt", "sexual-health", "hot-health", "skin-hair"];
            const ordered = [
              ...desiredOrder
                .map((s) => filtered.find((p) => p.slug === s))
                .filter(Boolean) as typeof filtered,
              ...filtered.filter((p) => !desiredOrder.includes(p.slug)),
            ];
            return ordered;
          })().map((program) => {
            const lowestPrice = Math.min(...program.tiers.map((t) => t.price));
            return (
              <div
                key={program.slug}
                className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                onClick={() => navigate(program.slug === "weight-loss" ? "/weightloss-glp-intake" : `/programs/${program.slug}`)}
              >
                {/* Image */}
                <div className={`relative h-44 md:h-52 bg-gradient-to-br ${program.color} overflow-hidden`}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={600}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {program.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-accent-foreground text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wide">
                      {program.badge}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-base md:text-lg font-bold text-white mb-0.5">{program.title}</h3>
                    <p className="text-white/80 text-xs md:text-sm line-clamp-1">{program.subtitle}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 md:p-5">
                  <p className="text-lg md:text-xl font-bold text-primary mb-2">From ${lowestPrice}/mo</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {program.tiers.map((t) => (
                      <span key={t.label} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] md:text-xs rounded-full font-medium">
                        {t.label}: {t.priceLabel}
                      </span>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                    {program.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: simple list since cards are already shown above */}
        <div className="md:hidden text-center">
          <button
            onClick={() => navigate("/programs")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
