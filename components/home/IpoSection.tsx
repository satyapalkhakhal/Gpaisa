// Groww-style IPO block: chip tabs (Open / Upcoming / Closed / Listed) over a bordered table
// of logo rows. Phases come from the issue dates, not the stored status, so an issue whose
// status was never updated can't sit under "Open" weeks after it closed.
import Link from 'next/link';
import type { GmpBoardEntry, ListingPerformanceEntry } from '@/lib/ipoApi';
import type { Ipo } from '@/lib/ipoTypes';
import { computeMarketLotTiers } from '@/lib/ipoComputed';
import PillTabs from './PillTabs';
import {
    Card,
    EmptyState,
    LogoTile,
    OutlineButton,
    SectionTitle,
    daysBetween,
    formatINR,
    formatShortDate,
    formatSignedPercent,
} from './HomeUi';

// A closed issue with no upcoming allotment/listing date stops being news after this long.
const RECENTLY_CLOSED_WINDOW_DAYS = 10;

type Phase = 'open' | 'upcoming' | 'closed';

interface Timeline {
    phase: Phase;
    label: string;
    urgent: boolean;
    sortDays: number;
}

export function ipoTimeline(ipo: Ipo, today: string): Timeline | null {
    const { open_date, close_date, allotment_date, listing_date } = ipo;

    if (!open_date) {
        return ipo.status === 'announced' || ipo.status === 'upcoming'
            ? { phase: 'upcoming', label: 'Dates to be announced', urgent: false, sortDays: Number.MAX_SAFE_INTEGER }
            : null;
    }
    if (today < open_date) {
        const n = daysBetween(today, open_date);
        return { phase: 'upcoming', label: n === 1 ? 'Opens tomorrow' : `Opens ${formatShortDate(open_date)}`, urgent: false, sortDays: n };
    }
    if (!close_date || today <= close_date) {
        if (!close_date && daysBetween(open_date, today) > 5) return null;
        const n = close_date ? daysBetween(today, close_date) : 0;
        const label = !close_date ? 'Open now' : n === 0 ? 'Closes today' : n === 1 ? 'Closes tomorrow' : `Closes in ${n} days`;
        return { phase: 'open', label, urgent: n <= 1, sortDays: n };
    }
    if (allotment_date && today <= allotment_date) {
        return { phase: 'closed', label: today === allotment_date ? 'Allotment today' : `Allotment ${formatShortDate(allotment_date)}`, urgent: false, sortDays: daysBetween(today, allotment_date) };
    }
    if (listing_date && today <= listing_date) {
        return { phase: 'closed', label: today === listing_date ? 'Lists today' : `Lists ${formatShortDate(listing_date)}`, urgent: false, sortDays: daysBetween(today, listing_date) };
    }
    if (daysBetween(close_date, today) <= RECENTLY_CLOSED_WINDOW_DAYS) {
        return { phase: 'closed', label: `Closed ${formatShortDate(close_date)}`, urgent: false, sortDays: daysBetween(close_date, today) + 30 };
    }
    return null;
}

function priceBand(ipo: Ipo): string {
    if (ipo.price_band_max == null) return '—';
    if (ipo.price_band_min == null || ipo.price_band_min === ipo.price_band_max) return `₹${ipo.price_band_max}`;
    return `₹${ipo.price_band_min}–${ipo.price_band_max}`;
}

const TH = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <th className={`px-4 py-3 text-xs font-normal text-gw-sub whitespace-nowrap ${className}`}>{children}</th>
);

// ─── Open / Upcoming / Closed table ─────────────────────────────

