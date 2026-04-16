'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────
interface RawRecord { price_date: string; gold_usd: number; silver_usd: number; }

interface DataPoint {
    date: string;
    label: string;
    gold_usd: number;
    silver_usd: number;
    gold_open?: number; gold_close?: number; gold_high?: number; gold_low?: number;
    silver_open?: number; silver_close?: number; silver_high?: number; silver_low?: number;
}

interface Props { id: string; metal: 'gold' | 'silver' | 'both'; title: string; }

type ChartType = 'area' | 'line' | 'candle';
const PRESETS = ['1Y', '3Y', '5Y', '10Y', '20Y', 'ALL'] as const;
type Preset = typeof PRESETS[number];

const GOLD_C = '#D4AF37';
const SILVER_C = '#6B7280';
const GREEN_C = '#16A34A';
const RED_C = '#DC2626';

// ─── Client cache ────────────────────────────────────────────────────────────
let masterCache: RawRecord[] | null = null;
let fetchingPromise: Promise<RawRecord[]> | null = null;

async function fetchAllData(): Promise<RawRecord[]> {
    if (masterCache) return masterCache;
    if (fetchingPromise) return fetchingPromise;

    fetchingPromise = fetch('/api/metal-prices')
        .then(r => {
            if (!r.ok) throw new Error(`API ${r.status}`);
            return r.json();
        })
        .then((data: RawRecord[]) => {
            // API returns data in ascending order (oldest → newest), ready for charts
            masterCache = data;
            fetchingPromise = null;
            return data;
        })
        .catch(err => {
            console.error('[Chart] API error:', err);
            fetchingPromise = null;
            return [];
        });

    return fetchingPromise;
}

function filterByPreset(data: RawRecord[], preset: Preset): RawRecord[] {
    if (preset === 'ALL') return data;
    const now = new Date();
    const years = preset === '1Y' ? 1 : preset === '3Y' ? 3 : preset === '5Y' ? 5 : preset === '10Y' ? 10 : 20;
    const cutoff = new Date(now.getFullYear() - years, now.getMonth(), 1).toISOString().split('T')[0];
    return data.filter(d => d.price_date >= cutoff);
}

