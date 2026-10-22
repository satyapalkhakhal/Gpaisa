// Groww-style building blocks for the homepage: flat white cards with hairline borders,
// plain section titles with a green "See all", logo tiles, and green/red change text.
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/articlesApi';

// ─── Formatting ──────────────────────────────────────────────────

export function formatINR(value: number, maximumFractionDigits: number = 0): string {
    return '₹' + value.toLocaleString('en-IN', { maximumFractionDigits });
}

export function formatSignedPercent(value: number, digits: number = 2): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

export function formatShortDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}

/** "18 Jul" for this year, "18 Jul 2025" otherwise — never a raw ISO timestamp. */
export function formatArticleDate(article: Article): string {
    const raw = article.published_at || article.date;
    const parsed = Date.parse(raw);
    if (Number.isNaN(parsed)) return article.date || '';
    const sameYear = new Date(parsed).getFullYear() === new Date().getFullYear();
    return new Date(parsed).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }), timeZone: 'Asia/Kolkata',
    });
}

/** Today's date in IST as YYYY-MM-DD — comparable with the DATE columns stored in Postgres. */
export function todayIsoIST(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

/** Whole days from `fromIso` to `toIso` (both YYYY-MM-DD); negative when `toIso` is earlier. */
export function daysBetween(fromIso: string, toIso: string): number {
    return Math.round((Date.parse(toIso.slice(0, 10)) - Date.parse(fromIso.slice(0, 10))) / 86_400_000);
}

// ─── Layout primitives ───────────────────────────────────────────

export const SectionTitle = ({ id, title, href, hrefLabel = 'See all' }: {
    id?: string;
    title: string;
    href?: string;
    hrefLabel?: string;
}) => (
    <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id={id} className="text-lg sm:text-xl font-medium text-gw-text">{title}</h2>
        {href && (
            <Link href={href} className="text-sm font-medium text-gw-green hover:text-gw-greenDark shrink-0">{hrefLabel}</Link>
        )}
    </div>
);

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gw-border ${className}`}>{children}</div>
);

export const CardTitle = ({ title, href, hrefLabel = 'See all' }: { title: string; href?: string; hrefLabel?: string }) => (
    <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <h3 className="text-base font-medium text-gw-text">{title}</h3>
        {href && <Link href={href} className="text-xs font-medium text-gw-green hover:text-gw-greenDark shrink-0">{hrefLabel}</Link>}
    </div>
);

const LOGO_TONES = [
    'bg-indigo-50 text-indigo-600',
    'bg-amber-100 text-amber-700',
    'bg-sky-100 text-sky-700',
    'bg-pink-100 text-pink-700',
    'bg-emerald-50 text-emerald-600',
    'bg-purple-100 text-purple-700',
];

/** Rounded logo tile: the company logo when we have one, otherwise coloured initials. */
export const LogoTile = ({ name, src, size = 40 }: { name: string; src?: string | null; size?: number }) => {
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const tone = LOGO_TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % LOGO_TONES.length];
    return (
        <div
            className={`relative shrink-0 rounded-lg border border-gw-border overflow-hidden flex items-center justify-center font-semibold ${src ? 'bg-white' : tone}`}
            style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
        >
            {src ? <Image src={src} alt={name} fill className="object-contain p-1" sizes={`${size}px`} /> : initials}
        </div>
    );
};

/** "+1,438 (1.05%)" in green, or "−1,438 (1.05%)" in red. */
export const ChangeText = ({ value, percent, digits = 2, className = '' }: {
    value?: number;
    percent: number;
    digits?: number;
    className?: string;
}) => {
    const up = percent >= 0;
    return (
        <span className={`tabular-nums ${up ? 'text-gw-up' : 'text-gw-down'} ${className}`}>
            {value != null && <>{up ? '+' : '−'}{Math.abs(value).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })} </>}
            ({up ? '' : '−'}{Math.abs(percent).toFixed(2)}%)
        </span>
    );
};

/** Groww's secondary action: green outline, rounded, sentence case. */
export const OutlineButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="inline-flex items-center justify-center rounded-lg border border-gw-green text-gw-green text-sm font-medium px-4 py-1.5 hover:bg-gw-greenBg transition-colors whitespace-nowrap"
    >
        {children}
    </Link>
);

// ─── News ────────────────────────────────────────────────────────

/** Groww "in the news" row: meta and headline on the left, thumbnail on the right. */
export const NewsRow = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group flex items-start gap-4 py-3.5">
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gw-sub">
                <span className="font-medium">{article.subcategory || article.category}</span>
                <span className="mx-1.5">·</span>
                {formatArticleDate(article)}
            </p>
            <h4 className="text-sm font-medium text-gw-text leading-snug mt-1 line-clamp-2 group-hover:text-gw-green transition-colors">
                {article.title}
            </h4>
        </div>
        <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-gw-bg shrink-0">
            {article.image_url && <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="96px" />}
        </div>
    </Link>
);

export const EmptyState = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className="py-10 px-4 text-center">
        <p className="text-sm font-medium text-gw-text">{title}</p>
        {children && <div className="text-xs text-gw-sub mt-1.5">{children}</div>}
    </div>
);
