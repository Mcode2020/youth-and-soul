import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hairTreatmentImg from "@/assets/hair-treatment-products.jpg";
import hairBefore from "@/assets/hair-loss-before.png";
import hairAfter from "@/assets/hair-loss-after.png";

const benefits = [
  "Oral Minoxidil for hair regrowth",
  "Topical Minoxidil + Finasteride blend",
  "Doctor consultation & custom formulation",
  "Monthly refills & priority support",
  "Visible results in 3-6 months",
  "Fast & discreet shipping",
];

export function HairLossShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(35,25%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Product image + benefits */}
          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(35,20%,93%)] shadow-lg mb-6">
              <img src={hairTreatmentImg} alt="Hair growth treatment and care products" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's in your plan</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(35,40%,45%)] shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Title + images + CTA */}
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(35,40%,45%)] font-semibold mb-2 block">
              Clinician-Guided Hair Regrowth
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(35,40%,45%)]">Hair loss</span> treatment that actually works
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={hairBefore} alt="Hair loss before treatment" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={hairAfter} alt="Hair regrowth after treatment" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Regrow with real science
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Proven compounds like Minoxidil and Finasteride, prescribed by doctors and customized for your hair type. From $39/mo.
            </p>

            <button
              onClick={() => navigate("/hairloss-intake")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(35,40%,45%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(35,40%,40%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
