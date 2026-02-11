"use client";

import { useState } from 'react';
import Link from 'next/link';
import { DeleteArticleButton } from "@/components/features/admin/DeleteArticleButton";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";

type Article = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    views_count: number;
    featured_image?: string;
    created_at: string;
    updated_at: string;
    category: {
        name_ar: string;
        slug: string;
    } | null;
    author: {
        username: string;
    } | null;
};

type ArticlesTableClientProps = {
    articles: Article[];
    categories: Array<{ id: number; name_ar: string }>;
};

export function ArticlesTableClient({ articles, categories }: ArticlesTableClientProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === articles.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(articles.map(a => a.id));
        }
    };

    const clearSelection = () => setSelectedIds([]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'اليوم';
        if (diffInDays === 1) return 'أمس';
        if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
        if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
        if (diffInDays < 365) return `منذ ${Math.floor(diffInDays / 30)} أشهر`;
        return `منذ ${Math.floor(diffInDays / 365)} سنة`;
    };

    return (
        <>
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-bold w-12">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === articles.length && articles.length > 0}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </th>
                        <th className="px-6 py-4 font-bold w-16"></th>
                        <th className="px-6 py-4 font-bold">العنوان</th>
                        <th className="px-6 py-4 font-bold">القسم</th>
                        <th className="px-6 py-4 font-bold">الكاتب</th>
                        <th className="px-6 py-4 font-bold">الحالة</th>
                        <th className="px-6 py-4 font-bold">المشاهدات</th>
                        <th className="px-6 py-4 font-bold">آخر تحديث</th>
                        <th className="px-6 py-4 font-bold">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {articles.map((article) => (
                        <tr key={article.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(article.id) ? 'bg-blue-50' : ''}`}>
                            <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(article.id)}
                                    onChange={() => toggleSelect(article.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </td>
                            <td className="px-6 py-4">
                                {article.featured_image ? (
                                    <img
                                        src={article.featured_image}
                                        alt={article.title}
                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                        <span className="text-gray-400 text-xs font-bold">لا صورة</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="max-w-xs">
                                    <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">أنشئ {formatDate(article.created_at)}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-blue-600 font-bold">{article.category?.name_ar || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{article.author?.username || 'غير معروف'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${article.is_published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {article.is_published ? "منشور" : "مسودة"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-bold">{article.views_count || 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <span title={article.updated_at}>
                                    {formatDate(article.updated_at)}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex gap-4 text-sm items-center">
                                <Link href={`/admin/articles/${article.id}`} className="text-blue-600 hover:underline font-bold">تعديل</Link>
                                {article.category ? (
                                    <a href={`/guides/${article.category.slug}/${article.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600 font-bold">عرض</a>
                                ) : (
                                    <span className="text-gray-300 cursor-not-allowed" title="لا يوجد قسم">عرض</span>
                                )}
                                <DeleteArticleButton articleId={article.id} />
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                لا توجد مقالات تطابق معايير البحث.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <BulkActionsBar
                selectedCount={selectedIds.length}
                onClearSelection={clearSelection}
                selectedIds={selectedIds}
                categories={categories}
            />
        </>
    );
}
