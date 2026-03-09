"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Globe, Share2, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";

export default function AdminSettingsPage() {
    const supabase = createClient();
    const { settings: initialSettings, loading: initialLoading } = useSiteSettings();

    // We keep local state for formatting/editing
    const [formData, setFormData] = useState<SiteSettings>(initialSettings);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Sync when initialSettings load
    useEffect(() => {
        if (!initialLoading) {
            setFormData(initialSettings);
        }
    }, [initialSettings, initialLoading]);

    const handleSave = async () => {
        setSaving(true);
        setSavedSuccess(false);

        // Prepare simple Key-Value array
        const updates = Object.entries(formData).map(([key, value]) => ({
            key,
            value: String(value),
            updated_at: new Date().toISOString()
        }));

        // Upsert one by one or in batch (Supabase supports batch upsert)
        const { error } = await supabase
            .from('site_settings')
            .upsert(updates, { onConflict: 'key' });

        if (error) {
            alert("فشل الحفظ: " + error.message);
        } else {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }
        setSaving(false);
    };

    if (initialLoading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-primary">لوحة التحكم الرئيسية</h1>
                    <p className="text-muted-foreground font-bold mt-1">التحكم الكامل في هوية الموقع، التواصل، والنظام.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black hover:opacity-90 transition shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </div>

            {savedSuccess && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={24} />
                    <span className="font-bold">تم حفظ الإعدادات بنجاح! قد تحتاج لتحديث الصفحة لرؤية بعض التغييرات.</span>
                </div>
            )}

            <div className="space-y-8">
                {/* 1. General Info */}
                <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-3 text-primary mb-6 relative z-10">
                        <Globe size={24} />
                        <h3 className="text-xl font-black">معلومات الهوية و SEO</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground mb-2">اسم الموقع (يظهر في الواجهة)</label>
                            <input
                                type="text"
                                value={formData.site_name_display}
                                onChange={e => setFormData({ ...formData, site_name_display: e.target.value })}
                                className="w-full h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="مثال: SolveTek"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">
                                📍 يظهر في: <span className="text-primary font-black">الـ Header • الـ Footer • داخل الموقع</span>
                            </p>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground mb-2">اسم الموقع (للبحث والـ SEO)</label>
                            <input
                                type="text"
                                value={formData.site_name}
                                onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                                className="w-full h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="مثال: SolveTek السعودي - دليل الحلول التقنية"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">
                                📍 يظهر في: <span className="text-primary font-black">تبويب المتصفح • نتائج البحث (Google) • المشاركات (Twitter, Facebook)</span>
                            </p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-muted-foreground mb-2">البريد الإلكتروني للدعم</label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                                className="w-full h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="support@solvetek.com"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground mb-2">وصف الموقع (Meta Description)</label>
                            <textarea
                                value={formData.site_description}
                                onChange={e => setFormData({ ...formData, site_description: e.target.value })}
                                rows={3}
                                className="w-full p-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                placeholder="وصف قصير يظهر في محركات البحث..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-muted-foreground mb-2">الكلمات المفتاحية (Keywords)</label>
                            <input
                                type="text"
                                value={formData.site_keywords}
                                onChange={e => setFormData({ ...formData, site_keywords: e.target.value })}
                                className="w-full h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="تقنية, شروحات, صيانة..."
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Social Media */}
                <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-3 text-primary mb-6 relative z-10 justify-between">
                        <div className="flex items-center gap-3">
                            <Share2 size={24} />
                            <h3 className="text-xl font-black">روابط التواصل الاجتماعي</h3>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-1 rounded-lg border border-border hover:bg-accent transition-colors">
                            <span className="text-xs font-bold text-muted-foreground">إظهار الصندوق في الموقع</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.show_social_box ? 'bg-primary' : 'bg-muted'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFormData({ ...formData, show_social_box: !formData.show_social_box });
                                }}>
                                <div className={`w-3 h-3 bg-background rounded-full absolute top-0.5 transition-all shadow-sm ${formData.show_social_box ? 'right-4' : 'right-0.5'}`} />
                            </div>
                        </label>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs">X</span>
                            </div>
                            <input
                                type="text"
                                value={formData.social_twitter}
                                onChange={e => setFormData({ ...formData, social_twitter: e.target.value })}
                                className="flex-1 h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                placeholder="رابط حساب تويتر (X)..."
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs">F</span>
                            </div>
                            <input
                                type="text"
                                value={formData.social_facebook}
                                onChange={e => setFormData({ ...formData, social_facebook: e.target.value })}
                                className="flex-1 h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                placeholder="رابط صفحة فيسبوك..."
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 to-purple-600 text-white flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs">IG</span>
                            </div>
                            <input
                                type="text"
                                value={formData.social_instagram}
                                onChange={e => setFormData({ ...formData, social_instagram: e.target.value })}
                                className="flex-1 h-12 px-4 bg-muted border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-primary outline-none"
                                placeholder="رابط حساب انستقرام..."
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Danger Zone / System */}
                <div className="bg-destructive/10 p-8 rounded-[2rem] border border-destructive/20 shadow-sm relative overflow-hidden transition-colors">
                    <div className="flex items-center gap-3 text-red-600 mb-6 relative z-10">
                        <AlertTriangle size={24} />
                        <h3 className="text-xl font-black">إعدادات النظام (منطقة خطرة)</h3>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-destructive/20 flex items-center justify-between transition-colors">
                        <div>
                            <h4 className="font-bold text-foreground text-lg">وضع الصيانة (Maintenance Mode)</h4>
                            <p className="text-sm text-muted-foreground font-bold mt-1">عند تفعيله، سيتم إخفاء الموقع عن جميع الزوار ما عدا المشرفين.</p>
                        </div>

                        <div
                            onClick={() => setFormData({ ...formData, maintenance_mode: !formData.maintenance_mode })}
                            className={`w-14 h-8 rounded-full cursor-pointer transition-colors relative ${formData.maintenance_mode ? 'bg-destructive' : 'bg-muted'}`}
                        >
                            <div className={`w-6 h-6 bg-background rounded-full absolute top-1 transition-all shadow-sm ${formData.maintenance_mode ? 'right-7' : 'right-1'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
