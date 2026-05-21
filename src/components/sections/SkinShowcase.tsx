import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skinMotherDaughter from "@/assets/skin-longevity.webp";
import skinProducts from "@/assets/skin-products.png";
import longevityCouple from "@/assets/longevity-couple.jpg";

const benefits = [
  "Tretinoin & Retinoid prescriptions",
  "Tretinoin + Estriol + Peptides combo",
  "Prescription-strength anti-aging",
  "NAD+ & Methylene Blue for cellular renewal",
  "Sermorelin & growth peptides",
  "LDN for inflammation & immune support",
  "Personalized longevity treatment plans",
  "Visible skin & vitality results",
];

export function SkinShowcase() {
  const navigate = useNavigate();

  return (
    <section id="skin-section" className="py-10 md:py-20 bg-gradient-to-b from-[hsl(25,40%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Product image + benefits — on mobile this comes AFTER the title block */}
          <div className="order-2 md:order-1">
            <div className="rounded-3xl overflow-hidden bg-[hsl(25,30%,93%)] shadow-lg mb-6">
              <img src={skinProducts} alt="Premium anti-aging skincare products and serums" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">Why our longevity & skincare works</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(25,60%,50%)] shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Title + images + CTA — shown FIRST on mobile */}
          <div className="order-1 md:order-2">
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(25,60%,50%)] font-semibold mb-2 block">
              Longevity, Anti-Aging & Skincare
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(25,60%,50%)]">Longevity, Anti-Aging & Skincare</span> that goes deeper than the surface
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={longevityCouple} alt="Happy couple enjoying longevity and vitality" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={skinMotherDaughter} alt="Woman with anti-aging skincare results" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Real results, visible improvement
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              From acne and aging to cellular renewal and longevity support — every plan is built for real, visible improvement. NAD+, peptides, retinoids & more. From $39/mo.
            </p>

            <button
              onClick={() => navigate("/programs/skin-hair")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(25,60%,50%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(25,60%,45%)] transition-colors"
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
