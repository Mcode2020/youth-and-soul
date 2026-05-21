import { useSearchParams, useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { ArrowLeft, Shield, Stethoscope, Truck, CheckCircle, BadgeCheck, RefreshCw, Package, Headphones, DollarSign, MapPin, FileText, Save } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { telehealthPrograms } from "@/data/telehealthPrograms";
import { getStripePriceIdForTier } from "@/lib/priceMappings";
import { supabase } from "@/integrations/supabase/client";

const trustTags = [
  { icon: Truck, label: "Free Delivery" },
  { icon: Stethoscope, label: "Doctor‑Rx" },
  { icon: BadgeCheck, label: "FDA‑Approved" },
  { icon: RefreshCw, label: "Cancel Anytime" },
  { icon: Shield, label: "Full Refund" },
  { icon: Package, label: "Discreet" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: DollarSign, label: "Best Price" },
];

function InlineField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-foreground border border-border rounded-lg px-2.5 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function MedicalReviewPanel({ savedData, onSave }: { savedData: Record<string, any> | null; onSave: (data: Record<string, any>) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(savedData || {});

  const set = useCallback((key: string, val: string) => setForm(prev => ({ ...prev, [key]: val })), []);

  if (!savedData) {
    return (
      <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm text-muted-foreground">
        No saved information found.
      </div>
    );
  }

  const handleSave = () => {
    onSave(form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm space-y-2.5">
        <p className="font-medium text-foreground mb-1">Edit Your Information:</p>
        <div className="grid grid-cols-2 gap-2">
          <InlineField label="First Name" value={form.firstName || ""} onChange={v => set("firstName", v)} />
          <InlineField label="Last Name" value={form.lastName || ""} onChange={v => set("lastName", v)} />
        </div>
        <InlineField label="Email" value={form.email || ""} onChange={v => set("email", v)} />
        <InlineField label="Phone" value={form.phone || ""} onChange={v => set("phone", v)} />
        <div className="grid grid-cols-2 gap-2">
          <InlineField label="Date of Birth" value={form.dateOfBirth || ""} onChange={v => set("dateOfBirth", v)} />
          <InlineField label="Gender" value={form.gender || ""} onChange={v => set("gender", v)} />
        </div>
        <InlineField label="State" value={form.state || ""} onChange={v => set("state", v)} />
        <InlineField label="Allergies" value={form.allergies || ""} onChange={v => set("allergies", v)} />
        <InlineField label="Current Medications" value={form.currentMeds || ""} onChange={v => set("currentMeds", v)} />
        <InlineField label="Medical Conditions" value={form.medicalConditions || ""} onChange={v => set("medicalConditions", v)} />
        <InlineField label="Previous Treatments" value={form.previousTreatments || ""} onChange={v => set("previousTreatments", v)} />
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
            <Save className="w-3 h-3" /> Save Changes
          </button>
          <button onClick={() => { setForm(savedData); setEditing(false); }} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm space-y-1.5">
      <p className="font-medium text-foreground mb-1">Your Submitted Information:</p>
      {savedData.firstName && <p><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{savedData.firstName} {savedData.lastName}</span></p>}
      {savedData.email && <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{savedData.email}</span></p>}
      {savedData.phone && <p><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{savedData.phone}</span></p>}
      {savedData.dateOfBirth && <p><span className="text-muted-foreground">DOB:</span> <span className="text-foreground">{savedData.dateOfBirth}</span></p>}
      {savedData.gender && <p><span className="text-muted-foreground">Gender:</span> <span className="text-foreground">{savedData.gender}</span></p>}
      {savedData.state && <p><span className="text-muted-foreground">State:</span> <span className="text-foreground">{savedData.state}</span></p>}
      {savedData.allergies && savedData.allergies !== "None" && <p><span className="text-muted-foreground">Allergies:</span> <span className="text-foreground">{savedData.allergies}</span></p>}
      {savedData.currentMeds && savedData.currentMeds !== "None" && <p><span className="text-muted-foreground">Medications:</span> <span className="text-foreground">{savedData.currentMeds}</span></p>}
      {savedData.medicalConditions && <p><span className="text-muted-foreground">Conditions:</span> <span className="text-foreground">{savedData.medicalConditions}</span></p>}
      {savedData.previousTreatments && <p><span className="text-muted-foreground">Treatments:</span> <span className="text-foreground">{savedData.previousTreatments}</span></p>}
      <button onClick={() => setEditing(true)} className="mt-1.5 text-xs text-primary hover:underline font-medium">
        Edit my information →
      </button>
    </div>
  );
}

function AddressReviewPanel({ savedData, onSave }: { savedData: Record<string, any> | null; onSave: (data: Record<string, any>) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(savedData || {});

  const set = useCallback((key: string, val: string) => setForm(prev => ({ ...prev, [key]: val })), []);

  if (!savedData) {
    return (
      <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm text-muted-foreground">
        No saved address found.
      </div>
    );
  }

  const handleSave = () => {
    onSave(form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm space-y-2.5">
        <p className="font-medium text-foreground mb-1">Edit Your Address:</p>
        <InlineField label="Street Address" value={form.address || ""} onChange={v => set("address", v)} />
        <div className="grid grid-cols-2 gap-2">
          <InlineField label="City" value={form.city || ""} onChange={v => set("city", v)} />
          <InlineField label="State" value={form.state || ""} onChange={v => set("state", v)} />
        </div>
        <InlineField label="Zip Code" value={form.zip || ""} onChange={v => set("zip", v)} />
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
            <Save className="w-3 h-3" /> Save Changes
          </button>
          <button onClick={() => { setForm(savedData); setEditing(false); }} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-secondary">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-9 p-3 bg-background border border-border rounded-xl text-sm space-y-1.5">
      <p className="font-medium text-foreground mb-1">Your Shipping Address:</p>
      {savedData.address && <p><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{savedData.address}</span></p>}
      {savedData.city && <p><span className="text-muted-foreground">City:</span> <span className="text-foreground">{savedData.city}</span></p>}
      {savedData.state && <p><span className="text-muted-foreground">State:</span> <span className="text-foreground">{savedData.state}</span></p>}
      {savedData.zip && <p><span className="text-muted-foreground">Zip:</span> <span className="text-foreground">{savedData.zip}</span></p>}
      <button onClick={() => setEditing(true)} className="mt-1.5 text-xs text-primary hover:underline font-medium">
        Edit my address →
      </button>
    </div>
  );
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useSEOHead({
    title: "Secure Checkout",
    description: "Complete your Youth & Soul telehealth program checkout securely via Stripe.",
    path: "/checkout",
    noIndex: true,
  });
  const [showMedicalReview, setShowMedicalReview] = useState(false);
  const [showAddressReview, setShowAddressReview] = useState(false);
  const [userId, setUserId] = useState("");

  const programSlug = searchParams.get("program") || "";
  const tierLabel = searchParams.get("tier") || "";
  const email = searchParams.get("email") || "";

  const program = telehealthPrograms.find((p) => p.slug === programSlug);
  const tier = program?.tiers.find((t) => t.label === tierLabel);
  const priceId = getStripePriceIdForTier(programSlug, tierLabel);

  const medicationImage = program?.image;

  const [savedData, setSavedData] = useState<Record<string, any> | null>(() => {
    try {
      const raw = localStorage.getItem("ys_intake_user_data");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ""));
  }, []);

  const handleSaveData = useCallback((updated: Record<string, any>) => {
    const merged = { ...savedData, ...updated };
    localStorage.setItem("ys_intake_user_data", JSON.stringify(merged));
    setSavedData(merged);
  }, [savedData]);

  if (!program || !tier || !priceId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Invalid checkout link</h1>
          <p className="text-muted-foreground">The program or tier couldn't be found.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {medicationImage && (
          <div className={`relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${program.color} shadow-sm`}>
            <img
              src={medicationImage}
              alt={`${program.title} medications and treatment options`}
              className="h-44 w-full object-cover object-center mix-blend-luminosity opacity-65 sm:h-56 md:h-64"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white md:bottom-6 md:left-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-white/80">Your selected plan</p>
              <h2 className="text-xl font-black md:text-3xl">{program.title}</h2>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            Complete Your Enrollment
          </h1>
          <p className="text-muted-foreground">
            {program.title} — {tier.name} ({tier.priceLabel})
          </p>

          {/* Trust Bar - compact for mobile */}
          <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground md:flex-nowrap md:overflow-hidden md:text-[10px] lg:text-[11px]">
            {trustTags.map(({ icon: Icon, label }) => (
              <span key={label} className="flex shrink-0 items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded-full md:px-1.5 lg:px-2">
                <Icon className="w-3 h-3 text-primary" /> {label}
              </span>
            ))}
          </div>

          <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-border/50">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">Your plan includes:</p>
                <ul className="space-y-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <StripeEmbeddedCheckout
          priceId={priceId}
          customerEmail={email}
          userId={userId}
          programSlug={programSlug}
          programTitle={program.title}
          programDescription={tier.description}
          programImage={program.image}
          tierName={tier.name}
          tierPrice={tier.priceLabel}
          tierIncludes={tier.includes}
          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}${userId ? "&account=existing" : ""}`}
        />

        {/* Doctor Review & Refund Guarantee */}
        <div className="mt-8 space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              How It Works After Payment
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">1</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Doctor Review</span> — A licensed physician will review your medical information within 24 hours.{" "}
                  <button onClick={() => setShowMedicalReview(!showMedicalReview)} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Review my Medical Information
                  </button>
                </div>
              </div>

              {showMedicalReview && (
                <MedicalReviewPanel savedData={savedData} onSave={handleSaveData} />
              )}

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Approval & Prescription</span> — Once approved, your prescription is sent to our licensed pharmacy partner.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">3</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Shipped to Your Door</span> — Your medication arrives in discreet packaging with free next/2‑day shipping.{" "}
                  <button onClick={() => setShowAddressReview(!showAddressReview)} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Check Address
                  </button>
                </div>
              </div>

              {showAddressReview && (
                <AddressReviewPanel savedData={savedData} onSave={handleSaveData} />
              )}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 flex items-center gap-4">
            <img src="/images/money-back-guarantee.png" alt="100% Money Back Guarantee" className="w-16 h-16 object-contain flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Full Refund if Not Approved</p>
              <p className="text-sm text-muted-foreground">
                If for any reason your health plan is not approved by our medical team, you'll receive an <span className="font-semibold text-foreground">instant full refund</span> — no questions asked.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground py-2">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> HIPAA Compliant</span>
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-primary" /> Free Shipping</span>
            <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-primary" /> Licensed Physicians</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
