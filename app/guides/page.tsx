import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/features/guides/ArticleCard";
import Link from "next/link";
import { Layers } from "lucide-react";

export const metadata = {
    title: "دليل الشروحات التقنية",
    description: "تصفح جميع الأقسام والشروحات التقنية لحل مشاكل الجوال والانترنت.",
};

export default async function GuidesIndexPage() {
    const supabase = await createClient();

    // 1. Fetch Categories
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("id");

    // 2. Fetch Recent Articles
    const { data: articles } = await supabase
        .from("articles")
        .select("*, category:categories(*)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <header className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 font-heading">
                    دليل الشروحات الشامل
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    جميع الحلول التقنية في مكان واحد. اختر القسم المناسب أو تصفح أحدث المقالات المضافة.
                </p>
            </header>

            {/* Categories Grid */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-blue-600 pr-4">
                    تصفح الأقسام
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/guides/${cat.slug}`}
                            className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center"
                        >
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform block">
                                {cat.icon_url || <Layers className="text-blue-500" />}
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                {cat.name_ar}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Articles Grid */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-r-4 border-green-500 pr-4">
                    أحدث الشروحات المضافة
                </h2>

                {articles && articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg">لا توجد مقالات منشورة حتى الآن.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
