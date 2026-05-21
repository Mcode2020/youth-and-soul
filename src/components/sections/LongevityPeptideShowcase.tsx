import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import longevityDna from "@/assets/longevity-dna.png";

export function LongevityPeptideShowcase() {
  const navigate = useNavigate();

  return (
    <section id="peptides-longevity-showcase" className="py-12 md:py-20 bg-[hsl(210,20%,97%)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: Product image + tagline */}
          <div className="flex flex-col items-start gap-6">
            <div className="rounded-3xl overflow-hidden bg-[hsl(210,25%,94%)] p-8 w-full max-w-sm">
              <img
                src={longevityDna}
                alt="Premium peptide supplement bottle"
                className="w-full h-auto object-contain aspect-square"
                loading="lazy"
              />
            </div>
            <p className="text-lg md:text-xl font-semibold text-foreground">
              Unlock what your body can do
            </p>
          </div>

          {/* Right: Heading + lifestyle images */}
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-[hsl(210,40%,55%)] font-semibold mb-2 block">
              Advanced Peptide Support
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-8 leading-[1.1] tracking-tight">
              <span className="text-[hsl(210,40%,55%)]">Targeted support</span> for recovery, performance, and longevity
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="ro-img rounded-2xl aspect-[3/4] bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80"
                  alt="Man doing push-ups in gym for recovery"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="ro-img rounded-2xl aspect-[3/4] bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80"
                  alt="Woman holding supplement after workout"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <button
              onClick={() => navigate("/programs/longevity")}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(210,40%,45%)] text-white rounded-xl font-medium text-sm md:text-base hover:opacity-90 transition-colors"
            >
              Explore Peptides
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
