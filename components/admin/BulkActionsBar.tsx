"use client";

import { useState } from 'react';
import { Trash2, Eye, EyeOff, FolderInput, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BulkActionsBarProps = {
    selectedCount: number;
    onClearSelection: () => void;
    selectedIds: number[];
    categories: Array<{ id: number; name_ar: string }>;
};

export function BulkActionsBar({ selectedCount, onClearSelection, selectedIds, categories }: BulkActionsBarProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    if (selectedCount === 0) return null;

    const handleBulkPublish = async () => {
        if (!confirm(`هل أنت متأكد من نشر ${selectedCount} مقال؟`)) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/articles/bulk-publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: selectedIds }),
            });

            if (res.ok) {
                alert(`تم نشر ${selectedCount} مقال بنجاح!`);
                router.refresh();
                onClearSelection();
            } else {
                alert('حدث خطأ أثناء النشر');
            }
        } catch (error) {
            alert('حدث خطأ أثناء النشر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkUnpublish = async () => {
        if (!confirm(`هل أنت متأكد من إلغاء نشر ${selectedCount} مقال؟`)) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/articles/bulk-unpublish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: selectedIds }),
            });

            if (res.ok) {
                alert(`تم إلغاء نشر ${selectedCount} مقال بنجاح!`);
                router.refresh();
                onClearSelection();
            } else {
                alert('حدث خطأ أثناء إلغاء النشر');
            }
        } catch (error) {
            alert('حدث خطأ أثناء إلغاء النشر');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`⚠️ تحذير: هل أنت متأكد من حذف ${selectedCount} مقال؟\n\nهذا الإجراء لا يمكن التراجع عنه!`)) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/articles/bulk-delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: selectedIds }),
            });

            if (res.ok) {
                alert(`تم حذف ${selectedCount} مقال بنجاح!`);
                router.refresh();
                onClearSelection();
            } else {
                alert('حدث خطأ أثناء الحذف');
            }
        } catch (error) {
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkChangeCategory = async () => {
        if (!selectedCategory) {
            alert('الرجاء اختيار قسم');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/articles/bulk-update-category', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: selectedIds, categoryId: selectedCategory }),
            });

            if (res.ok) {
                alert(`تم نقل ${selectedCount} مقال إلى القسم الجديد!`);
                router.refresh();
                onClearSelection();
                setShowCategoryModal(false);
            } else {
                alert('حدث خطأ أثناء نقل المقالات');
            }
        } catch (error) {
            alert('حدث خطأ أثناء نقل المقالات');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-2xl shadow-2xl p-4 z-50 animate-slide-up">
                <div className="flex items-center gap-4">
                    {/* Counter */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-xl">
                        <span className="font-black text-lg">{selectedCount}</span>
                        <span className="text-sm font-medium">محدد</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkPublish}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Eye size={16} />
                            نشر
                        </button>

                        <button
                            onClick={handleBulkUnpublish}
                            disabled={isLoading}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <EyeOff size={16} />
                            إلغاء نشر
                        </button>

                        <button
                            onClick={() => setShowCategoryModal(true)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <FolderInput size={16} />
                            نقل لقسم
                        </button>

                        <button
                            onClick={handleBulkDelete}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            حذف
                        </button>
                    </div>

                    {/* Clear Selection */}
                    <button
                        onClick={onClearSelection}
                        className="px-3 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                        title="إلغاء التحديد"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowCategoryModal(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-black mb-4">نقل إلى قسم</h3>
                        <p className="text-gray-600 mb-6">اختر القسم الذي تريد نقل {selectedCount} مقال إليه:</p>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-6 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">اختر قسم...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name_ar}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-3">
                            <button
                                onClick={handleBulkChangeCategory}
                                disabled={!selectedCategory || isLoading}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                نقل
                            </button>
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
