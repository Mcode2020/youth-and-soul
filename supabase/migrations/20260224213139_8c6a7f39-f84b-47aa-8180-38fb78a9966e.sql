
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.seller_products(id) ON DELETE CASCADE,
  user_id UUID,
  author_name TEXT NOT NULL,
  age INTEGER,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  time_to_result TEXT,
  would_repurchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
