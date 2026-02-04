/**
 * SEO Keywords - Enterprise Systems
 * ERP, SAP, Oracle and enterprise platform keywords
 */

export const ENTERPRISE_KEYWORDS = {
    // ERP General
    erp: [
        'ERP consulting India',
        'ERP optimization consulting',
        'ERP implementation India',
        'ERP-analytics integration India',
        'enterprise resource planning consulting',
    ],

    // SAP
    sap: [
        'SAP consulting India',
        'SAP implementation services',
        'SAP optimization consulting',
        'SAP S/4HANA consulting India',
    ],

    // Oracle
    oracle: [
        'Oracle consulting India',
        'Oracle ERP implementation',
        'Oracle Cloud consulting India',
    ],

    // Microsoft
    microsoft: [
        'Microsoft Dynamics consulting India',
        'Dynamics 365 implementation',
        'Microsoft business solutions India',
    ],

    // Integration
    integration: [
        'system integration consulting India',
        'enterprise integration services',
        'API integration consulting',
        'data integration consulting India',
    ],
} as const;

/**
 * Get all enterprise keywords as flat array
 */
export function getAllEnterpriseKeywords(): string[] {
    return Object.values(ENTERPRISE_KEYWORDS).flat();
}
