'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [calculatorDropdownOpen, setCalculatorDropdownOpen] = useState(false);
    const { t } = useLanguage();

    const navigation = [
        { name: t('nav', 'markets'), href: '/markets' },
        { name: t('nav', 'goldRate'), href: '/gold-rate' },
        { name: t('nav', 'silverRate'), href: '/silver-rate' },
        { name: t('nav', 'commodities'), href: '/commodities' },
        { name: t('nav', 'agriculture'), href: '/agriculture' },
        {
            name: t('nav', 'calculators'),
            href: '/calculator/sip',
            dropdown: [
                { name: t('calculators', 'sipCalculator'), href: '/calculator/sip' },
                { name: t('calculators', 'ppfCalculator'), href: '/calculator/ppf' },
                { name: t('calculators', 'swpCalculator'), href: '/calculator/swp' },
                { name: t('calculators', 'epfCalculator'), href: '/calculator/epf' },
                { name: t('calculators', 'emiCalculator'), href: '/calculator/emi' },
                { name: t('calculators', 'homeLoanCalculator'), href: '/calculator/home-loan' },
                { name: t('calculators', 'gstCalculator'), href: '/calculator/gst' },
                { name: t('calculators', 'cagrCalculator'), href: '/calculator/cagr' },
                { name: t('calculators', 'fdCalculator'), href: '/calculator/fd' },
                { name: t('calculators', 'npsCalculator'), href: '/calculator/nps' },
                { name: t('calculators', 'hraCalculator'), href: '/calculator/hra' },
                { name: t('calculators', 'gratuityCalculator'), href: '/calculator/gratuity' },
                { name: t('calculators', 'simpleInterest'), href: '/calculator/simple-interest' },
                { name: t('calculators', 'mutualFundCalculator'), href: '/calculator/mutual-fund' },
            ]
        },
        { name: t('nav', 'personalFinance'), href: '/finance' },
        { name: t('nav', 'news'), href: '/news' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/android-chrome-192x192.png"
                                alt="gpaisa.in logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                                priority
                            />
                            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                Gpaisa
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1">
                        {navigation.map((item) => (
                            item.dropdown ? (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => setCalculatorDropdownOpen(true)}
                                    onMouseLeave={() => setCalculatorDropdownOpen(false)}
                                >
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                    >
                                        {item.name}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {calculatorDropdownOpen && (
                                        <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}

                        {/* Language Switcher - Desktop */}
                        <div className="ml-2">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile: Language + Menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <LanguageSwitcher />
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">{t('common', 'openMenu')}</span>
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
                        {navigation.map((item) => (
                            item.dropdown ? (
                                <div key={item.name}>
                                    <button
                                        onClick={() => setCalculatorDropdownOpen(!calculatorDropdownOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                                    >
                                        {item.name}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${calculatorDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {calculatorDropdownOpen && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
