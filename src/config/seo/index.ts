/**
 * SEO Keywords Configuration - Index
 * Centralized export for all keyword modules
 */

// Core keyword modules
export {
    LOCATION_KEYWORDS,
    getAllLocationKeywords,
} from './keywords.location';

export {
    LONG_TAIL_KEYWORDS,
    getAllLongTailKeywords,
} from './keywords.longtail';

export {
    QUESTION_KEYWORDS,
    getAllQuestionKeywords,
    FAQ_CONTENT,
} from './keywords.questions';

export {
    COMMERCIAL_KEYWORDS,
    getAllCommercialKeywords,
} from './keywords.commercial';

export {
    TECHNOLOGY_KEYWORDS,
    getAllTechnologyKeywords,
} from './keywords.technology';

// Advanced keyword modules (v2.0)
export {
    AI_TECHNOLOGY_KEYWORDS,
    getAllAIKeywords,
    getAIKeywordsByCategory,
} from './keywords.ai';

export {
    METHODOLOGY_KEYWORDS,
    getAllMethodologyKeywords,
    getMethodologyKeywordsByCategory,
} from './keywords.methodology';

export {
    INDUSTRY_LONGTAIL_KEYWORDS,
    getAllIndustryLongtailKeywords,
    getIndustryKeywordsBySector,
} from './keywords.industry';

export {
    ESG_KEYWORDS,
    getAllESGKeywords,
} from './keywords.esg';

export {
    ENTERPRISE_KEYWORDS,
    getAllEnterpriseKeywords,
} from './keywords.enterprise';

export {
    EXTENDED_LOCATION_KEYWORDS,
    getAllExtendedLocationKeywords,
    getKeywordsByCity,
} from './keywords.cities';

/**
 * Get complete keyword count for SEO reporting
 */
export function getKeywordStats(): { category: string; count: number }[] {
    return [
        { category: 'Location', count: getAllLocationKeywords().length },
        { category: 'Long-tail', count: getAllLongTailKeywords().length },
        { category: 'Questions', count: getAllQuestionKeywords().length },
        { category: 'Commercial', count: getAllCommercialKeywords().length },
        { category: 'Technology', count: getAllTechnologyKeywords().length },
        { category: 'AI & Emerging', count: getAllAIKeywords().length },
        { category: 'Methodology', count: getAllMethodologyKeywords().length },
        { category: 'Industry Long-tail', count: getAllIndustryLongtailKeywords().length },
        { category: 'ESG', count: getAllESGKeywords().length },
        { category: 'Enterprise', count: getAllEnterpriseKeywords().length },
        { category: 'Extended Cities', count: getAllExtendedLocationKeywords().length },
    ];
}

/**
 * Get total keyword count
 */
export function getTotalKeywordCount(): number {
    return getKeywordStats().reduce((sum, stat) => sum + stat.count, 0);
}

// Import all getter functions
import { getAllLocationKeywords } from './keywords.location';
import { getAllLongTailKeywords } from './keywords.longtail';
import { getAllQuestionKeywords } from './keywords.questions';
import { getAllCommercialKeywords } from './keywords.commercial';
import { getAllTechnologyKeywords } from './keywords.technology';
import { getAllAIKeywords } from './keywords.ai';
import { getAllMethodologyKeywords } from './keywords.methodology';
import { getAllIndustryLongtailKeywords } from './keywords.industry';
import { getAllESGKeywords } from './keywords.esg';
import { getAllEnterpriseKeywords } from './keywords.enterprise';
import { getAllExtendedLocationKeywords } from './keywords.cities';
