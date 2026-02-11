import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch the destination URL
    const { data: link, error } = await supabase
        .from('affiliate_links')
        .select('url')
        .eq('id', id)
        .single();

    if (error || !link) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Increment Click Count (Async - don't await to speed up redirect)
    // We use the RPC function we created
    const userAgent = request.headers.get("user-agent") || "";
    const isBot = /bot|crawl|spider|google|bing|yahoo/i.test(userAgent);

    if (!isBot) {
        supabase.rpc('increment_affiliate_click', { link_id: parseInt(id) }).then(({ error }) => {
            if (error) console.error("Failed to increment click:", error);
        });
    }

    // 3. Redirect to the destination
    return NextResponse.redirect(link.url);
}
