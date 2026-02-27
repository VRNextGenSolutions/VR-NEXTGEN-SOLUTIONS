/**
 * SEO Keywords - Enterprise Systems
 * ERP, SAP, Oracle and enterprise platform keywords
 */

export const ENTERPRISE_KEYWORDS = {
    erp: [],
    sap: [],
    oracle: [],
    microsoft: [],
    integration: [],
} as const;

/**
 * Get all enterprise keywords as flat array
 */
export function getAllEnterpriseKeywords(): string[] {
    return Object.values(ENTERPRISE_KEYWORDS).flat();
}
