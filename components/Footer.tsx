'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { getCurrentYear } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
    const currentYear = getCurrentYear();
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-display font-bold text-white mb-4">gpaisa.in</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            {t('footer', 'about')}
                        </p>
                        <div className="flex items-center flex-wrap gap-4">
                            <a href="mailto:contact@gpaisa.in" className="flex items-center text-sm hover:text-primary-400 transition-colors">
                                <Mail className="h-4 w-4 mr-2" />
                                contact@gpaisa.in
                            </a>
                            <a
                                href="https://twitter.com/gpaisa_in"
                                target="_blank"
                                rel="noopener"
                                aria-label="Follow gpaisa.in on Twitter"
                                className="flex items-center text-sm hover:text-primary-400 transition-colors"
                            >
                                <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                @gpaisa_in
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">{t('footer', 'quickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            {/* Markets temporarily hidden */}
                            <li><Link href="/calculator" className="hover:text-primary-400 transition-colors">{t('nav', 'calculators')}</Link></li>
                            <li><Link href="/gold-rate" className="hover:text-primary-400 transition-colors">{t('nav', 'goldRate')}</Link></li>
                            <li><Link href="/silver-rate" className="hover:text-primary-400 transition-colors">{t('nav', 'silverRate')}</Link></li>
                            <li><Link href="/commodities" className="hover:text-primary-400 transition-colors">{t('footer', 'goldCommodities')}</Link></li>
                            <li><Link href="/category/business" className="hover:text-primary-400 transition-colors">{t('nav', 'personalFinance')}</Link></li>
                            <li><Link href="/news" className="hover:text-primary-400 transition-colors">{t('nav', 'news')}</Link></li>
                            <li><Link href="/glossary" className="hover:text-primary-400 transition-colors">{t('nav', 'glossary')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">{t('footer', 'legalInfo')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-primary-400 transition-colors">{t('footer', 'aboutUs')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">{t('footer', 'contactUs')}</Link></li>
                            <li><Link href="/sitemap-page" className="hover:text-primary-400 transition-colors">{t('footer', 'sitemap')}</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-primary-400 transition-colors">{t('footer', 'privacyPolicy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">{t('footer', 'terms')}</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-primary-400 transition-colors">{t('footer', 'disclaimer')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer + SEBI */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-3">
                        <strong>{t('footer', 'disclaimer')}:</strong> {t('footer', 'disclaimerText')}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                        <strong>SEBI Notice:</strong> {t('footer', 'sebiDisclaimer')}
                    </p>
                    <p className="text-xs text-gray-500">
                        © {currentYear} gpaisa.in. {t('footer', 'copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
