import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sleepWoman from "@/assets/sleep-woman.jpg";
import sleepInsomnia from "@/assets/sleep-insomnia.jpg";
import sleepProduct from "@/assets/sleep-product.webp";

const benefits = [
  "Prescription sleep aids (Trazodone, Gabapentin)",
  "Melatonin & Magnesium Threonate protocols",
  "CBT-I cognitive behavioral therapy for insomnia",
  "Sleep hygiene coaching & circadian reset",
  "Continuous sleep tracking & optimization",
  "Doctor-monitored dosing & adjustments",
];

export function SleepHealthShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(230,25%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(230,40%,50%)] font-semibold mb-2 block">
              Insomnia Treatment & Sleep Optimization
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(230,40%,50%)]">Sleep better</span> with doctor-guided care
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={sleepWoman} alt="Person sleeping peacefully" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={sleepInsomnia} alt="Insomnia and sleep difficulties" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Wake up refreshed, every day
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Personalized sleep protocols combining prescription treatments, supplements, and behavioral coaching to restore deep, restorative sleep. From $49/mo.
            </p>

            <button
              onClick={() => navigate("/programs/sleep-health")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(230,40%,50%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(230,40%,45%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(230,20%,93%)] shadow-lg mb-6">
              <img src={sleepProduct} alt="Magnesium Threonate sleep supplement" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's in your sleep plan</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(230,40%,50%)] shrink-0" />
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
