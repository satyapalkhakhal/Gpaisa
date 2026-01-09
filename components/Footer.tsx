import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getCurrentYear } from '@/lib/utils';

export default function Footer() {
    const currentYear = getCurrentYear();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
            {/* Add subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-display font-bold text-white mb-4">gpaisa.in</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Your trusted source for real-time financial information, market updates, gold rates,
                            commodity prices, and agriculture market data across India.
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
                        <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/markets" className="hover:text-primary-400 transition-colors">Markets</Link></li>
                            <li><Link href="/commodities" className="hover:text-primary-400 transition-colors">Gold & Commodities</Link></li>
                            <li><Link href="/agriculture" className="hover:text-primary-400 transition-colors">Agriculture Prices</Link></li>
                            <li><Link href="/finance" className="hover:text-primary-400 transition-colors">Personal Finance</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-primary-400 transition-colors">Disclaimer</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-4">
                        <strong>Disclaimer:</strong> The information provided on gpaisa.in is for informational purposes only
                        and should not be considered as financial advice. Market data, prices, and rates are indicative and
                        may not reflect real-time values. Always consult with a qualified financial advisor before making
                        investment decisions. We are not responsible for any financial losses incurred based on information
                        from this website.
                    </p>
                    <p className="text-xs text-gray-500">
                        © {currentYear} gpaisa.in. All rights reserved. Market data is provided for informational purposes only.
                    </p>
                </div>
            </div>
        </footer>
    );
}
