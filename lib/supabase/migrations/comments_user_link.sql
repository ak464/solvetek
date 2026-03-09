-- FIX: Drop user_id if it exists to reset the relationship correctly
ALTER TABLE public.comments DROP COLUMN IF EXISTS user_id CASCADE;

-- Re-add user_id linking to public.profiles (Critical for the 'profile' fetch query to work)
ALTER TABLE public.comments 
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);

-- Update RLS
CREATE POLICY "Allow users to delete own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = user_id);
