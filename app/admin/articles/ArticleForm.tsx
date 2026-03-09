"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Save, Layout, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function ArticleForm({ initialData, isEditing = false }: ArticleFormProps) {
    const supabase = createClient();
    const router = useRouter();

    // States
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [categoryId, setCategoryId] = useState<number | null>(initialData?.category_id || null);
    const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
    const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");
    const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords || "");
    const [isSlugEditedManually, setIsSlugEditedManually] = useState(isEditing);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch Categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("categories").select("id, name_ar");
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    // ✅ دالة توليد الرابط (Slug Generator)
    const generateSlug = (text: string) => {
        const arabicToEnglish: Record<string, string> = {
            'أ': 'a', 'إ': 'e', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
            'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
            'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
            'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
            'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': 'a', 'ئ': 'e', 'ؤ': 'o',
            'لا': 'la'
        };

        let s = text.trim().toLowerCase();

        // 1. تحويل الحروف العربية
        s = s.split('').map(char => arabicToEnglish[char] || char).join('');

        // 2. التنظيف (إبقاء الحروف الإنجليزية، الأرقام، والشرطات فقط)
        s = s.replace(/[^a-z0-9\s-]/g, '') // حذف الرموز الخاصة
            .replace(/\s+/g, '-')         // استبدال المسافات بشرطات
            .replace(/-+/g, '-')          // منع تكرار الشرطات
            .replace(/^-+|-+$/g, '');     // حذف الشرطات من البداية والنهاية

        return s;
    };

    // ✅ مراقبة العنوان لتحديث الرابط تلقائياً
    useEffect(() => {
        if (!isSlugEditedManually && !isEditing) {
            setSlug(generateSlug(title));
        }
    }, [title, isSlugEditedManually, isEditing]);

    const handleSubmit = async (isPublished: boolean = true) => {
        if (!title || !slug || !content || !categoryId) {
            alert("يرجى تعبئة جميع الحقول الأساسية (العنوان، الرابط، المحتوى، التصنيف)");
            return;
        }

        setLoading(true);

        const articleData = {
            title,
            slug,
            content,
            category_id: categoryId,
            featured_image: featuredImage,
            excerpt,
            meta_title: metaTitle,
            meta_description: metaDescription,
            meta_keywords: metaKeywords,
            is_published: isPublished,
            updated_at: new Date().toISOString(),
        };

        let error;

        if (isEditing && initialData?.id) {
            // Update existing article
            const { error: updateError } = await supabase
                .from("articles")
                .update(articleData)
                .eq("id", initialData.id);
            error = updateError;
        } else {
            // Insert new article
            const { error: insertError } = await supabase
                .from("articles")
                .insert({
                    ...articleData,
                    created_at: new Date().toISOString(),
                });
            error = insertError;
        }

        setLoading(false);

        if (error) {
            alert("حدث خطأ أثناء الحفظ: " + error.message);
        } else {
            router.push("/admin/articles");
            router.refresh();
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#003366] dark:text-white">
                    {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                    >
                        حفظ مسودة
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? "جاري الحفظ..." : "نشر المقال"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان المقال</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="مثال: كيفية تسريع الانترنت في ويندوز 11"
                            className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold transition-colors"
                        />
                    </div>

                    {/* Slug Input (Auto-generated) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <LinkIcon size={16} />
                            رابط المقال (Slug)
                        </label>
                        <div className="flex items-center bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors">
                            <span className="px-4 py-3 text-gray-400 text-sm border-l dark:border-gray-800 bg-gray-100 dark:bg-[#111827] dir-ltr">/guides/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                    setIsSlugEditedManually(true);
                                }}
                                className="flex-1 p-3 bg-transparent outline-none text-gray-600 dark:text-gray-100 font-mono text-sm dir-ltr"
                            />
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">محتوى المقال</label>
                        <TipTapEditor content={content} onChange={setContent} />
                    </div>

                    {/* SEO Section */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#003366] dark:text-white flex items-center gap-2">
                            <Layout size={20} />
                            تحسين محركات البحث (SEO)
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">عنوان الميتا (Meta Title)</label>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder="اتركه فارغاً لاستخدام عنوان المقال"
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">وصف الميتا (Meta Description)</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">الكلمات المفتاحية (Keywords)</label>
                                <input
                                    type="text"
                                    value={metaKeywords}
                                    onChange={(e) => setMetaKeywords(e.target.value)}
                                    placeholder="مثال: ويندوز, انترنت, سرعة"
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Category */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#003366] dark:text-white flex items-center gap-2">
                            <Layout size={20} />
                            تصنيف المقال
                        </h3>
                        <select
                            value={categoryId || ""}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">اختر القسم...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#003366] dark:text-white flex items-center gap-2">
                            <Layout size={20} />
                            الصورة البارزة
                        </h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={featuredImage}
                                onChange={(e) => setFeaturedImage(e.target.value)}
                                placeholder="رابط الصورة (URL)"
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {featuredImage && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                    <img src={featuredImage} alt="Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                        <h3 className="font-bold text-[#003366] dark:text-white flex items-center gap-2">
                            <Layout size={20} />
                            مقتطف قصير
                        </h3>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={4}
                            placeholder="وصف مختصر يظهر في قائمة المقالات..."
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}