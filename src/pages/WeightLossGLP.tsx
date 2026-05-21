import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Shield, Truck, Clock, ChevronDown, TrendingDown, Heart, Hourglass, Smile, Check, X } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { BottomNav } from "@/components/ui/BottomNav";
import { Slider } from "@/components/ui/slider";
import { useSEOHead } from "@/hooks/useSEOHead";

import glpPerson1 from "@/assets/glp-person-1.jpg";
import glpPerson2 from "@/assets/glp-person-2.jpg";
import glpPerson3 from "@/assets/glp-person-3.jpg";
import glpPerson4 from "@/assets/glp-person-4.jpg";
import glpPerson5 from "@/assets/glp-person-5.jpg";
import glpPerson6 from "@/assets/glp-person-6.jpg";
import glpPerson7 from "@/assets/glp-person-7.jpg";
import glpMetabolismWoman from "@/assets/glp-metabolism-woman.jpg";
import glpVial from "@/assets/glp-vial.jpg";
import glpPill from "@/assets/glp-pill.jpg";
import glpTablets from "@/assets/glp-tablets.jpg";
import glpPen from "@/assets/glp-pen.jpg";
import glpPhoneConsult from "@/assets/glp-phone-consult.jpg";
import glpDoctor from "@/assets/glp-doctor.jpg";
import glpDelivery from "@/assets/glp-delivery.jpg";
import tirzepatideProduct from "@/assets/tirzepatide-product.png";
import semaglutideProduct from "@/assets/semaglutide-product.png";
import legitscriptBadge from "@/assets/legitscript-badge.png";
import cardInsightBadge from "@/assets/card-insight-badge.png";

const products = [
  { name: "GLP-1 Injections", desc: "One simple injection per week.", price: "Starting at $179", badge: "Popular", image: glpVial },
  { name: "Wegovy® Pill", desc: "One pill per day.", price: "$99 Membership + Medication Cost", badge: "Rx", image: glpPill },
  { name: "GLP-1 Tablets", desc: "One dissolvable tablet per day.", price: "Starting at $249", badge: "New", image: glpTablets },
  { name: "Wegovy® Pen", desc: "Availability is expanding.", price: "$99 Membership", badge: "Rx", image: glpPen },
];

const stats = [
  { value: "10", unit: "%", label: "Average reduction in body weight over 6 months*", icon: TrendingDown },
  { value: "8/10", unit: "", label: "Users say this is more effective than anything they've ever tried", icon: Heart },
  { value: "6\"", unit: "", label: "Average reduction in waist size", icon: Hourglass },
  { value: "92", unit: "%", label: "Users have achieved lasting weight loss", icon: Smile },
];

const journeySteps = [
  { step: 1, title: "Take the medical questionnaire", desc: "Start today with our easy online patient intake form", image: glpPhoneConsult },
  { step: 2, title: "Get prescribed", desc: "All prescriptions overseen by fully licensed and insured physicians. Currently 3 Telemed Doctor Consultations Available Today (100% included with your purchase)", image: glpDoctor },
  { step: 3, title: "Get your meds", desc: "Our pharmacy will compound your medication and deliver it direct to your door!", image: glpDelivery },
];

const reviews = [
  { name: "Billy", text: "She listened to my needs and provided details of the meds and any issues that arise.", rating: 5 },
  { name: "Terika", text: "The provider was knowledgeable and helpful. She answered all my questions and made me feel comfortable.", rating: 5 },
  { name: "Jamie", text: "Questions are to the point and easy to navigate. They are quick to respond.", rating: 5 },
  { name: "Jacqueline", text: "My experience is very positive. They have been attentive and provided all resources to succeed.", rating: 5 },
  { name: "Diana", text: "The staff has been so friendly and caring. I get immediate answers from a real person!", rating: 5 },
  { name: "Terri", text: "Losing weight without a crazy diet, without cardio...it felt like magic. I feel so much better.", rating: 5 },
];

