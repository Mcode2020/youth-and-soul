import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import weightlossMeds from "@/assets/weightloss-meds.jpg";
import foodBowlImg from "@/assets/healthy-food-bowl.jpg";
import weightlossWomenInspiringImg from "@/assets/weightloss-women-inspiring.jpg";
import weightlossWomenImg from "@/assets/weightloss-women.jpg";

const benefits = [
  "Semaglutide & Tirzepatide GLP-1 options",
  "1:1 physician guidance & monitoring",
  "Ozempic, B12 & NAD+ add-ons available",
  "24/7 doctor support",
  "Weight loss guarantee",
  "Fast & discreet shipping",
];

export function WeightLossShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-12 bg-gradient-to-b from-[hsl(160,20%,96%)] to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Title + 2 images + description + CTA */}
          <div>
            <span className="text-xs md:text-sm uppercase tracking-widest text-primary font-semibold mb-2 block">
              Doctor-Guided GLP-1 Care
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-[1.1] tracking-tight">
              Weight loss <span className="text-primary">made easy</span> with personalized care
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img
                  src={weightlossWomenInspiringImg}
                  alt="Women celebrating their fitness journey"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="ro-img rounded-2xl aspect-[4/3] bg-muted">
                <img
                  src={weightlossWomenImg}
                  alt="Women celebrating body confidence"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
              Lose weight with confidence
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Find the right GLP-1 medication with the confidence that comes from knowing it is doctor-approved and budget-friendly. From $149/mo.
            </p>

            <button
              onClick={() => navigate("/weightloss-glp-intake")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm md:text-base hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Large hero image + bullet points below */}
          <div>
            <div className="rounded-3xl overflow-hidden bg-[hsl(160,20%,93%)] shadow-lg mb-6">
              <img
                src={weightlossMeds}
                alt="GLP-1 weight loss medications"
                className="w-full h-auto object-cover aspect-[4/3]"
                loading="lazy"
                width={640}
                height={480}
              />
            </div>
            <h4 className="text-sm md:text-base font-bold text-foreground mb-3">Everything you need—included:</h4>
            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
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
