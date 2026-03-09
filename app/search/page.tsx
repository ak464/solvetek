import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/features/guides/ArticleCard";
import { Search as SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export const metadata = {
    title: "البحث في الشروحات",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";
    const supabase = await createClient();

    let articles: any[] = [];

    if (query) {
        const { data } = await supabase
            .from("articles")
            .select("*, category:categories(*)")
            .eq("is_published", true)
            .ilike("title", `%${query}%`)
            .order("views_count", { ascending: false });

        articles = data || [];
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto mb-12 text-center">
                <h1 className="text-3xl font-black mb-6 text-foreground">البحث في الموقع</h1>

                <form action="/search" className="relative">
                    <input
                        name="q"
                        defaultValue={query}
                        type="search"
                        placeholder="اكتب كلمة البحث هنا..."
                        className="w-full h-14 pr-12 pl-4 rounded-xl border border-border bg-card text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-lg transition-colors"
                    />
                    <button type="submit" className="absolute right-3 top-2 bottom-2 text-gray-500 hover:text-blue-600">
                        <SearchIcon size={24} />
                    </button>
                </form>
            </div>

            {query && (
                <div className="mb-8">
                    <h2 className="text-xl font-black text-foreground">
                        نتائج البحث عن: <span className="text-blue-600">"{query}"</span> ({articles.length})
                    </h2>
                </div>
            )}

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : query ? (
                <div className="text-center py-16 bg-muted border border-border rounded-xl transition-colors">
                    <p className="text-muted-foreground text-lg">لم يتم العثور على نتائج مطابقة.</p>
                    <p className="text-muted-foreground/60 mt-2">جرب البحث بكلمات مختلفة أو عامة.</p>
                </div>
            ) : null}
        </div>
    );
}
