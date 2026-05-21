-- Create recently_viewed table to track product clicks per user
CREATE TABLE public.recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT NOT NULL,
  product_image TEXT,
  product_price NUMERIC NOT NULL,
  product_original_price NUMERIC,
  product_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_recently_viewed_user_viewed ON public.recently_viewed(user_id, viewed_at DESC);

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recently viewed"
ON public.recently_viewed FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed"
ON public.recently_viewed FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed"
ON public.recently_viewed FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recently viewed"
ON public.recently_viewed FOR DELETE
USING (auth.uid() = user_id);