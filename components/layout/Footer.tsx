import Link from "next/link";

import { Category } from "@/lib/types/database";

export function Footer({ categories = [], siteName = "SolveTek" }: { categories?: Category[], siteName?: string }) {
    // Top 8 categories for footer to avoid overcrowding
    const footerCategories = categories.slice(0, 8);

    return (
        <footer className="bg-gray-900 text-white pt-20 border-t border-gray-800">

            <div className="mx-auto max-w-[1600px] px-6 py-12 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-bold mb-4 text-white">{siteName}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            منصتك الأولى لحل المشاكل التقنية في السعودية. نقدم شروحات مبسطة للجوال، الانترنت، والخدمات الحكومية الرقمية من {siteName}.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link></li>
                            {footerCategories.map(cat => (
                                <li key={cat.id}>
                                    <Link href={`/guides/${cat.slug}`} className="hover:text-blue-400 transition-colors">
                                        {cat.name_ar}
                                    </Link>
                                </li>
                            ))}
                            <li><Link href="/guides" className="hover:text-blue-400 transition-colors">جميع الأقسام</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">قانوني</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">شروط الاستخدام</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SolveTek. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
