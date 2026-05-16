// Server component — renders as static HTML, visible in View Source with JS disabled

type YearRow = {
  year: number
  openingBalance: number
  withdrawal: number
  returns: number
  closingBalance: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const thC = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider'
const tdC = 'px-3 py-2.5 text-sm text-gray-800'

export default function SWPContent({ first5Years }: { first5Years?: YearRow[] }) {
  return (
    <div className="space-y-5 md:space-y-6 mt-8 md:mt-10">

      {/* ── Section 1: Formula ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">SWP Formula</h2>
          <p className="text-xs text-gray-500 mt-0.5">The math behind systematic withdrawals</p>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
            <code className="text-sm md:text-base text-gray-800 font-mono font-semibold">
              FV = P × (1+r)^n − W × [(1+r)^n − 1] / r
            </code>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { v: 'FV', d: 'Final Corpus', c: 'bg-primary-50 text-primary-700 border-primary-200' },
              { v: 'P', d: 'Initial Investment', c: 'bg-blue-50 text-blue-700 border-blue-200' },
              { v: 'r', d: 'Monthly return rate', c: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { v: 'n', d: 'Total months', c: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((item) => (
              <div key={item.v} className={`rounded-lg border p-2 md:p-3 ${item.c}`}>
                <div className="text-base font-bold font-mono">{item.v}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{item.d}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            W = monthly withdrawal amount. At sustainable rate, FV = P (corpus stays intact).
          </p>
        </div>
      </div>

      {/* ── Section 2: What is SWP ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">What is SWP and How Does it Work?</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            SWP is the opposite of SIP. Instead of putting money in every month, you take money out. You invest a lump sum in a mutual fund and set up automatic monthly withdrawals. The remaining corpus stays invested and continues to earn returns. If your monthly return exceeds your monthly withdrawal, your corpus actually grows over time.
          </p>
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
            <p className="text-xs md:text-sm text-emerald-800 font-medium leading-relaxed">
              <strong>Example:</strong> ₹10 lakh invested at 12% annual return earns approximately ₹10,000/month. If you withdraw exactly ₹10,000/month, your principal stays intact indefinitely — this is called the <strong>&ldquo;sustainable withdrawal rate.&rdquo;</strong>
            </p>
          </div>

          {/* SSR year-wise table — first 5 years, visible without JS */}
          {first5Years && first5Years.length > 0 && (
            <div className="mt-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Year-wise SWP (Default: ₹10L @ 12% / ₹10K withdrawal)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[420px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={thC}>Year</th>
                      <th className={thC}>Opening Balance</th>
                      <th className={thC}>Withdrawn</th>
                      <th className={thC}>Returns Earned</th>
                      <th className={thC}>Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {first5Years.map((row, idx) => (
                      <tr key={row.year} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                        <td className={`${tdC} font-semibold`}>{row.year}</td>
                        <td className={tdC}>{fmt(row.openingBalance)}</td>
                        <td className={`${tdC} text-emerald-600 font-semibold`}>{fmt(row.withdrawal)}</td>
                        <td className={`${tdC} text-blue-600`}>{fmt(row.returns)}</td>
                        <td className={`${tdC} font-bold text-gray-900`}>{fmt(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 italic">Showing years 1–5. Use the calculator above to see all 20 years interactively.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: SWP vs FD vs Pension ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">SWP vs FD vs Pension — Which Gives Better Monthly Income?</h2>
        </div>
        <div className="px-4 md:px-6 pb-2 overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thC}>Option</th>
                <th className={thC}>Monthly Income on ₹10L</th>
                <th className={thC}>Tax Treatment</th>
                <th className={thC}>Corpus after 20 yrs</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50/40 border-b border-gray-100">
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">SWP (12% return)</td>
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">₹10,000</td>
                <td className="px-3 py-2.5 text-sm text-gray-700">Only gains taxed (LTCG 10%)</td>
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">₹10L+ intact</td>
              </tr>
              <tr className="bg-white border-b border-gray-100">
                <td className={`${tdC} font-semibold`}>FD (7% return)</td>
                <td className={tdC}>₹5,833</td>
                <td className={tdC}>Fully taxable at slab rate</td>
                <td className={tdC}>₹0 (principal depleted)</td>
              </tr>
              <tr className="bg-gray-50/40">
                <td className={`${tdC} font-semibold`}>Annuity / Pension</td>
                <td className={tdC}>₹5,000–₹6,000</td>
                <td className={tdC}>Fully taxable</td>
                <td className={tdC}>₹0 (no return of principal)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-4 md:px-6 pb-4 text-xs text-gray-500 mt-2">
          <strong>SWP from equity mutual funds is the most tax-efficient regular income option for retirees in the 20–30% tax bracket.</strong>
        </p>
      </div>

      {/* ── Section 4: Tax Treatment ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">SWP Tax Treatment in India (2026)</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            Each SWP unit redemption is treated as a capital gain. For equity funds held over 1 year: LTCG above ₹1 lakh taxed at 10%. For debt funds: taxed at income slab rate. Unlike FD interest which is taxed fully every year, SWP from equity funds is highly tax-efficient because only the <em>gains portion</em> of each withdrawal is taxable, not the principal.
          </p>
          <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200">
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
              <strong>Example:</strong> If you withdraw ₹10,000 and the gains component is ₹3,000, only ₹3,000 is taxable — not the full ₹10,000. Effective tax rate is far lower than FD interest taxation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Equity Funds (1+ yr)</div>
              <div className="text-sm font-bold text-emerald-700">LTCG: 10% on gains &gt;₹1L/yr</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Debt Funds</div>
              <div className="text-sm font-bold text-orange-700">Taxed at income slab rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Who Should Use SWP ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Who Should Use SWP?</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="space-y-2">
            {[
              'Retirees needing regular income without depleting capital',
              'Parents funding college fees over 4 years from an existing corpus',
              'Anyone who has accumulated a mutual fund corpus and needs systematic liquidity',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-sm mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 rounded-xl p-3.5 border border-orange-200 mt-2">
            <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">⚠️ SWP is NOT suitable for:</h4>
            <div className="space-y-1.5">
              {[
                'People who need capital preservation guarantee — use FD instead',
                'People with very short time horizons under 3 years',
                'People investing in volatile small-cap funds where returns are unpredictable',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold text-sm flex-shrink-0">✗</span>
                  <span className="text-xs text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 6: FAQ ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">SWP Calculator — Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              q: 'What is a safe SWP withdrawal rate in India?',
              a: 'A withdrawal rate of 0.8–1% of corpus per month (9.6–12% annually) is generally considered sustainable if the corpus is in a diversified equity fund earning 12–14% annually. At 1% monthly withdrawal, ₹10 lakh corpus supports ₹10,000/month withdrawal indefinitely.',
            },
            {
              q: 'Can SWP corpus run out?',
              a: 'Yes — if monthly withdrawal exceeds monthly returns, the corpus depletes over time. At ₹10 lakh corpus and 12% returns, a withdrawal of more than ₹10,000/month will slowly reduce the corpus. Our calculator shows the depletion timeline based on your inputs.',
            },
            {
              q: 'Is SWP better than FD for retirement?',
              a: 'For investors in the 20–30% tax bracket with a corpus in equity funds, SWP is typically more tax-efficient than FD interest. FD interest is taxed at your full income slab rate every year; SWP gains are taxed at 10% LTCG (for equity funds held 1+ year) and only on the gains portion of each withdrawal.',
            },
            {
              q: 'What is the minimum amount for SWP?',
              a: 'Most mutual funds allow SWP starting from ₹500 per month with a minimum corpus of ₹5,000–₹10,000. For a sustainable long-term SWP, a minimum corpus of ₹10–₹25 lakh is recommended depending on your monthly income requirement.',
            },
            {
              q: 'How is SWP different from the dividend option?',
              a: 'In the dividend (IDCW) option, the AMC decides when and how much to distribute — you have no control. In SWP, you control the withdrawal amount and date. Dividends are taxed at your income slab rate; SWP from equity funds held over 1 year is taxed at 10% LTCG on gains only.',
            },
          ].map((faq, i) => (
            <div key={i} className="px-4 md:px-6 py-4">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Author + Related Links ── */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 px-4 md:px-6 py-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Content by <strong className="text-gray-700">Satyapal Khakhal</strong>, Founder, gpaisa.in</span>
          <span>Updated: May 2026</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'SIP Calculator', href: '/calculator/sip' },
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'Home Loan Calculator', href: '/calculator/home-loan' },
              { label: 'FD Calculator', href: '/calculator/fd' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-primary-600 bg-white border border-primary-200 px-3 py-1.5 rounded-full hover:bg-primary-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
