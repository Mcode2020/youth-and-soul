import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { program, tier, tierName, price, patient, userId } = body;

    // Validate required fields
    if (!patient?.firstName || !patient?.lastName || !patient?.email || !patient?.dob) {
      return new Response(
        JSON.stringify({ error: "Missing required patient fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for MDI API key
    const mdiApiKey = Deno.env.get("MDI_API_KEY");

    let mdiResponse = null;

    if (mdiApiKey) {
      // Forward to MDIntegrations API
      const mdiPayload = {
        first_name: patient.firstName,
        last_name: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        date_of_birth: patient.dob,
        gender: patient.gender,
        address: {
          street: patient.address,
          city: patient.city,
          state: patient.state,
          zip: patient.zip,
        },
        medical_history: {
          allergies: patient.allergies || "None reported",
          current_medications: patient.currentMeds || "None reported",
          medical_conditions: patient.medicalConditions || "None reported",
          previous_treatments: patient.previousTreatments || "None reported",
        },
        program_selection: {
          program,
          tier,
          tier_name: tierName,
          monthly_price: price,
        },
      };

      try {
        const response = await fetch("https://api.mdintegrations.com/v1/patients", {
          method: "POST",
          headers: {
            "Authorization": `Token ${mdiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mdiPayload),
        });

        mdiResponse = await response.json();

        if (!response.ok) {
          console.error("MDI API error:", mdiResponse);
        }
      } catch (mdiErr) {
        console.error("MDI API call failed:", mdiErr);
      }
    } else {
      console.log("MDI_API_KEY not configured — enrollment stored locally only");
    }

    // Store enrollment in Supabase regardless
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("enrollments").insert({
      program_slug: program,
      tier_label: tier,
      tier_name: tierName,
      monthly_price: price,
      first_name: patient.firstName,
      last_name: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.dob,
      gender: patient.gender,
      address: patient.address,
      city: patient.city,
      state: patient.state,
      zip: patient.zip,
      allergies: patient.allergies,
      current_medications: patient.currentMeds,
      medical_conditions: patient.medicalConditions,
      previous_treatments: patient.previousTreatments,
      mdi_response: mdiResponse,
      status: mdiResponse ? "submitted_to_mdi" : "pending_mdi_setup",
      user_id: userId || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Enrollment submitted successfully",
        mdi_connected: !!mdiApiKey,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Enrollment error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to process enrollment" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
