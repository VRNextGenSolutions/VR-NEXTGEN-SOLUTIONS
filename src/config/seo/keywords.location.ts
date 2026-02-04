/**
 * SEO Keywords Configuration - Location-Based Keywords
 * India-specific and city-level keywords for local SEO
 */

export const LOCATION_KEYWORDS = {
    // Country-wide
    india: [
        'business consulting India',
        'management consulting India',
        'digital transformation India',
        'process optimization India',
        'data analytics consulting India',
        'business automation India',
    ],

    // State-level
    gujarat: [
        'business consulting Gujarat',
        'management consulting Gujarat',
        'consulting services Gujarat',
        'digital transformation Gujarat',
    ],

    // City-level
    cities: {
        gandhinagar: [
            'consulting services Gandhinagar',
            'business consultant Gandhinagar',
        ],
        ahmedabad: [
            'management consulting Ahmedabad',
            'business consulting Ahmedabad',
            'consulting firms Ahmedabad',
        ],
        surat: [
            'business consulting Surat',
            'manufacturing consulting Surat',
        ],
    },
} as const;

/**
 * Get all location keywords as flat array
 */
export function getAllLocationKeywords(): string[] {
    return [
        ...LOCATION_KEYWORDS.india,
        ...LOCATION_KEYWORDS.gujarat,
        ...Object.values(LOCATION_KEYWORDS.cities).flat(),
    ];
}
