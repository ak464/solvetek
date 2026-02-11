"use client";

import { useEffect, useRef } from "react";

import { useAds } from "@/components/features/ads/AdsProvider";

interface AdUnitProps {
    slotId: string;
    placement?: string; // New prop for granular control
    format?: "auto" | "fluid" | "rectangle";
    className?: string;
    responsive?: boolean;
}

export function AdUnit({ slotId, placement, format = "auto", className, responsive = true }: AdUnitProps) {
    const { isEnabled } = useAds();
    const adRef = useRef<HTMLModElement>(null);

    const shouldShow = isEnabled(placement);

    useEffect(() => {
        if (shouldShow) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error("AdSense error", err);
            }
        }
    }, [shouldShow]);

    if (!shouldShow) return null;

    // Development placeholder
    if (process.env.NODE_ENV === "development") {
        return (
            <div
                className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm font-mono p-4 ${className}`}
                aria-label="Ad Placeholder"
            >
                AD_SLOT: {slotId} ({format})
                <br />
                PLACEMENT: {placement || 'global'}
            </div>
        );
    }

    const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    if (!adClient) return null;

    return (
        <div className={`ad-container ${className} my-8`}>
            {/* Helper text or label usually nice for compliance */}
            <div className="text-[10px] text-gray-300 text-center mb-1">إعلان</div>
            <ins
                className="adsbygoogle block"
                data-ad-client={adClient}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
