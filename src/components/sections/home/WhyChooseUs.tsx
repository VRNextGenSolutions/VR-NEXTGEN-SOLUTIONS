import React from "react";
import { Container, SectionHeader } from "@/components/common";

export default function WhyChooseUs() {
    return (
        <section className="py-16 md:py-24 bg-black relative border-t border-white/10">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
            </div>

            <Container className="relative z-10">
                <SectionHeader
                    title="Why Choose VR NextGen Solutions"
                    titleColor="gold"
                    description="We combine deep industry expertise with advanced analytics and automation to deliver transformative results."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                    <div className="p-6">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Expert Team</h3>
                        <p className="text-white/70 leading-relaxed">Deep industry knowledge and technical expertise to solve your most complex operational challenges.</p>
                    </div>
                    <div className="p-6 border-x border-white/5">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Proven Results</h3>
                        <p className="text-white/70 leading-relaxed">A strong track record of delivering measurable ROI, reducing costs, and improving efficiency for our clients.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Tailored Solutions</h3>
                        <p className="text-white/70 leading-relaxed">Customized strategies designed specifically for your unique business needs and organizational goals.</p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
