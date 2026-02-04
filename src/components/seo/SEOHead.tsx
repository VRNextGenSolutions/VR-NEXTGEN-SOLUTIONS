/**
 * SEOHead Component
 * Centralized SEO meta tags, Open Graph, Twitter Cards, and Structured Data
 * 
 * This component provides comprehensive SEO markup for all pages including:
 * - Meta title and description
 * - Canonical URLs
 * - Open Graph tags for Facebook/LinkedIn
 * - Twitter Card tags
 * - JSON-LD structured data
 */

import Head from 'next/head';
import { SEO_CONFIG } from '@/config/seo.config';

export interface SEOHeadProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    noindex?: boolean;
    keywords?: string[];
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export default function SEOHead({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    noindex = false,
    keywords = [],
    structuredData
}: SEOHeadProps) {
    const fullTitle = title
        ? `${title} | ${SEO_CONFIG.siteName}`
        : SEO_CONFIG.defaultTitle;

    const metaDescription = description || SEO_CONFIG.defaultDescription;
    const canonicalUrl = canonical
        ? `${SEO_CONFIG.siteUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
        : undefined;
    const ogImageUrl = ogImage
        ? `${SEO_CONFIG.siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
        : `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;

    // Combine keywords
    const allKeywords = keywords.length > 0 ? keywords.join(', ') : '';

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {allKeywords && <meta name="keywords" content={allKeywords} />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={SEO_CONFIG.siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImageUrl} />

            {/* Additional Meta Tags */}
            <meta name="author" content={SEO_CONFIG.siteName} />
            <meta name="publisher" content={SEO_CONFIG.siteName} />

            {/* Structured Data / JSON-LD */}
            {structuredData && (
                Array.isArray(structuredData) ? (
                    structuredData.map((data, index) => (
                        <script
                            key={index}
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
                        />
                    ))
                ) : (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )
            )}
        </Head>
    );
}

/**
 * Generate Organization Schema
 */
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SEO_CONFIG.organization.name,
        legalName: SEO_CONFIG.organization.legalName,
        url: SEO_CONFIG.organization.url,
        logo: SEO_CONFIG.organization.logo,
        email: SEO_CONFIG.organization.email,
        sameAs: SEO_CONFIG.organization.sameAs
    };
}

/**
 * Generate WebSite Schema
 */
export function getWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };
}

/**
 * Generate Breadcrumb Schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.siteUrl}${item.url}`
        }))
    };
}

/**
 * Generate Service Schema
 */
export function getServiceSchema(service: {
    name: string;
    description: string;
    url: string;
    provider?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: service.url.startsWith('http') ? service.url : `${SEO_CONFIG.siteUrl}${service.url}`,
        provider: {
            '@type': 'Organization',
            name: service.provider || SEO_CONFIG.organization.name,
            url: SEO_CONFIG.siteUrl
        },
        areaServed: {
            '@type': 'Place',
            name: 'Worldwide'
        }
    };
}

/**
 * Generate LocalBusiness Schema
 */
export function getLocalBusinessSchema(business: {
    address?: string;
    telephone?: string;
    email?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: SEO_CONFIG.organization.name,
        url: SEO_CONFIG.siteUrl,
        logo: SEO_CONFIG.organization.logo,
        email: business.email || SEO_CONFIG.organization.email,
        telephone: business.telephone,
        address: business.address ? {
            '@type': 'PostalAddress',
            streetAddress: business.address
        } : undefined,
        priceRange: '$$',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
        }
    };
}

/**
 * Generate FAQ Schema
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
}
