/**
 * Empty State Component
 * Displayed when there's no data
 */

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    title = 'No data',
    message = 'No items to display.',
    icon,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                {icon || (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm max-w-sm">{message}</p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 px-4 py-2 bg-gold text-black font-medium rounded-lg hover:bg-gold/90 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
