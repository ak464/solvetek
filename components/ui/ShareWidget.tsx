"use client";

import { Share2, Facebook, Twitter, SendHorizontal, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareWidgetProps {
    url?: string;
    title?: string;
    variant?: "compact" | "default";
}

export function ShareWidget({ url, title, variant = "default" }: ShareWidgetProps) {
    const [fullUrl, setFullUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Handle relative URLs (e.g., /guides/abc) by prefixing origin
            let finalUrl = url || window.location.href;
            if (finalUrl.startsWith('/')) {
                finalUrl = `${window.location.origin}${finalUrl}`;
            }
            setFullUrl(finalUrl);
        }
    }, [url]);

    const shareLinks = [
        {
            icon: SendHorizontal,
            color: "bg-[#0088cc]",
            label: "Telegram",
            url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title || "")}`
        },
        {
            icon: MessageCircle,
            color: "bg-[#25D366]",
            label: "WhatsApp",
            url: `https://wa.me/?text=${encodeURIComponent((title || "") + " " + fullUrl)}`
        },
        {
            icon: Facebook,
            color: "bg-[#1877F2]",
            label: "Facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
        },
        {
            icon: Twitter,
            color: "bg-[#000000]",
            label: "X",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title || "")}`
        }
    ];

    return (
        <div className="relative group/share flex items-center gap-2">
            <div className="flex items-center gap-2 opacity-0 -translate-x-2 group-hover/share:opacity-100 group-hover/share:translate-x-0 transition-all duration-300 pointer-events-none group-hover/share:pointer-events-auto">
                {shareLinks.map((share, idx) => (
                    <a
                        key={idx}
                        href={share.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white ${share.color} hover:scale-110 shadow-md transition-all`}
                        title={share.label}
                    >
                        <share.icon size={14} />
                    </a>
                ))}
            </div>
            <button
                className={`flex items-center justify-center rounded-full bg-white border border-gray-100 text-[#003366] hover:bg-[#003366] hover:text-white transition-all shadow-sm z-10 ${variant === "compact" ? "w-8 h-8" : "w-10 h-10"
                    }`}
            >
                <Share2 size={variant === "compact" ? 16 : 20} strokeWidth={2.5} />
            </button>
        </div>
    );
}
