import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/schema";
import { AdUnit } from "@/components/features/ads/AdUnit";
import { RelatedArticles } from "@/components/features/guides/RelatedArticles";
import Link from "next/link";
import { Clock, Sparkles, ChevronLeft, Star } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShareWidget } from "@/components/ui/ShareWidget";
import { AffiliateProductBox } from "@/components/features/affiliate/AffiliateProductBox";
import { MonetizationRenderer } from "@/components/features/monetization/MonetizationRenderer";

interface ArticlePageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const supabase = await createClient();
    const { data: article } = await supabase
        .from("articles")
        .select("title, excerpt, featured_image")
        .eq("slug", decodedSlug)
        .single();

    if (!article) return { title: "المقال غير موجود" };

    const ogImage = article.featured_image || 'https://solvetek.net/og-default.png';

    return {
        title: article.title,
        description: article.excerpt,
        alternates: {
            canonical: `https://solvetek.net/guides/${(await params).category}/${slug}`,
        },
        openGraph: {
            type: "article",
            locale: "ar_SA",
            title: article.title,
            description: article.excerpt || "",
            url: `https://solvetek.net/guides/${(await params).category}/${slug}`,
            siteName: "SolveTek",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt || "",
            images: [ogImage],
        }
    };
}

import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ViewTracker } from "@/components/features/guides/ViewTracker";

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    // Decode the slug to ensure Arabic characters are handled correctly
    const decodedSlug = decodeURIComponent(slug);

    const supabase = await createClient();

    // Fetch article with basic relations
    const { data: article } = await supabase
        .from("articles")
        .select("*, category:categories(*), author:profiles(username)")
        .eq("slug", decodedSlug)
        .single();

    if (!article) {
        return notFound();
    }

    // Fetch monetization settings separately (optional data)
    const { data: monetization } = await supabase
        .from("article_monetization")
        .select("*, link:affiliate_links(*)")
        .eq("article_id", article.id)
        .eq("is_enabled", true);

    // Attach monetization data to article
    article.monetization = monetization || [];

    // Fetch global ads setting
    const { data: globalAdsSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ads_enabled')
        .single();

    // Determine if ads should show: global enabled AND per-article enabled
    const globalAdsEnabled = globalAdsSetting?.value === 'true';
    const showAds = globalAdsEnabled && (article.ads_enabled ?? true);

    const content = typeof article.content === 'string'
        ? article.content
        : JSON.stringify(article.content, null, 2);

    const jsonLd = generateArticleSchema(article);
    const breadcrumbLd = generateBreadcrumbSchema([
        { name: "الرئيسية", item: "https://solvetek.net" },
        { name: article.category?.name_ar || "", item: `https://solvetek.net/guides/${article.category?.slug}` },
        { name: article.title, item: `https://solvetek.net/guides/${article.category?.slug}/${article.slug}` }
    ]);

    return (
        <main className="min-h-screen pb-32">
            <ReadingProgress />
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <ViewTracker articleId={article.id} />

            {/* 1. ARTICLE HERO (Compact) */}
            <div className="bg-white border-b border-gray-100 relative overflow-hidden pt-8 pb-10">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-12 relative z-10">
                    {/* Top Meta Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
                            <ChevronLeft size={10} className="text-gray-300" />
                            <Link href={`/guides/${article.category?.slug}`} className="hover:text-blue-600 transition-colors">{article.category?.name_ar}</Link>
                            <ChevronLeft size={10} className="text-gray-300" />
                            <span className="text-blue-600 line-clamp-1 max-w-[150px]">{article.title}</span>
                        </nav>

                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003366] text-white text-[10px] font-black tracking-tighter shadow-lg shadow-blue-900/20">
                            <Sparkles size={10} />
                            {article.category?.name_ar}
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="max-w-4xl text-right">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-[1.2] font-heading tracking-tighter mb-6">
                            {article.title}
                        </h1>

                        {/* Author & Share Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-8 py-2">
                            {/* Author Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#003366] font-black text-sm shadow-sm ring-4 ring-white">
                                    {article.author?.username?.[0] || 'S'}
                                </div>
                                <div className="text-right">
                                    <p className="text-[13px] font-black text-black leading-none mb-1">{article.author?.username || 'سولفتيك'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        {new Date(article.updated_at || article.created_at).toLocaleDateString("ar-SA", { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-6 bg-gray-100" />

                            {/* Engagement */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 group/meta">
                                    <Clock size={16} className="text-gray-300 group-hover/meta:text-blue-600 transition-colors" />
                                    <span className="text-[11px] font-black text-gray-400 group-hover/meta:text-black transition-colors">{Math.ceil((content.length || 0) / 1000) || 5} دقائق قراءة</span>
                                </div>
                                <div className="w-px h-6 bg-gray-100" />
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">مشاركة</span>
                                    <ShareWidget title={article.title} variant="compact" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modern bg element */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-70" />
            </div>

            {/* 2. MAIN CONTENT AREA (70/30) */}
            <section className="py-24">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Article Text Content (70%) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-blue-900/5">
                                {article.excerpt && (
                                    <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium mb-12 border-r-[8px] border-blue-600/10 pr-8">
                                        {article.excerpt}
                                    </p>
                                )}

                                {/* Top Affiliate / Ad Positioning */}
                                <MonetizationRenderer settings={article.monetization} position="top" />

                                <div className="max-w-none prose prose-xl prose-blue font-sans text-gray-800 leading-[2.2] text-justify selection:bg-blue-100">
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                </div>

                                {/* Bottom Positioning */}
                                <MonetizationRenderer settings={article.monetization} position="bottom" />

                                {/* Affiliate Recommendation: Shown for relevant categories */}
                                {article.category?.slug === 'mobile' && (
                                    <div className="mt-16">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                                <Star size={20} />
                                            </div>
                                            <h3 className="text-xl font-black text-[#003366] font-heading">أفضل الأجهزة المقترحة لك</h3>
                                        </div>
                                        <AffiliateProductBox
                                            title="أيفون 15 برو - سعة 256 جيجا"
                                            description="أحدث إصدار من أبل مع معالج A17 Pro القوي وتصميم من التيتانيوم. مثالي لمن يبحث عن الأداء الفائق."
                                            price="4,299"
                                            imageUrl="https://m.media-amazon.com/images/I/81SigAnN1KL._AC_SL1500_.jpg"
                                            affiliateUrl="https://amazon.sa"
                                            store="amazon"
                                            isFeatured={true}
                                        />
                                    </div>
                                )}

                                {/* Mid Content Ad - After first paragraph */}
                                {showAds && <AdUnit slotId="mid-content" placement="article_middle" format="auto" className="my-8" />}

                                {/* Tags */}
                                <div className="mt-16 pt-12 border-t border-gray-100 flex flex-wrap gap-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">العلامات:</span>
                                    {['حلول_تقنية', 'شروحات', 'المملكة'].map(tag => (
                                        <span key={tag} className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[11px] font-bold hover:bg-[#003366] hover:text-white transition-all cursor-pointer">#{tag}</span>
                                    ))}
                                </div>

                            </div>

                            {/* Related Articles Component */}
                            <div className="mt-16">
                                <RelatedArticles
                                    currentArticleId={article.id}
                                    categoryId={article.category_id}
                                />
                            </div>
                        </div>

                        {/* Global Sidebar (30%) */}
                        <div className="lg:col-span-4">
                            <Sidebar />
                            {/* Ad Unit: Sidebar Sticky */}
                            {showAds && (
                                <div className="mt-8 sticky top-4">
                                    <AdUnit slotId="sidebar-sticky" placement="sidebar" format="rectangle" className="h-[600px]" />
                                </div>
                            )}
                            <div className="mt-8">
                                <MonetizationRenderer settings={article.monetization} position="sidebar" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
}