const faqs = [
  { q: "How does Youth & Soul work?", a: "Youth & Soul allows you to get prescription weight loss medications such as semaglutide & tirzepatide from the comfort of your home. The first step is to see if you qualify for GLP-1 medications by clicking on \"Do I Qualify?\". Your card will be authorized-only for your medication once you finish the eligibility questionnaire. Your pricing is one simple monthly price and includes medication, doctors visits, shipping, and all supplies needed. Once your doctor approves your prescription, our US based compounding pharmacy will ship out your medication the next day via UPS." },
  { q: "How do I know this is safe?", a: "Youth & Soul has taken numerous steps to ensure compliance and safety for our patients. All doctors have been properly vetted to ensure they're licensed to prescribe GLP-1 medications in your state. Pharmacies are US based 503A compounding pharmacies that are licensed and insured. We maintain LegitScript certification which is the telemedicine industry's most recognized compliance authority." },
  { q: "So how does the signup process work?", a: "1. Complete the health qualifier (should only take 5 minutes). 2. Select your preferred prescription. 3. Your card will be pre-authorized only to secure inventory & telemed appointment. 4. Complete medical intake form by logging into your patient portal. 5. Your doctor is expected to review your chart within 24 hrs and often less than 5 hrs. 6. After a thorough medical evaluation, your provider will determine whether a prescription is appropriate. 7. If approved, our pharmacy will ship your medication using 1-day FedEx or UPS." },
  { q: "How does the pricing work?", a: "Youth & Soul partners with licensed doctors and pharmacies to offer competitive pricing on compounded GLP-1 weight loss medications. Our pricing is transparent with no hidden costs or monthly fees. Included in this simple pricing is your medication, doctors visits, 2-day shipping, and all supplies needed for injections. We do not charge access or membership fees." },
  { q: "What if I need to cancel?", a: "With Youth & Soul there are no contracts for our month to month pricing. Month to month customers can cancel their shipment anytime. We want to make sure that our customers love the results of our treatment plans so we offer a patient satisfaction guarantee. If you are unhappy with your results, let us know and we'll make it right." },
  { q: "Is the medication real semaglutide & tirzepatide?", a: "Yes, both of our GLP-1 weight loss medications are real prescription medications that are prescribed by a doctor and compounded by a real US based pharmacy. We offer only the best Semaglutide and Tirzepatide medications for weight loss management for customers that meet the qualifications required for GLP-1 medications." },
  { q: "How much weight will I lose?", a: "Individual weight-loss is dependent on a number of factors but on average patients using GLP-1 medications lose around 1.5% of their body weight per week. Over 12 weeks, it can be as high as 10%. This equates to a weight loss of 10–20 pounds for a 200 pound person." },
  { q: "How is it shipped?", a: "Prescriptions received before 2 pm central time will be shipped the same day. Your prescription will be shipped next-day via UPS in a temperature controlled package. You'll receive a tracking number for every shipment. Each shipment is fully insured for lost prescriptions." },
  { q: "Do you offer non-injectable GLP-1 options?", a: "Yes! We currently offer oral sublingual Semaglutide. Studies show this medication is a great and effective alternative to injections." },
];

const comparisonFeatures = [
  "Same Day Appointments!",
  "All-inclusive Pricing!",
  "No Membership Fees!",
  "Medication Included!",
  "Meds delivered in 1 business day",
  "Semaglutide and Tirzepatide Offered",
];

const competitors = [
  { name: "Youth&Soul", highlight: true, checks: [true, true, true, true, true, true] },
  { name: "Henry", highlight: false, checks: [true, false, false, true, false, true] },
  { name: "hims & hers", highlight: false, checks: [false, false, false, false, false, false] },
  { name: "reflexmd", highlight: false, checks: [false, false, false, false, false, false] },
];

const insuranceProviders = ["Aetna", "BlueCross BlueShield", "Health Net", "Cigna", "United Healthcare", "Medicare"];

