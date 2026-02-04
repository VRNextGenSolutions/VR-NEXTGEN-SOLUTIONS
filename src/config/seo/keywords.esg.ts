/**
 * SEO Keywords - ESG & Sustainability
 * Emerging keywords for sustainability and compliance
 */

export const ESG_KEYWORDS = {
    // ESG Consulting
    esg: [
        'ESG consulting India',
        'ESG compliance consulting',
        'environmental social governance India',
        'ESG strategy consulting',
        'ESG reporting consulting',
    ],

    // Sustainability
    sustainability: [
        'sustainability consulting Gujarat',
        'green transformation consulting',
        'sustainable business consulting India',
        'sustainability strategy India',
        'environmental consulting India',
    ],

    // Carbon & Climate
    carbonClimate: [
        'carbon footprint consulting',
        'carbon neutrality consulting India',
        'climate risk consulting',
        'net zero consulting India',
    ],

    // CSR
    csr: [
        'CSR consulting services India',
        'corporate social responsibility consulting',
        'CSR strategy development',
        'CSR implementation India',
    ],
} as const;

/**
 * Get all ESG keywords as flat array
 */
export function getAllESGKeywords(): string[] {
    return Object.values(ESG_KEYWORDS).flat();
}
