export function ArticleCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-5 space-y-4">
                <div className="flex gap-2">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-24 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-md w-full" />
                    <div className="h-4 bg-gray-100 rounded-md w-2/3" />
                </div>
                <div className="pt-4 flex items-center gap-3 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );
}
