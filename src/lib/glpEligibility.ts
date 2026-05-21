// GLP-1 Eligibility & Approval Engine
// Based on FDA-labeled contraindications for Semaglutide & Tirzepatide

export type EligibilityResult = "approved" | "review" | "not_eligible";

export interface EligibilityOutput {
  result: EligibilityResult;
  score: number;
  bmi: number;
  estimatedWeeks: number;
  approvalProbability: number;
  flags: string[];
  message: string;
  subMessage: string;
}

/**
 * HARD DISQUALIFIERS — absolute contraindications per FDA labeling.
 * If ANY of these are selected → NOT ELIGIBLE (auto-fail).
 */
const HARD_DISQUALIFIERS = [
  // Thyroid cancer / MEN2 — FDA boxed warning
  "Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2",
  "Medullary thyroid cancer (MTC)",
  "MEN2 syndrome",
  // Pregnancy
  "Pregnant, breastfeeding, or trying to conceive",
  // Pancreatitis
  "History of pancreatitis",
  "History of or current pancreatitis",
  // Gastroparesis / severe GI
  "Diagnosed gastroparesis",
  "Severe gastrointestinal disease",
  "Severe GI condition (gastroparesis, bowel obstruction, IBD)",
  // Active cancer
  "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years — does not apply to non-melanoma skin cancer cured via simple excision)",
  "Active cancer diagnosis or treatment (excl. non-melanoma skin cancer cured via excision)",
  // End-stage organ disease
  "End-stage kidney disease or dialysis",
  "End-stage liver disease or cirrhosis",
  // Substance use disorders
  "Active substance use disorder or dependence",
  "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence",
  // Suicidal ideation
  "Active suicidal ideation or prior attempt",
  // Diabetic retinopathy
  "Diabetic retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness",
  // Recent bariatric surgery
  "Recent gastric bypass (within 6 months)",
  // Allergic to GLP-1 class
  "Allergic to GLP-1 medications (Ozempic/Wegovy/Zepbound/Mounjaro/Saxenda)",
  // Allergic to GLP-1 class
  "Allergic to GLP-1 medications (Ozempic/Wegovy/Zepbound/Mounjaro/Saxenda)",
  // Disqualifying concurrent medications
  "Taking medications that interact with GLP-1 therapy",
  // Additional MDI hard fails
  "Family history of medullary thyroid cancer",
  "MEN 2 syndrome (multiple endocrine neoplasia type 2)",
  "Eating disorder (bulimia, anorexia, or binge eating disorder)",
  "Suicidal thoughts or self-harm in the past 12 months",
  "Polycystic ovarian syndrome (PCOS) with active fertility concerns",
];

/**
 * BORDERLINE FLAGS — conditions that require final doctor sign-off.
 * Patient is NOT auto-failed but gets "Doctor Review Required" status.
 */
const BORDERLINE_FLAGS = [
  "Type 1 diabetes",
  "Type 2 diabetes (on insulin)",
  "Congestive heart failure",
  "Coronary artery disease or heart attack/stroke in last 2 years",
  "QT prolongation or other heart rhythm disorder",
  "Elevated resting heart rate (tachycardia)",
  "Kidney disease",
  "Liver disease, including fatty liver",
  "Gallbladder disease",
  "Use of warfarin (Coumadin/Jantoven)",
  "Seizure disorder",
  "Tumor/infection in brain/spinal cord",
];

export function calculateBMI(weightLbs: number, heightInches: number): number {
  if (heightInches <= 0 || weightLbs <= 0) return 0;
  return (weightLbs / (heightInches * heightInches)) * 703;
}

export function estimateWeeksToGoal(currentWeight: number, goalWeight: number): number {
  const diff = currentWeight - goalWeight;
  if (diff <= 0) return 0;
  return Math.round((diff / 3) * 100) / 100; // ~3 lbs/week average
}

export function heightToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

export function evaluateEligibility(
  bmi: number,
  medicalConditions: string[],
  comorbidities: string[],
  triedDietBefore: boolean,
  motivationLevel: string,
  bloodPressure?: string,
  heartRate?: string,
): EligibilityOutput {
  const flags: string[] = [];
  const allConditions = [...medicalConditions, ...comorbidities];

  // ─── 1. Check HARD DISQUALIFIERS ───
  const hardHits = allConditions.filter(c => HARD_DISQUALIFIERS.includes(c));
  if (hardHits.length > 0) {
    return {
      result: "not_eligible",
      score: 0,
      bmi,
      estimatedWeeks: 0,
      approvalProbability: 0,
      flags: hardHits,
      message: "This program may not be the best fit for you right now.",
      subMessage: "We'll recommend alternative wellness solutions tailored to your goals.",
    };
  }

  // ─── 2. Check blood pressure & heart rate hard fails ───
  // Stage 2 hypertension (≥140/90) — requires doctor review, NOT auto-fail
  // Heart rate >110 bpm — requires doctor review
  // Heart rate <40 bpm would be concerning but our options are "Under 60 bpm" which is bradycardia territory
  // Per clinical guidelines, stage 2 BP and tachycardia >110 are NOT absolute contraindications
  // but do warrant physician oversight before starting GLP-1
  const needsDoctorReview =
    bloodPressure === "high_2" ||
    heartRate === "fast" ||
    heartRate === "slow";

  if (needsDoctorReview) {
    flags.push(
      ...(bloodPressure === "high_2" ? ["Stage 2 hypertension (140/90+) — doctor review required"] : []),
      ...(heartRate === "fast" ? ["Elevated heart rate (>110 bpm) — doctor review required"] : []),
      ...(heartRate === "slow" ? ["Low heart rate (<60 bpm) — doctor review required"] : []),
    );
  }

  // ─── 3. Check BORDERLINE conditions ───
  const borderlineHits = allConditions.filter(c => BORDERLINE_FLAGS.includes(c));
  if (borderlineHits.length > 0) {
    flags.push(...borderlineHits);
  }

  // ─── 4. Decision logic ───
  // If there are borderline flags or vital sign concerns → Doctor Review
  // Otherwise → Approved
  if (flags.length > 0) {
    return {
      result: "review",
      score: 5,
      bmi,
      estimatedWeeks: 0,
      approvalProbability: Math.min(88, 70 + (5 - Math.min(flags.length, 5)) * 4),
      flags,
      message: "A licensed physician will review your information to confirm eligibility.",
      subMessage: "Most patients in your profile are approved. If you're not approved, you'll receive a full refund.",
    };
  }

  // ─── 5. APPROVED — no hard fails, no borderline concerns ───
  return {
    result: "approved",
    score: 7,
    bmi,
    estimatedWeeks: 0,
    approvalProbability: 96,
    flags: [],
    message: "You're a strong candidate for medical weight loss!",
    subMessage: "You have a 96% chance of successful treatment if qualified.",
  };
}
