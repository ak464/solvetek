import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/features/guides/ArticleCard";

interface RelatedArticlesProps {
    currentArticleId: number;
    categoryId: number;
}

export async function RelatedArticles({ currentArticleId, categoryId }: RelatedArticlesProps) {
    const supabase = await createClient();

    const { data: articles } = await supabase
        .from("articles")
        .select("*, category:categories(*)")
        .eq("category_id", categoryId)
        .eq("is_published", true)
        .neq("id", currentArticleId) // Exclude current
        .limit(3);

    if (!articles?.length) return null;

    return (
        <section className="mt-20 border-t border-gray-100 pt-16">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl md:text-2xl font-black text-[#003366] font-heading tracking-tighter">شروحات قد تهمك أيضاً</h3>
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}
