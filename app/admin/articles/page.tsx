import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteArticleButton } from "@/components/features/admin/DeleteArticleButton";
import { ArticlesFilters } from "@/components/admin/ArticlesFilters";
import { EnhancedPagination } from "@/components/admin/EnhancedPagination";
import { ArticlesTableClient } from "@/components/admin/ArticlesTableClient";
import { ArticlesStats } from "@/components/admin/ArticlesStats";
import { ArticlesTableSkeleton, ArticlesStatsSkeleton } from "@/components/admin/ArticlesSkeletons";
import { Suspense } from "react";

type SearchParams = {
    search?: string;
    category?: string;
    status?: string;
    author?: string;
    sort?: string;
    order?: string;
    page?: string;
    limit?: string;
};

async function ArticlesTable({ searchParams, categories }: { searchParams: SearchParams, categories: any[] }) {
    const supabase = await createClient();

    // Build query
    let query = supabase
        .from("articles")
        .select("*, category:categories(*), author:profiles!articles_author_id_fkey(username)", { count: 'exact' });

    // Apply search filter - search in title only for better performance
    if (searchParams.search) {
        query = query.ilike('title', `%${searchParams.search}%`);
    }

    // Apply category filter
    if (searchParams.category) {
        query = query.eq('category_id', searchParams.category);
    }

    // Apply author filter
    if (searchParams.author) {
        query = query.eq('author_id', searchParams.author);
    }

    // Apply status filter
    if (searchParams.status === 'published') {
        query = query.eq('is_published', true);
    } else if (searchParams.status === 'draft') {
        query = query.eq('is_published', false);
    }

    // Apply sorting
    const sortBy = searchParams.sort || 'created_at';
    const sortOrder = searchParams.order === 'asc';
    query = query.order(sortBy, { ascending: sortOrder });

    // Pagination
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '20');
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: articles, count } = await query;
    const totalPages = Math.ceil((count || 0) / limit);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Stats Bar */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex gap-6">
                        <div>
                            <span className="text-sm text-gray-500 font-medium">إجمالي النتائج: </span>
                            <span className="text-lg font-black text-gray-900">{count || 0}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 font-medium">الصفحة: </span>
                            <span className="text-lg font-black text-blue-600">{page} / {totalPages || 1}</span>
                        </div>
                    </div>
                </div>

                <ArticlesTableClient articles={articles || []} categories={categories || []} />
            </div>


            <EnhancedPagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                from={from}
                to={to}
                count={count || 0}
                searchParams={searchParams}
            />
        </>
    );
}

export default async function ArticlesListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const supabase = await createClient();

    // Fetch categories for filter
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name_ar, slug')
        .order('name_ar');

    // Fetch authors/admins for filter
    const { data: authors } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('role', 'admin')
        .order('username');

    // Calculate statistics
    const { data: statsData } = await supabase
        .from('articles')
        .select('is_published, views_count');

    const stats = {
        total: statsData?.length || 0,
        published: statsData?.filter(a => a.is_published).length || 0,
        drafts: statsData?.filter(a => !a.is_published).length || 0,
        totalViews: statsData?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0,
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">كل المقالات</h1>
                <Link
                    href="/admin/articles/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
                >
                    + مقال جديد
                </Link>
            </header>

            <ArticlesStats
                total={stats.total}
                published={stats.published}
                drafts={stats.drafts}
                totalViews={stats.totalViews}
            />

            <ArticlesFilters categories={categories || []} authors={authors || []} />

            <Suspense fallback={
                <div>
                    <ArticlesStatsSkeleton />
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>
                    <ArticlesTableSkeleton />
                </div>
            }>
                <ArticlesTable searchParams={params} categories={categories || []} />
            </Suspense>
        </div>
    );
}
