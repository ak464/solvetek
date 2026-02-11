import { createClient } from "@/lib/supabase/server";
import { HorizontalArticleCard } from "@/components/features/guides/HorizontalArticleCard";
import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { Suspense } from "react";
import { Search, Sparkles, ChevronLeft, Newspaper } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { AdUnit } from "@/components/features/ads/AdUnit";
import { CATEGORY_ICONS } from "@/lib/config/icons";

// Force dynamic rendering to always show latest data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Async component for fetching recent articles with pagination
async function RecentArticles({ page = 1 }: { page?: number }) {
  const supabase = await createClient();
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch global ads setting
  const { data: globalAdsSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'ads_enabled')
    .single();

  const showAds = globalAdsSetting?.value === 'true';

  const { data: articles, count } = await supabase
    .from("articles")
    .select("*, category:categories(*)", { count: 'exact' })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!articles?.length) {
    return <p className="text-gray-500 text-center py-10">لا توجد مقالات منشورة بعد.</p>;
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* 1. LAYOUT 70/30 (Main on Right, Sidebar on Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Feed Column (70%) */}
        <div className="lg:col-span-8">
          {/* Almuhtarif Section Header */}
          <div className="bg-white p-5 border-b-4 border-[#003366] mb-8 flex items-center justify-between rounded-t-xl shadow-sm">
            <h2 className="text-xl md:text-2xl font-black text-[#003366] font-heading tracking-tighter flex items-center gap-3">
              <span className="bg-[#003366] text-white p-1.5 rounded-lg shadow-md flex items-center justify-center">
                <Newspaper size={18} />
              </span>
              آخر المواضيع
            </h2>
          </div>

          {/* Vertical List of Articles */}
          <div className="bg-white rounded-b-3xl shadow-sm overflow-hidden border border-t-0 border-gray-100 divide-y divide-gray-100 transition-colors">
            {articles.map((article: any) => (
              <HorizontalArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/"
          />
        </div>

        {/* Sidebar Column (30%) */}
        <div className="lg:col-span-4">
          {/* Sidebar Sticky Ad - Before sidebar to appear at top */}
          {showAds && (
            <div className="mb-8 sticky top-4">
              <AdUnit slotId="homepage-sidebar" placement="sidebar" format="rectangle" className="h-[600px]" />
            </div>
          )}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('id');



  return (
    <main className="min-h-screen pb-32">
      {/* 1. COMPACT HEADER */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 py-12 flex flex-col items-center gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black tracking-wider uppercase border border-blue-100">
            <Sparkles size={12} className="animate-pulse" />
            منصة SolveTek التقنية
          </div>

          <h1 className="text-lg md:text-xl lg:text-2xl font-black text-black text-center font-heading leading-snug tracking-tight max-w-2xl">
            نحن هنا لنجعل <span className="text-blue-600">التكنولوجيا</span> أداة تفوق بين يديك
          </h1>
        </div>
        {/* Subtle bg glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      </div>


      {/* Ad Unit: Home Top Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <AdUnit slotId="home-top" placement="header" format="auto" className="h-[90px] md:h-[200px]" />
      </div>

      {/* 2. MAIN MAGAZINE BLOCK (ULTRA-WIDE) */}
      <section className="py-24">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center py-40 gap-8 text-gray-300">
            <div className="w-24 h-24 border-4 border-gray-50 border-t-blue-600 rounded-full animate-spin" />
            <p className="font-black uppercase tracking-[0.4em] text-[14px] opacity-40">جاري تحميل المحتوى التقني...</p>
          </div>
        }>
          <RecentArticles page={page} />
        </Suspense>
      </section>


      {/* 3. ULTRA-WIDE CATEGORIES GRID */}
      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl shadow-[#003366]/5 border border-gray-100">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-lg md:text-2xl font-black text-[#003366] font-heading tracking-tighter">تصفح حسب الاهتمام</h2>
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/guides/${cat.slug}`}
                  className="group bg-white p-8 rounded-2xl text-center hover:bg-gray-50 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {(() => {
                      const Icon = CATEGORY_ICONS[cat.icon_name || ''] || CATEGORY_ICONS.default;
                      return <Icon size={40} strokeWidth={1.5} />;
                    })()}
                  </div>
                  <h3 className="font-black text-base text-[#003366] group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {cat.name_ar}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}
