/**
 * Tag Input Component
 * Input for managing array of tags
 */

import { useState, KeyboardEvent, useCallback } from 'react';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function TagInput({ value, onChange, placeholder = 'Add tag...', maxTags = 10 }: TagInputProps) {
    const [input, setInput] = useState('');

    const addTag = useCallback((tag: string) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
            onChange([...value, trimmed]);
        }
        setInput('');
    }, [value, onChange, maxTags]);

    const removeTag = useCallback((tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    }, [value, onChange]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-3 bg-black border border-white/10 rounded-lg focus-within:border-gold transition-colors">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold text-sm rounded-md"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-white transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => input && addTag(input)}
                    placeholder={value.length < maxTags ? placeholder : ''}
                    disabled={value.length >= maxTags}
                    className="flex-1 min-w-[100px] bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:opacity-50"
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">
                Press Enter or comma to add. {value.length}/{maxTags} tags.
            </p>
        </div>
    );
}

export default TagInput;
