'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

/** Section 6: Quick Market Insight */
export function MarketInsight() {
    return (
        <section className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                💡 Quick Market Insight
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Current Trend</span>
                </div>
                <ul className="space-y-2.5">
                    {[
                        'Gold prices remain elevated due to global uncertainty and central bank buying',
                        'Rupee depreciation against USD is supporting domestic gold prices',
                        'Festival and wedding season demand continues to provide price floor',
                    ].map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0">●</span>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/** Section 7: Decision Block */
export function DecisionBlock() {
    return (
        <section className="mb-8 sm:mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-3 flex items-center gap-2">
                    🤔 Should You Buy Gold Today?
                </h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3 sm:p-4 border border-amber-100">
                        <span className="text-lg flex-shrink-0">✅</span>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Long-term investors → Buy gradually</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">SIP into gold ETFs or buy SGBs for best long-term returns with 2.5% interest</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3 sm:p-4 border border-amber-100">
                        <span className="text-lg flex-shrink-0">⚠️</span>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Short-term traders → Wait for stability</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">High volatility means prices can swing ₹500–₹1,000 per 10g within a week</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Section 8: Internal Links */
export function InternalLinks() {
    const links = [
        { href: '/gold-vs-silver', label: 'Gold vs Silver Comparison', icon: '⚖️' },
        { href: '/gold-affordability-index', label: 'Gold Affordability Index (1964–2026)', icon: '📉' },
        { href: '/silver-rate', label: 'Silver Rate Today', icon: '🥈' },
        { href: '/commodities', label: 'All Commodity Prices', icon: '📊' },
        { href: '/', label: 'gpaisa.in Homepage', icon: '🏠' },
    ];
    return (
        <section className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                🔗 Related Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.map(l => (
                    <Link key={l.href} href={l.href}
                        className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-md transition-all group">
                        <span className="text-xl">{l.icon}</span>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 transition-colors flex-1">{l.label}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                    </Link>
                ))}
            </div>
        </section>
    );
}

/** Section 9: FAQ */
export function GoldFAQ() {
    const faqs = [
        { q: 'What is the gold price today in India?', a: 'Gold prices in India are updated daily based on international spot prices, USD/INR exchange rate, and import duties. Check the live price card at the top of this page for the latest 24K gold rate per 10 grams.' },
        { q: 'Why do gold prices change daily?', a: 'Gold prices fluctuate due to changes in international gold benchmarks (LBMA), USD/INR currency movements, crude oil prices, geopolitical events, and domestic demand-supply dynamics.' },
        { q: 'Is it a good time to buy gold?', a: 'For long-term wealth preservation, gold remains a strong hedge against inflation. Consider Sovereign Gold Bonds (SGBs) for an additional 2.5% annual interest. Short-term traders should track global trends before entering.' },
        { q: 'What is 1 tola gold in grams?', a: '1 tola equals 11.66 grams (or approximately 11.6638 grams). This is a traditional Indian unit widely used by jewellers across North India for gold transactions.' },
    ];

    return (
        <section className="mb-8 sm:mb-12" id="faq">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-3">
                {faqs.map((f, i) => (
                    <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden" open={i === 0}>
                        <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold mt-0.5">Q</span>
                            <span className="flex-1">{f.q}</span>
                            <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-lg">▼</span>
                        </summary>
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-9">{f.a}</p>
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}
