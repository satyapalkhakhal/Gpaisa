// Building blocks for the gold and silver rate pages (English and Hindi), laid out like a
// business-news rate page: compact title, summary, key rate cards, tables, a server-rendered
// chart, the city table, then guide content in modest type. Server components only.
import Link from 'next/link';
import type { ArticleLanguage } from '@/lib/articleLocale';
import type { CityRateRow, RateSeries } from '@/lib/rates';

export const RATE_LABELS: Record<ArticleLanguage, Record<string, string>> = {
    en: {
        home: 'Home', gold: 'Gold', silver: 'Silver', date: 'Date', city: 'City', change: 'Change',
        purity: 'Purity', updated: 'Last updated', high: 'High', low: 'Low', net: 'Net change',
        days: 'days', perGram: 'per gram', faq: 'Frequently asked questions', otherCities: 'Other cities',
        asOf: 'Rates as of', dateLocale: 'en-IN', note: 'Rates are indicative, before GST (3%) and making charges. Check with your jeweller before buying.',
    },
    hi: {
        home: 'होम', gold: 'सोना', silver: 'चांदी', date: 'तारीख', city: 'शहर', change: 'बदलाव',
        purity: 'शुद्धता', updated: 'अपडेट', high: 'उच्च', low: 'निम्न', net: 'कुल बदलाव',
        days: 'दिन', perGram: 'प्रति ग्राम', faq: 'अक्सर पूछे जाने वाले सवाल', otherCities: 'दूसरे शहर',
        asOf: 'भाव', dateLocale: 'hi-IN', note: 'भाव सांकेतिक हैं, GST (3%) और मेकिंग चार्ज अलग से। खरीदने से पहले जौहरी से भाव ज़रूर पूछें।',
    },
};

// ─── Formatting ──────────────────────────────────────────────────

export const inr = (n: number, digits = 0) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits });

/** "21 October 2026" / "22nd Oct, 2026" → Date, or null. */
export function parseFeedDate(value: string): Date | null {
    const t = Date.parse(value.replace(/(\d+)(st|nd|rd|th)/, '$1').replace(',', ''));
    return Number.isNaN(t) ? null : new Date(t);
}

export function feedDate(value: string, lang: ArticleLanguage, style: 'short' | 'long' = 'long'): string {
    const d = parseFeedDate(value);
    if (!d) return value;
    return d.toLocaleDateString(RATE_LABELS[lang].dateLocale, style === 'short'
        ? { day: 'numeric', month: 'short' }
        : { day: 'numeric', month: 'short', year: 'numeric' });
}

export const Change = ({ value, percent, digits = 0 }: { value?: number; percent: number; digits?: number }) => {
    const up = percent > 0;
    const flat = Math.abs(percent) < 0.005;
    const tone = flat ? 'text-gray-500' : up ? 'text-gw-up' : 'text-gw-down';
    return (
        <span className={`tabular-nums whitespace-nowrap ${tone}`}>
            {flat ? '–' : up ? '▲' : '▼'}{' '}
            {value !== undefined && !flat && <>{inr(Math.abs(value), digits)} </>}
            ({Math.abs(percent).toFixed(2)}%)
        </span>
    );
};

// ─── Page chrome ─────────────────────────────────────────────────

export const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-3">
        <ol className="flex flex-wrap items-center gap-1.5">
            {items.map((it, i) => (
                <li key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>›</span>}
                    {it.href ? <Link href={it.href} className="hover:text-gw-green">{it.label}</Link> : <span className="text-gray-700">{it.label}</span>}
                </li>
            ))}
        </ol>
    </nav>
);

/** Gold / Silver switch, BT-style, linking to the same place for the other metal. */
export const MetalTabs = ({ active, goldHref, silverHref, lang }: { active: 'gold' | 'silver'; goldHref: string; silverHref?: string; lang: ArticleLanguage }) => {
    const t = RATE_LABELS[lang];
    const tab = (on: boolean) => `px-4 py-1.5 text-sm font-semibold rounded-full ${on ? 'bg-gw-text text-white' : 'text-gray-600 hover:text-gw-text'}`;
    return (
        <div className="inline-flex items-center gap-1 rounded-full border border-gw-border bg-white p-1 mb-4">
            <Link href={goldHref} className={tab(active === 'gold')} aria-current={active === 'gold' ? 'page' : undefined}>{t.gold}</Link>
            {silverHref && <Link href={silverHref} className={tab(active === 'silver')} aria-current={active === 'silver' ? 'page' : undefined}>{t.silver}</Link>}
        </div>
    );
};

