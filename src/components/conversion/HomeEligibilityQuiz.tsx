import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import goalMenopause from "@/assets/goal-menopause.jpg";
import goalHairSkin from "@/assets/goal-hair-skin.jpg";
import goalSexualHealth from "@/assets/goal-sexual-health.jpg";
import ysGlpPatch from "@/assets/ys-glp1-patch.png";
import ysProductLineup from "@/assets/ys-product-lineup.png";
import ysHotHealthBox from "@/assets/ys-hot-health-box.png";

const goals = [
  { id: "weight-loss", label: "Lose weight", route: "/weightloss-glp-intake", image: ysGlpPatch },
  { id: "menopause-hrt", label: "Menopause / HRT", route: "/programs/menopause-hrt", image: goalMenopause },
  { id: "skin-hair", label: "Hair / skin", route: "/programs/skin-hair", image: goalHairSkin },
  { id: "sexual-health", label: "Better Intimacy", route: "/programs/sexual-health", image: goalSexualHealth },
  { id: "longevity", label: "Longevity / energy", route: "/programs/longevity", image: ysProductLineup },
  { id: "hot-health", label: "Looks / Confidence", route: "/programs/hot-health", image: ysHotHealthBox },
];

const ageBands = ["18–29", "30–44", "45–59", "60+"];

const STORAGE_KEY = "ys_intake_user_data";

export function HomeEligibilityQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<typeof goals[number] | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [state, setState] = useState("");

  const progress = Math.round(((step + 1) / 3) * 100);

  const finish = (selectedState: string) => {
    if (!goal) return;
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, ageBand: age, state: selectedState, primaryGoal: goal.id }),
      );
    } catch {
      /* ignore */
    }
    navigate(goal.route);
  };

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-background via-secondary/40 to-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
            60-second eligibility check
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            See if you qualify in <span className="text-gradient-sage">under a minute</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            No credit card. No commitment. Free doctor review on every plan.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-elevated p-5 md:p-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-semibold text-muted-foreground">Step {step + 1} of 3</span>
            <span className="text-xs font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step 0: Goal */}
          {step === 0 && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                What's your primary health goal?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setGoal(g);
                      setStep(1);
                    }}
                    className="group relative isolate overflow-hidden rounded-2xl border border-border hover:border-primary/60 aspect-[4/3] transition-[transform,box-shadow,border-color] duration-300 active:scale-[0.97] hover:-translate-y-1 hover:shadow-elevated transform-gpu [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
                  >
                    <img
                      src={g.image}
                      alt={g.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Bottom gradient for label contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent z-[1]" />
                    <div className="absolute inset-x-0 bottom-0 p-3 z-10">
                      <span className="block text-xs md:text-sm font-bold text-white drop-shadow-lg text-center leading-tight">
                        {g.label}
                      </span>
                    </div>
                    <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Age */}
          {step === 1 && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-4">
                What's your age range?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {ageBands.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAge(a);
                      setStep(2);
                    }}
                    className="p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 font-semibold text-foreground transition-all active:scale-95"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: State */}
          {step === 2 && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
                Which state do you live in?
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                We need this to match you with a licensed doctor in your state.
              </p>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="e.g. CA, NY, TX"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-center text-lg font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={2}
                autoFocus
              />
              <button
                onClick={() => finish(state)}
                disabled={state.length !== 2}
                className="mt-4 w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                See my matched plan
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                100% online · HIPAA-secure · No obligation
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