export default function WeightLossGLP() {
  const navigate = useNavigate();
  const [currentWeight, setCurrentWeight] = useState([200]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEOHead({
    title: "GLP-1 Weight Loss Program — Semaglutide & Tirzepatide | Youth & Soul",
    description: "Doctor-guided GLP-1 weight loss program with Semaglutide and Tirzepatide. Lose pounds of fat every week with personalized telehealth care. No hidden fees, free shipping.",
    path: "/weightloss-glp",
    keywords: "GLP-1 weight loss program, semaglutide weight loss, tirzepatide, ozempic alternative, telehealth weight loss, prescription weight loss online, compounded GLP-1",
  });

  const weightLossPotential = Math.round(currentWeight[0] * 0.23);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(80,20%,96%)] to-background pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Finally serious about weight loss? So are we. Fat loss{" "}
            <span className="text-primary">made easy</span> with personalized care and GLP-1 medication
          </h1>
          <ul className="flex flex-col items-center gap-2 mb-6">
            {["Lose pounds of fat every week", "No membership or hidden fees — everything included", "Start for just $179, no insurance required + free shipping", "HSA/FSA Approved!"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm md:text-base text-foreground">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/weightloss-glp-intake")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors uppercase tracking-wide"
          >
            AM I QUALIFIED?
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Plans */}
          <div className="mt-10 max-w-4xl mx-auto">
            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-4">Popular Weight Loss Plans</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-3xl mx-auto">
              All plans include a licensed doctor consultation, prescription, and free monthly delivery. Fast, simple to use care with next-day treatment — redefining healthcare.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "Entry Dose", desc: "Semaglutide 4mg", price: "$199/mo", label: "Level 1" },
                { name: "Higher Dose", desc: "Semaglutide 10mg + B12", price: "$349/mo", label: "Level 2" },
                { name: "Premium Stack", desc: "Tirzepatide + B12 + NAD+", price: "$599/mo", label: "Level 3" },
              ].map((plan) => (
                <div key={plan.name} className="bg-card rounded-2xl border border-border p-5 text-center hover:shadow-medium transition-shadow">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2">{plan.label}</span>
                  <h4 className="text-base font-bold text-foreground mb-1">{plan.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{plan.desc}</p>
                  <p className="text-lg font-bold text-primary mb-3">{plan.price}</p>
                  <button onClick={() => navigate("/weightloss-glp-intake")} className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors uppercase tracking-wide">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accepted Insurance Providers */}
      <section className="py-8 md:py-12 bg-[hsl(220,15%,96%)]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Accepted Insurance Providers</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
            Youth&Soul partners with most major PPO insurance plans — coverage details may vary depending on your specific plan. Standard deductibles, coinsurance, and copays may apply.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {insuranceProviders.map((name) => (
              <div key={name} className="bg-card rounded-2xl p-6 flex items-center justify-center border border-border/30">
                <span className="text-base md:text-lg font-bold text-foreground/70">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-2">
            The change we've all been waiting for.
          </h2>
          <p className="text-center text-muted-foreground text-sm md:text-base mb-8">
            Join the over <span className="font-bold text-primary">500,000</span> patients and we'll help you finally get real, lasting results.
          </p>
          <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src={glpPerson1} alt="Happy woman" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={glpPerson2} alt="Confident man" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden row-span-2 aspect-auto">
              <img src={glpPerson3} alt="Woman feeling great" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src={glpPerson4} alt="Celebrating" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={glpPerson5} alt="Healthy woman" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={glpPerson6} alt="Young woman" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src={glpPerson7} alt="Man smiling" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8">
            {[
              "6x more weight loss than exercise and diet alone",
              "Lose an average of 18% of your body weight",
              "93% kept the weight off for good",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            * Data based on Youth&Soul patients over their first 6 months of treatment
          </p>
        </div>
      </section>

      {/* Products with medication images */}
      <section className="py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground italic">
                Trusted by experts,{" "}
                <span className="text-primary not-italic">priced for you.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mt-2 md:mt-0">
              Find the right GLP-1 medication with the confidence that comes from knowing it is <strong className="text-foreground">doctor-approved</strong> and budget-friendly.
            </p>
          </div>

          {/* Semaglutide & Tirzepatide hero images */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[hsl(160,10%,97%)] rounded-2xl p-6 flex flex-col items-center">
              <img src={semaglutideProduct} alt="Semaglutide medication kit" className="w-full max-w-[280px] h-auto object-contain mb-4" loading="lazy" />
              <h3 className="text-lg font-bold text-foreground">Semaglutide</h3>
              <p className="text-xs text-muted-foreground">Same active ingredient in Ozempic®</p>
            </div>
            <div className="bg-[hsl(160,10%,97%)] rounded-2xl p-6 flex flex-col items-center">
              <img src={tirzepatideProduct} alt="Tirzepatide medication kit" className="w-full max-w-[280px] h-auto object-contain mb-4" loading="lazy" />
              <h3 className="text-lg font-bold text-foreground">Tirzepatide</h3>
              <p className="text-xs text-muted-foreground">Same active ingredient in Mounjaro®</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.name} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-medium transition-shadow">
                <div className="aspect-square bg-[hsl(160,10%,95%)] p-4 flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs text-primary font-medium mb-1">{p.price}</p>
                  <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{p.desc}</p>
                  <button
                    onClick={() => navigate("/weightloss-glp-intake")}
                    className="w-full px-4 py-2.5 bg-foreground text-background rounded-full text-xs font-semibold hover:bg-foreground/90 transition-colors uppercase tracking-wide"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weight Slider */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Want to <span className="text-primary">reach your goal</span> weight fast?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                It's not magic—it's <em className="font-semibold text-foreground">metabolic science</em>. GLP-1 is a naturally occurring hormone that regulates appetite and blood sugar,{" "}
                <strong className="text-primary">improving your metabolism</strong> and knocking out cravings.
              </p>
              <button
                onClick={() => navigate("/weightloss-glp-intake")}
                className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full font-semibold text-sm hover:bg-foreground/90 transition-colors uppercase tracking-wide"
              >
                Get Started
              </button>
            </div>
            <div className="bg-[hsl(80,10%,96%)] rounded-3xl p-8 md:p-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Select your current weight:</span>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {currentWeight[0]} <span className="text-base font-normal text-muted-foreground">lbs</span>
                </p>
              </div>
              <Slider
                value={currentWeight}
                onValueChange={setCurrentWeight}
                min={120}
                max={400}
                step={1}
                className="my-6 [&_[data-radix-slider-track]]:bg-[hsl(40,30%,80%)] [&_[data-radix-slider-range]]:bg-[hsl(40,30%,65%)] [&_[data-radix-slider-thumb]]:border-[hsl(40,30%,65%)] [&_[data-radix-slider-thumb]]:bg-background [&_[data-radix-slider-thumb]]:w-6 [&_[data-radix-slider-thumb]]:h-6"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-semibold text-foreground">Weight loss potential:</span>
                <p className="text-4xl md:text-5xl font-bold text-foreground">
                  <span className="text-primary">{weightLossPotential}</span>{" "}
                  <span className="text-base font-normal text-muted-foreground">lbs</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metabolism Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[hsl(30,20%,95%)] rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex gap-4">
                <div className="flex-1 rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={glpMetabolismWoman} alt="Patient success story" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden aspect-[3/4] mt-8">
                  <img src={glpVial} alt="GLP-1 medication" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  We will fix your broken metabolism.
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                  Traditional diets don't work because nearly 70% of weight is{" "}
                  <strong className="text-primary">genetically determined</strong>. With medication, you will work{" "}
                  <strong className="text-foreground underline">with your body</strong> rather than against it — to reach your goal weight and keep it that way.
                </p>
                <button
                  onClick={() => navigate("/weightloss-glp-intake")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background rounded-full font-semibold text-sm hover:bg-foreground/90 transition-colors uppercase tracking-wide"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Dark theme with icons like reference image 4 + graph */}
      <section className="py-12 md:py-20 bg-[hsl(220,30%,12%)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-2">
            Why are so many patients signing up? <span className="text-primary italic">It works.</span>
          </h2>
          <p className="text-center text-[hsl(220,10%,60%)] text-sm mb-10">
            On average, patients in our program lose 15–20% of their body weight.
          </p>

          {/* Stats cards - dark theme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-[hsl(220,25%,16%)] rounded-2xl p-6 border border-[hsl(220,20%,25%)]">
                <s.icon className="w-8 h-8 text-primary mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {s.value}<span className="text-primary">{s.unit}</span>
                </p>
                <p className="text-xs md:text-sm text-[hsl(220,10%,60%)]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Weight loss graph visualization */}
          <div className="bg-[hsl(220,25%,16%)] rounded-2xl p-6 md:p-10 border border-[hsl(220,20%,25%)]">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Medication images */}
              <div className="flex gap-4 shrink-0">
                <div className="w-24 md:w-32">
                  <img src={semaglutideProduct} alt="Semaglutide" className="w-full h-auto object-contain" loading="lazy" />
                  <p className="text-xs text-center text-[hsl(220,10%,60%)] mt-2">Semaglutide</p>
                </div>
                <div className="w-24 md:w-32">
                  <img src={tirzepatideProduct} alt="Tirzepatide" className="w-full h-auto object-contain" loading="lazy" />
                  <p className="text-xs text-center text-[hsl(220,10%,60%)] mt-2">Tirzepatide</p>
                </div>
              </div>
              {/* Graph visualization */}
              <div className="flex-1 w-full">
                <div className="relative h-40 md:h-48">
                  <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="graphGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(260,70%,60%)" />
                        <stop offset="100%" stopColor="hsl(300,70%,60%)" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[80, 160, 240, 320].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="150" stroke="hsl(220,20%,25%)" strokeWidth="1" strokeDasharray="4,4" />
                    ))}
                    {/* Curve */}
                    <path d="M 0,20 C 80,25 120,50 200,70 C 280,90 340,110 400,120" fill="none" stroke="url(#graphGrad)" strokeWidth="3" />
                    {/* Dots */}
                    {[[0, 20], [100, 40], [200, 70], [300, 100], [370, 115]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="6" fill="white" stroke="url(#graphGrad)" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                    <span className="text-xs text-[hsl(220,10%,60%)]">Today</span>
                    <span className="text-xs text-[hsl(220,10%,60%)]">Goal</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[hsl(220,10%,45%)] mt-4">
              * Based on the average weight loss in three 68-week clinical trials of patients without diabetes who reached and maintained a dose of 2.4 mg/week of GLP-1 treatment, along with a reduced-calorie diet and increased physical activity.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Journey - Redesigned like reference image 7 */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-2 italic">
            How It Works — 3 Easy Steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {journeySteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="rounded-2xl overflow-hidden aspect-square w-40 md:w-48 bg-muted mb-6">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">{step.step}</span>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/weightloss-glp-intake")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors uppercase tracking-wide"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center text-foreground mb-2">
            There's a reason people are <span className="text-primary">raving about our GLP-1 products.</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">Thousands have trusted us to help change their lives.</p>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {reviews.map((r, i) => (
              <div key={i} className="shrink-0 w-[280px] bg-card rounded-2xl p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{r.name[0]}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                  <div className="flex gap-0.5 ml-auto">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-primary text-primary" />)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12 md:py-20 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center text-foreground mb-8">
            GLP-1 Medications cost less with <span className="text-primary">Youth&Soul</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 text-sm font-medium text-muted-foreground" />
                  {competitors.map((c) => (
                    <th key={c.name} className={`p-3 text-center text-sm font-bold ${c.highlight ? "text-primary" : "text-foreground"}`}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, fi) => (
                  <tr key={feature} className="border-t border-border">
                    <td className="p-4 text-sm font-semibold text-foreground">{feature}</td>
                    {competitors.map((c) => (
                      <td key={c.name} className={`p-4 text-center ${c.highlight ? "bg-primary/10" : ""}`}>
                        {c.checks[fi] ? (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto ${c.highlight ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center mx-auto">
                            <X className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4">* Patient experience is unique and will vary</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 md:py-16 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                  <span className="text-sm md:text-base font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-2 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee CTA */}
      <section className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2">Youth & Soul Guarantee</h2>
          <p className="text-muted-foreground text-sm mb-6">The only thing you'll lose is extra weight. We're confident you will reach your goal with our personalized program.</p>
          <button onClick={() => navigate("/weightloss-glp-intake")} className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Continue with confidence <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Bottom trust */}
      <div className="flex items-center justify-center gap-6 py-6 border-t border-border">
        {[
          { icon: Shield, label: "Guarantee" },
          { icon: Truck, label: "Free shipping" },
          { icon: Clock, label: "Doctor-led plans" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <item.icon className="w-4 h-4 text-primary" />
            {item.label}
          </div>
        ))}
      </div>

      <MinimalFooter />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
