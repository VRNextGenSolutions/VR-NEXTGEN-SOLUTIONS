/**
 * SEO Keywords - AI & Emerging Technology
 * High-priority trending keywords for 2024-2025
 */

export const AI_TECHNOLOGY_KEYWORDS = {
    aiConsulting: [],
    predictiveAnalytics: [],
    automation: [],
    digitalTransformation: [],
} as const;

/**
 * Get all AI technology keywords as flat array
 */
export function getAllAIKeywords(): string[] {
    return Object.values(AI_TECHNOLOGY_KEYWORDS).flat();
}

/**
 * Get AI keywords by subcategory
 */
export function getAIKeywordsByCategory(
    category: keyof typeof AI_TECHNOLOGY_KEYWORDS
): readonly string[] {
    return AI_TECHNOLOGY_KEYWORDS[category];
}
