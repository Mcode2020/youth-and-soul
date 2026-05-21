import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Lock, Loader2, Star, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { telehealthPrograms } from "@/data/telehealthPrograms";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DateOfBirthPicker } from "@/components/intake/DateOfBirthPicker";


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  allergies: string;
  currentMeds: string;
  medicalConditions: string;
  previousTreatments: string;
  agreeTerms: boolean;
  agreeTelehealth: boolean;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  allergies: "",
  currentMeds: "",
  medicalConditions: "",
  previousTreatments: "",
  agreeTerms: false,
  agreeTelehealth: false,
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const programTextColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "text-teal-600",
  "from-rose-800 to-rose-600": "text-rose-600",
  "from-blue-800 to-blue-600": "text-blue-600",
  "from-amber-800 to-amber-600": "text-amber-600",
  "from-emerald-800 to-emerald-600": "text-emerald-600",
  "from-slate-700 to-slate-500": "text-slate-600",
  "from-indigo-800 to-indigo-600": "text-indigo-600",
  "from-lime-800 to-lime-600": "text-lime-600",
  "from-sky-800 to-sky-600": "text-sky-600",
  "from-pink-800 to-pink-600": "text-pink-600",
};

const programLogoColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "text-teal-500",
  "from-rose-800 to-rose-600": "text-rose-500",
  "from-blue-800 to-blue-600": "text-blue-500",
  "from-amber-800 to-amber-600": "text-amber-500",
  "from-emerald-800 to-emerald-600": "text-emerald-500",
  "from-slate-700 to-slate-500": "text-slate-500",
  "from-indigo-800 to-indigo-600": "text-indigo-500",
  "from-lime-800 to-lime-600": "text-lime-500",
  "from-sky-800 to-sky-600": "text-sky-500",
  "from-pink-800 to-pink-600": "text-pink-500",
};

const programRingColor: Record<string, string> = {
  "from-teal-800 to-teal-600": "ring-teal-100",
  "from-rose-800 to-rose-600": "ring-rose-100",
  "from-blue-800 to-blue-600": "ring-blue-100",
  "from-amber-800 to-amber-600": "ring-amber-100",
  "from-emerald-800 to-emerald-600": "ring-emerald-100",
  "from-slate-700 to-slate-500": "ring-slate-100",
  "from-indigo-800 to-indigo-600": "ring-indigo-100",
  "from-lime-800 to-lime-600": "ring-lime-100",
  "from-sky-800 to-sky-600": "ring-sky-100",
  "from-pink-800 to-pink-600": "ring-pink-100",
};

