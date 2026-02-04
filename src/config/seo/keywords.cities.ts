/**
 * SEO Keywords - Extended Location Keywords
 * Additional city-level keywords for major Indian cities
 */

export const EXTENDED_LOCATION_KEYWORDS = {
    // Major Metro Cities
    metros: {
        mumbai: [
            'business consulting Mumbai',
            'management consulting Mumbai',
            'digital transformation Mumbai',
            'lean consulting Mumbai',
        ],
        bengaluru: [
            'technology consulting Bangalore',
            'IT consulting Bengaluru',
            'startup consulting Bangalore',
            'digital consulting Bengaluru',
        ],
        chennai: [
            'manufacturing consulting Chennai',
            'pharma consulting Chennai',
            'automotive consulting Chennai',
            'IT consulting Chennai',
        ],
        pune: [
            'manufacturing consulting Pune',
            'IT consulting Pune',
            'automotive consulting Pune',
            'business consulting Pune',
        ],
        hyderabad: [
            'pharma consulting Hyderabad',
            'IT consulting Hyderabad',
            'business consulting Hyderabad',
        ],
        delhi: [
            'management consulting Delhi NCR',
            'business consulting Delhi',
            'strategy consulting Delhi NCR',
        ],
    },

    // Gujarat Cities (Local Focus)
    gujarat: {
        vadodara: [
            'industrial consulting Vadodara',
            'manufacturing consulting Baroda',
            'business consulting Vadodara',
        ],
        rajkot: [
            'engineering consulting Rajkot',
            'SME consulting Rajkot',
            'manufacturing consulting Rajkot',
        ],
        vapi: [
            'pharma consulting Vapi',
            'chemical consulting Vapi',
            'industrial consulting Vapi',
        ],
        ankleshwar: [
            'chemical consulting Ankleshwar',
            'industrial consulting Ankleshwar',
        ],
    },
} as const;

/**
 * Get all extended location keywords as flat array
 */
export function getAllExtendedLocationKeywords(): string[] {
    const metroKeywords = Object.values(EXTENDED_LOCATION_KEYWORDS.metros).flat();
    const gujaratKeywords = Object.values(EXTENDED_LOCATION_KEYWORDS.gujarat).flat();
    return [...metroKeywords, ...gujaratKeywords];
}

/**
 * Get keywords for a specific city
 */
export function getKeywordsByCity(
    region: 'metros' | 'gujarat',
    city: string
): readonly string[] | undefined {
    const regionData = EXTENDED_LOCATION_KEYWORDS[region] as Record<string, readonly string[]>;
    return regionData[city];
}
