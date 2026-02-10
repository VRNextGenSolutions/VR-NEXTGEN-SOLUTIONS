import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function DigitalTransformation() {
    const structuredData = [
        getOrganizationSchema(),
        getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/what-we-do' },
            { name: 'Digital Transformation', url: '/services/digital-transformation' }
        ]),
        getServiceSchema({
            name: 'Digital Transformation Services',
            description: "Modernize your business operations with comprehensive digital transformation strategies.",
            url: '/services/digital-transformation'
        })
    ];

    return (
        <Layout
            title="Digital Transformation Services | VR NextGen Solutions"
            description="Modernize your business operations with comprehensive digital transformation strategies that enhance efficiency and drive innovation."
        >
            <SEOHead
                title="Digital Transformation Services | VR NextGen Solutions"
                description="Modernize your business operations with comprehensive digital transformation strategies that enhance efficiency and drive innovation."
                canonical="/services/digital-transformation"
                keywords={["digital transformation", "modernization", "cloud adoption", "digital strategy"]}
                structuredData={structuredData}
            />
            <ServicePageShell
                badgeText="Digital Transformation"
                title="Digital Transformation Services"
                subtitle="Reimagine your business for the digital age with strategies that foster agility, innovation, and customer-centricity."
                cardBgUrl="/images-optimized/Our Services/Automation & Technology Solutions.webp"
                cardTitle="Digital Transformation Services"
            >
                <section className="relative z-10 max-w-none">
                    <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                        Digital transformation is more than just adopting new technology; it's about fundamentally changing
                        how you operate and deliver value to customers. We help you navigate this journey with a holistic
                        approach that aligns people, processes, and technology.
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
                    <ul className="space-y-3 md:space-y-4 mb-8">
                        {[
                            "Digital Strategy Development: Creating a clear roadmap for your digital future.",
                            "Legacy System Modernization: Upgrading core systems to support modern business needs.",
                            "Cloud Adoption and Migration: Leveraging the scalability and flexibility of the cloud.",
                            "Customer Experience Transformation: Designing seamless digital journeys for your users."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
                        <h3 className="text-xl font-semibold text-black mb-2">Future-Proof Your Business</h3>
                        <p className="text-gray-800 leading-relaxed">
                            Stay competitive in a rapidly evolving landscape. Our digital transformation services equip you with
                            the tools and strategies needed to innovate faster and respond to market changes with agility.
                        </p>
                    </div>
                </section>
            </ServicePageShell>
        </Layout>
    );
}
