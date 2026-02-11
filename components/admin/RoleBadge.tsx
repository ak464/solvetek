import { Shield, ShieldAlert, User } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
    switch (role) {
        case 'admin':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 border border-purple-200">
                    <ShieldAlert size={14} />
                    مشرف عام
                </span>
            );
        case 'editor':
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700 border border-blue-200">
                    <Shield size={14} />
                    محرر
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-600 border border-gray-200">
                    <User size={14} />
                    مستخدم
                </span>
            );
    }
}
