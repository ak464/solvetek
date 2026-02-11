"use client";

import React from 'react';
import { AffiliateProductBox } from '@/components/features/affiliate/AffiliateProductBox';
import { ExternalLink, Star, ArrowRight } from 'lucide-react';

interface MonetizationRendererProps {
    settings: any[];
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
}

// Helper function to ensure URL has proper protocol
function normalizeUrl(url: string): string {
    if (!url) return '#';

    // Remove any whitespace
    url = url.trim();

    // If URL already has protocol, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If URL starts with //, add https:
    if (url.startsWith('//')) {
        return 'https:' + url;
    }

    // Otherwise, add https://
    return 'https://' + url;
}

export function MonetizationRenderer({ settings, position }: MonetizationRendererProps) {
    const filteredSettings = settings?.filter(s => s.position === position && s.is_enabled);

    if (!filteredSettings || filteredSettings.length === 0) return null;

    return (
        <div className="space-y-8 mt-6">
            {filteredSettings.map((setting) => {
                const link = setting.link;
                if (!link) return null;

                if (setting.block_type === 'box') {
                    return (
                        <AffiliateProductBox
                            key={setting.id}
                            id={link.id}
                            title={link.name}
                            description={link.description || ""}
                            price="---" // We can add price to link table later or pull from API
                            imageUrl={link.image_url || "https://placehold.co/400x400/png?text=Product"}
                            affiliateUrl={normalizeUrl(link.url)}
                            store={link.store as any}
                            isFeatured={true}
                            variant={position === 'sidebar' ? 'compact' : 'default'}
                        />
                    );
                }

                if (setting.block_type === 'button') {
                    return (
                        <div key={setting.id} className="p-8 bg-blue-50 border border-blue-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-right">
                                <h4 className="text-lg font-black text-[#003366] mb-1">{link.name}</h4>
                                <p className="text-xs font-bold text-gray-500">{link.description}</p>
                            </div>
                            <a
                                href={link.id ? `/api/go/${link.id}` : normalizeUrl(link.url)}
                                target="_blank"
                                rel="nofollow noopener"
                                className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/10"
                            >
                                اشترِ الآن
                                <ArrowRight size={16} className="rotate-180" />
                            </a>
                        </div>
                    );
                }

                return (
                    <div key={setting.id} className="text-center">
                        <a href={link.id ? `/api/go/${link.id}` : normalizeUrl(link.url)} target="_blank" rel="nofollow noopener" className="text-blue-600 font-bold hover:underline">
                            💡 توصية: {link.name} - اضغط هنا للتفاصيل
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
