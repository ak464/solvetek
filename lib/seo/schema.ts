export function generateHowToSchema(article: any) {
    // Assuming article.content might have structured steps in the future.
    // For now, we'll generate a generic structure or try to parse if possible.
    // This is a placeholder for the logic to extract steps from the article content.

    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": article.title,
        "description": article.excerpt,
        "step": [
            {
                "@type": "HowToStep",
                "text": "اقرأ الشرح المفصل في الأسفل.",
                "name": "مقدمة"
            }
            // In a real implementation, you would parse the steps from the content
        ],
        "author": {
            "@type": "Person",
            "name": article.author?.username || "Admin"
        },
        "datePublished": article.created_at,
        "image": article.image_url || "https://solvetek.net/default-og.png"
    };
}

export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item
        }))
    };
}

// Enhanced Schema Generators

export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SolveTek",
        "url": "https://solvetek.net",
        "logo": "https://solvetek.net/logo.png",
        "sameAs": [
            "https://twitter.com/solvetek",
            "https://facebook.com/solvetek"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+966-50-000-0000",
            "contactType": "customer service",
            "areaServed": "SA",
            "availableLanguage": "Arabic"
        }
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SolveTek",
        "url": "https://solvetek.net",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://solvetek.net/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
}

export function generateArticleSchema(article: any) {
    let imageUrl = article.featured_image;

    // Fallback: Extract from content if not set
    if (!imageUrl && article.content) {
        const contentStr = typeof article.content === 'string' ? article.content : JSON.stringify(article.content);
        const match = contentStr.match(/<img[^>]+src="([^">]+)"/);
        if (match) {
            imageUrl = match[1];
        }
    }

    // Final fallback
    if (!imageUrl) {
        imageUrl = "https://solvetek.net/og-default.png";
    }

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": [imageUrl],
        "author": {
            "@type": "Person",
            "name": article.author?.username || "Admin",
            "url": "https://solvetek.net/about"
        },
        "datePublished": article.created_at,
        "dateModified": article.updated_at || article.created_at,
        "publisher": {
            "@type": "Organization",
            "name": "SolveTek",
            "logo": {
                "@type": "ImageObject",
                "url": "https://solvetek.net/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://solvetek.net/guides/${article.category?.slug}/${article.slug}`
        }
    };
}
