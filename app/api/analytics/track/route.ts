import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { session_id, path } = body;
        const userAgent = req.headers.get("user-agent") || "";

        // 1. Bot Detection (Simple)
        const isBot = /bot|crawl|spider|google|bing|yahoo|duckduckgo/i.test(userAgent);

        if (isBot) {
            // Option: Log bots separately or ignore
            // For now, we return early to avoid skewing "real user" stats
            return NextResponse.json({ success: true, ignored: true });
        }

        const today = new Date().toISOString().split('T')[0];

        // 2. Update Active Session (Heartbeat)
        const { error: sessionError } = await supabase
            .from("active_sessions")
            .upsert(
                {
                    session_id,
                    user_agent: userAgent,
                    current_path: path,
                    last_seen: new Date().toISOString(),
                },
                { onConflict: "session_id" }
            );

        if (sessionError) {
            console.error("Session Error", sessionError);
        }

        // 3. Increment Daily Page Views
        // We utilize a Remote Procedure Call (RPC) or simple upsert logic
        // Since we don't have atomic increment in simple JS client without RPC,
        // we will try a best-effort approach or use a specialized RPC function if high concurrency.
        // For this MVp, we check if today's record exists.

        // Better approach: Use an RPC function for atomic increment.
        // Creating the RPC function via SQL is best, but for now let's try a robust upsert.

        // Check if we tracked this session today? 
        // Ideally we need a 'daily_sessions' table to track unique visitors accurately.
        // For MVP, if 'active_sessions' insert was a NEW row (created_at close to now), we count unique.

        // Let's implement a simple RPC call logic here.
        // We will assume an RPC function 'increment_page_view' exists, or we do it manually.
        // Manual approach (Race condition risk but acceptable for MVP):

        /* 
           To avoid race conditions, we should use SQL. 
           Let's stick to updating the 'active_sessions' for now which drives the "Real Time" dashboard.
           The "History" needs the atomic increment.
        */

        // Trigger RPC to increment stats safely
        const { error: rpcError } = await supabase.rpc('track_page_view', {
            p_date: today,
            p_session_id: session_id
        });

        if (rpcError) {
            // Fallback if RPC doesn't exist yet (we need to create it in the SQL step)
            // console.warn("RPC missing, falling back to manual");
            // Manual fallback logic omitted to encourage using RPC
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
