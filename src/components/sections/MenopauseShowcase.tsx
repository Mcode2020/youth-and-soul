import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import menopauseProduct from "@/assets/menopause-product.webp";
import menopauseBeach from "@/assets/menopause-woman-beach.webp";
import menopauseNature from "@/assets/menopause-woman-nature.png";

const benefits = [
  "Estradiol Patch & Progesterone",
  "DHEA & Estriol Vaginal Cream",
  "Hormone balance & hot flash relief",
  "Healthy weight management",
  "Hair strength & growth support",
  "Skin health & radiance",
  "Fast & discreet shipping",
];

export function MenopauseShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(340,30%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(340,50%,55%)] font-semibold mb-2 block">
              Estrogen Therapy, HRT & Vaginal Health
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(340,50%,55%)]">Menopause & Hormonal Support.</span> Body & mental care for her balance, vitality & confidence
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={menopauseBeach} alt="Woman smiling on the beach" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={menopauseNature} alt="Woman in nature" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Doctor-guided care for every stage
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Doctor-guided care for weight, hormones, hair, and skin, with personalized treatment plans designed to support your health through every stage of life. From $149/mo.
            </p>

            <button
              onClick={() => navigate("/programs/menopause-hrt")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(340,50%,55%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(340,50%,50%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(340,25%,93%)] shadow-lg mb-6">
              <img src={menopauseProduct} alt="Menopause hormone therapy medications" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">Benefits that support every stage</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(340,50%,55%)] shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
