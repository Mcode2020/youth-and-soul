
CREATE TABLE public.site_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5,
  source TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reviews"
ON public.site_reviews
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage reviews"
ON public.site_reviews
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_site_reviews_updated_at
BEFORE UPDATE ON public.site_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
