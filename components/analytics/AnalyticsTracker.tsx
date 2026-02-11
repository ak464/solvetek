"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";

const SESSION_KEY = "site_session_id";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        // 1. Initialize Session
        let currentSession = localStorage.getItem(SESSION_KEY);
        if (!currentSession) {
            currentSession = uuidv4();
            localStorage.setItem(SESSION_KEY, currentSession);
        }
        setSessionId(currentSession);

        // 2. Track Visit immediately
        trackVisit(currentSession, pathname);

        // 3. Setup Heartbeat (every 2 minutes) to keep session alive
        const interval = setInterval(() => {
            trackVisit(currentSession!, pathname);
        }, 120000); // 2 mins

        return () => clearInterval(interval);
    }, [pathname]);

    const trackVisit = async (id: string, path: string) => {
        try {
            // We will create a server action for this to keep secrets safe
            // For now, we call a new API route or RPC
            // Using direct fetch to a Next.js API route is better for analytics
            await fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: id,
                    path: path,
                    timestamp: new Date().toISOString()
                }),
            });
        } catch (e) {
            // Silently fail to not disrupt user experience
            console.error("Analytics Error", e);
        }
    };

    return null; // Renderless component
}
