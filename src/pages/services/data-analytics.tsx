import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function DataAnalytics() {
    const structuredData = [
        getOrganizationSchema(),
        getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/what-we-do' },
            { name: 'Data Analytics', url: '/services/data-analytics' }
        ]),
        getServiceSchema({
            name: 'Data Analytics Services',
            description: PAGE_SEO.services.dataVisualization.description, // Fallback description
            url: '/services/data-analytics'
        })
    ];

    return (
        <Layout
            title="Data Analytics Services | VR NextGen Solutions"
            description="Transform scattered information into actionable insights with our unified analytics framework covering descriptive, diagnostic, and predictive analytics."
        >
            <SEOHead
                title="Data Analytics Services | VR NextGen Solutions"
                description="Transform scattered information into actionable insights with our unified analytics framework covering descriptive, diagnostic, and predictive analytics."
                canonical="/services/data-analytics"
                keywords={["data analytics", "predictive analytics", "business intelligence", "data insights"]}
                structuredData={structuredData}
            />
            <ServicePageShell
                badgeText="Data Analytics"
                title="Data Analytics Services"
                subtitle="Transform your raw data into a strategic asset that drives growth, efficiency, and innovation."
                cardBgUrl="/images-optimized/Our Services/Data Analytics & Insights.webp"
                cardTitle="Data Analytics Services"
            >
                <section className="relative z-10 max-w-none">
                    <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                        In today's data-driven world, having access to data isn't enough; you need the ability to interpret it.
                        Our Data Analytics services help you uncover hidden patterns, market trends, and customer preferences
                        that lead to smarter business decisions.
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
                    <ul className="space-y-3 md:space-y-4 mb-8">
                        {[
                            "Descriptive Analytics: Understanding what happened and why.",
                            "Diagnostic Analytics: Drilling down to root causes of performance issues.",
                            "Predictive Analytics: Forecasting future trends to stay ahead of the curve.",
                            "Prescriptive Analytics: Recommending actions to optimize outcomes."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
                        <h3 className="text-xl font-semibold text-black mb-2">Unlock the Power of Data</h3>
                        <p className="text-gray-800 leading-relaxed">
                            We don't just provide reports; we provide answers. Our team helps you build a data culture where
                            every decision is backed by evidence and every strategy is optimized for success.
                        </p>
                    </div>
                </section>
            </ServicePageShell>
        </Layout>
    );
}
