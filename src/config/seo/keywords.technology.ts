/**
 * SEO Keywords Configuration - Technology & Tools Keywords
 * Tool-specific and technology keywords
 */

export const TECHNOLOGY_KEYWORDS = {
    // Data Visualization Tools
    dataVizTools: [
        'Power BI consulting India',
        'Power BI dashboard development',
        'Tableau consulting services India',
        'Tableau dashboard development',
        'Excel automation consulting',
        'Google Data Studio consulting',
    ],

    // ERP & Enterprise
    enterprise: [
        'ERP consulting India',
        'ERP implementation consulting',
        'SAP consulting services India',
        'Oracle consulting India',
        'Microsoft Dynamics consulting',
    ],

    // Automation
    automation: [
        'RPA consulting services India',
        'business automation consulting',
        'workflow automation India',
        'process automation consulting',
        'robotic process automation India',
    ],

    // AI & Analytics
    aiAnalytics: [
        'AI consulting for business India',
        'machine learning consulting',
        'predictive analytics consulting India',
        'big data consulting India',
        'data science consulting services',
    ],

    // Cloud & Digital
    cloud: [
        'cloud transformation consulting India',
        'digital infrastructure consulting',
        'cloud migration consulting',
    ],
} as const;

/**
 * Get all technology keywords as flat array
 */
export function getAllTechnologyKeywords(): string[] {
    return Object.values(TECHNOLOGY_KEYWORDS).flat();
}
