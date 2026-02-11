import { createClient } from "@/lib/supabase/server";
import { Users, Eye, FileText, Activity, TrendingUp, Clock, Globe } from "lucide-react";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

export const metadata = {
    title: "لوحة المعلومات | SolveTek Admin",
};

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Fetch Real-Time Active Users (Last 15 mins)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gt('last_seen', fifteenMinutesAgo);

    // 2. Fetch Daily Analytics (Last 30 Days)
    const { data: analyticsData } = await supabase
        .from('site_analytics')
        .select('*')
        .order('date', { ascending: true })
        .limit(30);

    // 3. Fetch Totals
    const { count: totalArticles } = await supabase.from('articles').select('*', { count: 'exact', head: true });

    // 4. Fetch Top Articles
    const { data: topArticles } = await supabase
        .from('articles')
        .select('title, views_count, slug')
        .order('views_count', { ascending: false })
        .limit(5);

    // Calculate aggregate stats
    const totalViews = analyticsData?.reduce((acc, curr) => acc + (curr.page_views || 0), 0) || 0;
    const todayStats = analyticsData?.[analyticsData.length - 1] || { page_views: 0, unique_visitors: 0 };

    const stats = [
        {
            label: "المتواجدون الآن",
            value: activeUsers || 0,
            icon: Users,
            color: "bg-green-500",
            subtext: "في آخر 15 دقيقة"
        },
        {
            label: "زيارات اليوم",
            value: todayStats.page_views,
            icon: Eye,
            color: "bg-blue-500",
            subtext: `+${todayStats.unique_visitors} زائر فريد`
        },
        {
            label: "إجمالي المقالات",
            value: totalArticles || 0,
            icon: FileText,
            color: "bg-purple-500",
            subtext: "مقال منشور"
        },
        {
            label: "نشاط الشهر",
            value: totalViews,
            icon: Activity,
            color: "bg-orange-500",
            subtext: "مشاهدة صفحة"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-[#003366]">لوحة المعلومات</h2>
                <p className="text-gray-500 text-sm font-bold mt-1">نظرة عامة على أداء الموقع والزوار.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                                <stat.icon size={24} />
                            </div>
                            {i === 0 && <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>}
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-400 mt-1">{stat.label}</div>
                            <div className="text-xs font-bold text-gray-300 mt-2 pt-2 border-t border-gray-50">
                                {stat.subtext}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsChart data={analyticsData || []} />
                </div>

                {/* Top Content */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="font-black text-[#003366]">المقالات الأكثر قراءة</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4">
                                {topArticles?.map((article, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${i < 3 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                                            #{i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate">{article.title}</h4>
                                            <span className="text-[10px] text-gray-400 font-bold">{article.views_count} مشاهدة</span>
                                        </div>
                                    </div>
                                ))}
                                {topArticles?.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 text-sm font-bold opacity-60">
                                        لا توجد مقالات بعد
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

