/**
 * SEO Keywords Configuration - Commercial Intent Keywords
 * High-intent keywords for bottom-of-funnel searches
 */

export const COMMERCIAL_KEYWORDS = {
    // Hiring intent
    hiring: [
        'hire business consultant India',
        'hire Power BI consultant India',
        'hire data analytics consultant India',
        'hire process optimization consultant',
        'hire business automation consultant'
    ],

    // Comparison/Alternatives
    comparison: [],

    // Cost/ROI focused
    costRoi: [],

    // Service-specific commercial
    services: [],

    // Industry-specific commercial
    industryCommercial: [
        'pharma consultant for manufacturing',
        'manufacturing operations consultant'
    ],
} as const;

/**
 * Get all commercial keywords as flat array
 */
export function getAllCommercialKeywords(): string[] {
    return Object.values(COMMERCIAL_KEYWORDS).flat();
}
