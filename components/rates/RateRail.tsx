// Right rail for the rate pages: today's rate in the main cities, the other metal, tools and
// related news. Server component.
import Link from 'next/link';
import Image from 'next/image';
import type { ArticleLanguage } from '@/lib/articleLocale';
import { articlePath, toArticleLanguage } from '@/lib/articleLocale';
import type { CityRateRow } from '@/lib/rates';
import { RailCard, RailLinks, inr } from './RatesUi';

export interface RailNews { id: string; title: string; slug: string; image_url?: string | null; language?: string | null }

export default function RateRail({ lang, cityTitle, cityRows, rateKey, grams, unitLabel, hrefFor, currentSlug, other, tools, newsTitle, news }: {
    lang: ArticleLanguage;
    cityTitle: string;
    cityRows: CityRateRow[];
    rateKey: string;
    grams: number;
    unitLabel: string;
    hrefFor: (slug: string) => string;
    currentSlug?: string;
    other?: { title: string; href: string; value?: string; label: string };
    tools: { href: string; label: string }[];
    newsTitle: string;
    news: RailNews[];
}) {
    const cities = cityRows.filter(r => r.slug !== currentSlug).slice(0, 8);
    return (
        <>
            {cities.length > 0 && (
                <RailCard title={cityTitle}>
                    <p className="text-[11px] text-gray-500 -mt-2 mb-1">{unitLabel}</p>
                    <RailLinks links={cities.map(r => ({ href: hrefFor(r.slug), label: r.city, value: r.rates[rateKey] ? inr(r.rates[rateKey] * grams) : undefined }))} />
                </RailCard>
            )}
            {other && (
                <RailCard title={other.title}>
                    <Link href={other.href} className="flex items-baseline justify-between gap-3 hover:text-gw-green">
                        <span className="text-sm">{other.label}</span>
                        {other.value && <span className="text-lg font-bold tabular-nums">{other.value}</span>}
                    </Link>
                </RailCard>
            )}
            <RailCard title={lang === 'hi' ? 'टूल्स और गाइड' : 'Tools & guides'}>
                <RailLinks links={tools} />
            </RailCard>
            {news.length > 0 && (
                <RailCard title={newsTitle}>
                    <ul className="space-y-3">
                        {news.slice(0, 5).map(n => (
                            <li key={n.id}>
                                <Link href={articlePath(toArticleLanguage(n.language), n.slug)} className="group flex gap-3">
                                    {n.image_url && (
                                        <span className="relative w-20 aspect-video shrink-0 overflow-hidden rounded bg-gray-100">
                                            <Image src={n.image_url} alt="" fill sizes="80px" className="object-cover" />
                                        </span>
                                    )}
                                    <span className="text-[13px] font-semibold leading-snug text-gw-text group-hover:text-gw-green line-clamp-3">{n.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </RailCard>
            )}
        </>
    );
}
