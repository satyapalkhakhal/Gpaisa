import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calculator, Shield, ArrowRight } from 'lucide-react';
import GoldDashboard from '@/components/GoldDashboard';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import {
    fetchArticlesByCategory,
    fetchAllArticles,
    Article
} from '@/lib/supabaseApi';

export const metadata: Metadata = {
    title: 'gpaisa.in — Gold Rates, SIP & FD Calculators, Market Data | India\'s Financial Portal',
    description: 'India\'s trusted financial portal. Live gold & silver rates, SIP calculator, FD calculator, home loan calculator, GST calculator, credit card reviews and market news. Updated daily.',
    keywords: 'gold rate today india, sip calculator, fd calculator, home loan calculator, gst calculator, silver rate today, financial calculators india, credit card reviews india, investment tools india, gpaisa',
    authors: [{ name: 'Satyapal Khakhal' }],
    openGraph: {
        title: 'gpaisa.in — Gold Rates, Financial Calculators & Market Data for India',
        description: 'Live gold rates, silver prices, SIP/FD/home loan calculators, GST tool, credit card reviews and financial news — all in one place. Trusted by Indian investors.',
        type: 'website',
        locale: 'en_IN',
        url: 'https://www.gpaisa.in',
        siteName: 'gpaisa.in',
        images: [
            {
                url: 'https://www.gpaisa.in/og-homepage.jpg',
                width: 1200,
                height: 630,
                alt: 'gpaisa.in — India\'s Financial Portal for Gold Rates, Calculators & Market Data',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'gpaisa.in — Gold Rates, SIP & FD Calculators, Market Data India',
        description: 'Live gold & silver rates, SIP/FD/home loan calculators, credit card reviews. India\'s trusted financial portal. Updated daily.',
        images: ['https://www.gpaisa.in/og-homepage.jpg'],
        creator: '@gpaisa_in',
        site: '@gpaisa_in',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in'
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

    // JSON-LD Structured Data
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.gpaisa.in/#website',
        'url': 'https://www.gpaisa.in',
        'name': 'gpaisa.in',
        'description': 'India\'s trusted financial portal for live gold rates, silver prices, financial calculators, and market data.',
        'publisher': {
            '@type': 'Organization',
            'name': 'gpaisa.in',
            'url': 'https://www.gpaisa.in',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://www.gpaisa.in/android-chrome-512x512.png',
                'width': 512,
                'height': 512
            }
        },
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://www.gpaisa.in/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://www.gpaisa.in/#organization',
        'name': 'gpaisa.in',
        'url': 'https://www.gpaisa.in',
        'logo': 'https://www.gpaisa.in/android-chrome-512x512.png',
        'description': 'India\'s trusted financial portal providing live gold rates, silver prices, investment calculators, and financial news.',
        'foundingDate': '2025',
        'founder': {
            '@type': 'Person',
            'name': 'Satyapal Khakhal'
        },
        'contactPoint': {
            '@type': 'ContactPoint',
            'email': 'info@gpaisa.in',
            'contactType': 'customer support',
            'availableLanguage': ['English', 'Hindi']
        },
        'sameAs': [
            'https://twitter.com/gpaisa_in'
        ]
    };

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': 'https://www.gpaisa.in/#webpage',
        'url': 'https://www.gpaisa.in',
        'name': 'gpaisa.in — Gold Rates, Financial Calculators & Market Data | India\'s Financial Portal',
        'description': 'India\'s trusted financial portal for live gold rates, silver prices, SIP/FD/home loan calculators, and market news.',
        'isPartOf': { '@id': 'https://www.gpaisa.in/#website' },
        'about': { '@id': 'https://www.gpaisa.in/#organization' },
        'author': {
            '@type': 'Person',
            'name': 'Satyapal Khakhal'
        },
        'inLanguage': 'en-IN',
        'dateModified': '2026-05-21'
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
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


                        {/* ═══════════════════════════════════════════════
                            SECTION 12: TRUST / ABOUT
                        ═══════════════════════════════════════════════ */}
                        <section id="about-trust" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-primary-600" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">About Gpaisa</h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Gpaisa provides accurate gold price data, investment comparisons, and expert-backed financial insights to help Indian investors make better decisions. We aggregate data from trusted sources to bring you real-time gold, silver, and commodity prices alongside calculators and tools for smarter financial planning.
                            </p>
                            <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 mt-3 transition-colors">
                                Learn More <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
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


                        {/* ── AD SPACE ──
                        <div className="bg-gray-100 h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-xl">
                            <span className="text-gray-400 text-sm font-medium">Ad Space</span>
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
