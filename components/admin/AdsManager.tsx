"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Power, Layout, Monitor, ShieldAlert, AlertCircle } from 'lucide-react';

export function AdsManager() {
    const supabase = createClient();
    const [settings, setSettings] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        const { data } = await supabase
            .from('site_settings')
            .select('key, value')
            .like('key', 'ads_%');

        const newSettings: Record<string, boolean> = {
            ads_enabled: true,
            ads_header: true,
            ads_sidebar: true,
            ads_article_top: true,
            ads_article_middle: true,
            ads_article_bottom: true
        };

        if (data) {
            data.forEach(item => {
                newSettings[item.key] = item.value === 'true';
            });
        }

        setSettings(newSettings);
        setLoading(false);
    }

    async function toggleSetting(key: string) {
        setSaving(true);
        const oldValue = settings[key];
        const newValue = !oldValue;

        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: newValue }));

        // 1. Try to UPDATE first
        const { data: updatedData, error: updateError } = await supabase
            .from('site_settings')
            .update({
                value: newValue.toString(),
                updated_at: new Date().toISOString()
            })
            .eq('key', key)
            .select('id');

        let error = updateError;

        // 2. If no rows updated, try INSERT
        if (!error && (!updatedData || updatedData.length === 0)) {
            const { error: insertError } = await supabase
                .from('site_settings')
                .insert({
                    key: key,
                    value: newValue.toString(),
                    updated_at: new Date().toISOString()
                });
            error = insertError;
        }

        if (error) {
            console.error('Save failed detailed:', JSON.stringify(error, null, 2));
            alert(`فشل الحفظ في قاعدة البيانات!\nالسبب: ${error.message || JSON.stringify(error)}\nCode: ${error.code}\n\nالحل: يجب تشغيل كود الصلاحيات (SQL) في لوحة تحكم Supabase.`);
            // Revert on error
            setSettings(prev => ({ ...prev, [key]: oldValue }));
        }

        setSaving(false);
    }

    // Helper for toggle switch
    const Toggle = ({ cKey, label, desc }: { cKey: string, label: string, desc: string }) => (
        <div
            onClick={() => !saving && toggleSetting(cKey)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group hover:shadow-md ${settings[cKey] ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}
        >
            <div>
                <h4 className={`font-black text-sm mb-1 ${settings[cKey] ? 'text-[#003366]' : 'text-gray-400'}`}>{label}</h4>
                <p className="text-[10px] font-bold text-gray-400">{desc}</p>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings[cKey] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${settings[cKey] ? 'right-6' : 'right-1'}`} />
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-center text-gray-400 font-bold">جاري تحميل الإعدادات...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-2xl font-black text-[#003366]">ناظم الإعلانات (AdSense)</h2>
                <p className="text-gray-500 text-sm font-bold mt-1">التحكم المركزي في جميع الوحدات الإعلانية بالموقع.</p>
            </div>

            {/* Global Master Switch */}
            <div className={`rounded-[2rem] p-8 shadow-xl transition-all duration-500 ${settings.ads_enabled ? 'bg-green-600' : 'bg-red-500'}`}>
                <div className="text-white space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Power size={28} />
                            <h3 className="text-xl font-black">المفتاح الرئيسي</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black ${settings.ads_enabled ? 'bg-green-700' : 'bg-red-600'}`}>
                            {settings.ads_enabled ? '🟢 النظام يعمل' : '🔴 النظام متوقف'}
                        </div>
                    </div>

                    <p className="text-sm font-bold opacity-90 leading-relaxed">
                        {settings.ads_enabled
                            ? 'نظام الإعلانات نشط. يمكنك التحكم في أماكن الظهور بالتفصيل من الأسفل.'
                            : 'تم إيقاف جميع الإعلانات في الموقع بالكامل. لن تظهر أي وحدة إعلانية بغض النظر عن الإعدادات الأخرى.'}
                    </p>

                    <button
                        onClick={() => toggleSetting('ads_enabled')}
                        disabled={saving}
                        className={`w-full h-14 rounded-xl font-black text-base transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3 ${settings.ads_enabled
                            ? 'bg-white text-green-600 hover:bg-green-50'
                            : 'bg-white text-red-500 hover:bg-red-50'
                            }`}
                    >
                        <Power size={20} />
                        {saving ? 'جاري الحفظ...' : (settings.ads_enabled ? 'إيقاف النظام بالكامل' : 'تفعيل النظام')}
                    </button>
                </div>
            </div>

            {/* Placement Controls - Only show if enabled */}
            {settings.ads_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-[#003366] mb-4">
                            <Layout size={20} />
                            <h3 className="font-black">مواضع الصفحة العامة</h3>
                        </div>
                        <div className="space-y-4">
                            <Toggle cKey="ads_header" label="إعلان الهيدر (Header)" desc="يظهر في أعلى جميع الصفحات بجانب اللوجو." />
                            <Toggle cKey="ads_sidebar" label="الشريط الجانبي (Sidebar)" desc="يظهر في القائمة الجانبية للمقالات والأقسام." />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-[#003366] mb-4">
                            <Monitor size={20} />
                            <h3 className="font-black">مواضع داخل المقال</h3>
                        </div>
                        <div className="space-y-4">
                            <Toggle cKey="ads_article_top" label="بداية المقال" desc="يظهر بعد الفقرة الأولى مباشرة." />
                            <Toggle cKey="ads_article_middle" label="وسط المقال" desc="يظهر بين فقرات المحتوى." />
                            <Toggle cKey="ads_article_bottom" label="نهاية المقال" desc="يظهر بعد خاتمة المقال وقبل التعليقات." />
                        </div>
                    </div>
                </div>
            )}

            {/* Explanation / Help */}
            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 mb-4">
                    <AlertCircle size={20} />
                    <h3 className="font-black">كيف يعمل هذا النظام؟</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-xs font-bold text-gray-600 leading-relaxed marker:text-blue-500">
                    <li><span className="text-blue-700">المفتاح الرئيسي:</span> هو "قاطع كهرباء" رئيسي. إذا أطفأته، تنطفئ كل الإعلانات فوراً ولا يتم تحميل أكواد Google AdSense نهائياً (مما يسرع الموقع).</li>
                    <li><span className="text-blue-700">التحكم التفصيلي:</span> يمكنك اختيار أماكن محددة للإعلانات. مثلاً يمكنك تفعيل إعلانات الشريط الجانبي فقط وإلغاء إعلانات وسط المقال لزيادة راحة القراءة.</li>
                    <li><span className="text-blue-700">التحديث الفوري:</span> عند تغيير أي إعداد، يتم تحديث قاعدة البيانات فوراً، وسيلاحظ الزوار التغيير عند تحديث الصفحة (Refresh).</li>
                </ul>
            </div>
        </div>
    );
}
