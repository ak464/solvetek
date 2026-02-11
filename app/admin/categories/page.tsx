import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { FolderOpen } from "lucide-react";

export const metadata = {
    title: "إدارة الأقسام | لوحة التحكم",
};

export default function CategoriesPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#003366] to-[#004080] p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black mb-2">إدارة الأقسام</h1>
                        <p className="text-blue-100 font-bold opacity-80 text-lg">تحكم كامل في أقسام الموقع: إضافة، تعديل، وترتيب.</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                        <FolderOpen size={32} className="text-white" />
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <CategoriesManager />
        </div>
    );
}
