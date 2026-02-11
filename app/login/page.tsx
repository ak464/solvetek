"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAction = async (type: 'login' | 'signup') => {
        setLoading(true);

        if (type === 'login') {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });
            if (error) alert(error.message);
            else router.push("/admin/dashboard");
        } else {
            const { error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        username: email.split('@')[0], // Default username
                    }
                }
            });
            if (error) alert(error.message);
            else alert("تم إنشاء الحساب! يرجى تأكيد البريد الإلكتروني (أو تفحص Supabase).");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    تسجيل الدخول للمشرفين
                </h1>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAction('login');
                            }}
                            disabled={loading}
                            className="flex-1 h-11 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "جاري..." : "دخول"}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAction('signup');
                            }}
                            disabled={loading}
                            className="flex-1 h-11 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            تسجيل جديد
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
