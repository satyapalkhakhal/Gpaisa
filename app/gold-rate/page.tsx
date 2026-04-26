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
            { '@type': 'Question', name: 'Why is gold rate different in Delhi vs Mumbai?', acceptedAnswer: { '@type': 'Answer', text: 'Gold prices vary by city due to local state taxes, transportation costs, and jeweller association rates. The base price (MCX) is the same nationally, but making charges and local levies differ.' } },
            { '@type': 'Question', name: 'What is 916 gold?', acceptedAnswer: { '@type': 'Answer', text: '916 gold means 91.6% purity — this is 22 Karat gold. The number 916 comes from 22/24 × 1000 = 916.6. It is the most common purity used in Indian jewellery.' } },
            { '@type': 'Question', name: 'How is GST charged on gold purchases?', acceptedAnswer: { '@type': 'Answer', text: 'GST on gold is 3% on the value of gold plus making charges. An additional 5% GST applies on making charges separately.' } },
            { '@type': 'Question', name: 'What is the best time to buy gold in India?', acceptedAnswer: { '@type': 'Answer', text: 'Historically, gold prices dip slightly after major festivals like Dhanteras and Akshaya Tritiya when demand falls. However, tracking global USD/gold trends matters more than seasonal patterns for investment buying.' } },
            { '@type': 'Question', name: 'What is the difference between 24K and 22K gold?', acceptedAnswer: { '@type': 'Answer', text: '24K gold is 99.9% pure and is used for coins and bars — not jewellery as it is too soft. 22K gold is 91.6% pure, alloyed with copper or silver for hardness, and is the standard for Indian jewellery.' } },
            { '@type': 'Question', name: 'Where do gold rates in India come from?', acceptedAnswer: { '@type': 'Answer', text: 'Indian gold rates are benchmarked to the London Bullion Market Association (LBMA) international price, converted to INR using the USD/INR rate, then adjusted for import duty (15%) and GST.' } },
            { '@type': 'Question', name: 'Is it better to buy physical gold, Gold ETF, or Sovereign Gold Bond?', acceptedAnswer: { '@type': 'Answer', text: 'For long-term investors, SGBs are best — they offer 2.5% annual interest plus gold price appreciation with no capital gains tax on maturity. Gold ETFs suit liquidity-focused investors. Physical gold is best for jewellery or gifting purposes.' } },
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
