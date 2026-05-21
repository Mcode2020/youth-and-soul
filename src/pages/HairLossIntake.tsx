import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Star, MessageCircle, Pill, Shield, Sparkles } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { useSEOHead } from "@/hooks/useSEOHead";
import { OptionButton } from "@/components/glp-intake/OptionButton";
import { IntakeStepWrapper } from "@/components/glp-intake/IntakeStepWrapper";
import { FormInput } from "@/components/glp-intake/FormInput";
import hairloss1 from "@/assets/hair-loss-before.png";
import hairloss2 from "@/assets/hair-loss-after.png";
import pillsImg from "@/assets/hairloss-pills.jpg";
import sprayImg from "@/assets/hairloss-spray.jpg";
import heroImg from "@/assets/hairloss-intake-hero.jpg";

const STORAGE_KEY = "ys_hairloss_intake";
const FONT = "'Nunito', 'SF Pro Rounded', system-ui, sans-serif";

type FormData = {
  goals: string[];
  changes: string[];
  duration: string;
  family: string;
  stress: string;
  routine: string;
  hairStyle: string;
  state: string;
  dob: string;
  formFactor: string;
  firstName: string;
  email: string;
};

const INITIAL: FormData = {
  goals: [],
  changes: [],
  duration: "",
  family: "",
  stress: "",
  routine: "",
  hairStyle: "",
  state: "",
  dob: "",
  formFactor: "",
  firstName: "",
  email: "",
};

const TOTAL_STEPS = 14;

