import Layout from "@/components/layout/Layout";
import ServicePageShell from "@/components/sections/services/ServicePageShell";
import { SEOHead, getOrganizationSchema, getBreadcrumbSchema, getServiceSchema } from "@/components/seo";
import { PAGE_SEO } from "@/config/seo.config";

export default function ChangeManagement() {
  // Structured data for SEO
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'What We Do', url: '/what-we-do' },
      { name: 'Change Management', url: '/services/change-management' }
    ]),
    getServiceSchema({
      name: 'Change Management Consulting',
      description: PAGE_SEO.services.changeManagement.description,
      url: '/services/change-management'
    })
  ];

  return (
    <Layout
      title={PAGE_SEO.services.changeManagement.title}
      description={PAGE_SEO.services.changeManagement.description}
    >
      <SEOHead
        title={PAGE_SEO.services.changeManagement.title}
        description={PAGE_SEO.services.changeManagement.description}
        canonical="/services/change-management"
        keywords={PAGE_SEO.services.changeManagement.keywords}
        structuredData={structuredData}
      />
      <div className="min-h-screen pt-20 pb-16">
        <ServicePageShell
          badgeText="Change Management"
          title="Change Management Services"
          subtitle="Guide your organization through successful transformation initiatives with proven change management strategies."
          cardBgUrl="/images-optimized/Our Services/Process Optimization & Alignment.webp"
          cardTitle="Change Management Services"
        >
          <section className="relative z-10 max-w-none">
            <h2 className="text-2xl font-bold text-black mb-6">Service Overview</h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
              Our change management services help organizations navigate complex transformations by providing structured
              approaches to managing change, building stakeholder buy-in, and ensuring successful implementation. We
              focus on creating sustainable change that delivers lasting business value.
            </p>

            <h3 className="text-xl font-semibold text-black mb-4">Key Features</h3>
            <ul className="space-y-3 md:space-y-4 mb-8">
              {[
                "Organizational Change and Transformation: Structured frameworks for managing large-scale shifts.",
                "Training Programs and Skill Development: Empowering teams with the capabilities needed for new ways of working.",
                "Communication Strategy and Stakeholder Engagement: Ensuring alignment and buy-in at all levels.",
                "Success Metrics and Change Measurement: Tracking adoption and impact to ensure ROI."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group transition-transform duration-200 ease-out hover:translate-x-1">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-black text-xs font-bold transition-transform group-hover:scale-110">✓</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6">
              <h3 className="text-xl font-semibold text-black mb-2">Why Choose Our Change Management?</h3>
              <p className="text-gray-800 leading-relaxed">
                Our change management experts use proven methodologies and best practices to help organizations
                successfully navigate complex transformations. We focus on building internal capabilities and
                creating sustainable change that drives long-term business success.
              </p>
            </div>
          </section>
        </ServicePageShell>
      </div>
    </Layout>
  );
}
