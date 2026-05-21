import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TWILIO_GATEWAY = "https://connector-gateway.lovable.dev/twilio";
const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
const EMAIL_PLAN_IMAGE_BASE = "https://youthandsoulcom.lovable.app/images/email-plans";
const EMAIL_FROM = "Youth & Soul <care@youthnsoul.com>";
const EMAIL_ASSET_VERSION = "20260423-program-banners-2";

type ResponsiveEmailImage = {
  desktop: string;
  mobile: string;
  fallback: string;
};

const buildPlanImageSet = (slug: string): ResponsiveEmailImage => ({
  desktop: `${EMAIL_PLAN_IMAGE_BASE}/${slug}-desktop.jpg?v=${EMAIL_ASSET_VERSION}`,
  mobile: `${EMAIL_PLAN_IMAGE_BASE}/${slug}-mobile.jpg?v=${EMAIL_ASSET_VERSION}`,
  fallback: `${EMAIL_PLAN_IMAGE_BASE}/${slug}-desktop.jpg?v=${EMAIL_ASSET_VERSION}`,
});

const getPlanImageUrl = (slug: string) => `${EMAIL_PLAN_IMAGE_BASE}/${slug}-desktop.jpg?v=${EMAIL_ASSET_VERSION}`;

const normalizePhoneNumber = (phone?: string | null) => {
  if (!phone) return null;
  const trimmed = phone.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return trimmed;
};

const getProgramDisplayName = (slug?: string) => {
  const map: Record<string, string> = {
    "weight-loss": "GLP-1 Weight Loss",
    "menopause-hrt": "Menopause & HRT",
    "sexual-health": "Libido & Sexual Health",
    "skin-hair": "Skin, Hair & Anti-Aging",
    "longevity": "Longevity & Vitality",
    "pain-recovery": "Pain & Recovery",
    "brain-cognitive": "Brain & Cognitive Performance",
    "gut-health": "Gut Health & Digestion",
    "mental-health": "Mental Health & Therapy",
    "hot-health": "Hot Health: Looks & Beauty",
  };
  return map[slug || ""] || "Health & Wellness";
};

const getProgramPlanDetails = (slug?: string, tierName?: string) => {
  const details: Record<string, { image: string; description: string; tiers: Record<string, string[]> }> = {
    "sexual-health": {
      image: getPlanImageUrl("sexual-health"),
      description: "Physician-guided treatments for intimacy, libido, and performance support with discreet delivery.",
      tiers: {
        "Sildenafil (Generic Viagra®)": ["Sildenafil 50mg or 100mg tablets (up to 30/mo)", "Licensed physician consultation", "Dosage optimization & safety review", "Discreet packaging & free shipping", "Unlimited doctor messaging"],
        "Daily Tadalafil + Oxytocin": ["Tadalafil 5mg daily for continuous support", "Tadalafil 10/20mg PRN for peak performance", "Oxytocin troches for intimacy & bonding", "Physician monitoring & dose adjustments", "Cardiovascular health screening", "Discreet packaging & free shipping"],
        "PT-141 + Full Performance Stack": ["PT-141 (Bremelanotide) subcutaneous injection", "Tadalafil 5mg daily", "Oxytocin troches", "Testosterone level assessment", "Full consultation & ongoing monitoring", "Works for both men & women", "Priority support & discreet shipping"],
      },
    },
    "menopause-hrt": {
      image: getPlanImageUrl("menopause-hrt"),
      description: "Hormonal support reviewed by licensed clinicians, with treatment selected around symptoms and safety.",
      tiers: {
        "Peri-Menopause Relief Kit": ["Bioidentical Estradiol patch (0.025–0.1mg)", "Oral Micronized Progesterone 100–200mg", "Female physician consultation", "Symptom tracking & dose adjustments", "Hot flash & mood management plan", "Free discreet shipping"],
        "Complete Menopause Wellness": ["Bioidentical Estradiol patch or cream", "Oral Micronized Progesterone", "DHEA 25mg for adrenal & bone support", "Estriol vaginal cream for dryness & comfort", "Testosterone cream (low-dose) for energy & libido", "Dedicated female physician", "Comprehensive hormone panel review", "Monthly wellness check-ins", "Free discreet shipping"],
      },
    },
    "pain-recovery": {
      image: getPlanImageUrl("pain-recovery"),
      description: "Prescription-guided pain and recovery support designed around safer, non-opioid care options.",
      tiers: { "Advanced Pain Relief Protocol": ["Compounded topical cream (Diclofenac/Cyclobenzaprine/Lidocaine/Prilocaine) — 120g", "BPC-157 peptide for tissue regeneration & joint repair", "Licensed physician consultation & pain assessment", "Anti-inflammatory supplement protocol", "Monthly refills & dosage adjustments", "Physical therapy guidance plan", "Free discreet shipping"] },
    },
  };

  const fallbackImageBySlug: Record<string, string> = {
    "weight-loss": getPlanImageUrl("weight-loss"),
    "skin-hair": getPlanImageUrl("skin-hair"),
    "longevity": getPlanImageUrl("longevity"),
    "brain-cognitive": getPlanImageUrl("brain-cognitive"),
    "gut-health": getPlanImageUrl("gut-health"),
    "mental-health": getPlanImageUrl("mental-health"),
    "hot-health": getPlanImageUrl("hot-health"),
  };

  const program = details[slug || ""];
  return {
    image: program?.image || fallbackImageBySlug[slug || ""] || "https://youthandsoul.com/og-image.jpg",
    description: program?.description || "A licensed doctor consultation, prescription when clinically appropriate, and free monthly delivery are included with your plan.",
    includes: program?.tiers[tierName || ""] || [],
  };
};

