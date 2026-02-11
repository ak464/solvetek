import Link from "next/link";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/types/database";
import { extractFirstImage } from "@/lib/utils/image-utils";
import { extractTextFromHtml } from "@/lib/utils/text-utils";
import { Calendar, Clock, ChevronLeft } from "lucide-react";
import { ShareWidget } from "@/components/ui/ShareWidget";

interface HorizontalArticleCardProps {
    article: Partial<Article> & { category?: { name_ar: string; slug: string } };
    className?: string;
}

export function HorizontalArticleCard({ article, className }: HorizontalArticleCardProps) {
    const contentHtml = typeof article.content === 'string' ? article.content : "";
    const coverImage = extractFirstImage(contentHtml);
    const link = `/guides/${article.category?.slug}/${article.slug}`;

    return (
        <div className={cn(
            "group flex flex-col md:flex-row gap-8 p-6 bg-white border-b border-gray-100 last:border-0 hover:border-transparent hover:shadow-2xl hover:shadow-[#003366]/10 hover:rounded-2xl transition-all duration-300 relative hover:z-10",
            className
        )}>
            {/* Thumbnail - Sharp Almuhtarif Style */}
            <Link
                href={link}
                className="w-[150px] h-[90px] sm:w-[220px] sm:h-[130px] md:w-[280px] md:h-[160px] bg-gray-50 rounded-lg flex-shrink-0 style-image-container overflow-hidden relative shadow-sm border border-gray-100 block"
            >
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center text-5xl opacity-40 group-hover:scale-110 transition-transform duration-700">
                        📁
                    </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded shadow-md uppercase tracking-wider">
                    {article.category?.name_ar}
                </div>
            </Link>

            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-between py-1">
                <Link href={link} className="block group/title">
                    <h3 className="text-lg md:text-xl font-black text-[#003366] group-hover/title:text-blue-600 transition-colors mb-2 font-heading leading-tight tracking-tight">
                        {article.title}
                    </h3>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed line-clamp-2 font-medium mb-4 max-w-3xl">
                        {extractTextFromHtml(contentHtml, 15)}
                    </p>
                </Link>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-6">
                        <Link
                            href={link}
                            className="flex items-center gap-1 text-[#003366] font-bold text-[11px] hover:text-blue-600 transition-colors group/more"
                        >
                            قراءة المزيد
                            <ChevronLeft size={14} className="mt-0.5 transition-transform group-hover/more:-translate-x-1" />
                        </Link>

                        <div className="w-px h-4 bg-gray-200 hidden sm:block" />

                        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:flex">
                            <span className="flex items-center gap-2"><Calendar size={13} className="text-gray-300" /> {new Date(article.created_at || "").toLocaleDateString("ar-SA")}</span>
                        </div>
                    </div>

                    <ShareWidget title={article.title} url={link} variant="compact" />
                </div>
            </div>
        </div>
    );
}
