/**
 * Markdown Editor Component
 * Simple markdown editor with toolbar and preview
 */

import { useState, useCallback, useRef } from 'react';
import { MarkdownToolbar } from './MarkdownToolbar';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: number;
}

export function MarkdownEditor({ value, onChange, placeholder = 'Write your content...', minHeight = 400 }: MarkdownEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = useCallback((before: string, after = '', placeholder = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end) || placeholder;
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    const handleToolbarAction = useCallback((action: string) => {
        switch (action) {
            case 'bold':
                insertText('**', '**', 'bold text');
                break;
            case 'italic':
                insertText('*', '*', 'italic text');
                break;
            case 'h1':
                insertText('# ', '', 'Heading 1');
                break;
            case 'h2':
                insertText('## ', '', 'Heading 2');
                break;
            case 'h3':
                insertText('### ', '', 'Heading 3');
                break;
            case 'link':
                insertText('[', '](url)', 'link text');
                break;
            case 'image':
                insertText('![', '](url)', 'alt text');
                break;
            case 'code':
                insertText('`', '`', 'code');
                break;
            case 'codeblock':
                insertText('```\n', '\n```', 'code block');
                break;
            case 'quote':
                insertText('> ', '', 'quote');
                break;
            case 'ul':
                insertText('- ', '', 'list item');
                break;
            case 'ol':
                insertText('1. ', '', 'list item');
                break;
        }
    }, [insertText]);

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-black">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 p-2">
                <MarkdownToolbar onAction={handleToolbarAction} />
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showPreview
                            ? 'bg-gold text-black'
                            : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    {showPreview ? 'Edit' : 'Preview'}
                </button>
            </div>

            {/* Editor / Preview */}
            {showPreview ? (
                <MarkdownPreview content={value} minHeight={minHeight} />
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ minHeight }}
                    className="w-full p-4 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-y font-mono text-sm"
                />
            )}

            {/* Character count */}
            <div className="px-4 py-2 border-t border-white/10 text-xs text-gray-500">
                {value.length.toLocaleString()} characters
            </div>
        </div>
    );
}

export default MarkdownEditor;
