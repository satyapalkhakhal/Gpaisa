import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAllPublishedBuybackSlugs, fetchBuybackBySlug } from '@/lib/otherInvestmentsApi';
import { BUYBACK_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';

export const revalidate = 300;

export async function generateStaticParams() {
    const buybacks = await fetchAllPublishedBuybackSlugs();
    return buybacks.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const buyback = await fetchBuybackBySlug(slug);
    if (!buyback) return { title: 'Buyback Not Found | gpaisa.in' };
    const companyName = buyback.company?.name || buyback.slug;
    const title = buyback.meta_title || `${companyName} Buyback — Price, Record Date, Acceptance Ratio | gpaisa.in`;
    const description = buyback.meta_description || `${companyName} share buyback: ${buyback.method.replace('_', ' ')} at ₹${buyback.buyback_price ?? 'TBA'}.`;
    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url: `https://www.gpaisa.in/buyback/${buyback.slug}`, siteName: 'gpaisa.in', locale: 'en_IN' },
        alternates: { canonical: `https://www.gpaisa.in/buyback/${buyback.slug}` },
        robots: { index: buyback.publish_status === 'published', follow: true },
    };
}

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

export default async function BuybackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const buyback = await fetchBuybackBySlug(slug);
    if (!buyback) notFound();
    const companyName = buyback.company?.name || buyback.slug;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${companyName} Buyback`,
        description: `${companyName} share buyback: method, price, record date, and acceptance ratio.`,
        url: `https://www.gpaisa.in/buyback/${buyback.slug}`,
        inLanguage: 'en-IN',
        dateModified: buyback.updated_at,
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{companyName} Buyback</h1>
                        <p className="text-sm text-gray-500 capitalize">{buyback.method.replace('_', ' ')} offer</p>
                    </div>
                    <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">{BUYBACK_LIFECYCLE_LABELS[buyback.status]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Buyback price</p>
                        <p className="font-bold text-gray-900">{buyback.buyback_price ? `₹${buyback.buyback_price}${buyback.buyback_price_max ? ` – ₹${buyback.buyback_price_max}` : ''}` : 'TBA'}</p>
                    </div>
                    <div><p className="text-xs text-gray-400">Buyback size</p><p className="font-bold text-gray-900">{buyback.buyback_size ? `₹${buyback.buyback_size} Cr` : 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Record date</p><p className="font-bold text-gray-900">{formatDate(buyback.record_date)}</p></div>
                    <div><p className="text-xs text-gray-400">Tender window</p><p className="font-bold text-gray-900">{formatDate(buyback.tender_open_date)} – {formatDate(buyback.tender_close_date)}</p></div>
                </div>
                {buyback.acceptance_ratio && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Acceptance ratio</p>
                        <p className="font-bold text-gray-900">{buyback.acceptance_ratio}</p>
                    </div>
                )}
            </div>

            <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Buyback Details</h2>
                {buyback.notes && <p className="text-sm text-gray-700 mb-3">{buyback.notes}</p>}
                {buyback.letter_of_offer_url && (
                    <a href={buyback.letter_of_offer_url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary-600 hover:underline">
                        Letter of Offer →
                    </a>
                )}
            </section>
        </div>
    );
}
