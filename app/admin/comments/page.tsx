import { createClient } from "@/lib/supabase/server";
import { AdminComments } from "@/components/admin/AdminComments";
import { MessageSquare } from "lucide-react";

export const metadata = {
    title: "التعليقات | SolveTek Admin",
};

export default async function CommentsPage() {
    const supabase = await createClient();

    // Fetch all comments with article info
    const { data: comments } = await supabase
        .from('comments')
        .select(`
            *,
            article:articles(title, slug, category:categories(slug))
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-[#003366] dark:text-white flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        إدارة التعليقات
                    </h2>
                    <p className="text-gray-500 text-sm font-bold mt-1">مراجعة وإدارة تعليقات الزوار.</p>
                </div>
                <div className="bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
                    <span className="text-sm font-bold text-muted-foreground">عدد التعليقات: </span>
                    <span className="text-lg font-black text-foreground">{comments?.length || 0}</span>
                </div>
            </div>

            <AdminComments initialComments={comments || []} />
        </div>
    );
}
