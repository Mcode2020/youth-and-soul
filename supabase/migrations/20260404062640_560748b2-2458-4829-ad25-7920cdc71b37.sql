
-- Program results table (before/after transformations)
CREATE TABLE public.program_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  stat TEXT NOT NULL,
  stat_label TEXT NOT NULL,
  duration TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  quote TEXT NOT NULL,
  tier TEXT,
  image_url TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Program doctors table
CREATE TABLE public.program_doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'MD',
  specialty TEXT,
  photo_url TEXT,
  testimonial TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.program_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_doctors ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active results" ON public.program_results FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active doctors" ON public.program_doctors FOR SELECT USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role manages results" ON public.program_results FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages doctors" ON public.program_doctors FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('program-results', 'program-results', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('program-doctors', 'program-doctors', true);

-- Storage policies - public read
CREATE POLICY "Public read results images" ON storage.objects FOR SELECT USING (bucket_id = 'program-results');
CREATE POLICY "Public read doctor images" ON storage.objects FOR SELECT USING (bucket_id = 'program-doctors');

-- Authenticated upload
CREATE POLICY "Auth upload results images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'program-results');
CREATE POLICY "Auth upload doctor images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'program-doctors');
CREATE POLICY "Auth update results images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'program-results');
CREATE POLICY "Auth update doctor images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'program-doctors');
CREATE POLICY "Auth delete results images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'program-results');
CREATE POLICY "Auth delete doctor images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'program-doctors');
