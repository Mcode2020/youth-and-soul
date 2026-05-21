import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import glpHero1 from "@/assets/glp-hero-step1.jpg";
import glpHero2 from "@/assets/glp-hero-step2.jpg";
import glpHero3 from "@/assets/glp-hero-step3.jpg";
import glpHero4 from "@/assets/glp-hero-step4.jpg";
import glpHero5 from "@/assets/glp-hero-step5.jpg";
import glpHeroDefault from "@/assets/glp-intake-hero.jpg";
import glpHeroWellness from "@/assets/glp-hero-wellness.jpg";
import glpHeroDna from "@/assets/glp-hero-dna.jpg";
import glpHeroStep5New from "@/assets/glp-hero-step5-new.jpg";
import glpHeroStep6New from "@/assets/glp-hero-step6-new.jpg";
import glpMedicationsLineup from "@/assets/glp-medications-lineup.webp";
import glpIntakeBanner from "@/assets/glp-intake-banner.jpg";
import healthScreeningHeart from "@/assets/health-screening-heart.jpg";
import glpOzempicWegovy from "@/assets/glp-ozempic-wegovy.jpg";
import glpMetabolismWoman from "@/assets/glp-metabolism-woman.jpg";
import glpPatientCollageReal from "@/assets/glp-patient-collage-real.jpg";
import glpPhoneConsult from "@/assets/glp-phone-consult-real.jpg";
import glpDoctor from "@/assets/glp-doctor-real.jpg";
import glpDelivery from "@/assets/glp-delivery-real.jpg";
import semaglutideProduct from "@/assets/semaglutide-product.png";
import tirzepatideProduct from "@/assets/tirzepatide-product.png";
import {
  ArrowRight, ArrowLeft, Shield, Sparkles, Heart, AlertTriangle, Check, Syringe, Pill,
  Clock, Zap, TrendingDown, Flame, Target, Brain, Moon, Dumbbell, MessageCircle,
  Leaf, Sun, Activity, Scale, HeartPulse, CheckCircle2, Star,
  Package, Stethoscope, Award, ChevronDown, ChevronUp, Truck, Phone, CreditCard,
  Users, BarChart3, Ruler, Trophy, CheckCircle, Smile, Hourglass
} from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { useSEOHead } from "@/hooks/useSEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { IntakeStepWrapper } from "@/components/glp-intake/IntakeStepWrapper";
import { OptionButton } from "@/components/glp-intake/OptionButton";
import { FormInput } from "@/components/glp-intake/FormInput";
import { DateOfBirthPicker } from "@/components/intake/DateOfBirthPicker";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { heroStats, defaultReviews } from "@/data/glpContent";
import { telehealthPrograms } from "@/data/telehealthPrograms";
import {
  calculateBMI,
  estimateWeeksToGoal,
  heightToInches,
  evaluateEligibility,
  type EligibilityOutput,
} from "@/lib/glpEligibility";

/* ───── LocalStorage keys ───── */
const INTAKE_DATA_KEY = "ys_intake_user_data";
const INTAKE_FORM_KEY = "ys_glp_intake_form";

/* ───── Data types ───── */
type IntakeData = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  heightFeet: string;
  heightInches: string;
  currentWeight: string;
  lbsToLose: string;
  hardConditions: string[];
  softConditions: string[];
  opiateUse: string;
  priorSurgery: string;
  onPrescriptions: string;
  bloodPressure: string;
  heartRate: string;
  paceFeeling: string;
  priorMedication: string;
  priority: string;
  deliveryPreference: string;
  additionalInfo: string;
  personalizations: string[];
  state: string;
  email: string;
  phone: string;
  consentAccepted: boolean;
  smsConsent: boolean;
  emailConsent: boolean;
  medicationChoice: string;
  medicationForm: string;
  /* Critical safety blockers (MDI gating questions) */
  gastricBypass6mo: string;
  glp1Allergy: string;
  disqualifyingMeds: string;
  pregnant: string;
  breastfeeding: string;
  /* Allergies & current medications detail (MDI Q14, Q15) */
  allergies: string;
  allergiesDetail: string;
  currentMedsList: string;
  /* GLP-1 history detail (MDI Q3, Q5–Q12) */
  glp1Current: string;            // currently/past 2 months
  glp1Drug: string;               // semaglutide | tirzepatide | none
  semaDose: string;
  tirzDose: string;
  doseDirection: string;          // stay | increase | decrease
  medAvailable: string;
  medPhotoName: string;
  sideEffects: string;
  sideEffectsDetail: string;
  /* Disclaimer acknowledgment (MDI Q18) */
  disclaimerAck: boolean;
};

const initial: IntakeData = {
  firstName: "", lastName: "", gender: "", dateOfBirth: "",
  heightFeet: "", heightInches: "", currentWeight: "", lbsToLose: "",
  hardConditions: [], softConditions: [],
  opiateUse: "", priorSurgery: "", onPrescriptions: "",
  bloodPressure: "", heartRate: "",
  paceFeeling: "", priorMedication: "",
  priority: "", deliveryPreference: "",
  additionalInfo: "",
  personalizations: [],
  state: "", email: "", phone: "",
  consentAccepted: false, smsConsent: true, emailConsent: true,
  medicationChoice: "", medicationForm: "",
  gastricBypass6mo: "", glp1Allergy: "", disqualifyingMeds: "",
  pregnant: "", breastfeeding: "",
  allergies: "", allergiesDetail: "", currentMedsList: "",
  glp1Current: "", glp1Drug: "", semaDose: "", tirzDose: "",
  doseDirection: "", medAvailable: "", medPhotoName: "",
  sideEffects: "", sideEffectsDetail: "",
  disclaimerAck: false,
};

/* ───── Options ───── */
const hardConditionOptions = [
  "None of the below",
  "End-stage kidney disease or dialysis",
  "End-stage liver disease or cirrhosis",
  "Active suicidal ideation or prior attempt",
  "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years — does not apply to non-melanoma skin cancer cured via simple excision)",
  "Severe GI condition (gastroparesis, bowel obstruction, IBD)",
  "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence",
  "Diabetic retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness",
  "Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2",
  "Family history of medullary thyroid cancer",
  "MEN 2 syndrome (multiple endocrine neoplasia type 2)",
  "Eating disorder (bulimia, anorexia, or binge eating disorder)",
  "Suicidal thoughts or self-harm in the past 12 months",
  "Polycystic ovarian syndrome (PCOS) with active fertility concerns",
];

const softConditionOptions = [
  "None of the below",
  "Gallbladder disease", "Hypertension (high blood pressure)", "Seizure disorder", "Glaucoma",
  "Sleep apnea", "Type 2 diabetes (not on insulin)", "Type 2 diabetes (on insulin)", "Type 1 diabetes",
  "Use of warfarin (Coumadin/Jantoven)", "History of or current pancreatitis", "Gout",
  "High cholesterol or triglycerides", "Depression", "Head injury", "Tumor/infection in brain/spinal cord",
  "Low sodium", "Liver disease, including fatty liver", "Kidney disease",
  "Elevated resting heart rate (tachycardia)", "Coronary artery disease or heart attack/stroke in last 2 years",
  "Allergic to any medication", "Congestive heart failure", "QT prolongation or other heart rhythm disorder",
  "Hospitalization within the last 1 year", "Human immunodeficiency virus (HIV)", "Acid reflux",
  "Asthma/reactive airway disease", "Urinary stress incontinence", "Polycystic ovarian syndrome (PCOS)",
  "Clinically proven low testosterone", "Osteoarthritis", "Constipation",
];

const bloodPressureOptions = [
  { label: "Below 120/80 — Normal", value: "normal" },
  { label: "120–129 / below 80 — Elevated", value: "elevated" },
  { label: "130–139 / 80–89 — High (Stage 1)", value: "high_1" },
  { label: "140/90 or above — High (Stage 2)", value: "high_2" },
];

const heartRateOptions = [
  { label: "Under 60 bpm — Below average", value: "slow" },
  { label: "60–100 bpm — Normal range", value: "normal" },
  { label: "101–110 bpm — Slightly elevated", value: "slightly_fast" },
  { label: "Above 110 bpm — Elevated", value: "fast" },
];

const paceOptions = [
  { label: "That timeline works for me", icon: Check },
  { label: "I'd prefer faster results", icon: Zap },
  { label: "That feels a bit aggressive", icon: Clock },
];

const priorMedOptions = [
  "Yes — I've used a GLP-1 medication before",
  "Yes — I've used a different weight loss medication",
  "No — I haven't taken weight loss medication",
];

const priorityOptions = [
  { label: "Affordability", sub: "Best value for my budget", value: "affordability", icon: CreditCard },
  { label: "Maximum effectiveness", sub: "Strongest available option", value: "potency", icon: Flame },
];

const deliveryOptions = [
  { label: "Weekly injection", sub: "One simple injection per week", value: "injection", icon: Syringe },
  { label: "Daily dissolvable tablet", sub: "One tablet each morning", value: "tablet", icon: Pill },
];

const personalizationOptions = [
  { label: "Preserving lean muscle during weight loss", icon: Dumbbell },
  { label: "Non-injection delivery method preferred", icon: Pill },
  { label: "Minimizing potential side effects (nausea, etc.)", icon: Shield },
  { label: "Anti-aging and cellular health benefits", icon: Leaf },
  { label: "Sharper focus and mental clarity", icon: Brain },
  { label: "Higher daily energy levels", icon: Sun },
  { label: "Hormonal balance and cycle regulation", icon: Activity },
  { label: "Better sleep quality", icon: Moon },
  { label: "I'd like to discuss options with a clinician", icon: MessageCircle },
];

const lbsPresets = [5, 20, 45, 85, 130];

/* Step 0 = hero/landing, Step 1 = personal info, Step 2-10 = old steps 1-9, Step 11 = approval */
const TOTAL_STEPS = 12;

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const journeySteps = [
  { step: 1, title: "Take the medical questionnaire", desc: "Start today with our easy online patient intake form", image: glpPhoneConsult },
  { step: 2, title: "Get prescribed", desc: "All prescriptions overseen by fully licensed and insured physicians. Currently 3 Telemed Doctor Consultations Available Today (100% included with your purchase)", image: glpDoctor },
  { step: 3, title: "Get your meds", desc: "Our pharmacy will compound your medication and deliver it direct to your door!", image: glpDelivery },
];

const heroImages = [
  glpHeroDefault, glpHero1, healthScreeningHeart, glpHero3, glpHero4, glpHeroStep5New,
  glpMedicationsLineup, glpHeroDna, glpHeroWellness, glpHero3, glpHero4, glpHero5,
];

/* ───── Animated heartbeat icon ───── */
function AnimatedHeartbeat() {
  return (
    <motion.div className="flex justify-center my-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <motion.div animate={{ scale: [1, 1.2, 1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <HeartPulse className="w-7 h-7 text-primary" />
      </motion.div>
    </motion.div>
  );
}

/* ───── Page-level animation variants ───── */
const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

const staggerContainer = { animate: { transition: { staggerChildren: 0.06 } } };
const staggerItem = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ───── Yellow info banner component ───── */
function YellowBanner({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-[hsl(38,45%,93%)] dark:bg-[hsl(38,30%,15%)] border border-[hsl(38,40%,80%)] p-6 mb-6 text-center">
      {children}
    </motion.div>
  );
}

/* ───── Countdown Timer ───── */
function CountdownTimer({ name }: { name: string }) {
  const [seconds, setSeconds] = useState(647);
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, []);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full bg-[hsl(80,25%,55%)] text-white text-center py-2.5 text-sm font-bold uppercase tracking-widest">
      {name}'s approval valid for {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </motion.div>
  );
}

/* ───── FAQ Item ───── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[48px]" aria-expanded={open} aria-label={q}>
        <span className="text-sm font-semibold text-foreground">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-sm text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───── Styled select dropdown ───── */
const selectClass = "w-full px-6 py-4 rounded-full border border-foreground/40 bg-background text-foreground text-base font-medium focus:outline-none focus:border-primary focus:border-2 appearance-none transition-all cursor-pointer min-h-[56px]";

/* ───── Question title ───── */
function QuestionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-black text-primary mb-3 tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
      {children}
    </h3>
  );
}

