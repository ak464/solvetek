import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const { articleIds } = await request.json();

        if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
            return NextResponse.json({ error: 'Invalid article IDs' }, { status: 400 });
        }

        const supabase = await createClient();

        // Verify user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Bulk delete articles
        const { error } = await supabase
            .from('articles')
            .delete()
            .in('id', articleIds);

        if (error) {
            console.error('Bulk delete error:', error);
            return NextResponse.json({ error: 'Failed to delete articles' }, { status: 500 });
        }

        return NextResponse.json({ success: true, deleted: articleIds.length });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
