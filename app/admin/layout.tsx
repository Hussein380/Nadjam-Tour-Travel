'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, UserCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            router.push('/admin/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="flex items-center space-x-2">
                                <Image src="/images/nadjam-logo.png" alt="Nadjam Travel" width={40} height={40} />
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Admin
                                </h1>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user && (
                                <div className="flex items-center space-x-2">
                                    <UserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                                        {user.email}
                                    </span>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSignOut}
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    );
} 