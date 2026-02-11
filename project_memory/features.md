# Features & Business Rules

## 1. Monetization System
The platform uses a "Hybrid Monetization" approach, combining programmatic ads with curated affiliate marketing.

### Affiliate Marketing
- **Centralized Links**: Links are managed in `/admin/affiliate`. If a link changes (e.g., product out of stock), updating it there reflects across all articles.
- **Dynamic Injection**: Authors do not paste links directly into text. Instead, they define "Slots" in the article editor (e.g., "Insert Box for Router X at Bottom"). The frontend `MonetizationRenderer` handles the display.
- **Analytics**: Click tracking per link to measure performance.

### Advertisement
- **Global Toggle**: Admin can turn off all ads site-wide via `/admin/ads` (`site_settings`).
- **Per-Article Override**: Editors can disable ads for specific high-value or sensitive articles (`articles.ads_enabled`).
- **Placements**:
    - **Learderboard**: Top of page.
    - **Sidebar**: Sticky widget.
    - **Mid-Content**: Auto-injected after X paragraphs.

## 2. Content Management (Admin)
- **Editor**: Custom Tiptap implementation supporting headings, lists, images, and code blocks.
- **Dynamic Icons**: Admin can select category icons from a built-in library (Lucide Icons) via the "Icon Picker" instead of uploading images.
- **SEO**: Fields for custom slug, meta description, and social share images.
- **Publishing Workflow**: Draft/Publish states.

### Advanced Articles Management System (2000+ Articles)
- **Search & Filtering**:
    - Real-time text search in titles (300ms debounce)
    - Filter by category, status (published/draft), and author
    - Advanced sorting (date, views, title)
    - Active filters display with badges
- **Enhanced Pagination**:
    - Customizable items per page (20/50/100)
    - Quick navigation (first/last page)
    - Results counter ("1-20 من 150")
- **Bulk Actions**:
    - Multi-select with checkboxes
    - Bulk publish/unpublish
    - Bulk delete (with confirmation)
    - Bulk category change
- **Professional Display**:
    - Statistics dashboard (total, published, drafts, views)
    - Featured image thumbnails
    - Author names and relative dates
    - Loading skeletons for better UX
- **Performance Optimizations**:
    - Database indexes for fast queries
    - Optimized Supabase queries
    - 90%+ performance improvement

## 3. Frontend & User Experience
- **Responsive Navigation**: Mobile-first menu with clear category separation.
- **Reading Progress**: Visual indicator for long articles.
- **Related Content**: Suggestions based on category tags.
- **Search**: Global search functionality (optimized for Arabic queries).

## Business Rules
- **URLs**: Affiliate URLs should be normalized (https automatically added).
- **Images**: Article cover images are automatically extracted or uploaded to Supabase Storage.
- **Access**: Only users with `role='admin'` can access `/admin` routes.
