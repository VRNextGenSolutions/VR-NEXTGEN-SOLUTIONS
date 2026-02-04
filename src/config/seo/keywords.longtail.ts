/**
 * SEO Keywords Configuration - Long-Tail Keywords
 * Specific, low-competition, high-conversion keywords
 */

export const LONG_TAIL_KEYWORDS = {
    // Process & Operations
    processOptimization: [
        'business process optimization for manufacturing companies India',
        'process improvement consulting for SMEs',
        'lean process optimization consulting India',
        'operational efficiency improvement services',
        'workflow optimization consulting services India',
    ],

    // Digital Transformation
    digitalTransformation: [
        'digital transformation consulting for pharmaceutical industry',
        'digital transformation roadmap for manufacturing India',
        'Industry 4.0 implementation consulting India',
        'smart factory consulting services India',
        'automation and digital transformation India',
    ],

    // Data & Analytics
    dataAnalytics: [
        'data-driven decision making consulting services',
        'business intelligence implementation India',
        'Power BI dashboard development India',
        'Tableau consulting services India',
        'predictive analytics consulting for business',
        'KPI dashboard development consulting',
    ],

    // Lean & Six Sigma
    leanSixSigma: [
        'lean six sigma consulting for factories India',
        'lean manufacturing implementation India',
        'six sigma process improvement consulting',
        'kaizen consulting services India',
        'TQM implementation consulting India',
    ],

    // Industry-Specific
    pharmaceutical: [
        'pharmaceutical GMP compliance consulting India',
        'batch record optimization pharma India',
        'pharma manufacturing process improvement',
        'pharmaceutical quality assurance consulting',
        'API manufacturing consulting India',
    ],

    manufacturing: [
        'OEE improvement consulting India',
        'production efficiency consulting manufacturing',
        'supply chain optimization consulting India',
        'inventory management consulting manufacturing',
        'factory floor optimization services',
    ],

    healthcare: [
        'hospital process improvement consulting India',
        'patient flow optimization consulting',
        'healthcare operational excellence India',
        'medical facility management consulting',
    ],
} as const;

/**
 * Get all long-tail keywords as flat array
 */
export function getAllLongTailKeywords(): string[] {
    return Object.values(LONG_TAIL_KEYWORDS).flat();
}
