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

export function generateArticleSchema(article: any) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "author": {
            "@type": "Person",
            "name": article.author?.username || "Admin"
        },
        "datePublished": article.created_at,
        "dateModified": article.updated_at,
        "publisher": {
            "@type": "Organization",
            "name": "SolveTek",
            "url": "https://solvetek.net",
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
