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
        'business consulting India',
        'business consulting services',
        'management consulting India',
        'data-driven consulting',
        'digital transformation consulting India',
        'business strategy consulting',
        'process optimization consulting India',
        'business automation solutions India',
    ],
    services: {
        strategic: [
            'strategic consulting India',
            'business planning services',
            'market analysis consulting',
            'growth strategy consulting India',
            'business strategy development',
        ],
        dataViz: [
            'data visualization services India',
            'business intelligence dashboards',
            'analytics solutions India',
            'Power BI consulting India',
            'Tableau consulting services',
        ],
        financial: [
            'financial advisory consulting India',
            'financial planning services',
            'business financial consulting',
            'CFO consulting services India',
        ],
        change: [
            'change management consulting India',
            'organizational transformation',
            'business change management',
            'workforce transformation consulting',
        ],
        e2e: [
            'end-to-end business solutions India',
            'integrated consulting services',
            'complete business transformation',
            'full-service consulting India',
        ],
    },
    industries: {
        pharma: [
            'pharmaceutical consulting India',
            'life sciences consulting',
            'GMP compliance consulting India',
            'pharma optimization services',
            'pharmaceutical manufacturing consulting',
        ],
        healthcare: [
            'healthcare consulting India',
            'hospital management consulting',
            'medical industry solutions',
            'healthcare process improvement',
        ],
        manufacturing: [
            'manufacturing consulting India',
            'lean manufacturing consulting',
            'production optimization India',
            'Industry 4.0 consulting India',
            'factory automation consulting',
        ],
        retail: [
            'retail consulting India',
            'FMCG consulting services',
            'retail business solutions',
            'supply chain consulting India',
        ],
        finance: [
            'financial services consulting India',
            'insurance industry consulting',
            'banking consulting India',
            'fintech consulting services',
        ],
        education: [
            'education consulting India',
            'EdTech solutions',
            'educational technology consulting',
            'learning solutions consulting',
        ],
        it: [
            'IT consulting India',
            'professional services consulting',
            'technology consulting India',
            'digital services consulting',
        ],
        industrial: [
            'industrial consulting India',
            'infrastructure consulting',
            'utilities consulting India',
            'construction consulting services',
        ],
    },
};

// Page-specific SEO configurations (optimized meta lengths)
export const PAGE_SEO = {
    home: {
        title: 'VR NextGen Solutions | Business Consulting & Digital Transformation India',
        description: 'Transform your business with VR NextGen Solutions. Expert consulting in digital transformation, process optimization, and data analytics across India.',
        keywords: [
            'business consulting India',
            'digital transformation consulting',
            'data-driven solutions',
            'strategic consulting Gujarat',
            'process optimization India',
        ],
    },
    whatWeDo: {
        title: 'Business Consulting Services | Process Optimization & Automation | VR NextGen',
        description: 'Comprehensive business consulting: strategic planning, process optimization, automation, and digital transformation. Trusted consulting services across India.',
        keywords: [
            'business consulting services India',
            'process optimization consulting',
            'digital transformation services',
            'business automation India',
            'consulting services Gujarat',
        ],
    },
    whoWeAre: {
        title: 'About Us | VR NextGen Solutions - Business Consultancy India',
        description: 'VR NextGen Solutions: trusted partner for data-driven business transformation in India. Expert team delivering innovation and measurable results.',
        keywords: [
            'about VR NextGen Solutions',
            'business consultancy India',
            'consulting experts Gujarat',
            'management consultants India',
        ],
    },
    contact: {
        title: 'Contact Us | Get a Consultation | VR NextGen Solutions India',
        description: 'Contact VR NextGen Solutions for expert business consulting in India. Get started with digital transformation and process optimization today.',
        keywords: [
            'contact VR NextGen',
            'business consulting inquiry India',
            'consulting services Gandhinagar',
            'hire consultant Gujarat',
        ],
    },
    careers: {
        title: 'Careers | Join VR NextGen Solutions',
        description: 'Join our team driving digital transformation across India. Explore consulting careers in analytics, strategy, and technology.',
        keywords: [
            'consulting careers India',
            'VR NextGen jobs',
            'business consulting careers',
            'analytics jobs Gujarat',
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
                'strategic consulting India',
                'business strategy consulting',
                'market analysis services',
                'growth strategy India',
                'business planning consulting',
            ],
        },
        dataVisualization: {
            title: 'Data Visualization & BI Services India | Power BI & Tableau | VR NextGen',
            description: 'Transform data into insights with data visualization and BI services. Power BI, Tableau dashboards and analytics solutions in India.',
            keywords: [
                'data visualization India',
                'Power BI consulting India',
                'Tableau dashboard services',
                'business intelligence India',
                'analytics consulting',
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
                'complete business transformation',
                'full-service consulting',
            ],
        },
    },
    industries: {
        pharma: {
            title: 'Pharmaceutical Consulting India | GMP Compliance | VR NextGen',
            description: 'Specialized pharmaceutical consulting in India. GMP compliance, lean manufacturing, batch optimization for pharma companies.',
            keywords: [
                'pharmaceutical consulting India',
                'pharma consulting Gujarat',
                'GMP compliance India',
                'pharmaceutical manufacturing consulting',
            ],
        },
        healthcare: {
            title: 'Healthcare Consulting India | Hospital Management | VR NextGen',
            description: 'Expert healthcare consulting for hospitals in India. Process improvement, digital health, and operational excellence.',
            keywords: [
                'healthcare consulting India',
                'hospital consulting services',
                'medical consulting India',
                'healthcare optimization',
            ],
        },
        manufacturing: {
            title: 'Manufacturing Consulting India | Lean & Industry 4.0 | VR NextGen',
            description: 'Manufacturing consulting for lean manufacturing and Industry 4.0 in India. Reduce costs and improve efficiency.',
            keywords: [
                'manufacturing consulting India',
                'lean manufacturing India',
                'Industry 4.0 consulting',
                'production optimization',
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
