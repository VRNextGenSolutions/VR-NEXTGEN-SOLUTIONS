/**
 * SEO Keywords - Lean Six Sigma Methodology
 * High-conversion methodology-specific keywords
 */

export const METHODOLOGY_KEYWORDS = {
    // Core Methodologies
    leanSixSigma: [
        'continuous improvement consulting',
        'lean operations consulting',
        'operational excellence consulting',
        'process excellence consulting',
        'strategic consulting India',
    ],

    // DMAIC & Frameworks (Removed)
    frameworks: [],

    // Lean Tools (Removed)
    leanTools: [],

    // Quality Management (Removed)
    qualityManagement: [],

    // Operations Focus (Removed)
    operations: [],
} as const;

/**
 * Get all methodology keywords as flat array
 */
export function getAllMethodologyKeywords(): string[] {
    return Object.values(METHODOLOGY_KEYWORDS).flat();
}

/**
 * Get methodology keywords by subcategory
 */
export function getMethodologyKeywordsByCategory(
    category: keyof typeof METHODOLOGY_KEYWORDS
): readonly string[] {
    return METHODOLOGY_KEYWORDS[category];
}
