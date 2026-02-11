"use client";

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Track user activity and update last_seen timestamp
 * This component should be added to the root layout
 */
export function UserActivityTracker() {
    useEffect(() => {
        const supabase = createClient();

        const updateLastSeen = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase
                    .from('profiles')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('id', user.id);
            }
        };

        // Update immediately
        updateLastSeen();

        // Update every 60 seconds
        const interval = setInterval(updateLastSeen, 60 * 1000);

        // Update on visibility change (when user comes back to tab)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                updateLastSeen();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null; // This component doesn't render anything
}
