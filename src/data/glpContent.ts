import {
  TrendingDown, Heart, Hourglass, Smile,
} from "lucide-react";

/* ── Shared stats ── */
export const heroStats = [
  { value: "10", unit: "%", label: "Average reduction in body weight over 6 months*", icon: TrendingDown },
  { value: "8/10", unit: "", label: "Users say this is more effective than anything they've ever tried", icon: Heart },
  { value: "6\"", unit: "", label: "Average reduction in waist size", icon: Hourglass },
  { value: "92", unit: "%", label: "Users have achieved lasting weight loss", icon: Smile },
];

/* ── Shared journey steps (images imported by consumer) ── */
export const journeyStepTexts = [
  { step: 1, title: "Take the medical questionnaire", desc: "Start today with our easy online patient intake form and join a monthly health plan" },
  { step: 2, title: "Get prescribed", desc: "All prescriptions overseen by fully licensed and insured physicians. Currently 3 Telemed Doctor Consultations Available Today (100% included with your purchase)" },
  { step: 3, title: "Get your meds", desc: "Our pharmacy will compound your medication and deliver it direct to your door!" },
];

/* ── Shared reviews (fallback when DB is empty) ── */
export const defaultReviews = [
  { name: "Billy", text: "She listened to my needs and provided details of the meds and any issues that arise.", rating: 5 },
  { name: "Terika", text: "The provider was knowledgeable and helpful. She answered all my questions and made me feel comfortable.", rating: 5 },
  { name: "Jamie", text: "Questions are to the point and easy to navigate. They are quick to respond.", rating: 5 },
  { name: "Jacqueline", text: "My experience is very positive. They have been attentive and provided all resources to succeed.", rating: 5 },
  { name: "Diana", text: "The staff has been so friendly and caring. I get immediate answers from a real person!", rating: 5 },
  { name: "Terri", text: "Losing weight without a crazy diet, without cardio...it felt like magic. I feel so much better.", rating: 5 },
];

/* ── Shared FAQs ── */
export const glpFaqs = [
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
