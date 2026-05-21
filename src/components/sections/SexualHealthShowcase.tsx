import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import viagraCialis from "@/assets/viagra-cialis.jpg";
import coupleImg1 from "@/assets/sexual-health-couple1.png";
import coupleImg2 from "@/assets/sexual-health-couple2.png";

const benefits = [
  "Sildenafil (Generic Viagra) 25/50/100mg",
  "Tadalafil (Cialis) 5mg daily + PRN",
  "PT-141 Libido Booster peptide",
  "Oxytocin for enhanced intimacy",
  "Works for both men and women",
  "Discreet packaging & shipping",
];

export function SexualHealthShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(220,25%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(220,50%,50%)] font-semibold mb-2 block">
              ED Treatments, Intimacy & Performance
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(220,50%,50%)]">Libido & sexual health</span> care, built for real confidence
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={coupleImg1} alt="Happy couple in bed together" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={coupleImg2} alt="Romantic couple smiling" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Confidence starts here
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Doctor-guided care for hormones, energy, and performance, with treatment plans tailored to your goals. From $49/mo.
            </p>

            <button
              onClick={() => navigate("/programs/sexual-health")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(220,50%,50%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(220,50%,45%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(220,20%,95%)] shadow-lg mb-6">
              <img src={viagraCialis} alt="Viagra and Cialis medications" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={512} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's included in your plan</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(220,50%,50%)] shrink-0" />
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
