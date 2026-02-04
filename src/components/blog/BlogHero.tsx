interface BlogHeroProps {
    parallax: number;
}

export function BlogHero({ parallax }: BlogHeroProps) {
    return (
        <section
            className="relative min-h-[50vh] flex items-center overflow-hidden"
            aria-label="Blog Hero"
        >
            {/* Background Elements */}
            <div
                className="absolute inset-0 -z-20 bg-[url('/next.svg')] bg-no-repeat bg-center opacity-[0.03]"
                style={{ transform: `translateY(${parallax * -1}px)` }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black z-0 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 relative z-10 w-full">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        Insights & Updates
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        NextGen <span className="text-gold">Insights</span>
                    </h1>

                    <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                        Explore the latest trends in digital transformation, business strategy, and technology innovation from our team of experts.
                    </p>
                </div>
            </div>
        </section>
    );
}