function toDataPoints(raw: RawRecord[]): DataPoint[] {
    return raw.map(r => ({
        date: r.price_date,
        label: new Date(r.price_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        gold_usd: r.gold_usd,
        silver_usd: r.silver_usd,
    }));
}

function toCandles(data: DataPoint[]): DataPoint[] {
    const quarters: Record<string, DataPoint[]> = {};
    data.forEach(d => {
        const dt = new Date(d.date);
        const q = `${dt.getFullYear()}-Q${Math.floor(dt.getMonth() / 3)}`;
        (quarters[q] = quarters[q] || []).push(d);
    });
    return Object.values(quarters).map(pts => {
        const f = pts[0], l = pts[pts.length - 1];
        const gv = pts.map(p => p.gold_usd), sv = pts.map(p => p.silver_usd);
        return {
            ...l,
            label: new Date(f.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            gold_open: f.gold_usd, gold_close: l.gold_usd,
            gold_high: Math.max(...gv), gold_low: Math.min(...gv),
            silver_open: f.silver_usd, silver_close: l.silver_usd,
            silver_high: Math.max(...sv), silver_low: Math.min(...sv),
        };
    });
}

// ─── Candle shape ────────────────────────────────────────────────────────────
function CandleShape(props: any) {
    const { x, y, width, height, payload, metalKey } = props;
    const o = payload?.[`${metalKey}_open`], c = payload?.[`${metalKey}_close`];
    const h = payload?.[`${metalKey}_high`], l = payload?.[`${metalKey}_low`];
    if (!o || !c || !h || !l || !height || height <= 0) return null;
    const up = c >= o;
    const color = up ? GREEN_C : RED_C;
    const scale = height / (h - l || 1);
    const bTop = Math.max(o, c), bBot = Math.min(o, c);
    const bW = Math.max(width * 0.5, 4), mx = x + width / 2;
    return (
        <g>
            <line x1={mx} y1={y} x2={mx} y2={y + height} stroke={color} strokeWidth={1} />
            <rect x={mx - bW / 2} y={y + (h - bTop) * scale} width={bW}
                height={Math.max((bTop - bBot) * scale, 1)} fill={color} rx={1} />
        </g>
    );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, chartType, metal }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    const $ = (v: number) => `$${v?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return (
        <div className="bg-white/95 backdrop-blur rounded-xl border border-gray-200 shadow-xl p-3 text-xs max-w-[260px]">
            <p className="font-bold text-gray-900 mb-1 text-sm">
                {new Date(d.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            {(metal === 'gold' || metal === 'both') && (
                <div className="mb-1">
                    <span className="font-semibold" style={{ color: GOLD_C }}>🪙 Gold: </span>
                    {chartType === 'candle'
                        ? <span className="text-gray-600">O:{$(d.gold_open)} H:{$(d.gold_high)} L:{$(d.gold_low)} C:{$(d.gold_close)}</span>
                        : <span className="font-bold text-gray-800">{$(d.gold_usd)}</span>}
                </div>
            )}
            {(metal === 'silver' || metal === 'both') && (
                <div>
                    <span className="font-semibold" style={{ color: SILVER_C }}>🥈 Silver: </span>
                    {chartType === 'candle'
                        ? <span className="text-gray-600">O:{$(d.silver_open)} H:{$(d.silver_high)} L:{$(d.silver_low)} C:{$(d.silver_close)}</span>
                        : <span className="font-bold text-gray-800">{$(d.silver_usd)}</span>}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function MetalPriceChart({ id, metal, title }: Props) {
    const [rawData, setRawData] = useState<RawRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState<ChartType>('area');
    const [preset, setPreset] = useState<Preset>('10Y');
    const [rangeStart, setRangeStart] = useState(0);
    const [rangeEnd, setRangeEnd] = useState(1);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<'start' | 'end' | 'bar' | null>(null);
    const dragOrigin = useRef({ x: 0, s: 0, e: 1 });

    // Fetch once, share across instances
    useEffect(() => {
        fetchAllData().then(data => {
            if (data.length > 0) {
                setRawData(data);
            } else {
                setError('Could not load price data');
            }
            setLoading(false);
        });
    }, []);

    // Reset slider when preset changes
    useEffect(() => { setRangeStart(0); setRangeEnd(1); }, [preset]);

    // Processed data
    const filtered = useMemo(() => filterByPreset(rawData, preset), [rawData, preset]);
    const lineData = useMemo(() => toDataPoints(filtered), [filtered]);
    const candleDataAll = useMemo(() => toCandles(lineData), [lineData]);

    const displayData = useMemo(() => {
        const src = chartType === 'candle' ? candleDataAll : lineData;
        const len = src.length;
        if (len === 0) return [];
        const s = Math.max(0, Math.floor(rangeStart * len));
        const e = Math.min(len, Math.ceil(rangeEnd * len));
        return src.slice(s, e);
    }, [lineData, candleDataAll, chartType, rangeStart, rangeEnd]);

    // Slider date labels
    const dateLabels = useMemo(() => {
        if (!lineData.length) return { s: '', e: '' };
        const len = lineData.length;
        const si = Math.min(Math.floor(rangeStart * len), len - 1);
        const ei = Math.min(Math.floor(rangeEnd * (len - 1)), len - 1);
        const f = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return { s: f(lineData[Math.max(0, si)].date), e: f(lineData[ei].date) };
    }, [lineData, rangeStart, rangeEnd]);

    // ── Drag handlers ───────────────────────────────────────────────────────
    const getSliderPos = useCallback((ev: React.MouseEvent | React.TouchEvent) => {
        if (!sliderRef.current) return 0;
        const rect = sliderRef.current.getBoundingClientRect();
        const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
        return Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
    }, []);

    const onDragStart = useCallback((who: 'start' | 'end' | 'bar', ev: React.MouseEvent | React.TouchEvent) => {
        ev.preventDefault();
        dragging.current = who;
        dragOrigin.current = { x: getSliderPos(ev), s: rangeStart, e: rangeEnd };
    }, [getSliderPos, rangeStart, rangeEnd]);

    useEffect(() => {
        const move = (ev: MouseEvent | TouchEvent) => {
            if (!dragging.current || !sliderRef.current) return;
            const rect = sliderRef.current.getBoundingClientRect();
            const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
            const x = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
            const dx = x - dragOrigin.current.x;
            const { s, e } = dragOrigin.current;
            if (dragging.current === 'start') {
                setRangeStart(Math.max(0, Math.min(rangeEnd - 0.02, s + dx)));
            } else if (dragging.current === 'end') {
                setRangeEnd(Math.min(1, Math.max(rangeStart + 0.02, e + dx)));
            } else {
                const w = e - s;
                let ns = s + dx, ne = e + dx;
                if (ns < 0) { ns = 0; ne = w; }
                if (ne > 1) { ne = 1; ns = 1 - w; }
                setRangeStart(ns); setRangeEnd(ne);
            }
        };
        const up = () => { dragging.current = null; };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        };
    }, [rangeStart, rangeEnd]);

    // ── Render states ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div id={id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 text-sm animate-pulse">Loading {title}...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !rawData.length) {
        return (
            <div id={id} className="bg-white rounded-2xl shadow-md border border-red-200 p-6">
                <h3 className="text-lg font-display font-bold text-gray-900 mb-2">{title}</h3>
                <div className="h-[200px] flex items-center justify-center text-red-500 text-sm">
                    ⚠️ {error || 'No data available'} — Please refresh the page.
                </div>
            </div>
        );
    }

    // ── Main render ─────────────────────────────────────────────────────────
    return (
        <div id={id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            {/* Header row */}
            <div className="flex flex-col gap-3 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-display font-bold text-gray-900">{title}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {(['area', 'line', 'candle'] as ChartType[]).map(ct => (
                            <button key={ct} onClick={() => setChartType(ct)}
                                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${chartType === ct
                                    ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                {ct === 'candle' ? '📊 Candle' : ct === 'area' ? '📈 Area' : '📉 Line'}
                            </button>
                        ))}
                        <span className="w-px h-5 bg-gray-200 mx-0.5" />
                        {PRESETS.map(p => (
                            <button key={p} onClick={() => setPreset(p)}
                                className={`text-xs px-2 py-1.5 rounded-lg font-medium transition ${preset === p
                                    ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>📅 {dateLabels.s} → {dateLabels.e} &nbsp;|&nbsp; {displayData.length} points</span>
                    <span className="font-medium">USD per troy ounce</span>
                </div>
            </div>

            {/* Chart - explicit min-height to ensure ResponsiveContainer works */}
            <div style={{ width: '100%', height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gg-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={GOLD_C} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={GOLD_C} stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={SILVER_C} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={SILVER_C} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />

                        {metal !== 'silver' && (
                            <YAxis yAxisId="left" tick={{ fontSize: 10 }}
                                tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`}
                                domain={['auto', 'auto']} />
                        )}
                        {(metal === 'silver' || metal === 'both') && (
                            <YAxis yAxisId="right" orientation={metal === 'both' ? 'right' : 'left'}
                                tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v}`} domain={['auto', 'auto']} />
                        )}

                        <Tooltip content={<CustomTooltip chartType={chartType} metal={metal} />} />
                        <Legend formatter={(v: string) => v === 'gold_usd' ? '🪙 Gold (USD/oz)' : '🥈 Silver (USD/oz)'} />

                        {/* Area */}
                        {chartType === 'area' && (metal === 'gold' || metal === 'both') && (
                            <Area yAxisId="left" type="monotone" dataKey="gold_usd" name="gold_usd"
                                stroke={GOLD_C} strokeWidth={2} fill={`url(#gg-${id})`} dot={false}
                                activeDot={{ r: 4, stroke: GOLD_C }} animationDuration={600} />
                        )}
                        {chartType === 'area' && (metal === 'silver' || metal === 'both') && (
                            <Area yAxisId="right" type="monotone" dataKey="silver_usd" name="silver_usd"
                                stroke={SILVER_C} strokeWidth={2} fill={`url(#sg-${id})`} dot={false}
                                activeDot={{ r: 4, stroke: SILVER_C }} animationDuration={600} />
                        )}

                        {/* Line */}
                        {chartType === 'line' && (metal === 'gold' || metal === 'both') && (
                            <Line yAxisId="left" type="monotone" dataKey="gold_usd" name="gold_usd"
                                stroke={GOLD_C} strokeWidth={2.5} dot={false}
                                activeDot={{ r: 5, stroke: GOLD_C, fill: '#fff' }} animationDuration={600} />
                        )}
                        {chartType === 'line' && (metal === 'silver' || metal === 'both') && (
                            <Line yAxisId="right" type="monotone" dataKey="silver_usd" name="silver_usd"
                                stroke={SILVER_C} strokeWidth={2.5} dot={false}
                                activeDot={{ r: 5, stroke: SILVER_C, fill: '#fff' }} animationDuration={600} />
                        )}

                        {/* Candle */}
                        {chartType === 'candle' && (metal === 'gold' || metal === 'both') && (
                            <Bar yAxisId="left" dataKey="gold_high" name="gold_usd" fill="transparent"
                                shape={<CandleShape metalKey="gold" />} isAnimationActive={false} />
                        )}
                        {chartType === 'candle' && (metal === 'silver' || metal === 'both') && (
                            <Bar yAxisId="right" dataKey="silver_high" name="silver_usd" fill="transparent"
                                shape={<CandleShape metalKey="silver" />} isAnimationActive={false} />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Range slider */}
            <div className="mt-4 px-1">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>🔎 Drag handles to filter date range</span>
                    <button onClick={() => { setRangeStart(0); setRangeEnd(1); }}
                        className="text-primary-600 hover:underline font-medium">Reset</button>
                </div>
                <div ref={sliderRef}
                    className="relative bg-gray-100 rounded-xl overflow-hidden select-none touch-none border border-gray-200"
                    style={{ height: 44 }}>
                    {/* Sparkline */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none"
                        viewBox={`0 0 ${lineData.length || 1} 100`}>
                        {lineData.length > 1 && (() => {
                            const k = metal !== 'silver' ? 'gold_usd' : 'silver_usd';
                            const vs = lineData.map(d => (d as any)[k] as number);
                            const mn = Math.min(...vs), mx = Math.max(...vs), rng = mx - mn || 1;
                            const pts = vs.map((v, i) => `${i},${92 - ((v - mn) / rng) * 80}`).join(' ');
                            return <polyline points={pts} fill="none"
                                stroke={metal !== 'silver' ? GOLD_C : SILVER_C} strokeWidth="1.5" opacity={0.45} />;
                        })()}
                    </svg>
                    {/* Dimmed areas */}
                    <div className="absolute inset-y-0 left-0 bg-gray-400/30" style={{ width: `${rangeStart * 100}%` }} />
                    <div className="absolute inset-y-0 right-0 bg-gray-400/30" style={{ width: `${(1 - rangeEnd) * 100}%` }} />
                    {/* Active bar */}
                    <div className="absolute inset-y-0 bg-primary-500/10 border-y-2 border-primary-400/50 cursor-grab active:cursor-grabbing"
                        style={{ left: `${rangeStart * 100}%`, width: `${(rangeEnd - rangeStart) * 100}%` }}
                        onMouseDown={e => onDragStart('bar', e)} onTouchStart={e => onDragStart('bar', e)} />
                    {/* Handles */}
                    {['start', 'end'].map(side => (
                        <div key={side}
                            className="absolute inset-y-0 w-5 cursor-ew-resize z-10 flex items-center justify-center group"
                            style={{ left: `calc(${(side === 'start' ? rangeStart : rangeEnd) * 100}% - 10px)` }}
                            onMouseDown={e => onDragStart(side as 'start' | 'end', e)}
                            onTouchStart={e => onDragStart(side as 'start' | 'end', e)}>
                            <div className="w-2 h-8 bg-primary-600 rounded-full shadow-lg group-hover:bg-primary-700 group-hover:scale-110 transition" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium px-1">
                    <span>{dateLabels.s}</span>
                    <span>{dateLabels.e}</span>
                </div>
            </div>
        </div>
    );
}