export const RateTitle = ({ title, summary, updated, lang }: { title: string; summary?: React.ReactNode; updated?: string; lang: ArticleLanguage }) => (
    <header className="mb-5">
        <h1 className="text-2xl sm:text-[28px] font-bold leading-tight tracking-tight text-gw-text">{title}</h1>
        {summary && <p className="mt-3 text-[15px] leading-relaxed text-gray-700 max-w-3xl">{summary}</p>}
        {updated && <p className="mt-2 text-xs text-gray-500">{RATE_LABELS[lang].asOf} {updated}</p>}
    </header>
);

/** Main column + right rail on desktop; the rail drops below on small screens. */
export const RateLayout = ({ children, rail }: { children: React.ReactNode; rail?: React.ReactNode }) => (
    <div className="bg-white text-gw-text">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10">
            <div className="min-w-0">{children}</div>
            {rail && <aside className="space-y-6 lg:sticky lg:top-20 self-start">{rail}</aside>}
        </div>
    </div>
);

export const Section = ({ id, title, children, className = '' }: { id?: string; title: string; children: React.ReactNode; className?: string }) => (
    <section aria-labelledby={id} className={`mt-9 ${className}`}>
        <h2 id={id} className="text-lg font-bold text-gw-text border-b border-gw-border pb-2 mb-4">{title}</h2>
        {children}
    </section>
);

export const Prose = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[15px] leading-relaxed text-gray-700 space-y-3">{children}</div>
);

export const RateNote = ({ lang, children }: { lang: ArticleLanguage; children?: React.ReactNode }) => (
    <p className="mt-2 text-xs text-gray-500">{children ?? RATE_LABELS[lang].note}</p>
);

// ─── Rate blocks ─────────────────────────────────────────────────

export interface KeyRate { label: string; sub?: string; value: number; change?: number; changePercent: number; digits?: number }

export const KeyRateCards = ({ rates }: { rates: KeyRate[] }) => (
    <div className={`grid ${rates.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-3`}>
        {rates.map(r => (
            <div key={r.label + r.sub} className="rounded-xl border border-gw-border bg-amber-50/60 px-2.5 py-2.5 sm:px-4 sm:py-3 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-600 leading-tight">{r.label}{r.sub && <span className="block sm:inline font-normal text-gray-500"><span className="hidden sm:inline"> · </span>{r.sub}</span>}</p>
                <p className="mt-1 text-[15px] sm:text-xl font-bold tabular-nums text-gw-text">{inr(r.value, r.digits ?? 0)}</p>
                {/* Phones show the % only; the ₹ change joins from sm up. */}
                <p className="text-[11px] sm:text-xs mt-0.5 sm:hidden"><Change percent={r.changePercent} /></p>
                <p className="text-xs mt-0.5 hidden sm:block"><Change value={r.change} percent={r.changePercent} digits={r.digits ?? 0} /></p>
            </div>
        ))}
    </div>
);

const th = 'px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-50 whitespace-nowrap';
const td = 'px-3 py-2.5 text-sm tabular-nums whitespace-nowrap';

