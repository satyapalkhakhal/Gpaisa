'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { localizedNavHref } from '@/lib/articleLocale';

interface NavLink {
    name: string;
    href: string;
}

interface NavGroup {
    title: string;
    links: NavLink[];
}

interface NavItem {
    name: string;
    href: string;
    /** Path prefixes that mark this item as the current section. */
    match: string[];
    links?: NavLink[];
    /** Multi-column menu (calculators) instead of a single list. */
    groups?: NavGroup[];
    footer?: NavLink;
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
    const pathname = usePathname() || '/';
    const { t, language } = useLanguage();
    // On Hindi pages, nav entries that have a Hindi version point to it.
    const local = (href: string) => localizedNavHref(href, language);

    const calc = (key: string, slug: string): NavLink => ({ name: t('calculators', key), href: `/calculator/${slug}` });

    const navigation: NavItem[] = [
        {
            name: t('nav', 'goldSilver'),
            href: local('/gold-rate'),
            match: ['/gold-rate', '/hi/gold-rate', '/silver-rate', '/gold-vs-silver', '/commodities', '/gold-affordability-index'],
            links: [
                { name: t('nav', 'goldRate'), href: local('/gold-rate') },
                { name: t('nav', 'silverRate'), href: '/silver-rate' },
                { name: t('navMenu', 'goldVsSilver'), href: '/gold-vs-silver' },
                { name: t('nav', 'commodities'), href: '/commodities' },
            ],
        },
        {
            name: t('nav', 'ipo'),
            href: '/ipo',
            match: ['/ipo', '/ipo-calculator'],
            links: [
                { name: t('ipoNav', 'mainboard'), href: '/ipo?tab=open&type=mainboard' },
                { name: t('ipoNav', 'sme'), href: '/ipo?tab=open&type=sme' },
                { name: t('ipoNav', 'gmp'), href: '/ipo/gmp' },
                { name: t('ipoNav', 'listingPerformance'), href: '/ipo/listing-performance' },
                // IPO compare and IPO calculators are reachable from /ipo; kept out of the
                // site-wide menu while they are thin (see seo-audit fix-roadmap P1-8).
            ],
        },
        {
            name: t('nav', 'investments'),
            href: '/credit-cards',
            match: ['/credit-cards', '/ncd', '/rights-issue', '/buyback'],
            links: [
                { name: t('navMenu', 'creditCards'), href: '/credit-cards' },
                // NCD, rights issue and buyback hubs are linked from the homepage sidebar; kept
                // out of the site-wide menu until they have editorial content (fix-roadmap P1-8).
            ],
        },
        {
            name: t('nav', 'calculators'),
            href: '/calculator',
            match: ['/calculator'],
            groups: [
                {
                    title: t('navMenu', 'invest'),
                    links: [calc('sipCalculator', 'sip'), calc('mutualFundCalculator', 'mutual-fund'), calc('cagrCalculator', 'cagr'), calc('swpCalculator', 'swp')],
                },
                {
                    title: t('navMenu', 'save'),
                    links: [calc('fdCalculator', 'fd'), calc('ppfCalculator', 'ppf'), calc('nscCalculator', 'nsc'), calc('ssyCalculator', 'ssy'), calc('scssCalculator', 'scss'), calc('simpleInterest', 'simple-interest')],
                },
                {
                    title: t('navMenu', 'loans'),
                    links: [calc('emiCalculator', 'emi'), calc('homeLoanCalculator', 'home-loan'), calc('carLoanCalculator', 'car-loan')],
                },
                {
                    title: t('navMenu', 'taxRetirement'),
                    links: [calc('incomeTaxCalculator', 'income-tax'), calc('hraCalculator', 'hra'), calc('epfCalculator', 'epf'), calc('npsCalculator', 'nps'), calc('gratuityCalculator', 'gratuity'), calc('gstCalculator', 'gst')],
                },
            ],
            footer: { name: t('navMenu', 'allCalculators'), href: '/calculator' },
        },
        {
            name: t('nav', 'news'),
            href: local('/news'),
            match: ['/news', '/hi/articles', '/hi/category', '/category', '/articles', '/glossary'],
            links: [
                { name: t('navMenu', 'latestNews'), href: local('/news') },
                { name: t('nav', 'personalFinance'), href: local('/category/business') },
                { name: t('navMenu', 'financeNews'), href: local('/category/finance') },
                { name: t('navMenu', 'ipoNews'), href: local('/category/ipo') },
                { name: t('nav', 'glossary'), href: '/glossary' },
            ],
        },
    ];

