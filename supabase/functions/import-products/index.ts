import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "preview"; // "preview" | "import"

    // External (source) Supabase - hardcoded since we know the project
    const externalUrl = "https://xmnaetfnzbtywdddjian.supabase.co";
    const externalKey = Deno.env.get("EXTERNAL_SUPABASE_SERVICE_ROLE_KEY");
    if (!externalKey) {
      throw new Error("EXTERNAL_SUPABASE_SERVICE_ROLE_KEY not configured");
    }

    console.log("Creating external client with URL:", externalUrl);

    // Local (destination) Supabase
    const localUrl = Deno.env.get("SUPABASE_URL") || `https://pjqqbfemspdugzssvquy.supabase.co`;
    const localKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!localKey) {
      throw new Error("Local Supabase credentials not configured. SUPABASE_URL=" + localUrl);
    }

    const externalClient = createClient(externalUrl, externalKey);
    const localClient = createClient(localUrl, localKey);

    // Step 1: Fetch a sample from "longevity" to see columns
    const { data: sample, error: sampleError } = await externalClient
      .from("longevity")
      .select("*")
      .limit(3);

    if (sampleError) {
      return new Response(JSON.stringify({
        error: "Failed to query external 'longevity' table",
        details: sampleError.message,
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const columns = sample && sample.length > 0 ? Object.keys(sample[0]) : [];

    if (mode === "preview") {
      return new Response(JSON.stringify({
        message: "Preview of external 'longevity' table",
        columns,
        sampleRows: sample,
        totalSampleCount: sample?.length || 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mode: import — fetch ALL rows from longevity table
    let allData: any[] = [];
    let offset = 0;
    const pageSize = 500;

    while (true) {
      const { data, error } = await externalClient
        .from("longevity")
        .select("*")
        .range(offset, offset + pageSize - 1);

      if (error || !data || data.length === 0) break;
      allData = allData.concat(data);
      offset += pageSize;
      if (data.length < pageSize) break;
    }

    console.log(`Fetched ${allData.length} products from external 'longevity' table`);

    // Step 2: Delete existing system-seeded products
    const { error: deleteError } = await localClient
      .from("seller_products")
      .delete()
      .eq("seller_id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
      console.error("Delete error:", deleteError.message);
    } else {
      console.log("Cleared existing system-seeded products");
    }

    // Step 3: Filter out excluded brands and map external fields to our local schema
    const excludedBrands = ["nourishingapothecary"];
    const filteredData = allData.filter((item: any) => {
      const brand = (item.partner_ref || "").trim().toLowerCase();
      return !excludedBrands.includes(brand);
    });

    console.log(`Filtered to ${filteredData.length} products after excluding brands: ${excludedBrands.join(", ")}`);

    const mappedProducts = filteredData.map((item: any) => ({
      product_name: (item.product_name || "Unknown Product").trim(),
      brand: (item.partner_ref || "Unknown Brand").trim(),
      category: (item.category || "General").trim(),
      description: item.description ? item.description.trim() : null,
      price: item.discount_price || item.price || 0,
      original_price: item.discount_price && item.price > item.discount_price ? item.price : null,
      product_url: item.product_url ? item.product_url.trim() : null,
      images: item.images || [],
      goals: [],
      key_ingredients: null,
      benefits: null,
      usage_instructions: null,
      status: "approved",
      seller_id: "00000000-0000-0000-0000-000000000000",
    }));

    // Step 4: Insert in batches of 50
    let inserted = 0;
    let errors: string[] = [];
    for (let i = 0; i < mappedProducts.length; i += 50) {
      const batch = mappedProducts.slice(i, i + 50);
      const { error: insertError } = await localClient
        .from("seller_products")
        .insert(batch);

      if (!insertError) {
        inserted += batch.length;
      } else {
        errors.push(`Batch ${i / 50 + 1}: ${insertError.message}`);
        console.error(`Insert error batch ${i / 50 + 1}:`, insertError.message);
      }
    }

    return new Response(JSON.stringify({
      message: "Import completed",
      totalFetched: allData.length,
      totalInserted: inserted,
      columns,
      sampleMapped: mappedProducts.slice(0, 2),
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Import error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
