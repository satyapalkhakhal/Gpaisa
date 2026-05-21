import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calculator, Shield } from 'lucide-react';
import GoldDashboard from '@/components/GoldDashboard';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import {
    fetchArticlesByCategory,
    fetchAllArticles,
    Article
} from '@/lib/supabaseApi';

export const metadata: Metadata = {
    title: "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
    description: "India's trusted financial portal. Live 24K gold rate today, silver price, SIP calculator, FD calculator, home loan calculator, GST calculator, credit card reviews. Updated daily by Satyapal Khakhal.",
    authors: [{ name: "Satyapal Khakhal", url: "https://www.gpaisa.in/about" }],
    keywords: "gold rate today india, sip calculator, fd calculator, home loan calculator, gst calculator, silver rate today, financial calculators india, credit card reviews india, investment tools india, live gold price india",
    alternates: { canonical: "https://www.gpaisa.in" },
    openGraph: {
        title: "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
        description: "Live 24K gold rates, silver prices, SIP/FD/home loan calculators, GST tool, credit card reviews and financial news. India's trusted financial portal.",
        url: "https://www.gpaisa.in",
        siteName: "gpaisa.in",
        locale: "en_IN",
        type: "website",
        images: [{
            url: "https://www.gpaisa.in/og-homepage.jpg",
            width: 1200,
            height: 630,
            alt: "gpaisa.in — India's Financial Portal for Gold Rates, Calculators & Market Data"
        }]
    },
    twitter: {
        card: "summary_large_image",
        title: "gpaisa.in — Live Gold Rates, SIP & FD Calculators, Market Data India",
        description: "Live gold & silver rates, SIP/FD/home loan calculators, credit card reviews. Updated daily.",
        images: ["https://www.gpaisa.in/og-homepage.jpg"],
        creator: "@gpaisa_in",
        site: "@gpaisa_in"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
};

export const revalidate = 86400; // Cache for 1 day (ISR)

// ─── Helper Components ───────────────────────────────────────────────

const SectionHeader = ({
    title,
    accentColor = 'from-amber-500 to-yellow-500',
    href,
}: {
    title: string;
    accentColor?: string;
    href?: string;
}) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
            <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${accentColor}`} />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{title}</h2>
        </div>
        {href && (
            <Link href={href} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
        )}
    </div>
);

const InsightCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <div className="h-40 bg-gray-100 overflow-hidden">
            {article.image_url ? (
                <div className="relative w-full h-full">
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-sm">Gpaisa</span>
                </div>
            )}
        </div>
        <div className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {article.subcategory || article.category}
            </span>
            <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mt-2 mb-1.5">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
        </div>
    </Link>
);

const FinanceCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group flex gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-blue-200 transition-all duration-300">
        <div className="w-20 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
            {article.image_url ? (
                <div className="relative w-full h-full">
                    <Image src={article.image_url} alt="" fill className="object-cover" sizes="80px" />
                </div>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-400 text-[10px] font-bold">FINANCE</div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Finance</span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mt-0.5">
                {article.title}
            </h3>
        </div>
    </Link>
);

const LatestArticleRow = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
        <div className="w-14 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
            {article.image_url ? (
                <div className="relative w-full h-full">
                    <Image src={article.image_url} alt="" fill className="object-cover" sizes="56px" />
                </div>
            ) : (
                <div className="w-full h-full bg-gray-100" />
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {article.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500 uppercase">{article.category}</span>
                <span>•</span>
                <span>{article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" />
    </Link>
);


// ─── Main Page Component ─────────────────────────────────────────────

export default async function HomePage() {
    // Fetch article data in parallel
    const [
        businessArticles,
        financeArticles,
        latestArticles,
    ] = await Promise.all([
        fetchArticlesByCategory('BUSINESS', 3),
        fetchArticlesByCategory('FINANCE', 2),
        fetchAllArticles(5),
    ]);

    // De-duplicate: collect all used article IDs
    const usedIds = new Set<string>();
    const businessCards = businessArticles.slice(0, 3);
    businessCards.forEach(a => usedIds.add(a.id));
    const financeCards = financeArticles.slice(0, 2);
    financeCards.forEach(a => usedIds.add(a.id));

    // Latest articles (exclude already-shown ones)
    const latestFiltered = latestArticles.filter(a => !usedIds.has(a.id)).slice(0, 5);

    // JSON-LD Structured Data — combined array
    const jsonLdSchemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://www.gpaisa.in/#website',
            'url': 'https://www.gpaisa.in',
            'name': 'gpaisa.in',
            'description': "India's trusted financial portal for live gold rates, silver prices, financial calculators, and market data.",
            'inLanguage': 'en-IN',
            'publisher': {
                '@type': 'Organization',
                '@id': 'https://www.gpaisa.in/#organization',
                'name': 'gpaisa.in',
                'url': 'https://www.gpaisa.in',
                'logo': { '@type': 'ImageObject', 'url': 'https://www.gpaisa.in/android-chrome-512x512.png', 'width': 512, 'height': 512 },
                'founder': { '@type': 'Person', 'name': 'Satyapal Khakhal', 'url': 'https://www.gpaisa.in/about' },
                'contactPoint': { '@type': 'ContactPoint', 'email': 'info@gpaisa.in', 'contactType': 'customer support' },
                'sameAs': ['https://twitter.com/gpaisa_in']
            },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://www.gpaisa.in/search?q={search_term_string}' },
                'query-input': 'required name=search_term_string'
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://www.gpaisa.in/#webpage',
            'url': 'https://www.gpaisa.in',
            'name': "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
            'description': "India's trusted financial portal for live gold rates, silver prices, SIP/FD/home loan calculators, and market news.",
            'isPartOf': { '@id': 'https://www.gpaisa.in/#website' },
            'about': { '@id': 'https://www.gpaisa.in/#organization' },
            'author': { '@type': 'Person', 'name': 'Satyapal Khakhal', 'url': 'https://www.gpaisa.in/about' },
            'inLanguage': 'en-IN',
            'dateModified': new Date().toISOString().split('T')[0]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Financial Calculators — gpaisa.in',
            'description': 'Free financial calculators for Indian investors',
            'numberOfItems': 14,
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'SIP Calculator', 'url': 'https://www.gpaisa.in/calculator/sip' },
                { '@type': 'ListItem', 'position': 2, 'name': 'FD Calculator', 'url': 'https://www.gpaisa.in/calculator/fd' },
                { '@type': 'ListItem', 'position': 3, 'name': 'Home Loan Calculator', 'url': 'https://www.gpaisa.in/calculator/home-loan' },
                { '@type': 'ListItem', 'position': 4, 'name': 'GST Calculator', 'url': 'https://www.gpaisa.in/calculator/gst' },
                { '@type': 'ListItem', 'position': 5, 'name': 'SWP Calculator', 'url': 'https://www.gpaisa.in/calculator/swp' },
                { '@type': 'ListItem', 'position': 6, 'name': 'PPF Calculator', 'url': 'https://www.gpaisa.in/calculator/ppf' },
                { '@type': 'ListItem', 'position': 7, 'name': 'EPF Calculator', 'url': 'https://www.gpaisa.in/calculator/epf' },
                { '@type': 'ListItem', 'position': 8, 'name': 'CAGR Calculator', 'url': 'https://www.gpaisa.in/calculator/cagr' },
                { '@type': 'ListItem', 'position': 9, 'name': 'NPS Calculator', 'url': 'https://www.gpaisa.in/calculator/nps' },
                { '@type': 'ListItem', 'position': 10, 'name': 'HRA Calculator', 'url': 'https://www.gpaisa.in/calculator/hra' },
                { '@type': 'ListItem', 'position': 11, 'name': 'Gratuity Calculator', 'url': 'https://www.gpaisa.in/calculator/gratuity' },
                { '@type': 'ListItem', 'position': 12, 'name': 'EMI Calculator', 'url': 'https://www.gpaisa.in/calculator/emi' },
                { '@type': 'ListItem', 'position': 13, 'name': 'Mutual Fund Calculator', 'url': 'https://www.gpaisa.in/calculator/mutual-fund' },
                { '@type': 'ListItem', 'position': 14, 'name': 'Simple Interest Calculator', 'url': 'https://www.gpaisa.in/calculator/simple-interest' },
            ]
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
            />
        {/* ① HERO STRIP */}
        <section className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">gpaisa.in</span>
                    <span className="text-emerald-300 text-xs">India&apos;s Trusted Financial Portal</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-emerald-200">
                    <span>🪙 Live Gold Rates</span>
                    <span>📊 14 Calculators</span>
                    <span>📰 Financial News</span>
                    <span>✅ Updated Daily</span>
                </div>
                <div className="text-xs text-emerald-300">
                    By <Link href="/about" className="underline text-white font-semibold">Satyapal Khakhal</Link>
                </div>
            </div>
        </section>

        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

                {/* ═══════════════════════════════════════════════════════
                    H1 — SEO TITLE
                ═══════════════════════════════════════════════════════ */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                        Gold Rate Today in India (Live) – Price, Trends & Investment Insights
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
                        Track live gold prices across purities, compare daily changes, and make informed investment decisions with Gpaisa.
                    </p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* ══════════════════════════════════════════════════
                        LEFT COLUMN (MAIN CONTENT)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* SECTIONS 1-5: Gold Dashboard (client component) */}
                        <GoldDashboard />


                        {/* ═══════════════════════════════════════════════
                            SECTION 6: FEATURED GOLD INSIGHTS (BUSINESS)
                        ═══════════════════════════════════════════════ */}
                        {businessCards.length > 0 && (
                            <section id="gold-insights">
                                <SectionHeader
                                    title="Featured Gold Insights"
                                    accentColor="from-amber-500 to-orange-500"
                                    href="/news"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {businessCards.map(article => (
                                        <InsightCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* ═══════════════════════════════════════════════
                            SECTION 7: DECISION BLOCK
                        ═══════════════════════════════════════════════ */}
                        <section id="decision-block">
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200/70 p-5 sm:p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-900">Should You Buy Gold Today?</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Expert-backed quick guidance</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-100">
                                        <span className="text-lg flex-shrink-0">✔️</span>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Long-term Investment</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Buy gradually through SIP or staggered purchases. Gold performs well over 5–10 year horizons.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-100">
                                        <span className="text-lg flex-shrink-0">⚠️</span>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Short-term Trading</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Wait for stability. Short-term volatility can lead to losses. Monitor trends before entering.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION D: CALCULATOR HUB STRIP */}
                        <section id="calculators" aria-labelledby="calc-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">🧮</span>
                                    <h2 id="calc-heading" className="font-bold text-gray-900 text-sm uppercase tracking-wide">Free Financial Calculators</h2>
                                </div>
                                <Link href="/calculator" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View All 14 →</Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y divide-gray-100">
                                {[
                                    { name: 'SIP Calculator', desc: 'Mutual fund returns', href: '/calculator/sip', icon: '📊' },
                                    { name: 'FD Calculator', desc: 'Fixed deposit maturity', href: '/calculator/fd', icon: '🏦' },
                                    { name: 'Home Loan', desc: 'EMI & amortisation', href: '/calculator/home-loan', icon: '🏠' },
                                    { name: 'GST Calculator', desc: 'Add / remove GST', href: '/calculator/gst', icon: '🧾' },
                                    { name: 'SWP Calculator', desc: 'Withdrawal planning', href: '/calculator/swp', icon: '💸' },
                                    { name: 'PPF Calculator', desc: 'PPF maturity & returns', href: '/calculator/ppf', icon: '📈' },
                                    { name: 'CAGR Calculator', desc: 'Investment returns', href: '/calculator/cagr', icon: '📉' },
                                    { name: 'EMI Calculator', desc: 'Loan EMI planning', href: '/calculator/emi', icon: '💰' },
                                ].map(calc => (
                                    <Link key={calc.href} href={calc.href} className="flex items-center gap-2.5 px-4 py-3 hover:bg-primary-50 transition-colors group">
                                        <span className="text-xl flex-shrink-0">{calc.icon}</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-800 group-hover:text-primary-700 leading-tight">{calc.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{calc.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════
                            SECTION 10: FINANCE (CREDIT CARD ARTICLES)
                        ═══════════════════════════════════════════════ */}
                        {financeCards.length > 0 && (
                            <section id="finance-articles">
                                <SectionHeader
                                    title="Credit Card & Finance"
                                    accentColor="from-blue-500 to-indigo-500"
                                    href="/finance"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {financeCards.map(article => (
                                        <FinanceCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* ═══════════════════════════════════════════════
                            SECTION 11: LATEST ARTICLES
                        ═══════════════════════════════════════════════ */}
                        {latestFiltered.length > 0 && (
                            <section id="latest-articles">
                                <SectionHeader
                                    title="Latest Articles"
                                    accentColor="from-gray-600 to-gray-700"
                                    href="/news"
                                />
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                    {latestFiltered.map(article => (
                                        <LatestArticleRow key={article.id} article={article} />
                                    ))}
                                </div>
                            </section>
                        )}


                        {/* SECTION G: ABOUT GPAISA TRUST SECTION */}
                        <section id="about-gpaisa" aria-labelledby="about-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 flex-shrink-0 overflow-hidden border-2 border-emerald-200">
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-lg">SK</div>
                                </div>
                                <div className="flex-1">
                                    <h2 id="about-heading" className="text-sm font-bold text-gray-900 mb-1">About gpaisa.in</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                        gpaisa.in is founded by <strong>Satyapal Khakhal</strong> to provide accurate, unbiased financial data to Indian investors. We cover live gold and silver rates, 14 free financial calculators, credit card reviews, and daily market news — all without any advertiser influence.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">📡 Data from MCX, IBJA, LBMA</span>
                                        <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">📊 BSE, NSE, Agmarknet</span>
                                        <span className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">🔄 Updated Daily</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link href="/about" className="text-xs font-bold text-primary-600 hover:text-primary-700">About Us →</Link>
                                        <a href="https://twitter.com/gpaisa_in" target="_blank" rel="noopener" className="text-xs font-bold text-sky-600 hover:text-sky-700">@gpaisa_in →</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>


                    {/* ══════════════════════════════════════════════════
                        RIGHT COLUMN (SIDEBAR)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* ═══════════════════════════════════════════════
                            SECTION 8: SILVER SNAPSHOT
                        ═══════════════════════════════════════════════ */}
                        <div id="silver-snapshot" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-600 to-gray-700 px-4 py-3 flex justify-between items-center">
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Silver Rate Today</h3>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">LIVE</span>
                            </div>
                            <div className="p-4">
                                <DynamicSilverRates simpleView={true} displayWeight={1000} />
                                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 text-center mt-3 -mx-4 -mb-4">
                                    <Link href="/silver-rate" className="text-xs font-bold text-gray-600 uppercase hover:underline flex items-center justify-center gap-1">
                                        View Full Silver Rates <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>


                        {/* ═══════════════════════════════════════════════
                            SECTION 9: TOOLS SECTION
                        ═══════════════════════════════════════════════ */}
                        <div id="tools-section" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-primary-600" />
                                <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Financial Tools</h3>
                            </div>
                            <div className="p-3 space-y-1">
                                {[
                                    { name: 'SIP Calculator', href: '/calculator/sip', icon: '📊', desc: 'Plan your mutual fund SIP' },
                                    { name: 'HDFC SIP Calculator', href: '/calculator/hdfc-sip-calculator', icon: '🏦', desc: 'Calculate HDFC fund returns' },
                                    { name: 'ICICI SIP Calculator', href: '/calculator/icici-sip-calculator', icon: '🏛️', desc: 'ICICI Prudential SIP planner' },
                                    { name: 'EMI Calculator', href: '/calculator/emi', icon: '🏠', desc: 'Calculate loan EMI' },
                                    { name: 'FD Calculator', href: '/calculator/fd', icon: '💰', desc: 'Fixed deposit returns' },
                                    { name: 'Gold Calculator', href: '/gold-rate', icon: '🪙', desc: 'Calculate gold value' },
                                ].map(tool => (
                                    <Link
                                        key={tool.name}
                                        href={tool.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-colors group"
                                    >
                                        <span className="text-lg flex-shrink-0">{tool.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">{tool.name}</p>
                                            <p className="text-[10px] text-gray-400">{tool.desc}</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>


                        {/* ── GOLD & SILVER RATES BY CITY ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide flex items-center gap-2">
                                    <span className="text-base">📍</span>
                                    Gold & Silver by City
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {/* Gold Rates */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-amber-700 mb-2 uppercase tracking-wider">Gold Rates</h4>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map(city => (
                                            <Link
                                                key={city}
                                                href={`/gold-rate/${city.toLowerCase()}`}
                                                className="text-xs bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 rounded-lg px-2.5 py-1.5 text-center font-medium text-gray-600 hover:text-amber-800 transition-all duration-200"
                                            >
                                                {city}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                {/* Silver Rates */}
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wider">Silver Rates</h4>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map(city => (
                                            <Link
                                                key={city}
                                                href={`/silver-rate/${city.toLowerCase()}`}
                                                className="text-xs bg-gray-50 hover:bg-slate-50 border border-gray-100 hover:border-gray-300 rounded-lg px-2.5 py-1.5 text-center font-medium text-gray-600 hover:text-gray-800 transition-all duration-200"
                                            >
                                                {city}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SECTION K: WHO WE ARE SIDEBAR */}
                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2">Who We Are</h3>
                            <p className="text-xs text-emerald-700 leading-relaxed mb-3">
                                Founded by <strong>Satyapal Khakhal</strong>. We track gold rates, silver prices, commodity markets, and provide free financial calculators for Indian investors.
                            </p>
                            <div className="space-y-1.5 text-[10px] text-emerald-600">
                                <div className="flex items-center gap-1.5"><span>✅</span><span>Data sourced from MCX, IBJA, LBMA</span></div>
                                <div className="flex items-center gap-1.5"><span>✅</span><span>14 free financial calculators</span></div>
                                <div className="flex items-center gap-1.5"><span>✅</span><span>Not SEBI registered — for info only</span></div>
                                <div className="flex items-center gap-1.5"><span>✅</span><span>No advertiser influence</span></div>
                            </div>
                            <Link href="/about" className="mt-3 block text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 rounded-lg py-1.5">
                                Learn More About Us →
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        {/* ④ DATA SOURCES STRIP */}
        <section className="bg-gray-50 border-t border-gray-200 py-4 px-4">
            <div className="max-w-7xl mx-auto">
                <p className="text-xs text-gray-500 text-center mb-2 font-semibold uppercase tracking-wide">Data Sources</p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
                    <span>📊 MCX (Multi Commodity Exchange)</span>
                    <span>🏅 IBJA (India Bullion & Jewellers Association)</span>
                    <span>🌍 LBMA (London Bullion Market Association)</span>
                    <span>📈 BSE & NSE</span>
                    <span>🌾 Agmarknet</span>
                    <span>🏦 RBI Historical Data</span>
                </div>
            </div>
        </section>

        {/* ⑤ SEBI DISCLAIMER STRIP */}
        <div className="bg-amber-50 border-t border-amber-100 py-3 px-4">
            <div className="max-w-7xl mx-auto">
                <p className="text-[11px] text-amber-700 text-center leading-relaxed">
                    <strong>Regulatory Notice:</strong> gpaisa.in is not registered with SEBI. All content is for informational and educational purposes only. Please consult a SEBI-registered investment advisor before making any financial or investment decisions.
                    <Link href="/disclaimer" className="underline ml-1">Full Disclaimer →</Link>
                </p>
            </div>
        </div>
        </>
    );
}
