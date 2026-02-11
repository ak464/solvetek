"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewTracker({ articleId }: { articleId: number }) {
    useEffect(() => {
        const trackView = async () => {
            const supabase = createClient();
            // Call the RPC function to log view and increment count
            const { error } = await supabase.rpc('increment_article_view', {
                target_article_id: articleId
            });
            if (error) console.error("Error tracking view:", error);
        };

        const timer = setTimeout(trackView, 3000); // Track after 3 seconds of focused reading
        return () => clearTimeout(timer);
    }, [articleId]);

    return null;
}
