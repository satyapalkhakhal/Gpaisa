import { Metadata } from 'next';
import { INDIA_STATES, COMMON_COMMODITIES } from '@/lib/constants';
import { fetchMandiPrices } from '@/lib/agriApi';
import AgriculturePageClient from '@/components/AgriculturePageClient';

export const metadata: Metadata = {
    title: 'Kisan Mandi Prices India - Live Crop Rates by State & District | Gpaisa',
    description: 'Check rate of wheat today and all crop mandi prices across India. State-wise, district-wise kisan mandi rates updated daily from government sources.',
    keywords: ['mandi prices', 'rate of wheat today', 'kisan mandi', 'crop rates today', 'wheat rate today', 'agriculture prices', 'farmer prices', 'wholesale market prices', 'India agriculture'],
    openGraph: {
        title: 'Live Kisan Mandi Prices - India',
        description: 'Check rate of wheat today & real-time kisan mandi prices for crops across all states and districts in India',
        type: 'website',
    },
    alternates: {
        canonical: 'https://gpaisa.in/agriculture'
    }
};

export const revalidate = 86400;

export default async function AgriculturePage() {
    const latestPrices = await fetchMandiPrices({ limit: 20 });

    return (
        <AgriculturePageClient
            states={[...INDIA_STATES]}
            commodities={[...COMMON_COMMODITIES]}
            records={latestPrices.records}
        />
    );
}
