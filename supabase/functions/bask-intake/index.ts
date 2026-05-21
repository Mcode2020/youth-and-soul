import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

type SignupPayload = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  testModeEnabled?: boolean;
};

const BASE_URL = Deno.env.get("BASK_API_BASE_URL") || "https://headless-api.bask.ninja/api/headless/v1";
const API_KEY = Deno.env.get("BASK_API_KEY") || "";
const TEST_MODE_ENABLED = (Deno.env.get("TEST_MODE_ENABLED") || "false").toLowerCase() === "true";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const extractToken = (payload: Record<string, unknown> | null): string => {
  const p = (payload || {}) as Record<string, unknown>;
  const data = (p.data || {}) as Record<string, unknown>;
  return (
    (typeof data.newToken === "string" ? data.newToken : "") ||
    (typeof p.newToken === "string" ? p.newToken : "") ||
    (typeof data.token === "string" ? data.token : "") ||
    (typeof p.token === "string" ? p.token : "") ||
    (typeof data.accessToken === "string" ? data.accessToken : "") ||
    (typeof p.accessToken === "string" ? p.accessToken : "") ||
    ""
  );
};

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

    const { signup } = await req.json() as { signup: SignupPayload };

    if (!signup?.email || !signup?.firstName || !signup?.lastName || !signup?.phoneNumber) {
      return json({ success: false, error: "Missing required signup fields" }, 400);
    }

    const correlationId = globalThis.crypto.randomUUID();
    const signupPayload = { ...signup, testModeEnabled: signup.testModeEnabled ?? TEST_MODE_ENABLED };
    const signupResponse = await baskFetch("/auth/signup", "POST", signupPayload, undefined, correlationId);

    const token = extractToken(signupResponse as Record<string, unknown>);
    const authMode: "signup_token" | "signup_no_token" = token ? "signup_token" : "signup_no_token";

    if (!token) {
      // Existing user path fallback: try OTP send only so caller can continue with manual OTP flow if needed.
      await baskFetch("/auth/send-otp", "POST", { email: signup.email }, undefined, correlationId);
    }

    return json({
      success: true,
      authMode,
      token: stripBearer(token),
      correlationId,
      message: token
        ? "User registered and authenticated."
        : "User may already exist. OTP sent; auth token not returned.",
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown bask-intake error",
      },
      500,
    );
  }
});
