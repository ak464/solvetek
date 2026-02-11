import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Dynamic range logic for large page counts
    const getVisiblePages = () => {
        if (totalPages <= 7) return pages;

        if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const createPageUrl = (p: number | string) => {
        if (p === '...') return '#';
        const url = new URL(baseUrl, "http://localhost:3000"); // Dummy base for URL logic
        url.searchParams.set('page', p.toString());
        return url.pathname + url.search;
    };

    return (
        <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Pagination">
            {/* Previous Button */}
            <Link
                href={isFirstPage ? "#" : createPageUrl(currentPage - 1)}
                className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#003366] hover:text-[#003366]",
                    isFirstPage && "opacity-20 cursor-not-allowed pointer-events-none"
                )}
            >
                <ChevronRight size={20} />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {getVisiblePages().map((page, index) => {
                    const isCurrent = page === currentPage;
                    const isEllipsis = page === '...';

                    if (isEllipsis) {
                        return (
                            <span key={`ellipsis-${index}`} className="w-10 text-center text-gray-400 font-black">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-xl text-sm font-black transition-all duration-200 border",
                                isCurrent
                                    ? "bg-[#003366] border-[#003366] text-white shadow-lg shadow-[#003366]/20"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-[#003366] hover:text-[#003366]"
                            )}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={isLastPage ? "#" : createPageUrl(currentPage + 1)}
                className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#003366] hover:text-[#003366]",
                    isLastPage && "opacity-20 cursor-not-allowed pointer-events-none"
                )}
            >
                <ChevronLeft size={20} />
            </Link>
        </nav>
    );
}
