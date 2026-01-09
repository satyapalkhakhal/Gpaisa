'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navigation = [
    { name: 'Markets', href: '/markets' },
    { name: 'Gold Rate', href: '/gold-rate' },
    { name: 'Silver Rate', href: '/silver-rate' },
    { name: 'Commodities', href: '/commodities' },
    { name: 'Agriculture', href: '/agriculture' },
    { name: 'Personal Finance', href: '/finance' },
    { name: 'News', href: '/news' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/icon-192.png"
                                alt="gpaisa.in logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                                priority
                            />
                            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-success-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
                                Gpaisa
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
