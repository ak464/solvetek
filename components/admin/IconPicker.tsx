"use client";

import React, { useState } from 'react';
import { CATEGORY_ICONS as ICON_OPTIONS } from '@/lib/config/icons';

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Get the current icon component or fallback
    const CurrentIcon = ICON_OPTIONS[value] || ICON_OPTIONS.default;

    return (
        <div className="relative">
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">أيقونة القسم</label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CurrentIcon size={18} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{value || 'اختر أيقونة'}</span>
                </div>
                <span className="text-xs text-gray-400 font-bold">تغيير</span>
            </button>

            {/* Icons Grid Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {Object.entries(ICON_OPTIONS).map(([name, Icon]) => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => {
                                    onChange(name);
                                    setIsOpen(false);
                                }}
                                className={`p-2 rounded-xl flex items-center justify-center transition-all ${value === name
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110'
                                    : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                title={name}
                            >
                                <Icon size={20} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Overlay to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
