"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Category, Article, AffiliateLink, ArticleMonetization } from "@/lib/types/database";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Sparkles, Eye, Settings, Share2, AlertCircle, CheckCircle2, DollarSign, Link as LinkIcon, Plus, Trash2 } from "lucide-react";

interface ArticleFormProps {
    initialData?: Partial<Article>;
    isEditing?: boolean;
}

export function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content ? (typeof initialData.content === 'string' ? initialData.content : '') : "",
        category_id: initialData?.category_id || "",
        is_published: initialData?.is_published || false,
        ads_enabled: initialData?.ads_enabled ?? true,
        affiliate_enabled: initialData?.affiliate_enabled ?? true,
    });

    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
    const [monetizationSettings, setMonetizationSettings] = useState<Partial<ArticleMonetization>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [{ data: cats }, { data: links }] = await Promise.all([
                supabase.from('categories').select('*'),
                supabase.from('affiliate_links').select('*')
            ]);

            if (cats) setCategories(cats as unknown as Category[]);
            if (links) setAffiliateLinks(links as unknown as AffiliateLink[]);

            if (isEditing && initialData?.id) {
                const { data: mon } = await supabase
                    .from('article_monetization')
                    .select('*')
                    .eq('article_id', initialData.id);
                if (mon) setMonetizationSettings(mon);
            }
        };
        fetchData();
    }, [initialData?.id, isEditing]);

    // --- SEO Suggestion Logic ---
    const seoSuggestions = useMemo(() => {
        const suggestions = [];
        if (formData.title.length < 40) suggestions.push("العنوان قصير جداً، حاول إضافة كلمات مفتاحية (مثلاً: 2026, أفضل الطروح).");
        if (!formData.title.includes("حل") && !formData.title.includes("طريقة")) suggestions.push("أضف كلمات مثل 'حل مشكلة' أو 'طريقة' لزيادة نسبة النقر.");
        if (!formData.excerpt || formData.excerpt.length < 50) suggestions.push("المقتطف (SEO Description) ضروري لظهورك في جوجل.");

        // Technical Keyword Suggestions
        const keywords = ["سريع", "مجاني", "تحديث", "شرح", "خطوات", "بسهولة"];
        const missing = keywords.filter(k => !formData.title.includes(k) && !formData.content.includes(k)).slice(0, 3);
        if (missing.length > 0) suggestions.push(`جرب استخدام كلمات تجذب البحث مثل: ${missing.join('، ')}`);

        return suggestions;
    }, [formData.title, formData.content, formData.excerpt]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !isEditing ? title.trim().toLowerCase().replace(/[^\w\u0600-\u06FF\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("يجب تسجيل الدخول");
            setLoading(false);
            return;
        }

        const payload = {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            category_id: Number(formData.category_id),
            author_id: user.id,
            is_published: formData.is_published,
            ads_enabled: formData.ads_enabled,
            affiliate_enabled: formData.affiliate_enabled,
            updated_at: new Date().toISOString(),
            ...(isEditing ? {} : { published_at: formData.is_published ? new Date().toISOString() : null })
        };

        const { data: savedArticle, error } = isEditing
            ? await supabase.from('articles').update(payload).eq('id', initialData?.id).select().single()
            : await supabase.from('articles').insert(payload).select().single();

        if (error) {
            alert("خطأ أثناء الحفظ: " + error.message);
        } else if (savedArticle) {
            // Save Monetization Settings
            if (isEditing) {
                await supabase.from('article_monetization').delete().eq('article_id', savedArticle.id);
            }

            if (monetizationSettings.length > 0) {
                const monPayload = monetizationSettings.map(m => ({
                    article_id: savedArticle.id,
                    affiliate_link_id: m.affiliate_link_id,
                    position: m.position || 'bottom',
                    block_type: m.block_type || 'box',
                    is_enabled: m.is_enabled ?? true
                }));
                await supabase.from('article_monetization').insert(monPayload);
            }

            router.push('/admin/articles');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1440px] mx-auto p-4 lg:p-8">
            {/* Main Editing Area */}
            <div className="flex-1 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="عنوان المقال هنا..."
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="text-3xl md:text-4xl font-black text-gray-900 border-none outline-none focus:ring-0 placeholder:text-gray-200 w-full font-heading"
                    />

                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 p-2 rounded-lg">
                        <span className="font-bold">رابط المقال:</span>
                        <span className="font-mono" dir="ltr">/guides/[category]/</span>
                        <input
                            className="bg-transparent border-none p-0 focus:ring-0 font-mono text-blue-500 w-full"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    <TipTapEditor
                        content={formData.content}
                        onChange={(html) => setFormData({ ...formData, content: html })}
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <Eye size={20} className="text-blue-500" />
                        مقتطف SEO (الوصف المختصر)
                    </h3>
                    <textarea
                        rows={3}
                        placeholder="اكتب مخلصاً للمقال يظهر في نتائج بحث جوجل وشبكات التواصل..."
                        value={formData.excerpt || ""}
                        onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Monetization Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-[#003366] relative z-10">
                        <DollarSign size={24} className="text-orange-500" />
                        إعدادات الربح (Monetization)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                        <div
                            onClick={() => setFormData({ ...formData, ads_enabled: !formData.ads_enabled })}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.ads_enabled ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 bg-gray-50/30'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-black text-[#003366]">إعلانات AdSense</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.ads_enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.ads_enabled ? 'right-6' : 'right-1'}`} />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 mt-2">تفعيل أو تعطيل ظهور الوحدات الإعلانية في هذا المقال.</p>
                        </div>

                        <div
                            onClick={() => setFormData({ ...formData, affiliate_enabled: !formData.affiliate_enabled })}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.affiliate_enabled ? 'border-orange-500 bg-orange-50/30' : 'border-gray-50 bg-gray-50/30'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-black text-[#003366]">روابط الأفلييت</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.affiliate_enabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.affiliate_enabled ? 'right-6' : 'right-1'}`} />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 mt-2">عرض صناديق المنتجات وبرامج البيع بالعمولة.</p>
                        </div>
                    </div>

                    {formData.affiliate_enabled && (
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h4 className="text-sm font-black text-[#003366]">روابط الأفلييت المختارة لهذا المقال</h4>
                                <button
                                    type="button"
                                    onClick={() => setMonetizationSettings([...monetizationSettings, { position: 'bottom', block_type: 'box', is_enabled: true }])}
                                    className="text-[10px] font-black bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/10"
                                >
                                    <Plus size={14} />
                                    إضافة رابط
                                </button>
                            </div>

                            <div className="space-y-4">
                                {monetizationSettings.map((setting, idx) => (
                                    <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-wrap md:flex-nowrap items-center gap-4 group">
                                        <div className="flex-1 min-w-[200px]">
                                            <select
                                                value={setting.affiliate_link_id || ""}
                                                onChange={(e) => {
                                                    const newSettings = [...monetizationSettings];
                                                    newSettings[idx].affiliate_link_id = Number(e.target.value);
                                                    setMonetizationSettings(newSettings);
                                                }}
                                                className="w-full bg-white border border-gray-100 h-10 rounded-xl px-3 text-xs font-bold outline-none ring-blue-500 focus:ring-2"
                                            >
                                                <option value="">اختر رابط أفلييت...</option>
                                                {affiliateLinks.map(link => (
                                                    <option key={link.id} value={link.id}>
                                                        {link.name} ({link.store}) {link.status !== 'active' ? '[موقف]' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <select
                                                value={setting.position}
                                                onChange={(e) => {
                                                    const newSettings = [...monetizationSettings];
                                                    newSettings[idx].position = e.target.value as any;
                                                    setMonetizationSettings(newSettings);
                                                }}
                                                className="w-full bg-white border border-gray-100 h-10 rounded-xl px-3 text-xs font-bold outline-none"
                                            >
                                                <option value="top">البداية</option>
                                                <option value="middle">المنتصف</option>
                                                <option value="bottom">الخاتمة</option>
                                                <option value="sidebar">الجانبي</option>
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <select
                                                value={setting.block_type}
                                                onChange={(e) => {
                                                    const newSettings = [...monetizationSettings];
                                                    newSettings[idx].block_type = e.target.value as any;
                                                    setMonetizationSettings(newSettings);
                                                }}
                                                className="w-full bg-white border border-gray-100 h-10 rounded-xl px-3 text-xs font-bold outline-none"
                                            >
                                                <option value="box">صندوق (Box)</option>
                                                <option value="button">زر (CTA)</option>
                                                <option value="text">نص فقط</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMonetizationSettings(monetizationSettings.filter((_, i) => i !== idx))}
                                            className="p-2 text-red-400 bg-white border border-gray-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {monetizationSettings.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-xs font-bold bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
                                        لم تقم بإضافة أي روابط أفلييت لهذا المقال بعد.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Sidebar Tools */}
            <div className="w-full lg:w-80 space-y-6">
                {/* Publish Settings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-gray-500" />
                        إعدادات النشر
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">القسم</label>
                            <select
                                required
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full h-11 px-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 outline-none"
                            >
                                <option value="">اختر القسم...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer" onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}>
                            <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_published ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.is_published ? 'right-7' : 'right-1'}`} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">منشور للعامة</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-6 h-12 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "جاري الحفظ..." : (isEditing ? "تحديث المقال" : "نشر المقال")}
                    </button>
                </div>

                {/* SEO Helper */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-800">
                        <Sparkles size={20} />
                        مساعد SEO الذكي
                    </h3>

                    <div className="space-y-3">
                        {seoSuggestions.map((s, i) => (
                            <div key={i} className="flex gap-2 text-sm text-purple-700 leading-snug">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>{s}</p>
                            </div>
                        ))}
                        {seoSuggestions.length === 0 && (
                            <div className="flex gap-2 text-sm text-green-700 font-bold">
                                <CheckCircle2 size={16} />
                                <p>مقالك جاهز لتصدر نتائج البحث!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
