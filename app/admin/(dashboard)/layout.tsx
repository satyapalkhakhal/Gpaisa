import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <nav className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-y-2 py-2 min-h-14">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link href="/admin/articles" className="font-bold">gpaisa Admin</Link>
                        <Link href="/admin/articles" className="text-sm text-gray-300 hover:text-white transition-colors">Articles</Link>
                        <Link href="/admin/articles/new" className="text-sm text-gray-300 hover:text-white transition-colors">New Article</Link>
                        <Link href="/admin/ipos" className="text-sm text-gray-300 hover:text-white transition-colors">IPOs</Link>
                        <Link href="/admin/ipos/new" className="text-sm text-gray-300 hover:text-white transition-colors">New IPO</Link>
                        <span className="text-gray-600">|</span>
                        <Link href="/admin/ncd-issues" className="text-sm text-gray-300 hover:text-white transition-colors">NCD Issues</Link>
                        <Link href="/admin/rights-issues" className="text-sm text-gray-300 hover:text-white transition-colors">Rights Issues</Link>
                        <Link href="/admin/buybacks" className="text-sm text-gray-300 hover:text-white transition-colors">Buybacks</Link>
                    </div>
                    <LogoutButton />
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </>
    );
}
