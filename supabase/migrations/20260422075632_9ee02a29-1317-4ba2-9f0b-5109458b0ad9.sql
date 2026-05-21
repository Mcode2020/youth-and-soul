ALTER TABLE public.enrollments
ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_email_lower ON public.enrollments(lower(email));

DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR lower(email) = lower((auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS "Users can update own enrollment link" ON public.enrollments;
CREATE POLICY "Users can update own enrollment link"
ON public.enrollments
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR lower(email) = lower((auth.jwt() ->> 'email'))
)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.link_enrollments_to_user(_user_id uuid, _email text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.enrollments
  SET user_id = _user_id
  WHERE user_id IS NULL
    AND lower(email) = lower(_email);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  PERFORM public.link_enrollments_to_user(new.id, new.email);
  RETURN new;
END;
$$;