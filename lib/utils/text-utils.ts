/**
 * Extract plain text from HTML content
 */
export function extractTextFromHtml(html: string, wordLimit: number = 15): string {
    if (!html) return "";

    // Remove HTML tags
    const text = html.replace(/\u003c[^>]*\u003e/g, ' ');

    // Decode HTML entities
    const decoded = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Clean up whitespace
    const cleaned = decoded.replace(/\s+/g, ' ').trim();

    // Split into words and take first N words
    const words = cleaned.split(' ').filter(word => word.length > 0);
    const excerpt = words.slice(0, wordLimit).join(' ');

    return excerpt + (words.length > wordLimit ? '...' : '');
}
