import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calculator, Shield } from 'lucide-react';
import GoldRateStrip from '@/components/GoldRateStrip';
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
        allArticles,
    ] = await Promise.all([
        fetchArticlesByCategory('BUSINESS', 12),
        fetchArticlesByCategory('FINANCE', 12),
        fetchAllArticles(15),
    ]);

    // ── Top Headlines data ──
    const featuredArticle = allArticles[0] || null;
    const secondaryArticles = allArticles.slice(1, 3);
    const latestHeadlines = allArticles.slice(3, 8);

    // ── Section cards ──
    const headlineIds = new Set(allArticles.slice(0, 8).map(a => a.id));
    const businessCards = businessArticles.filter(a => !headlineIds.has(a.id)).slice(0, 3);
    const financeCardsDedupe = financeArticles.filter(a => !headlineIds.has(a.id)).slice(0, 4);
    // Fallback: if dedup removed all articles, use raw finance articles so section always shows
    const financeCards = financeCardsDedupe.length > 0 ? financeCardsDedupe : financeArticles.slice(0, 4);

    // De-duplicate for latest section
    const usedIds = new Set<string>();
    [...allArticles.slice(0, 8), ...businessCards, ...financeCards].forEach(a => usedIds.add(a.id));
    const latestFiltered = allArticles.filter(a => !usedIds.has(a.id)).slice(0, 5);

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
                    <div className="hidden sm:flex items-center gap-4 text-xs text-emerald-200">
                        <span>🪙 Live Gold Rates</span>
                        <span>📊 15 Calculators</span>
                        <span>📰 Financial News</span>
                        <span>✅ Updated Daily</span>
                    </div>
                    <div className="hidden sm:block text-xs text-emerald-300">
                        By <Link href="/about" className="underline text-white font-semibold">Satyapal Khakhal</Link>
                    </div>
                </div>
            </section>

            <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

                    {/* ═══════════════════════════════════════════════════════
                    SECTION ② — TOP HEADLINES (editorial hero)
                ═══════════════════════════════════════════════════════ */}
                    {featuredArticle && (
                        <section id="top-headlines" aria-labelledby="headlines-heading" className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
                                    <h1 id="headlines-heading" className="text-base sm:text-lg font-bold text-gray-900">Top Headlines</h1>
                                    <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                        </span>
                                        LIVE
                                    </span>
                                </div>
                                <Link href="/news" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                                    View All <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {/* Hero grid — 1 large + 2 small */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* LARGE featured article */}
                                <Link href={`/articles/${featuredArticle.slug}`}
                                    className="md:col-span-2 group relative block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 min-h-[280px]">
                                    <div className="relative h-52 md:h-full w-full overflow-hidden">
                                        {featuredArticle.image_url ? (
                                            <Image src={featuredArticle.image_url} alt={featuredArticle.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 66vw" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-200" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white px-2 py-0.5 rounded-full mb-2">{featuredArticle.subcategory || featuredArticle.category}</span>
                                            <h2 className="text-white font-bold text-base md:text-lg leading-snug line-clamp-3 group-hover:text-amber-300 transition-colors">{featuredArticle.title}</h2>
                                            <p className="text-gray-300 text-xs mt-1.5 line-clamp-2">{featuredArticle.excerpt}</p>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                                                <span>{featuredArticle.date || new Date(featuredArticle.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                <span>•</span>
                                                <span>{featuredArticle.read_time || '3 min read'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* 2 smaller articles stacked */}
                                <div className="flex flex-col gap-4">
                                    {secondaryArticles.map((article) => (
                                        <Link key={article.id} href={`/articles/${article.slug}`}
                                            className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300 flex-1">
                                            <div className="relative h-32 overflow-hidden">
                                                {article.image_url ? (
                                                    <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100" />
                                                )}
                                            </div>
                                            <div className="p-3 flex-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">{article.subcategory || article.category}</span>
                                                <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 mt-1.5 group-hover:text-primary-600 transition-colors">{article.title}</h3>
                                                <p className="text-[10px] text-gray-400 mt-1">{article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* News ticker strip */}
                            {latestHeadlines.length > 0 && (
                                <div className="mt-3 bg-gray-900 rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden">
                                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex-shrink-0 border-r border-gray-700 pr-3">LATEST</span>
                                    <div className="overflow-hidden flex-1">
                                        <div className="flex gap-6 animate-marquee whitespace-nowrap text-xs text-gray-300">
                                            {[...latestHeadlines, ...latestHeadlines].map((h, i) => (
                                                <Link key={i} href={`/articles/${h.slug}`} className="hover:text-amber-300 transition-colors flex-shrink-0">
                                                    <span className="text-amber-500 mr-1.5">●</span>{h.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ═══════════════════════════════════════════════════════
                    SECTION ③ — GOLD RATE STRIP (compact)
                ═══════════════════════════════════════════════════════ */}
                    <GoldRateStrip />


                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                        {/* ══════════════════════════════════════════════════
                        LEFT COLUMN (MAIN CONTENT)
                    ══════════════════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* ═══════════════════════════════════════════════
                            SECTION ④: GOLD MARKET UPDATES (BUSINESS)
                        ═══════════════════════════════════════════════ */}
                            {businessCards.length > 0 && (
                                <section id="gold-insights">
                                    <SectionHeader
                                        title="Gold Market Updates"
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
                            SECTION ④b: DECISION BLOCK
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

                            {/* ═══════════════════════════════════════════════
                            SECTION ⑤: CREDIT CARD & FINANCE (2×2 grid)
                        ═══════════════════════════════════════════════ */}
                            {financeArticles.length > 0 && (
                                <section id="finance-news" aria-labelledby="finance-heading">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                                            <h2 id="finance-heading" className="text-base sm:text-lg font-bold text-gray-900">Credit Card &amp; Finance</h2>
                                        </div>
                                        <Link href="/finance" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                            View All <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {financeCards.slice(0, 4).map(article => (
                                            <Link key={article.id} href={`/articles/${article.slug}`}
                                                className="group flex gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-blue-200 transition-all duration-300">
                                                <div className="w-20 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                                    {article.image_url ? (
                                                        <Image src={article.image_url} alt="" fill className="object-cover" sizes="80px" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-400 text-[10px] font-bold">FINANCE</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{article.subcategory || 'Finance'}</span>
                                                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mt-0.5">{article.title}</h3>
                                                    <p className="text-[10px] text-gray-400 mt-1">{article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}


                            {/* ═══════════════════════════════════════════════
                            SECTION ⑥: CALCULATOR HUB STRIP
                        ═══════════════════════════════════════════════ */}
                            <section id="calculators" aria-labelledby="calc-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🧮</span>
                                        <h2 id="calc-heading" className="font-bold text-gray-900 text-sm uppercase tracking-wide">Free Financial Calculators</h2>
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
                                        { name: 'Car Loan', desc: 'Auto loan EMI & rates', href: '/calculator/car-loan', icon: '🚗' },
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
                            SECTION ⑦: LATEST ARTICLES
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


                            {/* ═══════════════════════════════════════════════
                            SECTION ⑧: ABOUT GPAISA (redesigned)
                        ═══════════════════════════════════════════════ */}
                            <section id="about-gpaisa" aria-labelledby="about-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-5 sm:p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Premium avatar */}
                                        <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden border-2 border-emerald-300 shadow-md">
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl tracking-wider">SK</div>
                                        </div>
                                        <div className="flex-1">
                                            <h2 id="about-heading" className="text-base font-bold text-gray-900 mb-0.5">About gpaisa.in</h2>
                                            <p className="text-xs text-gray-500 mb-2">Founded by <strong className="text-gray-700">Satyapal Khakhal</strong></p>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                gpaisa.in provides accurate, unbiased financial data to Indian investors. We cover live gold &amp; silver rates across 30+ cities, 15 free financial calculators, credit card reviews, and daily market news — all without any advertiser influence.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Data source badges */}
                                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                                        <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">📡 MCX</span>
                                        <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">🏅 IBJA</span>
                                        <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">🌍 LBMA</span>
                                        <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">📊 BSE &amp; NSE</span>
                                        <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">🌾 Agmarknet</span>
                                        <span className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">🏦 RBI Data</span>
                                        <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-medium">🔄 Updated Daily</span>
                                    </div>

                                    {/* CTAs */}
                                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                        <Link href="/about" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">About Us →</Link>
                                        <span className="text-gray-300">|</span>
                                        <a href="https://twitter.com/gpaisa_in" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1">
                                            𝕏 @gpaisa_in
                                        </a>
                                        <span className="text-gray-300">|</span>
                                        <a href="mailto:contact@gpaisa.in" className="text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">contact@gpaisa.in</a>
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
                                    <div className="flex items-center gap-1.5"><span>✅</span><span>15 free financial calculators</span></div>
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
