import React from 'react';
import { AffiliateManager } from '@/components/admin/AffiliateManager';

export const metadata = {
    title: 'إدارة الأفلييت | لوحة التحكم',
};

export default function AdminAffiliatePage() {
    return (
        <div className="max-w-6xl mx-auto">
            <AffiliateManager />
        </div>
    );
}
