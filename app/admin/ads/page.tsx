import React from 'react';
import { AdsManager } from '@/components/admin/AdsManager';

export const metadata = {
    title: 'إدارة الإعلانات | لوحة التحكم',
};

export default function AdminAdsPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <AdsManager />
        </div>
    );
}
