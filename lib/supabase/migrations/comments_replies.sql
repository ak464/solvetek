-- Add parent_id to comments table for nesting
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON public.comments(parent_id);
