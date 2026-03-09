import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Force dynamic rendering for admin panel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-gray-800 hidden md:block flex-shrink-0 transition-colors duration-300">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
                    <ThemeToggle />
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin/dashboard" className="block px-4 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors">
                        📊 لوحة المعلومات
                    </Link>
                    <Link href="/admin/articles" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        📝 المقالات
                    </Link>
                    <Link href="/admin/categories" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        📂 الأقسام
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        👥 المستخدمين
                    </Link>
                    <Link href="/admin/affiliate" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        💰 روابط الأفلييت
                    </Link>
                    <Link href="/admin/ads" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        📢 نظام الإعلانات
                    </Link>
                    <Link href="/admin/comments" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        💬 التعليقات
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-gray-900 dark:hover:text-white">
                        ⚙️ الإعدادات
                    </Link>

                    {/* Logout Button */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {children}
            </main>
        </div>
    );
}
