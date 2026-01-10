'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navigation = [
    { name: 'Markets', href: '/markets' },
    { name: 'Gold Rate', href: '/gold-rate' },
    { name: 'Silver Rate', href: '/silver-rate' },
    { name: 'Commodities', href: '/commodities' },
    { name: 'Agriculture', href: '/agriculture' },
    {
        name: 'Calculators',
        href: '/calculator/sip',
        dropdown: [
            { name: 'SIP Calculator', href: '/calculator/sip', description: 'Calculate mutual fund SIP returns' },
            { name: 'PPF Calculator', href: '/calculator/ppf', description: 'Calculate PPF maturity amount' },
            { name: 'SWP Calculator', href: '/calculator/swp', description: 'Calculate systematic withdrawal plan' },
            { name: 'EPF Calculator', href: '/calculator/epf', description: 'Calculate employees provident fund' },
            { name: 'EMI Calculator', href: '/calculator/emi', description: 'Calculate loan EMI' },
            { name: 'Home Loan Calculator', href: '/calculator/home-loan', description: 'Calculate home loan EMI' },
        ]
    },
    { name: 'Personal Finance', href: '/finance' },
    { name: 'News', href: '/news' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [calculatorDropdownOpen, setCalculatorDropdownOpen] = useState(false);

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
                                                    key={subItem.name}
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
                                                    key={subItem.name}
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
