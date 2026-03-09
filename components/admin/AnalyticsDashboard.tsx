"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Smartphone, Monitor, Tablet, Globe } from 'lucide-react';

type AnalyticsDashboardProps = {
    trafficSources: { source: string, count: number }[];
    deviceUsage: { device: string, count: number }[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AnalyticsDashboard({ trafficSources, deviceUsage }: AnalyticsDashboardProps) {
    // Transform device data for Pie Chart
    const deviceData = deviceUsage.map(d => ({
        name: d.device === 'desktop' ? 'كمبيوتر' : d.device === 'mobile' ? 'جوال' : 'تابلت',
        value: d.count,
        icon: d.device === 'desktop' ? Monitor : d.device === 'mobile' ? Smartphone : Tablet
    }));

    // Calculate total for percentages
    const totalDevices = deviceData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Traffic Sources */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                        <Globe size={20} />
                    </div>
                    <h3 className="font-black text-foreground">مصادر الزيارات</h3>
                </div>

                <div className="h-[300px] w-full" dir="ltr">
                    {trafficSources.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficSources} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="source"
                                    type="category"
                                    width={100}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {trafficSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-bold opacity-60">
                            لا توجد بيانات كافية
                        </div>
                    )}
                </div>
            </div>

            {/* Device Usage */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">
                        <Smartphone size={20} />
                    </div>
                    <h3 className="font-black text-foreground">الأجهزة المستخدمة</h3>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="h-[200px] w-[200px] relative">
                        {deviceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center rounded-full border-4 border-muted border-dashed">
                                <span className="text-xs text-muted-foreground font-bold">لا بيانات</span>
                            </div>
                        )}
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-foreground">{totalDevices}</span>
                            <span className="text-xs text-muted-foreground font-bold">زائر</span>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="flex-1 space-y-3 w-full">
                        {deviceData.map((device, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                                        <device.icon size={14} className="text-muted-foreground" />
                                        {device.name}
                                    </div>
                                </div>
                                <span className="text-sm font-black text-muted-foreground">
                                    {Math.round((device.value / totalDevices) * 100) || 0}%
                                </span>
                            </div>
                        ))}
                        {deviceData.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm font-bold opacity-60 py-4">
                                بانتظار البيانات...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
