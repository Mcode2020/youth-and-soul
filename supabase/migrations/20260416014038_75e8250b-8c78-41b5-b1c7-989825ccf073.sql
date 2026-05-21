ALTER TABLE public.enrollments ADD COLUMN sms_consent boolean DEFAULT false;
ALTER TABLE public.enrollments ADD COLUMN email_consent boolean DEFAULT false;