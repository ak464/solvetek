"use client";

import { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function CommentForm({ articleId, parentId, onCancel }: { articleId: number, parentId?: number, onCancel?: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                setUser({ ...user, username: profile?.username });
            }
            setLoadingUser(false);
        }
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setMessage('');

        // If user is logged in, we don't need to send name/email as API will handle it
        const payload = {
            articleId,
            parentId,
            content,
            // Only send name/email if NOT logged in
            ...(user ? {} : { name, email })
        };

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'فشل إرسال التعليق');
            }

            setStatus('success');
            setMessage(user ? 'تم نشر تعليقك بنجاح!' : 'تم إرسال تعليقك بنجاح! سيظهر بعد المراجعة.');
            if (!user) {
                setName('');
                setEmail('');
            }
            setContent('');

            if (onCancel) {
                setTimeout(onCancel, 3000);
            } else if (user) {
                // Reset status after a delay for admins so they can comment again
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || 'حدث خطأ أثناء إرسال التعليق. حاول مرة أخرى.');
        }
    };

    if (loadingUser) return <div className="p-4 text-center text-sm text-muted-foreground">جاري التحميل...</div>;

    return (
        <div className={`bg-muted/30 p-6 rounded-2xl border border-border ${parentId ? 'mt-4' : 'mt-8'}`}>
            <h3 className="font-bold text-lg mb-4 text-foreground">
                {parentId ? 'إضافة رد' : 'شاركنا برأيك'}
            </h3>

            {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-2">
                    <CheckCircle size={20} />
                    <span className="font-bold">{message}</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {user ? (
                        <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 p-3 rounded-lg mb-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            التعليق باسم: {user.username || 'مسؤول'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="الاسم"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                            />
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني (لن ينشر)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    )}

                    <textarea
                        placeholder="اكتب تعليقك هنا..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                    ></textarea>

                    {status === 'error' && (
                        <div className="text-red-500 text-sm font-bold flex items-center gap-2">
                            <AlertCircle size={16} />
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'جاري الإرسال...' : (
                                <>
                                    <Send size={18} />
                                    {parentId ? 'إرسال الرد' : 'إرسال التعليق'}
                                </>
                            )}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-muted text-muted-foreground font-bold px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                إلغاء
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
