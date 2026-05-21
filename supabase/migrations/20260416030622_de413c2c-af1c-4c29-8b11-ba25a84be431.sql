CREATE POLICY "Allow public enrollment inserts"
ON public.enrollments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);