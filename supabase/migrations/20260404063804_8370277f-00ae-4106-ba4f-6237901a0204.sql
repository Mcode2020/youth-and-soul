
-- Allow authenticated users to insert, update, and delete program_results
CREATE POLICY "Authenticated users can insert results"
ON public.program_results FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update results"
ON public.program_results FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete results"
ON public.program_results FOR DELETE TO authenticated
USING (true);

-- Allow authenticated users to insert, update, and delete program_doctors
CREATE POLICY "Authenticated users can insert doctors"
ON public.program_doctors FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update doctors"
ON public.program_doctors FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete doctors"
ON public.program_doctors FOR DELETE TO authenticated
USING (true);

-- Storage policies for program-results bucket
CREATE POLICY "Authenticated users can upload result images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'program-results');

CREATE POLICY "Authenticated users can update result images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'program-results');

CREATE POLICY "Anyone can view result images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'program-results');

-- Storage policies for program-doctors bucket
CREATE POLICY "Authenticated users can upload doctor photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'program-doctors');

CREATE POLICY "Authenticated users can update doctor photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'program-doctors');

CREATE POLICY "Anyone can view doctor photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'program-doctors');
