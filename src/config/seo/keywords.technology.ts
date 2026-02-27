/**
 * SEO Keywords Configuration - Technology & Tools Keywords
 * Tool-specific and technology keywords
 */

export const TECHNOLOGY_KEYWORDS = {
    // Data Visualization
    dataVizTools: [
        'executive dashboard consulting',
        'KPI dashboard consulting',
        'data visualization consulting India'
    ],

    // ERP & Enterprise (Removed)
    enterprise: [],

    // Automation
    automation: [
        'APA consulting services India',
        'business process automation India',
        'automation strategy consulting'
    ],

    // AI & Analytics (Removed)
    aiAnalytics: [],

    // Cloud & Digital (Removed)
    cloud: [],
} as const;

/**
 * Get all technology keywords as flat array
 */
export function getAllTechnologyKeywords(): string[] {
    return Object.values(TECHNOLOGY_KEYWORDS).flat();
}
