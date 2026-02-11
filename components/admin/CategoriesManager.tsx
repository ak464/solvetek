"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { IconPicker } from './IconPicker';
import { CATEGORY_ICONS } from '@/lib/config/icons';

export function CategoriesManager() {
    const supabase = createClient();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('default');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true }); // Fallback sorting
        setCategories(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name_ar: formData.get('name_ar'),
            name_en: formData.get('name_en'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            icon_name: selectedIcon,
            sort_order: parseInt(formData.get('sort_order') as string) || 0,
            is_hidden: formData.get('is_hidden') === 'on',
        };

        try {
            if (isEditing) {
                const { error } = await supabase.from('categories').update(data).eq('id', isEditing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('categories').insert([data]);
                if (error) throw error;
            }

            setIsEditing(null);
            setShowForm(false);
            fetchCategories();
        } catch (error: any) {
            alert(`حدث خطأ: ${error.message || error.details || JSON.stringify(error)}`);
            console.error(error);
        }
    };

    const deleteCategory = async (id: number) => {
        if (confirm('تنبيه هام: حذف القسم قد يؤثر على المقالات المرتبطة به. هل أنت متأكد؟')) {
            await supabase.from('categories').delete().eq('id', id);
            fetchCategories();
        }
    };

    const toggleVisibility = async (id: number, currentHidden: boolean) => {
        await supabase.from('categories').update({ is_hidden: !currentHidden }).eq('id', id);
        fetchCategories();
    };

    const openEdit = (cat: any) => {
        setIsEditing(cat);
        setSelectedIcon(cat.icon_name || 'default');
        setShowForm(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-[#003366]">إدارة الأقسام</h2>
                    <p className="text-gray-500 text-sm font-bold mt-1">إضافة وتعديل وترتيب أقسام الموقع.</p>
                </div>
                <button
                    onClick={() => { setIsEditing(null); setSelectedIcon('default'); setShowForm(true); }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
                >
                    <Plus size={18} />
                    إضافة قسم جديد
                </button>
            </div>

            {/* Form Overlay */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#003366]">{isEditing ? 'تعديل قسم' : 'إضافة قسم جديد'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">الاسم بالعربية</label>
                                    <input name="name_ar" defaultValue={isEditing?.name_ar} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" placeholder="مثلاً: شروحات تقنية" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">الاسم بالإنجليزية</label>
                                    <input name="name_en" defaultValue={isEditing?.name_en} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g. Tech Guides" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">الرابط (Slug)</label>
                                    <input name="slug" defaultValue={isEditing?.slug} required className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" placeholder="tech-guides" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">الترتيب</label>
                                    <input type="number" name="sort_order" defaultValue={isEditing?.sort_order || 0} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase">خيارات العرض</label>
                                <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input type="checkbox" name="is_hidden" defaultChecked={isEditing?.is_hidden} className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-bold text-gray-600">إخفاء هذا القسم من القائمة والفوتر</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase">وصف القسم (SEO)</label>
                                <textarea name="description" defaultValue={isEditing?.description} className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none resize-none" />
                            </div>

                            <button type="submit" className="w-full h-14 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Save size={18} />
                                {isEditing ? 'حفظ التغييرات' : 'إضافة القسم'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">الترتيب</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">القسم</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المعرف (Slug)</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold">جاري التحميل...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold">لم تتم إضافة أي أقسام بعد.</td></tr>
                        ) : categories.map((cat) => {
                            const Icon = CATEGORY_ICONS[cat.icon_name] || CATEGORY_ICONS.default;
                            return (
                                <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-gray-400 font-black">
                                            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                                                {cat.sort_order}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className="font-black text-[#003366] text-lg">{cat.name_ar}</div>
                                                <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">{cat.name_en}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="text-[11px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{cat.slug}</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => toggleVisibility(cat.id, cat.is_hidden)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${!cat.is_hidden ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {!cat.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                            {!cat.is_hidden ? 'ظاهر' : 'مخفي'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
