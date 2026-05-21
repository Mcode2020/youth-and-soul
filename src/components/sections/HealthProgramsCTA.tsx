import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Globe, Truck, BadgeCheck } from "lucide-react";
import { telehealthPrograms } from "@/data/telehealthPrograms";

// Primary focus areas shown as full buttons
const primaryFocusAreas = [
  {
    title: "Weight Loss",
    description: "GLP-1 peptides, Metformin & proven solutions.",
    programSlug: "weight-loss",
  },
  {
    title: "Menopause & HRT",
    description: "Estrogen therapy, HRT & vaginal health.",
    programSlug: "menopause-hrt",
  },
  {
    title: "Hot Health: Looks & Beauty",
    description: "Microdose GLP-1, anti-aging, regenerative skin, hair care.",
    programSlug: "hot-health",
  },
  {
    title: "Libido & Sexual Health",
    description: "ED treatments, Sildenafil & intimacy support.",
    programSlug: "sexual-health",
  },
  {
    title: "Longevity & Vitality",
    description: "NAD+, Sermorelin, LDN & Methylene Blue.",
    programSlug: "longevity",
  },
];

// Secondary focus areas shown as small tag pills
const secondaryFocusAreas = [
  { title: "Skin & Hair", programSlug: "skin-hair" },
  { title: "Pain & Recovery", programSlug: "pain-recovery" },
  { title: "Brain & Cognitive", programSlug: "brain-cognitive" },
  { title: "Gut Health", programSlug: "gut-health" },
  { title: "Mental Health", programSlug: "mental-health" },
];

const trustPoints = [
  { icon: Truck, label: "Free, discreet, fast shipping" },
  { icon: Globe, label: "Quick & easy prescriptions included" },
  { icon: BadgeCheck, label: "No memberships or hidden costs" },
];

export function HealthProgramsCTA() {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: White background - CTA content */}
        <div className="lg:w-1/2 bg-background pt-8 pb-2 md:py-24 px-4 order-1 lg:order-1">
          <div className="max-w-xl ml-auto mr-4 lg:mr-10">
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide">
              Trusted by medical experts
            </span>
            <h2 className="text-xl md:text-5xl font-black text-foreground mt-1.5 mb-2 md:mb-5 leading-tight tracking-tight">
              Longevity & Health Programs,{" "}
              <span className="text-primary block md:inline">made simple.</span>
            </h2>
            <p className="text-muted-foreground text-xs md:text-lg leading-relaxed mb-1 md:mb-2">
              Real results with professional doctor support 24/7,
              <br className="md:hidden" /> 7 days a week.
            </p>

            <div className="flex flex-wrap gap-3 mb-4 md:mb-6 md:flex-col md:gap-3">
              {trustPoints.map((tp) => (
                <div key={tp.label} className="flex items-center gap-1.5 md:gap-2.5">
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tp.icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-[11px] md:text-base">{tp.label}</span>
                </div>
              ))}
            </div>

            <p className="text-lg md:text-3xl font-extrabold text-foreground mb-1 md:mb-2">
              Get approved in under 5 Mins!
              <br />
              <span className="text-primary">Start Now!</span>
            </p>
            <p className="text-muted-foreground text-[11px] md:text-base mb-4 md:mb-6">
              From <span className="font-bold text-foreground">$149+ Per Month</span>.
              <br />
              Join the lowest cost weight loss plans on the market.
            </p>

            <button
              onClick={() => navigate("/weightloss-glp-intake")}
              className="inline-flex items-center gap-2 px-5 py-2 md:px-8 md:py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm md:text-base hover:bg-primary/90 transition-colors mb-5 md:mb-10"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Program Cards - MOBILE ONLY */}
            <div className="lg:hidden">
              {(() => {
                const featuredSlugs = ["weight-loss", "menopause-hrt", "hot-health"];
                const featured = featuredSlugs
                  .map((s) => telehealthPrograms.find((p) => p.slug === s))
                  .filter(Boolean) as typeof telehealthPrograms;
                const rest = telehealthPrograms.filter((p) => !featuredSlugs.includes(p.slug) && p.slug !== "gut-health");
                const renderCard = (program: typeof telehealthPrograms[number], big: boolean) => {
                  const lowestPrice = Math.min(...program.tiers.map((t) => t.price));
                  return (
                    <div
                      key={program.slug}
                      className="group relative rounded-xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elevated transition-all cursor-pointer"
                      onClick={() => navigate(program.slug === "weight-loss" ? "/weightloss-glp-intake" : `/programs/${program.slug}`)}
                    >
                      <div className={`relative ${big ? "h-40" : "h-20"} bg-gradient-to-br ${program.color} overflow-hidden`}>
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-full h-full object-cover mix-blend-luminosity opacity-60"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {program.badge && (
                          <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 bg-accent text-accent-foreground ${big ? "text-[10px]" : "text-[8px]"} font-bold rounded-full uppercase tracking-wide`}>
                            {program.badge}
                          </span>
                        )}
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <h3 className={`${big ? "text-sm" : "text-[10px]"} font-bold text-white leading-tight line-clamp-2`}>{program.title}</h3>
                        </div>
                      </div>
                      <div className={`${big ? "px-3 py-2" : "px-2 py-1.5"}`}>
                        <p className={`${big ? "text-sm" : "text-xs"} font-bold text-primary`}>
                          From ${lowestPrice}/mo
                          {big && program.slug === "hot-health" && (
                            <span className="ml-1 font-medium text-muted-foreground text-[11px]">(Microdose GLP-1 Hypo Spray)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                };
                return (
                  <>
                    <div className="grid grid-cols-1 gap-2.5 mb-2.5">
                      {featured.map((p) => renderCard(p, true))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {rest.map((p) => renderCard(p, false))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right: Green background - Focus area buttons */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-[hsl(155,30%,38%)] via-[hsl(155,25%,28%)] to-[hsl(155,35%,18%)] py-8 md:py-16 px-4 order-2 lg:order-2 overflow-hidden rounded-3xl md:rounded-[2rem] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,hsl(155,40%,45%,0.5),transparent_60%)] before:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_bottom_left,hsl(345,40%,70%,0.18),transparent_55%)] after:pointer-events-none">
          <div className="relative max-w-xl mr-auto ml-4 lg:ml-10">
            <h3 className="text-base md:text-2xl font-bold text-white mb-3 md:mb-6">
              What is your area of focus?
            </h3>
            {/* Primary focus areas - full buttons */}
            <div className="space-y-2.5 md:space-y-4">
              {primaryFocusAreas.map((area) => (
                <button
                  key={area.title}
                  onClick={() => navigate(area.programSlug === "weight-loss" ? "/weightloss-glp-intake" : `/programs/${area.programSlug}`)}
                  className="w-full text-left px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-2xl border border-white/30 bg-white text-foreground hover:bg-white/90 hover:shadow-soft transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-foreground text-xs md:text-lg mb-0 md:mb-0.5 truncate">{area.title}</h4>
                      <p className="text-muted-foreground text-[11px] md:text-sm truncate">{area.description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {/* Secondary focus areas - small tag pills, single row */}
            <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-6 overflow-x-auto no-scrollbar">
              {secondaryFocusAreas.map((area) => (
                <button
                  key={area.title}
                  onClick={() => navigate(`/programs/${area.programSlug}`)}
                  className="px-2 py-1 md:px-3.5 md:py-1.5 rounded-full bg-white/15 text-white/80 text-[9px] md:text-xs font-medium hover:bg-white/25 transition-colors border border-white/15 whitespace-nowrap flex-shrink-0"
                >
                  {area.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
