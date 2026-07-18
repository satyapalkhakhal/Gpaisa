import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calculator, Shield, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import GoldRateStrip from '@/components/GoldRateStrip';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import MetalPriceChart from '@/components/gold-vs-silver/MetalPriceChart';
import {
    fetchArticlesByCategory,
    fetchAllArticles,
    fetchLoanNews,
    fetchTrendingArticles,
    Article
} from '@/lib/supabaseApi';
import { fetchMarketIndices } from '@/lib/indicesApi';
import { fetchSilverRateData } from '@/lib/angelOneApi';

export const metadata: Metadata = {
    title: "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
    description: "India's trusted financial portal. Live 24K gold rate today, silver price, SIP calculator, FD calculator, home loan calculator, GST calculator, credit card reviews. Updated daily by Satyapal Khakhal.",
    authors: [{ name: "Satyapal Khakhal", url: "https://www.gpaisa.in/about" }],
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

export const revalidate = 300; // 5 min — dashboard data should feel reasonably live

// ─── Shared bits ───────────────────────────────────────────────

type Accent = 'amber' | 'blue' | 'green' | 'violet';

const ACCENT: Record<Accent, { bar: string; tag: string; hover: string }> = {
    amber: { bar: 'from-amber-500 to-orange-500', tag: 'text-amber-700 bg-amber-50', hover: 'hover:border-amber-200' },
    blue: { bar: 'from-blue-500 to-indigo-600', tag: 'text-blue-700 bg-blue-50', hover: 'hover:border-blue-200' },
    green: { bar: 'from-green-500 to-emerald-600', tag: 'text-green-700 bg-green-50', hover: 'hover:border-green-200' },
    violet: { bar: 'from-violet-500 to-purple-600', tag: 'text-violet-700 bg-violet-50', hover: 'hover:border-violet-200' },
};

function formatDate(article: Article) {
    return article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const PanelHeader = ({ title, accent, href, badge }: { title: string; accent: Accent; href?: string; badge?: string }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
            <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${ACCENT[accent].bar}`} />
            <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
            {badge && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${ACCENT[accent].tag}`}>{badge}</span>
            )}
        </div>
        {href && (
            <Link href={href} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
        )}
    </div>
);

