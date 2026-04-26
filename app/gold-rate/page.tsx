import { Metadata } from 'next';
import GoldRatePageClient from '@/components/GoldRatePageClient';
import { getTodayIST } from '@/lib/dateUtils';

export async function generateMetadata(): Promise<Metadata> {
    const todayDate = getTodayIST();

    return {
        title: `Gold Rate Today in India — ${todayDate} | gpaisa.in`,
        description: `Check today's gold rate in India on ${todayDate}. Live 24K, 22K, 18K and 916 gold prices updated daily with calculator, historical data, price trends, and gold vs silver comparison.`,
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
            'today gold rate in india', 'gold price in india', 'indian gold rate', 'gold rate update',
            'gold vs silver', 'gold vs silver price today', 'gold investment india 2026',
            'gold market trend', 'what affects gold prices', 'gold rate forecast',
            'gold rate prediction', 'gold price trend india'
        ].join(', '),
        openGraph: {
            title: `Gold Rate Today in India — ${todayDate} | 24K, 22K, 18K Prices`,
            description: `Check today's gold rate in India on ${todayDate}. Live 24K, 22K and 18K gold prices with daily updates, market trends, and gold vs silver comparison.`,
            type: 'website',
            url: 'https://gpaisa.in/gold-rate',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
            images: [
                {
                    url: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Gold Rate Today in India - Live Gold Prices and Market Trends',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Gold Rate Today in India — ${todayDate} | Live Prices`,
            description: `Check today's gold rate in India on ${todayDate}. Live prices with daily updates, market analysis, and gold vs silver comparison.`,
            images: ['https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg'],
        },
        alternates: {
            canonical: 'https://gpaisa.in/gold-rate'
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    };
}

export const revalidate = 86400; // Cache for 1 day (ISR) - static content is cached

export default function GoldRatePage() {
    const todayDate = getTodayIST();

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Gold Rate Today in India — ${todayDate}`,
        description: `Check today's gold rate in all major Indian cities on ${todayDate}. Live 24K, 22K, 18K, and 916 gold prices updated in real-time with market trends and analysis.`,
        url: 'https://gpaisa.in/gold-rate',
        inLanguage: 'en-IN',
        dateModified: new Date().toISOString().split('T')[0],
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: { '@type': 'ImageObject', url: 'https://gpaisa.in/icon-512.png' },
        },
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
        mainEntity: {
            '@type': 'FinancialProduct',
            name: 'Gold',
            description: 'Live gold rates for 24K, 22K, and 18K gold across major Indian cities',
        },
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
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
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
            { '@type': 'Question', name: 'When is the best time to buy gold?', acceptedAnswer: { '@type': 'Answer', text: 'While gold is traditionally purchased during festivals like Dhanteras and Akshaya Tritiya, the best time to buy gold is when prices are favorable based on market trends.' } },
            { '@type': 'Question', name: 'What factors affect gold prices in India?', acceptedAnswer: { '@type': 'Answer', text: 'Gold prices in India are influenced by international gold prices, USD to INR exchange rate, inflation and interest rates, geopolitical tensions, and local demand during festivals.' } },
            { '@type': 'Question', name: 'Is gold a better investment than silver?', acceptedAnswer: { '@type': 'Answer', text: 'Gold is generally more stable with lower volatility, making it ideal for long-term investors. Silver offers higher growth potential but with more risk. The best choice depends on your investment goals and risk tolerance.' } },
        ],
    };

    // Article schema for rich content sections
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Gold Rate Today in India — ${todayDate} | Market Analysis & Investment Guide 2026`,
        description: 'Comprehensive guide to gold prices in India covering market trends, what affects gold prices, city-wise rates, and investment comparison with silver.',
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
        author: { '@type': 'Organization', name: 'gpaisa.in', url: 'https://gpaisa.in' },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: { '@type': 'ImageObject', url: 'https://gpaisa.in/icon-512.png' },
        },
        datePublished: '2026-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://gpaisa.in/gold-rate' },
        inLanguage: 'en-IN',
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <GoldRatePageClient todayDate={todayDate} />
        </div>
    );
}