/* ───── Inline error message ───── */
function FieldError({ message }: { message: string }) {
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive font-medium mt-1.5 flex items-center gap-1">
      <AlertTriangle className="w-3.5 h-3.5" /> {message}
    </motion.p>
  );
}

export default function GLPIntakeForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityOutput | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [analyzingResults, setAnalyzingResults] = useState(false);
  const [dbReviews, setDbReviews] = useState<{ name: string; review_text: string; stars: number }[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [checkoutKey, setCheckoutKey] = useState(0);
  const [userId, setUserId] = useState("");

  /* ── Auto-save & resume ── */
  useEffect(() => {
    const saved = localStorage.getItem(INTAKE_FORM_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step > 0 || parsed.data?.firstName) {
          setShowResumePrompt(true);
        }
      } catch {}
    }
  }, []);

  const resumeProgress = () => {
    const saved = localStorage.getItem(INTAKE_FORM_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restoredData = { ...initial, ...(parsed.data || {}) };
        const restoredStep = Number.isFinite(parsed.step)
          ? Math.min(Math.max(Number(parsed.step), 0), TOTAL_STEPS - 1)
          : 1;

        setData(restoredData);
        setStep(restoredStep);
        if (restoredStep === TOTAL_STEPS - 1) {
          setEligibility(calculateEligibility(restoredData));
        }
      } catch {
        localStorage.removeItem(INTAKE_FORM_KEY);
        toast({ title: "Saved application reset", description: "We couldn't restore the saved form, so you can start again safely." });
        setStep(0);
      }
    }
    setShowResumePrompt(false);
  };

  const startFresh = () => {
    localStorage.removeItem(INTAKE_FORM_KEY);
    setShowResumePrompt(false);
  };

  /* Save form state to localStorage on changes */
  useEffect(() => {
    if (step > 0 || data.firstName) {
      localStorage.setItem(INTAKE_FORM_KEY, JSON.stringify({ step, data }));
    }
  }, [step, data]);

  /* Fetch reviews from database */
  useEffect(() => {
    supabase
      .from("site_reviews")
      .select("name, review_text, stars")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setDbReviews(data);
      });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ""));
  }, []);

  useSEOHead({
    title: "GLP-1 Weight Loss Prescription Online — Youth & Soul",
    description: "Get prescribed Semaglutide/Ozempic® or Tirzepatide online. Doctor-guided GLP-1 weight loss starting at $125/mo. No hidden fees, free shipping, HSA/FSA eligible.",
    path: "/weightloss-glp-intake",
    keywords: "GLP-1 weight loss, semaglutide online, ozempic prescription, tirzepatide online, weight loss medication, telehealth weight loss, compounded semaglutide, GLP-1 injections",
  });

  const update = <K extends keyof IntakeData>(field: K, value: IntakeData[K]) => {
    setShowErrors(false);
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "hardConditions" | "softConditions" | "personalizations", value: string) => {
    setShowErrors(false);
    setData((prev) => {
      const arr = prev[field] as string[];
      const noneVals = ["None of the below"];
      if (noneVals.includes(value)) return { ...prev, [field]: arr.includes(value) ? [] : [value] };
      const filtered = arr.filter((v) => !noneVals.includes(v));
      return { ...prev, [field]: filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value] };
    });
  };

  const name = data.firstName || "there";
  const weightLossProgram = telehealthPrograms.find((program) => program.slug === "weight-loss");

  /* ── Derived calcs ── */
  const totalInches = heightToInches(parseInt(data.heightFeet) || 0, parseInt(data.heightInches) || 0);
  const bmi = useMemo(() => calculateBMI(parseFloat(data.currentWeight) || 0, totalInches), [data.currentWeight, totalInches]);
  const lbsToLoseNum = parseFloat(data.lbsToLose) || 0;
  const goalWeight = Math.max(0, (parseFloat(data.currentWeight) || 0) - lbsToLoseNum);
  const weightToLose = lbsToLoseNum;
  const currentW = parseFloat(data.currentWeight) || 0;
  const weeksToGoal = useMemo(() => estimateWeeksToGoal(currentW, goalWeight), [data.currentWeight, goalWeight]);

  const calculateEligibility = (input: IntakeData) => {
    const noneVals = ["None of the below"];
    const inputTotalInches = heightToInches(parseInt(input.heightFeet) || 0, parseInt(input.heightInches) || 0);
    const inputBmi = calculateBMI(parseFloat(input.currentWeight) || 0, inputTotalInches);
    const inputCurrentWeight = parseFloat(input.currentWeight) || 0;
    const inputGoalWeight = Math.max(0, inputCurrentWeight - (parseFloat(input.lbsToLose) || 0));
    const inputWeeksToGoal = estimateWeeksToGoal(inputCurrentWeight, inputGoalWeight);
    const allConditions = [
      ...input.hardConditions.filter(c => !noneVals.includes(c)),
      ...(input.opiateUse === "yes" ? ["Active substance use disorder or dependence"] : []),
      ...(input.gastricBypass6mo === "yes" ? ["Recent gastric bypass (within 6 months)"] : []),
      ...(input.glp1Allergy === "yes" ? ["Allergic to GLP-1 medications (Ozempic/Wegovy/Zepbound/Mounjaro/Saxenda)"] : []),
      ...(input.disqualifyingMeds === "yes" ? ["Taking medications that interact with GLP-1 therapy"] : []),
      ...(input.pregnant === "yes" || input.breastfeeding === "yes" ? ["Pregnant, breastfeeding, or trying to conceive"] : []),
    ];
    const comorbidities = input.softConditions.filter(c => !noneVals.includes(c));
    const triedBefore = input.priorMedication !== "No — I haven't taken weight loss medication";
    const result = evaluateEligibility(inputBmi, allConditions, comorbidities, triedBefore, input.priority === "potency" ? "high" : "moderate", input.bloodPressure, input.heartRate);
    result.estimatedWeeks = inputWeeksToGoal;
    result.bmi = inputBmi;
    return result;
  };

  const runEligibility = () => {
    const result = calculateEligibility(data);
    setEligibility(result);
  };

  /* ── Save user data to localStorage for cross-form pre-fill ── */
  useEffect(() => {
    if (data.firstName || data.email) {
      const shareData = { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone, dateOfBirth: data.dateOfBirth, gender: data.gender, state: data.state };
      localStorage.setItem(INTAKE_DATA_KEY, JSON.stringify(shareData));
    }
  }, [data.firstName, data.lastName, data.email, data.phone, data.dateOfBirth, data.gender, data.state]);

  /* ── Validation per step ── */
  const getStepErrors = (): string[] => {
    const errors: string[] = [];
    switch (step) {
      case 0: break; // Hero page, no validation
      case 1:
        if (!data.firstName) errors.push("firstName");
        if (!data.lastName) errors.push("lastName");
        if (!data.gender) errors.push("gender");
        if (!data.heightFeet) errors.push("heightFeet");
        if (!data.currentWeight) errors.push("currentWeight");
        if (!data.lbsToLose) errors.push("lbsToLose");
        break;
      case 2: if (data.hardConditions.length === 0) errors.push("hardConditions"); break;
      case 3:
        if (data.softConditions.length === 0) errors.push("softConditions");
        if (!data.bloodPressure) errors.push("bloodPressure");
        if (!data.heartRate) errors.push("heartRate");
        if (!data.gastricBypass6mo) errors.push("gastricBypass6mo");
        if (!data.glp1Allergy) errors.push("glp1Allergy");
        if (!data.disqualifyingMeds) errors.push("disqualifyingMeds");
        if (data.gender === "Female") {
          if (!data.pregnant) errors.push("pregnant");
          if (!data.breastfeeding) errors.push("breastfeeding");
        }
        break;
      case 4: if (!data.paceFeeling) errors.push("paceFeeling"); break;
      case 5:
        if (!data.priorMedication) errors.push("priorMedication");
        if (!data.glp1Current) errors.push("glp1Current");
        if (data.glp1Current === "yes") {
          if (!data.glp1Drug) errors.push("glp1Drug");
          if (data.glp1Drug === "semaglutide" && !data.semaDose) errors.push("semaDose");
          if (data.glp1Drug === "tirzepatide" && !data.tirzDose) errors.push("tirzDose");
          if (data.glp1Drug && data.glp1Drug !== "none" && !data.doseDirection) errors.push("doseDirection");
          if (data.glp1Drug && data.glp1Drug !== "none" && !data.medAvailable) errors.push("medAvailable");
          if (!data.sideEffects) errors.push("sideEffects");
          if (data.sideEffects === "yes" && !data.sideEffectsDetail.trim()) errors.push("sideEffectsDetail");
        }
        if (!data.allergies) errors.push("allergies");
        if (data.allergies === "yes" && !data.allergiesDetail.trim()) errors.push("allergiesDetail");
        if (data.onPrescriptions === "yes" && !data.currentMedsList.trim()) errors.push("currentMedsList");
        break;
      case 6: if (!data.priority || !data.deliveryPreference) errors.push("priority"); break;
      case 7: break; // Additional info, optional
      case 8: if (data.personalizations.length === 0) errors.push("personalizations"); break;
      case 9: break; // Medical review, always passable
      case 10:
        if (!data.email) errors.push("email");
        if (!data.state) errors.push("state");
        if (!data.consentAccepted) errors.push("consent");
        break;
      case 11: break;
    }
    return errors;
  };

  const canNext = () => getStepErrors().length === 0;

  const handleNext = () => {
    if (!canNext()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setTransitioning(true);

    const isGoingToMedicalReview = step === 8;

    setTimeout(() => {
      if (isGoingToMedicalReview) runEligibility();
      setStep(step + 1);
      setTransitioning(false);

      if (isGoingToMedicalReview) {
        setAnalyzingResults(true);
        setTimeout(() => setAnalyzingResults(false), 2800);
      }
    }, 1200);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const { error } = await supabase.from("enrollments").insert({
        first_name: data.firstName, last_name: data.lastName, email: data.email, phone: data.phone || null,
        date_of_birth: data.dateOfBirth || null, state: data.state || null, gender: data.gender || null,
        program_slug: "weight-loss", tier_name: "GLP-1 Program", tier_label: "GLP-1",
        monthly_price: data.medicationChoice === "tirzepatide" ? 135 : 125,
        medical_conditions: [...data.hardConditions, ...data.softConditions].join(", "),
        previous_treatments: data.priorMedication || null, allergies: null,
        current_medications: data.onPrescriptions === "yes" ? "Patient reports current prescriptions" : null,
        sms_consent: data.smsConsent,
        email_consent: data.emailConsent,
        user_id: authData.user?.id || null,
      } as any);
      if (error) throw error;

      const notificationPromises: Promise<unknown>[] = [];

      if (data.smsConsent && data.phone) {
        notificationPromises.push(
          supabase.functions.invoke("send-enrollment-notifications", {
            body: {
              type: "welcome_link",
              firstName: data.firstName,
              phone: data.phone,
                programSlug: "weight-loss",
                programTitle: "GLP-1 Weight Loss",
            },
          })
        );
      }

      if (data.emailConsent && data.email) {
        notificationPromises.push(
          supabase.functions.invoke("send-enrollment-notifications", {
            body: {
                type: "enrollment_welcome",
              firstName: data.firstName,
              email: data.email,
                programSlug: "weight-loss",
                programTitle: "GLP-1 Weight Loss",
            },
          })
        );
      }

      if (notificationPromises.length > 0) {
        Promise.allSettled(notificationPromises).catch((err) => console.error("Notification send error:", err));
      }

      // Clear saved form on successful submit
      localStorage.removeItem(INTAKE_FORM_KEY);
    } catch {
      toast({ title: "Error saving", description: "We'll still proceed.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const currentHero = heroImages[step] || glpHeroDefault;

  /* Scroll to top on step change */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  /* ───── Big greeting — Nunito rounded ───── */
  const BigGreeting = ({ subtitle }: { subtitle?: string }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-black text-primary mb-1" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
        Hi {data.firstName}
      </motion.p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );

  /* ───── Transition loading messages ───── */
  const transitionMessages = ["Saving your responses...", "Analyzing your profile...", "Preparing next section...", "Reviewing your information...", "Almost ready..."];
  const transitionMsg = transitionMessages[step % transitionMessages.length];

  const monthsToGoal = Math.ceil(weeksToGoal / 4);
  const stepErrors = showErrors ? getStepErrors() : [];
  const intakeProgress = step > 0 ? Math.round((step / (TOTAL_STEPS - 1)) * 100) : 0;
  const requiredFieldCopy: Record<string, string> = {
    firstName: "first name", lastName: "last name", gender: "gender", heightFeet: "height",
    currentWeight: "current weight", lbsToLose: "weight-loss goal", hardConditions: "health history",
    softConditions: "health details", bloodPressure: "blood pressure", heartRate: "heart rate",
    paceFeeling: "pace preference", priorMedication: "medication history", priority: "treatment priority",
    personalizations: "personalization choices", email: "email", state: "shipping state", consent: "consent",
  };
  const missingFields = stepErrors.map((error) => requiredFieldCopy[error] || error).join(", ");
  const projectedMilestones = [
    { label: "Today", value: currentW || 0, accent: false },
    { label: "Month 1", value: Math.max(goalWeight, Math.round((currentW || 0) - Math.min(weightToLose, 14))), accent: false },
    { label: "Month 3", value: Math.max(goalWeight, Math.round((currentW || 0) - Math.min(weightToLose, 42))), accent: false },
    { label: "Goal", value: goalWeight || 0, accent: true },
  ];

  const reviews = dbReviews.length > 0
    ? dbReviews.map(r => ({ name: r.name, text: r.review_text, rating: r.stars }))
    : defaultReviews;

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <MobileHeader />

      {step === 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <img src={glpIntakeBanner} alt="" className="h-full w-full object-cover opacity-10 blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        </div>
      )}

      {/* ── Resume prompt ── */}
      <AnimatePresence>
        {showResumePrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/90 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border space-y-4">
              <h3 className="text-xl font-black text-foreground" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Welcome Back!</h3>
              <p className="text-sm text-muted-foreground">You have a saved application in progress. Would you like to resume where you left off?</p>
              <div className="flex gap-3">
                <button onClick={resumeProgress} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold" aria-label="Resume saved progress">
                  Resume
                </button>
                <button onClick={startFresh} className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors" aria-label="Start a new application">
                  Start Fresh
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Transition overlay between steps ── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center gap-6">
            <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <HeartPulse className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-semibold text-foreground">{transitionMsg}</motion.p>
            <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} className="h-full bg-primary rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 max-w-2xl mx-auto px-4 pt-4 md:pt-8 w-full pb-24 md:pb-8">

        {/* Hero image — changes per step (hide on step 0, 10 & 11) */}
        {step > 1 && step < 10 && (
          <motion.div key={`hero-${step}`} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="rounded-2xl overflow-hidden mb-4">
            <img src={currentHero} alt="GLP-1 Weight Loss Program" width={1024} height={512} className="w-full h-auto object-cover" />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={`step-${step}`} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">

        {/* ═══ STEP 0: Hero Landing ═══ */}
        {step === 0 && (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden bg-[hsl(140,30%,92%)]">
              <img
                src={glpIntakeBanner}
                alt="Doctor-guided GLP-1 weight loss program from Youth and Soul — personalized care, free shipping, no hidden fees"
                width={1024}
                height={512}
                className="block w-full aspect-[2/1] object-cover"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
              <h1 className="text-[2rem] leading-[1.08] md:text-6xl md:leading-[1.05] font-black text-primary mb-4 md:mb-5 tracking-tight text-center" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                Finally serious about weight loss?
                <span className="block mt-2">
                  Fat loss <span className="relative inline-block text-primary italic">
                    made easy
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0,3 Q25,0 50,3 T100,3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
                <span className="block mt-2 text-[1.5rem] md:text-3xl font-black text-foreground tracking-tight">with personalized care &amp; GLP-1 medication</span>
              </h1>
              <ul className="flex flex-col items-start gap-3 mb-6 px-2">
                {["Lose pounds of fat every week", "No membership or hidden fees — everything included. Refund available.", "Start for just $125, no insurance required + free shipping", "HSA/FSA Approved!"].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground leading-snug">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-left rounded-[2rem] bg-card border border-border shadow-lg px-5 py-4 transition-all hover:border-primary/30"
              aria-label="Start the weight loss intake"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black text-foreground leading-none mb-2">Weight Loss</h2>
                  <p className="text-sm md:text-base text-muted-foreground">GLP-1 peptides, Metformin &amp; proven solutions.</p>
                </div>
                <ArrowRight className="w-7 h-7 text-muted-foreground flex-shrink-0" />
              </div>
            </button>

            <div className="rounded-[2rem] overflow-hidden border border-border bg-card shadow-lg">
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={glpMetabolismWoman}
                  alt={weightLossProgram?.title || "Weight loss program preview"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-4 py-2 rounded-full bg-background/95 text-primary text-xs font-bold uppercase tracking-[0.18em]">
                  Most Popular
                </span>
                <div className="absolute left-5 right-5 bottom-5">
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                    {weightLossProgram?.title || "Weight Loss & Metabolic Reset"}
                  </h3>
                  <p className="text-sm md:text-base text-white/85">
                    {weightLossProgram?.subtitle || "GLP-1 Programs, Metabolic Boost & Appetite Control"}
                  </p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <p className="text-3xl md:text-4xl font-black text-primary leading-none">From $125/mo</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(weightLossProgram?.tiers || []).map((tier) => (
                    <span
                      key={tier.label}
                      className="px-3.5 py-1.5 rounded-full bg-secondary text-foreground text-sm font-semibold"
                    >
                      {tier.label}: {tier.priceLabel}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  className="w-full mt-6 py-4 bg-primary text-primary-foreground rounded-2xl text-base md:text-lg font-black transition-colors shadow-lg"
                  aria-label="Start your GLP-1 program"
                >
                  {weightLossProgram?.cta || "Start Your GLP-1 Program"} <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              </div>
            </div>

            {/* Stats — premium cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[hsl(140,30%,98%)] to-[hsl(140,25%,94%)] dark:from-[hsl(140,15%,12%)] dark:via-[hsl(140,15%,10%)] dark:to-[hsl(140,15%,8%)] p-5 md:p-6 border border-primary/15 shadow-[0_2px_12px_-4px_hsl(140,40%,30%,0.12)] hover:shadow-[0_8px_28px_-8px_hsl(140,40%,30%,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* decorative corner number */}
                  <span aria-hidden className="absolute -top-3 -right-2 text-[5rem] md:text-[6rem] font-black leading-none text-primary/[0.06] select-none tracking-tighter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* icon halo */}
                  <div className="relative w-10 h-10 md:w-11 md:h-11 mb-3 rounded-full bg-primary/10 ring-4 ring-primary/5 flex items-center justify-center">
                    <s.icon className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary" strokeWidth={2.25} />
                  </div>
                  <p className="relative text-[2rem] md:text-[2.5rem] leading-none font-black text-foreground tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    {s.value}<span className="text-primary">{s.unit}</span>
                  </p>
                  <p className="relative text-[11px] md:text-xs text-muted-foreground mt-2 leading-snug">{s.label}</p>
                  {/* bottom accent line */}
                  <span aria-hidden className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </motion.div>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Join the lowest cost weight loss plans on the market.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              You'll enter your email and mobile before checkout so we can send your welcome text and approval updates.
            </p>
          </div>
        )}

        {/* ═══ STEP 1: Personal Info (split from old Step 0) ═══ */}
        {step === 1 && (
          <IntakeStepWrapper step={0} totalSteps={TOTAL_STEPS - 1}
            title="Let's get to know you"
            subtitle="Answer a few quick questions so we can personalize your weight loss plan.">
            <motion.div className="space-y-5" variants={staggerContainer} initial="initial" animate="animate">
              <AnimatePresence>
                {showErrors && stepErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3"
                  >
                    <p className="text-sm font-bold text-foreground">Almost there — complete {missingFields} to continue.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
                <div>
                  <QuestionTitle>First Name</QuestionTitle>
                  <input type="text" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Sarah"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-background text-foreground text-base font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px] ${stepErrors.includes("firstName") ? "border-destructive" : "border-border"}`}
                    style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}
                    aria-label="First name" />
                  {stepErrors.includes("firstName") && <FieldError message="First name is required" />}
                </div>
                <div>
                  <QuestionTitle>Last Name</QuestionTitle>
                  <input type="text" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Johnson"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-background text-foreground text-base font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px] ${stepErrors.includes("lastName") ? "border-destructive" : "border-border"}`}
                    style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}
                    aria-label="Last name" />
                  {stepErrors.includes("lastName") && <FieldError message="Last name is required" />}
                </div>
              </motion.div>

              <motion.div variants={staggerItem}>
                <QuestionTitle>Gender <span className="text-primary">*</span></QuestionTitle>
                <div className="flex gap-3">
                  {["Male", "Female"].map((g) => (
                    <button key={g} onClick={() => update("gender", g)} aria-label={`Select gender: ${g}`}
                      className={`flex-1 px-6 py-4 rounded-full border text-base font-bold transition-all min-h-[56px] ${data.gender === g ? "border-primary border-2 bg-primary/[0.04] text-foreground" : "border-foreground/40 text-muted-foreground hover:border-foreground"}`}>
                      {g}
                    </button>
                  ))}
                </div>
                {stepErrors.includes("gender") && <FieldError message="Please select your gender" />}
              </motion.div>

              <motion.div variants={staggerItem}>
                <QuestionTitle>What is your height?</QuestionTitle>
              </motion.div>
              <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wide">Feet</label>
                  <select value={data.heightFeet} onChange={(e) => update("heightFeet", e.target.value)} className={`${selectClass} ${stepErrors.includes("heightFeet") ? "!border-destructive" : ""}`} aria-label="Height in feet">
                    <option value="">Select</option>
                    {[4,5,6,7].map(f => <option key={f} value={String(f)}>{f}'</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-bold uppercase tracking-wide">Inches</label>
                  <select value={data.heightInches} onChange={(e) => update("heightInches", e.target.value)} className={selectClass} aria-label="Height in inches">
                    <option value="">Select</option>
                    {Array.from({length:12},(_,i)=>i).map(i => <option key={i} value={String(i)}>{i}"</option>)}
                  </select>
                </div>
              </motion.div>
              {stepErrors.includes("heightFeet") && <FieldError message="Please select your height" />}

              {/* ── Weight Slider & Calculator ── */}
              <motion.div variants={staggerItem}>
                <div className="pt-8 mt-2 border-t border-border">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Your Potential</span>
                  </div>

                  {/* Premium display title */}
                  <h3
                    className="text-foreground mb-4 leading-[0.95] tracking-[-0.02em]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    <span className="block text-[2.5rem] sm:text-5xl md:text-6xl font-medium italic text-muted-foreground/80">
                      Reach your
                    </span>
                    <span className="block text-[3.25rem] sm:text-6xl md:text-7xl font-bold text-foreground -mt-1">
                      goal weight
                    </span>
                    <span className="block text-[2.5rem] sm:text-5xl md:text-6xl font-medium italic mt-1">
                      <span className="relative inline-block text-primary">
                        faster.
                        <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M2 6 Q 50 1, 100 5 T 198 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/50" />
                        </svg>
                      </span>
                    </span>
                  </h3>

                  {/* Subtitle */}
                  <p className="text-base md:text-lg text-muted-foreground mb-7 leading-relaxed max-w-lg" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>
                    It's not magic—it's <em className="font-semibold text-foreground not-italic">metabolic science</em>. GLP-1 regulates appetite and blood sugar,{" "}
                    <strong className="text-primary font-bold">improving your metabolism</strong> and knocking out cravings.
                  </p>

                  {/* Calculator card */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(140,30%,97%)] via-white to-[hsl(140,25%,95%)] border border-primary/15 shadow-sm p-6 md:p-7">
                    {/* Decorative glow */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

                    <div className="relative">
                      <div className="flex items-end justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current weight</span>
                        <p className="text-4xl md:text-5xl font-black text-foreground leading-none">
                          {data.currentWeight || "200"}
                          <span className="text-base font-semibold text-muted-foreground ml-1">lbs</span>
                        </p>
                      </div>
                      <Slider
                        value={[parseFloat(data.currentWeight) || 200]}
                        onValueChange={(val) => update("currentWeight", String(val[0]))}
                        min={100}
                        max={400}
                        step={1}
                        className="mt-4 mb-2"
                      />
                      <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground/70 mb-6">
                        <span>100 lbs</span>
                        <span>400 lbs</span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

                      {/* Potential result */}
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">✨ You could lose</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Avg ~23% body weight on GLP-1*</p>
                        </div>
                        <p className="text-4xl md:text-5xl font-black text-primary leading-none">
                          {Math.round((parseFloat(data.currentWeight) || 200) * 0.23)}
                          <span className="text-base font-semibold text-primary/70 ml-1">lbs</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* My Current Weight */}
              <motion.div variants={staggerItem} className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-primary mb-3 text-center tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>My Current Weight</h3>
                  <div className={`relative rounded-2xl shadow-sm border bg-background overflow-hidden ${stepErrors.includes("currentWeight") ? "border-destructive" : "border-border/60"}`}>
                    <input type="number" value={data.currentWeight} onChange={(e) => update("currentWeight", e.target.value)} placeholder="200"
                      className="w-full px-5 py-5 bg-transparent text-foreground text-2xl font-bold focus:outline-none focus:ring-0 pr-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label="Current weight in pounds" />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">lbs</span>
                  </div>
                  {stepErrors.includes("currentWeight") && <FieldError message="Please enter your current weight" />}
                </div>
              </motion.div>

              {/* LBS to Lose */}
              <motion.div variants={staggerItem}>
                <h3 className="text-xl md:text-2xl font-black text-primary mb-3 text-center tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                  My Weight Loss Goal is...
                </h3>
                <div className={`p-5 bg-[hsl(152,40%,90%)] dark:bg-[hsl(152,35%,15%)] border-2 rounded-2xl shadow-md ${stepErrors.includes("lbsToLose") ? "border-destructive" : "border-[hsl(152,45%,70%)]"}`}>
                  <div className="relative rounded-xl shadow-sm border border-[hsl(152,45%,65%)] bg-background overflow-hidden">
                    <input type="number" value={data.lbsToLose} onChange={(e) => update("lbsToLose", e.target.value)} placeholder="20"
                      className="w-full px-5 py-4 bg-transparent text-foreground text-xl font-bold focus:outline-none focus:ring-0 pr-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label="Pounds to lose" />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">lbs</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {lbsPresets.map(lb => (
                      <button key={lb} onClick={() => update("lbsToLose", String(lb))} aria-label={`Set weight loss goal to ${lb} pounds`}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all min-h-[44px] ${
                          data.lbsToLose === String(lb)
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "border-[hsl(152,40%,60%)] bg-[hsl(152,40%,80%)]/40 text-foreground hover:border-primary"
                        }`}>
                        {lb === 130 ? "130+" : lb} lbs
                      </button>
                    ))}
                  </div>
                </div>
                {stepErrors.includes("lbsToLose") && <FieldError message="Please enter your weight loss goal" />}
              </motion.div>

              <motion.div variants={staggerItem}>
                <QuestionTitle>Date of Birth</QuestionTitle>
                <DateOfBirthPicker
                  value={data.dateOfBirth || ""}
                  onChange={(v) => update("dateOfBirth", v)}
                  hasError={stepErrors.includes("dateOfBirth")}
                  variant="intake"
                />
              </motion.div>
            </motion.div>
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 2: Hard Health Screening (old Step 1) ═══ */}
        {step === 2 && (
          <IntakeStepWrapper step={1} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Important health screening</QuestionTitle>
            <p className="text-sm text-muted-foreground mb-4">Please indicate if any of the following currently apply to you.</p>
            <YellowBanner>
              <p className="text-lg md:text-xl font-serif text-foreground">Your safety is our <span className="text-[hsl(38,50%,50%)] font-semibold">top priority</span></p>
            </YellowBanner>
            <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
              {hardConditionOptions.map((c) => (
                <motion.div key={c} variants={staggerItem}>
                  <OptionButton label={c} selected={data.hardConditions.includes(c)} onClick={() => toggleArray("hardConditions", c)} multi />
                </motion.div>
              ))}
            </motion.div>
            {stepErrors.includes("hardConditions") && <FieldError message="Please select at least one option" />}
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 3: Soft Conditions + Vitals (old Step 2) ═══ */}
        {step === 3 && (
          <IntakeStepWrapper step={2} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Tell us more about your health</QuestionTitle>
            <p className="text-sm text-muted-foreground mb-4">Select any conditions that apply, and share your vitals.</p>
            <YellowBanner>
              <p className="text-lg md:text-xl font-serif text-foreground">Help us personalize your <span className="text-[hsl(38,50%,50%)] font-semibold">care plan</span></p>
            </YellowBanner>
            <motion.div className="space-y-3 mb-6" variants={staggerContainer} initial="initial" animate="animate">
              {softConditionOptions.map((c) => (
                <motion.div key={c} variants={staggerItem}>
                  <OptionButton label={c} selected={data.softConditions.includes(c)} onClick={() => toggleArray("softConditions", c)} multi />
                </motion.div>
              ))}
            </motion.div>
            {stepErrors.includes("softConditions") && <FieldError message="Please select at least one option" />}

            <motion.div className="space-y-4 border-t border-border pt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div>
                <QuestionTitle>Have you used opiate pain medications in the last 3 months?</QuestionTitle>
                <div className="flex gap-3">
                  {["yes", "no"].map(v => (
                    <button key={v} onClick={() => update("opiateUse", v)} aria-label={`Opiate use: ${v}`}
                      className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.opiateUse === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <QuestionTitle>Any prior weight loss surgeries?</QuestionTitle>
                <div className="flex gap-3">
                  {["yes", "no"].map(v => (
                    <button key={v} onClick={() => update("priorSurgery", v)} aria-label={`Prior surgery: ${v}`}
                      className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.priorSurgery === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <QuestionTitle>Currently taking prescription medications?</QuestionTitle>
                <div className="flex gap-3">
                  {["yes", "no"].map(v => (
                    <button key={v} onClick={() => update("onPrescriptions", v)} aria-label={`On prescriptions: ${v}`}
                      className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.onPrescriptions === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                      {v === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <QuestionTitle>What is your blood pressure range? <span className="text-primary">*</span></QuestionTitle>
                <div className="space-y-3">
                  {bloodPressureOptions.map(o => (
                    <OptionButton key={o.value} label={o.label} selected={data.bloodPressure === o.value} onClick={() => update("bloodPressure", o.value)} />
                  ))}
                </div>
                {stepErrors.includes("bloodPressure") && <FieldError message="Please select your blood pressure range" />}
              </div>

              <div>
                <QuestionTitle>What is your average resting heart rate? <span className="text-primary">*</span></QuestionTitle>
                <div className="space-y-3">
                  {heartRateOptions.map(o => (
                    <OptionButton key={o.value} label={o.label} selected={data.heartRate === o.value} onClick={() => update("heartRate", o.value)} />
                  ))}
                </div>
                {stepErrors.includes("heartRate") && <FieldError message="Please select your heart rate range" />}
              </div>

              {/* ─── Critical safety blockers (MDI gating questions) ─── */}
              <div className="border-t border-border pt-5 space-y-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary font-bold">Safety screening</p>

                {[
                  { field: "gastricBypass6mo" as const, q: "Have you had a gastric bypass in the past 6 months?" },
                  { field: "glp1Allergy" as const, q: "Are you allergic to any GLP-1 medication (Ozempic, Wegovy, Zepbound, Mounjaro, or Saxenda)?" },
                  { field: "disqualifyingMeds" as const, q: "Do you take any medications that interact with GLP-1 therapy (e.g. insulin, sulfonylureas, or other weight-loss drugs)?" },
                ].map(({ field, q }) => (
                  <div key={field}>
                    <QuestionTitle>{q} <span className="text-primary">*</span></QuestionTitle>
                    <div className="flex gap-3">
                      {["yes", "no"].map(v => (
                        <button key={v} onClick={() => update(field, v)} aria-label={`${field}: ${v}`}
                          className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data[field] === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                          {v === "yes" ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                    {stepErrors.includes(field) && <FieldError message="Please select an answer" />}
                  </div>
                ))}

                {data.gender === "Female" && (
                  <>
                    {[
                      { field: "pregnant" as const, q: "Are you currently pregnant or planning to become pregnant soon?" },
                      { field: "breastfeeding" as const, q: "Are you currently breastfeeding?" },
                    ].map(({ field, q }) => (
                      <div key={field}>
                        <QuestionTitle>{q} <span className="text-primary">*</span></QuestionTitle>
                        <div className="flex gap-3">
                          {["yes", "no"].map(v => (
                            <button key={v} onClick={() => update(field, v)} aria-label={`${field}: ${v}`}
                              className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data[field] === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                              {v === "yes" ? "Yes" : "No"}
                            </button>
                          ))}
                        </div>
                        {stepErrors.includes(field) && <FieldError message="Please select an answer" />}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 4: Weight Loss Pace (old Step 3) ═══ */}
        {step === 4 && (
          <IntakeStepWrapper step={3} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Your projected weight loss timeline</QuestionTitle>
            <p className="text-sm text-muted-foreground mb-4">With treatment, most patients lose 3–4 lbs per week.</p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(152,45%,45%)]/10 via-[hsl(152,45%,45%)]/5 to-[hsl(145,40%,95%)] dark:from-primary/20 dark:via-primary/10 dark:to-green-950/30 border border-[hsl(152,45%,45%)]/20 p-6 mb-8">
              <div className="absolute top-3 right-3">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Scale className="w-14 h-14 text-[hsl(152,45%,45%)]/20" />
                </motion.div>
              </div>
              <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Your Projected Journey</p>
              <p className="text-base text-foreground mb-3">
                to reach <span className="font-black text-primary text-lg">{goalWeight} lbs</span> from <span className="font-bold">{data.currentWeight} lbs</span>
              </p>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-background/80 rounded-xl p-4 text-center mb-2">
                <p className="text-lg text-muted-foreground font-medium mb-1">within</p>
                <span className="text-5xl md:text-6xl font-black text-primary">~{weeksToGoal.toFixed(1)}</span>
                <p className="text-lg font-medium text-muted-foreground mt-1">weeks</p>
              </motion.div>
              <div className="flex gap-3">
                <div className="flex-1 bg-background/70 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-primary">{weightToLose}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">lbs to lose</p>
                </div>
                <div className="flex-1 bg-background/70 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-foreground">~3-4</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">lbs/week</p>
                </div>
              </div>
            </motion.div>

            <QuestionTitle>How does that pace feel to you?</QuestionTitle>
            <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
              {paceOptions.map(p => {
                const Icon = p.icon;
                return (
                  <motion.div key={p.label} variants={staggerItem}>
                    <button onClick={() => update("paceFeeling", p.label)} aria-label={`Pace feeling: ${p.label}`}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-center gap-3 min-h-[48px] ${
                        data.paceFeeling === p.label ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40 hover:bg-secondary/30"
                      }`}>
                      <Icon className={`w-5 h-5 shrink-0 ${data.paceFeeling === p.label ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium text-foreground">{p.label}</span>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
            {stepErrors.includes("paceFeeling") && <FieldError message="Please select how the pace feels" />}

            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[hsl(160,10%,97%)] rounded-2xl p-4 flex flex-col items-center">
                  <img src={semaglutideProduct} alt="Semaglutide/Ozempic®" className="w-full max-w-[140px] h-auto object-contain mb-2" loading="lazy" />
                  <h4 className="text-sm font-bold text-foreground">Semaglutide/Ozempic®</h4>
                  <p className="text-[10px] text-muted-foreground text-center">Same active ingredient in Ozempic®</p>
                </div>
                <div className="bg-[hsl(160,10%,97%)] rounded-2xl p-4 flex flex-col items-center">
                  <img src={tirzepatideProduct} alt="Tirzepatide" className="w-full max-w-[140px] h-auto object-contain mb-2" loading="lazy" />
                  <h4 className="text-sm font-bold text-foreground">Tirzepatide</h4>
                  <p className="text-[10px] text-muted-foreground text-center">Same active ingredient in Mounjaro®</p>
                </div>
              </div>
            </div>
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 5: GLP-1 history, current meds, allergies (MDI Q3, Q5–Q15) ═══ */}
        {step === 5 && (
          <IntakeStepWrapper step={4} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Have you used weight loss medication in the past 4 weeks?</QuestionTitle>
            <YellowBanner>
              <p className="text-lg md:text-xl font-serif text-foreground">Your history helps us choose the <span className="text-[hsl(38,50%,50%)] font-semibold">right dose</span></p>
            </YellowBanner>
            <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
              {priorMedOptions.map(m => (
                <motion.div key={m} variants={staggerItem}>
                  <OptionButton label={m} selected={data.priorMedication === m} onClick={() => update("priorMedication", m)} />
                </motion.div>
              ))}
            </motion.div>
            {stepErrors.includes("priorMedication") && <FieldError message="Please select an option" />}

            {/* ── Q3: Currently on a GLP-1? ── */}
            <div className="mt-8 pt-6 border-t border-border">
              <QuestionTitle>Are you currently taking — or have you taken in the past 2 months — a GLP-1 medication? <span className="text-primary">*</span></QuestionTitle>
              <div className="flex gap-3">
                {["yes", "no"].map(v => (
                  <button key={v} onClick={() => update("glp1Current", v)} aria-label={`GLP-1 current: ${v}`}
                    className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.glp1Current === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {stepErrors.includes("glp1Current") && <FieldError message="Please select an answer" />}
            </div>

            {/* ── Q5–Q12: GLP-1 detail (only if Yes) ── */}
            {data.glp1Current === "yes" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
                <div>
                  <QuestionTitle>Which GLP-1 medication are you currently on? <span className="text-primary">*</span></QuestionTitle>
                  <div className="space-y-3">
                    {[
                      { val: "semaglutide", label: "Semaglutide (Ozempic®, Wegovy®)" },
                      { val: "tirzepatide", label: "Tirzepatide (Mounjaro®, Zepbound®)" },
                      { val: "none", label: "None / other — please describe below" },
                    ].map(o => (
                      <OptionButton key={o.val} label={o.label} selected={data.glp1Drug === o.val} onClick={() => update("glp1Drug", o.val)} />
                    ))}
                  </div>
                  {stepErrors.includes("glp1Drug") && <FieldError message="Please select your current medication" />}
                </div>

                {data.glp1Drug === "semaglutide" && (
                  <div>
                    <QuestionTitle>Current Semaglutide dose <span className="text-primary">*</span></QuestionTitle>
                    <div className="grid grid-cols-3 gap-2">
                      {["0.25 mg", "0.5 mg", "1.0 mg", "1.7 mg", "2.0 mg", "2.5 mg"].map(d => (
                        <button key={d} onClick={() => update("semaDose", d)} aria-label={`Semaglutide dose ${d}`}
                          className={`px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all min-h-[48px] ${data.semaDose === d ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10" : "border-border hover:border-primary/40"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                    {stepErrors.includes("semaDose") && <FieldError message="Please select your current dose" />}
                  </div>
                )}

                {data.glp1Drug === "tirzepatide" && (
                  <div>
                    <QuestionTitle>Current Tirzepatide dose <span className="text-primary">*</span></QuestionTitle>
                    <div className="grid grid-cols-3 gap-2">
                      {["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"].map(d => (
                        <button key={d} onClick={() => update("tirzDose", d)} aria-label={`Tirzepatide dose ${d}`}
                          className={`px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all min-h-[48px] ${data.tirzDose === d ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10" : "border-border hover:border-primary/40"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                    {stepErrors.includes("tirzDose") && <FieldError message="Please select your current dose" />}
                  </div>
                )}

                {data.glp1Drug && data.glp1Drug !== "none" && (
                  <>
                    <div>
                      <QuestionTitle>For your next prescription, would you like to: <span className="text-primary">*</span></QuestionTitle>
                      <div className="space-y-3">
                        {[
                          { val: "stay", label: "Stay at my current dose" },
                          { val: "increase", label: "Increase to the next dose" },
                          { val: "decrease", label: "Decrease to a lower dose" },
                        ].map(o => (
                          <OptionButton key={o.val} label={o.label} selected={data.doseDirection === o.val} onClick={() => update("doseDirection", o.val)} />
                        ))}
                      </div>
                      {stepErrors.includes("doseDirection") && <FieldError message="Please select an option" />}
                    </div>

                    <div>
                      <QuestionTitle>Do you currently have your medication on hand? <span className="text-primary">*</span></QuestionTitle>
                      <div className="flex gap-3">
                        {["yes", "no"].map(v => (
                          <button key={v} onClick={() => update("medAvailable", v)} aria-label={`Med available: ${v}`}
                            className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.medAvailable === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                            {v === "yes" ? "Yes" : "No"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {data.medAvailable === "yes" && (
                      <div>
                        <QuestionTitle>Upload a photo of the medication label (optional)</QuestionTitle>
                        <p className="text-sm text-muted-foreground mb-2">Helps our clinician verify your current dose.</p>
                        <label className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-all min-h-[56px]">
                          <Package className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">
                            {data.medPhotoName || "Choose image…"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) update("medPhotoName", file.name);
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <QuestionTitle>Are you experiencing any side effects from your current GLP-1? <span className="text-primary">*</span></QuestionTitle>
                  <div className="flex gap-3">
                    {["yes", "no"].map(v => (
                      <button key={v} onClick={() => update("sideEffects", v)} aria-label={`Side effects: ${v}`}
                        className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.sideEffects === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                        {v === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                  {stepErrors.includes("sideEffects") && <FieldError message="Please select an answer" />}
                </div>

                {data.sideEffects === "yes" && (
                  <div>
                    <QuestionTitle>Please describe your side effects <span className="text-primary">*</span></QuestionTitle>
                    <textarea
                      value={data.sideEffectsDetail}
                      onChange={(e) => update("sideEffectsDetail", e.target.value)}
                      rows={3}
                      placeholder="e.g. nausea, fatigue, headaches…"
                      className="w-full px-5 py-3 rounded-2xl border border-foreground/40 bg-background text-foreground text-base focus:outline-none focus:border-primary focus:border-2 transition-all"
                    />
                    {stepErrors.includes("sideEffectsDetail") && <FieldError message="Please describe your side effects" />}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Q13: Current meds list (only if onPrescriptions = yes) ── */}
            {data.onPrescriptions === "yes" && (
              <div className="mt-8 pt-6 border-t border-border">
                <QuestionTitle>Please list your current prescription medications <span className="text-primary">*</span></QuestionTitle>
                <p className="text-sm text-muted-foreground mb-2">Include drug name and dose for each.</p>
                <textarea
                  value={data.currentMedsList}
                  onChange={(e) => update("currentMedsList", e.target.value)}
                  rows={4}
                  placeholder="e.g. Lisinopril 10 mg daily, Metformin 500 mg BID…"
                  className="w-full px-5 py-3 rounded-2xl border border-foreground/40 bg-background text-foreground text-base focus:outline-none focus:border-primary focus:border-2 transition-all"
                />
                {stepErrors.includes("currentMedsList") && <FieldError message="Please list your current medications" />}
              </div>
            )}

            {/* ── Q14/Q15: Allergies ── */}
            <div className="mt-8 pt-6 border-t border-border">
              <QuestionTitle>Do you have any medication or food allergies? <span className="text-primary">*</span></QuestionTitle>
              <div className="flex gap-3">
                {["yes", "no"].map(v => (
                  <button key={v} onClick={() => update("allergies", v)} aria-label={`Allergies: ${v}`}
                    className={`flex-1 px-4 py-3.5 rounded-2xl border-2 text-sm font-bold capitalize transition-all min-h-[48px] ${data.allergies === v ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                    {v === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {stepErrors.includes("allergies") && <FieldError message="Please select an answer" />}

              {data.allergies === "yes" && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Please list your allergies and reactions:</p>
                  <textarea
                    value={data.allergiesDetail}
                    onChange={(e) => update("allergiesDetail", e.target.value)}
                    rows={3}
                    placeholder="e.g. Penicillin — rash; shellfish — anaphylaxis…"
                    className="w-full px-5 py-3 rounded-2xl border border-foreground/40 bg-background text-foreground text-base focus:outline-none focus:border-primary focus:border-2 transition-all"
                  />
                  {stepErrors.includes("allergiesDetail") && <FieldError message="Please describe your allergies" />}
                </div>
              )}
            </div>

            {/* ── Q18: "What you should know" disclaimer ── */}
            <div className="mt-8 rounded-2xl bg-[hsl(38,45%,93%)] dark:bg-[hsl(38,30%,15%)] border border-[hsl(38,40%,80%)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[hsl(38,50%,40%)] font-bold mb-2">What you should know</p>
              <p className="text-sm text-foreground leading-relaxed">
                GLP-1 medications can cause nausea, vomiting, diarrhea, constipation, fatigue, gallbladder issues
                and (rarely) pancreatitis. They are not approved during pregnancy or breastfeeding.
                Your clinician will review your full history before prescribing. By continuing, you confirm the
                information you've provided is accurate to the best of your knowledge.
              </p>
              <label className="mt-3 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.disclaimerAck}
                  onChange={(e) => update("disclaimerAck", e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-foreground/40 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">I've read and understand the above.</span>
              </label>
            </div>
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 6: Priority & Delivery (old Step 5) ═══ */}
        {step === 6 && (
          <IntakeStepWrapper step={5} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Let's match you with the right medication</QuestionTitle>
            <p className="text-sm text-muted-foreground mb-4">Tell us what matters most so we can tailor your treatment.</p>

            <QuestionTitle>What's most important to you?</QuestionTitle>
            <motion.div className="space-y-3 mb-6" variants={staggerContainer} initial="initial" animate="animate">
              {priorityOptions.map(o => {
                const Icon = o.icon;
                return (
                  <motion.div key={o.value} variants={staggerItem}>
                    <button onClick={() => update("priority", o.value)} aria-label={`Priority: ${o.label}`}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center gap-4 min-h-[56px] ${data.priority === o.value ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-md" : "border-border hover:border-primary/40"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.priority === o.value ? "bg-[hsl(152,45%,45%)]/20" : "bg-secondary"}`}>
                        <Icon className={`w-5 h-5 ${data.priority === o.value ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground block">{o.label}</span>
                        <span className="text-xs text-muted-foreground">{o.sub}</span>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>

            <QuestionTitle>How would you prefer to take your medication?</QuestionTitle>
            <motion.div className="grid grid-cols-2 gap-3" variants={staggerContainer} initial="initial" animate="animate">
              {deliveryOptions.map(o => {
                const Icon = o.icon;
                return (
                  <motion.div key={o.value} variants={staggerItem}>
                    <button onClick={() => update("deliveryPreference", o.value)} aria-label={`Delivery: ${o.label}`}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition-all min-h-[80px] ${data.deliveryPreference === o.value ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40"}`}>
                      <Icon className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-bold text-foreground block">{o.label}</span>
                      <span className="text-xs text-muted-foreground">{o.sub}</span>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
            {stepErrors.includes("priority") && <FieldError message="Please select your priority and delivery preference" />}
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 7: Additional Info (old Step 6) ═══ */}
        {step === 7 && (
          <IntakeStepWrapper step={6} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <QuestionTitle>Anything else our medical team should know?</QuestionTitle>
            <YellowBanner>
              <p className="text-xl md:text-2xl font-serif text-foreground leading-snug">
                Youth&Soul medical providers review every form{" "}
                <span className="text-[hsl(38,50%,50%)] font-semibold italic">within 24 hours</span>
              </p>
            </YellowBanner>
            <motion.textarea initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              value={data.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none h-32"
              placeholder="Share any additional health information, concerns, or questions here (optional)..."
              aria-label="Additional health information" />
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 8: Personalizations (old Step 7) ═══ */}
        {step === 8 && (
          <IntakeStepWrapper step={7} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <YellowBanner>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground leading-snug">
                Your needs are <span className="text-[hsl(38,50%,50%)] font-semibold italic">unique</span>, and your medicine should be, too!
              </h2>
              <p className="text-sm text-muted-foreground mt-2">Your GLP-1 medication is personalized to your specific needs</p>
            </YellowBanner>
            <QuestionTitle>Select any areas you'd like your medication to address:</QuestionTitle>
            <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
              {personalizationOptions.map(p => {
                const Icon = p.icon;
                const isSelected = data.personalizations.includes(p.label);
                return (
                  <motion.div key={p.label} variants={staggerItem}>
                    <button onClick={() => toggleArray("personalizations", p.label)} aria-label={`Personalization: ${p.label}`}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-center gap-3 min-h-[48px] ${
                        isSelected ? "border-[hsl(152,45%,45%)] bg-[hsl(152,45%,45%)]/10 shadow-sm" : "border-border hover:border-primary/40 hover:bg-secondary/30"
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-[hsl(152,45%,45%)] shadow-md" : "bg-secondary border border-border"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium text-foreground">{p.label}</span>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
            {stepErrors.includes("personalizations") && <FieldError message="Please select at least one personalization" />}
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 9: Medical Review (old Step 8) ═══ */}
        {step === 9 && eligibility && (
          analyzingResults ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-6">
              <motion.div animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-10 h-10 text-primary" />
              </motion.div>
              <div className="text-center space-y-2">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black text-foreground">Analyzing your profile...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm text-muted-foreground">Our system is reviewing your medical information</motion.p>
              </div>
              <div className="w-56 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-primary to-[hsl(152,45%,45%)] rounded-full" />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                ))}
              </motion.div>
            </motion.div>
          ) : (
          <IntakeStepWrapper step={8} totalSteps={TOTAL_STEPS - 1} title="">
            <BigGreeting />
            <div className="text-center mb-8">
              <motion.div initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary/15 to-[hsl(152,45%,45%)]/15 rounded-full mb-4 border border-primary/20">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Activity className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Results Ready</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-black text-foreground tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                Your Medical Review
              </motion.h2>
            </div>

            <motion.div className="space-y-5" variants={staggerContainer} initial="initial" animate="animate">
              <motion.div variants={staggerItem} className="p-5 bg-[hsl(145,40%,95%)]/60 dark:bg-green-950/20 rounded-2xl border border-[hsl(152,45%,45%)]/30 space-y-4">
                {[
                  { label: "Body Mass Index", value: eligibility.bmi.toFixed(2) },
                  { label: "Current Weight", value: `${data.currentWeight} lbs` },
                  { label: "Goal Weight", value: `${goalWeight} lbs` },
                  { label: "Weight to Lose", value: `${weightToLose} lbs`, highlight: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm py-2 border-b border-[hsl(152,45%,45%)]/20">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={`font-black text-lg ${row.highlight ? "text-primary" : "text-foreground"}`}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-center items-center pt-2">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }} className="px-5 py-2.5 bg-primary/10 rounded-full">
                    <span className="text-sm text-primary font-bold">Estimated timeline: ~{weeksToGoal.toFixed(1)} weeks</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={staggerItem}
                className={`p-6 rounded-2xl border-2 ${
                  eligibility.result === "approved" ? "bg-[hsl(145,40%,95%)]/80 border-[hsl(152,45%,45%)]/50 dark:bg-green-950/30 dark:border-green-700"
                  : eligibility.result === "review" ? "bg-amber-50/80 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700"
                  : "bg-secondary border-border"
                }`}>
                <div className="flex items-start gap-3 mb-4">
                  {eligibility.result === "approved" ? <Sparkles className="w-6 h-6 text-[hsl(152,45%,45%)] shrink-0 mt-0.5" />
                    : eligibility.result === "review" ? <Heart className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-base font-black text-foreground">{eligibility.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">{eligibility.subMessage}</p>
                  </div>
                </div>
                {eligibility.result !== "not_eligible" && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Approval likelihood</span>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="font-black text-lg text-foreground">{eligibility.approvalProbability}%</motion.span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${eligibility.approvalProbability}%` }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${eligibility.approvalProbability >= 80 ? "bg-[hsl(152,45%,45%)]" : "bg-amber-500"}`} />
                    </div>
                  </div>
                )}
              </motion.div>

              {eligibility.result !== "not_eligible" && (
                <motion.div variants={staggerItem} className="space-y-4 border-t border-border pt-4">
                  <div>
                    <QuestionTitle>What state will your medication be shipped to? <span className="text-primary">*</span></QuestionTitle>
                    <select value={data.state} onChange={(e) => update("state", e.target.value)} className={selectClass} aria-label="Shipping state">
                      <option value="">Select your state</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                    <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">Your information is never shared and is protected by HIPAA.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </IntakeStepWrapper>
          )
        )}

        {/* ═══ STEP 10: Contact Info (old Step 9) ═══ */}
        {step === 10 && (
          <IntakeStepWrapper step={9} totalSteps={TOTAL_STEPS - 1} title="">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={glpOzempicWegovy} alt="Ozempic and Wegovy GLP-1 medications" className="w-full h-auto object-cover rounded-2xl" loading="lazy" />
            </div>
            <BigGreeting subtitle="Enter your mobile and email below so we can send your welcome text, approval link, and doctor updates before checkout." />

            <div className="rounded-2xl overflow-hidden mb-6 bg-[hsl(220,30%,12%)] text-white p-5">
              <h3 className="text-lg font-bold text-center text-white mb-1">
                Why are so many patients signing up? <span className="text-primary italic">It works.</span>
              </h3>
              <p className="text-center text-[hsl(220,10%,60%)] text-xs mb-4">On average, patients lose 15–20% of their body weight.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {heroStats.map((s) => (
                  <div key={s.label} className="bg-[hsl(220,25%,16%)] rounded-xl p-3 border border-[hsl(220,20%,25%)]">
                    <s.icon className="w-5 h-5 text-primary mb-1.5" />
                    <p className="text-2xl font-bold text-white">{s.value}<span className="text-primary">{s.unit}</span></p>
                    <p className="text-[10px] text-[hsl(220,10%,60%)]">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[hsl(220,25%,16%)] rounded-xl p-4 border border-[hsl(220,20%,25%)]">
                <div className="relative h-28">
                  <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="graphGrad9" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(260,70%,60%)" />
                        <stop offset="100%" stopColor="hsl(300,70%,60%)" />
                      </linearGradient>
                    </defs>
                    {[80, 160, 240, 320].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="hsl(220,20%,25%)" strokeWidth="1" strokeDasharray="4,4" />
                    ))}
                    <path d="M 0,15 C 80,18 120,35 200,50 C 280,65 340,78 400,85" fill="none" stroke="url(#graphGrad9)" strokeWidth="3" />
                    {[[0, 15], [100, 28], [200, 50], [300, 72], [370, 82]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="url(#graphGrad9)" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                    <span className="text-[10px] text-[hsl(220,10%,60%)]">Today</span>
                    <span className="text-[10px] text-[hsl(220,10%,60%)]">Goal</span>
                  </div>
                </div>
                <p className="text-[8px] text-[hsl(220,10%,45%)] mt-2">* Based on average weight loss in 68-week clinical trials of GLP-1 treatment.</p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-4" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
              {name}, where should we send your welcome text and email?
            </h2>

            <YellowBanner>
              <p className="text-lg font-serif text-foreground">We'll reach out <span className="text-[hsl(38,50%,50%)] font-semibold italic">within 24 hours</span> of your submission</p>
            </YellowBanner>

            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              <motion.div variants={staggerItem}>
                <QuestionTitle>Email <span className="text-primary">*</span></QuestionTitle>
                <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com"
                  className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-background text-foreground text-base font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px] ${stepErrors.includes("email") ? "border-destructive" : "border-border"}`}
                  aria-label="Email address" />
                {stepErrors.includes("email") && <FieldError message="Email is required" />}
              </motion.div>
              <motion.div variants={staggerItem}>
                <QuestionTitle>Phone Number</QuestionTitle>
                <input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-border bg-background text-foreground text-base font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[48px]"
                  aria-label="Phone number" />
              </motion.div>

              <motion.label variants={staggerItem} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${stepErrors.includes("consent") ? "bg-destructive/5 border-destructive/30" : "bg-secondary/50 border-border/50"}`}>
                <input type="checkbox" checked={data.consentAccepted} onChange={(e) => update("consentAccepted", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-primary text-primary accent-primary focus:ring-primary" style={{ accentColor: "hsl(152,45%,45%)" }}
                  aria-label="Accept consent" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I understand that my information is protected by HIPAA and I agree to the <a href="/terms" className="underline text-primary">terms</a> and <a href="/privacy" className="underline text-primary">privacy policy</a>.
                </span>
              </motion.label>
              {stepErrors.includes("consent") && <FieldError message="Please accept the consent to continue" />}

              <motion.label variants={staggerItem} className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer bg-secondary/50 border-border/50">
                <input type="checkbox" checked={data.smsConsent} onChange={(e) => update("smsConsent", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-primary text-primary accent-primary focus:ring-primary" style={{ accentColor: "hsl(152,45%,45%)" }}
                  aria-label="SMS consent" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to receive text messages (SMS) regarding appointments, treatment updates, and health tips from Youth & Soul. Msg & data rates may apply. Reply STOP to opt out anytime.
                </span>
              </motion.label>

              <motion.label variants={staggerItem} className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer bg-secondary/50 border-border/50">
                <input type="checkbox" checked={data.emailConsent} onChange={(e) => update("emailConsent", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-primary text-primary accent-primary focus:ring-primary" style={{ accentColor: "hsl(152,45%,45%)" }}
                  aria-label="Email consent" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to receive email communications including appointment reminders, health updates, and wellness tips from Youth & Soul. Unsubscribe anytime.
                </span>
              </motion.label>
              {stepErrors.includes("state") && <FieldError message="Please select your state in the previous step" />}
            </motion.div>
          </IntakeStepWrapper>
        )}

        {/* ═══ STEP 11: FULL APPROVAL PAGE (old Step 10) ═══ */}
        {step === 11 && eligibility && (
          <div>
            {eligibility.result === "not_eligible" ? (
              <IntakeStepWrapper step={10} totalSteps={TOTAL_STEPS - 1} title="We have other options for you">
                <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm text-muted-foreground">Based on your health profile, this program isn't the ideal fit right now. We have wellness plans that can support your goals.</p>
                  <div className="grid gap-3">
                    {[
                      { label: "Explore Gut Health Programs", path: "/programs/gut-health" },
                      { label: "Browse Supplements", path: "/products" },
                      { label: "Longevity & Wellness Plans", path: "/programs/longevity" },
                    ].map(o => (
                      <button key={o.path} onClick={() => navigate(o.path)}
                        className="w-full text-left px-5 py-4 rounded-xl border border-border hover:border-primary/40 transition-all text-sm font-medium text-foreground min-h-[48px]" aria-label={o.label}>
                        {o.label} →
                      </button>
                    ))}
                  </div>
                </motion.div>
              </IntakeStepWrapper>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
                {/* Urgency timer bar */}
                <CountdownTimer name={data.firstName} />

                {/* "Are You Ready?" Hero Banner */}
                <div className="bg-[hsl(140,20%,95%)] dark:bg-[hsl(140,15%,10%)] px-6 py-10">
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-5 py-2 bg-gradient-to-r from-primary/80 to-primary rounded-full mb-4">
                    <span className="text-white text-sm font-bold" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Are You Ready?</span>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-3" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    Start Your Journey <span className="text-primary italic">Today</span>
                  </motion.h1>
                </div>

                {/* Main approval header */}
                <div className="bg-secondary/50 px-6 pb-8">
                  <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-foreground leading-[0.95] mb-4 tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    {data.firstName}, your plan is ready — <span className="text-primary italic">built around {goalWeight} lbs.</span>
                  </motion.h2>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { label: "CURRENT", value: `${data.currentWeight} lbs` },
                      { label: "GOAL", value: `${goalWeight} lbs` },
                      { label: "TO LOSE", value: `${weightToLose} lbs` },
                      { label: "SEX", value: data.gender },
                      { label: "BMI", value: bmi.toFixed(1) },
                    ].map(c => (
                      <div key={c.label} className="px-4 py-2.5 rounded-xl border-2 border-primary/30 bg-background/50 text-center min-w-[90px]">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{c.label}</p>
                        <p className="text-base font-bold text-foreground">{c.value}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-base text-foreground leading-relaxed">
                    You'll get personalized care for your unique biology with{" "}
                    <span className="font-bold">prescribed medication</span>, 1:1 physician guidance, and 24/7 Youth&Soul support.
                  </p>
                </div>

                {/* Weight loss chart */}
                <div className="px-6 py-8 bg-background">
                  <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-5 shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
                    <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                      Your projected path
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">A simple month-by-month view from today to your goal.</p>

                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {projectedMilestones.map((point, index) => (
                        <motion.div
                          key={point.label}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + index * 0.08 }}
                          className={`rounded-2xl border p-3 text-center ${point.accent ? "border-primary bg-primary/10" : "border-border bg-secondary/40"}`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{point.label}</p>
                          <p className={`mt-1 text-xl font-black ${point.accent ? "text-primary" : "text-foreground"}`}>{point.value}</p>
                          <p className="text-[10px] font-bold text-muted-foreground">lbs</p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                      className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-primary" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-foreground">{data.currentWeight}</span>
                        <span className="text-sm ml-1 font-medium">LBS</span>
                      </div>
                    </motion.div>

                    <div className="relative h-56 mb-4">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartFill2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(140,30%,50%)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="hsl(140,30%,50%)" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="400" y2="50" stroke="hsl(0,0%,90%)" strokeWidth="0.5" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="hsl(0,0%,90%)" strokeWidth="0.5" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="hsl(0,0%,90%)" strokeWidth="0.5" />
                        <line x1="133" y1="0" x2="133" y2="200" stroke="hsl(0,0%,90%)" strokeWidth="0.5" />
                        <line x1="266" y1="0" x2="266" y2="200" stroke="hsl(0,0%,90%)" strokeWidth="0.5" />
                        <path d="M 10 30 C 80 35, 150 70, 200 100 C 260 130, 330 150, 390 160 L 390 200 L 10 200 Z" fill="url(#chartFill2)" />
                        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.3 }}
                          d="M 10 30 C 80 35, 150 70, 200 100 C 260 130, 330 150, 390 160" fill="none" stroke="hsl(140,35%,45%)" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="absolute bottom-6 right-2 z-10">
                        <div className="bg-background border-2 border-[hsl(80,25%,50%)] px-4 py-2 rounded-xl shadow-lg">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-5 h-5 text-[hsl(38,60%,50%)]" />
                            <span className="text-2xl font-black text-foreground">{goalWeight}</span>
                            <span className="text-sm font-medium text-muted-foreground">LBS</span>
                          </div>
                          <p className="text-xs text-primary font-bold text-center">Goal Weight</p>
                        </div>
                      </motion.div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground border-t border-border/50 pt-3 px-2">
                      <span className="font-medium">Today</span>
                      {weeksToGoal <= 4 ? (
                        <>
                          <span className="font-medium">{Math.round(weeksToGoal / 2)} Days</span>
                          <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg font-bold text-foreground">{Math.ceil(weeksToGoal)} Weeks</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{Math.round(weeksToGoal / 2)} Weeks</span>
                          <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg font-bold text-foreground">{monthsToGoal} Months</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Success probability */}
                <div className="px-6 py-6 bg-[hsl(140,20%,95%)] dark:bg-[hsl(140,15%,10%)]">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 p-5 bg-[hsl(80,20%,45%)] rounded-2xl text-white shadow-lg">
                    <Syringe className="w-10 h-10 shrink-0 opacity-80" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base leading-snug">You have a <span className="font-black underline underline-offset-2">very high</span> chance of success with GLP-1 medications</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-3xl md:text-5xl font-black">{eligibility.approvalProbability.toFixed(1)}%</p>
                      <p className="text-[9px] uppercase tracking-[0.15em] font-bold opacity-80">VERY HIGH</p>
                    </div>
                  </motion.div>
                </div>

                {/* ── Medication Selection + Stripe Checkout (MOVED UP) ── */}
                <div className="px-6 py-8 bg-[hsl(140,20%,96%)] dark:bg-[hsl(140,15%,8%)]">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-6">
                    <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Save Over $150 <span className="italic text-primary">Instantly</span></h3>
                    <p className="text-sm text-muted-foreground">Choose your medication preference below:</p>
                  </motion.div>

                  {/* Semaglutide Card */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border-2 overflow-hidden mb-6 transition-all bg-background ${data.medicationChoice === "semaglutide" ? "border-primary shadow-xl" : "border-border"}`}>
                    <div className="bg-primary text-primary-foreground text-center py-2.5 text-xs font-bold uppercase tracking-widest">⭐ Most Popular</div>
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img src="/images/semaglutide-vial.png" alt="Compounded Semaglutide" className="w-20 h-auto object-contain rounded-lg" />
                        <div>
                          <h3 className="text-xl font-black text-foreground"><span className="block">Semaglutide/</span><span className="block">Ozempic®</span></h3>
                          <p className="text-sm text-muted-foreground">Compounded Semaglutide/Ozempic® Prescription GLP Medication</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-black text-primary italic" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Prescribed for only $125</span>
                        <span className="text-base text-muted-foreground line-through ml-2">$299</span>
                      </div>
                      <ul className="space-y-2 mb-5">
                        {["Same active ingredient as Ozempic® & Wegovy®", "Available in both oral and injectable forms", "Save $150 instantly on your first month", "PRICE INCLUDES: doctor consult, unlimited 1:1 medical support, written prescription + 4 weeks of medicine and free shipping"].map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium text-foreground mb-3">Which do you prefer?</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button onClick={() => { update("medicationChoice", "semaglutide"); update("medicationForm", "injection"); setStripeLoading(true); setCheckoutKey(k => k + 1); }}
                          aria-label="Select semaglutide injection"
                          className={`px-4 py-4 rounded-xl border-2 text-sm font-black transition-all flex flex-col items-center gap-2 min-h-[56px] ${data.medicationChoice === "semaglutide" && data.medicationForm === "injection" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/30 bg-background"}`}>
                          <Syringe className="w-6 h-6 text-primary" />INJECTION
                        </button>
                        <button onClick={() => { update("medicationChoice", "semaglutide"); update("medicationForm", "tablet"); setStripeLoading(true); setCheckoutKey(k => k + 1); }}
                          aria-label="Select semaglutide tablets"
                          className={`px-4 py-4 rounded-xl border-2 text-sm font-black transition-all flex flex-col items-center gap-2 min-h-[56px] ${data.medicationChoice === "semaglutide" && data.medicationForm === "tablet" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/30 bg-background"}`}>
                          <Pill className="w-6 h-6 text-primary" />TABLETS
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tirzepatide Card */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className={`rounded-2xl border-2 overflow-hidden mb-6 transition-all bg-background ${data.medicationChoice === "tirzepatide" ? "border-primary shadow-xl" : "border-border"}`}>
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img src="/images/tirzepatide-vial.png" alt="Compounded Tirzepatide" className="w-20 h-auto object-contain rounded-lg" />
                        <div>
                          <h3 className="text-xl font-black text-foreground">Tirzepatide</h3>
                          <p className="text-sm text-muted-foreground">Compounded Tirzepatide Prescription GLP Medication</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-black text-primary italic" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Prescribed for only $135</span>
                        <span className="text-base text-muted-foreground line-through ml-2">$399</span>
                      </div>
                      <ul className="space-y-2 mb-5">
                        {["Same active ingredient as Mounjaro® & Zepbound®", "Easy and painless injection", "Save $250 instantly on your first month", "PRICE INCLUDES: doctor consult, unlimited 1:1 feedback, written prescription + 4 weeks of medicine and free shipping"].map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium text-foreground mb-3">Which do you prefer?</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button onClick={() => { update("medicationChoice", "tirzepatide"); update("medicationForm", "injection"); setStripeLoading(true); setCheckoutKey(k => k + 1); }}
                          aria-label="Select tirzepatide injection"
                          className={`px-4 py-4 rounded-xl border-2 text-sm font-black transition-all flex flex-col items-center gap-2 min-h-[56px] ${data.medicationChoice === "tirzepatide" && data.medicationForm === "injection" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/30 bg-background"}`}>
                          <Syringe className="w-6 h-6 text-primary" />INJECTION
                        </button>
                        <button onClick={() => { update("medicationChoice", "tirzepatide"); update("medicationForm", "tablet"); setStripeLoading(true); setCheckoutKey(k => k + 1); }}
                          aria-label="Select tirzepatide tablets"
                          className={`px-4 py-4 rounded-xl border-2 text-sm font-black transition-all flex flex-col items-center gap-2 min-h-[56px] ${data.medicationChoice === "tirzepatide" && data.medicationForm === "tablet" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/30 bg-background"}`}>
                          <Pill className="w-6 h-6 text-primary" />TABLETS
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ── Stripe Checkout (immediately after medication selection) ── */}
                {data.medicationChoice && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-8 bg-background">
                    <div className="text-center mb-4">
                      <p className="text-xl font-black text-foreground" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                        Continue with <span className="underline capitalize text-primary italic">{data.medicationChoice}</span>
                      </p>
                      <p className="text-2xl font-black text-primary mt-1">${data.medicationChoice === "tirzepatide" ? "135" : "125"}/mo</p>
                    </div>
                    <div className="mb-6 rounded-2xl border border-border bg-card p-4 md:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">Welcome text &amp; email updates</p>
                          <p className="text-xs text-muted-foreground mt-1">We’ll use these details for your approval link, welcome message, and doctor updates before checkout.</p>
                          <div className="mt-3 space-y-1.5 text-sm">
                            <p className="text-foreground"><span className="text-muted-foreground">Email:</span> {data.email || "Not provided"}</p>
                            <p className="text-foreground"><span className="text-muted-foreground">Mobile:</span> {data.phone || "Not provided"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStep(10)}
                          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="p-5 bg-[hsl(140,20%,96%)] dark:bg-[hsl(140,15%,10%)] rounded-2xl border border-primary/20 mb-6">
                      <p className="font-bold text-foreground mb-3">You will receive everything you need:</p>
                      <ul className="space-y-2">
                        {["One month of medication, supplies and instructions", "24/7 support and one-on-one access to our team of doctors and nurses", "Our promise to help you as much (or as little) as you want along the way"].map(item => (
                          <li key={item} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2 mb-3 justify-center text-sm text-muted-foreground"><Shield className="w-4 h-4 text-primary" /><span>HSA/FSA Eligible</span></div>
                    <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg mb-6">
                      <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">Your data is protected by HIPAA. All transactions are secured and encrypted.</p>
                    </div>

                    {/* Stripe loading skeleton */}
                    <div id="stripe-checkout-section" className="relative">
                      {stripeLoading && (
                        <div className="space-y-4 p-6 border border-border rounded-xl mb-4">
                          <Skeleton className="h-8 w-3/4 mx-auto" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                          <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                          </div>
                          <Skeleton className="h-12 w-full" />
                          <p className="text-xs text-center text-muted-foreground">Loading secure checkout...</p>
                        </div>
                      )}
                      <div>
                        <StripeEmbeddedCheckout
                          key={`checkout-${data.medicationChoice}-${data.medicationForm}-${checkoutKey}`}
                          priceId={data.medicationChoice === "tirzepatide" ? "weight_loss_level2_monthly" : "weight_loss_level1_monthly"}
                          customerEmail={data.email}
                          userId={userId}
                          programSlug="weight-loss"
                          tierName={data.medicationChoice === "tirzepatide" ? "Tirzepatide" : "GLP-1 Program"}
                          onReady={() => setStripeLoading(false)}
                          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(data.email)}${userId ? "&account=existing" : ""}`}
                        />
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => {
                            update("medicationChoice", "");
                            update("medicationForm", "");
                            setStripeLoading(true);
                            setCheckoutKey(k => k + 1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Want to switch medication?
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Collapsible secondary content ── */}
                <div className="px-6 py-8 bg-background border-t border-border">
                  {/* Goals */}
                  <h2 className="text-2xl font-black text-foreground mb-4" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    The goals <span className="text-primary italic underline decoration-2">you will accomplish</span> with your plan
                  </h2>
                  <ul className="space-y-3 mb-8">
                    {[`Lose ${weightToLose} lbs`, `Reset your metabolic "set point" so your body naturally wants to be at ${goalWeight} lbs`, "Look and feel healthier"].map(g => (
                      <li key={g} className="flex items-start gap-3 text-foreground"><span className="text-primary mt-0.5">◆</span><span className="text-base">{g}</span></li>
                    ))}
                  </ul>

                  {/* 3-Step Journey */}
                  <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-2 italic">
                    How It Works — 3 Easy Steps:
                  </h3>
                  <div className="grid grid-cols-1 gap-6 mt-6 mb-8">
                    {journeySteps.map((js) => (
                      <div key={js.step} className="flex gap-4 items-start">
                        <div className="rounded-2xl overflow-hidden w-20 h-20 bg-muted shrink-0">
                          <img src={js.image} alt={js.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{js.step}</span>
                            <h4 className="text-base font-bold text-foreground">{js.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{js.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What is included */}
                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl text-primary text-center mb-8 leading-snug"
                    style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif", fontStyle: "italic" }}>
                    The most effective weight loss program is right here
                  </motion.h3>
                  <h4 className="text-xl font-black text-foreground mb-6">What is included?</h4>
                  <div className="space-y-5 mb-8">
                    {[
                      { icon: Syringe, title: "Access to GLP-1 Medication", sub: "Cost of medication is included", subColor: "text-primary" },
                      { icon: Shield, title: "No insurance necessary", sub: "" },
                      { icon: Stethoscope, title: "Board-Certified doctor review", sub: "" },
                      { icon: Phone, title: "1:1 Physician guidance", sub: "" },
                      { icon: BarChart3, title: "Metabolic report", sub: "Includes custom in-depth metabolic results", subColor: "text-primary" },
                      { icon: Leaf, title: "Sample meal plan based on metabolism", sub: "" },
                      { icon: CreditCard, title: "Nutrition report", sub: "" },
                    ].map(item => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{item.title}</p>
                          {item.sub && <p className={`text-sm italic ${item.subColor || "text-muted-foreground"}`}>{item.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mb-8">
                    <p className="text-2xl md:text-3xl font-black text-primary italic" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Prescribed for just $125</p>
                    <p className="text-sm text-foreground mt-2">Pay One Month at a Time. No Contracts, Cancel Anytime. <span className="text-primary italic font-semibold">Medication is Included</span>.</p>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="px-6 py-8 border-t border-border">
                  <h3 className="text-2xl font-black text-foreground mb-6" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>What Happens Next?</h3>
                  <div className="space-y-6">
                    {[
                      { step: "1", title: "Physician Review", desc: "You're already pre-qualified. After checkout, a board-certified physician will review your information." },
                      { step: "2", title: "Fast Prescription Approval", desc: "Most prescriptions are approved in less than 24 hours. Same-day consultations available at no extra charge." },
                      { step: "3", title: "Medication Shipping", desc: "Once approved, your medication is prepared and shipped. Tracking info within 2 business days." },
                      { step: "4", title: "Monthly Refills", desc: "Quick refill form each month. We'll send email and text updates with tracking info." },
                      { step: "5", title: "Unlimited Support", desc: "24/7 access to our care team and licensed clinicians — whenever you need us." },
                    ].map(s => (
                      <motion.div key={s.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: parseInt(s.step) * 0.1 }} className="flex gap-4">
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{s.step}</div>
                        <div><h4 className="font-bold text-foreground text-base">{s.title}</h4><p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p></div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Photo Grid + reviews (moved from Step 0) */}
                <div className="px-6 py-8 bg-background border-t border-border">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-2" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    The change we've all been waiting for.
                  </h3>
                  <p className="text-center text-muted-foreground text-xs mb-4">Join the patients and we'll help you finally get real, lasting results.</p>
                  <div className="mb-4 overflow-hidden rounded-2xl border border-primary/20 bg-card">
                    <img src={glpPatientCollageReal} alt="A diverse group of weight loss program patients" className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-col items-start gap-2.5 px-1">
                    {["6x more weight loss than exercise and diet alone", "Lose an average of 18% of your body weight", "93% kept the weight off for good"].map((text) => (
                      <div key={text} className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-foreground">{text}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">* Data based on Youth&Soul patients over their first 6 months of treatment</p>
                </div>

                {/* Reviews */}
                <div className="px-6 py-6 bg-background">
                  <h3 className="text-lg font-bold text-center text-foreground mb-4">
                    There's a reason people are <span className="text-primary">raving about us.</span>
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
                    {reviews.map((r, i) => (
                      <div key={i} className="shrink-0 w-[240px] bg-card rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{r.name[0]}</span>
                          </div>
                          <span className="text-xs font-semibold text-foreground">{r.name}</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 fill-primary text-primary" />)}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">"{r.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weight Loss Guarantee */}
                <div className="px-6 py-8 text-center bg-[hsl(140,20%,96%)] dark:bg-[hsl(140,15%,10%)]">
                  <Award className="w-14 h-14 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-black text-foreground mb-2" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Weight Loss Guarantee</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">If you do not lose weight by the end of your complete program, you can request a refund. It is that simple!</p>
                </div>

                {/* Backed by Research */}
                <div className="px-6 py-10 bg-[hsl(40,25%,95%)] dark:bg-[hsl(40,15%,10%)]">
                  <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground font-bold mb-6">Backed by Research From</p>
                  <div className="flex justify-center">
                    <img src="/images/research-logos.png" alt="Mayo Clinic, Stanford Medicine, WebMD, Harvard University, NIH" className="max-w-md w-full h-auto object-contain opacity-60" loading="lazy" />
                  </div>
                </div>

                {/* Stats */}
                <div className="px-6 py-8 bg-background">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Scale, stat: "18%", label: "Average reduction in body weight" },
                      { icon: Trophy, stat: "9/10", label: "Patients say most effective treatment" },
                      { icon: Ruler, stat: "6.5\"", label: "Average reduction in waist size" },
                      { icon: TrendingDown, stat: "93%", label: "Patients kept the weight off" },
                    ].map(s => (
                      <motion.div key={s.stat} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-4 bg-[hsl(140,20%,96%)] dark:bg-[hsl(140,15%,10%)] rounded-xl border border-primary/10">
                        <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-black text-foreground">{s.stat}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="px-6 py-8">
                  <h3 className="text-xl font-black text-foreground mb-4 text-center" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>The <span className="italic text-primary">results</span> speak for themselves!</h3>
                  <div className="space-y-4">
                    {(dbReviews.length > 0 ? dbReviews : [
                      { name: "Katie R.", review_text: "In just 5 months, I reached my goal weight. I got my life back.", stars: 5 },
                      { name: "Rachel G.", review_text: "I lost 26 lbs in 3 months. Progress has been steady and I'm excited.", stars: 5 },
                      { name: "Shannon B.", review_text: "They helped me reach my goal. I lost 45 pounds and I am back!", stars: 5 },
                    ]).map((t, idx) => (
                      <div key={idx} className="p-5 bg-[hsl(140,20%,96%)] dark:bg-[hsl(140,15%,10%)] rounded-2xl border border-primary/10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-foreground">"{t.review_text.slice(0, 40)}..."</p>
                          <div className="flex gap-0.5">{[...Array(t.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3">{t.review_text}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-foreground">{t.name}</p>
                          <p className="text-xs text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs (collapsible accordion) */}
                <div className="px-6 py-8 bg-background">
                  <h3 className="text-xl font-black text-foreground mb-4 text-center" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    <FAQItem q="What is the Youth&Soul Prescription Plan?" a="A physician-guided weight loss program with GLP-1 medication, 1:1 guidance, and 24/7 support." />
                    <FAQItem q="What is the cost of medication?" a="Medication is included. Starting at $125/month with no hidden fees. HSA/FSA eligible." />
                    <FAQItem q="What if I don't know how to do the injections?" a="You'll receive clear instructions. Injections are simple and painless. Our team is available 24/7." />
                    <FAQItem q="How quickly will I see results?" a="Most patients notice reduced appetite within the first week. Significant weight loss typically begins in weeks 2-4, with an average of 3-4 lbs per week." />
                    <FAQItem q="Is this medication safe?" a="Yes. GLP-1 medications are FDA-approved and have been used by millions of patients. Your prescription is reviewed and approved by a board-certified physician." />
                    <FAQItem q="What are the common side effects?" a="The most common side effects are mild nausea, which typically resolves within the first 1-2 weeks. Your doctor will start you on a low dose to minimize side effects." />
                    <FAQItem q="Can I cancel anytime?" a="Yes! There are no contracts or commitments. You can pause or cancel your subscription at any time with no cancellation fees." />
                    <FAQItem q="How is the medication shipped?" a="Your medication is shipped in temperature-controlled packaging directly to your door. You'll receive tracking information within 2 business days of approval." />
                    <FAQItem q="Do I need insurance?" a="No insurance is required. Our program is designed to be affordable and accessible without insurance. However, you can use HSA/FSA funds." />
                    <FAQItem q="What if I'm not approved?" a="If our physician determines that GLP-1 medication isn't right for you, you'll receive a full refund. We also offer alternative wellness programs." />
                  </div>
                </div>

                {/* Floating checkout button */}
                {data.medicationChoice && (
                  <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40 md:hidden">
                    <motion.button whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[hsl(80,25%,45%)] hover:bg-[hsl(80,25%,40%)] text-white rounded-2xl text-base font-black uppercase tracking-widest transition-colors shadow-lg"
                      onClick={() => { const el = document.getElementById("stripe-checkout-section"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                      aria-label="Scroll to checkout">
                      CHECKOUT — ${data.medicationChoice === "tirzepatide" ? "135" : "125"}/mo →
                    </motion.button>
                  </div>
                )}

                {/* FDA Disclaimer Footer */}
                <div className="px-6 py-8 bg-[hsl(40,25%,95%)] dark:bg-[hsl(40,15%,10%)]">
                  <p className="text-base font-bold text-foreground text-center mb-4" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
                    Wegovy is FDA-approved for weight loss. Ozempic is FDA-approved for type 2 diabetes treatment, but may be prescribed for weight loss.
                  </p>
                  <div className="text-center text-[11px] text-muted-foreground leading-relaxed space-y-3">
                    <p>*Results vary based on starting weight and program adherence. Inches lost from hips, waist, chest, thighs and arms in the first month.</p>
                    <p>These patients exercised daily and ate a reduced-calorie diet. Their fat loss is not typical.</p>
                    <p>Your results may vary. Medication prescriptions are at the discretion of medical providers and may not be suitable for everyone. Patients typically result in 1-2 lbs per week weight loss in 4 weeks, involving a healthy diet and exercise changes.</p>
                    <p>*Based on average weight loss in three 68-week clinical trials of patients without diabetes who reached and maintained a dose of 2.4 mg/week of GLP-1 treatment, along with a reduced-calorie diet and increased physical activity.</p>
                    <p>Medication is included in the cost of the Program.</p>
                    <p>Wegovy® is FDA-approved for weight loss. Ozempic® is FDA-approved for type 2 diabetes treatment but may be prescribed for weight loss. The trademarks, service marks, trade names (Wegovy®, Ozempic®), and products displayed on this Internet site are protected and belong to their respective owners.</p>
                    <p>Medical treatment is provided by affiliated P.C.s, an affiliated network for medical professional corporations and associations.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

          </motion.div>
        </AnimatePresence>

        {/* ── Sticky Navigation Bar ── */}
        {step > 0 && step < 11 && (
          <div className="fixed bottom-0 left-0 right-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-xl border-t border-border z-40 md:relative md:bg-transparent md:border-0 md:backdrop-blur-none md:z-auto md:py-4 md:px-1 md:mb-4">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              <button onClick={() => step > 0 && setStep(step - 1)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border border-border text-sm font-bold transition-colors min-h-[52px] ${step === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"}`}
                disabled={step === 0} aria-label="Go back">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step === 10 ? (
                <button onClick={async () => { if (!canNext()) { setShowErrors(true); return; } await handleSubmit(); setStep(11); }}
                  disabled={submitting}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:bg-primary/90 transition-colors min-h-[56px] shadow-lg ${!canNext() && showErrors ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                  aria-label="Check eligibility">
                  <span className="inline-flex items-center gap-2">{submitting ? "Processing..." : "Check Eligibility"} <ArrowRight className="w-4 h-4" /></span>
                  <span className="text-[10px] font-bold opacity-80">{intakeProgress}% complete</span>
                </button>
              ) : step === 9 && eligibility?.result === "not_eligible" ? (
                <button onClick={() => setStep(11)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:bg-primary/90 transition-colors min-h-[56px] shadow-lg"
                  aria-label="View options">
                  View Options <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleNext}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-black hover:bg-primary/90 transition-colors min-h-[56px] shadow-lg ${!canNext() && showErrors ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                  aria-label="Continue to next step">
                  <span className="inline-flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
                  <span className="text-[10px] font-bold opacity-80">Step {step} of {TOTAL_STEPS - 1}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer — always at the very bottom */}
      <MinimalFooter />
    </div>
  );
}
