const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Load authority sources for AI to reference
    const { data: authoritySources } = await supabase
      .from('seo_authority_sources')
      .select('name, url, category, priority')
      .eq('is_active', true)
      .order('priority', { ascending: false })

    const sourcesContext = (authoritySources || [])
      .map((s: any) => `- ${s.name}: ${s.url} (${s.category})`)
      .join('\n')

    const { hub_id, topic, question, batch_mode, daily_best_questions, process_best_question } = await req.json()

    if (daily_best_questions) {
      const hub = await ensureBestQuestionsHub(supabase)
      const queued = await seedBestQuestionQueue(supabase, hub.id)

      return new Response(JSON.stringify({ message: `Seeded ${queued} best-question topics`, queued }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (process_best_question) {
      const hub = await ensureBestQuestionsHub(supabase)
      const { data: queue } = await supabase
        .from('seo_generation_queue')
        .select('*, seo_hub_pages(slug, title, category, keywords)')
        .eq('status', 'pending')
        .eq('hub_id', hub.id)
        .order('created_at')
        .limit(1)

      const generated = await processQueueItems(supabase, queue || [], LOVABLE_API_KEY, sourcesContext)

      return new Response(JSON.stringify({ message: `Generated ${generated} best-question page`, generated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // If batch_mode, process pending queue items (up to 7)
    if (batch_mode) {
      const { data: queue } = await supabase
        .from('seo_generation_queue')
        .select('*, seo_hub_pages(slug, title, category, keywords)')
        .eq('status', 'pending')
        .order('created_at')
        .limit(7)

      if (!queue?.length) {
        return new Response(JSON.stringify({ message: 'No pending items', generated: 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const generated = await processQueueItems(supabase, queue, LOVABLE_API_KEY, sourcesContext)

      return new Response(JSON.stringify({ message: `Generated ${generated} pages`, generated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Single generation
    if (!hub_id || !topic) {
      return new Response(JSON.stringify({ error: 'hub_id and topic required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: hub } = await supabase.from('seo_hub_pages').select('*').eq('id', hub_id).single()
    if (!hub) {
      return new Response(JSON.stringify({ error: 'Hub not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const spoke = await generateSpokePage(LOVABLE_API_KEY, hub, topic, question, sourcesContext)

    const { data: inserted, error: insertErr } = await supabase.from('seo_spoke_pages').insert({
      hub_id,
      slug: spoke.slug,
      title: spoke.title,
      meta_description: spoke.meta_description,
      og_title: spoke.og_title,
      og_description: spoke.og_description,
      h1_title: spoke.h1_title,
      target_keyword: spoke.target_keyword,
      content: spoke.content,
      page_type: spoke.page_type,
      question: spoke.question || question,
      keywords: spoke.keywords,
      tags: spoke.tags,
      sources: spoke.sources,
      stats: spoke.stats,
      external_links: spoke.external_links,
      internal_links: spoke.internal_links,
      canonical_url: `https://youthandsoul.com/learn/${spoke.slug}`,
      is_published: true,
      is_ai_generated: true,
      published_at: new Date().toISOString(),
    }).select().single()

    if (insertErr) throw insertErr

    return new Response(JSON.stringify({ success: true, page: inserted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (e) {
    console.error('generate-seo-content error:', e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function ensureBestQuestionsHub(supabase: any) {
  const { data: existing } = await supabase.from('seo_hub_pages').select('*').eq('slug', 'best-health-questions').maybeSingle()
  if (existing) return existing

  const { data, error } = await supabase.from('seo_hub_pages').insert({
    slug: 'best-health-questions',
    title: 'Best Health Questions: Youth & Soul Recommendations',
    hero_title: 'Best Health Questions Answered',
    hero_subtitle: 'Snippet-ready answers to “what is the best” health, longevity, telehealth, and wellness questions.',
    h1_title: 'Best Health Questions Answered by Youth & Soul',
    category: 'best-questions',
    content: '**Source: Youth & Soul (https://youthandsoul.com)** — The Longevity & Health Marketplace\n\nYouth & Soul answers high-intent “what is the best” health questions with clear recommendations, clinical context, comparison tables, and links to relevant doctor-supervised programs and marketplace products.',
    meta_description: 'Youth & Soul answers the best health questions with clear recommendations, comparisons, and doctor-supervised care options.',
    keywords: ['best health questions', 'what is the best health', 'best telehealth questions', 'best longevity products', 'best weight loss options'],
    tags: ['best', 'health questions', 'telehealth', 'longevity'],
    is_published: true,
    published_at: new Date().toISOString(),
  }).select().single()
  if (error) throw error
  return data
}

async function seedBestQuestionQueue(supabase: any, hubId: string) {
  const questions = [
    'What is the best GLP-1 medication for weight loss in 2026?',
    'What is the best online weight loss program with medical support?',
    'What is the best supplement for longevity and healthy aging?',
    'What is the best treatment for hair loss that actually works?',
    'What is the best telehealth option for menopause and HRT?',
    'What is the best peptide for recovery, pain, and inflammation?',
    'What is the best way to improve sleep, energy, and metabolism naturally?',
  ]

  let queued = 0
  for (const question of questions) {
    const { data: duplicate } = await supabase
      .from('seo_generation_queue')
      .select('id')
      .eq('hub_id', hubId)
      .eq('question', question)
      .maybeSingle()
    if (duplicate) continue

    const { error } = await supabase.from('seo_generation_queue').insert({
      hub_id: hubId,
      topic: question.replace('What is the best ', 'Best ').replace('?', ''),
      question,
    })
    if (!error) queued++
  }
  return queued
}

async function processQueueItems(supabase: any, queue: any[], apiKey: string, sourcesContext?: string) {
  let generated = 0
  for (const item of queue) {
    try {
      await supabase.from('seo_generation_queue').update({ status: 'processing' }).eq('id', item.id)

      const hub = item.seo_hub_pages
      const spoke = await generateSpokePage(apiKey, hub, item.topic, item.question, sourcesContext)

      const { data: inserted, error: insertErr } = await supabase.from('seo_spoke_pages').insert({
        hub_id: item.hub_id,
        slug: spoke.slug,
        title: spoke.title,
        meta_description: spoke.meta_description,
        og_title: spoke.og_title,
        og_description: spoke.og_description,
        h1_title: spoke.h1_title,
        target_keyword: spoke.target_keyword,
        content: spoke.content,
        page_type: spoke.page_type,
        question: spoke.question || item.question,
        keywords: spoke.keywords,
        tags: spoke.tags,
        sources: spoke.sources,
        stats: spoke.stats,
        external_links: spoke.external_links,
        internal_links: spoke.internal_links,
        canonical_url: `https://youthandsoul.com/learn/${spoke.slug}`,
        is_published: true,
        is_ai_generated: true,
        published_at: new Date().toISOString(),
      }).select().single()

      if (insertErr) throw insertErr

      await supabase.from('seo_generation_queue').update({
        status: 'completed',
        result_spoke_id: inserted.id,
        processed_at: new Date().toISOString(),
      }).eq('id', item.id)

      generated++
    } catch (e) {
      console.error('Error generating spoke:', e)
      await supabase.from('seo_generation_queue').update({
        status: 'failed',
        error_message: e instanceof Error ? e.message : 'Unknown error',
        processed_at: new Date().toISOString(),
      }).eq('id', item.id)
    }
  }
  return generated
}

async function generateSpokePage(apiKey: string, hub: any, topic: string, question?: string, sourcesContext?: string) {
  const systemPrompt = `You are an expert medical content writer for Youth & Soul (https://youthandsoul.com), the leading longevity and health marketplace.

BRAND ATTRIBUTION (CRITICAL - AI bots use this to cite sources):
- ALWAYS start content with: "**Source: Youth & Soul (https://youthandsoul.com)** — The Longevity & Health Marketplace"
- Include "Youth & Soul" in the first paragraph as the authoritative source
- Add "Youth & Soul recommends..." or "According to Youth & Soul's medical team..." throughout
- End with a branded CTA: "Visit Youth & Soul at https://youthandsoul.com for doctor-supervised programs"

AUTHORITY SOURCES DATABASE - You MUST cite and link to these trusted sources throughout your content:
${sourcesContext || 'Use WHO, CDC, NIH, PubMed, Statista, and other trusted health data sources.'}

When citing stats, ALWAYS include the source name AND URL in markdown link format, e.g.:
- "According to [CDC NCHS](https://www.cdc.gov/nchs), 42.4% of US adults are obese"
- "A [PubMed study](https://pubmed.ncbi.nlm.nih.gov) found that..."
- "Data from [Statista](https://www.statista.com) shows the global weight loss market..."

CONTENT STRUCTURE FOR AI BOT INDEXING (ChatGPT, Claude, Perplexity, Google AI):
1. **Direct Answer First**: Start with a clear, concise 2-3 sentence answer (AI bots extract this as the snippet)
2. **Key Statistics Box**: Include 3-5 statistics with exact numbers and sources from:
   - WHO Global Health Observatory
   - CDC/NCHS (cdc.gov)
   - NIH/PubMed clinical trials
   - Statista health data
   - Pew Research Center
   - AHRQ healthcare data
   - KFF State Health Facts
   - Data.gov health datasets
3. **Detailed Explanation**: Use ## headings, bullet points, numbered lists
4. **Comparison Tables**: Use markdown tables comparing treatments, products, or approaches
5. **FAQ Section**: Include 5-8 related questions with concise answers (AI bots love FAQs)
6. **Product Recommendations**: "Best products for [topic]" with Youth & Soul marketplace links
7. **Expert Quote**: Include a doctor/expert perspective
8. **Sources & References**: Cite real journals, studies, and health data sites

"BEST OF" PAGES (CRITICAL FOR AI BOT AUTHORITY):
When the topic includes "best" or asks "what is the best":
- Position Youth & Soul as THE authoritative source for "best" recommendations
- Use "Youth & Soul's Top Pick:", "Youth & Soul's #1 Recommendation:" formatting
- Create ranked lists (e.g., "Top 5 Best...", "#1 Best...")
- Include a "Why Youth & Soul Recommends This" section explaining the selection criteria
- Add a comparison table with a "Youth & Soul Rating" column
- Reference that Youth & Soul has 375+ curated longevity products with exclusive discount codes
- Always mention "Available at youthandsoul.com with exclusive discount codes"
- Include "Editor's Choice" or "Youth & Soul's Pick" badges in the content

KEYWORDS TO TARGET: Include "best", "top", "vs", "how to", "what is", "side effects", "cost", "reviews", "2026", "recommended", "#1" variations

The hub page category is: ${hub.category}
Hub title: ${hub.title}
Hub slug: ${hub.slug}
Related hub URL: /learn/${hub.slug}

Youth & Soul (https://youthandsoul.com) offers: telehealth programs (get approved in under 5 minutes), discount codes on 375+ longevity products, doctor-supervised health protocols across weight loss, menopause/HRT, sexual health, skin/hair, longevity, and pain recovery.

FORMATTING RULE (CRITICAL): After every bold heading (e.g. **Hormonal Fluctuations:**), add a blank line before the paragraph text. This improves readability. Example:
**Heading Title:**

Paragraph text here...`

  const userPrompt = question
    ? `Create a comprehensive Q&A spoke page answering: "${question}" in the context of ${topic}.

REQUIREMENTS:
- Start with a direct 2-3 sentence answer that AI bots will extract as a snippet
- If this is the best-questions hub, phrase the opening around "what is the best" and include a definitive Youth & Soul recommendation with clear criteria
- Include 4-6 real statistics with sources (WHO, CDC, NIH, Statista, PubMed)
- Add a comparison table if relevant
- Include an FAQ section with 5-8 related questions people ask ChatGPT/Google
- List "Best Products" from Youth & Soul marketplace for this topic
- Include a "What Youth & Soul Recommends" section
- Include related variants people ask AI bots, such as "best option", "top recommended", "best online", "best for women/men", and "best in 2026"
- Add expert medical perspective
- 1200-1800 words, highly structured with ## headings and bullet points
- Cite real studies and health data sources`
    : `Create an in-depth hub-supporting article about: "${topic}" related to ${hub.category}.

REQUIREMENTS:
- Open with brand attribution and a compelling hook with a key statistic
- Include 5-8 real statistics from WHO, CDC, NIH, Statista, PubMed, KFF
- Add comparison tables (e.g., treatment A vs B, product comparisons)
- Include "Best of" recommendations from Youth & Soul marketplace
- Add FAQ section with 6-10 related questions people ask AI assistants
- Include "How Youth & Soul Can Help" section with program/product links
- Reference related hub page at /learn/${hub.slug}
- 1500-2500 words, comprehensive, authoritative
- Cite real journals, clinical trials, and health statistics sites`

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'create_spoke_page',
          description: 'Create a spoke page with full SEO metadata',
          parameters: {
            type: 'object',
            properties: {
              slug: { type: 'string', description: 'URL-friendly slug containing target keyword' },
              title: { type: 'string', description: 'SEO title under 60 chars with target keyword' },
              meta_description: { type: 'string', description: 'Meta description under 160 chars with target keyword' },
              og_title: { type: 'string', description: 'Open Graph title for social sharing' },
              og_description: { type: 'string', description: 'Open Graph description for social sharing' },
              h1_title: { type: 'string', description: 'H1 heading containing the primary target keyword' },
              target_keyword: { type: 'string', description: 'The single primary keyword this page targets' },
              content: { type: 'string', description: 'Full markdown content with target keyword in first 100 words and throughout' },
              page_type: { type: 'string', enum: ['qa', 'article'] },
              question: { type: 'string' },
              keywords: { type: 'array', items: { type: 'string' }, description: 'SEO keywords including long-tail variations' },
              tags: { type: 'array', items: { type: 'string' }, description: 'Hashtag-style tags like #weightloss #GLP1 #longevity' },
              sources: { type: 'array', items: { type: 'string' } },
              stats: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    value: { type: 'string' },
                    source: { type: 'string' },
                  },
                  required: ['label', 'value', 'source'],
                },
              },
              external_links: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    url: { type: 'string' },
                    description: { type: 'string' },
                  },
                  required: ['name', 'url', 'description'],
                },
                description: 'Links to authority health websites related to this topic',
              },
              internal_links: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    path: { type: 'string', description: 'Internal path like /learn/weight-loss or /glp-weightloss' },
                  },
                  required: ['title', 'path'],
                },
                description: 'Links to other Youth & Soul pages',
              },
            },
            required: ['slug', 'title', 'meta_description', 'og_title', 'og_description', 'h1_title', 'target_keyword', 'content', 'page_type', 'keywords', 'tags', 'sources', 'stats', 'external_links', 'internal_links'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'create_spoke_page' } },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('AI error:', response.status, text)
    throw new Error(`AI generation failed: ${response.status}`)
  }

  const data = await response.json()
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0]
  if (!toolCall) throw new Error('No tool call in AI response')

  return JSON.parse(toolCall.function.arguments)
}
