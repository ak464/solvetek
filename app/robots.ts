import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function robots(): Promise<MetadataRoute.Robots> {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_url')
        .single()

    const siteUrl = settings?.value || 'https://solvetek.net'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
