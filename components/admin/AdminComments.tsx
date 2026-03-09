"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, Trash, AlertCircle, Loader2, Settings, CheckSquare, Square, X } from 'lucide-react';
import Link from 'next/link';

type Comment = {
    id: number;
    name: string;
    email: string;
    content: string;
    created_at: string;
    is_approved: boolean;
    article: {
        title: string;
        slug: string;
        category: {
            slug: string;
        }
    };
};

export function AdminComments({ initialComments }: { initialComments: any[] }) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [requireApproval, setRequireApproval] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const supabase = createClient();

    // Fetch Settings on Mount
    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'comments_require_approval')
                .single();

            if (data) {
                setRequireApproval(data.value === 'true');
            }
            setLoadingSettings(false);
        };
        fetchSettings();
    }, []);

    // Toggle Global Setting
    const toggleRequireApproval = async () => {
        const newValue = !requireApproval;
        setRequireApproval(newValue); // Optimistic update

        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'comments_require_approval', value: String(newValue) }, { onConflict: 'key' });

        if (error) {
            console.error("Failed to update setting", error);
            setRequireApproval(!newValue); // Revert
            alert("فشل تحديث الإعداد");
        }
    };

    // Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.length === comments.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(comments.map(c => c.id));
        }
    };

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Actions
    const handleApprove = async (id: number) => {
        setComments(comments.map(c => c.id === id ? { ...c, is_approved: true } : c));
        await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
        setComments(comments.filter(c => c.id !== id));
        await supabase.from('comments').delete().eq('id', id);
    };

    // Bulk Actions
    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        setActionLoading(true);

        const { error } = await supabase
            .from('comments')
            .update({ is_approved: true })
            .in('id', selectedIds);

        if (!error) {
            setComments(comments.map(c => selectedIds.includes(c.id) ? { ...c, is_approved: true } : c));
            setSelectedIds([]);
        }
        setActionLoading(false);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`هل أنت متأكد من حذف ${selectedIds.length} تعليق؟`)) return;

        setActionLoading(true);

        const { error } = await supabase
            .from('comments')
            .delete()
            .in('id', selectedIds);

        if (!error) {
            setComments(comments.filter(c => !selectedIds.includes(c.id)));
            setSelectedIds([]);
        }
        setActionLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="bg-card p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-4">

                {/* Global Setting Toggle */}
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${requireApproval ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        <Settings size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">نظام الموافقة</p>
                        <p className="text-xs text-muted-foreground">
                            {loadingSettings ? 'جاري التحميل...' : (requireApproval ? 'الموافقة اليدوية مطلوبة' : 'نشر فوري (آلي)')}
                        </p>
                    </div>
                    <button
                        onClick={toggleRequireApproval}
                        disabled={loadingSettings}
                        className={`w-12 h-6 rounded-full relative transition-colors ${requireApproval ? 'bg-orange-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${requireApproval ? 'left-1' : 'right-1'}`} />
                    </button>
                </div>

                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-bold text-muted-foreground ml-2">تم تحديد {selectedIds.length}</span>
                        <button
                            onClick={handleBulkApprove}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xs"
                        >
                            <Check size={14} /> قبول الكل
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xs"
                        >
                            <Trash size={14} /> حذف الكل
                        </button>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                            <tr>
                                <th className="px-6 py-4 w-[50px]">
                                    <button onClick={toggleSelectAll} className="flex items-center justify-center text-muted-foreground hover:text-foreground">
                                        {selectedIds.length === comments.length && comments.length > 0 ? (
                                            <CheckSquare size={18} />
                                        ) : (
                                            <Square size={18} />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-bold">الاسم</th>
                                <th className="px-6 py-4 font-bold">التعليق</th>
                                <th className="px-6 py-4 font-bold">المقال</th>
                                <th className="px-6 py-4 font-bold">التاريخ</th>
                                <th className="px-6 py-4 font-bold">الحالة</th>
                                <th className="px-6 py-4 font-bold">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {comments.map((comment) => (
                                <tr key={comment.id} className={`transition-colors ${selectedIds.includes(comment.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(comment.id)} className={`flex items-center justify-center ${selectedIds.includes(comment.id) ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {selectedIds.includes(comment.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground">{comment.name}</div>
                                        <div className="text-xs text-muted-foreground">{comment.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-foreground max-w-xs truncate" title={comment.content}>
                                            {comment.content}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/guides/${comment.article?.category?.slug}/${comment.article?.slug}`}
                                            target="_blank"
                                            className="text-primary text-sm font-bold hover:underline max-w-[150px] truncate block"
                                        >
                                            {comment.article?.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-black ${comment.is_approved
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                            {comment.is_approved ? 'مقبول' : 'قيد المراجعة'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {!comment.is_approved && (
                                            <button
                                                onClick={() => handleApprove(comment.id)}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors"
                                                title="قبول"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                                            title="حذف"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {comments.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-bold">
                                        لا توجد تعليقات حتى الآن.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
