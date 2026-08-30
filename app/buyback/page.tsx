import { Metadata } from 'next';
import { fetchBuybacks } from '@/lib/otherInvestmentsApi';
import BuybackCard from '@/components/ipo/BuybackCard';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Share Buybacks in India — Price, Record Date, Acceptance Ratio | gpaisa.in',
        description: 'Track share buyback offers from Indian listed companies — tender/open-market method, buyback price, record date, and acceptance ratio.',
        openGraph: {
            title: 'Share Buybacks in India',
            description: 'Buyback price, record date, and acceptance ratio for Indian share buyback offers.',
            type: 'website',
            url: 'https://www.gpaisa.in/buyback',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/buyback' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

export default async function BuybackHubPage() {
    const buybacks = await fetchBuybacks();

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Share Buybacks in India',
        description: 'Buyback price, record date, and acceptance ratio for Indian share buyback offers.',
        url: 'https://www.gpaisa.in/buyback',
        inLanguage: 'en-IN',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Share Buybacks</h1>
            <p className="text-gray-600 max-w-2xl mb-8">
                Share buyback offers from Indian listed companies — tender or open-market method, buyback price, and acceptance ratio.
            </p>

            {buybacks.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">No buybacks available right now.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buybacks.map(buyback => <BuybackCard key={buyback.id} buyback={buyback} />)}
                </div>
            )}
        </div>
    );
}
