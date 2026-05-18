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

type Tab = 'interest' | 'principal' | 'rate' | 'time';

interface SIProps {
  initialSI?: number;
  initialTotal?: number;
}

export default function SimpleInterestCalculatorClient({
  initialSI = 24000,
  initialTotal = 124000,
}: SIProps) {
  const [tab, setTab] = useState<Tab>('interest');
  const [showCI, setShowCI] = useState(false);

  // "Find Interest" inputs
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(3);

  // "Find Principal" inputs
  const [fpSI, setFpSI] = useState(24000);
  const [fpRate, setFpRate] = useState(8);
  const [fpTime, setFpTime] = useState(3);

  // "Find Rate" inputs
  const [frSI, setFrSI] = useState(24000);
  const [frPrincipal, setFrPrincipal] = useState(100000);
  const [frTime, setFrTime] = useState(3);

  // "Find Time" inputs
  const [ftSI, setFtSI] = useState(24000);
  const [ftPrincipal, setFtPrincipal] = useState(100000);
  const [ftRate, setFtRate] = useState(8);

  // Outputs seeded from SSR
  const [si, setSi] = useState(initialSI);
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    if (tab === 'interest') {
      const v = (principal * rate * time) / 100;
      setSi(v);
      setTotal(principal + v);
    }
  }, [principal, rate, time, tab]);

  // Reverse results (computed inline — no state needed)
  const foundPrincipal = fpRate > 0 && fpTime > 0 ? (fpSI * 100) / (fpRate * fpTime) : 0;
  const foundRate = frPrincipal > 0 && frTime > 0 ? (frSI * 100) / (frPrincipal * frTime) : 0;
  const foundTime = ftPrincipal > 0 && ftRate > 0 ? (ftSI * 100) / (ftPrincipal * ftRate) : 0;

  // CI for comparison
  const ciTotal = principal * Math.pow(1 + rate / 100, time);
  const ciInterest = ciTotal - principal;
  const ciDiff = ciInterest - si;

  // Year-wise breakdown
  const yearRows = useMemo(() => {
    const annualSI = (principal * rate) / 100;
    return Array.from({ length: time }, (_, i) => ({
      year: i + 1,
      yearlyInterest: annualSI,
      cumInterest: annualSI * (i + 1),
      totalAmt: principal + annualSI * (i + 1),
    }));
  }, [principal, rate, time]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'interest', label: 'Find SI' },
    { id: 'principal', label: 'Find Principal' },
    { id: 'rate', label: 'Find Rate' },
    { id: 'time', label: 'Find Time' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Simple Interest Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-xl shadow-lg shadow-teal-200 flex-shrink-0">📐</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Simple Interest Calculator (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate SI instantly. Find interest, or reverse-calculate principal, rate, or time.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-teal-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" /></span>
          ₹1,00,000 @ 8% for 3 years → Interest: ₹24,000 | Total: ₹1,24,000
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200 mb-5 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 min-w-max px-3 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">

              {tab === 'interest' && (
                <>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Loan / Deposit Details</h2>
                  <SIPSlider label="Principal Amount (P)" value={principal} min={10000} max={5000000} step={10000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={fmtShort} />
                  <SIPSlider label="Annual Interest Rate (R)" value={rate} min={1} max={30} step={0.5} suffix="%" color="emerald" onChange={setRate} formatDisplay={(v) => `${v}%`} />
                  <SIPSlider label="Time Period (T)" value={time} min={1} max={30} step={1} suffix=" yrs" color="amber" onChange={setTime} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
                  <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 font-mono text-sm text-gray-700">SI = ({fmtShort(principal)} × {rate} × {time}) / 100</div>
                </>
              )}

              {tab === 'principal' && (
                <>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Find Principal</h2>
                  <p className="text-xs text-gray-500">P = (SI × 100) / (R × T)</p>
                  <SIPSlider label="Simple Interest earned (SI)" value={fpSI} min={100} max={500000} step={100} prefix="₹" color="emerald" onChange={setFpSI} formatDisplay={fmtShort} />
                  <SIPSlider label="Annual Rate (R)" value={fpRate} min={1} max={30} step={0.5} suffix="%" color="blue" onChange={setFpRate} formatDisplay={(v) => `${v}%`} />
                  <SIPSlider label="Time Period (T)" value={fpTime} min={1} max={30} step={1} suffix=" yrs" color="amber" onChange={setFpTime} formatDisplay={(v) => `${v} yr${v > 1 ? 's' : ''}`} />
                </>
              )}

              {tab === 'rate' && (
                <>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Find Rate</h2>
                  <p className="text-xs text-gray-500">R = (SI × 100) / (P × T)</p>
                  <SIPSlider label="Simple Interest earned (SI)" value={frSI} min={100} max={500000} step={100} prefix="₹" color="emerald" onChange={setFrSI} formatDisplay={fmtShort} />
                  <SIPSlider label="Principal (P)" value={frPrincipal} min={10000} max={5000000} step={10000} prefix="₹" color="blue" onChange={setFrPrincipal} formatDisplay={fmtShort} />
                  <SIPSlider label="Time Period (T)" value={frTime} min={1} max={30} step={1} suffix=" yrs" color="amber" onChange={setFrTime} formatDisplay={(v) => `${v} yr${v > 1 ? 's' : ''}`} />
                </>
              )}

              {tab === 'time' && (
                <>
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Find Time</h2>
                  <p className="text-xs text-gray-500">T = (SI × 100) / (P × R)</p>
                  <SIPSlider label="Simple Interest earned (SI)" value={ftSI} min={100} max={500000} step={100} prefix="₹" color="emerald" onChange={setFtSI} formatDisplay={fmtShort} />
                  <SIPSlider label="Principal (P)" value={ftPrincipal} min={10000} max={5000000} step={10000} prefix="₹" color="blue" onChange={setFtPrincipal} formatDisplay={fmtShort} />
                  <SIPSlider label="Annual Rate (R)" value={ftRate} min={1} max={30} step={0.5} suffix="%" color="amber" onChange={setFtRate} formatDisplay={(v) => `${v}%`} />
                </>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* Main result */}
            {tab === 'interest' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Principal Amount</span><span className="text-sm font-bold text-gray-800">{fmt(principal)}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Interest Earned</span><span className="text-sm font-bold text-emerald-600">{fmt(Math.round(si))}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Amount</span><span className="text-lg font-extrabold text-gray-900">{fmt(Math.round(total))}</span></div>
                  </div>
                </div>

                {/* Year-wise breakdown */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 md:px-5 py-3.5 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Year-wise Breakdown</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['Year', 'Interest (Year)', 'Cumulative Interest', 'Total Amount'].map((h) => <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {yearRows.map((r) => (
                          <tr key={r.year} className="border-b border-gray-50 hover:bg-teal-50/20">
                            <td className="px-3 py-2.5 font-medium text-gray-700">{r.year}</td>
                            <td className="px-3 py-2.5 text-emerald-600">{fmt(Math.round(r.yearlyInterest))}</td>
                            <td className="px-3 py-2.5 text-gray-700">{fmt(Math.round(r.cumInterest))}</td>
                            <td className="px-3 py-2.5 font-semibold text-teal-700">{fmt(Math.round(r.totalAmt))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SI vs CI comparison */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <button onClick={() => setShowCI(!showCI)} className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 text-left">
                    <span className="text-sm font-bold text-gray-900">📊 Compare with Compound Interest</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showCI ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showCI && (
                    <div className="border-t border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600"> </th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-teal-700">Simple Interest</th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-blue-700">Compound Interest</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-gray-50">
                              <td className="px-4 py-2.5 text-xs text-gray-500">Interest</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-teal-700">{fmt(Math.round(si))}</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-blue-700">{fmt(Math.round(ciInterest))}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                              <td className="px-4 py-2.5 text-xs text-gray-500">Total Amount</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-teal-700">{fmt(Math.round(total))}</td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-blue-700">{fmt(Math.round(ciTotal))}</td>
                            </tr>
                            <tr className="bg-blue-50/30">
                              <td className="px-4 py-2.5 text-xs text-gray-500">Difference</td>
                              <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                              <td className="px-4 py-2.5 text-sm font-bold text-blue-700">+{fmt(Math.round(ciDiff))} with CI</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Reverse results */}
            {tab === 'principal' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Simple Interest (given)</span><span className="text-sm font-bold text-gray-800">{fmt(fpSI)}</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Rate × Time</span><span className="text-sm font-bold text-gray-700">{fpRate}% × {fpTime} yr = {fpRate * fpTime}</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-teal-50"><span className="text-base font-semibold text-gray-900">Principal (P)</span><span className="text-lg font-extrabold text-teal-700">{fmt(Math.round(foundPrincipal))}</span></div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100"><p className="text-xs text-gray-500 font-mono">P = ({fmt(fpSI)} × 100) / ({fpRate} × {fpTime}) = {fmt(Math.round(foundPrincipal))}</p></div>
              </div>
            )}

            {tab === 'rate' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Simple Interest (given)</span><span className="text-sm font-bold text-gray-800">{fmt(frSI)}</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Principal × Time</span><span className="text-sm font-bold text-gray-700">{fmtShort(frPrincipal)} × {frTime} yr</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-teal-50"><span className="text-base font-semibold text-gray-900">Annual Rate (R)</span><span className="text-lg font-extrabold text-teal-700">{foundRate.toFixed(2)}%</span></div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100"><p className="text-xs text-gray-500 font-mono">R = ({fmt(frSI)} × 100) / ({fmtShort(frPrincipal)} × {frTime}) = {foundRate.toFixed(2)}%</p></div>
              </div>
            )}

            {tab === 'time' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Simple Interest (given)</span><span className="text-sm font-bold text-gray-800">{fmt(ftSI)}</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Principal × Rate</span><span className="text-sm font-bold text-gray-700">{fmtShort(ftPrincipal)} × {ftRate}%</span></div>
                  <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-teal-50"><span className="text-base font-semibold text-gray-900">Time Period (T)</span><span className="text-lg font-extrabold text-teal-700">{foundTime.toFixed(2)} years</span></div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100"><p className="text-xs text-gray-500 font-mono">T = ({fmt(ftSI)} × 100) / ({fmtShort(ftPrincipal)} × {ftRate}) = {foundTime.toFixed(2)} years</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
