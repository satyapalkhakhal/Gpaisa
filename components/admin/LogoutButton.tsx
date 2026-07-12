'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    );
}
