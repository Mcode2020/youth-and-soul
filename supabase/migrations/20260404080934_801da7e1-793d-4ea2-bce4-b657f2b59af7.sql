
CREATE TABLE public.seo_authority_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  priority integer NOT NULL DEFAULT 50,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_authority_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active sources" ON public.seo_authority_sources FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Auth can manage sources" ON public.seo_authority_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages sources" ON public.seo_authority_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
