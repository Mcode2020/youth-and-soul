import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Star, Shield, BadgeCheck, Truck } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useSEOHead } from "@/hooks/useSEOHead";

import { ProgramVideosSection } from "@/components/sections/ProgramVideosSection";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { telehealthPrograms } from "@/data/telehealthPrograms";


// Map program color gradients to matching border colors
const programBorderColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "border-teal-500",
  "from-rose-800 to-rose-600": "border-rose-500",
  "from-blue-800 to-blue-600": "border-blue-500",
  "from-amber-800 to-amber-600": "border-amber-500",
  "from-emerald-800 to-emerald-600": "border-emerald-500",
  "from-slate-700 to-slate-500": "border-slate-500",
  "from-indigo-800 to-indigo-600": "border-indigo-500",
  "from-lime-800 to-lime-600": "border-lime-500",
  "from-sky-800 to-sky-600": "border-sky-500",
  "from-pink-800 to-pink-600": "border-pink-500",
};

const programBtnColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "bg-teal-600 hover:bg-teal-700 text-white",
  "from-rose-800 to-rose-600": "bg-rose-600 hover:bg-rose-700 text-white",
  "from-blue-800 to-blue-600": "bg-blue-600 hover:bg-blue-700 text-white",
  "from-amber-800 to-amber-600": "bg-amber-600 hover:bg-amber-700 text-white",
  "from-emerald-800 to-emerald-600": "bg-emerald-600 hover:bg-emerald-700 text-white",
  "from-slate-700 to-slate-500": "bg-slate-600 hover:bg-slate-700 text-white",
  "from-indigo-800 to-indigo-600": "bg-indigo-600 hover:bg-indigo-700 text-white",
  "from-lime-800 to-lime-600": "bg-lime-600 hover:bg-lime-700 text-white",
  "from-sky-800 to-sky-600": "bg-sky-600 hover:bg-sky-700 text-white",
  "from-pink-800 to-pink-600": "bg-pink-600 hover:bg-pink-700 text-white",
};

const programBtnFadedColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "bg-teal-100 text-teal-800 hover:bg-teal-200",
  "from-rose-800 to-rose-600": "bg-rose-100 text-rose-800 hover:bg-rose-200",
  "from-blue-800 to-blue-600": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "from-amber-800 to-amber-600": "bg-amber-100 text-amber-800 hover:bg-amber-200",
  "from-emerald-800 to-emerald-600": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  "from-slate-700 to-slate-500": "bg-slate-100 text-slate-800 hover:bg-slate-200",
  "from-indigo-800 to-indigo-600": "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  "from-lime-800 to-lime-600": "bg-lime-100 text-lime-800 hover:bg-lime-200",
  "from-sky-800 to-sky-600": "bg-sky-100 text-sky-800 hover:bg-sky-200",
  "from-pink-800 to-pink-600": "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

const programTextColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "text-teal-600",
  "from-rose-800 to-rose-600": "text-rose-600",
  "from-blue-800 to-blue-600": "text-blue-600",
  "from-amber-800 to-amber-600": "text-amber-600",
  "from-emerald-800 to-emerald-600": "text-emerald-600",
  "from-slate-700 to-slate-500": "text-slate-600",
  "from-indigo-800 to-indigo-600": "text-indigo-600",
  "from-lime-800 to-lime-600": "text-lime-600",
  "from-sky-800 to-sky-600": "text-sky-600",
  "from-pink-800 to-pink-600": "text-pink-600",
};

const programLogoColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "text-teal-500",
  "from-rose-800 to-rose-600": "text-rose-500",
  "from-blue-800 to-blue-600": "text-blue-500",
  "from-amber-800 to-amber-600": "text-amber-500",
  "from-emerald-800 to-emerald-600": "text-emerald-500",
  "from-slate-700 to-slate-500": "text-slate-500",
  "from-indigo-800 to-indigo-600": "text-indigo-500",
  "from-lime-800 to-lime-600": "text-lime-500",
  "from-sky-800 to-sky-600": "text-sky-500",
  "from-pink-800 to-pink-600": "text-pink-500",
};

const tierBadge: Record<string, string | null> = {
  "Good": null,
  "Better": null,
  "Best": "Best Value",
  "Level 1": null,
  "Level 2": null,
  "Level 3": "Best Value",
  "Single": null,
};

