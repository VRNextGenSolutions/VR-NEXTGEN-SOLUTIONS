/**
 * SEO Configuration for VR NextGen Solutions
 * Centralized SEO settings, keywords, and meta configurations
 * 
 * Keywords are now organized in modular files under /config/seo/
 * - keywords.location.ts - India/Gujarat/city-specific keywords
 * - keywords.longtail.ts - Long-tail, high-conversion keywords
 * - keywords.questions.ts - Question-based keywords for PAA/snippets
 * - keywords.commercial.ts - Commercial intent keywords
 * - keywords.technology.ts - Tool and technology keywords
 */

export const SEO_CONFIG = {
    // Site-wide configuration
    siteName: 'VR NextGen Solutions',
    siteUrl: 'https://vrnextgensolutions.com',
    defaultTitle: 'VR NextGen Solutions | Business Consulting & Digital Transformation India',
    defaultDescription: 'VR NextGen Solutions delivers expert business consulting, digital transformation, and data-driven strategies in India. Transform your organization with strategic consulting, process optimization, and automation solutions across pharma, healthcare, manufacturing, and more.',

    // Social media
    twitterHandle: '@vrnextgen',

    // Default Open Graph image
    defaultOgImage: '/images-optimized/og-default.webp',

    // Organization info for structured data
    organization: {
        name: 'VR NextGen Solutions',
        legalName: 'VR NextGen Solutions',
        url: 'https://vrnextgensolutions.com',
        logo: 'https://vrnextgensolutions.com/icons-optimized/logo.webp',
        email: 'info@vrnextgensolutions.com',
        telephone: '+91 94267 22001',
        address: {
            streetAddress: 'Gandhinagar',
            addressLocality: 'Gandhinagar',
            addressRegion: 'Gujarat',
            postalCode: '382721',
            addressCountry: 'IN',
        },
        sameAs: [
            // Add social media URLs when available
        ],
    },
};

// Primary keywords by category (enhanced with India-specific terms)
export const PRIMARY_KEYWORDS = {
    core: [
        'data analytics consulting company in India',
        'business consulting India',
        'Power BI consulting services India',
        'business process optimization consultant',
        'automation solutions for business',
        'data-driven consulting India',
        'analytics & automation consulting India',
        'business transformation consulting India',
        'process excellence consulting India',
        'operations consulting India',
        'business analytics services India'
    ],
    highIntent: [
        'hire business consultant India',
        'hire Power BI consultant India',
        'pharma operations consulting',
        'manufacturing analytics consulting',
        'process excellence consulting India'
    ],
    commercial: [
        'hire data analytics consultant India',
        'hire Power BI consultant India',
        'hire process optimization consultant',
        'hire business automation consultant',
        'pharma consultant for manufacturing',
        'manufacturing operations consultant'
    ],
    cities: [
        'Mehsana',
        'Chatral',
        'business consulting Ahmedabad',
        'data analytics services Ahmedabad',
        'Power BI consulting Ahmedabad',
        'process optimization Gandhinagar'
    ],
    services: {
        methodology: [
            'continuous improvement consulting',
            'lean operations consulting',
            'operational excellence consulting',
            'process excellence consulting',
            'strategic consulting India',
        ],
        automation: [
            'APA consulting services India',
            'business process automation India',
            'automation strategy consulting'
        ],
        dataVisualization: [
            'executive dashboard consulting',
            'KPI dashboard consulting',
            'data visualization consulting India'
        ],
        financial: [
            'financial advisory consulting India',
            'financial planning services',
        ],
        change: [
            'change management consulting India',
            'organizational transformation',
        ],
        e2e: [
            'end-to-end business solutions India',
            'integrated consulting services',
        ],
    },
    industries: {
        pharma: [
            'pharma analytics consulting India',
            'pharma operations consulting',
            'pharma manufacturing optimization',
            'GMP documentation consulting',
            'pharma compliance automation',
            'pharma dashboard consulting',
            'pharma KPI analytics'
        ],
        manufacturing: [
            'manufacturing analytics consulting',
            'factory performance optimization',
            'operations excellence consulting',
            'manufacturing dashboard consulting',
            'production planning optimization',
            'inventory optimization consulting',
            'manufacturing automation consulting',
            'plant efficiency consulting'
        ],
        healthcare: [
            'healthcare analytics consulting',
            'hospital dashboard consulting',
            'healthcare automation consulting',
            'clinical operations consulting',
            'hospital KPI consulting',
            'hospital process optimization'
        ],
        retail: [
            'retail consulting India',
            'FMCG consulting services',
        ],
        finance: [
            'financial services consulting India',
            'banking consulting India',
        ],
        education: [
            'education consulting India',
            'EdTech solutions',
        ],
        it: [
            'IT consulting India',
            'technology consulting India',
        ],
        industrial: [
            'industrial consulting India',
            'infrastructure consulting',
        ],
    },
};

