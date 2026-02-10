import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function ProcessOptimization() {
    const structuredData = [
        getOrganizationSchema(),
        getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/what-we-do' },
            { name: 'Process Optimization', url: '/services/process-optimization' }
        ]),
        getServiceSchema({
            name: 'Process Optimization Services',
            description: "Streamline and optimize your business processes to improve efficiency.",
            url: '/services/process-optimization'
        })
    ];

    return (
        <Layout
            title="Process Optimization Services | VR NextGen Solutions"
            description="Streamline and optimize your business processes to improve efficiency, reduce waste, and enhance overall organizational performance."
        >
            <SEOHead
                title="Process Optimization Services | VR NextGen Solutions"
                description="Streamline and optimize your business processes to improve efficiency, reduce waste, and enhance overall organizational performance."
                canonical="/services/process-optimization"
                keywords={["process optimization", "workflow improvement", "lean six sigma", "operational efficiency"]}
                structuredData={structuredData}
            />
            <ServicePageShell
                badgeText="Process Optimization"
                title="Process Optimization Services"
                subtitle="Eliminate inefficiencies and build a leaner, faster, and more responsive organization."
                cardBgUrl="/images-optimized/Our Services/Process Optimization & Alignment.webp"
                cardTitle="Process Optimization Services"
            >
                <section className="relative z-10 max-w-none">
                    <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                        Efficient processes are the backbone of any successful business. Our process optimization services help
                        you identify bottlenecks, reduce variability, and standardize workflows to ensure consistent, high-quality
                        outcomes every time.
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
                    <ul className="space-y-3 md:space-y-4 mb-8">
                        {[
                            "Workflow Analysis and Mapping: Visualizing current state to identify improvement areas.",
                            "Lean Six Sigma Implementation: Applying proven methodologies to reduce defects and waste.",
                            "Standard Operating Procedures (SOPs): Documenting best practices for consistency.",
                            "Continuous Improvement Frameworks: Building a culture of ongoing enhancement."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
                        <h3 className="text-xl font-semibold text-black mb-2">Efficiency Redefined</h3>
                        <p className="text-gray-800 leading-relaxed">
                            We help you do more with less. By optimizing your core processes, we enable your team to focus on
                            high-value activities that drive growth and customer satisfaction.
                        </p>
                    </div>
                </section>
            </ServicePageShell>
        </Layout>
    );
}
