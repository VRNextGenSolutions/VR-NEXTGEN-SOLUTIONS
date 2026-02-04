/**
 * Read Time Calculator
 * Estimates reading time based on word count
 */

const WORDS_PER_MINUTE = 200;

/**
 * Calculate estimated reading time in minutes
 * @param content - The content to calculate reading time for
 * @returns Reading time in minutes (minimum 1)
 */
export function calculateReadTime(content: string): number {
    // Strip HTML/Markdown tags for accurate word count
    const plainText = content
        .replace(/<[^>]*>/g, '')
        .replace(/[#*`~_\[\]()]/g, '');

    const wordCount = plainText
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;

    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    return Math.max(1, minutes);
}
