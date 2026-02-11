export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    role: 'user' | 'admin' | 'editor';
    created_at: string;
};

export type Category = {
    id: number;
    slug: string;
    name_ar: string;
    name_en?: string; // Added
    description?: string; // Added
    icon_url: string | null;
    icon_name?: string; // Added
    parent_id: number | null;
    created_at: string;
    is_hidden?: boolean; // Added
    sort_order?: number; // Added
};

export type Article = {
    id: number;
    title: string;
    slug: string;
    content: any; // JSONB
    excerpt: string | null;
    category_id: number | null;
    author_id: string;
    is_published: boolean;
    published_at: string | null;
    views_count: number;
    tags: string[] | null;
    ads_enabled: boolean;
    affiliate_enabled: boolean;
    created_at: string;
    updated_at: string;
};

export type AffiliateLink = {
    id: number;
    name: string;
    description: string | null;
    url: string;
    image_url: string | null;
    store: 'amazon' | 'noon' | 'aliexpress' | 'other';
    status: 'active' | 'inactive';
    clicks_count: number;
    created_at: string;
};

export type ArticleMonetization = {
    id: number;
    article_id: number;
    affiliate_link_id: number | null;
    position: 'top' | 'middle' | 'bottom' | 'sidebar';
    block_type: 'box' | 'button' | 'text';
    is_enabled: boolean;
    display_order: number;
};

export type Comment = {
    id: number;
    article_id: number;
    user_id: string;
    content: string;
    created_at: string;
};

export type AdPlacement = {
    id: string;
    active: boolean;
    code_snippet: string | null;
    created_at: string;
};
