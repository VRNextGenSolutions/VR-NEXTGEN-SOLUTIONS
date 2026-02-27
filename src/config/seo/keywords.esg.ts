/**
 * SEO Keywords - ESG & Sustainability
 * Emerging keywords for sustainability and compliance
 */

export const ESG_KEYWORDS = {
    // ESG Consulting
    esg: [],

    // Sustainability
    sustainability: [],

    // Carbon & Climate
    carbonClimate: [],

    // CSR
    csr: [],
} as const;

/**
 * Get all ESG keywords as flat array
 */
export function getAllESGKeywords(): string[] {
    return Object.values(ESG_KEYWORDS).flat();
}
