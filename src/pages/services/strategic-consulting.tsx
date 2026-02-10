import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function StrategicConsulting() {
  // Structured data for SEO
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'What We Do', url: '/what-we-do' },
      { name: 'Strategic Consulting', url: '/services/strategic-consulting' }
    ]),
    getServiceSchema({
      name: 'Strategic Consulting Services',
      description: PAGE_SEO.services.strategicConsulting.description,
      url: '/services/strategic-consulting'
    })
  ];

  return (
    <Layout
      title={PAGE_SEO.services.strategicConsulting.title}
      description={PAGE_SEO.services.strategicConsulting.description}
    >
      <SEOHead
        title={PAGE_SEO.services.strategicConsulting.title}
        description={PAGE_SEO.services.strategicConsulting.description}
        canonical="/services/strategic-consulting"
        keywords={PAGE_SEO.services.strategicConsulting.keywords}
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20 pb-16">
        <ServicePageShell
          badgeText="Strategic Consulting"
          title="Strategic Consulting Services"
          subtitle="Comprehensive business strategy development and implementation guidance to drive your organization's success."
          cardBgUrl="/images-optimized/Our Services/Business Consulting & Strategy.webp"
          cardTitle="Strategic Consulting Services"
        >
          <section className="relative z-10 max-w-none">
            <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
              Our strategic consulting services help organizations develop and implement comprehensive business strategies
              that drive sustainable growth and competitive advantage. We work closely with leadership teams to align
              business objectives with market opportunities and organizational capabilities.
            </p>

            <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
            <ul className="space-y-3 md:space-y-4 mb-8">
              {[
                "Business Planning and Strategy Development: Creating roadmaps for long-term success.",
                "Market Analysis and Competitive Intelligence: Understanding the landscape to seize opportunities.",
                "Growth Strategy and Market Expansion: identifying new avenues for revenue and scale.",
                "Risk Assessment and Mitigation Planning: Protecting the business from future uncertainties."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Why Choose Our Strategic Consulting?</h3>
              <p className="text-gray-800 leading-relaxed">
                Our experienced consultants bring deep industry knowledge and proven methodologies to help you
                navigate complex business challenges and capitalize on growth opportunities. We focus on creating
                actionable strategies that deliver measurable results.
              </p>
            </div>
          </section>
        </ServicePageShell>
      </div>
    </Layout>
  );
}
