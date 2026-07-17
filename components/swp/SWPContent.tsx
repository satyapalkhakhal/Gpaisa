// Server component — renders as static HTML, visible in View Source with JS disabled

type YearRow = {
  year: number
  openingBalance: number
  withdrawal: number
  returns: number
  closingBalance: number
  realValue?: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const thC = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider'
const tdC = 'px-3 py-2.5 text-sm text-gray-800'

export default function SWPContent({ first5Years }: { first5Years?: YearRow[] }) {
  return (
    <div className="space-y-5 md:space-y-6 mt-8 md:mt-10">

      {/* ── Section 1: How is SWP Calculated? The Formula Explained ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-xl font-bold text-gray-900">How is SWP Calculated? The Formula Explained</h2>
          <p className="text-xs text-gray-500 mt-0.5">The math behind systematic withdrawals</p>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-4">
          {/* Formula block */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SWP Formula</p>
            <code className="text-sm md:text-base text-gray-800 font-mono font-semibold block">
              A = PMT × [(1+r)^n − 1] / r × (1+r)
            </code>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { v: 'A', d: 'Final Corpus (FV)', c: 'bg-primary-50 text-primary-700 border-primary-200' },
              { v: 'PMT', d: 'Monthly Withdrawal', c: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { v: 'r', d: 'Monthly return rate', c: 'bg-blue-50 text-blue-700 border-blue-200' },
              { v: 'n', d: 'Total months', c: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((item) => (
              <div key={item.v} className={`rounded-lg border p-2 md:p-3 ${item.c}`}>
                <div className="text-base font-bold font-mono">{item.v}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{item.d}</div>
              </div>
            ))}
          </div>

          {/* Worked example */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">📊 Worked Example</p>
            <p className="text-sm text-emerald-900 leading-relaxed">
              <strong>Rahul</strong> invests <strong>₹10,00,000</strong> at <strong>12% annual return</strong> and withdraws <strong>₹10,000/month</strong>.
              Monthly rate = 12/12/100 = <strong>1%</strong>. After 20 years (240 months), his final corpus =
              ₹10,00,000 × (1.01)^240 − ₹10,000 × [(1.01)^240 − 1] / 0.01 = approximately <strong>₹73,00,000</strong>.
            </p>
            <p className="text-xs text-emerald-700 mt-2 font-medium">
              His ₹10L grew to ₹73L while he withdrew ₹10,000 every month for 20 years — total withdrawal of ₹24 lakh.
            </p>
          </div>

          {/* SSR year-wise table — first 5 years */}
          {first5Years && first5Years.length > 0 && (
            <div className="mt-1">
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

      {/* ── Section 2: SWP vs FD vs Annuity ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-xl font-bold text-gray-900">SWP vs FD vs Annuity: Which Gives Better Retirement Income?</h2>
        </div>
        <div className="px-4 md:px-6 pb-2 overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thC}>Option</th>
                <th className={thC}>Monthly Income (₹10L)</th>
                <th className={thC}>Tax Treatment</th>
                <th className={thC}>Corpus after 20yr</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50/40 border-b border-gray-100">
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">SWP at 12%</td>
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">₹10,000</td>
                <td className="px-3 py-2.5 text-sm text-gray-700">LTCG 10% on gains only</td>
                <td className="px-3 py-2.5 text-sm font-bold text-emerald-700">₹73L+ intact</td>
              </tr>
              <tr className="bg-white border-b border-gray-100">
                <td className={`${tdC} font-semibold`}>FD at 7%</td>
                <td className={tdC}>₹5,833</td>
                <td className={tdC}>Full slab rate annually</td>
                <td className={tdC}>₹0 (depleted)</td>
              </tr>
              <tr className="bg-gray-50/40">
                <td className={`${tdC} font-semibold`}>Annuity at 6%</td>
                <td className={tdC}>₹5,000</td>
                <td className={tdC}>Full slab rate</td>
                <td className={tdC}>₹0 (no return)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-4 md:px-6 pb-4 text-xs md:text-sm text-gray-600 mt-2 leading-relaxed">
          For investors in the <strong>20–30% tax bracket</strong>, SWP from an equity mutual fund generates nearly <strong>2× more post-tax monthly income</strong> than a fixed deposit on the same corpus, while keeping the principal intact.
        </p>
      </div>

      {/* ── Section 3: Tax Treatment ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-xl font-bold text-gray-900">SWP Tax Treatment in India (2026)</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            Each SWP redemption is split into <strong>principal</strong> and <strong>gains</strong>. Only the gains portion is taxable. For equity funds held over 1 year: <strong>LTCG above ₹1 lakh taxed at 10%</strong>. For debt funds: taxed at income slab rate.
          </p>
          <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200">
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
              <strong>Example:</strong> If you withdraw ₹10,000 and ₹3,000 is gains, only ₹3,000 is taxable — not ₹10,000. Compare this to FD interest where the full ₹5,833 interest is added to income and taxed at your slab rate.
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

      {/* ── Section 4: Who Should Use SWP ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-xl font-bold text-gray-900">Who Should Use SWP?</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">✅ Suitable for:</p>
          <div className="space-y-2">
            {[
              'Retirees needing regular income without depleting capital',
              'Parents funding education fees over 4 years from an existing corpus',
              'NRIs needing regular India income from their mutual fund investments',
              'Anyone who built a mutual fund corpus and needs systematic liquidity',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-sm mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 rounded-xl p-3.5 border border-orange-200 mt-2">
            <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">⚠️ NOT suitable for:</h4>
            <div className="space-y-1.5">
              {[
                'People needing capital guarantee — use FD instead',
                'People with investment horizon under 3 years',
                'People in volatile pure small-cap funds where returns are unpredictable',
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

      {/* ── Section 5: FAQ ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-xl font-bold text-gray-900">SWP Calculator — Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              q: 'What is a safe SWP withdrawal rate in India?',
              a: '0.8–1% monthly (9.6–12% annually) is generally considered safe if the corpus earns 12–14% in diversified equity. At 1% monthly withdrawal, ₹10 lakh corpus supports ₹10,000/month withdrawal indefinitely.',
            },
            {
              q: 'Can SWP corpus run out?',
              a: 'Yes — if withdrawal exceeds returns, the corpus depletes over time. Our calculator shows the exact depletion date based on your inputs. Use the depletion warning feature above to check your sustainability.',
            },
            {
              q: 'Is SWP better than FD for retirement?',
              a: 'For investors in the 20–30% tax bracket, yes — significantly more tax-efficient and higher income. FD interest is taxed at your full slab rate; SWP gains are taxed at 10% LTCG on only the gains portion.',
            },
            {
              q: 'What is the minimum corpus for SWP?',
              a: 'For ₹10,000/month sustainable withdrawal at 12% return, minimum corpus = ₹10,00,000. The formula is: Minimum Corpus = Monthly Withdrawal ÷ Monthly Return Rate.',
            },
            {
              q: 'How is SWP different from dividend option?',
              a: 'SWP gives you control over amount and timing. Dividends are at the AMC\'s discretion and taxed at your full income slab rate. SWP from equity funds held over 1 year is taxed at 10% LTCG on gains only — giving you both control and tax efficiency.',
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
          <span>Content by <strong className="text-gray-700">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'EPF Calculator', href: '/calculator/epf' },
              { label: 'NPS Calculator', href: '/calculator/nps' },
              { label: 'Gratuity Calculator', href: '/calculator/gratuity' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
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
