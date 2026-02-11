import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://solvetek.net' // Final domain for SolveTek

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()

    // 1. Static Routes
    const routes = [
        '',
        '/search',
        '/about',
        '/contact',
        '/privacy',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Dynamic Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, updated_at, created_at')
        .eq('is_hidden', false)

    const categoryRoutes = categories?.map((cat) => ({
        url: `${BASE_URL}/guides/${cat.slug}`,
        lastModified: new Date(cat.updated_at || cat.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) ?? []

    // 3. Dynamic Articles (with images)
    const { data: articles } = await supabase
        .from('articles')
        .select('slug, category:categories(slug), updated_at, featured_image')
        .eq('is_published', true)

    const articleRoutes = articles?.map((article: any) => ({
        url: `${BASE_URL}/guides/${article.category?.slug}/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.9, // Articles are high priority
    })) ?? []

    return [...routes, ...categoryRoutes, ...articleRoutes]
}
