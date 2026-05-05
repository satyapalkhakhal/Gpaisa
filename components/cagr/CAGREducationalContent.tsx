'use client';

import Link from 'next/link';

export default function CAGREducationalContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What is CAGR */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">What is CAGR?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          <strong>CAGR (Compound Annual Growth Rate)</strong> represents the rate at which an investment would have grown if it grew at a steady rate. It smooths out the volatility and gives a single, clean number to compare investments.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          Unlike simple average returns, CAGR accounts for compounding — making it the most accurate way to measure investment performance over multiple years.
        </p>
      </div>

      {/* What This Means */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-5 md:p-8 border border-emerald-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">What CAGR Really Means</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { icon: '1️⃣', title: 'Shows average yearly growth', desc: 'CAGR tells you the average rate your investment grew each year, as if it grew steadily without any ups or downs.' },
            { icon: '2️⃣', title: 'Smooths out market fluctuations', desc: 'Real investments don\'t grow at a steady rate. CAGR ignores the bumps and gives you one clean number.' },
            { icon: '3️⃣', title: 'Useful for comparing investments', desc: 'You can directly compare CAGR of stocks, mutual funds, gold, and FDs — even if they have different time periods.' },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg border border-emerald-200">
              <div className="text-xl md:text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-0.5 text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-700 text-xs md:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">CAGR Formula</h2>
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-gray-200">
          <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
            CAGR = (FV / IV)<sup>1/N</sup> – 1
          </code>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-3 mt-4">
            {[
              { var: 'FV', desc: 'Final Value', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { var: 'IV', desc: 'Initial Value', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { var: 'N', desc: 'Number of years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((item) => (
              <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                <div className="text-lg font-bold font-mono">{item.var}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-5 md:p-8 border border-emerald-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Typical CAGR by Asset Class</h2>
        <div className="sip-scroll-container">
          <table className="w-full min-w-[340px] text-sm">
            <thead>
              <tr className="bg-white/80">
                <th className="text-left py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Asset Class</th>
                <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Typical CAGR</th>
                <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody>
              {[
                { asset: '🏦 Fixed Deposit', cagr: '6–7%', risk: 'Very Low', color: 'text-blue-600' },
                { asset: '🥇 Gold', cagr: '8–10%', risk: 'Low-Med', color: 'text-amber-600' },
                { asset: '📊 Debt Funds', cagr: '7–9%', risk: 'Low', color: 'text-teal-600' },
                { asset: '📈 Nifty 50', cagr: '12–15%', risk: 'High', color: 'text-emerald-600' },
                { asset: '🚀 Mid-Cap', cagr: '15–18%', risk: 'Very High', color: 'text-green-600' },
                { asset: '🏠 Real Estate', cagr: '8–12%', risk: 'Medium', color: 'text-purple-600' },
              ].map((row) => (
                <tr key={row.asset} className="border-t border-emerald-100/60">
                  <td className="py-3 px-3 md:px-5 font-medium text-gray-700 text-[13px] md:text-sm">{row.asset}</td>
                  <td className={`py-3 px-3 md:px-5 text-right font-bold tabular-nums text-[13px] md:text-sm ${row.color}`}>{row.cagr}</td>
                  <td className="py-3 px-3 md:px-5 text-right text-gray-500 text-[13px] md:text-sm">{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAGR vs Simple Returns */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">CAGR vs Simple Returns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 md:p-5 border border-emerald-200">
            <h3 className="font-bold text-emerald-900 mb-2 text-sm md:text-base">✅ CAGR (Use This)</h3>
            <ul className="space-y-1.5 text-gray-700 text-xs md:text-sm">
              <li>• Accounts for compounding</li>
              <li>• Smooths out volatility</li>
              <li>• Best for multi-year comparison</li>
              <li>• Industry standard</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4 md:p-5 border border-red-200">
            <h3 className="font-bold text-red-900 mb-2 text-sm md:text-base">❌ Simple Average (Misleading)</h3>
            <ul className="space-y-1.5 text-gray-700 text-xs md:text-sm">
              <li>• Ignores compounding effect</li>
              <li>• Can overstate actual returns</li>
              <li>• Not useful for comparison</li>
              <li>• Can be very misleading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Uses of CAGR */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg p-5 md:p-8 border border-emerald-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Where is CAGR Used?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: '📊', title: 'Mutual Fund Returns', desc: 'AMCs report 1Y, 3Y, 5Y CAGR for all schemes.' },
            { icon: '📈', title: 'Stock Performance', desc: 'Compare long-term stock growth across sectors.' },
            { icon: '🏢', title: 'Business Revenue', desc: 'Companies report revenue CAGR in annual reports.' },
            { icon: '💼', title: 'Portfolio Analysis', desc: 'Track overall portfolio growth over years.' },
            { icon: '🏠', title: 'Real Estate', desc: 'Measure property value appreciation.' },
            { icon: '🥇', title: 'Gold & Commodities', desc: 'Compare commodity returns with equity.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 md:p-5 border border-gray-100">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { q: 'What is a good CAGR?', a: 'A good CAGR depends on the asset class. For equity, 12-15% is considered good. For debt, 7-9% is acceptable. Always compare CAGR against the relevant benchmark.' },
            { q: 'Is CAGR same as returns?', a: 'No. CAGR is the average compounded growth rate. Actual yearly returns may vary wildly. CAGR smooths them into a single number for easy comparison.' },
            { q: 'Can CAGR be negative?', a: 'Yes, if your investment value decreased over time. A negative CAGR means your investment lost value on average each year.' },
            { q: 'What is the Rule of 72?', a: 'Divide 72 by the CAGR to estimate how many years it takes to double your money. Example: At 12% CAGR, money doubles in ~6 years.' },
            { q: 'CAGR vs XIRR — what\'s the difference?', a: 'CAGR assumes a lump sum investment. XIRR handles multiple cash flows (like SIPs) at irregular intervals. Use XIRR for SIP returns.' },
            { q: 'Does CAGR account for inflation?', a: 'No. CAGR shows nominal returns. To get real returns, subtract the inflation rate from CAGR. Example: 12% CAGR - 6% inflation = 6% real return.' },
            { q: 'How to calculate CAGR for mutual funds?', a: 'Use NAV at start date as Initial Value and NAV at end date as Final Value. Apply the CAGR formula: (End/Start)^(1/years) - 1.' },
            { q: 'Is higher CAGR always better?', a: 'Not necessarily. Higher CAGR often comes with higher risk. A 15% CAGR in small-caps has much higher risk than 8% CAGR in FDs. Consider risk-adjusted returns.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 pb-3 md:pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">Other Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Link href="/calculator/sip" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">SIP Calculator</div>
                <div className="text-xs text-gray-600">Calculate SIP returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/mutual-fund" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💼</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">MF Calculator</div>
                <div className="text-xs text-gray-600">Mutual fund returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/fd" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏦</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">FD Calculator</div>
                <div className="text-xs text-gray-600">Fixed deposit returns</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Track Your Investment Performance!</h2>
        <p className="text-sm md:text-base text-green-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          Use CAGR to measure and compare your investments. Make data-driven financial decisions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/calculator/sip" className="sip-touch-target bg-white text-emerald-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-green-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Try SIP Calculator
          </Link>
          <Link href="/gold-rate" className="sip-touch-target bg-emerald-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-emerald-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            Check Gold Rates
          </Link>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Popular Searches:</strong> cagr calculator, compound annual growth rate calculator, cagr calculator india, investment growth calculator, mutual fund cagr, stock cagr calculator, portfolio cagr, cagr formula, calculate cagr online, investment returns calculator, cagr vs xirr, rule of 72
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
