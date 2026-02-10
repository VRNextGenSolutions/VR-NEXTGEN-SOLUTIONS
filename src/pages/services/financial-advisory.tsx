import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function FinancialAdvisory() {
  // Structured data for SEO
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'What We Do', url: '/what-we-do' },
      { name: 'Financial Advisory', url: '/services/financial-advisory' }
    ]),
    getServiceSchema({
      name: 'Financial Advisory Services',
      description: PAGE_SEO.services.financialAdvisory.description,
      url: '/services/financial-advisory'
    })
  ];

  return (
    <Layout
      title={PAGE_SEO.services.financialAdvisory.title}
      description={PAGE_SEO.services.financialAdvisory.description}
    >
      <SEOHead
        title={PAGE_SEO.services.financialAdvisory.title}
        description={PAGE_SEO.services.financialAdvisory.description}
        canonical="/services/financial-advisory"
        keywords={PAGE_SEO.services.financialAdvisory.keywords}
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20 pb-16">
        <ServicePageShell
          badgeText="Financial Advisory"
          title="Financial Advisory Services"
          subtitle="Expert financial planning and investment strategy guidance to optimize your financial performance and growth."
          cardBgUrl="/images-optimized/Our Services/Data Analytics & Insights.webp"
          cardTitle="Financial Advisory Services"
        >
          <section className="relative z-10 max-w-none">
            <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
              Our financial advisory services provide comprehensive financial planning, investment analysis, and risk
              management solutions to help organizations optimize their financial performance. We work with finance
              teams to develop strategies that support business growth and long-term sustainability.
            </p>

            <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
            <ul className="space-y-3 md:space-y-4 mb-8">
              {[
                "Financial Planning and Budgeting: Strategic allocation of resources for maximum ROI.",
                "Investment Analysis and Portfolio Management: Data-backed decisions for capital deployment.",
                "Risk Management and Compliance: Navigating regulatory landscapes and mitigating financial risks.",
                "Budget Optimization and Cost Management: Streamlining expenses without compensating on quality."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Why Choose Our Financial Advisory?</h3>
              <p className="text-gray-800 leading-relaxed">
                Our financial experts bring deep industry knowledge and proven methodologies to help you make
                informed financial decisions. We focus on creating sustainable financial strategies that support
                your business objectives and drive long-term value creation.
              </p>
            </div>
          </section>
        </ServicePageShell>
      </div>
    </Layout>
  );
}
