// Groww-style index strip: one compact bordered card per index, scrolling sideways on small
// screens. Equity indices, the rupee and bullion together, server-rendered (no flicker).
import Link from 'next/link';
import type { MarketIndex } from '@/types';
import type { GoldCaratRate, SilverRateData } from '@/lib/angelOneApi';
import { ChangeText } from './HomeUi';

interface StripItem {
    label: string;
    value: string;
    change: number;
    changePercent: number;
    changeDigits: number;
    href: string;
}

const INDEX_LABELS: Record<string, string> = {
    'NIFTY 50': 'NIFTY 50',
    'SENSEX': 'SENSEX',
    'NIFTY BANK': 'BANK NIFTY',
    'USD/INR': 'USD/INR',
};

export default function IndexStrip({ indices, gold, silver, silverCity }: {
    indices: MarketIndex[];
    gold: GoldCaratRate[];
    silver: SilverRateData | null;
    silverCity?: string;
}) {
    const items: StripItem[] = indices.map(idx => ({
        label: INDEX_LABELS[idx.name] || idx.name,
        value: idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: idx.change,
        changePercent: idx.changePercent,
        changeDigits: 2,
        href: '/markets',
    }));

    const gold24 = gold.find(g => g.purity === '24K');
    if (gold24) {
        items.push({
            label: 'GOLD 24K · 10g',
            value: '₹' + Math.round(gold24.pricePerGram * 10).toLocaleString('en-IN'),
            change: gold24.change * 10,
            changePercent: gold24.changePercent,
            changeDigits: 0,
            href: '/gold-rate',
        });
    }
    if (silver) {
        items.push({
            label: silverCity ? `SILVER · 1kg · ${silverCity.toUpperCase()}` : 'SILVER · 1kg',
            value: '₹' + Math.round(silver.price * 1000).toLocaleString('en-IN'),
            change: silver.change * 1000,
            changePercent: silver.changePercent,
            changeDigits: 0,
            href: '/silver-rate',
        });
    }

    if (items.length === 0) return null;

    return (
        <section aria-label="Market indices and bullion rates" className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
            {items.map(item => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="shrink-0 min-w-[11.5rem] bg-white rounded-xl border border-gw-border px-4 py-2.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
                >
                    <p className="text-sm font-medium text-gw-text">{item.label}</p>
                    <p className="text-xs mt-0.5 whitespace-nowrap">
                        <span className="text-gw-text tabular-nums mr-1.5">{item.value}</span>
                        <ChangeText value={item.change} percent={item.changePercent} digits={item.changeDigits} />
                    </p>
                </Link>
            ))}
        </section>
    );
}
