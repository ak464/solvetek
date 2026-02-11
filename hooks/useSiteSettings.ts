"use client";

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";

export type SiteSettings = {
    site_name: string;
    site_name_display: string;
    site_description: string;
    site_keywords: string;
    contact_email: string;
    social_twitter: string;
    social_facebook: string;
    social_instagram: string;
    social_youtube: string;
    maintenance_mode: boolean;
    show_social_box: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
    site_name: "SolveTek السعودي",
    site_name_display: "SolveTek",
    site_description: "دليل شامل لحل المشاكل التقنية والشروحات",
    site_keywords: "تقنية, حلول, شروحات, السعودية",
    contact_email: "",
    social_twitter: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    maintenance_mode: false,
    show_social_box: true,
};

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const { data } = await supabase
                .from('site_settings')
                .select('key, value');

            if (data) {
                const newSettings = { ...DEFAULT_SETTINGS };
                data.forEach(item => {
                    if (item.key === 'maintenance_mode' || item.key === 'show_social_box') {
                        (newSettings as any)[item.key] = item.value === 'true';
                    } else if (item.key in newSettings) {
                        (newSettings as any)[item.key] = item.value;
                    }
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    return { settings, loading, refetch: fetchSettings };
}
