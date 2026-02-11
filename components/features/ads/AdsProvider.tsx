"use client";

import React, { createContext, useContext } from 'react';

// Map of setting keys
export type AdSettings = {
    ads_enabled: boolean; // Global master switch
    ads_header: boolean;
    ads_sidebar: boolean;
    ads_article_top: boolean;
    ads_article_middle: boolean;
    ads_article_bottom: boolean;
    [key: string]: boolean;
};

const AdsContext = createContext<AdSettings | null>(null);

export function AdsProvider({
    settings,
    children
}: {
    settings: AdSettings;
    children: React.ReactNode
}) {
    return (
        <AdsContext.Provider value={settings}>
            {children}
        </AdsContext.Provider>
    );
}

export function useAds() {
    const context = useContext(AdsContext);
    if (!context) {
        // Fallback if used outside provider (e.g. error pages), default to enabled mostly or disabled?
        // Safest is to default to false if critical, or true if we want revenue.
        // Let's default to safe false to avoid flashing ads if something breaks.
        return {
            isEnabled: (placement?: string) => false,
            settings: {} as AdSettings
        };
    }

    const isEnabled = (placement?: string) => {
        // 1. Check Global Master Switch
        if (!context.ads_enabled) return false;

        // 2. If no specific placement requested, return true (global check passed)
        if (!placement) return true;

        // 3. Check specific placement setting (default to true if setting missing, or false?
        // Let's assume if key exists we check it. If not, default to true.)
        const settingKey = `ads_${placement}`;
        if (typeof context[settingKey] !== 'undefined') {
            return context[settingKey];
        }

        return true;
    };

    return { isEnabled, settings: context };
}
