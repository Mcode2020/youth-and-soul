import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

type FreeFormQuestion = {
  type: string;
  id: string;
  text: string;
  answer: string;
};

type SubmitAnswersPayload = {
  freeFormQuestions: FreeFormQuestion[];
  weightLoss?: {
    currentDose?: string;
    currentWeightLoss?: string;
    dosePreference?: string;
    weightLossPreference: string;
    protocol: string;
  };
  medicationData?: {
    currentDose?: string;
    currentWeightLoss?: string;
    dosePreference?: string;
    weightLossPreference: string;
    protocol: string;
  };
};

const BASE_URL = Deno.env.get("BASK_API_BASE_URL") || "https://headless-api.bask.ninja/api/headless/v1";
const API_KEY = Deno.env.get("BASK_API_KEY") || "";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const stripBearer = (token: string) => token.replace(/^Bearer\s+/i, "").trim();

const normalizeBearer = (token: string) => {
  const raw = stripBearer(token || "");
  return raw ? `Bearer ${raw}` : "";
};

const baskFetch = async (
  path: string,
  method: "GET" | "POST" | "PUT",
  body?: unknown,
  authToken?: string,
  correlationId?: string,
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };
  if (authToken) headers.Authorization = normalizeBearer(authToken);
  if (correlationId) headers["x-client-correlation-id"] = correlationId;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let payload: Record<string, unknown> | null = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`Bask ${path} failed (${res.status}): ${JSON.stringify(payload)}`);
  }
  return payload;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!API_KEY) {
      return json({ success: false, error: "Missing BASK_API_KEY env var" }, 500);
    }

    const { submitAnswers, token, correlationId } = await req.json() as {
      submitAnswers: SubmitAnswersPayload;
      token: string;
      correlationId?: string;
    };

    if (!token) {
      return json({ success: false, error: "Missing Bask auth token" }, 400);
    }
    if (!submitAnswers?.freeFormQuestions?.length) {
      return json({ success: false, error: "Missing answers payload" }, 400);
    }

    await baskFetch("/questions-answers", "POST", submitAnswers, token, correlationId);

    return json({ success: true, submitted: true, message: "Answers submitted successfully." });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown bask-submit-answers error",
      },
      500,
    );
  }
});

