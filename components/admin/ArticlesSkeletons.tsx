export function ArticlesTableSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-bold w-12">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </th>
                        <th className="px-6 py-4 font-bold w-16"></th>
                        <th className="px-6 py-4 font-bold">العنوان</th>
                        <th className="px-6 py-4 font-bold">القسم</th>
                        <th className="px-6 py-4 font-bold">الكاتب</th>
                        <th className="px-6 py-4 font-bold">الحالة</th>
                        <th className="px-6 py-4 font-bold">المشاهدات</th>
                        <th className="px-6 py-4 font-bold">آخر تحديث</th>
                        <th className="px-6 py-4 font-bold">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {[...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td className="px-6 py-4">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-4">
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function ArticlesStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            ))}
        </div>
    );
}
