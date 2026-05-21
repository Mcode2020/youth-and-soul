import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mentalHealthProduct from "@/assets/mental-health-product.jpg";

const benefits = [
  "Psychiatry evaluations & medication management",
  "SSRIs, SNRIs & mood stabilizers prescribed online",
  "Licensed therapy sessions (CBT, DBT, talk therapy)",
  "Anxiety, depression & ADHD treatment plans",
  "Ongoing check-ins & dosage adjustments",
  "Crisis support & care coordination",
];

export function MentalHealthShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(200,25%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(200,45%,45%)] font-semibold mb-2 block">
              Psychiatry, Therapy & Medication Management
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(200,45%,45%)]">Mental health</span> care that meets you where you are
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" alt="Therapist consultation session" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80" alt="Person practicing mindfulness and wellness" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Expert psychiatry + therapy, online
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Board-certified psychiatrists and licensed therapists for anxiety, depression, ADHD, and more. Medication management and talk therapy in one plan. From $85/mo.
            </p>

            <button
              onClick={() => navigate("/programs/mental-health")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(200,45%,45%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(200,45%,40%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(200,20%,93%)] shadow-lg mb-6">
              <img src={mentalHealthProduct} alt="Therapist consultation session" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's in your care plan</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(200,45%,45%)] shrink-0" />
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
