-- Create a function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_view(target_article_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Ensures the function runs with the privileges of the creator
AS $$
BEGIN
  UPDATE public.articles
  SET views_count = views_count + 1
  WHERE id = target_article_id;
END;
$$;

-- Grant access to the function to public (anon and authenticated)
GRANT EXECUTE ON FUNCTION public.increment_article_view(bigint) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_article_view(bigint) TO authenticated;
