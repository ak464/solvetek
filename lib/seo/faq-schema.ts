/**
 * Generate FAQ Schema for articles
 * This helps Google show rich snippets in search results
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    if (!faqs || faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate HowTo Schema for tutorial articles
 */
export function generateHowToSchema(data: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.name,
        description: data.description,
        step: data.steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.image && { image: step.image }),
        })),
    };
}
