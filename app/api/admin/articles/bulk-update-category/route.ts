import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const { articleIds, categoryId } = await request.json();

        if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
            return NextResponse.json({ error: 'Invalid article IDs' }, { status: 400 });
        }

        if (!categoryId) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
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

        // Verify category exists
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('id', categoryId)
            .single();

        if (categoryError || !category) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        // Bulk update category
        const { error } = await supabase
            .from('articles')
            .update({ category_id: categoryId, updated_at: new Date().toISOString() })
            .in('id', articleIds);

        if (error) {
            console.error('Bulk update category error:', error);
            return NextResponse.json({ error: 'Failed to update articles' }, { status: 500 });
        }

        return NextResponse.json({ success: true, updated: articleIds.length });
    } catch (error) {
        console.error('Bulk update category error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
