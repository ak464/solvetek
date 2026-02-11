import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export const metadata = {
    title: 'الأدوات التقنية | SolveTek',
    description: 'مجموعة من الأدوات التقنية التفاعلية لمساعدتك في اتخاذ أفضل القرارات التقنية في السعودية.',
};

export default function ToolsPage() {
    return (
        <main className="min-h-screen pb-32">
            {/* Header Area */}
            <div className="bg-white border-b border-gray-100 relative overflow-hidden pt-12 pb-24">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-12 relative z-10">
                    <div className="mb-12">
                        <Breadcrumbs items={[{ label: 'الأدوات التقنية', href: '/tools' }]} />
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-50 text-blue-700 text-[12px] font-black tracking-widest uppercase border border-blue-100 mb-8">
                            <Terminal size={16} />
                            أدوات سولفتيك الذكية
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-black leading-tight font-heading tracking-tighter mb-6">
                            قراراتك التقنية.. <span className="text-blue-600">أسهل</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                            دليل متكامل من الأدوات التفاعلية لمساعدتك في الحصول على أفضل الحلول التقنية وتحسين تجربتك الرقمية.
                        </p>
                    </div>
                    {/* Bg Decoration */}
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* Tools Section */}
            <section className="py-24">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Tools Feed (70%) */}
                        <div className="lg:col-span-8 space-y-20">

                            {/* Future Tools Placeholders */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center text-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="font-black text-gray-400">فحص الضمان والأصالة</h3>
                                    <p className="text-xs font-bold text-gray-300">قريباً: تأكد من حالة ضمان جهازك وهل هو موجه للشرق الأوسط عبر الـ IMEI.</p>
                                </div>
                                <div className="p-10 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center text-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Sparkles size={32} />
                                    </div>
                                    <h3 className="font-black text-gray-400">فحص سرعة الإنترنت</h3>
                                    <p className="text-xs font-bold text-gray-300">قريباً: اختبر سرعة الاتصال الحقيقية لشبكات 5G في منطقتك.</p>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar (30%) */}
                        <div className="lg:col-span-4">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
