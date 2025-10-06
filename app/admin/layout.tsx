// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    // Don't check auth on login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        checkAuth();
    }, [pathname, isLoginPage]);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const user = await authService.getCurrentUser();

            if (!user) {
                router.push('/admin/login');
                setLoading(false);
                return;
            }

            const isAdmin = await authService.isAdmin(user);

            if (!isAdmin) {
                router.push('/admin/login');
                setLoading(false);
                return;
            }

            setLoading(false);
        } catch (error) {
            console.error('Auth check error:', error);
            router.push('/admin/login');
            setLoading(false);
        }
    };

    // Show loading spinner
    if (loading && !isLoginPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D32F2F]"></div>
            </div>
        );
    }

    // Always render children (especially for login page)
    return <>{children}</>;
}