    const isActive = (item: NavItem) => item.match.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));

    // Close the mobile menu on navigation and when the viewport grows to desktop width.
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gw-border">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between gap-6">
                    {/* Logo */}
                    <Link href={language === 'hi' ? '/hi' : '/'} className="shrink-0" aria-label="gpaisa.in home">
                        <Logo />
                    </Link>

                    {/* Desktop navigation — five grouped menus that open on hover or keyboard focus */}
                    <div className="hidden lg:flex items-center gap-1 ml-auto">
                        {navigation.map(item => {
                            const active = isActive(item);
                            return (
                                <div key={item.href} className="relative group">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1 px-3 py-2 text-[15px] font-medium whitespace-nowrap transition-colors ${
                                            active ? 'text-gw-green' : 'text-gw-text hover:text-gw-green'
                                        }`}
                                    >
                                        {item.name}
                                        <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                                    </Link>

                                    {/* pt-2 bridges the gap so the menu doesn't close while the pointer moves onto it */}
                                    <div className={`absolute top-full pt-2 z-50 hidden group-hover:block group-focus-within:block ${item.groups ? 'right-0' : 'left-0'}`}>
                                        <div className="bg-white rounded-xl border border-gw-border shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden">
                                            {item.groups ? (
                                                <div className="grid grid-cols-4 gap-6 p-5 w-[760px] max-w-[calc(100vw-2rem)]">
                                                    {item.groups.map(group => (
                                                        <div key={group.title}>
                                                            <p className="text-xs font-medium text-gw-sub mb-2">{group.title}</p>
                                                            <ul className="space-y-0.5">
                                                                {group.links.map(link => (
                                                                    <li key={link.href}>
                                                                        <Link href={link.href} className="block py-1.5 text-sm text-gw-text hover:text-gw-green transition-colors">
                                                                            {link.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <ul className="py-2 w-56">
                                                    {item.links?.map(link => (
                                                        <li key={link.href}>
                                                            <Link href={link.href} className="block px-4 py-2 text-sm text-gw-text hover:bg-gw-bg hover:text-gw-green transition-colors">
                                                                {link.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {item.footer && (
                                                <Link href={item.footer.href} className="block border-t border-gw-border px-5 py-3 text-sm font-medium text-gw-green hover:bg-gw-greenBg transition-colors">
                                                    {item.footer.name} →
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="ml-2 pl-3 border-l border-gw-border flex items-center gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile: language + menu button */}
                    <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-gw-text hover:bg-gw-bg transition-colors"
                            onClick={() => setMobileMenuOpen(open => !open)}
                            aria-expanded={mobileMenuOpen}
                            aria-label={mobileMenuOpen ? 'Close menu' : t('common', 'openMenu')}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu — one accordion per group */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gw-border bg-white mobile-menu-enter">
                    <div className="px-4 py-2 max-h-[75vh] overflow-y-auto divide-y divide-gw-border">
                        {navigation.map(item => {
                            const expanded = openMobileItem === item.href;
                            const links = item.groups ? item.groups.flatMap(g => g.links) : item.links ?? [];
                            return (
                                <div key={item.href}>
                                    <button
                                        onClick={() => setOpenMobileItem(expanded ? null : item.href)}
                                        aria-expanded={expanded}
                                        className={`w-full flex items-center justify-between py-3.5 text-base font-medium ${isActive(item) ? 'text-gw-green' : 'text-gw-text'}`}
                                    >
                                        {item.name}
                                        <ChevronDown className={`w-4 h-4 text-gw-sub transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expanded && (
                                        <div className="pb-3 grid grid-cols-2 gap-x-3">
                                            {links.map(link => (
                                                <Link key={link.href} href={link.href} className="py-2 text-sm text-gw-sub hover:text-gw-green transition-colors">
                                                    {link.name}
                                                </Link>
                                            ))}
                                            {item.footer && (
                                                <Link href={item.footer.href} className="col-span-2 py-2 text-sm font-medium text-gw-green">
                                                    {item.footer.name} →
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