const getProgramAccent = (slug?: string) => {
  const accents: Record<string, { background: string; eyebrow: string }> = {
    "weight-loss": { background: "#0f766e", eyebrow: "#99f6e4" },
    "menopause-hrt": { background: "#be123c", eyebrow: "#fecdd3" },
    "sexual-health": { background: "#1d4ed8", eyebrow: "#bfdbfe" },
    "skin-hair": { background: "#b45309", eyebrow: "#fde68a" },
    "longevity": { background: "#047857", eyebrow: "#a7f3d0" },
    "pain-recovery": { background: "#475569", eyebrow: "#cbd5e1" },
    "brain-cognitive": { background: "#3730a3", eyebrow: "#c7d2fe" },
    "gut-health": { background: "#4d7c0f", eyebrow: "#d9f99d" },
    "mental-health": { background: "#0369a1", eyebrow: "#bae6fd" },
    "hot-health": { background: "#be185d", eyebrow: "#fbcfe8" },
  };
  return accents[slug || ""] || { background: "#3d7a5f", eyebrow: "#d9efe5" };
};

const getProgramUrl = (slug?: string, firstName?: string) => {
  if (slug === "weight-loss") {
    const safeName = (firstName || "there").replace(/[^a-zA-Z0-9-]/g, "");
    return `https://youthandsoul.com/glp-weightloss/${encodeURIComponent(safeName)}`;
  }
  return `https://youthandsoul.com/programs/${slug || ""}`;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const toAbsoluteImageUrl = (image?: string | null) => {
  if (!image) return "https://youthandsoul.com/og-image.jpg";
  if (image.startsWith("http")) return image;
  return `https://youthandsoul.com${image.startsWith("/") ? image : `/${image}`}`;
};

const getResponsiveHeroImages = (slug?: string, fallbackImage?: string | null): ResponsiveEmailImage => {
  const knownPlanSlugs = new Set([
    "weight-loss",
    "menopause-hrt",
    "sexual-health",
    "skin-hair",
    "longevity",
    "pain-recovery",
    "brain-cognitive",
    "gut-health",
    "mental-health",
    "hot-health",
  ]);

  if (slug && knownPlanSlugs.has(slug)) return buildPlanImageSet(slug);

  const fallback = toAbsoluteImageUrl(fallbackImage);
  return { desktop: fallback, mobile: fallback, fallback };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = await req.json();
    const { firstName, email, phone, smsConsent, emailConsent, type, programSlug, programTitle, programDescription, programImage, tierName, tierPrice, tierIncludes } = body;
    const normalizedPhone = normalizePhoneNumber(phone);

    if (!email && !normalizedPhone) {
      return new Response(JSON.stringify({ error: "No contact info provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: { sms?: string; email?: string } = {};
    const programName = programTitle || getProgramDisplayName(programSlug);

    // ─── Welcome Link SMS (for any program) ───
    if (type === "welcome_link" && normalizedPhone) {
      const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
      if (TWILIO_API_KEY) {
        const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER") || "";
        if (!TWILIO_FROM) {
          results.sms = "skipped_no_from_number";
        } else {
          try {
            const approvalUrl = getProgramUrl(programSlug, firstName);
            const tierText = tierName ? ` (${tierName})` : "";
            const smsBody = `Y&S: Hi ${firstName || "there"}, here is your ${programName}${tierText} approval page: ${approvalUrl} - I'm always here to answer any questions. Thank you!`;

            const smsRes = await fetch(`${TWILIO_GATEWAY}/Messages.json`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "X-Connection-Api-Key": TWILIO_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ To: normalizedPhone, From: TWILIO_FROM, Body: smsBody }),
            });
            const smsData = await smsRes.json();
            results.sms = smsRes.ok ? "sent" : `error: ${JSON.stringify(smsData)}`;
          } catch (e) {
            console.error("Welcome link SMS error:", e);
            results.sms = "error";
          }
        }
      } else {
        results.sms = "skipped_no_key";
      }

      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Enrollment Welcome / Post-Purchase Confirmation Email (for any program) ───
    if ((type === "enrollment_welcome" || type === "payment_confirmation") && email) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        try {
          const planDetails = getProgramPlanDetails(programSlug, tierName);
          const includesList = ((tierIncludes?.length ? tierIncludes : planDetails.includes) || [])
            .map((item: string) => `<li>${escapeHtml(item)}</li>`)
            .join("");
          const heroImages = getResponsiveHeroImages(programSlug, planDetails.image || programImage);
          const safeFirstName = escapeHtml(firstName);
          const safeProgramName = escapeHtml(programName);
          const safeTierName = escapeHtml(tierName);
          const safeTierPrice = escapeHtml(tierPrice);
          const safeDescription = escapeHtml(programDescription || planDetails.description);
          const accent = getProgramAccent(programSlug);
          const isPaymentConfirmation = type === "payment_confirmation";
          const subject = isPaymentConfirmation
            ? `Payment received — ${programName}`
            : `Welcome to Youth & Soul — ${programName}`;

          const emailRes = await fetch(`${RESEND_GATEWAY}/emails`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": RESEND_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: EMAIL_FROM,
              to: [email],
              subject,
              html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px 20px 32px;">
                  <div style="border-radius: 18px; overflow: hidden; margin-bottom: 28px; background: ${accent.background};">
                    <picture>
                      <source media="(max-width: 600px)" srcset="${heroImages.mobile}" width="640" height="360" />
                      <source media="(min-width: 601px)" srcset="${heroImages.desktop}" width="1200" height="480" />
                      <img src="${heroImages.fallback}" srcset="${heroImages.mobile} 640w, ${heroImages.desktop} 1200w" sizes="(max-width: 600px) 100vw, 600px" alt="${safeProgramName}" width="600" height="240" style="display: block; width: 100%; max-width: 600px; height: 240px; object-fit: cover; object-position: center center;" />
                    </picture>
                    <div style="padding: 18px 20px; background: ${accent.background};">
                       <p style="color: ${accent.eyebrow}; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 6px;">${isPaymentConfirmation ? "Payment received" : "Your plan is reserved"}</p>
                      <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0;">${safeProgramName}</h2>
                    </div>
                  </div>
                  <h2 style="color: #1a1a1a; font-size: 22px; font-weight: 600;">${isPaymentConfirmation ? "Your payment is complete" : "Welcome"}${safeFirstName ? `, ${safeFirstName}` : ""}.</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    ${isPaymentConfirmation ? "Thank you for completing payment for" : "Thank you for enrolling in"} our <strong>${safeProgramName}</strong> program${safeTierName ? ` — ${safeTierName}` : ""}${safeTierPrice ? ` (${safeTierPrice})` : ""}.
                    ${isPaymentConfirmation ? "Your plan is now ready for doctor review, and your dashboard access is the next step." : "We are pleased to welcome you and look forward to supporting you throughout your care."}
                  </p>
                  ${safeDescription ? `<p style="color: #555; font-size: 15px; line-height: 1.6;">${safeDescription}</p>` : ""}
                  <div style="background: #f0f7f4; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <h3 style="color: #3d7a5f; margin: 0 0 12px;">What happens next:</h3>
                    <ul style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                      <li>Our licensed physicians will review your medical information within 24 hours</li>
                      <li>If approved, your prescription will be sent to our pharmacy partner</li>
                      <li>Your medication will be shipped directly to your door with free shipping</li>
                      <li>You'll receive ongoing support from our medical team</li>
                    </ul>
                  </div>
                  ${includesList ? `
                  <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <h3 style="color: #1a1a1a; margin: 0 0 12px; font-size: 16px;">Everything included in your plan:</h3>
                    <ul style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                      ${includesList}
                    </ul>
                  </div>
                  ` : ""}
                  <div style="background: #fff8e6; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #f1dfaa;">
                    <h3 style="color: #1a1a1a; margin: 0 0 10px; font-size: 16px;">Delivery & shipping</h3>
                    <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
                      Once your doctor approves treatment, your prescription is sent to our pharmacy partner and shipped directly to your door with free monthly delivery in discreet packaging.
                    </p>
                  </div>
                  <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    If you have any questions, reply to this email or visit <a href="https://youthandsoul.com" style="color: #3d7a5f;">youthandsoul.com</a>.
                  </p>
                  <div style="background: #eef5f2; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <h3 style="color: #3d7a5f; margin: 0 0 10px; font-size: 16px;">Your Youth & Soul dashboard</h3>
                    <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
                      After payment and signup, visit <a href="https://youthandsoul.com/dashboard" style="color: #3d7a5f; font-weight: 700;">youthandsoul.com/dashboard</a> to check your health plan, doctor review updates, prescription and care information, delivery dates, and shipping details. If you forgot your password, use the secure reset option on the sign-in page.
                    </p>
                  </div>
                  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
                  <p style="color: #999; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} Youth & Soul. All rights reserved.<br/>
                    You're receiving this because you enrolled in our ${safeProgramName} program.
                  </p>
                </div>
              `,
            }),
          });
          const emailData = await emailRes.json();
          results.email = emailRes.ok ? "sent" : `error: ${JSON.stringify(emailData)}`;
        } catch (e) {
          console.error("Email error:", e);
          results.email = "error";
        }
      } else {
        results.email = "skipped_no_key";
      }

      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Legacy: SMS consent-based enrollment notification ───
    if (smsConsent && normalizedPhone) {
      const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
      if (TWILIO_API_KEY) {
        try {
          const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER") || "";
          if (!TWILIO_FROM) {
            results.sms = "skipped_no_from_number";
          } else {
            const smsRes = await fetch(`${TWILIO_GATEWAY}/Messages.json`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "X-Connection-Api-Key": TWILIO_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: normalizedPhone,
                From: TWILIO_FROM,
                Body: `Youth & Soul: Hello ${firstName || "there"}, thank you for enrolling in our ${programName} program. Our medical team will review your information within 24 hours. For questions, reply to this message or visit youthandsoul.com. Reply STOP to opt out.`,
              }),
            });
            const smsData = await smsRes.json();
            results.sms = smsRes.ok ? "sent" : `error: ${JSON.stringify(smsData)}`;
          }
        } catch (e) {
          console.error("SMS error:", e);
          results.sms = "error";
        }
      } else {
        results.sms = "skipped_no_key";
      }
    }

    // ─── Legacy: Email consent-based enrollment notification ───
    if (emailConsent && email) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        try {
          const emailRes = await fetch(`${RESEND_GATEWAY}/emails`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": RESEND_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: EMAIL_FROM,
              to: [email],
              subject: `Welcome to Youth & Soul — ${programName}`,
              html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px 20px 32px;">
                  <div style="border-radius: 18px; overflow: hidden; margin-bottom: 28px; background: ${getProgramAccent(programSlug).background};">
                    <img src="${getResponsiveHeroImages(programSlug).fallback}" alt="${escapeHtml(programName)}" width="600" height="240" style="display: block; width: 100%; max-width: 600px; height: 240px; object-fit: cover; object-position: center center;" />
                  </div>
                  <h2 style="color: #1a1a1a; font-size: 22px; font-weight: 600;">Welcome${firstName ? `, ${firstName}` : ""}.</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Thank you for enrolling in our ${programName} program. We are pleased to welcome you and look forward to supporting you throughout your care.
                  </p>
                  <div style="background: #f0f7f4; border-radius: 12px; padding: 20px; margin: 24px 0;">
                    <h3 style="color: #3d7a5f; margin: 0 0 12px;">What happens next:</h3>
                    <ul style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                      <li>Our licensed physicians will review your medical information within 24 hours</li>
                      <li>If approved, your prescription will be sent to our pharmacy partner</li>
                      <li>Your medication will be shipped directly to your door with free shipping</li>
                      <li>You'll receive ongoing support from our medical team</li>
                    </ul>
                  </div>
                  <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    If you have any questions, reply to this email or visit <a href="https://youthandsoul.com" style="color: #3d7a5f;">youthandsoul.com</a>.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
                  <p style="color: #999; font-size: 12px; text-align: center;">
                    © ${new Date().getFullYear()} Youth & Soul. All rights reserved.<br/>
                    You're receiving this because you enrolled in our ${programName} program.
                  </p>
                </div>
              `,
            }),
          });
          const emailData = await emailRes.json();
          results.email = emailRes.ok ? "sent" : `error: ${JSON.stringify(emailData)}`;
        } catch (e) {
          console.error("Email error:", e);
          results.email = "error";
        }
      } else {
        results.email = "skipped_no_key";
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
