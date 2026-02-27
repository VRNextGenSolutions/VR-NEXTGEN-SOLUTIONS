/**
 * SEO Keywords Configuration - Location-Based Keywords
 * India-specific and city-level keywords for local SEO
 */

export const LOCATION_KEYWORDS = {
    // Country-wide
    india: [
        'business consulting India',
        'data analytics consulting company in India',
        'Power BI consulting services India',
        'data-driven consulting India',
        'analytics & automation consulting India',
        'business transformation consulting India',
        'process excellence consulting India',
        'operations consulting India',
        'business analytics services India'
    ],

    // State-level (Removed as per requirements)
    gujarat: [],

    // City-level
    cities: {
        newCities: [
            'Mehsana',
            'Chatral',
            'business consulting Ahmedabad',
            'data analytics services Ahmedabad',
            'Power BI consulting Ahmedabad',
            'process optimization Gandhinagar'
        ]
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
