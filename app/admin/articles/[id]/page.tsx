import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/features/admin/ArticleForm";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

    if (!article) {
        return notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">تعديل المقال</h1>
            <ArticleForm initialData={article} isEditing={true} />
        </div>
    );
}
