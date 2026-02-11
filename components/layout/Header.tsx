"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Smartphone, Wifi, Cpu, Layers, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/types/database";
import { CATEGORY_ICONS } from "@/lib/config/icons"; // Import global icons

export function Header({ categories = [], siteName = "SolveTek" }: { categories?: Category[], siteName?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: "الرئيسية", href: "/", icon: null },
        ...categories.map(cat => {
            // Get the icon component from our map or fallback to 'default'
            // We cast to any because Lucide icons are valid React components
            const IconComponent = (CATEGORY_ICONS[cat.icon_name || ''] || CATEGORY_ICONS.default);
            return {
                name: cat.name_ar,
                href: `/guides/${cat.slug}`,
                icon: IconComponent
            };
        }),
        { name: "كل الأقسام", href: "/guides", icon: LayoutGrid }
    ];

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <nav className="mx-auto flex max-w-[1600px] items-center justify-between p-6 lg:px-12" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1 p-1 flex items-center gap-2.5 group">
                        <div className="bg-[#003366] text-white p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                            <Cpu size={22} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[#003366] font-heading lowercase">
                            {siteName}
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:items-center lg:gap-x-8">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-black leading-6 transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-lg
                  ${isActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-[#003366] hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.icon && <item.icon size={20} strokeWidth={2.5} />}
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex flex-1 justify-end items-center gap-3">
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                        <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                <Cpu size={20} />
                            </div>
                            <span className="text-lg font-bold text-gray-900">المساعد التقني</span>
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`-mx-3 block rounded-xl px-4 py-3 text-base font-bold leading-7 flex items-center gap-3 transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon && <item.icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
