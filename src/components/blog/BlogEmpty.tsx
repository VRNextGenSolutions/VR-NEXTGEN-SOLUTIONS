export function BlogEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5 p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white/50">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 max-w-md">
                We couldn't find any articles matching your criteria. Try adjusting your filters or check back later.
            </p>
        </div>
    );
}
