import { Metadata } from 'next';
import GoldVsSilverBlogClient from '@/components/GoldVsSilverBlogClient';

export const metadata: Metadata = {
    title: 'Gold vs Silver: 10-Year Price Chart, Returns & Which Is Better Investment in India? | gpaisa.in',
    description: 'Compare gold vs silver investment in India with 10-year price charts, returns analysis, risk comparison & expert insights. Find out which precious metal is the better investment for you.',
    keywords: [
        'gold vs silver india',
        'gold vs silver returns',
        'gold price 10 year chart india',
        'silver price 10 year chart india',
        'gold vs silver investment',
        'gold vs silver comparison',
        'gold vs silver price',
        'gold silver price today',
        'gold and silver price today',
        'gold and silver prices today',
        'silver and gold price',
        'gold and silver price',
        'gold and silver prices',
        'gold & silver price',
        'silver gold ratio',
        'gold silver ratio today',
        'gold to silver ratio today',
        'gold to silver ratio chart',
        'silver gold ratio chart',
        'gold and silver price live',
        'gold and silver prices charts',
        'gold silver price per ounce',
        'gold and silver prices per ounce',
        'silver vs gold price',
        'gold vs silver price chart',
        'gold vs silver price graph',
        'gold silver price chart 10 years',
        'gold silver prices history',
        'gold vs silver price today',
        'gold vs silver price history',
        'historical price of gold vs silver',
        'gold and silver price history',
        'gold vs silver returns india',
        'gold etf vs silver etf',
        'digital gold india',
        'gold price trend india',
        'silver price trend india',
        'gold vs silver 2026',
    ].join(', '),
    openGraph: {
        title: 'Gold vs Silver: 10-Year Price Chart, Returns & Which Is Better Investment in India?',
        description: 'Comprehensive comparison of gold vs silver as investment in India. 10-year charts, returns analysis, volatility & expert recommendations.',
        type: 'article',
        url: 'https://gpaisa.in/gold-vs-silver',
        siteName: 'gpaisa.in',
        locale: 'en_IN',
        images: [
            {
                url: 'https://gpaisa.in/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: 'Gold vs Silver Investment Comparison India',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gold vs Silver: Which Is Better Investment in India? (10-Year Analysis)',
        description: 'Compare gold and silver returns, price charts, and find the best precious metal investment for your portfolio.',
        images: ['https://gpaisa.in/android-chrome-512x512.png'],
    },
    alternates: {
        canonical: 'https://gpaisa.in/gold-vs-silver',
    },
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
    },
};

export default function GoldVsSilverPage() {
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Gold vs Silver: 10-Year Price Chart, Returns & Which Is Better Investment in India?',
        description: 'Comprehensive comparison of gold vs silver investment in India with 10-year price charts, returns analysis, and expert advice.',
        image: 'https://gpaisa.in/android-chrome-512x512.png',
        author: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            url: 'https://gpaisa.in',
        },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: {
                '@type': 'ImageObject',
                url: 'https://gpaisa.in/android-chrome-512x512.png',
            },
        },
        datePublished: '2026-04-16',
        dateModified: '2026-04-16',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://gpaisa.in/gold-vs-silver',
        },
        inLanguage: 'en-IN',
        keywords: 'gold vs silver india, gold vs silver returns, gold price 10 year chart india',
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Gold Rate', item: 'https://gpaisa.in/gold-rate' },
            { '@type': 'ListItem', position: 3, name: 'Gold vs Silver', item: 'https://gpaisa.in/gold-vs-silver' },
        ],
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Is gold a better investment than silver in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Gold is generally considered more stable and safer for long-term investors. Silver offers higher volatility and potentially higher short-term returns but carries more risk. The best choice depends on your risk tolerance and investment horizon.',
                },
            },
            {
                '@type': 'Question',
                name: 'What are the returns of gold vs silver in the last 10 years in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Over the last 10 years (2016–2026), gold has delivered approximately 12-14% CAGR in India while silver has given around 10-13% CAGR. However, silver\'s returns are more volatile with higher peaks and deeper dips.',
                },
            },
            {
                '@type': 'Question',
                name: 'How can I invest in gold and silver in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can invest through physical gold/silver, Gold ETFs, Silver ETFs, Sovereign Gold Bonds (SGBs), Digital Gold platforms, and gold/silver mutual funds. Each option has different benefits regarding liquidity, cost, and safety.',
                },
            },
            {
                '@type': 'Question',
                name: 'What factors affect gold and silver prices in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Key factors include inflation rates, USD/INR exchange rate, geopolitical tensions, central bank policies, industrial demand (especially for silver), and seasonal demand patterns in India.',
                },
            },
        ],
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <GoldVsSilverBlogClient />
        </div>
    );
}
