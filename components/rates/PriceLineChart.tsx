// Server-rendered SVG line chart for a short price series (newest first). The y-axis spans
// the series' own range (with padding) instead of starting at zero, so a 2–4% move is
// visible; points carry <title> tooltips. No client JavaScript.
import type { ArticleLanguage } from '@/lib/articleLocale';
import type { RateSeries } from '@/lib/rates';
import { feedDate, inr } from './RatesUi';

// Two sizes of the same chart: a wide one from sm up and a narrow one for phones, so the
// 12px labels stay readable instead of being scaled down with a single wide viewBox.
const SIZES = { wide: { W: 720, H: 240 }, narrow: { W: 380, H: 220 } };
const PAD = { top: 16, right: 14, bottom: 28, left: 70 };

export default function PriceLineChart({ series, grams, lang, color = '#d97706', label }: {
    series: RateSeries;
    grams: number;
    lang: ArticleLanguage;
    color?: string;
    label: string;
}) {
    if (series.length < 2) return null;
    return (
        <figure className="rounded-xl border border-gw-border p-3 sm:p-4">
            <div className="hidden sm:block"><ChartSvg series={series} grams={grams} lang={lang} color={color} label={label} size="wide" /></div>
            <div className="sm:hidden"><ChartSvg series={series} grams={grams} lang={lang} color={color} label={label} size="narrow" /></div>
            <figcaption className="sr-only">{label}</figcaption>
        </figure>
    );
}

function ChartSvg({ series, grams, lang, color, label, size }: {
    series: RateSeries; grams: number; lang: ArticleLanguage; color: string; label: string; size: keyof typeof SIZES;
}) {
    const { W, H } = SIZES[size];
    const points = [...series].reverse(); // oldest → newest, left → right

    const values = points.map(p => p.perGram * grams);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || max * 0.01 || 1;
    const lo = min - span * 0.15;
    const hi = max + span * 0.15;
    const x = (i: number) => PAD.left + (i / (points.length - 1)) * (W - PAD.left - PAD.right);
    const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);

    const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${line} L${x(values.length - 1).toFixed(1)},${H - PAD.bottom} L${x(0).toFixed(1)},${H - PAD.bottom} Z`;
    const ticks = [lo + (hi - lo) * 0.15, (lo + hi) / 2, hi - (hi - lo) * 0.15];
    const xLabels = [0, Math.floor((points.length - 1) / 2), points.length - 1];
    const gradientId = `fill-${color.replace('#', '')}-${size}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full h-auto">
            <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {ticks.map(t => (
                <g key={t}>
                    <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeDasharray="3 4" />
                    <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#6b7280">{inr(t)}</text>
                </g>
            ))}
            <path d={area} fill={`url(#${gradientId})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 5 : 3} fill={i === values.length - 1 ? color : '#fff'} stroke={color} strokeWidth="2">
                    <title>{`${feedDate(points[i].date, lang)}: ${inr(v)}`}</title>
                </circle>
            ))}
            {xLabels.map(i => (
                <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} fontSize="12" fill="#6b7280">
                    {feedDate(points[i].date, lang, 'short')}
                </text>
            ))}
        </svg>
    );
}
