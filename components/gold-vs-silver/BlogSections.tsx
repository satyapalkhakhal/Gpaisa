'use client';

import Link from 'next/link';

export function ComparisonTable() {
    const rows = [
        { factor: 'Price Stability', gold: 'High – less volatile, steady growth', silver: 'Moderate – swings more aggressively', winner: 'Gold' },
        { factor: 'Volatility', gold: 'Low to Moderate', silver: 'High – can move 5-10% in a week', winner: 'Silver (if you want action)' },
        { factor: '10-Year Returns (India)', gold: '~12–14% CAGR', silver: '~10–13% CAGR', winner: 'Gold (marginally)' },
        { factor: 'Liquidity', gold: 'Very High – easy to sell anywhere', silver: 'Moderate – harder to sell large quantities', winner: 'Gold' },
        { factor: 'Storage Cost', gold: 'Low – small size, high value', silver: 'Higher – bulky for same value', winner: 'Gold' },
        { factor: 'Industrial Demand', gold: 'Low (~10%)', silver: 'Very High (~50%)', winner: 'Silver (growth potential)' },
        { factor: 'Inflation Hedge', gold: 'Excellent', silver: 'Good but less consistent', winner: 'Gold' },
        { factor: 'Entry Cost', gold: 'High – ₹7,000+/gram', silver: 'Low – ₹80–100/gram', winner: 'Silver' },
        { factor: 'Risk Level', gold: 'Low to Moderate', silver: 'Moderate to High', winner: 'Gold (safer)' },
    ];
    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gradient-to-r from-gold-600/10 to-gray-200/60">
                        <th className="px-4 py-3 text-left font-semibold text-gray-800">Factor</th>
                        <th className="px-4 py-3 text-left font-semibold text-gold-700">🪙 Gold</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">🥈 Silver</th>
                        <th className="px-4 py-3 text-left font-semibold text-primary-700">Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 font-medium text-gray-900">{r.factor}</td>
                            <td className="px-4 py-3 text-gray-700">{r.gold}</td>
                            <td className="px-4 py-3 text-gray-700">{r.silver}</td>
                            <td className="px-4 py-3 font-semibold text-primary-700">{r.winner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function InvestmentOptions() {
    const options = [
        { name: 'Physical Gold', pros: 'Tangible, traditional, emotional value', cons: 'Making charges, storage, purity risk', best: 'Jewelry lovers, traditional investors' },
        { name: 'Sovereign Gold Bonds (SGB)', pros: '2.5% annual interest, tax-free on maturity, govt backed', cons: '8-year lock-in, limited liquidity', best: 'Long-term investors (best option)' },
        { name: 'Gold ETF', pros: 'High liquidity, no storage, transparent pricing', cons: 'Expense ratio, demat needed', best: 'Active traders, SIP investors' },
        { name: 'Silver ETF', pros: 'Easy exposure to silver, no storage hassle', cons: 'Limited options in India, expense ratio', best: 'Diversification seekers' },
        { name: 'Digital Gold', pros: 'Buy from ₹1, 24K pure, easy to start', cons: 'Spread charges, no interest, limited regulation', best: 'Beginners, small investors' },
        { name: 'Gold Mutual Funds', pros: 'SIP option, professional management', cons: 'Double expense ratio (fund + ETF)', best: 'SIP-based investors without demat' },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((o, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-display font-bold text-gray-900 text-lg mb-2">{o.name}</h4>
                    <div className="space-y-1.5 text-sm">
                        <p><span className="text-green-600 font-medium">✅ Pros:</span> {o.pros}</p>
                        <p><span className="text-red-500 font-medium">⚠️ Cons:</span> {o.cons}</p>
                        <p><span className="text-primary-600 font-medium">🎯 Best for:</span> {o.best}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function InternalLinks() {
    const links = [
        { href: '/gold-rate', text: "Check today's live gold rate →" },
        { href: '/gold-affordability-index', text: 'Gold Affordability Index — 1964 vs 2026 →' },
        { href: '/gold-rate/mumbai', text: 'Gold rate in Mumbai today →' },
        { href: '/gold-rate/delhi', text: 'Gold rate in Delhi today →' },
        { href: '/silver-rate', text: "Today's silver rate across India →" },
        { href: '/commodities', text: 'All commodity prices live →' },
        { href: '/calculator/sip', text: 'SIP Calculator – Plan your investments →' },
        { href: '/calculator/cagr', text: 'CAGR Calculator – Measure real returns →' },
    ];
    return (
        <div className="bg-gradient-to-br from-primary-50 to-gold-50 rounded-2xl border border-primary-200/50 p-6">
            <h3 className="text-lg font-display font-bold text-gray-900 mb-4">📌 Related Pages on gpaisa.in</h3>
            <ul className="space-y-2">
                {links.map((l, i) => (
                    <li key={i}>
                        <Link href={l.href} className="text-primary-700 hover:text-primary-900 hover:underline font-medium text-sm transition">
                            {l.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function DownloadSection() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-3">📥 Download Historical Gold &amp; Silver Price Data</h3>
            <p className="text-gray-300 text-sm mb-5 max-w-xl mx-auto">
                Get the full historical dataset behind this comparison for your own research, portfolio analysis, or financial planning.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                    href="/gold_prices_india_1964_2026.csv"
                    download
                    className="inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    📈 Gold Prices 1964–2026 (CSV)
                </a>
                <a
                    href="/silver_prices_india_1981_2026.csv"
                    download
                    className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    📉 Silver Prices 1981–2026 (CSV)
                </a>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/20"
                >
                    🖨️ Print / Save Chart as PDF
                </button>
            </div>
        </div>
    );
}

export function TOC() {
    const items = [
        { id: 'intro', label: 'Introduction' },
        { id: 'price-today', label: 'Gold & Silver Price Today' },
        { id: 'gold-chart', label: 'Gold Price Trend (10-Year)' },
        { id: 'silver-chart', label: 'Silver Price Trend (10-Year)' },
        { id: 'comparison', label: 'Gold vs Silver Comparison Table' },
        { id: 'ratio', label: 'Gold to Silver Ratio' },
        { id: 'returns', label: 'Returns Comparison' },
        { id: 'who-should', label: 'Which Is Better For You?' },
        { id: 'factors', label: 'Key Factors Affecting Prices' },
        { id: 'options', label: 'Investment Options in India' },
        { id: 'download', label: 'Download Chart' },
    ];
    return (
        <nav className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-display font-bold text-gray-900 mb-3 text-base">📑 Table of Contents</h3>
            <ol className="space-y-1.5 text-sm">
                {items.map((item, i) => (
                    <li key={item.id}>
                        <a href={`#${item.id}`} className="text-primary-700 hover:text-primary-900 hover:underline transition">
                            {i + 1}. {item.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
