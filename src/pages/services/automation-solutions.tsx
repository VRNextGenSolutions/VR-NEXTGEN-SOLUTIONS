import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function AutomationSolutions() {
    const structuredData = [
        getOrganizationSchema(),
        getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'What We Do', url: '/what-we-do' },
            { name: 'Automation Solutions', url: '/services/automation-solutions' }
        ]),
        getServiceSchema({
            name: 'Automation Solutions',
            description: "Implement intelligent automation solutions that reduce manual work.",
            url: '/services/automation-solutions'
        })
    ];

    return (
        <Layout
            title="Automation Solutions | VR NextGen Solutions"
            description="Implement intelligent automation solutions that reduce manual work, improve accuracy, and accelerate business processes."
        >
            <SEOHead
                title="Automation Solutions | VR NextGen Solutions"
                description="Implement intelligent automation solutions that reduce manual work, improve accuracy, and accelerate business processes."
                canonical="/services/automation-solutions"
                keywords={["business automation", "RPA", "intelligent automation", "workflow automation"]}
                structuredData={structuredData}
            />
            <ServicePageShell
                badgeText="Automation Solutions"
                title="Automation Solutions"
                subtitle="Accelerate your business with intelligent automation that handles repetitive tasks, allowing your team to focus on innovation."
                cardBgUrl="/images-optimized/Our Services/Automation & Technology Solutions.webp"
                cardTitle="Automation Solutions"
            >
                <section className="relative z-10 max-w-none">
                    <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                        Manual data entry and repetitive administrative tasks drain resources and slow down growth. Our automation
                        solutions leverage Robotic Process Automation (RPA) and AI to streamline these operations, ensuring accuracy,
                        speed, and 24/7 productivity.
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
                    <ul className="space-y-3 md:space-y-4 mb-8">
                        {[
                            "Robotic Process Automation (RPA): Automating rule-based, repetitive tasks.",
                            "Intelligent Document Processing: Extracting data from documents automatically.",
                            "Workflow Integration: Connecting disparated systems for seamless data flow.",
                            "Custom Automation Scripts: Tailored solutions for unique business challenges."
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
                        <h3 className="text-xl font-semibold text-black mb-2">Work Smarter, Not Harder</h3>
                        <p className="text-gray-800 leading-relaxed">
                            Unlock the full potential of your workforce by removing the burden of mundane tasks. Our automation
                            solutions free up your team to engage in creative, strategic work that truly drives the business forward.
                        </p>
                    </div>
                </section>
            </ServicePageShell>
        </Layout>
    );
}
