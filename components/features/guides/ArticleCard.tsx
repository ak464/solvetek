import Link from "next/link";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/types/database";
import { Clock, Calendar } from "lucide-react";
import { extractFirstImage } from "@/lib/utils/image-utils";
import { extractTextFromHtml } from "@/lib/utils/text-utils";
import { ShareWidget } from "@/components/ui/ShareWidget";

interface ArticleCardProps {
    article: Partial<Article> & { category?: { name_ar: string; slug: string } };
    className?: string;
    variant?: "default" | "poster" | "compact-poster";
}

export function ArticleCard({ article, className, variant = "default" }: ArticleCardProps) {
    const isPoster = variant === "poster";
    const isCompactPoster = variant === "compact-poster";
    const contentHtml = typeof article.content === 'string' ? article.content : "";
    const coverImage = extractFirstImage(contentHtml);

    // Poster style (Featured with Text Overlay)
    if (isPoster || isCompactPoster) {
        return (
            <Link
                href={`/guides/${article.category?.slug}/${article.slug}`}
                className={cn(
                    "group relative block bg-[#003366] overflow-hidden transition-all duration-500 rounded-3xl border-4 border-white shadow-2xl",
                    isPoster ? "h-full min-h-[400px] lg:min-h-[500px]" : "h-full min-h-[220px]",
                    className
                )}
            >
                {/* Background Overlay / Image Placeholder */}
                <div className="absolute inset-0 bg-[#003366]">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-blue-900/30" />
                    )}
                    {/* Gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/40 to-transparent z-10" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-right">
                    <h3 className={cn(
                        "font-black text-white leading-tight font-heading group-hover:underline decoration-blue-400 decoration-4 underline-offset-8 transition-all",
                        isPoster ? "text-xl md:text-3xl" : "text-base md:text-lg"
                    )}>
                        {article.title}
                    </h3>
                    {isPoster && (
                        <p className="hidden md:block text-blue-50 text-sm mt-4 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            {article.excerpt}
                        </p>
                    )}
                </div>
            </Link>
        );
    }

    // Default style (Clean Card)
    return (
        <div className={cn(
            "group block bg-white border border-gray-100 hover:border-blue-200 transition-all duration-500 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#003366]/15 flex flex-col",
            className
        )}>
            <Link href={`/guides/${article.category?.slug}/${article.slug}`} className="block">
                <div className="aspect-video bg-gray-50 relative overflow-hidden">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-blue-50 opacity-20" />
                    )}
                </div>
            </Link>

            <div className="p-4 flex flex-col justify-between flex-1">
                <Link href={`/guides/${article.category?.slug}/${article.slug}`} className="block">
                    <h3 className="font-black text-[#003366] group-hover:text-blue-600 transition-colors line-clamp-2 text-sm md:text-base font-heading leading-snug mb-2">
                        {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                        {extractTextFromHtml(contentHtml, 15)}
                    </p>
                </Link>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                        <span>{new Date(article.created_at || "").toLocaleDateString("ar-SA")}</span>
                    </div>
                    <ShareWidget title={article.title} url={`/guides/${article.category?.slug}/${article.slug}`} variant="compact" />
                </div>
            </div>
        </div>
    );
}
