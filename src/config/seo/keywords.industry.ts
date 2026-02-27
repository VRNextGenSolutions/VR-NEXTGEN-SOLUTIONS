/**
 * SEO Keywords - Industry-Specific Long-Tail
 * High-value industry-specific keywords for pharma, manufacturing, healthcare
 */

export const INDUSTRY_LONGTAIL_KEYWORDS = {
    // Pharmaceutical Industry (High Value)
    pharmaceutical: [
        'pharma analytics consulting India',
        'pharma operations consulting',
        'pharma manufacturing optimization',
        'GMP documentation consulting',
        'pharma compliance automation',
        'pharma dashboard consulting',
        'pharma KPI analytics'
    ],

    // Manufacturing Industry
    manufacturing: [
        'manufacturing analytics consulting',
        'factory performance optimization',
        'operations excellence consulting',
        'manufacturing dashboard consulting',
        'production planning optimization',
        'inventory optimization consulting',
        'manufacturing automation consulting',
        'plant efficiency consulting'
    ],

    // Healthcare Industry
    healthcare: [
        'healthcare analytics consulting',
        'hospital dashboard consulting',
        'healthcare automation consulting',
        'clinical operations consulting',
        'hospital KPI consulting',
        'hospital process optimization'
    ],

    // Supply Chain & Logistics (Removed as per requirements)
    supplyChain: [],
} as const;

/**
 * Get all industry long-tail keywords as flat array
 */
export function getAllIndustryLongtailKeywords(): string[] {
    return Object.values(INDUSTRY_LONGTAIL_KEYWORDS).flat();
}

/**
 * Get industry keywords by sector
 */
export function getIndustryKeywordsBySector(
    sector: keyof typeof INDUSTRY_LONGTAIL_KEYWORDS
): readonly string[] {
    return INDUSTRY_LONGTAIL_KEYWORDS[sector];
}
