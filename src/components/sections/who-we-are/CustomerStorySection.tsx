import { use3DTilt } from "@/hooks/use3DTilt";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Link from "next/link";
import Image from "next/image";

const customerStories = [
  {
    title: "Data-Driven Reporting Automation",
    company: "Alleima India Pvt. Ltd.",
    industry: "Manufacturing & Logistics",
    challenge: "Manual Excel-based reporting processes causing inefficiencies and reduced visibility.",
    solution: "Developed an interactive OSP Dashboard tailored to business requirements and provided Power BI training.",
    results: [
      "Automated Excel-based reporting system",
      "Interactive OSP Dashboard development",
      "Improved reporting accuracy",
      "Enhanced operational visibility",
      "Increased process efficiency",
      "Power BI capability development"
    ],
    testimonial: "VR NextGen Solutions successfully automated our Excel-based reporting processes and developed an interactive OSP Dashboard tailored to our business requirements. Their team demonstrated strong technical expertise, professionalism, and commitment throughout the project. The solution has significantly improved reporting accuracy, operational visibility, and overall efficiency. Additionally, the Power BI training provided to our team was highly valuable and enhanced our analytical capabilities.",
    author: "Nimit Dabhi, Senior General Manager – SCM & APAC Logistics",
    image: "/images/testimonials/alleima.jpeg"
  },
  {
    title: "Operational Excellence & Lean Training",
    company: "HG Aluminium Smelters Limited",
    industry: "Manufacturing",
    challenge: "Need for practical training on 5S, Kaizen, Lean Manufacturing, and Six Sigma to improve workplace organization.",
    solution: "Delivered a highly practical, engaging training program tailored to the manufacturing environment using real-life examples.",
    results: [
      "Enhanced ability to identify waste",
      "Improved workplace organization",
      "Enhanced process efficiency",
      "Fostered a culture of continuous improvement"
    ],
    testimonial: "We had the opportunity to work with VR Next Gen Solutions for a comprehensive training program on 5S, Kaizen, Lean Manufacturing, and Six Sigma. The training was highly practical, engaging, and tailored to our manufacturing environment. The team demonstrated excellent subject expertise and explained complex concepts through real-life industrial examples, making them easy to understand and implement. The sessions encouraged active participation and provided our employees with practical tools to identify waste, improve workplace organization, enhance process efficiency, and foster a culture of continuous improvement.",
    author: "Mr. Harsh Patel, Management Team",
    image: "/images/testimonials/hg-extrusion.jpeg"
  }
];

function StoryCard({ story }: { story: typeof customerStories[0] }) {
  const { cardRef, onMouseMove, onMouseLeave } = use3DTilt();

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group bg-gradient-to-br from-white/90 to-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-sand-yellow/50 hover:from-white hover:to-gray-100 transition-all duration-500 card-3d hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] active:scale-[1.02] active:shadow-[0_0_20px_rgba(255,215,0,0.25)] relative overflow-hidden"
    >
      <div className="space-y-6">
        {/* Story Image */}
        {story.image && (
          <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <Image 
              src={story.image} 
              alt={`${story.company} Customer Story`} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sand-yellow/10 rounded-xl flex items-center justify-center text-sand-yellow group-hover:bg-sand-yellow/20 group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black group-hover:text-sand-yellow transition-colors duration-300">
                {story.title}
              </h3>
              <p className="text-sm text-black/60">{story.company} • {story.industry}</p>
            </div>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-2">Challenge</h4>
            <p className="text-black/70 text-sm leading-relaxed">{story.challenge}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-2">Solution</h4>
            <p className="text-black/70 text-sm leading-relaxed">{story.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-black/60 uppercase tracking-wider">Results</h4>
          <ul className="space-y-2">
            {story.results.map((result, index) => (
              <li key={index} className="flex items-center gap-3 text-black/70">
                <div className="w-1.5 h-1.5 bg-sand-yellow rounded-full flex-shrink-0"></div>
                <span className="text-sm font-medium">{result}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="pt-4 border-t border-gray-200">
          <blockquote className="text-black/80 italic text-sm leading-relaxed mb-3">
            &ldquo;{story.testimonial}&rdquo;
          </blockquote>
          <cite className="text-xs text-black/60 font-medium">— {story.author}</cite>
        </div>
      </div>
      
      {/* Brightness overlay for consistent hover effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-black opacity-0 group-hover:opacity-10 active:opacity-10 transition-opacity duration-300" />
    </div>
  );
}

export default function CustomerStorySection() {
  return (
    <ErrorBoundary>
      <section id="customer-stories" className="section-services relative py-16 md:py-24" aria-label="Customer Stories">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sand-yellow/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sand-yellow/10 rounded-full blur-2xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sand-yellow/10 border border-sand-yellow/30 rounded-full text-sand-yellow text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-sand-yellow rounded-full animate-pulse" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-sand-yellow mb-6">
              Customer Stories
            </h2>
            <p className="text-lg text-black/70 max-w-3xl mx-auto leading-relaxed">
              Real transformations, real results. Discover how we&apos;ve helped businesses across industries achieve their goals and drive sustainable growth.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {customerStories.map((story) => (
              <StoryCard key={story.title} story={story} />
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex justify-center items-center px-8 py-4 bg-sand-yellow text-black font-semibold rounded-lg hover:bg-sand-yellow/90 transition-colors duration-300 btn-enhanced">
                Share Your Story
              </Link>
              <Link href="/insights" className="inline-flex justify-center items-center px-8 py-4 border border-sand-yellow/50 text-sand-yellow font-semibold rounded-lg hover:bg-sand-yellow/10 transition-colors duration-300 btn-enhanced">
                View All Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
