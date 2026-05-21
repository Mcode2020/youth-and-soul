import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful, friendly customer service assistant for Youth&Soul — The Longevity & Health Marketplace.

Key info about Youth&Soul:
- We offer discount codes on anti-aging supplements, functional beauty & age reversal procedures
- Get a prescription in 5 mins with 24/7 doctor support
- We are NOT a pharmacy — we are a marketplace connecting users with verified brands and licensed medical providers

Our Health Plans:
1. Weight Loss & Metabolic Reset — GLP-1 injections, tablets, metabolic coaching. Starting at $179/month. Sign up: /glp-weightloss
2. Menopause & Hormonal Support — HRT, estrogen therapy, vaginal health. Sign up: /programs/menopause
3. Libido & Sexual Health — ED treatments, testosterone, libido support. Sign up: /programs/sexual-health
4. Hair Loss — Finasteride, minoxidil, PRP, laser therapy. Sign up: /programs/hair-loss
5. Skin & Anti-Aging — Retinol, microneedling, collagen peptides. Sign up: /programs/skin
6. Brain & Cognitive Health — Nootropics, NAD+, focus optimization. Sign up: /programs/brain-health
7. Gut & Digestion — Probiotics, GI support, microbiome optimization. Sign up: /programs/gut-health

When users ask about plans, provide the relevant link. For signup, direct them to the specific plan page.
For general browsing, suggest /explore or /all-products.
For contacting support, suggest /contact or email hello@youthandsoul.com.

Keep responses concise, warm, and helpful. Use emojis sparingly. If you don't know something, say so and suggest contacting support.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're experiencing high demand. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
