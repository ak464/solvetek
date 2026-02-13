"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3 } from 'lucide-react';

export function AnalyticsChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                    <BarChart3 size={32} />
                </div>
                <h3 className="text-lg font-black text-[#003366] mb-1">لا توجد بيانات تحليلية</h3>
                <p className="text-sm font-bold text-gray-400 max-w-xs">
                    سيتم عرض المخطط البياني هنا بمجرد تجميع بيانات الزيارات الكافية للموقع.
                </p>
            </div>
        );
    }

    return (
        <div className="h-[400px] w-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-black text-[#003366]">نمو الزيارات</h3>
                    <p className="text-sm font-bold text-gray-400">إحصائيات الزيارات خلال الأيام الماضية</p>
                </div>
                <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-lg p-2">
                    <option>آخر 30 يوم</option>
                    <option>آخر 7 أيام</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontFamily: 'var(--font-tajawal)', fontWeight: 'bold', color: '#003366' }}
                    />
                    <CartesianGrid vertical={false} stroke="#f3f4f6" />
                    <Area
                        type="monotone"
                        dataKey="page_views"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPv)"
                        name="مشاهدات الصفحة"
                    />
                    <Area
                        type="monotone"
                        dataKey="unique_visitors"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={0}
                        fill="transparent"
                        name="زوار فريدين"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
