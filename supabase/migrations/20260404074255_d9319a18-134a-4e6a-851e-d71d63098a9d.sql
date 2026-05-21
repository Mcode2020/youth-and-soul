CREATE TABLE public.brand_discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL UNIQUE,
  discount_code text NOT NULL,
  discount_percent integer NOT NULL DEFAULT 20,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active brand discounts" ON public.brand_discounts FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Authenticated users can insert brand discounts" ON public.brand_discounts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update brand discounts" ON public.brand_discounts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete brand discounts" ON public.brand_discounts FOR DELETE TO authenticated USING (true);