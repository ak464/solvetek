"use client";

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { RoleBadge } from './RoleBadge';
import { Shield, ShieldAlert, User, MoreVertical, Loader2, Circle, UserPlus, X, Copy, Check, MailCheck } from 'lucide-react';

type Profile = {
    id: string;
    username: string;
    avatar_url: string;
    role: 'admin' | 'editor' | 'user';
    last_seen: string | null;
    created_at: string;
};

export function UserList() {
    const supabase = createClient();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [confirming, setConfirming] = useState<string | null>(null);
    const [editingName, setEditingName] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");
    const [showInviteHelp, setShowInviteHelp] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('last_seen', { ascending: false }); // Show active users first

        if (data) setUsers(data as Profile[]);
        setLoading(false);
    }

    async function updateUserRole(userId: string, newRole: string) {
        setUpdating(userId);
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert('فشل تحديث الصلاحية: ' + error.message);
        } else {
            // Optimistic update
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        }
        setUpdating(null);
    }

    const startEditingKey = (user: Profile) => {
        setEditingName(user.id);
        setTempName(user.username || "");
    };

    const saveName = async (userId: string) => {
        if (!tempName.trim()) {
            setEditingName(null);
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ username: tempName })
            .eq('id', userId);

        if (error) {
            alert('فشل تحديث الاسم: ' + error.message);
        } else {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, username: tempName } : u));
        }
        setEditingName(null);
    };

    const confirmEmail = async (userId: string) => {
        if (!confirm('هل تريد تأكيد إيميل هذا المستخدم؟')) return;

        setConfirming(userId);
        const response = await fetch('/api/admin/users/confirm-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (response.ok) {
            alert('✅ تم تأكيد الإيميل بنجاح!');
            fetchUsers(); // Refresh list
        } else {
            const data = await response.json();
            alert('❌ فشل تأكيد الإيميل: ' + (data.error || 'خطأ غير معروف'));
        }
        setConfirming(null);
    };

    const isOnline = (lastSeen: string | null) => {
        if (!lastSeen) return false;
        const diff = new Date().getTime() - new Date(lastSeen).getTime();
        return diff < 2 * 60 * 1000; // Online if seen in last 2 minutes
    };

    const formatLastSeen = (lastSeen: string | null) => {
        if (!lastSeen) return 'لم يسجل دخول';

        const now = new Date().getTime();
        const then = new Date(lastSeen).getTime();
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / (60 * 1000));
        const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

        if (diffMins < 2) return 'متصل الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays === 1) return 'أمس';
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;

        return new Date(lastSeen).toLocaleDateString('ar-SA');
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12 text-gray-400">
            <Loader2 className="animate-spin mr-2" /> جاري تحميل الأعضاء...
        </div>
    );

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative">
            {/* Header Actions */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-bold text-gray-700">قائمة الأعضاء ({users.length})</h3>
                <button
                    onClick={() => setShowInviteHelp(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <UserPlus size={16} />
                    إضافة مشرف جديد
                </button>
            </div>

            {/* Invite Modal */}
            {showInviteHelp && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowInviteHelp(false)}>
                    <div
                        className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowInviteHelp(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="text-xl font-black text-[#003366]">كيف تضيف مشرفاً جديداً؟</h3>
                            <p className="text-sm text-gray-500 font-bold leading-relaxed">
                                نظام الحماية يتطلب أن يقوم كل شخص بتسجيل حسابه بنفسه لضمان أمان كلمة المرور.
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-6 w-full text-right space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                                    <p className="text-xs font-bold text-gray-600">أرسل رابط التسجيل للشخص:</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg" dir="ltr">
                                    <code className="text-[10px] text-gray-500 flex-1 truncate">{typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}</code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(window.location.origin + '/login')}
                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"
                                        title="نسخ الرابط"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                                    <p className="text-xs font-bold text-gray-600">اطلب منه اختيار "تسجيل جديد" وإنشاء حساب.</p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                                    <p className="text-xs font-bold text-gray-600">بمجرد تسجيله، سيظهر اسمه في هذه القائمة فوراً، ويمكنك ترقيته إلى "مشرف" من زر الصلاحية.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowInviteHelp(false)}
                                className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition"
                            >
                                فهمت، شكراً
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                            <th className="px-6 py-4">العضو</th>
                            <th className="px-6 py-4">الصلاحية</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">تاريخ الانضمام</th>
                            <th className="px-6 py-4">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => {
                            const online = isOnline(user.last_seen);
                            const isEditing = editingName === user.id;

                            return (
                                <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative shrink-0">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                                                )}
                                                {online && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                )}
                                            </div>
                                            <div>
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            autoFocus
                                                            className="text-sm border border-blue-500 rounded px-2 py-0.5 w-32 outline-none"
                                                            value={tempName}
                                                            onChange={e => setTempName(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') saveName(user.id);
                                                                if (e.key === 'Escape') setEditingName(null);
                                                            }}
                                                            onBlur={() => saveName(user.id)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => startEditingKey(user)}
                                                        className="font-black text-[#003366] text-sm cursor-pointer hover:text-blue-600 flex items-center gap-1 group/name"
                                                    >
                                                        {user.username || 'مستخدم بدون اسم'}
                                                        <span className="opacity-0 group-hover/name:opacity-100 text-[10px] text-gray-400 font-normal">(تعديل)</span>
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-gray-400 font-bold font-mono truncate max-w-[150px]" title={user.id}>{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {online ? (
                                                <>
                                                    <Circle size={8} className="text-green-500 fill-green-500 animate-pulse" />
                                                    <span className="text-xs font-bold text-green-600">متصل الآن</span>
                                                </>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-500">
                                                        {formatLastSeen(user.last_seen)}
                                                    </span>
                                                    {user.last_seen && (
                                                        <span className="text-[10px] text-gray-400" title={new Date(user.last_seen).toLocaleString('ar-SA')}>
                                                            {new Date(user.last_seen).toLocaleDateString('ar-SA')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            {updating === user.id ? (
                                                <Loader2 size={16} className="animate-spin text-blue-600" />
                                            ) : (
                                                <select
                                                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1} // Prevent removing last admin (basic check)
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                    className="bg-transparent text-xs font-bold text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:border-blue-500 focus:outline-none cursor-pointer hover:bg-white hover:shadow-sm transition-all"
                                                >
                                                    <option value="user">مستخدم (User)</option>
                                                    <option value="editor">محرر (Editor)</option>
                                                    <option value="admin">مشرف (Admin)</option>
                                                </select>
                                            )}

                                            {/* Confirm Email Button */}
                                            {confirming === user.id ? (
                                                <Loader2 size={16} className="animate-spin text-green-600" />
                                            ) : (
                                                <button
                                                    onClick={() => confirmEmail(user.id)}
                                                    className="p-1.5 hover:bg-green-50 rounded text-gray-400 hover:text-green-600 transition-colors"
                                                    title="تأكيد الإيميل"
                                                >
                                                    <MailCheck size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="p-12 text-center text-gray-400 font-bold">لا يوجد أعضاء في قاعدة البيانات.</div>
            )}
        </div>
    );
}
