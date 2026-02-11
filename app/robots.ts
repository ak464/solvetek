import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = 'https://solvetek.net' // Final domain for SolveTek

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/login'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
