'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [calculatorDropdownOpen, setCalculatorDropdownOpen] = useState(false);
    const [menuAnimating, setMenuAnimating] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const navigation = [
        // Markets temporarily hidden
        // { name: t('nav', 'markets'), href: '/markets' },
        { name: t('nav', 'goldRate'), href: '/gold-rate' },
        { name: t('nav', 'silverRate'), href: '/silver-rate' },
        { name: t('nav', 'commodities'), href: '/commodities' },
        {
            name: t('nav', 'calculators'),
            href: '/calculator',
            dropdown: [
                { name: t('calculators', 'incomeTaxCalculator'), href: '/calculator/income-tax' },
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
                { name: t('calculators', 'carLoanCalculator'), href: '/calculator/car-loan' },
                { name: t('calculators', 'ssyCalculator'), href: '/calculator/ssy' },
                { name: t('calculators', 'nscCalculator'), href: '/calculator/nsc' },
                { name: t('calculators', 'scssCalculator'), href: '/calculator/scss' },
            ]
        },
        { name: t('nav', 'personalFinance'), href: '/category/business' },
        { name: t('nav', 'news'), href: '/news' },
        { name: t('nav', 'glossary'), href: '/glossary' },
    ];

    // Close mobile menu on route change (resize)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
                setMenuAnimating(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggleMenu = () => {
        if (mobileMenuOpen) {
            // Animate close
            setMenuAnimating(true);
            setTimeout(() => {
                setMobileMenuOpen(false);
                setMenuAnimating(false);
            }, 200);
        } else {
            setMobileMenuOpen(true);
        }
    };

    const handleCloseMobileMenu = () => {
        setMenuAnimating(true);
        setTimeout(() => {
            setMobileMenuOpen(false);
            setMenuAnimating(false);
        }, 200);
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                            <Image
                                src="/android-chrome-192x192.png"
                                alt="gpaisa.in logo"
                                width={36}
                                height={36}
                                className="rounded-lg sm:w-10 sm:h-10"
                                priority
                            />
                            <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                Gpaisa
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation — hidden below lg (1024px) to avoid overcrowding */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-0.5 xl:space-x-1">
                        {navigation.map((item) => (
                            item.dropdown ? (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => setCalculatorDropdownOpen(true)}
                                    onMouseLeave={() => setCalculatorDropdownOpen(false)}
                                >
                                    <button
                                        className="px-2.5 xl:px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
                                    >
                                        {item.name}
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    {calculatorDropdownOpen && (
                                        <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-[70vh] overflow-y-auto">
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
                                    className="px-2.5 xl:px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 whitespace-nowrap"
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}

                        {/* Language Switcher - Desktop */}
                        <div className="ml-1 xl:ml-2">
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {/* Mobile: Language + Menu button */}
                    <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
                        <LanguageSwitcher />
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={handleToggleMenu}
                            aria-expanded={mobileMenuOpen}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className="sr-only">{t('common', 'openMenu')}</span>
                            {mobileMenuOpen && !menuAnimating ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu — with slide animation */}
            {mobileMenuOpen && (
                <div
                    ref={menuRef}
                    className={`lg:hidden border-t border-gray-200 bg-white ${menuAnimating ? 'mobile-menu-exit' : 'mobile-menu-enter'}`}
                >
                    <div className="space-y-1 px-4 pb-4 pt-2 max-h-[75vh] overflow-y-auto">
                        {navigation.map((item) => (
                            item.dropdown ? (
                                <div key={item.name}>
                                    <button
                                        onClick={() => setCalculatorDropdownOpen(!calculatorDropdownOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                    >
                                        {item.name}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${calculatorDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-200 ease-in-out ${calculatorDropdownOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-primary-100 pl-3">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                                    onClick={handleCloseMobileMenu}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                    onClick={handleCloseMobileMenu}
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
