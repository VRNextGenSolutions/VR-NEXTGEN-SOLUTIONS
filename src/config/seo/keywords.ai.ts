/**
 * SEO Keywords - AI & Emerging Technology
 * High-priority trending keywords for 2024-2025
 */

export const AI_TECHNOLOGY_KEYWORDS = {
    // AI Consulting (Trending 2024-2025)
    aiConsulting: [
        'AI consulting India',
        'AI-driven business consulting',
        'artificial intelligence consulting India',
        'AI implementation consulting',
        'machine learning consulting India',
        'generative AI for business India',
        'AI strategy consulting',
    ],

    // Predictive Analytics
    predictiveAnalytics: [
        'predictive analytics consulting India',
        'prescriptive analytics India',
        'AI-driven insights India',
        'data-driven decision making consulting',
        'business forecasting consulting',
    ],

    // Automation
    automation: [
        'automation consulting services India',
        'business process automation India',
        'RPA consulting India',
        'robotic process automation consulting',
        'workflow automation consulting',
        'intelligent automation India',
    ],

    // Digital Transformation
    digitalTransformation: [
        'digital transformation roadmap India',
        'digital transformation strategy consulting',
        'enterprise digitization India',
        'cloud transformation consulting India',
        'digital innovation consulting',
    ],
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
