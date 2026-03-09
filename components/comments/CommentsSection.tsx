import { createClient } from '@/lib/supabase/server';
import { User } from 'lucide-react';
import { CommentList } from './CommentList';

export async function CommentsSection({ articleId, isLocked }: { articleId: number, isLocked: boolean }) {
    const supabase = await createClient();

    // Fetch Approved Comments
    const { data: comments } = await supabase
        .from('comments')
        .select(`
            *,
            profile:profiles(username, role)
        `)
        .eq('article_id', articleId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

    // Build Comment Tree
    const commentTree = comments?.filter(c => !c.parent_id).map(parent => ({
        ...parent,
        replies: comments.filter(c => c.parent_id === parent.id)
    })) || [];

    return (
        <section id="comments" className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-black text-foreground mb-6">
                التعليقات ({comments?.length || 0})
            </h2>

            {/* Comments List & Form */}
            <CommentList comments={commentTree} articleId={articleId} isLocked={isLocked} />

        </section>
    );
}
