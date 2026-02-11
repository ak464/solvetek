# SolveTek - Arabic Tech Troubleshooting Platform

## Project Overview
SolveTek is a comprehensive content platform dedicated to solving technical problems for users in Saudi Arabia and the Arab world. It focuses on mobile guides, internet troubleshooting, app tutorials, and government digital services.

The platform is built for high performance, SEO optimization, and advanced monetization through affiliate marketing and ads.

## Key Features
- **Content Management**: Rich text articles with a custom Tiptap editor.
- **Dynamic Routing**: Category-based routing (`/guides/[category]/[slug]`).
- **Monetization Engine**: Centralized management for Affiliate Links and AdSense.
    - Dynamic injection of affiliate boxes/buttons into articles.
    - Global and per-article ad control.
- **User Engagement**: Comments, views tracking, "Was this helpful?" widgets (planned/in-progress).
- **Admin Dashboard**: Full control over content, users, and monetization settings.

## Quick Start
1.  **Install Dependencies**: `npm install`
2.  **Environment Setup**: Copy `.env.example` to `.env.local` and add Supabase credentials.
3.  **Run Development Server**: `npm run dev`
4.  **Open**: `http://localhost:3000`

## Core Technologies
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **Editor**: Tiptap
- **Icons**: Lucide React
