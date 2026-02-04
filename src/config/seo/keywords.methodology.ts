/**
 * SEO Keywords - Lean Six Sigma Methodology
 * High-conversion methodology-specific keywords
 */

export const METHODOLOGY_KEYWORDS = {
    // Core Methodologies
    leanSixSigma: [
        'Lean Six Sigma consulting India',
        'Six Sigma consulting firm India',
        'Lean management consulting',
        'process improvement consulting India',
        'operational excellence consulting',
        'continuous improvement consulting',
    ],

    // DMAIC & Frameworks
    frameworks: [
        'DMAIC consulting India',
        'DMAIC implementation services',
        'Define Measure Analyze Improve Control',
        'Six Sigma DMAIC methodology',
    ],

    // Lean Tools
    leanTools: [
        'Value Stream Mapping consulting',
        'VSM consulting India',
        '5S implementation India',
        '5S consulting services',
        'Kaizen consulting services India',
        'Kaizen events facilitation',
        'Poka Yoke implementation',
    ],

    // Quality Management
    qualityManagement: [
        'TQM implementation consulting',
        'Total Quality Management India',
        'FMEA consulting manufacturing',
        'failure modes effects analysis',
        'root cause analysis consulting',
        'statistical process control consulting',
        'SPC implementation India',
    ],

    // Operations Focus
    operations: [
        'bottleneck analysis consulting',
        'process cycle time reduction',
        'waste reduction consulting',
        'Muda elimination consulting',
        'lead time reduction India',
        'throughput improvement consulting',
    ],
} as const;

/**
 * Get all methodology keywords as flat array
 */
export function getAllMethodologyKeywords(): string[] {
    return Object.values(METHODOLOGY_KEYWORDS).flat();
}

/**
 * Get methodology keywords by subcategory
 */
export function getMethodologyKeywordsByCategory(
    category: keyof typeof METHODOLOGY_KEYWORDS
): readonly string[] {
    return METHODOLOGY_KEYWORDS[category];
}
