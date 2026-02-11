import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";

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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l border-gray-200 hidden md:block flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-blue-600">لوحة التحكم</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">
                        📊 لوحة المعلومات
                    </Link>
                    <Link href="/admin/articles" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        📝 المقالات
                    </Link>
                    <Link href="/admin/categories" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        📂 الأقسام
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        👥 المستخدمين
                    </Link>
                    <Link href="/admin/affiliate" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        💰 روابط الأفلييت
                    </Link>
                    <Link href="/admin/ads" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        📢 نظام الإعلانات
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                        ⚙️ الإعدادات
                    </Link>

                    {/* Logout Button */}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
