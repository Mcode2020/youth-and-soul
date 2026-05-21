
ALTER TABLE public.seo_hub_pages
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS h1_title text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS external_links jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS internal_links jsonb DEFAULT '[]';

ALTER TABLE public.seo_spoke_pages
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS h1_title text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS external_links jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS internal_links jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS target_keyword text;
