import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { session_id, path, referrer } = body;
        const userAgent = req.headers.get("user-agent") || "";

        const isBot = /bot|crawl|spider|google|bing|yahoo|duckduckgo/i.test(userAgent);

        if (isBot) {
            return NextResponse.json({ success: true, ignored: true });
        }



        // Determine Device Type
        let deviceType = 'desktop';
        if (/mobile/i.test(userAgent)) deviceType = 'mobile';
        else if (/tablet|ipad/i.test(userAgent)) deviceType = 'tablet';

        // Call the enhanced RPC function
        const { error: rpcError } = await supabase.rpc('track_page_view', {
            p_session_id: session_id,
            p_path: path,
            p_referrer: referrer || null,
            p_user_agent: userAgent,
            p_device_type: deviceType
        });

        if (rpcError) {
            console.error("Analytics RPC Error", rpcError);
            // Fallback: Just update active sessions if RPC fails (e.g. migration not run yet)
            await supabase.from("active_sessions").upsert({
                session_id,
                user_agent: userAgent,
                current_path: path,
                last_seen: new Date().toISOString(),
            }, { onConflict: "session_id" });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
