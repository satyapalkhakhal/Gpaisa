'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

interface GSTCalculatorClientProps {
  initialPreGstAmount?: number;
  initialCgst?: number;
  initialSgst?: number;
  initialTotalGst?: number;
  initialPostGstAmount?: number;
}

export default function GSTCalculatorClient({
  initialPreGstAmount = 10000,
  initialCgst = 900,
  initialSgst = 900,
  initialTotalGst = 1800,
  initialPostGstAmount = 11800,
}: GSTCalculatorClientProps) {
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);

  const [cgst, setCgst] = useState(initialCgst);
  const [sgst, setSgst] = useState(initialSgst);
  const [totalGst, setTotalGst] = useState(initialTotalGst);
  const [preGstAmount, setPreGstAmount] = useState(initialPreGstAmount);
  const [postGstAmount, setPostGstAmount] = useState(initialPostGstAmount);

  useEffect(() => {
    if (calculationType === 'exclusive') {
      const gst = (amount * gstRate) / 100;
      setCgst(gst / 2);
      setSgst(gst / 2);
      setTotalGst(gst);
      setPreGstAmount(amount);
      setPostGstAmount(amount + gst);
    } else {
      const original = (amount * 100) / (100 + gstRate);
      const gst = amount - original;
      setCgst(gst / 2);
      setSgst(gst / 2);
      setTotalGst(gst);
      setPreGstAmount(original);
      setPostGstAmount(amount);
    }
  }, [calculationType, amount, gstRate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">GST Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-purple-200 flex-shrink-0">🧾</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">GST Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate GST inclusive/exclusive amounts with CGST &amp; SGST breakdown instantly.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">GST Details</h2>

              <div className="mb-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Calculation Type</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  <button onClick={() => setCalculationType('exclusive')} className={`sip-touch-target flex-1 px-2.5 py-2 rounded-md text-xs font-bold transition-all ${calculationType === 'exclusive' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>Add GST</button>
                  <button onClick={() => setCalculationType('inclusive')} className={`sip-touch-target flex-1 px-2.5 py-2 rounded-md text-xs font-bold transition-all ${calculationType === 'inclusive' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>Remove GST</button>
                </div>
              </div>

              <div className="space-y-5 md:space-y-6">
                <SIPSlider label={calculationType === 'exclusive' ? 'Amount (Excl. GST)' : 'Amount (Incl. GST)'} value={amount} min={100} max={500000} step={100} prefix="₹" color="blue" onChange={setAmount} formatDisplay={(v) => formatCurrency(v)} />
              </div>

              <div className="mt-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">GST Rate</span>
                <div className="grid grid-cols-3 gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {[5, 18, 40].map((rate) => (
                    <button key={rate} onClick={() => setGstRate(rate)} className={`sip-touch-target px-2 py-2 rounded-md text-xs font-bold transition-all ${gstRate === rate ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>{rate}%</button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">GST 2.0 (effective 22 Sep 2025): the 12% and 28% slabs have been withdrawn.</p>
              </div>

              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">📋 GST Rate Slabs (GST 2.0)</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex justify-between"><span>Essential items:</span><span className="font-semibold">5%</span></li>
                  <li className="flex justify-between"><span>Standard goods &amp; services:</span><span className="font-semibold">18%</span></li>
                  <li className="flex justify-between"><span>De-merit / luxury items:</span><span className="font-semibold">40%</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">Amount Before GST</span>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(preGstAmount))}</span>
                </div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">CGST ({gstRate / 2}%)</span>
                  <span className="text-sm font-bold text-purple-600">{formatCurrency(Math.round(cgst))}</span>
                </div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">SGST ({gstRate / 2}%)</span>
                  <span className="text-sm font-bold text-purple-600">{formatCurrency(Math.round(sgst))}</span>
                </div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">Total GST ({gstRate}%)</span>
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(totalGst))}</span>
                </div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50">
                  <span className="text-base font-semibold text-gray-900">Total Amount After GST</span>
                  <span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(postGstAmount))}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About GST</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Goods and Services Tax (GST) is an indirect tax system applicable across India. It replaced multiple cascading taxes with a unified system. GST is divided equally into Central GST (CGST) and State GST (SGST) for intrastate transactions, and a single Integrated GST (IGST) for interstate transactions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
