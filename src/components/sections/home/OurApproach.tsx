import React from "react";
import { Container, SectionHeader } from "@/components/common";

export default function OurApproach() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 relative border-t border-white/10">
            <Container>
                <SectionHeader
                    title="Our Approach (Data → Insights → Action)"
                    titleColor="white"
                    description="A proven methodology to unlock value, streamline operations, and drive sustainable business growth."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 relative">

                    {/* Connecting Line (desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 -translate-y-12 z-0" />

                    {/* 1. Data */}
                    <div className="bg-black/60 p-8 rounded-2xl border border-white/10 text-center relative z-10 hover:border-gold/50 transition-colors duration-300">
                        <div className="w-12 h-12 mx-auto mb-6 bg-gold text-black rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                            1
                        </div>
                        <h3 className="text-2xl font-bold text-gold mb-4">Data</h3>
                        <p className="text-white/70 leading-relaxed">
                            We aggregate, clean, and analyze your core business data to establish a single source of truth for your operations.
                        </p>
                    </div>

                    {/* 2. Insights */}
                    <div className="bg-black/60 p-8 rounded-2xl border border-white/10 text-center relative z-10 hover:border-gold/50 transition-colors duration-300">
                        <div className="w-12 h-12 mx-auto mb-6 bg-gold text-black rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                            2
                        </div>
                        <h3 className="text-2xl font-bold text-gold mb-4">Insights</h3>
                        <p className="text-white/70 leading-relaxed">
                            We leverage advanced analytics and visualization tools to uncover hidden patterns and strategic opportunities.
                        </p>
                    </div>

                    {/* 3. Action */}
                    <div className="bg-black/60 p-8 rounded-2xl border border-white/10 text-center relative z-10 hover:border-gold/50 transition-colors duration-300">
                        <div className="w-12 h-12 mx-auto mb-6 bg-gold text-black rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                            3
                        </div>
                        <h3 className="text-2xl font-bold text-gold mb-4">Action</h3>
                        <p className="text-white/70 leading-relaxed">
                            We implement intelligent automation workflows and optimize processes to turn strategic insights into measurable ROI.
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
