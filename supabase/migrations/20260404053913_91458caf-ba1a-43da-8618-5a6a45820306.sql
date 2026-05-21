
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  program_slug TEXT NOT NULL,
  tier_label TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  monthly_price NUMERIC NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth TEXT,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  allergies TEXT,
  current_medications TEXT,
  medical_conditions TEXT,
  previous_treatments TEXT,
  mdi_response JSONB,
  status TEXT NOT NULL DEFAULT 'pending_mdi_setup'
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage enrollments"
  ON public.enrollments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can insert enrollments"
  ON public.enrollments
  FOR INSERT
  TO anon
  WITH CHECK (true);
