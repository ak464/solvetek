import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { AlertTriangle } from "lucide-react";

export async function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // 1. Fetch Maintenance Setting & Current User in parallel
    const [settingsResult, authResult] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'maintenance_mode').single(),
        supabase.auth.getUser()
    ]);

    const isMaintenanceMode = settingsResult.data?.value === 'true';

    // If NOT in maintenance, render children immediately
    if (!isMaintenanceMode) {
        return <>{children}</>;
    }

    // If in maintenance, check if user is Admin
    const user = authResult.data.user;
    let isAdmin = false;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        isAdmin = profile?.role === 'admin';
    }

    // If Admin, render children (maybe with a banner?)
    if (isAdmin) {
        return (
            <>
                <div className="bg-red-600 text-white text-xs font-bold text-center py-1 fixed top-0 left-0 right-0 z-[9999]">
                    ⚠️ وضع الصيانة مفعل (أنت تراه لأنك مشرف)
                </div>
                {children}
            </>
        );
    }

    // Otherwise, show Maintenance Screen
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100 max-w-lg w-full">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
                    <AlertTriangle size={48} />
                </div>
                <h1 className="text-3xl font-black text-gray-800 mb-4">الموقع في وضع الصيانة</h1>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    نقوم حالياً ببعض التحديثات التقنية لتحسين تجربتكم.
                    <br />
                    سنعود للعمل قريباً جداً!
                </p>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400 font-bold">SolveTek 2026</p>
                </div>
            </div>

            {/* Login Link for Admins */}
            <a href="/login" className="mt-8 text-sm text-gray-400 hover:text-blue-600 font-bold transition-colors">
                تسجيل دخول المشرفين
            </a>
        </div>
    );
}
