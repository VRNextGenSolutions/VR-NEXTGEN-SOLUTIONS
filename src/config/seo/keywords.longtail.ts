/**
 * SEO Keywords Configuration - Long-Tail Keywords
 * Specific, low-competition, high-conversion keywords
 */

export const LONG_TAIL_KEYWORDS = {
    // Process & Operations
    processOptimization: [],

    // Digital Transformation
    digitalTransformation: [],

    // Data & Analytics
    dataAnalytics: [],

    // Lean & Six Sigma
    leanSixSigma: [],

    // Industry-Specific
    pharmaceutical: [],

    manufacturing: [],

    healthcare: [],
} as const;

/**
 * Get all long-tail keywords as flat array
 */
export function getAllLongTailKeywords(): string[] {
    return Object.values(LONG_TAIL_KEYWORDS).flat();
}
