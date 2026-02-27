/**
 * SEO Keywords - Extended Location Keywords
 * Additional city-level keywords for major Indian cities
 */

export const EXTENDED_LOCATION_KEYWORDS = {
    // Major Metro Cities
    metros: {
        mumbai: [],
        bengaluru: [],
        chennai: [],
        pune: [],
        hyderabad: [],
        delhi: [],
    },

    // Gujarat Cities (Local Focus)
    gujarat: {
        vadodara: [],
        rajkot: [],
        vapi: [],
        ankleshwar: [],
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