/** Rows (purities) × weights. `perGram` is INR per gram. */
export const RateMatrix = ({ rows, weights, caption, lang }: {
    rows: { label: string; sub?: string; perGram: number }[];
    weights: { label: string; grams: number }[];
    caption: string;
    lang: ArticleLanguage;
}) => (
    <div className="overflow-x-auto rounded-xl border border-gw-border">
        <table className="w-full">
            <caption className="sr-only">{caption}</caption>
            <thead><tr>
                <th scope="col" className={th}>{RATE_LABELS[lang].purity}</th>
                {weights.map(w => <th key={w.label} scope="col" className={`${th} text-right`}>{w.label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gw-border">
                {rows.map(r => (
                    <tr key={r.label}>
                        <th scope="row" className={`${td} text-left font-semibold`}>{r.label}{r.sub && <span className="block text-[11px] font-normal text-gray-500">{r.sub}</span>}</th>
                        {weights.map(w => <td key={w.label} className={`${td} text-right`}>{inr(r.perGram * w.grams)}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/** Last N days: one price + change pair per column (e.g. 22K and 24K), priced for `grams`. */
export const HistoryTable = ({ columns, grams, lang, caption }: {
    columns: { label: string; series: RateSeries }[];
    grams: number;
    lang: ArticleLanguage;
    caption: string;
}) => {
    const base = columns[0]?.series ?? [];
    return (
        <div className="overflow-x-auto rounded-xl border border-gw-border">
            <table className="w-full">
                <caption className="sr-only">{caption}</caption>
                <thead><tr>
                    <th scope="col" className={th}>{RATE_LABELS[lang].date}</th>
                    {columns.map(c => <th key={c.label} scope="col" className={`${th} text-right`}>{c.label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gw-border">
                    {base.map((row, i) => (
                        <tr key={row.date}>
                            <th scope="row" className={`${td} text-left font-medium`}>{feedDate(row.date, lang)}</th>
                            {columns.map(c => {
                                const p = c.series[i];
                                // The oldest row has no previous day to compare with.
                                const hasPrev = i < c.series.length - 1;
                                return (
                                    <td key={c.label} className={`${td} text-right`}>
                                        {p ? <>{inr(p.perGram * grams)}{hasPrev && <span className="block sm:inline sm:ml-1.5 text-xs"><Change percent={p.changePercent} /></span>}</> : '–'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const RangeStats = ({ stats, grams, lang, days }: {
    stats: { high: number; low: number; change: number; changePercent: number } | null;
    grams: number;
    lang: ArticleLanguage;
    days: number;
}) => {
    if (!stats) return null;
    const t = RATE_LABELS[lang];
    const cell = 'rounded-lg border border-gw-border px-3 py-2';
    return (
        <div className="grid grid-cols-3 gap-3 mt-3">
            <div className={cell}><p className="text-[11px] text-gray-500">{days} {t.days} · {t.high}</p><p className="text-sm font-bold tabular-nums">{inr(stats.high * grams)}</p></div>
            <div className={cell}><p className="text-[11px] text-gray-500">{days} {t.days} · {t.low}</p><p className="text-sm font-bold tabular-nums">{inr(stats.low * grams)}</p></div>
            <div className={cell}>
                <p className="text-[11px] text-gray-500">{t.net}</p>
                <p className={`text-sm font-bold tabular-nums ${stats.change >= 0 ? 'text-gw-up' : 'text-gw-down'}`}>{stats.change >= 0 ? '▲' : '▼'} {inr(Math.abs(stats.change * grams))}</p>
                <p className="text-[11px] text-gray-500 tabular-nums">{stats.changePercent >= 0 ? '+' : '−'}{Math.abs(stats.changePercent).toFixed(2)}%</p>
            </div>
        </div>
    );
};

/** City comparison with links; `columns` pick rate keys from each row, priced for `grams`. */
export const CityRateTable = ({ rows, columns, hrefFor, currentSlug, lang, caption }: {
    rows: CityRateRow[];
    columns: { key: string; label: string; grams: number }[];
    hrefFor: (slug: string) => string;
    currentSlug?: string;
    lang: ArticleLanguage;
    caption: string;
}) => (
    <div className="overflow-x-auto rounded-xl border border-gw-border">
        <table className="w-full">
            <caption className="sr-only">{caption}</caption>
            <thead><tr>
                <th scope="col" className={th}>{RATE_LABELS[lang].city}</th>
                {columns.map(c => <th key={c.key + c.grams} scope="col" className={`${th} text-right`}>{c.label}</th>)}
                <th scope="col" className={`${th} text-right hidden sm:table-cell`}>{RATE_LABELS[lang].change}</th>
            </tr></thead>
            <tbody className="divide-y divide-gw-border">
                {rows.map(r => (
                    <tr key={r.slug} className={r.slug === currentSlug ? 'bg-amber-50' : undefined}>
                        <th scope="row" className={`${td} text-left font-semibold`}>
                            <Link href={hrefFor(r.slug)} className="text-gw-text hover:text-gw-green hover:underline">{r.city}</Link>
                        </th>
                        {columns.map(c => <td key={c.key + c.grams} className={`${td} text-right`}>{r.rates[c.key] ? inr(r.rates[c.key] * c.grams) : '–'}</td>)}
                        <td className={`${td} text-right text-xs hidden sm:table-cell`}><Change percent={r.changePercent} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const FaqList = ({ items }: { items: { question: string; answer: string }[] }) => (
    <div className="divide-y divide-gw-border border-y border-gw-border">
        {items.map((f, i) => (
            <details key={i} className="group py-3" open={i === 0}>
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-[15px] font-semibold text-gw-text [&::-webkit-details-marker]:hidden">
                    <span>{f.question}</span>
                    <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{f.answer}</p>
            </details>
        ))}
    </div>
);

/** Plain bulleted list for tips/factors. */
export const BulletList = ({ items, ordered = false }: { items: string[]; ordered?: boolean }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
        <Tag className={`text-[15px] leading-relaxed text-gray-700 space-y-1.5 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-gray-400`}>
            {items.map((it, i) => <li key={i}>{it}</li>)}
        </Tag>
    );
};

// ─── Right rail ──────────────────────────────────────────────────

export const RailCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gw-border p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gw-text mb-3">{title}</h2>
        {children}
    </div>
);

export const RailLinks = ({ links }: { links: { href: string; label: string; value?: string }[] }) => (
    <ul className="divide-y divide-gw-border">
        {links.map(l => (
            <li key={l.href}>
                <Link href={l.href} className="flex items-center justify-between gap-3 py-2 text-sm hover:text-gw-green">
                    <span>{l.label}</span>
                    {l.value && <span className="tabular-nums text-gray-600">{l.value}</span>}
                </Link>
            </li>
        ))}
    </ul>
);
