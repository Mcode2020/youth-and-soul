import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import brainHealthImg from "@/assets/brain-product-pills.jpg";
import brainDoctor from "@/assets/brain-doctor.png";
import brainVitamins from "@/assets/brain-vitamins.webp";

const benefits = [
  "Modafinil & Nootropic blends",
  "Synapsin NAD+ nasal spray",
  "Methylene Blue for cognition",
  "Dihexa & Semax peptides",
  "Custom dosing & doctor monitoring",
  "Weekly check-ins available",
];

export function BrainCognitiveShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(270,20%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(270,35%,55%)] font-semibold mb-2 block">
              Nootropics, Focus & Neuroprotection
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-[1.1] tracking-tight">
              <span className="text-[hsl(270,35%,55%)]">Brain & cognitive</span> performance, optimized
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={brainDoctor} alt="Doctor with brain health hologram" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img src={brainVitamins} alt="Brain vitamins and supplements" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Sharper focus, lasting clarity
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Doctor-designed formulas for enhanced memory, focus, and neuroprotection. From the Focus Stack to the full Neuro-Longevity Protocol. From $79/mo.
            </p>

            <button
              onClick={() => navigate("/programs/brain-cognitive")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(270,35%,55%)] text-white rounded-xl font-medium text-sm md:text-base hover:bg-[hsl(270,35%,50%)] transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(270,20%,93%)] shadow-lg mb-6">
              <img src={brainHealthImg} alt="Nootropic and brain health supplements" className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" width={640} height={480} />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">What's in your protocol</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[hsl(270,35%,55%)] shrink-0" />
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
