import Layout from "@/components/layout/Layout";
import IndustryPageShell from "@/components/sections/industries/IndustryPageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function FinancialServicesInsurance() {
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'What We Do', url: '/what-we-do' },
      { name: 'Financial Services', url: '/industries/financial-services-insurance' }
    ]),
    getServiceSchema({
      name: 'Financial Services & Insurance Consulting',
      description: PAGE_SEO.industries.finance.description,
      url: '/industries/financial-services-insurance'
    })
  ];

  return (
    <Layout
      title={PAGE_SEO.industries.finance.title}
      description={PAGE_SEO.industries.finance.description}
    >
      <SEOHead
        title={PAGE_SEO.industries.finance.title}
        description={PAGE_SEO.industries.finance.description}
        canonical="/industries/financial-services-insurance"
        keywords={PAGE_SEO.industries.finance.keywords}
        structuredData={structuredData}
      />
      <IndustryPageShell>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/30 rounded-full text-gold text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Financial Services & Insurance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Financial Services & Insurance
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Risk management and digital banking solutions for financial institutions and insurance companies.
            </p>
          </div>

          <div
            className="relative rounded-2xl shadow-lg p-8 md:p-12 border border-gold/30 overflow-hidden"
            style={{
              backgroundImage: "url('/images-optimized/Industries/Financial.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Empowering Financial Clarity and Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Finance runs on accuracy, speed, and insight.</p>
              <p className="text-gray-300 leading-relaxed mb-6">
                We provide advanced analytics, automation, and reporting frameworks that help financial institutions manage risk, ensure compliance, and improve profitability.
              </p>
              <p className="text-white leading-relaxed text-lg">💰 Where precision meets performance.</p>
            </div>
          </div>
        </div>
      </IndustryPageShell>
    </Layout>
  );
}
