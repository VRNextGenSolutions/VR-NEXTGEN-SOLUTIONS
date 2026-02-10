import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function BusinessConsulting() {
    const structuredData = [
        getOrganizationSchema(),
        getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/what-we-do' },
            { name: 'Business Consulting', url: '/services/business-consulting' }
        ]),
        getServiceSchema({
            name: 'Business Consulting Services',
            description: "Optimize your business operations with expert consulting services.",
            url: '/services/business-consulting'
        })
    ];

    return (
        <Layout
            title="Business Consulting Services | VR NextGen Solutions"
            description="Optimize your business operations with expert consulting services that improve performance, reduce costs, and enhance customer satisfaction."
        >
            <SEOHead
                title="Business Consulting Services | VR NextGen Solutions"
                description="Optimize your business operations with expert consulting services that improve performance, reduce costs, and enhance customer satisfaction."
                canonical="/services/business-consulting"
                keywords={["business consulting", "operational efficiency", "performance improvement", "management consulting"]}
                structuredData={structuredData}
            />
            <ServicePageShell
                badgeText="Business Consulting"
                title="Business Consulting Services"
                subtitle="Unlock operational excellence and sustainable growth with our expert business consulting services."
                cardBgUrl="/images-optimized/Our Services/Business Consulting & Strategy.webp"
                cardTitle="Business Consulting Services"
            >
                <section className="relative z-10 max-w-none">
                    <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                        We partner with organizations to solve their most critical challenges and capitalize on their biggest opportunities.
                        Our business consulting services are designed to improve performance, reduce costs, and enhance overall organizational health.
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
                    <ul className="space-y-3 md:space-y-4 mb-8">
                        {[
                            "Operational Excellence: Streamlining processes to maximize efficiency and quality.",
                            "Cost Reduction Strategies: Identifying and eliminating waste without compromising value.",
                            "Performance Management: Setting and tracking KPIs to drive accountability and results.",
                            "Organizational Design: Structuring your teams for agility and collaboration."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
                        <h3 className="text-xl font-semibold text-black mb-2">Drive Tangible Results</h3>
                        <p className="text-gray-800 leading-relaxed">
                            Our approach is practical and results-oriented. We work side-by-side with your teams to implement
                            changes that stick and deliver measurable improvements to your bottom line.
                        </p>
                    </div>
                </section>
            </ServicePageShell>
        </Layout>
    );
}
