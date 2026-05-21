import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a knowledgeable health and wellness AI assistant for Youth&Soul, a longevity and anti-aging marketplace. 

When a user asks a health-related question, provide a helpful, informative answer based on your knowledge. Include:
1. A clear, concise answer to their question
2. Relevant scientific context when appropriate
3. Product/supplement recommendations when relevant
4. Safety disclaimers when discussing medical topics

Format your response as JSON with these fields:
- "answer": A comprehensive but concise answer (2-4 paragraphs, use markdown formatting)
- "relatedTopics": Array of 3-5 related search terms the user might want to explore
- "productSuggestions": Array of objects with "name" and "category" fields for products that might help (based on common supplements/products in the longevity space)

Always respond with valid JSON only. Be helpful, accurate, and note when someone should consult a healthcare professional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("AI gateway error:", response.status, errorText);
      const fallback =
        response.status === 402
          ? "Our AI concierge is briefly offline. A licensed doctor can still help — see the recommended programs below."
          : response.status === 429
          ? "We're getting a lot of questions right now — please try again in a moment."
          : "Our AI assistant is briefly unavailable. Explore the recommended programs below.";
      return new Response(
        JSON.stringify({ answer: fallback, sources: [], fallback: true, upstreamStatus: response.status }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = {
        answer: aiResponse || "I couldn't process that question. Please try rephrasing.",
        relatedTopics: [],
        productSuggestions: [],
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI search error:", e);
    return new Response(
      JSON.stringify({
        answer: "Our AI assistant is briefly unavailable. Explore the recommended programs below.",
        sources: [],
        fallback: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