export default function ProgramDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const program = telehealthPrograms.find((p) => p.slug === slug);

  const lowestPrice = program?.tiers.reduce((min, t) => Math.min(min, t.price), Infinity);

  useSEOHead({
    title: program ? `${program.title} — Doctor-Prescribed Telehealth` : "Program",
    description: program
      ? `${program.subtitle}. Doctor-prescribed telehealth program from Youth & Soul. Plans from $${lowestPrice}/mo. Full refund if not approved.`
      : "Telehealth program not found.",
    path: `/programs/${slug || ""}`,
    ogImage: program?.image ? `https://youthandsoul.com${program.image}` : undefined,
    keywords: program
      ? `${program.title}, ${program.subtitle}, telehealth, prescription, doctor consultation, ${slug}`
      : undefined,
    noIndex: !program,
    jsonLd: program ? [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: program.title,
        description: program.subtitle,
        url: `https://youthandsoul.com/programs/${slug}`,
        about: { "@type": "MedicalCondition", name: program.title },
        publisher: { "@id": "https://youthandsoul.com/#organization" },
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: program.title,
        provider: { "@id": "https://youthandsoul.com/#organization" },
        areaServed: "US",
        offers: program.tiers.map((t) => ({
          "@type": "Offer",
          name: t.name,
          price: t.price,
          priceCurrency: "USD",
          description: t.description,
        })),
      },
    ] : undefined,
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program not found</h1>
          <button onClick={() => navigate("/")} className="text-primary underline">Go home</button>
        </div>
      </div>
    );
  }

  const iconColor = programTextColor[program.color] || "text-primary";
  const logoColor = programLogoColor[program.color] || "text-primary";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header with dynamic logo color */}
      <header className="sticky top-0 z-40 bg-charcoal backdrop-blur-md border-b border-border/20 safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <a href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight">
              <span className={logoColor}>Youth</span>
              <span className="text-white">&</span>
              <span className={logoColor}>Soul</span>
            </span>
          </a>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-cream/80 hover:text-cream text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </header>

      <Breadcrumbs items={[
        { label: "Programs", href: "/programs" },
        { label: program.title }
      ]} />
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${program.color} overflow-hidden`}>
        <img src={program.image} alt={program.title} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          {program.badge && (
            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full uppercase tracking-wide mb-4">{program.badge}</span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{program.title}</h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">{program.subtitle}</p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Truck className={`w-4 h-4 ${iconColor}`} /> Next/2‑Day Delivery</span>
          <span className="flex items-center gap-1.5"><Shield className={`w-4 h-4 ${iconColor}`} /> Doctor‑Prescribed</span>
          <span className="flex items-center gap-1.5"><Star className={`w-4 h-4 ${iconColor}`} /> FDA‑Approved Compounds</span>
          <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${iconColor}`} /> Cancel Anytime</span>
          <span className="flex items-center gap-1.5"><BadgeCheck className={`w-4 h-4 ${iconColor}`} /> Full Refund if Not Approved</span>
        </div>
      </div>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">Choose Your Plan</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto text-sm md:text-base">
          All plans include a licensed doctor consultation, prescription, and free monthly delivery. Fast, simple to use care with next-day treatment — redefining healthcare.
        </p>

        <div className={`grid gap-6 ${program.tiers.length === 1 ? 'max-w-md mx-auto' : program.tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
          {program.tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative bg-card rounded-2xl border-2 ${
                tier.label === "Best" || tier.label === "Level 3" || tier.label === "Single"
                  ? `${programBorderColor[program.color] || "border-primary"} ring-2 ring-primary/20`
                  : tier.label === "Better" || tier.label === "Level 2"
                    ? `${programBorderColor[program.color] || "border-primary"}/50`
                    : "border-muted-foreground/30"
              } p-6 md:p-8 flex flex-col`}
            >
              {tierBadge[tier.label] && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full text-white ${
                  programBtnColor[program.color]?.split(" ")[0] || "bg-primary"
                }`}>
                  {tierBadge[tier.label]}
                </span>
              )}
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${programTextColor[program.color] || "text-primary"}`}>{tier.label}</p>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{tier.description}</p>
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-6">{tier.priceLabel}</p>
              <ul className="space-y-2 mb-6">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${programTextColor[program.color] || "text-primary"}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(`/enroll/${program.slug}/${tier.label.toLowerCase().replace(/\s+/g, "-")}`)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors ${
                  tier.label === "Best" || tier.label === "Level 3" || tier.label === "Single"
                    ? programBtnColor[program.color] || "bg-primary text-primary-foreground hover:bg-primary/90"
                    : programBtnFadedColor[program.color] || "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {program.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Reviews */}
      <TestimonialsCarousel />

      {/* Video Testimonials */}
      <ProgramVideosSection slug={program.slug} />

      {/* Doctors */}
      <DoctorsSection slug={program.slug} />

      {/* Bottom CTA */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Not sure which plan is right?</h2>
          <p className="text-muted-foreground mb-6">Take a quick health quiz and our doctors will recommend the best option for you.</p>
          <button
            onClick={() => navigate(`/health-quiz/${program.quizArea}`)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Take the Health Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Explore Other Programs */}
      <section id="explore-other-programs" className="max-w-6xl mx-auto px-4 py-10 md:py-14 scroll-mt-24">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">Explore Other Programs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {telehealthPrograms
            .filter((p) => p.slug !== program.slug)
            .map((p) => (
              <button
                key={p.slug}
                onClick={() => { navigate(`/programs/${p.slug}`); window.scrollTo(0, 0); }}
                className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-md transition-all text-left"
              >
                <div className="relative h-24 md:h-32 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full">{p.badge}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground line-clamp-2 mb-1">{p.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">{p.subtitle}</p>
                  <p className="text-xs font-bold text-primary mt-1.5">From ${Math.min(...p.tiers.map(t => t.price))}/mo</p>
                </div>
              </button>
            ))}
        </div>
      </section>


      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
