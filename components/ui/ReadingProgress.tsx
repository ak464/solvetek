"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100
                );
            }
        };

        window.addEventListener("scroll", updateScrollCompletion);
        return () => window.removeEventListener("scroll", updateScrollCompletion);
    }, []);

    return (
        <div className="fixed top-[73px] left-0 w-full h-1 z-[45] pointer-events-none">
            <div
                className="h-full bg-blue-600 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${completion}%`, transitionProperty: 'width' }}
            />
        </div>
    );
}
