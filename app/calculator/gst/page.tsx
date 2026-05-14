import { Metadata } from 'next';
import GSTCalculatorClient from '@/components/GSTCalculatorClient';

export const metadata: Metadata = {
    title: 'GST Calculator - Calculate GST Online | Add or Remove GST | Gpaisa',
    description: 'Free online GST calculator for India. Calculate Goods and Services Tax (GST) instantly. Add or remove GST from any amount with CGST, SGST, and IGST breakdown. Support for all GST rates: 0%, 5%, 12%, 18%, 28%.',
    keywords: 'gst calculator, gst calculator india, goods and services tax calculator, calculate gst online, gst calculation, cgst sgst calculator, igst calculator, add gst calculator, remove gst calculator, gst exclusive calculator, gst inclusive calculator, 18% gst calculator, 28% gst calculator, india gst rates, gst breakdown, online gst tool',
    authors: [{ name: 'gpaisa.in' }],
    openGraph: {
        title: 'GST Calculator - Calculate GST Online | Gpaisa',
        description: 'Free online GST calculator for India. Calculate Goods and Services Tax instantly with CGST, SGST, and IGST breakdown. Support for all GST rates.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/gst',
        siteName: 'gpaisa.in',
        images: [
            {
                url: 'https://www.gpaisa.in/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: 'GST Calculator - Gpaisa',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'GST Calculator - Calculate GST Online | Gpaisa',
        description: 'Free online GST calculator for India. Calculate Goods and Services Tax instantly with detailed breakdown.',
        images: ['https://www.gpaisa.in/android-chrome-512x512.png'],
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/gst',
    },
};

export default function GSTCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'GST Calculator',
        description: 'Free online GST calculator for India. Calculate Goods and Services Tax (GST) instantly. Add or remove GST from any amount with CGST, SGST, and IGST breakdown.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'IN',
                returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            },
        },
        featureList: [
            'Calculate GST Exclusive (Add GST)',
            'Calculate GST Inclusive (Remove GST)',
            'CGST and SGST breakdown',
            'IGST calculation',
            'Support for all GST rates (0%, 5%, 12%, 18%, 28%)',
            'Instant calculation',
            'Visual breakdown charts',
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '2500',
        },
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is GST?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It replaced multiple indirect taxes like VAT, service tax, and excise duty.',
                },
            },
            {
                '@type': 'Question',
                name: 'What are the GST rates in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GST rates in India are 0%, 5%, 12%, 18%, and 28%. Essential items are taxed at 0%, household necessities at 5%, processed foods at 12%, most goods and services at 18%, and luxury items at 28%.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is the difference between CGST, SGST, and IGST?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'CGST (Central GST) and SGST (State GST) are levied on intra-state transactions and split equally. IGST (Integrated GST) is levied on inter-state transactions at the full GST rate.',
                },
            },
            {
                '@type': 'Question',
                name: 'How to calculate GST?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'To add GST: GST Amount = (Original Amount × GST Rate) / 100. Total = Original Amount + GST Amount. To remove GST: Original Amount = Total Amount / (1 + GST Rate/100). GST Amount = Total Amount - Original Amount.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is GST Exclusive and GST Inclusive?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'GST Exclusive means the price does not include GST, and you need to add GST to get the final price. GST Inclusive means the price already includes GST, and you need to extract the GST component from the total.',
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <GSTCalculatorClient />
        </>
    );
}
