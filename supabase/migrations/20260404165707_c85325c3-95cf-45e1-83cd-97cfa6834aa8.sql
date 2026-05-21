
-- Table for YouTube video testimonials per program
CREATE TABLE public.program_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  youtube_embed_url TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.program_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active program videos" ON public.program_videos FOR SELECT USING (is_active = true);

-- Table for influencer post templates (Instagram images, etc.)
CREATE TABLE public.influencer_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL DEFAULT 'instagram',
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  post_type TEXT DEFAULT 'feed',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.influencer_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active influencer posts" ON public.influencer_posts FOR SELECT USING (is_active = true);
