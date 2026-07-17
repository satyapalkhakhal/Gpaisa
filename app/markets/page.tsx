import { Metadata } from 'next';
import MarketsIndicesClient from '@/components/MarketsIndicesClient';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { fetchMarketIndices } from '@/lib/indicesApi';

export const metadata: Metadata = {
    title: 'Live Stock Market Indices — Sensex, Nifty 50, Nifty Bank | gpaisa.in',
    description: 'Live Sensex, Nifty 50, Nifty Bank, and USD/INR index values for India, refreshed every minute.',
    alternates: {
        canonical: 'https://www.gpaisa.in/markets',
    },
};

export const revalidate = 60;

export default async function MarketsPage() {
    const indices = await fetchMarketIndices();

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Stock Markets</h1>
                    <p className="text-lg text-gray-600">Live market indices for India — Sensex, Nifty 50, Nifty Bank, and USD/INR</p>
                </div>

                {/* Market Indices */}
                <section className="mb-8">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Market Indices</h2>
                    <MarketsIndicesClient initialIndices={indices} />
                </section>

                <p className="text-xs text-gray-400 mb-8">
                    Per-stock prices and historical index charts aren&apos;t published here yet — we only show index values we can source live, rather than estimated or placeholder figures.
                </p>

                {/* Last Updated */}
                <div className="text-center">
                    <LastUpdatedTime />
                </div>
            </div>
        </div>
    );
}