export default function HairLossIntake() {
  useSEOHead({
    title: "Hair Loss Treatment — 60-Second Eligibility Check",
    description: "Doctor-prescribed Finasteride and Minoxidil. From $39/mo. See if you qualify in 60 seconds.",
  });

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [transitioning, setTransitioning] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...INITIAL, ...JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleMulti = (key: "goals" | "changes", value: string) => {
    setData((d) => {
      const arr = d[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...d, [key]: next };
    });
  };

  const advance = (delay = 350) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
      setTransitioning(false);
    }, delay);
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return data.goals.length > 0;
      case 1: return data.changes.length > 0;
      case 2: return !!data.duration;
      case 3: return !!data.family;
      case 4: return !!data.stress;
      case 5: return !!data.routine;
      case 6: return !!data.hairStyle;
      case 7: return data.state.length === 2;
      case 8: return !!data.dob;
      // 9 = informational reviews — always continue
      // 10 = informational results — always continue
      // 11 = informational support — always continue
      case 12: return !!data.formFactor;
      case 13: return data.firstName.trim().length > 1 && /^\S+@\S+\.\S+$/.test(data.email);
      default: return true;
    }
  }, [step, data]);

  const handleSubmit = () => {
    // Persist + redirect to program detail (real telehealth program)
    try {
      const existing = JSON.parse(localStorage.getItem("ys_intake_user_data") || "{}");
      localStorage.setItem(
        "ys_intake_user_data",
        JSON.stringify({
          ...existing,
          firstName: data.firstName,
          email: data.email,
          state: data.state,
          dateOfBirth: data.dob,
          primaryGoal: "hair-loss",
          hairLossIntake: data,
        }),
      );
    } catch {}
    navigate("/programs/skin-hair");
  };

  return (
    <div className="min-h-screen bg-[hsl(35,25%,97%)]" style={{ fontFamily: FONT }}>
      <MobileHeader />

      {/* Top progress strip */}
      <div className="sticky top-0 z-40 bg-[hsl(35,25%,97%)]/95 backdrop-blur border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={back}
                className="p-1.5 rounded-full hover:bg-foreground/5 transition"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-foreground/70" />
              </button>
            )}
            <div className="flex-1 h-1.5 bg-foreground/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(15,55%,45%)] transition-all duration-500"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground/60 tabular-nums">
              {step + 1}/{TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-14 pb-32">
        <AnimatePresence mode="wait">
          {!transitioning && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Step 0 — Goals */}
              {step === 0 && (
                <StepShell
                  title="What are your hair goals?"
                  subtitle="Select all that apply."
                >
                  <div className="space-y-3">
                    {[
                      "Stop hair loss",
                      "Regrow hair I've lost",
                      "Thicken existing hair",
                      "Prevent future hair loss",
                    ].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.goals.includes(label)}
                        onClick={() => toggleMulti("goals", label)}
                        multi
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 1 — Hair changes */}
              {step === 1 && (
                <StepShell
                  title="What kind of hair changes have you noticed?"
                  subtitle="Select all that apply."
                >
                  <div className="space-y-3">
                    {[
                      "Receding hairline",
                      "Thinning on top / crown",
                      "Hair feels finer overall",
                      "Increased shedding",
                      "No changes — getting ahead of it",
                    ].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.changes.includes(label)}
                        onClick={() => toggleMulti("changes", label)}
                        multi
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 2 — Duration */}
              {step === 2 && (
                <StepShell title="How long have you been noticing changes?">
                  <div className="space-y-3">
                    {["Less than 6 months", "6 months – 1 year", "1 – 3 years", "Over 3 years", "Not sure"].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.duration === label}
                        onClick={() => {
                          update("duration", label);
                          advance();
                        }}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 3 — Family history */}
              {step === 3 && (
                <StepShell title="Is there a history of hair loss in your family?">
                  <div className="space-y-3">
                    {["Yes, on my mother's side", "Yes, on my father's side", "Yes, both sides", "No", "Not sure"].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.family === label}
                        onClick={() => {
                          update("family", label);
                          advance();
                        }}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 4 — Stress */}
              {step === 4 && (
                <StepShell title="How would you rate your stress level recently?">
                  <div className="space-y-3">
                    {["Rarely stressed", "Occasionally stressed", "Often stressed", "Almost always stressed"].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.stress === label}
                        onClick={() => {
                          update("stress", label);
                          advance();
                        }}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 5 — Routine */}
              {step === 5 && (
                <StepShell title="How long is your daily hair routine?">
                  <div className="space-y-3">
                    {["Under 5 minutes", "5 – 10 minutes", "10+ minutes", "I don't have one"].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.routine === label}
                        onClick={() => {
                          update("routine", label);
                          advance();
                        }}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 6 — Hair style */}
              {step === 6 && (
                <StepShell title="Do you typically wear your hair under a hat or tied back?">
                  <div className="space-y-3">
                    {["Yes, often", "Sometimes", "Rarely", "Never"].map((label) => (
                      <OptionButton
                        key={label}
                        label={label}
                        selected={data.hairStyle === label}
                        onClick={() => {
                          update("hairStyle", label);
                          advance();
                        }}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Step 7 — State */}
              {step === 7 && (
                <StepShell
                  title="Which state do you live in?"
                  subtitle="We need this to match you with a licensed doctor in your state."
                >
                  <FormInput
                    label="State (2-letter code)"
                    required
                    value={data.state}
                    onChange={(v) => update("state", v.toUpperCase().slice(0, 2))}
                    placeholder="e.g. CA, NY, TX"
                  />
                </StepShell>
              )}

              {/* Step 8 — DOB */}
              {step === 8 && (
                <StepShell
                  title="What's your date of birth?"
                  subtitle="You must be 18+ to start treatment."
                >
                  <FormInput
                    label="Date of Birth"
                    required
                    type="date"
                    value={data.dob}
                    onChange={(v) => update("dob", v)}
                  />
                </StepShell>
              )}

              {/* Step 9 — Reviewing responses */}
              {step === 9 && (
                <StepShell title="Here's what we know about your hair so far:">
                  <ReviewCard
                    sections={[
                      { heading: "Your Goals", items: data.goals },
                      { heading: "Hair Changes", items: data.changes },
                      { heading: "Duration", items: [data.duration] },
                      { heading: "Lifestyle", items: [`Family history: ${data.family}`, `Stress: ${data.stress}`, `Routine: ${data.routine}`] },
                    ]}
                  />
                  <p className="text-base text-[hsl(15,55%,45%)] font-medium mt-6">
                    Now, let's go over what you can expect with treatment through Youth & Soul.
                  </p>
                </StepShell>
              )}

              {/* Step 10 — Clinically proven */}
              {step === 10 && (
                <StepShell
                  title={
                    <>
                      <span className="text-[hsl(15,55%,45%)]">Finasteride</span> and{" "}
                      <span className="text-[hsl(15,55%,45%)]">minoxidil</span> are popular treatments often prescribed by dermatologists to treat hair loss.
                    </>
                  }
                >
                  <div className="grid gap-4 mt-4">
                    <StatCard stat="90%" label="saw reduced shedding with finasteride." />
                    <StatCard stat="80%" label="experienced significant hair regrowth with minoxidil." />
                  </div>
                </StepShell>
              )}

              {/* Step 11 — Testimonials */}
              {step === 11 && (
                <StepShell title="See what others are saying about their treatments.">
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    {[
                      { name: "Kevin C.", quote: "Between month 4–5 the progress blew me away! I went back to my barber and he couldn't believe it.", img: hairloss2 },
                      { name: "Andrew N.", quote: "I began to see progress in less than 3 months. My brother saw my progress and has begun using it!", img: hairloss1 },
                    ].map((t) => (
                      <div key={t.name} className="bg-background rounded-2xl border border-border/60 overflow-hidden">
                        <div className="aspect-[4/3] bg-muted overflow-hidden">
                          <img src={t.img} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-foreground/80 leading-snug mb-3">"{t.quote}"</p>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[hsl(35,30%,85%)] flex items-center justify-center text-xs font-bold text-foreground/70">
                              {t.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{t.name}</p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[hsl(15,55%,45%)]" /> Verified review
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-4 text-center">
                    Individual results vary. Customer photos shared with consent.
                  </p>
                </StepShell>
              )}

              {/* Step 12 — Form factor */}
              {step === 12 && (
                <StepShell title="Which type of daily treatment do you prefer?">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "pills", label: "Pills or chews", sub: "Take one a day", img: pillsImg, popular: true },
                      { id: "spray", label: "Sprays or serums", sub: "Apply right on scalp", img: sprayImg },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => update("formFactor", opt.id)}
                        className={`relative text-left rounded-2xl border-2 overflow-hidden bg-background transition-all ${
                          data.formFactor === opt.id
                            ? "border-primary shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.3)]"
                            : "border-border/70 hover:border-foreground/30"
                        }`}
                      >
                        {opt.popular && (
                          <span className="absolute top-3 left-3 z-10 text-[11px] font-bold uppercase tracking-wide bg-[hsl(15,55%,45%)] text-white px-2.5 py-1 rounded-full">
                            Most popular
                          </span>
                        )}
                        <div className="aspect-square overflow-hidden">
                          <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="p-4 text-center">
                          <p className="text-base font-bold text-foreground">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => update("formFactor", "no-preference")}
                    className={`mt-3 w-full text-center rounded-2xl border-2 px-6 py-4 transition-all ${
                      data.formFactor === "no-preference"
                        ? "border-primary bg-primary/5"
                        : "border-border/70 hover:border-foreground/30 bg-background"
                    }`}
                  >
                    <p className="text-base font-bold text-foreground">No preference</p>
                    <p className="text-sm text-muted-foreground">Choose what's most effective for me</p>
                  </button>
                </StepShell>
              )}

              {/* Step 13 — Account */}
              {step === 13 && (
                <StepShell
                  title="Create your account to see your treatment options."
                  subtitle="No credit card required. We'll save your progress."
                >
                  <div className="space-y-4">
                    <FormInput
                      label="First name"
                      required
                      value={data.firstName}
                      onChange={(v) => update("firstName", v)}
                      placeholder="Your first name"
                    />
                    <FormInput
                      label="Email"
                      required
                      type="email"
                      value={data.email}
                      onChange={(v) => update("email", v)}
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      By continuing you agree to our{" "}
                      <a href="/terms-of-service" className="underline">Terms</a> and{" "}
                      <a href="/privacy-policy" className="underline">Privacy Policy</a>.
                    </p>
                  </div>
                </StepShell>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border/60 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => {
              if (step === TOTAL_STEPS - 1) handleSubmit();
              else advance(150);
            }}
            disabled={!canContinue}
            className="w-full bg-[hsl(15,55%,45%)] text-white rounded-full py-4 font-bold text-base flex items-center justify-center gap-2 hover:bg-[hsl(15,55%,40%)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {step === TOTAL_STEPS - 1 ? "See my treatment options" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" /> 100% online · HIPAA-secure · Cancel anytime
          </p>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
}

/* ───── Sub-components ───── */

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-[1.15] mb-3 tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-base text-muted-foreground mb-7">{subtitle}</p>}
      {!subtitle && <div className="mb-7" />}
      {children}
    </div>
  );
}

function ReviewCard({ sections }: { sections: { heading: string; items: string[] }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-background border border-border/60 shadow-sm">
      <div className="bg-[hsl(15,55%,35%)] px-5 py-3.5">
        <p className="text-sm font-bold text-white">Your Hair Profile</p>
      </div>
      <div className="divide-y divide-border/60">
        {sections.map((section) => (
          <div key={section.heading} className="px-5 py-4">
            <p className="text-xs font-bold text-foreground/70 uppercase tracking-wide mb-2">{section.heading}</p>
            {section.items.filter(Boolean).map((item) => (
              <p key={item} className="text-base text-[hsl(15,55%,45%)] font-semibold border-l-2 border-[hsl(15,55%,80%)] pl-3 py-0.5">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="bg-[hsl(35,20%,93%)] rounded-2xl px-6 py-5 flex items-center gap-5">
      <span className="text-4xl md:text-5xl font-bold text-[hsl(15,55%,45%)] leading-none">{stat}</span>
      <p className="text-sm md:text-base text-foreground/80 leading-snug">{label}</p>
    </div>
  );
}
