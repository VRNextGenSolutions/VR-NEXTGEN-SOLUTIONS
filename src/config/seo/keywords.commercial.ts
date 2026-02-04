/**
 * SEO Keywords Configuration - Commercial Intent Keywords
 * High-intent keywords for bottom-of-funnel searches
 */

export const COMMERCIAL_KEYWORDS = {
    // Hiring intent
    hiring: [
        'hire business consultant India',
        'hire management consultant Gujarat',
        'consulting services near me',
        'management consultant near me',
        'find business consultant India',
    ],

    // Comparison/Alternatives
    comparison: [
        'top consulting firms India',
        'best consulting companies Gujarat',
        'affordable consulting services India',
        'boutique consulting firm India',
        'consulting firm for SMEs India',
    ],

    // Cost/ROI focused
    costRoi: [
        'reduce operational costs consulting',
        'ROI on digital transformation',
        'cost optimization consulting India',
        'improve business efficiency consulting',
        'cost reduction consulting services',
        'consulting services pricing India',
    ],

    // Service-specific commercial
    services: [
        'strategic consulting services quote',
        'data visualization services pricing',
        'process optimization consulting cost',
        'change management consulting India rates',
    ],

    // Industry-specific commercial
    industryCommercial: [
        'pharmaceutical consulting firms India',
        'manufacturing consulting companies Gujarat',
        'healthcare consulting services India',
        'retail consulting firms India',
    ],
} as const;

/**
 * Get all commercial keywords as flat array
 */
export function getAllCommercialKeywords(): string[] {
    return Object.values(COMMERCIAL_KEYWORDS).flat();
}
