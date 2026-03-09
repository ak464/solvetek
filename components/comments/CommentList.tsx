"use client";

import { useState } from 'react';
import { User, MessageCircle, CornerDownRight } from 'lucide-react';
import { CommentForm } from './CommentForm';

type CommentProps = {
    id: number;
    name: string;
    content: string;
    created_at: string;
    replies?: CommentProps[];
    profile?: {
        role: string;
        username: string;
    };
};

export function CommentList({ comments, articleId, isLocked }: { comments: CommentProps[], articleId: number, isLocked: boolean }) {
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    return (
        <>
            <div className="space-y-8 mb-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="group">
                        {/* Parent Comment */}
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${comment.profile?.role === 'admin' || comment.profile?.role === 'owner'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-muted text-muted-foreground border-border'
                                }`}>
                                <User size={20} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">{comment.profile?.username || comment.name}</span>
                                    {(comment.profile?.role === 'admin' || comment.profile?.role === 'owner') && (
                                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                                            مسؤول
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                                    </span>
                                </div>
                                <p className="text-foreground/90 leading-relaxed text-sm">
                                    {comment.content}
                                </p>

                                {/* Reply Button */}
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors mt-1"
                                >
                                    <MessageCircle size={14} />
                                    {replyingTo === comment.id ? 'إلغاء' : 'رد'}
                                </button>

                                {/* Reply Form */}
                                {replyingTo === comment.id && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                        <CommentForm
                                            articleId={articleId}
                                            parentId={comment.id}
                                            onCancel={() => setReplyingTo(null)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mr-6 mt-4 pr-6 border-r-2 border-border/50 space-y-6">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${reply.profile?.role === 'admin' || reply.profile?.role === 'owner'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-muted/50 text-muted-foreground border-border'
                                            }`}>
                                            <User size={16} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-foreground text-sm">{reply.profile?.username || reply.name}</span>
                                                {(reply.profile?.role === 'admin' || reply.profile?.role === 'owner') && (
                                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                                        مسؤول
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(reply.created_at).toLocaleDateString('ar-SA')}
                                                </span>
                                            </div>
                                            <p className="text-foreground/80 leading-relaxed text-sm">
                                                {reply.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Comment Form (Hidden when replying) */}
            {replyingTo === null && (
                <div className="mt-12 pt-8 border-t border-border">
                    {isLocked ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl text-center text-yellow-700 dark:text-yellow-400 font-bold border border-yellow-200 dark:border-yellow-900/30">
                            تم إغلاق التعليقات على هذا المقال.
                        </div>
                    ) : (
                        <CommentForm articleId={articleId} />
                    )}
                </div>
            )}
        </>
    );
}
