import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const focusAreaTitles: Record<string, string> = {
  "weight-loss": "Looks & Youth / Weight Loss",
  "longevity": "Viagra / Longevity + Vitality",
  "anti-aging": "Anti-Aging & Skin, Wrinkles",
  "std-cures": "STD Cures",
  "brain-activity": "Brain Activity",
  "energy": "Energy",
  "skincare": "Skincare / Wrinkles",
  "pain-relief": "Pain Relief",
};

const quizSteps = [
  {
    question: "What best describes your experience?",
    options: [
      { label: "I'm just starting out", description: "New to supplements and wellness products", value: "beginner" },
      { label: "I have some experience", description: "I've tried some products before", value: "intermediate" },
      { label: "I'm well-researched", description: "I know what I'm looking for", value: "advanced" },
    ],
  },
  {
    question: "What's most important to you?",
    options: [
      { label: "Science-backed results", description: "Products with clinical studies and proven efficacy", value: "science" },
      { label: "Best value for money", description: "Effective products at competitive prices", value: "value" },
      { label: "Premium quality", description: "Top-tier brands with the best ingredients", value: "premium" },
    ],
  },
  {
    question: "How soon do you want to see results?",
    options: [
      { label: "As soon as possible", description: "I want fast-acting treatments", value: "fast" },
      { label: "Within a few months", description: "I'm okay with gradual improvement", value: "moderate" },
      { label: "Long-term focus", description: "I'm investing in lasting health changes", value: "longterm" },
    ],
  },
];

export default function HealthQuiz() {
  const { area } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const areaTitle = focusAreaTitles[area || ""] || "Health Program";

  useSEOHead({
    title: `${areaTitle} Health Quiz — Find Your Best Program`,
    description: `Take our free 60-second ${areaTitle.toLowerCase()} health quiz to discover personalized supplement, peptide, and telehealth program recommendations from Youth & Soul.`,
    path: `/health-quiz/${area || ""}`,
    keywords: `${areaTitle.toLowerCase()} quiz, health quiz, supplement quiz, personalized health recommendations`,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < quizSteps.length - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Quiz complete — navigate to filtered results page for this area
      navigate(`/quiz-results/${area}`);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  const progress = ((step + 1) / quizSteps.length) * 100;
  const currentStep = quizSteps[step];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Health Quiz" }]} />
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-16">
        <div className="bg-card rounded-2xl border border-border p-6 md:p-10">
          {/* Progress bar */}
          <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
                {areaTitle}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                {currentStep.question}
              </h1>

              <div className="space-y-4">
                {currentStep.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="w-full text-left p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-soft transition-all duration-200 group"
                  >
                    <h4 className="font-bold text-foreground text-base md:text-lg mb-1">
                      {option.label}
                    </h4>
                    <p className="text-muted-foreground text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </main>
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
