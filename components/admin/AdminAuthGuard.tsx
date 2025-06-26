'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || !isAdmin) {
                router.replace('/admin/login');
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600">Verifying access...</p>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return <>{children}</>;
} 