"use client";

import { useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";

export function PresenceTracker() {
    const supabase = createClient();

    useEffect(() => {
        const updatePresence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('profiles')
                .update({ last_seen: new Date().toISOString() })
                .eq('id', user.id);
        };

        // Update immediately on mount
        updatePresence();

        // Then update every 60 seconds
        const interval = setInterval(updatePresence, 60000);

        return () => clearInterval(interval);
    }, []);

    return null; // This component doesn't render anything
}