// Page-specific SEO configurations (optimized meta lengths)
export const PAGE_SEO = {
    home: {
        title: 'Business Consulting, Data Analytics & Process Automation Services in India | VR NextGen Solutions',
        description: 'VR NextGen Solutions helps businesses improve efficiency through data analytics, process optimization, automation, and digital transformation. We serve pharma, manufacturing, retail, and enterprises across India.',
        keywords: [
            'data analytics consulting company in India',
            'business consulting India',
            'Power BI consulting services India',
            'process excellence consulting India',
            'automation solutions for business',
        ],
    },
    whatWeDo: {
        title: 'Business Consulting Services | Process Optimization & Automation | VR NextGen',
        description: 'Comprehensive business consulting: strategic planning, process optimization, automation, and digital transformation. Trusted consulting services across India.',
        keywords: [
            'business process optimization consultant',
            'analytics & automation consulting India',
            'business transformation consulting India',
            'automation strategy consulting',
            'business consulting Ahmedabad',
        ],
    },
    whoWeAre: {
        title: 'About Us | VR NextGen Solutions - Business Consultancy India',
        description: 'VR NextGen Solutions: trusted partner for data-driven business transformation in India. Expert team delivering innovation and measurable results.',
        keywords: [
            'data-driven consulting India',
            'business consultancy India',
            'operations consulting India',
            'business analytics services India',
        ],
    },
    contact: {
        title: 'Contact Us | Get a Consultation | VR NextGen Solutions India',
        description: 'Contact VR NextGen Solutions for expert business consulting in India. Get started with digital transformation and process optimization today.',
        keywords: [
            'hire business consultant India',
            'hire Power BI consultant India',
            'hire process optimization consultant',
            'hire business automation consultant',
        ],
    },
    careers: {
        title: 'Careers | Join VR NextGen Solutions',
        description: 'Join our team driving digital transformation across India. Explore consulting careers in analytics, strategy, and technology.',
        keywords: [
            'consulting careers India',
            'data analytics jobs India',
            'Power BI careers Gujarat',
            'business consulting careers',
        ],
    },
    insights: {
        title: 'Insights | Business Consulting Thought Leadership | VR NextGen',
        description: 'Industry insights, case studies, and thought leadership from VR NextGen Solutions. Latest trends in business transformation.',
        keywords: [
            'business insights India',
            'consulting thought leadership',
            'case studies consulting',
            'industry trends',
        ],
    },
    services: {
        strategicConsulting: {
            title: 'Strategic Consulting Services India | Business Strategy | VR NextGen',
            description: 'Expert strategic consulting: business planning, market analysis, growth strategy. Drive sustainable growth with VR NextGen Solutions India.',
            keywords: [
                'business transformation consulting India',
                'strategic consulting India',
                'business strategy consulting',
                'growth strategy India',
                'continuous improvement consulting',
            ],
        },
        dataVisualization: {
            title: 'Data Visualization & BI Services India | Power BI & Tableau | VR NextGen',
            description: 'Transform data into insights with data visualization and BI services. Power BI, Tableau dashboards and analytics solutions in India.',
            keywords: [
                'data visualization consulting India',
                'executive dashboard consulting',
                'KPI dashboard consulting',
                'Power BI consulting services India',
                'data analytics services Ahmedabad',
            ],
        },
        financialAdvisory: {
            title: 'Financial Advisory Services India | Business Finance Consulting | VR NextGen',
            description: 'Expert financial advisory and consulting for business growth in India. Strategic financial planning and optimization services.',
            keywords: [
                'financial advisory India',
                'financial consulting services',
                'business finance consulting',
                'financial planning India',
            ],
        },
        changeManagement: {
            title: 'Change Management Consulting India | Organizational Transformation | VR NextGen',
            description: 'Navigate organizational change with expert consulting. Smooth transformations while maintaining productivity across India.',
            keywords: [
                'change management India',
                'organizational transformation',
                'transformation consulting',
                'business change consulting',
            ],
        },
        endToEnd: {
            title: 'End-to-End Business Solutions India | Integrated Consulting | VR NextGen',
            description: 'Complete business solutions from strategy to implementation. Integrated consulting covering process optimization and digital transformation.',
            keywords: [
                'end-to-end solutions India',
                'integrated consulting services',
                'operations excellence consulting',
                'process excellence consulting India',
            ],
        },
    },
    industries: {
        pharma: {
            title: 'Pharmaceutical Consulting India | Analytics & Operations | VR NextGen',
            description: 'Specialized pharmaceutical consulting in India. Pharma analytics, GMP documentation, manufacturing optimization, and compliance automation.',
            keywords: [
                'pharma analytics consulting India',
                'pharma operations consulting',
                'pharma manufacturing optimization',
                'GMP documentation consulting',
                'pharma compliance automation',
            ],
        },
        healthcare: {
            title: 'Healthcare Consulting India | Analytics & Operations | VR NextGen',
            description: 'Expert healthcare consulting for hospitals in India. Healthcare analytics, clinical operations, hospital dashboards, and process optimization.',
            keywords: [
                'healthcare analytics consulting',
                'hospital dashboard consulting',
                'healthcare automation consulting',
                'clinical operations consulting',
                'hospital KPI consulting',
            ],
        },
        manufacturing: {
            title: 'Manufacturing Consulting India | Analytics & Automation | VR NextGen',
            description: 'Manufacturing consulting for operational excellence in India. Manufacturing analytics, factory performance, and production planning optimization.',
            keywords: [
                'manufacturing analytics consulting',
                'factory performance optimization',
                'operations excellence consulting',
                'manufacturing dashboard consulting',
                'manufacturing automation consulting',
            ],
        },
        retail: {
            title: 'Retail & FMCG Consulting India | Supply Chain Optimization | VR NextGen',
            description: 'Retail and FMCG consulting for supply chain optimization and digital transformation in India.',
            keywords: [
                'retail consulting India',
                'FMCG consulting services',
                'supply chain consulting India',
                'retail optimization',
            ],
        },
        finance: {
            title: 'Financial Services Consulting India | Banking & Insurance | VR NextGen',
            description: 'Financial services consulting for banking and insurance in India. Digital transformation and compliance solutions.',
            keywords: [
                'financial services consulting India',
                'banking consulting India',
                'insurance consulting',
                'fintech consulting',
            ],
        },
        education: {
            title: 'Education & EdTech Consulting India | VR NextGen Solutions',
            description: 'Education and EdTech consulting for institutions in India. Digital learning and operational efficiency solutions.',
            keywords: [
                'education consulting India',
                'EdTech consulting services',
                'educational technology India',
                'learning solutions',
            ],
        },
        it: {
            title: 'IT & Technology Consulting India | Digital Services | VR NextGen',
            description: 'IT and technology consulting for digital transformation in India. Process optimization and strategic growth.',
            keywords: [
                'IT consulting India',
                'technology consulting services',
                'professional services consulting',
                'digital consulting India',
            ],
        },
        industrial: {
            title: 'Industrial & Infrastructure Consulting India | VR NextGen Solutions',
            description: 'Industrial and infrastructure consulting for operational excellence in India. Project management and digital solutions.',
            keywords: [
                'industrial consulting India',
                'infrastructure consulting',
                'industrial optimization',
                'utilities consulting India',
            ],
        },
        other: {
            title: 'Industry Consulting Services | Cross-Sector Expertise | VR NextGen India',
            description: 'Expert consulting for diverse industries in India. Tailored business transformation solutions for any sector.',
            keywords: [
                'industry consulting India',
                'cross-sector consulting',
                'business consulting services',
                'specialized consulting India',
            ],
        },
    },
};

// Re-export keyword modules for easy access
export * from './seo/index';
