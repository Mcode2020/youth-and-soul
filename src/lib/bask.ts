import { supabase } from "@/integrations/supabase/client";
import { buildGlpIntakeQuestionAnswers, type GlpIntakeQuestionSource } from "@/store/glpIntakeQuestionStore";

export const BASK_AUTH_COOKIE = "baskAuthToken";
export const BASK_CORRELATION_COOKIE = "baskCorrelationId";

type BaskSignupInput = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

type BaskIntakeResponse = {
  success: boolean;
  authMode?: "signup_token" | "signup_no_token";
  token?: string;
  correlationId?: string;
  message?: string;
  error?: string;
};

type BaskSubmitAnswersResponse = {
  success: boolean;
  submitted?: boolean;
  message?: string;
  error?: string;
};

const normalizeQuestionType = (type: string): string => {
  if (type === "textarea") return "text";
  if (type === "file") return "text";
  return type || "text";
};

const toBaskAnswersPayload = (source: GlpIntakeQuestionSource) => {
  const answers = buildGlpIntakeQuestionAnswers(source);
  const freeFormQuestions = answers.map((a) => ({
    type: normalizeQuestionType(a.question_type),
    id: a.question_id,
    text: a.question_title,
    answer: a.question_answer,
  }));

  const currentDose = source.glp1Drug === "semaglutide"
    ? source.semaDose
    : source.glp1Drug === "tirzepatide"
      ? source.tirzDose
      : undefined;

  const weightLossModel = {
    currentDose,
    currentWeightLoss: source.lbsToLose || undefined,
    dosePreference: source.doseDirection || undefined,
    weightLossPreference: source.paceFeeling?.toLowerCase().includes("faster") ? "aggressive" : "decrease",
    protocol: "standard",
  };

  return {
    freeFormQuestions,
    weightLoss: weightLossModel,
    medicationData: weightLossModel,
  };
};

export const setBaskCookies = (token: string, correlationId?: string) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${BASK_AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
  if (correlationId) {
    document.cookie = `${BASK_CORRELATION_COOKIE}=${encodeURIComponent(correlationId)}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
  }
};

export const submitGlpIntakeToBask = async (
  signup: BaskSignupInput,
): Promise<BaskIntakeResponse> => {
  const { data, error } = await supabase.functions.invoke("bask-intake", {
    body: { signup },
  });

  if (error) {
    throw new Error(error.message || "Failed to call bask-intake");
  }

  const result = data as BaskIntakeResponse;
  if (!result?.success) {
    throw new Error(result?.error || "Bask intake failed");
  }

  if (result.token) {
    setBaskCookies(result.token, result.correlationId);
  }

  return result;
};

export const submitBaskAnswers = async (
  source: GlpIntakeQuestionSource,
  token: string,
  correlationId?: string,
): Promise<BaskSubmitAnswersResponse> => {
  const submitAnswers = toBaskAnswersPayload(source);
  const { data, error } = await supabase.functions.invoke("bask-submit-answers", {
    body: { submitAnswers, token, correlationId },
  });

  if (error) {
    throw new Error(error.message || "Failed to call bask-submit-answers");
  }

  const result = data as BaskSubmitAnswersResponse;
  if (!result?.success) {
    throw new Error(result?.error || "Bask answer submission failed");
  }

  return result;
};