export default function Enroll() {
  const { slug, tier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  useSEOHead({
    title: "Enroll in Telehealth Program",
    description: "Complete your secure enrollment in a Youth & Soul doctor-prescribed telehealth program.",
    path: `/enroll/${slug || ""}/${tier || ""}`,
    noIndex: true,
  });
  const [formData, setFormData] = useState<FormData>(() => {
    // Pre-fill from GLP intake localStorage if available
    try {
      const saved = localStorage.getItem("ys_intake_user_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialFormData,
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          dob: "",
          gender: parsed.gender || "",
          state: parsed.state || "",
        };
      }
    } catch {}
    return initialFormData;
  });
  const [submitting, setSubmitting] = useState(false);
  const [welcomeEmailSentTo, setWelcomeEmailSentTo] = useState("");

  const program = telehealthPrograms.find((p) => p.slug === slug);
  const selectedTier = program?.tiers.find(
    (t) => t.label.toLowerCase().replace(/\s+/g, "-") === tier
  );

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!program || !selectedTier) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <button onClick={() => navigate("/")} className="text-primary underline">Go home</button>
        </div>
      </div>
    );
  }

  const iconColor = programTextColor[program.color] || "text-primary";
  const logoColor = programLogoColor[program.color] || "text-primary";
  const ringColor = programRingColor[program.color] || "ring-primary/15";

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderDateOfBirthPicker = () => (
    <DateOfBirthPicker
      value={formData.dob}
      onChange={(v) => updateField("dob", v)}
      variant="compact"
      label="Date of Birth *"
      showAgePill={false}
    />
  );

  const steps = [
    { title: "Personal Information", subtitle: "Let's start with your basics" },
    { title: "Shipping Address", subtitle: "Where should we ship your treatment?" },
    { title: "Medical History", subtitle: "Help our doctors understand your health" },
    { title: "Review & Consent", subtitle: "Almost there — review and confirm" },
  ];

  const canProceed = () => {
    if (step === 0) return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dob && formData.gender;
    if (step === 1) return formData.address && formData.city && formData.state && formData.zip;
    if (step === 2) return true;
    if (step === 3) return formData.agreeTerms && formData.agreeTelehealth;
    return false;
  };

  const sendWelcomeEmail = async () => {
    const email = formData.email.trim();
    if (!email || welcomeEmailSentTo === email) return;

    const { error } = await supabase.functions.invoke("send-enrollment-notifications", {
      body: {
        type: "enrollment_welcome",
        firstName: formData.firstName,
        email,
        emailConsent: true,
        programSlug: program.slug,
        programTitle: program.title,
        programDescription: selectedTier.description,
        programImage: program.image,
        tierName: selectedTier.name,
        tierPrice: selectedTier.priceLabel,
        tierIncludes: selectedTier.includes,
      },
    });

    if (error) {
      console.error("Welcome email error:", error);
      return;
    }

    setWelcomeEmailSentTo(email);
  };

  const handleContinue = async () => {
    if (step === 0) await sendWelcomeEmail();
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: authData } = await supabase.auth.getUser();

      // Save enrollment first
      const { data, error } = await supabase.functions.invoke("mdi-enroll", {
        body: {
          program: program.slug,
          tier: selectedTier.label,
          tierName: selectedTier.name,
          price: selectedTier.price,
          patient: formData,
          userId: authData.user?.id || null,
        },
      });

      if (error) console.error("Enrollment save error:", error);

      // Send welcome SMS and email notifications
      const notificationPromises: Promise<any>[] = [];

      // Welcome link SMS
      if (formData.phone) {
        notificationPromises.push(
          supabase.functions.invoke("send-enrollment-notifications", {
            body: {
              type: "welcome_link",
              firstName: formData.firstName,
              phone: formData.phone,
              programSlug: program.slug,
              programTitle: program.title,
              tierName: selectedTier.name,
            },
          })
        );
      }

      // Welcome email fallback if it was not already sent on first Continue
      if (formData.email && welcomeEmailSentTo !== formData.email.trim()) {
        notificationPromises.push(
          supabase.functions.invoke("send-enrollment-notifications", {
            body: {
              type: "enrollment_welcome",
              firstName: formData.firstName,
              email: formData.email,
              emailConsent: true,
              programSlug: program.slug,
              programTitle: program.title,
              programDescription: selectedTier.description,
              programImage: program.image,
              tierName: selectedTier.name,
              tierPrice: selectedTier.priceLabel,
              tierIncludes: selectedTier.includes,
            },
          })
        );
      }

      // Fire notifications in parallel, don't block checkout
      Promise.allSettled(notificationPromises).then((results) => {
        results.forEach((r) => {
          if (r.status === "rejected") console.error("Notification error:", r.reason);
        });
      });

      // Save full form data to localStorage for checkout review
      localStorage.setItem("ys_intake_user_data", JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        allergies: formData.allergies,
        currentMeds: formData.currentMeds,
        medicalConditions: formData.medicalConditions,
        previousTreatments: formData.previousTreatments,
      }));

      // Redirect to checkout page with program info
      const checkoutParams = new URLSearchParams({
        program: program.slug,
        tier: selectedTier.label,
        email: formData.email,
      });
      navigate(`/checkout?${checkoutParams.toString()}`);
    } catch (err) {
      console.error("Enrollment error:", err);
      // Save form data even on error
      localStorage.setItem("ys_intake_user_data", JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        allergies: formData.allergies,
        currentMeds: formData.currentMeds,
        medicalConditions: formData.medicalConditions,
        previousTreatments: formData.previousTreatments,
      }));
      const checkoutParams = new URLSearchParams({
        program: program.slug,
        tier: selectedTier.label,
        email: formData.email,
      });
      navigate(`/checkout?${checkoutParams.toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header with dynamic logo color */}
      <header className="sticky top-0 z-40 bg-charcoal backdrop-blur-md border-b border-border/20 safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <a href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight">
              <span className={logoColor}>Youth</span>
              <span className="text-white">&</span>
              <span className={logoColor}>Soul</span>
            </span>
          </a>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-cream/80 hover:text-cream text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </header>

      <Breadcrumbs items={[
        { label: "Programs", href: `/programs/${program.slug}#explore-other-programs` },
        { label: program.title, href: `/programs/${program.slug}` },
        { label: `Enroll — ${selectedTier.name}` },
      ]} />
      {/* Header */}
      <div className={`bg-gradient-to-r ${program.color} py-6 md:py-10`}>
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{program.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">{selectedTier.label}</span>
            <span className="text-white/90 font-medium">{selectedTier.name} — {selectedTier.priceLabel}</span>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Shield className={`w-3.5 h-3.5 ${iconColor}`} /> Doctor-prescribed</span>
          <span className="flex items-center gap-1.5"><Star className={`w-3.5 h-3.5 ${iconColor}`} /> FDA-approved compounds</span>
          <span className="flex items-center gap-1.5"><CheckCircle className={`w-3.5 h-3.5 ${iconColor}`} /> Cancel anytime</span>
          <span className="flex items-center gap-1.5"><BadgeCheck className={`w-3.5 h-3.5 ${iconColor}`} /> Full refund if not approved</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (i <= step) setStep(i);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step ? `bg-gradient-to-r ${program.color} text-white cursor-pointer hover:opacity-80` :
                      i === step ? `bg-gradient-to-r ${program.color} text-white ring-4 ${ringColor}` :
                      "bg-secondary text-muted-foreground cursor-default"
                    }`}
                    title={s.title}
                  >
                    {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </button>
                  <div className="text-center hidden md:block">
                    <p className={`text-xs font-medium leading-tight ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
                    <p className={`text-[10px] leading-tight mt-0.5 ${i === step ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s.subtitle}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`hidden md:block flex-1 h-0.5 mt-[-2rem] ${i < step ? `bg-gradient-to-r ${program.color}` : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden">
            <p className="text-sm font-medium text-foreground">{steps[step].title}</p>
            <p className="text-xs text-muted-foreground">{steps[step].subtitle}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                    <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="John" className="rounded-xl h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Last Name *</label>
                    <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Doe" className="rounded-xl h-12" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                  <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" className="rounded-xl h-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                  <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 123-4567" className="rounded-xl h-12" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDateOfBirthPicker()}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Street Address *</label>
                  <Input value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 Main St, Apt 4B" className="rounded-xl h-12" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                    <Input value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Los Angeles" className="rounded-xl h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">ZIP Code *</label>
                    <Input value={formData.zip} onChange={(e) => updateField("zip", e.target.value)} placeholder="90001" className="rounded-xl h-12" />
                  </div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Your treatment will be shipped in discreet packaging directly to your door. Free shipping on all plans.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Known Allergies</label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => updateField("allergies", e.target.value)}
                    placeholder="List any known drug or food allergies, or type 'None'"
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Medications</label>
                  <textarea
                    value={formData.currentMeds}
                    onChange={(e) => updateField("currentMeds", e.target.value)}
                    placeholder="List any medications you currently take, including dosages, or type 'None'"
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Medical Conditions</label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => updateField("medicalConditions", e.target.value)}
                    placeholder="List any current or past medical conditions (e.g., diabetes, heart disease, thyroid issues)"
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Previous Treatments</label>
                  <textarea
                    value={formData.previousTreatments}
                    onChange={(e) => updateField("previousTreatments", e.target.value)}
                    placeholder={`Have you tried any treatments for ${program.title.toLowerCase()} before? If so, what were they?`}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Summary card */}
                <div className="bg-card rounded-2xl border-2 border-primary/20 p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Your Plan Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Program</span><span className="font-medium text-foreground">{program.title}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium text-foreground">{selectedTier.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-bold text-primary text-lg">{selectedTier.priceLabel}</span></div>
                    <hr className="border-border" />
                    <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium text-foreground">{formData.firstName} {formData.lastName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-foreground">{formData.email}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium text-foreground">{formData.city}, {formData.state} {formData.zip}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Includes: {selectedTier.includes.join(" • ")}</p>
                  </div>
                </div>

                {/* Consent */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>. I understand that a licensed doctor will review my information and may approve or deny treatment based on my medical history. *
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.agreeTelehealth}
                      onChange={(e) => updateField("agreeTelehealth", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      I consent to receive telehealth services and understand that my prescription will be reviewed and fulfilled by a licensed pharmacy. I will not be charged until a doctor approves my treatment plan. *
                    </span>
                  </label>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center gap-3 border border-emerald-200 dark:border-emerald-800/50">
                  <img src="/images/money-back-guarantee.png" alt="100% Money Back Guarantee" className="w-12 h-12 object-contain flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Full Refund if Not Approved</p>
                    <p className="text-xs text-muted-foreground">If your health plan is not approved by our medical team, you'll receive an instant full refund.</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">Your information is encrypted and protected by HIPAA-compliant security. We never share your medical data.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <button
            onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${program.color} hover:opacity-90 transition-opacity`}
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Back to Plans" : "Previous"}
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={handleContinue}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${program.color} hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${program.color} hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {submitting ? "Submitting..." : "Submit Enrollment"}
            </button>
          )}
        </div>

        {/* LegitScript badge removed */}
      </div>

      <MinimalFooter />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
