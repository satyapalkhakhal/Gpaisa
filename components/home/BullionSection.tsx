// Groww "most traded"-style card grid for bullion: one card per purity plus silver,
// then the gold–silver ratio and city shortcuts as chips.
import Link from 'next/link';
import type { GoldCaratRate, SilverRateData } from '@/lib/angelOneApi';
import { Card, ChangeText, SectionTitle, formatINR } from './HomeUi';

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kerala', 'Coimbatore'];

const PURITY_NOTE: Record<GoldCaratRate['purity'], string> = {
    '24K': '99.9% · coins & bars',
    '22K': '91.6% · jewellery',
    '18K': '75% · studded jewellery',
};

interface BullionCard {
    symbol: string;
    name: string;
    note: string;
    price: number;
    unit: string;
    change: number;
    changePercent: number;
    href: string;
    tone: string;
}

export default function BullionSection({ gold, silver, silverCity }: { gold: GoldCaratRate[]; silver: SilverRateData | null; silverCity?: string }) {
    const cards: BullionCard[] = gold.map(rate => ({
        symbol: 'Au',
        name: `Gold ${rate.purity}`,
        note: PURITY_NOTE[rate.purity],
        price: rate.pricePerGram * 10,
        unit: '10g',
        change: rate.change * 10,
        changePercent: rate.changePercent,
        href: '/gold-rate',
        tone: 'bg-[#fef3c7] text-[#b45309]',
    }));
    if (silver) {
        cards.push({
            symbol: 'Ag',
            name: 'Silver',
            note: silverCity ? `99.9% · ${silverCity} rate` : '99.9% · bars & coins',
            price: silver.price * 1000,
            unit: 'kg',
            change: silver.change * 1000,
            changePercent: silver.changePercent,
            href: '/silver-rate',
            tone: 'bg-[#f1f5f9] text-[#475569]',
        });
    }

    if (cards.length === 0) return null;

    return (
        <section aria-labelledby="bullion-heading">
            <SectionTitle id="bullion-heading" title="Gold & silver today" href="/gold-rate" hrefLabel="Detailed rates" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {cards.map(card => (
                    <Link key={card.name} href={card.href} className="block">
                        <Card className="px-3 py-2.5 h-full hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-shadow">
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold shrink-0 ${card.tone}`}>{card.symbol}</div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gw-text leading-tight truncate">{card.name}</p>
                                    <p className="text-[11px] text-gw-sub leading-tight truncate">{card.note}</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gw-text tabular-nums mt-2 leading-tight">
                                {formatINR(card.price)}<span className="text-[11px] text-gw-sub font-normal"> /{card.unit}</span>
                            </p>
                            <ChangeText value={card.change} percent={card.changePercent} digits={0} className="text-[11px]" />
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="mt-5">
                <p className="text-xs text-gw-sub mb-2">Gold rate in your city</p>
                <div className="flex flex-wrap gap-2">
                    {CITIES.map(city => (
                        <Link
                            key={city}
                            href={`/gold-rate/${city.toLowerCase()}`}
                            className="rounded-full border border-gw-border bg-white px-3.5 py-1 text-sm text-gw-text hover:border-gw-green hover:text-gw-green transition-colors"
                        >
                            {city}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
