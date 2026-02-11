"use client";

import React from 'react';
import { ShoppingCart, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliateProductBoxProps {
    id?: number;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    affiliateUrl: string;
    store: 'amazon' | 'noon' | 'aliexpress' | 'other';
    isFeatured?: boolean;
    variant?: 'default' | 'compact';
    className?: string;
}

export function AffiliateProductBox({
    id,
    title,
    description,
    price,
    imageUrl,
    affiliateUrl,
    store,
    isFeatured = false,
    variant = 'default',
    className
}: AffiliateProductBoxProps) {

    const storeColors = {
        amazon: "bg-[#FF9900]",
        noon: "bg-[#F7E300] text-black",
        aliexpress: "bg-[#E62E04]",
        other: "bg-[#003366]"
    };

    const storeNames = {
        amazon: "أمازون",
        noon: "نون",
        aliexpress: "علي إكسبريس",
        other: "المتجر"
    };

    // Ensure URL has proper protocol for fallback
    const normalizedUrl = (() => {
        if (!affiliateUrl) return '#';
        const url = affiliateUrl.trim();
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('//')) return 'https:' + url;
        return 'https://' + url;
    })();

    // Use tracking API if ID is available, otherwise direct link
    const finalUrl = id ? `/api/go/${id}` : normalizedUrl;

    const isCompact = variant === 'compact';

    return (
        <div className={cn(
            "group relative bg-white border border-gray-100 flex gap-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 overflow-hidden",
            isCompact ? "flex-col rounded-[2rem] p-5 hover:-translate-y-1" : "flex-col md:flex-row rounded-[2.5rem] p-6 md:p-8 hover:-translate-y-1",
            isFeatured && "ring-2 ring-blue-600/20 bg-blue-50/10",
            className
        )}>
            {/* Advertising Label - Hide in compact */}
            {!isCompact && <div className="absolute top-4 right-8 text-[9px] font-black text-gray-300 uppercase tracking-widest">إعلان / روابط أفلييت</div>}

            {/* Product Image */}
            <div className={cn(
                "bg-white rounded-3xl overflow-hidden border border-gray-50 flex items-center justify-center p-4 relative flex-shrink-0 group-hover:border-blue-100 transition-colors",
                isCompact ? "w-full aspect-square" : "w-full md:w-[240px] aspect-square"
            )}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />

                {isFeatured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#003366] text-white text-[10px] font-black rounded-lg shadow-lg flex items-center gap-1.5">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {isCompact ? "موصى به" : "خيارنا المفضل"}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between py-2 text-right">
                <div className="space-y-3">
                    {!isCompact && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-8 h-0.5 bg-blue-600 rounded-full" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{storeNames[store]}</span>
                        </div>
                    )}

                    <h3 className={cn(
                        "font-black text-[#003366] font-heading leading-tight",
                        isCompact ? "text-lg line-clamp-2" : "text-xl md:text-2xl leading-7 md:leading-9"
                    )}>
                        {title}
                    </h3>

                    {!isCompact && (
                        <p className="text-gray-500 text-sm font-bold leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}

                    <div className={cn("flex items-center gap-6 pt-2", isCompact ? "justify-between" : "")}>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase">السعر التقريبي</span>
                            <span className={cn("font-black text-blue-600 font-heading", isCompact ? "text-xl" : "text-2xl")}>{price}<span className="text-xs mr-1 opacity-60">رس</span></span>
                        </div>
                        {!isCompact && (
                            <>
                                <div className="w-px h-10 bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">شهادة الجودة</span>
                                    <div className="flex items-center gap-1.5 text-green-600 font-black text-xs">
                                        <ShieldCheck size={16} />
                                        موصى به
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={cn("flex flex-col items-center gap-3", isCompact ? "mt-5" : "mt-8 sm:flex-row gap-4")}>
                    <a
                        href={finalUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className={cn(
                            "w-full rounded-2xl flex items-center justify-center gap-3 font-black text-white transition-all hover:scale-105 shadow-xl shadow-blue-900/10",
                            storeColors[store],
                            isCompact ? "h-12 text-xs" : "sm:flex-1 h-14"
                        )}
                    >
                        <ShoppingCart size={isCompact ? 16 : 20} />
                        اطلع على العرض {isCompact ? '' : `في ${storeNames[store]}`}
                    </a>

                    {!isCompact && (
                        <a
                            href={normalizedUrl}
                            target="_blank"
                            rel="nofollow noopener"
                            className="w-full sm:w-auto px-8 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-2 font-black text-[#003366] hover:bg-gray-50 transition-colors"
                        >
                            <ExternalLink size={18} />
                            المراجعات
                        </a>
                    )}
                </div>
            </div>

            {/* Dynamic Light Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
