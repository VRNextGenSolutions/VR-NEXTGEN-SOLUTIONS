import type { BlogComment } from '@/types/blog';
import { formatDate, formatRelativeDate } from '@/utils/blog/helpers';

interface CommentListProps {
    comments: BlogComment[];
}

export function CommentList({ comments }: CommentListProps) {
    if (comments.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">
                Comments ({comments.length})
            </h3>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">
                                    {comment.author_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{comment.author_name}</h4>
                                    <span className="text-xs text-gray-400">
                                        {formatRelativeDate(comment.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
