import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

export const revalidate = 0; // Force dynamic rendering for layout to reflect category changes immediately // RESTORED CSS IMPORT

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker"; // Import tracker
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { PresenceTracker } from "@/components/admin/PresenceTracker";

import { createClient } from "@/lib/supabase/server";

import { AdsProvider } from "@/components/features/ads/AdsProvider";
import { MaintenanceGuard } from "@/components/site/MaintenanceGuard";

export async function generateMetadata() {
  const supabase = await createClient();

  // Fetch site name and description from settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'site_description', 'site_keywords']);

  const settings = (settingsData || []).reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as any);

  const siteName = settings.site_name || "SolveTek السعودي";
  const description = settings.site_description || "الدليل الشامل لحل مشاكل الجوال، الانترنت، والتطبيقات في السعودية";
  const keywords = settings.site_keywords || "SolveTek, حلول تقنية, السعودية";

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: description,
    keywords: keywords.split(',').map((k: string) => k.trim()),
  };
}

import Script from "next/script";

// ... existing imports

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch initial data in parallel
  const [{ data: categories }, { data: settingsData }] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('is_hidden', false)
      .order('sort_order', { ascending: true }),
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['ads_enabled', 'ads_header', 'ads_sidebar', 'ads_article_top', 'ads_article_middle', 'ads_article_bottom', 'site_name_display'])
  ]);

  // Convert settings array to object
  let siteName = "SolveTek";
  const adSettings = (settingsData || []).reduce((acc, curr) => {
    if (curr.key === 'site_name_display') {
      siteName = curr.value || "SolveTek";
    } else if (curr.key.startsWith('ads_')) {
      acc[curr.key] = curr.value === 'true';
    }
    return acc;
  }, {
    ads_enabled: true, // Default defaults
    ads_header: true,
    ads_sidebar: true,
    ads_article_top: true,
    ads_article_middle: true,
    ads_article_bottom: true,
  } as any);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased bg-[#f7f9fb] text-black flex flex-col min-h-screen`}>
        {adClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
        <AdsProvider settings={adSettings}>
          <MaintenanceGuard>
            <GoogleAnalytics />
            <PresenceTracker />
            <AnalyticsTracker />
            <Header categories={categories || []} siteName={siteName} />
            <main className="flex-1">
              {children}
            </main>
            <Footer categories={categories || []} siteName={siteName} />
          </MaintenanceGuard>
        </AdsProvider>
      </body>
    </html>
  );
}
