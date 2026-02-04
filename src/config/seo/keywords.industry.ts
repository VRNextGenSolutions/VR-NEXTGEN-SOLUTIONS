/**
 * SEO Keywords - Industry-Specific Long-Tail
 * High-value industry-specific keywords for pharma, manufacturing, healthcare
 */

export const INDUSTRY_LONGTAIL_KEYWORDS = {
    // Pharmaceutical Industry (High Value)
    pharmaceutical: [
        'pharma batch record optimization India',
        'pharmaceutical batch automation',
        'GMP compliance consulting Gujarat',
        'pharma process validation consulting',
        'pharmaceutical manufacturing excellence',
        'pharmaceutical regulatory compliance India',
        'FDA compliance consulting India',
        'pharmaceutical quality assurance India',
        'pharma data integrity consulting',
        'pharmaceutical ERP implementation',
        'active pharmaceutical ingredient consulting',
        'API manufacturing consulting India',
        'biopharmaceutical consulting India',
        'pharma supply chain optimization',
        'drug manufacturing process improvement',
    ],

    // Manufacturing Industry
    manufacturing: [
        'OEE improvement consulting India',
        'overall equipment effectiveness consulting',
        'production efficiency consulting Gujarat',
        'smart factory implementation India',
        'Industry 4.0 roadmap consulting',
        'manufacturing digitization Gujarat',
        'preventive maintenance consulting',
        'plant layout optimization',
        'production planning consulting India',
        'manufacturing MES implementation',
        'shop floor optimization India',
        'manufacturing capacity planning',
        'production scheduling optimization',
        'manufacturing quality management India',
        'industrial engineering consulting',
        'manufacturing cost analysis consulting',
        'vendor development consulting India',
        'machine efficiency optimization',
    ],

    // Healthcare Industry
    healthcare: [
        'hospital operations consulting India',
        'patient flow optimization consulting',
        'healthcare accreditation consulting',
        'hospital bed management optimization',
        'clinical workflow improvement',
        'healthcare revenue cycle consulting',
        'medical equipment utilization',
        'hospital staffing optimization',
        'healthcare compliance consulting India',
        'digital health consulting India',
        'healthcare process reengineering',
    ],

    // Supply Chain & Logistics
    supplyChain: [
        'supply chain optimization India',
        'route optimization consulting',
        'last-mile delivery optimization',
        'warehousing strategy consulting India',
        'inventory optimization consulting',
        'ERP integration logistics India',
        'supply chain visibility consulting',
        'demand forecasting consulting',
        'procurement optimization India',
    ],
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
