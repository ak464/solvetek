"use client";

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackWidgetProps {
    articleTitle: string;
}

export function FeedbackWidget({ articleTitle }: FeedbackWidgetProps) {
    const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
    const [showContact, setShowContact] = useState(false);

    const handleVote = (type: 'yes' | 'no') => {
        setVoted(type);
        if (type === 'no') {
            setShowContact(true);
        }
    };

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`مرحباً سولفتيك، أحتاج مساعدة بخصوص مقال: ${articleTitle}`)}`;

    return (
        <div className="mt-16 bg-muted/50 border border-border rounded-[2rem] p-8 md:p-12 transition-all duration-500 overflow-hidden relative">
            <div className="relative z-10">
                {!voted ? (
                    <div className="text-center space-y-8">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-primary font-heading mb-3">هل أفادك هذا الشرح؟</h3>
                            <p className="text-muted-foreground font-bold text-sm">تقييمك يساعدنا على تحسين جودة المحتوى التقني في المملكة.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => handleVote('yes')}
                                className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-green-100 text-green-600 font-black rounded-2xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-green-900/10 group"
                            >
                                <ThumbsUp size={20} className="group-hover:scale-110 transition-transform" />
                                نعم، مفيد جداً
                            </button>
                            <button
                                onClick={() => handleVote('no')}
                                className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-red-100 text-red-400 font-black rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-red-900/10 group"
                            >
                                <ThumbsDown size={20} className="group-hover:scale-110 transition-transform" />
                                ليس تماماً
                            </button>
                        </div>
                    </div>
                ) : voted === 'yes' ? (
                    <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-500/5">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-primary font-heading mb-2">شكراً لتقييمك!</h3>
                        <p className="text-muted-foreground font-bold">يسعدنا أن الشرح كان مفيداً لك.</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-primary font-heading mb-3">نعتذر لذلك! 😔</h3>
                            <p className="text-muted-foreground font-bold text-sm mb-8">هل واجهت صعوبة في فهم الخطوات؟ يمكنك التواصل معنا مباشرة وسنساعدك.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-6 bg-[#25D366] text-white rounded-[1.5rem] flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform shadow-xl shadow-green-900/10"
                            >
                                <MessageCircle size={32} />
                                <span className="font-black text-sm">مساعدة عبر واتساب</span>
                            </a>
                            <button
                                onClick={() => setVoted(null)}
                                className="p-6 bg-card border border-border text-primary rounded-[1.5rem] flex flex-col items-center gap-3 hover:bg-muted transition-colors shadow-sm"
                            >
                                <Send size={32} className="text-primary" />
                                <span className="font-black text-sm">إرسال ملاحظة مكتوبة</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        </div>
    );
}
