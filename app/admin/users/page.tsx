import { UserList } from "@/components/admin/UserList";
import { Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h2 className="text-2xl font-black text-[#003366] flex items-center gap-3">
                    <Users className="text-blue-600" />
                    إدارة المستخدمين والصلاحيات
                </h2>
                <p className="text-gray-500 text-sm font-bold mt-1">
                    هنا يمكنك رؤية جميع الأعضاء المسجلين، معرفة المتصلين حالياً، وتغيير صلاحياتهم بين (مستخدم، محرر، مشرف).
                </p>
            </div>

            <UserList />
        </div>
    );
}
