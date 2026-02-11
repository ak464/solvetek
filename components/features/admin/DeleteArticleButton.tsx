"use client";

import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteArticleButton({ articleId }: { articleId: number }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.")) {
            return;
        }

        setIsDeleting(true);
        const supabase = createClient();
        console.log("Deleting article:", articleId);

        const { error, count } = await supabase.from('articles').delete().eq('id', articleId);

        if (error) {
            console.error("Delete error:", error);
            alert("فشل الحذف: " + error.message);
        } else {
            console.log("Delete success, refreshing...");
            router.refresh();
            // Force reload if refresh doesn't update the list immediately due to caching
            setTimeout(() => window.location.reload(), 500);
        }
        setIsDeleting(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="حذف المقال"
        >
            <Trash2 size={18} />
        </button>
    );
}
