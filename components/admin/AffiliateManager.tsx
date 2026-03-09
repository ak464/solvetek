"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, ExternalLink, Activity, Save, X } from 'lucide-react';

export function AffiliateManager() {
    const supabase = createClient();
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<any>(null); // null or link data
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        setLoading(true);
        const { data } = await supabase.from('affiliate_links').select('*').order('created_at', { ascending: false });
        setLinks(data || []);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            url: formData.get('url'),
            store: formData.get('store'),
            status: formData.get('status') || 'active',
            is_recommended: formData.get('is_recommended') === 'on',
        };

        if (isEditing) {
            await supabase.from('affiliate_links').update(data).eq('id', isEditing.id);
        } else {
            await supabase.from('affiliate_links').insert([data]);
        }

        setIsEditing(null);
        setShowForm(false);
        fetchLinks();
    }

    async function deleteLink(id: number) {
        if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
            await supabase.from('affiliate_links').delete().eq('id', id);
            fetchLinks();
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-[#003366] dark:text-white">إدارة روابط الأفلييت</h2>
                    <p className="text-gray-500 text-sm font-bold mt-1">إدارة مركزية لجميع روابط التسويق بالعمولة في الموقع.</p>
                </div>
                <button
                    onClick={() => { setIsEditing(null); setShowForm(true); }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
                >
                    <Plus size={18} />
                    إضافة رابط جديد
                </button>
            </div>

            {/* Form Overlay */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-xl p-8 border border-gray-100 dark:border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#003366] dark:text-white">{isEditing ? 'تعديل رابط' : 'إضافة رابط جديد'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">اسم المنتج / الخدمة</label>
                                    <input name="name" defaultValue={isEditing?.name} required className="w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-colors" placeholder="مثلاً: راوتر TP-Link" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">الرابط (Affiliate URL)</label>
                                    <input name="url" defaultValue={isEditing?.url} required className="w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-colors" placeholder="https://amazon.sa/..." />
                                    <p className="text-[10px] text-gray-400 font-bold">💡 يُفضل إدخال الرابط الكامل مع https:// (مثل: https://www.google.com أو amazon.sa)</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">المتجر</label>
                                        <select name="store" defaultValue={isEditing?.store || 'amazon'} className="w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-colors">
                                            <option value="amazon">أمازون</option>
                                            <option value="noon">نون</option>
                                            <option value="aliexpress">علي إكسبريس</option>
                                            <option value="other">أخرى</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">الخيارات</label>
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <input type="checkbox" name="is_recommended" defaultChecked={isEditing?.is_recommended} className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">عرض في "توصية اليوم" في القائمة الجانبية</span>
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">وصف قصير (اختياري)</label>
                                <textarea name="description" defaultValue={isEditing?.description} className="w-full h-24 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none transition-colors" />
                            </div>


                            <button type="submit" className="w-full h-14 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Save size={18} />
                                {isEditing ? 'تحديث البيانات' : 'حفظ الرابط'}
                            </button>
                        </form>
                    </div>
                </div >
            )
            }

            {/* List Table */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-900/5 overflow-hidden transition-colors">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الاسم</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المتجر</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">النقرات</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {loading ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold">جاري التحميل...</td></tr>
                        ) : links.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold">لا توجد روابط مسجلة حالياً.</td></tr>
                        ) : links.map((link) => (
                            <tr key={link.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-black text-[#003366] dark:text-blue-100 flex items-center gap-2">
                                        {link.name}
                                        {link.is_recommended && <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">⭐ موصى به</span>}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 font-bold truncate max-w-[200px]">{link.url}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[11px] font-black px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 uppercase">{link.store}</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center gap-2 font-black text-blue-600">
                                        <Activity size={14} />
                                        {link.clicks_count}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${link.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                        {link.status === 'active' ? 'نشط' : 'متوقف'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setIsEditing(link); setShowForm(true); }} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <a href={link.url} target="_blank" className="p-2 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <ExternalLink size={16} />
                                        </a>
                                        <button onClick={() => deleteLink(link.id)} className="p-2 text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
