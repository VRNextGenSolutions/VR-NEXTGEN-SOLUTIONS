/**
 * Markdown Toolbar Component
 * Formatting buttons for the editor
 */

interface MarkdownToolbarProps {
    onAction: (action: string) => void;
}

interface ToolbarButton {
    action: string;
    label: string;
    icon: React.ReactNode;
}

const buttons: ToolbarButton[] = [
    {
        action: 'bold',
        label: 'Bold',
        icon: <span className="font-bold">B</span>,
    },
    {
        action: 'italic',
        label: 'Italic',
        icon: <span className="italic">I</span>,
    },
    {
        action: 'h1',
        label: 'Heading 1',
        icon: <span className="text-xs font-bold">H1</span>,
    },
    {
        action: 'h2',
        label: 'Heading 2',
        icon: <span className="text-xs font-bold">H2</span>,
    },
    {
        action: 'h3',
        label: 'Heading 3',
        icon: <span className="text-xs font-bold">H3</span>,
    },
    {
        action: 'link',
        label: 'Link',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
    },
    {
        action: 'image',
        label: 'Image',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        action: 'code',
        label: 'Inline Code',
        icon: <span className="font-mono text-xs">{`<>`}</span>,
    },
    {
        action: 'codeblock',
        label: 'Code Block',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
    },
    {
        action: 'quote',
        label: 'Quote',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
    },
    {
        action: 'ul',
        label: 'Bullet List',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        ),
    },
];

export function MarkdownToolbar({ onAction }: MarkdownToolbarProps) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {buttons.map((btn, idx) => (
                <button
                    key={btn.action}
                    type="button"
                    onClick={() => onAction(btn.action)}
                    title={btn.label}
                    className={`p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors ${idx === 4 || idx === 6 || idx === 9 ? 'mr-2' : ''
                        }`}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
}

export default MarkdownToolbar;
