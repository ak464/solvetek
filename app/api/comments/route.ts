import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { articleId, name, email, content, parentId } = await req.json();

        // Check for authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        let finalName = name;
        let finalEmail = email;
        let isApproved = false;
        let userId = null;

        if (user) {
            // Fetch profile for name and role
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, username, role')
                .eq('id', user.id)
                .single();

            if (profile) {
                // Profile exists, we can link user_id safely (references profiles.id)
                userId = profile.id;
                finalName = profile.username || name || user.email?.split('@')[0] || 'User';

                // If admin, auto-approve
                if (profile.role === 'admin' || profile.role === 'owner') {
                    isApproved = true;
                    finalEmail = user.email || email;
                } else {
                    // Check site settings for auto-approval
                    const { data: setting } = await supabase
                        .from('site_settings')
                        .select('value')
                        .eq('key', 'comments_require_approval')
                        .single();

                    // If Require Approval is FALSE (default), then isApproved = TRUE
                    // If Require Approval is TRUE, then isApproved = FALSE
                    const requireApproval = setting?.value === 'true';
                    isApproved = !requireApproval;

                    finalEmail = user.email || email;
                }
            } else {
                // User logged in but NO PROFILE found.
                userId = null;
                finalEmail = user.email || email;

                // Check settings for anonymous/no-profile users too
                const { data: setting } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'comments_require_approval')
                    .single();

                const requireApproval = setting?.value === 'true';
                isApproved = !requireApproval;
            }
        } else {
            // Anonymous User
            const { data: setting } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'comments_require_approval')
                .single();

            const requireApproval = setting?.value === 'true';
            isApproved = !requireApproval;
        }

        // Validation - Check final values
        if (!articleId || !content || !finalName || !finalEmail) {
            return NextResponse.json({ error: "Missing required fields (Name, Email, Content)" }, { status: 400 });
        }

        // Check if comments are locked for this article
        const { data: article } = await supabase
            .from('articles')
            .select('comments_locked')
            .eq('id', articleId)
            .single();

        if (article?.comments_locked) {
            return NextResponse.json({ error: "Comments are locked for this article" }, { status: 403 });
        }

        // Insert Comment
        const { error } = await supabase.from('comments').insert({
            article_id: articleId,
            parent_id: parentId || null,
            user_id: userId,
            name: finalName,
            email: finalEmail,
            content,
            is_approved: isApproved,
            ip_address: req.headers.get("x-forwarded-for") || "unknown"
        });

        if (error) {
            console.error("Comment submission error:", error);
            return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: isApproved ? "Comment added" : "Comment pending approval" });

    } catch (error) {
        console.error("Comment API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
