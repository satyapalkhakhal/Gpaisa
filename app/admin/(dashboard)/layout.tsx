import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <nav className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/articles" className="font-bold">gpaisa Admin</Link>
                        <Link href="/admin/articles" className="text-sm text-gray-300 hover:text-white transition-colors">Articles</Link>
                        <Link href="/admin/articles/new" className="text-sm text-gray-300 hover:text-white transition-colors">New Article</Link>
                    </div>
                    <LogoutButton />
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </>
    );
}
