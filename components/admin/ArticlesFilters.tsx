"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';

type FilterProps = {
    categories: Array<{ id: string; name_ar: string; slug: string }>;
    authors: Array<{ id: string; username: string }>;
};

export function ArticlesFilters({ categories, authors }: FilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
    const [selectedAuthor, setSelectedAuthor] = useState(searchParams.get('author') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
    const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateURL();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        updateURL();
    }, [selectedCategory, selectedStatus, selectedAuthor, sortBy, sortOrder]);

    const updateURL = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedStatus) params.set('status', selectedStatus);
        if (selectedAuthor) params.set('author', selectedAuthor);
        if (sortBy !== 'created_at') params.set('sort', sortBy);
        if (sortOrder !== 'desc') params.set('order', sortOrder);

        router.push(`/admin/articles?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedStatus('');
        setSelectedAuthor('');
        setSortBy('created_at');
        setSortOrder('desc');
        router.push('/admin/articles');
    };

    const hasActiveFilters = searchTerm || selectedCategory || selectedStatus || selectedAuthor || sortBy !== 'created_at' || sortOrder !== 'desc';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* Search Bar */}
            <div className="flex gap-4 items-center mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث في عنوان المقال..."
                        className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Filter size={18} />
                    فلاتر
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-3 rounded-lg font-bold flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        <X size={18} />
                        مسح الكل
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">القسم</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        >
                            <option value="">كل الأقسام</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name_ar}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        >
                            <option value="">الكل</option>
                            <option value="published">منشور</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>

                    {/* Author Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الكاتب/المشرف</label>
                        <select
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        >
                            <option value="">كل الكتّاب</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الترتيب</label>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            >
                                <option value="created_at">تاريخ الإنشاء</option>
                                <option value="updated_at">آخر تحديث</option>
                                <option value="views_count">المشاهدات</option>
                                <option value="title">العنوان</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                title={sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
                            >
                                {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-bold text-gray-500">الفلاتر النشطة:</span>
                    {searchTerm && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                            بحث: {searchTerm}
                        </span>
                    )}
                    {selectedCategory && (
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
                            قسم: {categories.find(c => c.id === selectedCategory)?.name_ar}
                        </span>
                    )}
                    {selectedStatus && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                            {selectedStatus === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                    )}
                    {selectedAuthor && (
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                            كاتب: {authors.find(a => a.id === selectedAuthor)?.username}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
