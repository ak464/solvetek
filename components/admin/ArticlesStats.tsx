import { FileText, Eye, FileEdit, TrendingUp } from 'lucide-react';

type ArticlesStatsProps = {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
};

export function ArticlesStats({ total, published, drafts, totalViews }: ArticlesStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Total Articles */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <FileText size={24} className="opacity-80" />
                    <span className="text-3xl font-black">{total}</span>
                </div>
                <p className="text-blue-100 text-sm font-bold">إجمالي المقالات</p>
            </div>

            {/* Published */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <Eye size={24} className="opacity-80" />
                    <span className="text-3xl font-black">{published}</span>
                </div>
                <p className="text-green-100 text-sm font-bold">منشور</p>
                <div className="mt-2 text-xs text-green-100 opacity-75">
                    {total > 0 ? Math.round((published / total) * 100) : 0}% من الإجمالي
                </div>
            </div>

            {/* Drafts */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <FileEdit size={24} className="opacity-80" />
                    <span className="text-3xl font-black">{drafts}</span>
                </div>
                <p className="text-yellow-100 text-sm font-bold">مسودات</p>
                <div className="mt-2 text-xs text-yellow-100 opacity-75">
                    {total > 0 ? Math.round((drafts / total) * 100) : 0}% من الإجمالي
                </div>
            </div>

            {/* Total Views */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <TrendingUp size={24} className="opacity-80" />
                    <span className="text-3xl font-black">{totalViews.toLocaleString('ar-SA')}</span>
                </div>
                <p className="text-purple-100 text-sm font-bold">إجمالي المشاهدات</p>
                <div className="mt-2 text-xs text-purple-100 opacity-75">
                    {published > 0 ? Math.round(totalViews / published).toLocaleString('ar-SA') : 0} متوسط/مقال
                </div>
            </div>
        </div>
    );
}
