import { ArticleForm } from "@/components/features/admin/ArticleForm";

export default function NewArticlePage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-black text-gray-900 border-r-4 border-blue-600 pr-4 mb-2">إضافة مقال جديد</h1>
                <p className="text-gray-500 pr-5">قم بكتابة محتوى احترافي ومحسن لمحركات البحث.</p>
            </div>
            <ArticleForm />
        </div>
    );
}
