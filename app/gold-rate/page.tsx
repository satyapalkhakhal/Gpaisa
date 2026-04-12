import { Metadata } from 'next';
import GoldRatePageClient from '@/components/GoldRatePageClient';

export const metadata: Metadata = {
    title: 'Gold Rate Today in India - City Wise 24K, 22K, 18K, 916 Prices | gpaisa.in',
    description: 'Check today\'s gold rate in all major Indian cities. Live 24K, 22K, 18K and 916 gold prices updated daily with calculator, historical data and price trends.',
    keywords: [
        'gold rate today', 'gold price today', 'today gold rate', 'gold rate', 'gold price',
        'gold rate today in india', 'india gold rate', '24k gold rate today', '22k gold rate today',
        '18k gold rate today', '916 gold rate today', '24 carat gold rate', '22 carat gold rate',
        'gold rate delhi', 'gold rate mumbai', 'gold rate bangalore', 'gold rate chennai',
        'gold rate hyderabad', 'gold rate kolkata', 'gold rate pune', 'gold rate ahmedabad',
        'gold rate kerala', 'city wise gold rate', 'all india gold rate',
        '1 gram gold rate', '10 gram gold price', '8 gram gold rate', 'gold rate per gram',
        'live gold rate india', 'gold rate today live', 'gold price calculator',
        'gold rate history', 'gold rate chart', 'gold rate comparison',
        'today gold rate in india', 'gold price in india', 'indian gold rate', 'gold rate update'
    ].join(', '),
    openGraph: {
        title: 'Gold Rate Today in India - City Wise 24K, 22K, 18K Prices',
        description: 'Check today\'s gold rate in all major Indian cities. Live 24K, 22K and 18K gold prices with daily updates and calculator.',
        type: 'website',
        url: 'https://gpaisa.in/gold-rate',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gold Rate Today in India - Live Prices',
        description: 'Check today\'s gold rate in all major Indian cities. Live prices with daily updates.',
    },
    alternates: {
        canonical: 'https://gpaisa.in/gold-rate'
    }
};

export const dynamic = 'force-static'; // Static page with client-side data fetching

export default function GoldRatePage() {
    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Gold Rate Today in India - City Wise Prices',
        description: 'Check today\'s gold rate in all major Indian cities. Live 24K, 22K, 18K, and 916 gold prices updated in real-time.',
        url: 'https://gpaisa.in/gold-rate',
        inLanguage: 'en-IN',
        publisher: { '@type': 'Organization', name: 'gpaisa.in', logo: { '@type': 'ImageObject', url: 'https://gpaisa.in/icon-512.png' } },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Gold Rate', item: 'https://gpaisa.in/gold-rate' },
        ],
    };
    const productSchema = {
        '@context': 'https://schema.org', '@type': 'Product',
        name: '24K Gold Rate in India',
        description: 'Live gold rates for 24K, 22K, and 18K gold across major Indian cities',
        brand: { '@type': 'Brand', name: 'Gold' },
        offers: {
            '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: '6000', highPrice: '8000', offerCount: '10',
            hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'IN', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' },
        },
    };
    const faqSchema = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
            { '@type': 'Question', name: 'What is the gold rate today in India?', acceptedAnswer: { '@type': 'Answer', text: 'Gold rates in India vary by city and purity. Check our live gold rate table above for current 24K, 22K, and 18K gold prices in your city.' } },
            { '@type': 'Question', name: 'Why do gold rates differ across cities?', acceptedAnswer: { '@type': 'Answer', text: 'Gold prices differ across Indian cities due to local taxes, transportation costs, demand-supply dynamics, and making charges.' } },
            { '@type': 'Question', name: 'What is the difference between 24K, 22K, and 18K gold?', acceptedAnswer: { '@type': 'Answer', text: '24K gold is 99.9% pure and ideal for investment. 22K gold (91.67% pure) is most popular for jewelry in India. 18K gold (75% pure) is used for modern and designer jewelry.' } },
            { '@type': 'Question', name: 'When is the best time to buy gold?', acceptedAnswer: { '@type': 'Answer', text: 'While gold is traditionally purchased during festivals like Dhanteras and Akshaya Tritiya, the best time to buy gold is when prices are favorable.' } },
        ],
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <GoldRatePageClient />
        </div>
    );
}