const IssueTable = ({ rows, emptyTitle }: { rows: { entry: GmpBoardEntry; timeline: Timeline }[]; emptyTitle: string }) => {
    if (rows.length === 0) {
        return (
            <Card>
                <EmptyState title={emptyTitle}>
                    New issues appear here as soon as their price band and dates are announced.
                </EmptyState>
            </Card>
        );
    }
    return (
        <Card className="overflow-hidden">
            <table className="w-full text-sm">
                <thead className="border-b border-gw-border">
                    <tr>
                        <TH className="text-left">Company</TH>
                        <TH className="text-right hidden sm:table-cell">Price range</TH>
                        <TH className="text-right hidden md:table-cell">Min. investment</TH>
                        <TH className="text-right"><span title="Unofficial grey-market premium, not a guaranteed listing price">GMP</span></TH>
                        <TH className="hidden lg:table-cell"><span className="sr-only">Action</span></TH>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gw-border">
                    {rows.map(({ entry: { ipo, latestGmp }, timeline }) => {
                        const name = ipo.company?.name || ipo.slug;
                        const minLot = computeMarketLotTiers(ipo.price_band_max, ipo.lot_size)[0];
                        const gmpPct = latestGmp
                            ? latestGmp.gmp_percentage ?? (ipo.price_band_max ? (latestGmp.gmp_value / ipo.price_band_max) * 100 : null)
                            : null;
                        return (
                            <tr key={ipo.id} className="group hover:bg-gw-bg/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    <Link href={`/ipo/${ipo.slug}`} className="flex items-center gap-3 min-w-0">
                                        <LogoTile name={name} src={ipo.company?.logo_url} />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gw-text group-hover:text-gw-green transition-colors truncate">{name}</p>
                                            <p className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                <span className={timeline.urgent ? 'text-gw-red font-medium' : 'text-gw-sub'}>{timeline.label}</span>
                                                <span className="text-gw-border">|</span>
                                                <span className="text-gw-sub">{ipo.ipo_type === 'sme' ? 'SME' : 'Mainboard'}</span>
                                            </p>
                                            <p className="sm:hidden text-xs text-gw-sub mt-0.5 tabular-nums">
                                                {priceBand(ipo)}{minLot && ` · Min ${formatINR(minLot.amount)}`}
                                            </p>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-3.5 text-right text-gw-text tabular-nums hidden sm:table-cell">{priceBand(ipo)}</td>
                                <td className="px-4 py-3.5 text-right hidden md:table-cell">
                                    {minLot ? (
                                        <>
                                            <p className="text-gw-text tabular-nums">{formatINR(minLot.amount)}</p>
                                            <p className="text-xs text-gw-sub">{minLot.shares.toLocaleString('en-IN')} shares</p>
                                        </>
                                    ) : <span className="text-gw-sub">—</span>}
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    {latestGmp ? (
                                        <>
                                            <p className={`tabular-nums ${latestGmp.gmp_value > 0 ? 'text-gw-green' : latestGmp.gmp_value < 0 ? 'text-gw-red' : 'text-gw-text'}`}>
                                                ₹{latestGmp.gmp_value}{gmpPct != null && ` (${formatSignedPercent(gmpPct, 1)})`}
                                            </p>
                                            <p className="text-xs text-gw-sub">{formatShortDate(latestGmp.recorded_at)}</p>
                                        </>
                                    ) : <span className="text-gw-sub">—</span>}
                                </td>
                                <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                                    <OutlineButton href={`/ipo/${ipo.slug}`}>Details</OutlineButton>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
};

// ─── Listed table ───────────────────────────────────────────────

const ListedTable = ({ listings }: { listings: ListingPerformanceEntry[] }) => {
    if (listings.length === 0) {
        return <Card><EmptyState title="No recent listings yet." /></Card>;
    }
    return (
        <Card className="overflow-hidden">
            <table className="w-full text-sm">
                <thead className="border-b border-gw-border">
                    <tr>
                        <TH className="text-left">Company</TH>
                        <TH className="text-right hidden sm:table-cell">Issue price</TH>
                        <TH className="text-right hidden sm:table-cell">Listing price</TH>
                        <TH className="text-right">Listing gain</TH>
                        <TH className="text-right hidden md:table-cell">Current gain</TH>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gw-border">
                    {listings.map(({ ipo, listingGainPercent, currentGainPercent }) => {
                        const name = ipo.company?.name || ipo.slug;
                        return (
                            <tr key={ipo.id} className="group hover:bg-gw-bg/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    <Link href={`/ipo/${ipo.slug}`} className="flex items-center gap-3 min-w-0">
                                        <LogoTile name={name} src={ipo.company?.logo_url} />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gw-text group-hover:text-gw-green transition-colors truncate">{name}</p>
                                            <p className="text-xs text-gw-sub mt-0.5">
                                                {ipo.listing_date ? `Listed ${formatShortDate(ipo.listing_date)}` : 'Listed'} | {ipo.ipo_type === 'sme' ? 'SME' : 'Mainboard'}
                                            </p>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-3.5 text-right text-gw-text tabular-nums hidden sm:table-cell">{ipo.price_band_max != null ? `₹${ipo.price_band_max}` : '—'}</td>
                                <td className="px-4 py-3.5 text-right text-gw-text tabular-nums hidden sm:table-cell">{ipo.listing_price != null ? `₹${ipo.listing_price}` : '—'}</td>
                                <td className={`px-4 py-3.5 text-right tabular-nums ${listingGainPercent == null ? 'text-gw-sub' : listingGainPercent >= 0 ? 'text-gw-green' : 'text-gw-red'}`}>
                                    {listingGainPercent != null ? formatSignedPercent(listingGainPercent, 1) : '—'}
                                </td>
                                <td className={`px-4 py-3.5 text-right tabular-nums hidden md:table-cell ${currentGainPercent == null ? 'text-gw-sub' : currentGainPercent >= 0 ? 'text-gw-green' : 'text-gw-red'}`}>
                                    {currentGainPercent != null ? formatSignedPercent(currentGainPercent, 1) : '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
};

// ─── Section ────────────────────────────────────────────────────

export default function IpoSection({ board, listings, today }: {
    board: GmpBoardEntry[];
    listings: ListingPerformanceEntry[];
    today: string;
}) {
    const rows = board
        .map(entry => ({ entry, timeline: ipoTimeline(entry.ipo, today) }))
        .filter((row): row is { entry: GmpBoardEntry; timeline: Timeline } => row.timeline !== null)
        .sort((a, b) => a.timeline.sortDays - b.timeline.sortDays);

    const open = rows.filter(r => r.timeline.phase === 'open');
    const upcoming = rows.filter(r => r.timeline.phase === 'upcoming');
    const closed = rows.filter(r => r.timeline.phase === 'closed');
    const listed = [...listings]
        .sort((a, b) => (b.ipo.listing_date ?? '').localeCompare(a.ipo.listing_date ?? ''))
        .slice(0, 5);

    const tabs = [
        { key: 'open', label: 'Open', count: open.length },
        { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
        { key: 'closed', label: 'Closed', count: closed.length },
        { key: 'listed', label: 'Listed', count: listed.length },
    ];
    const initialKey = tabs.find(t => t.count > 0)?.key ?? 'open';

    return (
        <section aria-labelledby="ipo-heading">
            <SectionTitle id="ipo-heading" title="IPOs" href="/ipo" hrefLabel="All IPOs" />
            <PillTabs
                ariaLabel="IPO status"
                tabs={tabs}
                initialKey={initialKey}
                panels={[
                    <IssueTable key="open" rows={open} emptyTitle="No IPO is open for bidding right now." />,
                    <IssueTable key="upcoming" rows={upcoming} emptyTitle="No upcoming IPO announced yet." />,
                    <IssueTable key="closed" rows={closed} emptyTitle="No IPO awaiting allotment or listing." />,
                    <ListedTable key="listed" listings={listed} />,
                ]}
            />
        </section>
    );
}
