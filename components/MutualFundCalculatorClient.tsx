'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtShort = (v: number) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)} L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
};

function sipFV(p: number, annualRate: number, years: number) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
function lsumFV(p: number, annualRate: number, years: number) {
  return p * Math.pow(1 + annualRate / 100, years);
}

const PRESETS = [
  { label: 'Debt Fund', rate: 7, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { label: 'Hybrid Fund', rate: 11, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { label: 'Equity Fund', rate: 14, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { label: 'ELSS / Tax Saver', rate: 13, color: 'text-purple-700 bg-purple-50 border-purple-200' },
];

interface MFProps {
  initialInvested?: number;
  initialReturns?: number;
  initialTotal?: number;
}

export default function MutualFundCalculatorClient({
  initialInvested = 1200000,
  initialReturns = 1123391,
  initialTotal = 2323391,
}: MFProps) {
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [showComparison, setShowComparison] = useState(false);

  // Seeded with SSR defaults
  const [investedAmount, setInvestedAmount] = useState(initialInvested);
  const [estimatedReturns, setEstimatedReturns] = useState(initialReturns);
  const [totalValue, setTotalValue] = useState(initialTotal);

  useEffect(() => {
    if (investmentType === 'sip') {
      const fv = sipFV(amount, expectedReturn, timePeriod);
      const invested = amount * timePeriod * 12;
      setInvestedAmount(invested);
      setEstimatedReturns(fv - invested);
      setTotalValue(fv);
    } else {
      const fv = lsumFV(amount, expectedReturn, timePeriod);
      setInvestedAmount(amount);
      setEstimatedReturns(fv - amount);
      setTotalValue(fv);
    }
  }, [investmentType, amount, expectedReturn, timePeriod]);

  // Absolute return %
  const absReturn = investedAmount > 0 ? ((estimatedReturns) / investedAmount) * 100 : 0;

  // Year-wise rows
  const yearRows = useMemo(() => {
    const rows = [];
    for (let y = 1; y <= timePeriod; y++) {
      if (investmentType === 'sip') {
        const fv = sipFV(amount, expectedReturn, y);
        const inv = amount * y * 12;
        rows.push({ year: y, invested: inv, returns: fv - inv, total: fv });
      } else {
        const fv = lsumFV(amount, expectedReturn, y);
        rows.push({ year: y, invested: amount, returns: fv - amount, total: fv });
      }
    }
    return rows;
  }, [investmentType, amount, expectedReturn, timePeriod]);

  // SIP vs Lumpsum comparison (same invested amount, same rate, same time)
  const sipTotalComparison = sipFV(amount, expectedReturn, timePeriod);
  const lumpsumPrincipal = amount * timePeriod * 12;
  const lumpsumTotalComparison = lsumFV(lumpsumPrincipal, expectedReturn, timePeriod);
  const lumpsumReturnsComparison = lumpsumTotalComparison - lumpsumPrincipal;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Mutual Fund Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-200 flex-shrink-0">📊</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Mutual Fund Calculator (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">SIP &amp; Lumpsum return calculator — with year-wise growth, fund presets, and tax guide.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          SIP ₹10,000/mo @ 12% for 10 yrs → Total ₹23,23,391 | Returns: ₹11,23,391
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Investment Details</h2>

              {/* SIP / Lumpsum toggle */}
              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Investment Type</span>
                <div className="flex gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {(['sip', 'lumpsum'] as const).map((t) => (
                    <button key={t} onClick={() => { setInvestmentType(t); setAmount(t === 'sip' ? 10000 : 100000); }} className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${investmentType === t ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500'}`}>
                      {t === 'sip' ? 'SIP (Monthly)' : 'Lumpsum'}
                    </button>
                  ))}
                </div>
              </div>

              <SIPSlider label={investmentType === 'sip' ? 'Monthly Investment' : 'Lumpsum Amount'} value={amount} min={investmentType === 'sip' ? 500 : 10000} max={investmentType === 'sip' ? 100000 : 10000000} step={investmentType === 'sip' ? 500 : 10000} prefix="₹" color="blue" onChange={setAmount} formatDisplay={fmtShort} />

              {/* Fund type presets */}
              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Fund Type Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => setExpectedReturn(p.rate)} className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all ${expectedReturn === p.rate ? p.color + ' ring-1 ring-offset-1' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      {p.label} — {p.rate}%
                    </button>
                  ))}
                </div>
              </div>

              <SIPSlider label="Expected Return (p.a.)" value={expectedReturn} min={1} max={30} step={0.5} suffix="%" color="emerald" onChange={setExpectedReturn} formatDisplay={(v) => `${v}%`} />
              <SIPSlider label="Time Period" value={timePeriod} min={1} max={40} step={1} suffix=" yrs" color="amber" onChange={setTimePeriod} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />

              <div className="hidden lg:block pt-4 border-t border-gray-100 space-y-1.5">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">📈 Historical Return Ranges</h4>
                {[['Equity Funds', '12–15%', 'text-emerald-600'], ['Hybrid Funds', '10–12%', 'text-amber-600'], ['Debt Funds', '7–9%', 'text-blue-600']].map(([l, r, c]) => (
                  <div key={l} className="flex justify-between text-xs"><span className="text-gray-500">{l}</span><span className={`font-semibold ${c}`}>{r}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* Main outputs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Invested Amount</span><span className="text-sm font-bold text-gray-800">{fmt(Math.round(investedAmount))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Est. Returns</span><span className="text-sm font-bold text-emerald-600">{fmt(Math.round(estimatedReturns))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Value</span><span className="text-lg font-extrabold text-gray-900">{fmt(Math.round(totalValue))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-2.5 bg-emerald-50/40">
                  <span className="text-xs text-gray-500">Absolute Return (over {timePeriod} years)</span>
                  <span className="text-xs font-bold text-emerald-700">{absReturn.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Year-wise table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 py-3.5 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Year-wise Growth Table</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Year', 'Invested So Far', 'Est. Returns', 'Total Value'].map((h) => <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {yearRows.map((r) => (
                      <tr key={r.year} className={`border-b border-gray-50 hover:bg-emerald-50/20 ${r.year === timePeriod ? 'bg-emerald-50/40 font-semibold' : ''}`}>
                        <td className="px-3 py-2.5 text-gray-700">{r.year}</td>
                        <td className="px-3 py-2.5 text-gray-700">{fmt(Math.round(r.invested))}</td>
                        <td className="px-3 py-2.5 text-emerald-600">{fmt(Math.round(r.returns))}</td>
                        <td className="px-3 py-2.5 font-semibold text-gray-900">{fmt(Math.round(r.total))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIP vs Lumpsum comparison */}
            {investmentType === 'sip' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <button onClick={() => setShowComparison(!showComparison)} className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 text-left">
                  <span className="text-sm font-bold text-gray-900">📊 Compare SIP vs Lumpsum</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showComparison ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showComparison && (
                  <div className="border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500"> </th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-700">SIP ({fmt(amount)}/mo)</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-blue-700">Lumpsum ({fmtShort(lumpsumPrincipal)})</th>
                        </tr></thead>
                        <tbody>
                          {[
                            ['Invested Amount', fmt(Math.round(investedAmount)), fmt(Math.round(lumpsumPrincipal))],
                            ['Est. Returns', fmt(Math.round(estimatedReturns)), fmt(Math.round(lumpsumReturnsComparison))],
                            ['Total Value', fmt(Math.round(totalValue)), fmt(Math.round(lumpsumTotalComparison))],
                            ['Advantage', 'Affordable monthly', 'Higher absolute return'],
                          ].map(([label, sipVal, lsVal], i) => (
                            <tr key={i} className="border-b border-gray-50">
                              <td className="px-4 py-2.5 text-xs text-gray-500">{label}</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-emerald-700">{sipVal}</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-blue-700">{lsVal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100"><p className="text-xs text-gray-500">Lumpsum earns more if invested at the start. SIP reduces timing risk through rupee cost averaging.</p></div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><p className="text-xs md:text-sm text-gray-600 leading-relaxed"><strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. Past performance does not guarantee future returns. This calculator provides illustrative estimates only. Consult your financial advisor before investing.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
