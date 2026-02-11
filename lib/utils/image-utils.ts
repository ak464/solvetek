/**
 * Extracts the URL of the first image found in an HTML string.
 * This is used to automatically generate thumbnails from article content.
 */
export function extractFirstImage(html: string | null | undefined): string | null {
    if (!html) return null;

    // Regular expression to find the first <img> tag and capture its src attribute
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = html.match(imgRegex);

    return match ? match[1] : null;
}
