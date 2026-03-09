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
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-l border-border hidden md:block flex-shrink-0 transition-colors duration-300">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
                    <ThemeToggle />
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin/dashboard" className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-80 transition-colors">
                        📊 لوحة المعلومات
                    </Link>
                    <Link href="/admin/articles" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        📝 المقالات
                    </Link>
                    <Link href="/admin/categories" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        📂 الأقسام
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        👥 المستخدمين
                    </Link>
                    <Link href="/admin/affiliate" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        💰 روابط الأفلييت
                    </Link>
                    <Link href="/admin/ads" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        📢 نظام الإعلانات
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg hover:text-foreground">
                        ⚙️ الإعدادات
                    </Link>

                    {/* Logout Button */}
                    <div className="pt-4 mt-4 border-t border-border">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto bg-background text-foreground transition-colors duration-300">
                {children}
            </main>
        </div>
    );
}
