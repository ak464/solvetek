import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-blue-50 text-blue-600 rounded-full p-6 mb-6">
                <Search size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">عذراً، الصفحة غير موجودة</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                يبدو أنك وصلت إلى صفحة غير موجودة أو تم حذفها. يمكنك البحث عما تريد أو العودة للرئيسية.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    العودة للرئيسية
                </Link>
                <Link
                    href="/guides"
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                    تصفح الشروحات
                </Link>
            </div>
        </div>
    );
}
