import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gutHealthFood from "@/assets/gut-health-food.jpg";

const benefits = [
  "Rifaximin & antimicrobial protocols",
  "Medical-grade probiotics & prebiotics",
  "L-Glutamine & digestive enzymes",
  "SIBO & IBS targeted treatment",
  "GI-MAP test review available",
  "Dedicated doctor & dietary guidance",
];

export function GutHealthShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(25,30%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Product image + benefits (swapped) */}
          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(25,25%,93%)] shadow-lg mb-6">
              <img src={gutHealthFood} alt="Healthy gut food and nutrition" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's in your protocol</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(25,50%,50%)] shrink-0" />
                  <span className="text-sm md:text-base text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Title + images + CTA (swapped) */}
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(25,50%,50%)] font-semibold mb-2 block">
              Microbiome Reset & Digestive Optimization
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(25,50%,50%)]">Gut health</span> designed to heal from the inside out
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" alt="Healthy food preparation with vegetables" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" alt="Colorful nutritious healthy bowl" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Heal from the inside out
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Doctor-guided protocols for bloating, IBS, SIBO, and full microbiome restoration. From $89/mo.
            </p>

            <button
              onClick={() => navigate("/programs/gut-health")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(25,50%,50%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(25,50%,45%)] transition-colors"
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
