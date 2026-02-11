"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
    label: string;
    href: string;
}

export function Breadcrumbs({ items = [] }: { items?: BreadcrumbItem[] }) {
    return (
        <nav className="flex mb-8 overflow-x-auto pb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 space-x-reverse whitespace-nowrap">
                <li className="flex items-center">
                    <Link href="/" className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm">
                        <Home size={16} />
                        <span>الرئيسية</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronLeft size={16} className="text-gray-300 mx-1" />
                        <Link
                            href={item.href}
                            className={`text-sm font-bold transition-colors ${index === items.length - 1
                                    ? 'text-gray-900 pointer-events-none'
                                    : 'text-gray-400 hover:text-blue-600'
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
