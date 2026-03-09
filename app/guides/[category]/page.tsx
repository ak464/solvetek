import { createClient } from "@/lib/supabase/server";
import { HorizontalArticleCard } from "@/components/features/guides/HorizontalArticleCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdUnit } from "@/components/features/ads/AdUnit";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Newspaper, Sparkles, Home } from "lucide-react";

// Known categories for metadata fallback
const KNOWN_CATEGORIES: Record<string, string> = {
    mobile: "جوالات",
    internet: "انترنت وشبكات",
    apps: "تطبيقات",
    computer: "كمبيوتر",
    iphone: "ايفون",
    android: "اندرويد"
};

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { category } = await params;
    const name = KNOWN_CATEGORIES[category] || category;
    return {
        title: `شروحات ${decodeURIComponent(name)} - SolveTek`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const supabase = await createClient();
    const { category: categorySlug } = await params;

    // 1. Get Category details
    const { data: dbCategory } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .single();

    if (!dbCategory) {
        return notFound();
    }

    // 2. Get Articles for this category
    const { data: articles } = await supabase
        .from("articles")
        .select("*, category:categories(*)")
        .eq("is_published", true)
        .eq("category_id", dbCategory.id)
        .order("created_at", { ascending: false });

    // Fetch global ads setting
    const { data: globalAdsSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ads_enabled')
        .single();

    const showAds = globalAdsSetting?.value === 'true';

    return (
        <main className="min-h-screen pb-32">
            {/* 1. COMPACT CATEGORY HEADER */}
            <div className="bg-card border-b border-border relative overflow-hidden">
                <div className="max-w-[1600px] mx-auto px-4 py-10 flex flex-col items-center gap-3 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-wider uppercase border border-primary/20">
                        <Sparkles size={12} className="animate-pulse" />
                        قسم {dbCategory.name_ar}
                    </div>

                    <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-foreground text-center font-heading leading-snug tracking-tight max-w-3xl lowercase">
                        Solve<span className="text-primary">Tek</span> - {dbCategory.name_ar}
                    </h1>

                    {/* BREADCRUMBS PATH */}
                    <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-2">
                        <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
                            <Home size={12} /> الرئيسية
                        </Link>
                        <ChevronLeft size={12} />
                        <span className="text-primary">{dbCategory.name_ar}</span>
                    </nav>
                </div>
                {/* Subtle bg glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* 2. MAIN LAYOUT (70/30 Grid) */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Feed Column (70%) */}
                        <div className="lg:col-span-8">
                            {/* Section Header */}
                            <div className="bg-card p-5 border-b-4 border-primary mb-8 flex items-center justify-between rounded-t-xl shadow-sm">
                                <h2 className="text-xl md:text-2xl font-black text-primary font-heading tracking-tighter flex items-center gap-3">
                                    <span className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-md flex items-center justify-center">
                                        <Newspaper size={18} />
                                    </span>
                                    مقالات {dbCategory.name_ar}
                                </h2>
                            </div>

                            {/* Top Ad */}
                            {showAds && (
                                <div className="mb-8">
                                    <AdUnit slotId="category-top" placement="header" format="auto" className="h-[90px] md:h-[250px]" />
                                </div>
                            )}

                            {/* Vertical List of Articles */}
                            {articles && articles.length > 0 ? (
                                <div className="bg-card rounded-b-3xl shadow-sm overflow-hidden border border-t-0 border-border divide-y divide-border transition-colors">
                                    {articles.map((article: any) => (
                                        <HorizontalArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-card p-20 rounded-3xl border border-border text-center flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                                        <Newspaper size={40} />
                                    </div>
                                    <p className="font-bold text-muted-foreground">لا توجد مقالات في هذا القسم حالياً.</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Column (30%) */}
                        <div className="lg:col-span-4">
                            <Sidebar />
                            {/* Sidebar Sticky Ad */}
                            {showAds && (
                                <div className="mt-8 sticky top-4">
                                    <AdUnit slotId="category-sidebar" placement="sidebar" format="rectangle" className="h-[600px]" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
