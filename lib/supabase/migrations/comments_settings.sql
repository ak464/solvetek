-- Add comments_require_approval setting if it doesn't exist
INSERT INTO public.site_settings (key, value)
VALUES ('comments_require_approval', 'false')
ON CONFLICT (key) DO NOTHING;
