"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PaginationProps = {
    page: number;
    totalPages: number;
    limit: number;
    from: number;
    to: number;
    count: number;
    searchParams: any;
};

export function EnhancedPagination({ page, totalPages, limit, from, to, count, searchParams }: PaginationProps) {
    const router = useRouter();

    const handleLimitChange = (newLimit: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', newLimit);
        params.delete('page'); // Reset to page 1
        router.push(`/admin/articles?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {/* Per Page Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">عرض:</span>
                <select
                    value={limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <span className="text-sm text-gray-600 font-medium">مقال</span>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
                {/* First Page */}
                {page > 2 && (
                    <Link
                        href={`/admin/articles?${new URLSearchParams({ ...searchParams, page: '1' }).toString()}`}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-bold text-sm"
                    >
                        1
                    </Link>
                )}
                {page > 3 && <span className="text-gray-400">...</span>}

                {/* Previous Page */}
                {page > 1 && (
                    <Link
                        href={`/admin/articles?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`}
                        className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-bold text-sm"
                    >
                        السابق
                    </Link>
                )}

                {/* Current Page */}
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-sm">
                    {page}
                </span>

                {/* Next Page */}
                {page < totalPages && (
                    <Link
                        href={`/admin/articles?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm"
                    >
                        التالي
                    </Link>
                )}

                {/* Last Page */}
                {page < totalPages - 2 && <span className="text-gray-400">...</span>}
                {page < totalPages - 1 && (
                    <Link
                        href={`/admin/articles?${new URLSearchParams({ ...searchParams, page: String(totalPages) }).toString()}`}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-bold text-sm"
                    >
                        {totalPages}
                    </Link>
                )}
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600 font-medium">
                {from + 1}-{Math.min(to + 1, count)} من {count}
            </div>
        </div>
    );
}
