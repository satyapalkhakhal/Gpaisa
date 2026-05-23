'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtL = (v: number) => { if (v >= 10000000) return `₹${(v/10000000).toFixed(1)} Cr`; if (v >= 100000) return `₹${(v/100000).toFixed(1)} L`; return `₹${v.toLocaleString('en-IN')}`; };
function calcEMI(p: number, r: number, n: number) { if (r === 0) return Math.round(p / n); const mr = r / 1200; return Math.round((p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)); }

interface Props { initialEmi: number; initialTotalInterest: number; initialTotalAmount: number; initialPayoffDate: string; initialInterestPercent: string; }

export default function CarLoanCalculatorClient({ initialEmi, initialTotalInterest, initialTotalAmount, initialPayoffDate, initialInterestPercent }: Props) {
  const [loanAmount, setLoanAmount] = useState(800000);
  const [rate, setRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [tenureMode, setTenureMode] = useState<'years'|'months'>('years');
  const [tenureMonths, setTenureMonths] = useState(60);
  const [loanType, setLoanType] = useState<'new'|'used'>('new');
  const [downPaymentPct, setDownPaymentPct] = useState(0);
  const [prepayAmount, setPrepayAmount] = useState(100000);
  const [prepayAfterMonths, setPrepayAfterMonths] = useState(12);
  const [prepayMode, setPrepayMode] = useState<'tenure'|'emi'>('tenure');

  const effectiveRate = loanType === 'used' ? rate + 1.5 : rate;
  const onRoadPrice = downPaymentPct > 0 ? Math.round(loanAmount / (1 - downPaymentPct / 100)) : loanAmount;
  const downPayment = onRoadPrice - loanAmount;
  const months = tenureMode === 'years' ? tenureYears * 12 : tenureMonths;
  const emi = useMemo(() => calcEMI(loanAmount, effectiveRate, months), [loanAmount, effectiveRate, months]);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;
  const interestPct = loanAmount > 0 ? ((totalInterest / loanAmount) * 100).toFixed(1) : '0';
  const principalPct = totalAmount > 0 ? ((loanAmount / totalAmount) * 100) : 100;
  const payoffDate = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() + months); return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); }, [months]);

  useEffect(() => { if (tenureMode === 'years') setTenureMonths(tenureYears * 12); }, [tenureYears, tenureMode]);

  const amortisation = useMemo(() => {
    const sched: { year: number; opening: number; emiPaid: number; principal: number; interest: number; closing: number }[] = [];
    let bal = loanAmount; const mr = effectiveRate / 1200;
    for (let y = 1; y <= Math.ceil(months / 12); y++) {
      const op = Math.round(bal); let yP = 0, yI = 0;
      const mInY = Math.min(12, months - (y - 1) * 12);
      for (let m = 0; m < mInY; m++) { const ip = bal * mr; yI += ip; yP += emi - ip; bal -= (emi - ip); }
      if (bal < 0) bal = 0;
      sched.push({ year: y, opening: op, emiPaid: Math.round(emi * mInY), principal: Math.round(yP), interest: Math.round(yI), closing: Math.round(bal) });
    }
    return sched;
  }, [loanAmount, effectiveRate, months, emi]);

  const prepayResult = useMemo(() => {
    const mr = effectiveRate / 1200; let bal = loanAmount;
    for (let m = 0; m < prepayAfterMonths && m < months; m++) { bal -= (emi - bal * mr); }
    const afterPrepay = Math.max(0, bal - prepayAmount);
    if (afterPrepay <= 0) return { interestSaved: totalInterest, monthsSaved: months - prepayAfterMonths, newPayoff: 'Loan closed', newEmi: 0 };
    const remBefore = months - prepayAfterMonths;
    if (prepayMode === 'tenure') {
      if (mr === 0) { const nm = Math.ceil(afterPrepay / emi); return { interestSaved: 0, monthsSaved: remBefore - nm, newPayoff: (() => { const d = new Date(); d.setMonth(d.getMonth() + prepayAfterMonths + nm); return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); })(), newEmi: 0 }; }
      const nm = Math.ceil(Math.log(emi / (emi - afterPrepay * mr)) / Math.log(1 + mr));
      const iSaved = Math.round((emi * remBefore - bal) - (emi * nm - afterPrepay));
      const d = new Date(); d.setMonth(d.getMonth() + prepayAfterMonths + nm);
      return { interestSaved: Math.max(0, iSaved), monthsSaved: Math.max(0, remBefore - nm), newPayoff: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), newEmi: 0 };
    } else {
      const ne = calcEMI(afterPrepay, effectiveRate, remBefore);
      const iSaved = Math.round((emi * remBefore - bal) - (ne * remBefore - afterPrepay));
      return { interestSaved: Math.max(0, iSaved), monthsSaved: 0, newPayoff: payoffDate, newEmi: ne };
    }
  }, [loanAmount, effectiveRate, months, emi, prepayAmount, prepayAfterMonths, prepayMode, totalInterest, payoffDate]);

  const R = 70, C = 2 * Math.PI * R, pArc = (principalPct / 100) * C;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Car Loan Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-200 flex-shrink-0">🚗</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Car Loan EMI Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate car loan EMI, compare bank rates, view amortisation schedule &amp; prepayment savings.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-blue-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>
          ₹8L at 9.5% for 5 yrs → ₹{initialEmi.toLocaleString('en-IN')}/month EMI
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Loan Details</h2>
              <div className="mb-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Loan Type</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {(['new','used'] as const).map(t => (<button key={t} onClick={() => setLoanType(t)} className={`sip-touch-target flex-1 px-2.5 py-2 rounded-md text-xs font-bold transition-all ${loanType === t ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500'}`}>{t === 'new' ? '🚘 New Car' : '🚙 Used Car'}</button>))}
                </div>
                {loanType === 'used' && <p className="text-[11px] text-amber-600 mt-1.5">Used car loans are typically 1.5–2% higher than new car loans</p>}
              </div>
              <div className="space-y-5">
                <SIPSlider label="Loan Amount" value={loanAmount} min={100000} max={5000000} step={50000} prefix="₹" color="blue" onChange={setLoanAmount} formatDisplay={fmtL} />
                <SIPSlider label={`Interest Rate (${effectiveRate.toFixed(2)}% p.a.)`} value={rate} min={7} max={18} step={0.05} suffix="%" color="emerald" onChange={setRate} formatDisplay={v => `${v.toFixed(2)}%`} />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Tenure</span>
                    <div className="flex gap-1 bg-gray-50 p-0.5 rounded-md border border-gray-100">
                      {(['years','months'] as const).map(m => (<button key={m} onClick={() => setTenureMode(m)} className={`px-2 py-1 rounded text-[11px] font-bold capitalize ${tenureMode === m ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-400'}`}>{m}</button>))}
                    </div>
                  </div>
                  {tenureMode === 'years' ? <SIPSlider label="" value={tenureYears} min={1} max={8} step={1} suffix=" yrs" color="amber" onChange={setTenureYears} formatDisplay={v => `${v} year${v>1?'s':''}`} /> : <SIPSlider label="" value={tenureMonths} min={12} max={96} step={1} suffix=" mo" color="amber" onChange={setTenureMonths} formatDisplay={v => `${v} months`} />}
                </div>
                <SIPSlider label="Down Payment" value={downPaymentPct} min={0} max={40} step={5} suffix="%" color="blue" onChange={setDownPaymentPct} formatDisplay={v => `${v}%`} />
              </div>
              {downPaymentPct > 0 && (<div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1"><p>On-road price: <strong>{fmt(onRoadPrice)}</strong></p><p>Down payment: <strong>{fmt(downPayment)}</strong></p><p>Loan amount: <strong>{fmt(loanAmount)}</strong></p></div>)}
              <p className="text-[11px] text-gray-400 mt-3 italic">Your rate depends on credit score &amp; bank</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50"><span className="text-base font-semibold text-gray-900">Monthly EMI</span><span className="text-2xl font-extrabold text-blue-700">{fmt(emi)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Interest</span><span className="text-sm font-bold text-red-500">{fmt(totalInterest)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Payment</span><span className="text-sm font-bold text-gray-800">{fmt(totalAmount)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Loan Payoff Date</span><span className="text-sm font-bold text-emerald-600">{payoffDate}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Interest % of Principal</span><span className="text-sm font-bold text-amber-600">{interestPct}% of principal</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">Principal vs Interest Split</h3>
              <div className="flex items-center justify-center gap-8">
                <svg width="170" height="170" viewBox="0 0 170 170"><circle cx="85" cy="85" r={R} fill="none" stroke="#fee2e2" strokeWidth="18" /><circle cx="85" cy="85" r={R} fill="none" stroke="#3b82f6" strokeWidth="18" strokeDasharray={`${pArc} ${C}`} strokeDashoffset={C/4} strokeLinecap="round" className="transition-all duration-500" /><text x="85" y="80" textAnchor="middle" className="fill-gray-900 text-lg font-bold">{fmt(emi)}</text><text x="85" y="98" textAnchor="middle" className="fill-gray-400 text-[11px]">per month</text></svg>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><div><p className="text-xs text-gray-500">Principal</p><p className="text-sm font-bold text-gray-900">{fmt(loanAmount)}</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-200" /><div><p className="text-xs text-gray-500">Interest</p><p className="text-sm font-bold text-red-500">{fmt(totalInterest)}</p></div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 pt-4 pb-2"><h3 className="text-base font-bold text-gray-900">Year-wise Amortisation Schedule</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="bg-gray-50">{['Year','Opening Balance','EMI Paid','Principal','Interest','Closing Balance'].map((h,i) => (<th key={i} className={`px-3 py-2.5 text-xs font-semibold text-gray-600 ${i>0?'text-right':'text-left'}`}>{h}</th>))}</tr></thead>
                <tbody>{amortisation.map((r,i) => (<tr key={i} className="hover:bg-blue-50/30 border-b border-gray-50"><td className="px-3 py-2.5 font-semibold text-gray-800">Year {r.year}</td><td className="px-3 py-2.5 text-right text-gray-700">{fmt(r.opening)}</td><td className="px-3 py-2.5 text-right text-gray-700">{fmt(r.emiPaid)}</td><td className="px-3 py-2.5 text-right text-blue-700 font-semibold">{fmt(r.principal)}</td><td className="px-3 py-2.5 text-right text-red-500">{fmt(r.interest)}</td><td className="px-3 py-2.5 text-right font-bold text-gray-900">{fmt(r.closing)}</td></tr>))}</tbody></table>
              </div>
              <p className="px-4 py-3 text-xs text-gray-400 italic border-t border-gray-50">Showing schedule for {fmtL(loanAmount)} at {effectiveRate.toFixed(2)}% for {tenureMode==='years'?`${tenureYears} years`:`${tenureMonths} months`}.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 pb-2"><h3 className="text-base font-bold text-gray-900">Prepayment Simulator — How Much Can You Save?</h3><p className="text-xs text-gray-500 mt-0.5">See how a lump-sum prepayment reduces your total interest</p></div>
              <div className="px-4 md:px-6 pb-5 space-y-4">
                <SIPSlider label="Prepayment Amount" value={prepayAmount} min={10000} max={Math.min(1000000, loanAmount)} step={10000} prefix="₹" color="emerald" onChange={setPrepayAmount} formatDisplay={fmtL} />
                <SIPSlider label="Prepay After" value={prepayAfterMonths} min={1} max={Math.max(1, months-1)} step={1} suffix=" months" color="amber" onChange={setPrepayAfterMonths} formatDisplay={v => `${v} month${v>1?'s':''}`} />
                <div>
                  <span className="text-[13px] font-semibold text-gray-500 block mb-2">Reduce</span>
                  <div className="flex gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">{(['tenure','emi'] as const).map(m => (<button key={m} onClick={() => setPrepayMode(m)} className={`flex-1 px-2.5 py-2 rounded-md text-xs font-bold ${prepayMode===m?'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60':'text-gray-500'}`}>{m==='tenure'?'Tenure (same EMI)':'EMI (same tenure)'}</button>))}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Interest Saved</span><span className="font-bold text-emerald-600">{fmt(prepayResult.interestSaved)}</span></div>
                  {prepayResult.monthsSaved > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Months Saved</span><span className="font-bold text-emerald-600">{prepayResult.monthsSaved} months</span></div>}
                  {prepayResult.newEmi > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">New EMI</span><span className="font-bold text-blue-600">{fmt(prepayResult.newEmi)}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-gray-600">New Payoff Date</span><span className="font-bold text-gray-800">{prepayResult.newPayoff}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 pb-2"><h3 className="text-base md:text-lg font-bold text-gray-900">EMI Formula</h3></div>
              <div className="px-4 md:px-6 pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><code className="text-base md:text-lg text-gray-800 font-mono font-semibold">EMI = P × r × (1+r)<sup>n</sup> / ((1+r)<sup>n</sup> - 1)</code></div>
                <div className="grid grid-cols-3 gap-2.5 mt-4">{[{v:'P',d:'Principal',c:'bg-blue-50 text-blue-700 border-blue-200'},{v:'r',d:'Monthly rate',c:'bg-emerald-50 text-emerald-700 border-emerald-200'},{v:'n',d:'Months',c:'bg-amber-50 text-amber-700 border-amber-200'}].map(i => (<div key={i.v} className={`rounded-lg border p-2.5 ${i.c}`}><div className="text-lg font-bold font-mono">{i.v}</div><div className="text-[11px] opacity-80 mt-0.5">{i.d}</div></div>))}</div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">Car loan calculations are based on inputs provided. Actual EMI may vary based on bank policies, processing fees, and insurance. Verify rates on bank websites before applying.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
