export function BlogSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="border border-white/10 rounded-xl overflow-hidden bg-white/5 animate-pulse h-full flex flex-col"
                >
                    <div className="h-48 bg-white/10 w-full" />
                    <div className="p-6 flex-grow flex flex-col space-y-4">
                        <div className="h-4 w-24 bg-white/10 rounded" />
                        <div className="h-7 w-3/4 bg-white/10 rounded" />
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-2/3 bg-white/10 rounded" />
                        <div className="mt-auto h-4 w-20 bg-white/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
