
-- Hub pages (main topic pages like "Weight Loss & Metabolic Reset")
CREATE TABLE public.seo_hub_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  meta_description text,
  hero_title text NOT NULL,
  hero_subtitle text,
  content text NOT NULL,
  category text NOT NULL,
  keywords text[] DEFAULT '{}',
  related_products_category text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Spoke pages (supporting Q&A and article pages)
CREATE TABLE public.seo_spoke_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES public.seo_hub_pages(id) ON DELETE CASCADE NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  meta_description text,
  content text NOT NULL,
  page_type text NOT NULL DEFAULT 'qa',
  question text,
  keywords text[] DEFAULT '{}',
  sources text[] DEFAULT '{}',
  stats jsonb DEFAULT '[]',
  is_published boolean DEFAULT false,
  is_ai_generated boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Generation queue for scheduled auto-creation
CREATE TABLE public.seo_generation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES public.seo_hub_pages(id) ON DELETE CASCADE NOT NULL,
  topic text NOT NULL,
  question text,
  status text NOT NULL DEFAULT 'pending',
  result_spoke_id uuid REFERENCES public.seo_spoke_pages(id),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE public.seo_hub_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_spoke_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_generation_queue ENABLE ROW LEVEL SECURITY;

-- Public can view published pages
CREATE POLICY "Anyone can view published hubs" ON public.seo_hub_pages FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Anyone can view published spokes" ON public.seo_spoke_pages FOR SELECT TO public USING (is_published = true);

-- Authenticated can manage
CREATE POLICY "Auth can manage hubs" ON public.seo_hub_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage spokes" ON public.seo_spoke_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can manage queue" ON public.seo_generation_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role manages hubs" ON public.seo_hub_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages spokes" ON public.seo_spoke_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages queue" ON public.seo_generation_queue FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_seo_hub_pages_updated_at BEFORE UPDATE ON public.seo_hub_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_spoke_pages_updated_at BEFORE UPDATE ON public.seo_spoke_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
