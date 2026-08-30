import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IPO_CALCULATORS, getIpoCalculatorBySlug } from '@/lib/ipoCalculatorsList';
import LotSizeCalculatorClient from '@/components/ipo/LotSizeCalculatorClient';
import AllotmentProbabilityCalculatorClient from '@/components/ipo/AllotmentProbabilityCalculatorClient';

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
    return IPO_CALCULATORS.map(c => ({ slug: [c.slug] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const key = slug?.[0];

    if (!key) {
        return {
            title: 'IPO Calculators — Lot Size & Allotment Probability | gpaisa.in',
            description: 'Free IPO calculators: work out your lot size investment and estimate allotment probability for Indian mainboard and SME IPOs.',
            alternates: { canonical: 'https://www.gpaisa.in/ipo-calculator' },
        };
    }

    const calc = getIpoCalculatorBySlug(key);
    if (!calc) return { title: 'Calculator Not Found | gpaisa.in' };

    return {
        title: `${calc.name} | gpaisa.in`,
        description: calc.description,
        alternates: { canonical: `https://www.gpaisa.in/ipo-calculator/${calc.slug}` },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

export default async function IpoCalculatorPage({ params }: Props) {
    const { slug } = await params;
    const key = slug?.[0];

    if (!key) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">IPO Calculators</h1>
                <p className="text-gray-600 mb-8">Free tools to plan your IPO applications.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {IPO_CALCULATORS.map(c => (
                        <Link key={c.slug} href={`/ipo-calculator/${c.slug}`} className="block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all p-5">
                            <h2 className="font-bold text-gray-900 mb-1">{c.name}</h2>
                            <p className="text-sm text-gray-500">{c.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    const calc = getIpoCalculatorBySlug(key);
    if (!calc) notFound();

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">{calc.name}</h1>
            <p className="text-gray-600 mb-6">{calc.description}</p>
            {calc.slug === 'lot-size-calculator' && <LotSizeCalculatorClient />}
            {calc.slug === 'allotment-probability-calculator' && <AllotmentProbabilityCalculatorClient />}
        </div>
    );
}
