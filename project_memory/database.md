# Database Schema

## Conceptual Model
The database is designed to support a content-heavy platform with multiple authors, categorization, and a flexible monetization layer.

## Tables & Schema

### `profiles` (Users)
Extends Supabase Auth users.
- `id` (UUID, PK): Links to `auth.users`
- `username` (Text)
- `avatar_url` (Text)
- `role` (Enum): 'user', 'admin', 'editor'

### `categories`
Hierarchical content organization.
- `id` (Int, PK)
- `slug` (Text, Unique): For URL generation
- `name_ar` (Text): Arabic name
- `name_en` (Text): English name (Internal/Admin)
- `description` (Text): SEO Description
- `icon_url` (Text): Legacy image URL (optional)
- `icon_name` (Text): Lucide icon name (e.g., 'smartphone', 'cpu')
- `parent_id` (Int, FK): Self-referencing for subcategories
- `sort_order` (Int): Display order
- `is_hidden` (Bool): Visibility toggle

### `articles`
The core content unit.
- `id` (Int, PK)
- `slug` (Text, Unique)
- `title` (Text)
- `content` (JSONB/Text): Tiptap HTML content
- `category_id` (Int, FK): Links to `categories`
- `author_id` (UUID, FK): Links to `profiles`
- `is_published` (Bool)
- `views_count` (Int)
- `ads_enabled` (Bool): Per-article ad toggle
- `affiliate_enabled` (Bool): Per-article affiliate toggle

### `affiliate_links`
Central repository of affiliate products/services.
- `id` (Int, PK)
- `name` (Text): Product name
- `url` (Text): The affiliate link
- `store` (Enum): 'amazon', 'noon', etc.
- `status` (Enum): 'active', 'inactive'
- `clicks_count` (Int): Analytics

### `article_monetization`
Mapping table for injecting affiliate links into specific articles.
- `id` (Int, PK)
- `article_id` (Int, FK)
- `affiliate_link_id` (Int, FK)
- `position` (Enum): 'top', 'middle', 'bottom', 'sidebar'
- `block_type` (Enum): 'box', 'button', 'text'
- `display_order` (Int)

### `site_settings` (Inferred)
Global configuration key-value store.
- `key` (Text, PK)
- `value` (Text)
- Example: `key='ads_enabled'`, `value='true'`