// A single dense, scannable row — the one card pattern reused across every news panel.
const DenseRow = ({ article, accent }: { article: Article; accent: Accent }) => (
    <Link href={`/articles/${article.slug}`} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/70 transition-colors">
        <div className="w-14 h-11 bg-gray-100 rounded-md shrink-0 overflow-hidden relative">
            {article.image_url ? (
                <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="56px" />
            ) : (
                <div className={`w-full h-full flex items-center justify-center text-[9px] font-bold ${ACCENT[accent].tag}`}>{article.category?.slice(0, 3)}</div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                {article.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400">
                <span className={`font-bold uppercase ${ACCENT[accent].tag} px-1.5 py-0.5 rounded`}>{article.subcategory || article.category}</span>
                <span>{formatDate(article)}</span>
            </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" />
    </Link>
);

const NewsPanel = ({ title, accent, href, badge, articles }: { title: string; accent: Accent; href: string; badge?: string; articles: Article[] }) => {
    if (articles.length === 0) return null;
    return (
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <PanelHeader title={title} accent={accent} href={href} badge={badge} />
            <div className="divide-y divide-gray-50">
                {articles.map(article => <DenseRow key={article.id} article={article} accent={accent} />)}
            </div>
        </section>
    );
};

// Compact index tile for the "Markets at a Glance" strip.
const IndexTile = ({ name, value, change, changePercent }: { name: string; value: number; change: number; changePercent: number }) => {
    const up = change >= 0;
    return (
        <div className="bg-white/10 rounded-lg px-3 py-2 min-w-[130px]">
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wide truncate">{name}</p>
            <p className="text-sm font-bold text-white mt-0.5">{value.toLocaleString('en-IN')}</p>
            <p className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {up ? '+' : ''}{changePercent.toFixed(2)}%
            </p>
        </div>
    );
};

// ─── Main Page Component ─────────────────────────────────────────────

export default async function HomePage() {
    const [
        businessArticles,
        financeArticles,
        ipoArticles,
        allArticles,
        loanArticles,
        trendingArticles,
        marketIndices,
        silverRateData,
    ] = await Promise.all([
        fetchArticlesByCategory('BUSINESS', 12),
        fetchArticlesByCategory('FINANCE', 12),
        fetchArticlesByCategory('IPO', 6),
        fetchAllArticles(15),
        fetchLoanNews(8),
        fetchTrendingArticles(5),
        fetchMarketIndices().catch(() => []),
        fetchSilverRateData('XAG').catch(() => null),
    ]);

    const featuredArticle = allArticles[0] || null;
    const latestHeadlines = allArticles.slice(1, 6);

    const headlineIds = new Set(allArticles.slice(0, 6).map(a => a.id));
    const businessCards = businessArticles.filter(a => !headlineIds.has(a.id)).slice(0, 5);
    const financeCardsDedupe = financeArticles.filter(a => !headlineIds.has(a.id)).slice(0, 5);
    const financeCards = financeCardsDedupe.length > 0 ? financeCardsDedupe : financeArticles.slice(0, 5);

    const usedIds = new Set<string>();
    [...allArticles.slice(0, 6), ...businessCards, ...financeCards, ...ipoArticles].forEach(a => usedIds.add(a.id));
    const loanCards = loanArticles.filter(a => !usedIds.has(a.id)).slice(0, 5);
    const trendingCards = trendingArticles.filter(a => !usedIds.has(a.id)).slice(0, 5);

    const jsonLdSchemas = {
        '@context': 'https://schema.org',
        '@graph': [
        {
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
                'contactPoint': { '@type': 'ContactPoint', 'email': 'contact@gpaisa.in', 'contactType': 'customer support' },
                'sameAs': ['https://twitter.com/gpaisa_in']
            },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://www.gpaisa.in/search?q={search_term_string}' },
                'query-input': 'required name=search_term_string'
            }
        },
        {
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
            '@type': 'ItemList',
            'name': 'Financial Calculators — gpaisa.in',
            'description': 'Free financial calculators for Indian investors',
            'numberOfItems': 15,
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
                { '@type': 'ListItem', 'position': 15, 'name': 'Car Loan Calculator', 'url': 'https://www.gpaisa.in/calculator/car-loan' },
            ]
        }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
            />

            {/* ① MARKETS AT A GLANCE — dense live strip (hidden if the live feed has no data) */}
            {marketIndices.length > 0 && (
                <section className="bg-gray-900 py-3 px-4 overflow-x-auto">
                    <div className="max-w-7xl mx-auto flex items-center gap-2.5 min-w-max">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0 pr-2 border-r border-gray-700">
                            Markets
                        </span>
                        {marketIndices.slice(0, 4).map(idx => (
                            <IndexTile key={idx.symbol} name={idx.name} value={idx.value} change={idx.change} changePercent={idx.changePercent} />
                        ))}
                    </div>
                </section>
            )}

            <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">

                    {/* Page H1 — unconditional, matches the page's <title> */}
                    <h1 className="text-sm sm:text-base font-semibold text-gray-500 mb-3">
                        Live Gold Rates, Financial Calculators &amp; Market Data for India
                    </h1>

                    {/* ② GOLD RATE STRIP */}
                    <div className="mb-5">
                        <GoldRateStrip />
                    </div>

                    {/* ③ TOP HEADLINES — compact lead + dense list */}
                    {featuredArticle && (
                        <section className="mb-5">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
                                <h2 className="text-base sm:text-lg font-bold text-gray-900">Top Headlines</h2>
                                <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                    </span>
                                    LIVE
                                </span>
                                <Link href="/news" className="ml-auto text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                    View All <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link href={`/articles/${featuredArticle.slug}`}
                                    className="md:col-span-2 group relative block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                                    <div className="relative h-full min-h-[280px] w-full overflow-hidden">
                                        {featuredArticle.image_url ? (
                                            <Image src={featuredArticle.image_url} alt={featuredArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 66vw" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-200" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full mb-1.5">{featuredArticle.subcategory || featuredArticle.category}</span>
                                            <h2 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">{featuredArticle.title}</h2>
                                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-300">
                                                <span>{formatDate(featuredArticle)}</span>
                                                <span>•</span>
                                                <span>{featuredArticle.read_time || '3 min read'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    {latestHeadlines.map(article => <DenseRow key={article.id} article={article} accent="amber" />)}
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                        {/* ══ LEFT COLUMN — news panels ══ */}
                        <div className="lg:col-span-8 space-y-5">

                            <NewsPanel title="Gold &amp; Business News" accent="amber" href="/news" articles={businessCards} />

                            {/* Quick Take strip — compact, not a full card */}
                            <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/70 rounded-xl px-4 py-3">
                                <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-900 leading-snug">
                                    <strong>Quick take:</strong> Buy gold gradually via SIP for long-term goals (5–10yr); avoid short-term trades during volatile phases.
                                </p>
                            </div>

                            <NewsPanel title="IPO News" accent="violet" href="/category/ipo" badge="IPO" articles={ipoArticles} />

                            <NewsPanel title="Credit Card &amp; Finance" accent="blue" href="/category/finance" articles={financeCards} />

                            <NewsPanel title="Home Loan &amp; Loans" accent="green" href="/news" articles={loanCards} />

                            {/* CALCULATOR HUB STRIP */}
                            <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-primary-600" />
                                        <h2 className="font-bold text-gray-900 text-sm">Free Financial Calculators</h2>
                                    </div>
                                    <Link href="/calculator" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View All 15 →</Link>
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

                        </div>

                        {/* ══ RIGHT COLUMN — dense widgets ══ */}
                        <div className="lg:col-span-4 space-y-4">

                            {/* SILVER RATE */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-600 to-gray-700 px-4 py-2.5 flex justify-between items-center">
                                    <h3 className="font-bold text-white uppercase text-xs tracking-wide">Silver Rate Today</h3>
                                    <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">LIVE</span>
                                </div>
                                <div className="p-3">
                                    <DynamicSilverRates simpleView={true} displayWeight={1000} initialRateData={silverRateData} initialLastUpdated={silverRateData ? new Date().toISOString() : null} />
                                    <Link href="/silver-rate" className="mt-2 block text-center text-[11px] font-bold text-gray-600 uppercase hover:underline">
                                        View Full Silver Rates →
                                    </Link>
                                </div>
                            </div>

                            {/* GOLD VS SILVER MINI TREND */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-3">
                                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wide mb-2 px-1">Gold vs Silver Trend</h3>
                                <MetalPriceChart id="home-gold-vs-silver" metal="both" title="" />
                                <Link href="/gold-vs-silver" className="mt-1 block text-center text-[11px] font-bold text-gray-600 uppercase hover:underline">
                                    Full Comparison →
                                </Link>
                            </div>

                            {/* TRENDING NOW */}
                            {trendingCards.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wide">Trending Now</h3>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {trendingCards.map((article, i) => (
                                            <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 px-4 py-2.5 hover:bg-gray-50/70 transition-colors">
                                                <span className="text-lg font-black text-gray-200 group-hover:text-primary-200 w-5 text-center shrink-0">{i + 1}</span>
                                                <h4 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">{article.title}</h4>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FINANCIAL TOOLS */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-primary-600" />
                                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wide">Financial Tools</h3>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    {[
                                        { name: 'SIP Calculator', href: '/calculator/sip', icon: '📊' },
                                        { name: 'HDFC SIP Calculator', href: '/calculator/hdfc-sip-calculator', icon: '🏦' },
                                        { name: 'ICICI SIP Calculator', href: '/calculator/icici-sip-calculator', icon: '🏛️' },
                                        { name: 'EMI Calculator', href: '/calculator/emi', icon: '🏠' },
                                        { name: 'FD Calculator', href: '/calculator/fd', icon: '💰' },
                                        { name: 'Gold Calculator', href: '/gold-rate', icon: '🪙' },
                                    ].map(tool => (
                                        <Link key={tool.name} href={tool.href} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-colors group">
                                            <span className="text-base flex-shrink-0">{tool.icon}</span>
                                            <p className="text-xs font-semibold text-gray-800 group-hover:text-primary-700 flex-1">{tool.name}</p>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* GOLD & SILVER BY CITY */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wide">Gold &amp; Silver by City</h3>
                                </div>
                                <div className="p-3">
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'].map(city => (
                                            <Link key={city} href={`/gold-rate/${city.toLowerCase()}`}
                                                className="text-xs bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 rounded-lg px-2.5 py-1.5 text-center font-medium text-gray-600 hover:text-amber-800 transition-all">
                                                {city}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ABOUT — single consolidated block */}
                            <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">SK</div>
                                    <div>
                                        <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">About gpaisa.in</h3>
                                        <p className="text-[10px] text-emerald-600">By Satyapal Khakhal</p>
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-700 leading-relaxed mb-3">
                                    Accurate, unbiased financial data — live gold &amp; silver rates across 30+ cities, 15 free calculators, and daily market news, with no advertiser influence.
                                </p>
                                <div className="flex flex-wrap gap-1.5 mb-3 text-[9px]">
                                    {['MCX', 'IBJA', 'LBMA', 'BSE & NSE', 'RBI Data'].map(src => (
                                        <span key={src} className="bg-white border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{src}</span>
                                    ))}
                                </div>
                                <Link href="/about" className="block text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 rounded-lg py-1.5">
                                    Learn More →
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* DATA SOURCES STRIP */}
            <section className="bg-gray-50 border-t border-gray-200 py-4 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="text-xs text-gray-500 text-center mb-2 font-semibold uppercase tracking-wide">Data Sources</p>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
                        <span>📊 MCX (Multi Commodity Exchange)</span>
                        <span>🏅 IBJA (India Bullion &amp; Jewellers Association)</span>
                        <span>🌍 LBMA (London Bullion Market Association)</span>
                        <span>📈 BSE &amp; NSE</span>
                        <span>🏦 RBI Historical Data</span>
                    </div>
                </div>
            </section>

            {/* SEBI DISCLAIMER STRIP */}
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
