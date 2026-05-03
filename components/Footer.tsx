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
                        <div className="flex space-x-4">
                            <a href="mailto:info@gpaisa.in" className="flex items-center text-sm hover:text-primary-400 transition-colors">
                                <Mail className="h-4 w-4 mr-2" />
                                info@gpaisa.in
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">{t('footer', 'quickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            {/* Markets temporarily hidden */}
                            <li><Link href="/commodities" className="hover:text-primary-400 transition-colors">{t('footer', 'goldCommodities')}</Link></li>
                            {/* Agriculture temporarily hidden */}
                            <li><Link href="/finance" className="hover:text-primary-400 transition-colors">{t('nav', 'personalFinance')}</Link></li>
                            <li><Link href="/news" className="hover:text-primary-400 transition-colors">{t('nav', 'news')}</Link></li>
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

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-4">
                        <strong>{t('footer', 'disclaimer')}:</strong> {t('footer', 'disclaimerText')}
                    </p>
                    <p className="text-xs text-gray-500">
                        © {currentYear} gpaisa.in. {t('footer', 'copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
