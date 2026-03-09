-- Add new columns for Article Enhancements
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS excerpt text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text;
