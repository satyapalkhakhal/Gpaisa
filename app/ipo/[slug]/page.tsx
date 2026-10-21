import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchAllPublishedIpoSlugs, fetchIpoBySlug, fetchListedIpos, fetchOpenIpos, fetchUpcomingIpos } from '@/lib/ipoApi';
import { fetchArticlesForIpo } from '@/lib/articlesApi';
import { LIFECYCLE_LABELS, RECOMMENDATION_LABELS } from '@/lib/ipoTypes';
import StatusBadge from '@/components/ipo/StatusBadge';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';
import CompareCheckbox from '@/components/ipo/CompareCheckbox';
import LifecycleTimeline from '@/components/ipo/LifecycleTimeline';
import GmpHistoryChart from '@/components/ipo/GmpHistoryChart';
import SubscriptionChart from '@/components/ipo/SubscriptionChart';
import DatesTimelineTable from '@/components/ipo/DatesTimelineTable';
import MarketLotTable from '@/components/ipo/MarketLotTable';
import ReservationTable from '@/components/ipo/ReservationTable';
import ObjectsOfIssueTable from '@/components/ipo/ObjectsOfIssueTable';
import AnchorInvestorSection from '@/components/ipo/AnchorInvestorSection';
import PromoterHoldingTable from '@/components/ipo/PromoterHoldingTable';
import FinancialsTable from '@/components/ipo/FinancialsTable';
import ValuationKpiTable from '@/components/ipo/ValuationKpiTable';
import PeerComparisonTable from '@/components/ipo/PeerComparisonTable';
import CompanyContactBlock from '@/components/ipo/CompanyContactBlock';
import IpoFaq from '@/components/ipo/IpoFaq';
import GmpProfitCalculator from '@/components/ipo/GmpProfitCalculator';
import RelatedIpos from '@/components/ipo/RelatedIpos';
import { computeMarketLotTiers, computeValuationKpis } from '@/lib/ipoComputed';

export const revalidate = 300;

