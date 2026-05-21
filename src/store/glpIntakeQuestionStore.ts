import { calculateBMI, heightToInches } from "@/lib/glpEligibility";

export const GLP_INTAKE_QA_KEY = "ys_glp_intake_question_answers";

export type IntakeQuestionAnswer = {
  question_id: string;
  question_title: string;
  question_type: string;
  question_answer: string;
};

export type GlpIntakeQuestionSource = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  heightFeet: string;
  heightInches: string;
  currentWeight: string;
  lbsToLose: string;
  paceFeeling: string;
  hardConditions: string[];
  softConditions: string[];
  glp1Current: string;
  glp1Drug: string;
  semaDose: string;
  tirzDose: string;
  doseDirection: string;
  medAvailable: string;
  medPhotoName: string;
  sideEffects: string;
  sideEffectsDetail: string;
  currentMedsList: string;
  allergies: string;
  disclaimerAck: boolean;
  gastricBypass6mo: string;
  glp1Allergy: string;
  disqualifyingMeds: string;
  pregnant: string;
  breastfeeding: string;
  additionalInfo: string;
};

const toYesNo = (value: string | boolean): string => {
  if (typeof value === "boolean") return value ? "yes" : "no";
  return value || "";
};

export const buildGlpIntakeQuestionAnswers = (input: GlpIntakeQuestionSource): IntakeQuestionAnswer[] => {
  const bmi = calculateBMI(
    parseFloat(input.currentWeight),
    heightToInches(parseInt(input.heightFeet, 10) || 0, parseInt(input.heightInches, 10) || 0),
  );
  const combinedConditions = [...input.hardConditions, ...input.softConditions].filter(v => v && v !== "None of the below");
  const hasCurrentConditions = combinedConditions.length > 0 ? "yes" : "no";
  const bmiAnswer = Number.isFinite(bmi)
    ? `Height: ${input.heightFeet || "0"}'${input.heightInches || "0"};Weight: ${input.currentWeight || "0"}lbs;BMI: ${Number(bmi.toFixed(2))}`
    : "";

  const qa: IntakeQuestionAnswer[] = [
    { question_id: "819134", question_title: "Basic Info", question_type: "text", question_answer: [input.firstName, input.lastName, input.dateOfBirth].filter(Boolean).join(" | ") },
    { question_id: "819163", question_title: "Gender", question_type: "radio", question_answer: input.gender },
    { question_id: "819135", question_title: "Calculate BMI", question_type: "text", question_answer: bmiAnswer },
    { question_id: "819171", question_title: "Are you taking a GLP-1?", question_type: "radio", question_answer: input.glp1Current },
    { question_id: "819147", question_title: "GLP-1 medication in past two months", question_type: "radio", question_answer: input.glp1Drug },
    { question_id: "819167", question_title: "Which dose are you currently taking? (Semaglutide)", question_type: "radio", question_answer: input.semaDose },
    { question_id: "819216", question_title: "Which dose are you currently taking? (Tirzepatide)", question_type: "radio", question_answer: input.tirzDose },
    { question_id: "819152", question_title: "Please select from the following options", question_type: "radio", question_answer: input.doseDirection },
    { question_id: "819218", question_title: "Do you have your current medication available?", question_type: "radio", question_answer: input.medAvailable },
    { question_id: "819149", question_title: "Please upload a picture of your current medication", question_type: "file", question_answer: input.medPhotoName },
    { question_id: "819150", question_title: "Have you experienced side effects from your current medication?", question_type: "radio", question_answer: input.sideEffects },
    { question_id: "819151", question_title: "Please describe the side effects that you've experienced here", question_type: "textarea", question_answer: input.sideEffectsDetail },
    { question_id: "819132", question_title: "Current Medications", question_type: "textarea", question_answer: input.currentMedsList },
    { question_id: "819136", question_title: "Allergies?", question_type: "radio", question_answer: input.allergies },
    { question_id: "819137", question_title: "Current Medical Conditions?", question_type: "radio", question_answer: hasCurrentConditions },
    { question_id: "819139", question_title: "Current and past medical conditions", question_type: "checkbox", question_answer: combinedConditions.join(", ") },
    { question_id: "819138", question_title: "What you should know?", question_type: "checkbox", question_answer: toYesNo(input.disclaimerAck) },
    { question_id: "819204", question_title: "Have you had a gastric bypass in the past 6 months?", question_type: "radio", question_answer: input.gastricBypass6mo },
    { question_id: "819158", question_title: "Are you allergic to any of the following?", question_type: "radio", question_answer: input.glp1Allergy },
    { question_id: "819142", question_title: "Do you take any of the following medications?", question_type: "radio", question_answer: input.disqualifyingMeds },
    { question_id: "819144", question_title: "Are you currently pregnant or planning to become pregnant soon?", question_type: "radio", question_answer: input.pregnant },
    { question_id: "819145", question_title: "Are you currently breastfeeding?", question_type: "radio", question_answer: input.breastfeeding },
    { question_id: "819217", question_title: "Anything else to ask your doctor?", question_type: "radio", question_answer: input.additionalInfo.trim() ? "yes" : "no" },
    { question_id: "819153", question_title: "Questions for the doctor", question_type: "textarea", question_answer: input.additionalInfo.trim() },
  ];

  return qa.filter((item) => item.question_answer !== "");
};

export const persistGlpIntakeQuestionAnswers = (input: GlpIntakeQuestionSource): IntakeQuestionAnswer[] => {
  const answers = buildGlpIntakeQuestionAnswers(input);
  localStorage.setItem(GLP_INTAKE_QA_KEY, JSON.stringify(answers));
  return answers;
};
