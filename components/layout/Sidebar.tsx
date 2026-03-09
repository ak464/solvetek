import Link from "next/link";
import { TrendingUp, Facebook, Twitter, Youtube, Instagram, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { extractFirstImage } from "@/lib/utils/image-utils";

async function TrendingArticles() {
    const supabase = await createClient();
    const { data: articles } = await supabase
        .from("articles")
        .select("*, category:categories(*)")
        .eq("is_published", true)
        .order("views_count", { ascending: false })
        .limit(6); // Reduced to 6 for a cleaner sidebar look

    if (!articles?.length) return null;

    return (
        <div className="space-y-6">
            {articles.map((article: any) => {
                const contentHtml = typeof article.content === 'string' ? article.content : "";
                const coverImage = extractFirstImage(contentHtml);

                return (
                    <Link
                        key={article.id}
                        href={`/guides/${article.category?.slug}/${article.slug}`}
                        className="flex gap-4 group"
                    >
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-all duration-300">
                            {coverImage ? (
                                <img src={coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <span className="opacity-40 group-hover:opacity-100 transition-opacity group-hover:scale-110 transition-transform duration-500">📁</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
                            <h4 className="text-[12px] font-black text-[#003366] dark:text-gray-200 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {article.title}
                            </h4>
                            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{article.category?.name_ar}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

async function SidebarRecommendation() {
    const supabase = await createClient();
    const { data: recommendation } = await supabase
        .from("affiliate_links")
        .select("*")
        .eq("status", "active")
        .eq("is_recommended", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!recommendation) return null;

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group overflow-hidden transition-colors">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-widest">توصية اليوم</span>
                <ShoppingBag size={14} className="text-gray-300" />
            </div>

            <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl mb-4 p-4 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <div className="text-4xl">📦</div>
            </div>

            <h4 className="text-[13px] font-black text-[#003366] dark:text-white mb-2 leading-tight line-clamp-2">{recommendation.name}</h4>
            <p className="text-[10px] font-bold text-gray-400 mb-4 line-clamp-2">{recommendation.description || 'منتج مميز نوصي به لزوارنا الكرام.'}</p>

            <a
                href={recommendation.url}
                target="_blank"
                rel="nofollow noopener"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF9900] text-white text-xs font-black rounded-xl hover:scale-[1.02] transition-transform"
            >
                عرض السعر في {recommendation.store === 'amazon' ? 'أمازون' : recommendation.store === 'noon' ? 'نون' : 'المتجر'}
            </a>
        </div>
    );
}

export async function Sidebar() {
    const supabase = await createClient();

    // Fetch settings for social links
    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['social_twitter', 'social_facebook', 'social_instagram', 'social_youtube', 'contact_email', 'show_social_box']);

    const settings = (settingsData || []).reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as any);

    const showSocialBox = settings.show_social_box === 'true';

    return (
        <aside className="space-y-12 sticky top-24">
            {/* Almuhtarif Social Box */}
            {showSocialBox && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                    <h3 className="text-[10px] font-black text-[#003366] dark:text-white uppercase tracking-[0.3em] mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">تابعنا</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Social Icons Logic */}
                        {[
                            { key: 'social_facebook', icon: Facebook, color: "text-[#003366] dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20" },
                            { key: 'social_twitter', icon: Twitter, color: "text-sky-500 bg-sky-50" },
                            { key: 'social_youtube', icon: Youtube, color: "text-red-500 bg-red-50" },
                            { key: 'social_instagram', icon: Instagram, color: "text-pink-600 bg-pink-50" },
                            { key: 'contact_email', icon: Mail, color: "text-gray-500 bg-gray-50", type: 'email' }
                        ].map((social, i) => {
                            const url = (settings as any)[social.key];
                            if (!url) return null;

                            const href = social.type === 'email' ? `mailto:${url}` : url;

                            return (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={`aspect-square flex items-center justify-center rounded-2xl ${social.color} hover:scale-105 transition-transform`}>
                                    <social.icon size={20} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Almuhtarif Trending Box - SCALED UP */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-900/5 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-24 h-1 bg-blue-600" />
                <h3 className="text-sm font-black text-[#003366] dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800 pb-5">
                    <TrendingUp size={20} className="text-blue-600" />
                    أكثر المواضيع مشاهدة خلال هذا الاسبوع
                </h3>
                <TrendingArticles />
            </div>

            {/* Direct WhatsApp Support */}
            {/* Direct WhatsApp Support - OFF (User Request) */}
            {/* <div className="bg-[#25D366] p-8 rounded-3xl shadow-xl shadow-green-900/10 relative overflow-hidden group">
                <div className="relative z-10 text-white">
                    <h3 className="text-lg font-black mb-2 font-heading">لديك مشكلة تقنية؟</h3>
                    <p className="text-green-50 text-xs mb-6 font-bold leading-relaxed">تواصل معنا مباشرة عبر واتساب وسيقوم أحد خبرائنا بمساعدتك مجاناً.</p>
                    <a
                        href="https://wa.me/XXXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-white text-[#25D366] font-black rounded-2xl hover:scale-105 transition-transform shadow-lg"
                    >
                        <MessageCircle size={20} />
                        دردشة مباشرة
                    </a>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div> */}


            {/* Almuhtarif Newsletter */}
            {/* Almuhtarif Newsletter - OFF (User Request) */}
            {/* <div className="bg-[#ffffff] p-8 rounded-2xl border-2 border-blue-100 shadow-xl shadow-blue-900/5">
                <h3 className="text-lg font-black mb-2 font-heading text-[#003366]">اشترك الآن</h3>
                <p className="text-gray-500 text-xs mb-6 font-bold leading-relaxed">كن أول من يعرف بجديد الشروحات التقنية في المملكة.</p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        className="w-full h-11 bg-[#f9fafb] border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder:text-gray-400"
                    />
                    <button className="w-full h-11 bg-blue-600 text-white font-black rounded-xl text-sm transition-transform hover:scale-[1.02]">
                        اشتراك
                    </button>
                </div>
            )} */}
        </aside>
    );
}