export async function generateStaticParams() {
    const ipos = await fetchAllPublishedIpoSlugs();
    return ipos.map(ipo => ({ slug: ipo.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const ipo = await fetchIpoBySlug(slug);
    if (!ipo) return { title: 'IPO Not Found | gpaisa.in' };

    const companyName = ipo.company?.name || ipo.slug;
    const title = ipo.meta_title || `${companyName} IPO — GMP, Price Band, Subscription, Allotment | gpaisa.in`;
    const description = ipo.meta_description || `${companyName} ${ipo.ipo_type.toUpperCase()} IPO: price band, lot size, dates, GMP, subscription status, allotment, and review.`;

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url: `https://www.gpaisa.in/ipo/${ipo.slug}`, siteName: 'gpaisa.in', locale: 'en_IN' },
        alternates: { canonical: `https://www.gpaisa.in/ipo/${ipo.slug}` },
        robots: { index: ipo.publish_status === 'published', follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

function formatDate(d: string | null): string {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(n: number | null): string {
    return n != null ? `₹${n.toLocaleString('en-IN')}` : 'TBA';
}

export default async function IpoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const ipo = await fetchIpoBySlug(slug);
    if (!ipo) notFound();

    const companyName = ipo.company?.name || ipo.slug;
    const investmentAtLot = ipo.price_band_max && ipo.lot_size ? ipo.price_band_max * ipo.lot_size : null;
    const latestGmp = ipo.gmp_history[0];
    const latestFinancial = ipo.financials[ipo.financials.length - 1];
    const valuationKpis = computeValuationKpis(latestFinancial, ipo);
    const ownPeerRow = latestFinancial
        ? { name: companyName, eps: valuationKpis.eps, pe_ratio: valuationKpis.peRatio, ronw_percent: valuationKpis.ronwPercent, nav: valuationKpis.nav, income: latestFinancial.revenue }
        : null;

    const [openIpos, upcomingIpos, listedIpos, news] = await Promise.all([
        fetchOpenIpos({ limit: 6 }),
        fetchUpcomingIpos({ limit: 6 }),
        fetchListedIpos({ limit: 6 }),
        fetchArticlesForIpo(ipo.id, companyName),
    ]);
    const relatedCurrent = [...openIpos, ...upcomingIpos.filter(i => i.open_date)].filter(i => i.id !== ipo.id).slice(0, 5);
    const relatedListed = listedIpos.filter(i => i.id !== ipo.id).slice(0, 5);

    // Sections render only when they have something to show — IPOs synced from a feed
    // start with little more than dates and price, and empty shells read as thin content.
    const canCalculateGmp = ipo.price_band_max != null && ipo.lot_size != null;
    const showMarketLot = computeMarketLotTiers(ipo.price_band_max, ipo.lot_size).length > 0;
    const showGmp = !!latestGmp || (canCalculateGmp && ipo.status !== 'listed');
    const showSubscription = ipo.subscription_history.length > 0 || Object.keys(ipo.reservation_percentages).length > 0;
    const hasObjects = ipo.objects_of_issue_breakdown.length > 0 || !!ipo.objects_of_issue;
    const showAboutIssue = !!(ipo.fresh_issue_amount || ipo.ofs_amount || ipo.face_value || ipo.lead_managers.length || hasObjects || ipo.company?.about);
    const company = ipo.company;
    const showContact = !!ipo.registrar || !!(company && (company.registered_office || company.phone || company.email || company.website));

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${companyName} IPO`,
        description: `${companyName} ${ipo.ipo_type} IPO — price band, lot size, dates, GMP, subscription, and allotment.`,
        url: `https://www.gpaisa.in/ipo/${ipo.slug}`,
        inLanguage: 'en-IN',
        dateModified: ipo.updated_at,
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'IPO', item: 'https://www.gpaisa.in/ipo' },
            { '@type': 'ListItem', position: 3, name: `${companyName} IPO`, item: `https://www.gpaisa.in/ipo/${ipo.slug}` },
        ],
    };
    const productSchema = ipo.price_band_max != null ? {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: `${companyName} IPO`,
        category: ipo.ipo_type === 'sme' ? 'SME IPO' : 'Mainboard IPO',
        url: `https://www.gpaisa.in/ipo/${ipo.slug}`,
        provider: { '@type': 'Organization', name: companyName, ...(company?.website ? { url: company.website } : {}) },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: ipo.price_band_min ?? ipo.price_band_max,
            highPrice: ipo.price_band_max,
            ...(ipo.open_date ? { availabilityStarts: ipo.open_date } : {}),
            ...(ipo.close_date ? { availabilityEnds: ipo.close_date } : {}),
        },
    } : null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, '\\u003c') }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
            {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }} />}

            {/* Above the fold: identity, status, price band, lot, key dates */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{companyName} IPO</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">{ipo.ipo_type} · {ipo.exchange?.toUpperCase() || 'NSE/BSE'}</p>
                        <p className="text-xs text-gray-400 mt-1">Updated {formatDate(ipo.updated_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={ipo.status} className="text-sm px-3 py-1.5" />
                        <CompareCheckbox slug={ipo.slug} name={`${companyName} IPO`} />
                    </div>
                </div>

                <div className="mb-5 overflow-x-auto">
                    <LifecycleTimeline status={ipo.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Price band</p>
                        <p className="font-bold text-gray-900">{ipo.price_band_min != null ? `${formatCurrency(ipo.price_band_min)} – ${formatCurrency(ipo.price_band_max)}` : 'TBA'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Lot size</p>
                        <p className="font-bold text-gray-900">{ipo.lot_size ? `${ipo.lot_size} shares` : 'TBA'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Min. investment (retail)</p>
                        <p className="font-bold text-gray-900">{formatCurrency(investmentAtLot)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Total issue size</p>
                        <p className="font-bold text-gray-900">{ipo.total_issue_size ? `₹${ipo.total_issue_size} Cr` : 'TBA'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Open date</p>
                        <p className="font-bold text-gray-900">{formatDate(ipo.open_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Close date</p>
                        <p className="font-bold text-gray-900">{formatDate(ipo.close_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Allotment date</p>
                        <p className="font-bold text-gray-900">{formatDate(ipo.allotment_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Listing date</p>
                        <p className="font-bold text-gray-900">{formatDate(ipo.listing_date)}</p>
                    </div>
                </div>
            </div>

            {/* Key dates + market lot — literal tables in addition to the visual timeline above */}
            <div className={`grid grid-cols-1 gap-6 mb-6 ${showMarketLot ? 'sm:grid-cols-2' : ''}`}>
                <section className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">IPO Timeline</h2>
                    <DatesTimelineTable ipo={ipo} />
                </section>
                {showMarketLot && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Market Lot</h2>
                        <MarketLotTable ipo={ipo} />
                    </section>
                )}
            </div>

            {/* GMP */}
            {showGmp && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-gray-900">Grey Market Premium (GMP)</h2>
                    <DataSourceBadge kind="unofficial" />
                </div>
                {latestGmp ? (
                    <>
                        <div className="flex flex-wrap items-baseline gap-4 mb-3">
                            <p className="text-3xl font-bold text-gray-900">₹{latestGmp.gmp_value}</p>
                            {latestGmp.gmp_percentage != null && (
                                <p className="text-lg font-semibold text-green-600">{latestGmp.gmp_percentage > 0 ? '+' : ''}{latestGmp.gmp_percentage}%</p>
                            )}
                            {latestGmp.estimated_listing_price != null && (
                                <p className="text-sm text-gray-500">Est. listing: <span className="font-semibold text-gray-800">₹{latestGmp.estimated_listing_price}</span></p>
                            )}
                            <FreshnessBadge timestamp={latestGmp.recorded_at} staleAfterMinutes={180} />
                        </div>
                        <GmpHistoryChart history={ipo.gmp_history} />
                        <p className="text-xs text-gray-400 mt-2">
                            GMP is unofficial grey market sentiment, not an exchange-quoted or guaranteed price. Source: {latestGmp.source}.
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">No GMP reported yet. Enter an expected GMP below to estimate returns.</p>
                )}
                {canCalculateGmp && (
                    <GmpProfitCalculator priceBandMax={ipo.price_band_max!} lotSize={ipo.lot_size!} latestGmp={latestGmp?.gmp_value ?? null} />
                )}
            </section>
            )}

            {/* Listing performance — actual outcome, distinct from pre-listing GMP estimates */}
            {ipo.listing_price != null && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Listing Performance</h2>
                        <DataSourceBadge kind="official" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                        <div>
                            <p className="text-xs text-gray-400">Listed at</p>
                            <p className="font-bold text-gray-900">₹{ipo.listing_price}</p>
                            {ipo.price_band_max != null && (
                                <p className={`text-xs font-semibold ${ipo.listing_price >= ipo.price_band_max ? 'text-green-600' : 'text-red-600'}`}>
                                    {ipo.listing_price >= ipo.price_band_max ? '+' : ''}{(((ipo.listing_price - ipo.price_band_max) / ipo.price_band_max) * 100).toFixed(1)}% vs issue price
                                </p>
                            )}
                        </div>
                        {ipo.listing_day_close_price != null && (
                            <div>
                                <p className="text-xs text-gray-400">Listing day close</p>
                                <p className="font-bold text-gray-900">₹{ipo.listing_day_close_price}</p>
                            </div>
                        )}
                        {ipo.current_market_price != null && (
                            <div>
                                <p className="text-xs text-gray-400">Current price</p>
                                <p className="font-bold text-gray-900">₹{ipo.current_market_price}</p>
                                {ipo.price_band_max != null && (
                                    <p className={`text-xs font-semibold ${ipo.current_market_price >= ipo.price_band_max ? 'text-green-600' : 'text-red-600'}`}>
                                        {ipo.current_market_price >= ipo.price_band_max ? '+' : ''}{(((ipo.current_market_price - ipo.price_band_max) / ipo.price_band_max) * 100).toFixed(1)}% since issue
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {ipo.current_price_updated_at && <FreshnessBadge timestamp={ipo.current_price_updated_at} staleAfterMinutes={1440} />}
                    <p className="text-xs text-gray-400 mt-2">
                        Current price is refreshed periodically by the gpaisa.in desk, not a live exchange feed — confirm on your broker terminal before trading.
                    </p>
                    <Link href="/ipo/listing-performance" className="inline-block mt-2 text-xs font-semibold text-primary-600 hover:underline">
                        Compare across all listed IPOs →
                    </Link>
                </section>
            )}

            {/* Subscription */}
            {showSubscription && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900">Subscription Status</h2>
                    <DataSourceBadge kind="official" />
                </div>
                <SubscriptionChart history={ipo.subscription_history} />
                {Object.keys(ipo.reservation_percentages).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Category-wise Reservation</h3>
                        <ReservationTable reservation={ipo.reservation_percentages} />
                    </div>
                )}
            </section>
            )}

            {/* Anchor Investors */}
            {ipo.anchor_bidding_date && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Anchor Investors</h2>
                        <DataSourceBadge kind="official" />
                    </div>
                    <AnchorInvestorSection ipo={ipo} />
                </section>
            )}

            {/* Allotment */}
            {ipo.allotment && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Allotment</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                        <div><p className="text-xs text-gray-400">Allotment date</p><p className="font-semibold text-gray-900">{formatDate(ipo.allotment.allotment_date)}</p></div>
                        <div><p className="text-xs text-gray-400">Refund date</p><p className="font-semibold text-gray-900">{formatDate(ipo.allotment.refund_date)}</p></div>
                        <div><p className="text-xs text-gray-400">Demat credit</p><p className="font-semibold text-gray-900">{formatDate(ipo.allotment.demat_credit_date)}</p></div>
                        <div><p className="text-xs text-gray-400">Listing date</p><p className="font-semibold text-gray-900">{formatDate(ipo.allotment.listing_date)}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {ipo.allotment.basis_of_allotment_url && (
                            <a href={ipo.allotment.basis_of_allotment_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:underline">
                                Basis of Allotment →
                            </a>
                        )}
                        {ipo.registrar?.allotment_status_check_url && (
                            <a href={ipo.registrar.allotment_status_check_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:underline">
                                Check Allotment Status ({ipo.registrar.name}) →
                            </a>
                        )}
                        <Link href={`/ipo-calculator/allotment-probability-calculator?ipo=${ipo.slug}`} className="text-sm font-semibold text-primary-600 hover:underline">
                            Estimate Allotment Probability →
                        </Link>
                    </div>
                </section>
            )}

            {/* Financials & Valuation */}
            {(ipo.financials.length > 0 || ipo.peer_comparison.length > 0 || ipo.promoter_holding_pre_percent != null) && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Financials &amp; Valuation</h2>
                        <DataSourceBadge kind="official" />
                    </div>
                    {ipo.financials.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Financial Performance</h3>
                            <FinancialsTable financials={ipo.financials} />
                        </div>
                    )}
                    {ipo.financials.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Valuation &amp; KPIs</h3>
                            <ValuationKpiTable kpis={valuationKpis} />
                        </div>
                    )}
                    {ipo.peer_comparison.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Comparison with Listed Peers</h3>
                            <PeerComparisonTable peers={ipo.peer_comparison} companyName={companyName} ownRow={ownPeerRow} />
                        </div>
                    )}
                    {ipo.promoter_holding_pre_percent != null && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Promoter Holding</h3>
                            <PromoterHoldingTable prePercent={ipo.promoter_holding_pre_percent} postPercent={ipo.promoter_holding_post_percent} />
                        </div>
                    )}
                </section>
            )}

            {/* Review */}
            {ipo.review && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">gpaisa.in Review</h2>
                        <DataSourceBadge kind="editorial" />
                    </div>
                    {ipo.review.recommendation && (
                        <p className="inline-block mb-3 text-sm font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                            {RECOMMENDATION_LABELS[ipo.review.recommendation]}
                        </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                        {ipo.review.business_quality_score != null && <div><p className="text-xs text-gray-400">Business quality</p><p className="font-semibold">{ipo.review.business_quality_score}/10</p></div>}
                        {ipo.review.financial_performance_score != null && <div><p className="text-xs text-gray-400">Financials</p><p className="font-semibold">{ipo.review.financial_performance_score}/10</p></div>}
                        {ipo.review.growth_score != null && <div><p className="text-xs text-gray-400">Growth</p><p className="font-semibold">{ipo.review.growth_score}/10</p></div>}
                        {ipo.review.valuation_score != null && <div><p className="text-xs text-gray-400">Valuation</p><p className="font-semibold">{ipo.review.valuation_score}/10</p></div>}
                    </div>
                    {ipo.review.overall_view && <p className="text-sm text-gray-700 mb-4">{ipo.review.overall_view}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {ipo.review.strengths.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Strengths</p>
                                <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                                    {ipo.review.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}
                        {ipo.review.risks.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Risks</p>
                                <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                                    {ipo.review.risks.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    {ipo.review.detailed_analysis_html && (
                        <div className="article-content prose max-w-none" dangerouslySetInnerHTML={{ __html: ipo.review.detailed_analysis_html }} />
                    )}
                    <p className="text-xs text-gray-400 mt-4">
                        This is editorial opinion by the gpaisa.in research desk{ipo.review.author ? ` (${ipo.review.author})` : ''}, not investment advice.
                    </p>
                </section>
            )}

            {/* Documents */}
            {ipo.documents.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Documents</h2>
                    <ul className="space-y-1.5">
                        {ipo.documents.map(doc => (
                            <li key={doc.id}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:underline">
                                    {doc.title} <span className="text-gray-400 font-normal uppercase">({doc.doc_type.replace('_', ' ')})</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Company / issue details */}
            {showAboutIssue && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About the Issue</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-4 empty:hidden">
                    {!!ipo.fresh_issue_amount && <div><p className="text-xs text-gray-400">Fresh issue</p><p className="font-semibold text-gray-900">₹{ipo.fresh_issue_amount} Cr</p></div>}
                    {!!ipo.ofs_amount && <div><p className="text-xs text-gray-400">Offer for sale</p><p className="font-semibold text-gray-900">₹{ipo.ofs_amount} Cr</p></div>}
                    {!!ipo.face_value && <div><p className="text-xs text-gray-400">Face value</p><p className="font-semibold text-gray-900">₹{ipo.face_value}</p></div>}
                    {ipo.lead_managers.length > 0 && (
                        <div className="col-span-2 sm:col-span-3">
                            <p className="text-xs text-gray-400">Lead managers</p>
                            <p className="font-semibold text-gray-900">{ipo.lead_managers.join(', ')}</p>
                        </div>
                    )}
                </div>
                {hasObjects && (
                    <>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Objects of the Issue</h3>
                        <ObjectsOfIssueTable breakdown={ipo.objects_of_issue_breakdown} fallbackText={ipo.objects_of_issue} />
                    </>
                )}
                {ipo.company?.about && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">About {companyName}</p>
                        <p className="text-sm text-gray-700">{ipo.company.about}</p>
                    </div>
                )}
            </section>
            )}

            {/* Contact details */}
            {showContact && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Company &amp; Registrar Contact</h2>
                <CompanyContactBlock company={ipo.company} registrar={ipo.registrar} />
            </section>
            )}

            {/* News for this IPO */}
            {news.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">{companyName} IPO News</h2>
                    <ul className="divide-y divide-gray-100">
                        {news.map(article => (
                            <li key={article.id} className="py-2.5">
                                <Link href={`/articles/${article.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600">
                                    {article.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{formatDate(article.published_at)}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Related IPOs — internal links readers use to compare */}
            {(relatedCurrent.length > 0 || relatedListed.length > 0) && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Other IPOs</h2>
                    <RelatedIpos current={relatedCurrent} listed={relatedListed} />
                </section>
            )}

            {/* FAQ */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                <IpoFaq ipo={ipo} companyName={companyName} />
            </section>
        </div>
    );
}
