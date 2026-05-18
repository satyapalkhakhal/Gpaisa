import Link from 'next/link';

const Th = ({ c }: { c: string }) => <th className="px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 text-left">{c}</th>;
const Td = ({ c, color }: { c: string; color?: string }) => <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${color ?? 'text-gray-700'}`}>{c}</td>;

export default function SIContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. Formula */}
      <section aria-labelledby="si-formula-heading">
        <h2 id="si-formula-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Simple Interest Formula and What Each Variable Means
        </h2>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 mb-5">
          <p className="font-mono text-lg text-teal-800 font-bold mb-1">SI = (P × R × T) / 100</p>
          <p className="text-sm text-gray-600">To find total amount: <strong>A = P + SI = P × (1 + RT/100)</strong></p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Variable" /><Th c="What It Means" /><Th c="Example" /></tr></thead>
            <tbody>
              {[
                ['SI', 'Simple Interest earned or paid', '₹24,000'],
                ['P', 'Principal — the original amount', '₹1,00,000'],
                ['R', 'Annual interest rate (in %)', '8%'],
                ['T', 'Time period in years', '3 years'],
                ['A', 'Total Amount = P + SI', '₹1,24,000'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-teal-50/20">
                  <td className="px-3 py-2.5 text-sm font-bold text-teal-700 border-b border-gray-50 font-mono">{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} color="text-gray-800 font-semibold" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Worked Examples */}
      <section aria-labelledby="si-examples-heading">
        <h2 id="si-examples-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Simple Interest Calculation Examples
        </h2>
        <div className="space-y-4">
          {[
            {
              title: 'Example 1 — Personal Loan',
              bg: 'bg-blue-50 border-blue-100',
              accent: 'text-blue-700',
              scenario: 'Ramesh takes a personal loan of ₹2,00,000 at 12% per annum for 2 years.',
              steps: [
                'SI = (2,00,000 × 12 × 2) / 100 = ₹48,000',
                'Total repayment = ₹2,00,000 + ₹48,000 = ₹2,48,000',
              ],
            },
            {
              title: 'Example 2 — Fixed Deposit (Short-term)',
              bg: 'bg-emerald-50 border-emerald-100',
              accent: 'text-emerald-700',
              scenario: 'Sunita deposits ₹50,000 at 6.5% for 18 months (1.5 years).',
              steps: [
                'SI = (50,000 × 6.5 × 1.5) / 100 = ₹4,875',
                'Maturity value = ₹50,000 + ₹4,875 = ₹54,875',
              ],
            },
            {
              title: 'Example 3 — Government Bond',
              bg: 'bg-amber-50 border-amber-100',
              accent: 'text-amber-700',
              scenario: 'An investor buys a government bond worth ₹5,00,000 at 7.2% p.a. for 5 years.',
              steps: [
                'SI = (5,00,000 × 7.2 × 5) / 100 = ₹1,80,000',
                'Total value at maturity = ₹5,00,000 + ₹1,80,000 = ₹6,80,000',
              ],
            },
          ].map((ex, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${ex.bg}`}>
              <p className={`text-sm font-bold mb-2 ${ex.accent}`}>{ex.title}</p>
              <p className="text-sm text-gray-700 mb-3">{ex.scenario}</p>
              {ex.steps.map((s, j) => (
                <div key={j} className="bg-white rounded-xl px-4 py-2 border border-gray-100 font-mono text-sm text-gray-800 mb-2">{s}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. SI vs CI */}
      <section aria-labelledby="si-vs-ci-heading">
        <h2 id="si-vs-ci-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Simple Interest vs Compound Interest — Which Is Better?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="Simple Interest" /><Th c="Compound Interest" /></tr></thead>
            <tbody>
              {[
                ['Interest calculated on', 'Principal only', 'Principal + accumulated interest'],
                ['Formula', 'SI = (P × R × T) / 100', 'A = P × (1 + R/100)^T'],
                ['Growth', 'Linear (same every year)', 'Exponential (grows faster over time)'],
                ['Better for', 'Borrowers (pay less)', 'Investors (earn more over time)'],
                ['Used in', 'Personal loans, short FDs', 'Savings accounts, long-term FDs, SIPs'],
                ['Example (₹1L, 8%, 3yr)', 'Interest = ₹24,000', 'Interest = ₹25,971'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i === 3 ? 'text-teal-700 font-semibold' : 'text-gray-700'} />
                  <Td c={row[2]} color={i === 3 ? 'text-blue-700 font-semibold' : 'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm text-gray-700">
          <strong>Key insight:</strong> For short periods (1–2 years), the difference between SI and CI is small. Over <strong>10+ years</strong>, compound interest creates dramatically more wealth for investors — and dramatically more cost for borrowers.
        </div>
      </section>

      {/* 4. Reverse Formulas */}
      <section aria-labelledby="si-reverse-heading">
        <h2 id="si-reverse-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          How to Find Principal, Rate, or Time from Simple Interest
        </h2>
        <p className="text-sm text-gray-600 mb-4">Sometimes you know the interest amount but need to find another variable. Use these reverse formulas:</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="What to Find" /><Th c="Formula" /><Th c="Example" /></tr></thead>
            <tbody>
              {[
                ['Principal (P)', 'P = (SI × 100) / (R × T)', 'SI=₹24,000, R=8%, T=3yr → P = ₹1,00,000'],
                ['Rate (R)', 'R = (SI × 100) / (P × T)', 'SI=₹24,000, P=₹1L, T=3yr → R = 8%'],
                ['Time (T)', 'T = (SI × 100) / (P × R)', 'SI=₹24,000, P=₹1L, R=8% → T = 3 years'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-teal-50/20">
                  <td className="px-3 py-2.5 text-sm font-bold text-teal-700 border-b border-gray-50">{row[0]}</td>
                  <td className="px-3 py-2.5 text-sm font-mono text-gray-700 border-b border-gray-50">{row[1]}</td>
                  <Td c={row[2]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-teal-600 bg-teal-50 rounded-xl px-4 py-3 border border-teal-100">Use the <strong>reverse calculator tabs</strong> above to find any missing variable instantly without manual calculation.</p>
      </section>

      {/* 5. Rate Reference Table */}
      <section aria-labelledby="si-table-heading">
        <h2 id="si-table-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Interest Amount on ₹1 Lakh at Different Rates and Durations
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-3 text-xs font-semibold text-gray-600 text-left">Rate \ Years</th>
                {['1 Year', '2 Years', '3 Years', '5 Years'].map((h) => <th key={h} className="px-3 py-3 text-xs font-semibold text-gray-600 text-right">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                [6, 6000, 12000, 18000, 30000],
                [7, 7000, 14000, 21000, 35000],
                [8, 8000, 16000, 24000, 40000],
                [10, 10000, 20000, 30000, 50000],
                [12, 12000, 24000, 36000, 60000],
              ].map(([r, ...vals], i) => (
                <tr key={i} className={`hover:bg-teal-50/20 ${r === 8 ? 'bg-teal-50/40' : ''}`}>
                  <td className={`px-3 py-2.5 text-sm font-bold border-b border-gray-50 ${r === 8 ? 'text-teal-700' : 'text-gray-700'}`}>{r}%</td>
                  {vals.map((v, j) => <td key={j} className={`px-3 py-2.5 text-sm text-right border-b border-gray-50 ${r === 8 && j === 2 ? 'font-bold text-teal-700' : 'text-gray-700'}`}>₹{Number(v).toLocaleString('en-IN')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">All values for ₹1,00,000 principal using SI = (P × R × T) / 100. Highlighted row = default example.</p>
      </section>

      {/* 6. When is SI Used */}
      <section aria-labelledby="si-used-heading">
        <h2 id="si-used-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          When Do Banks and Lenders Use Simple Interest in India?
        </h2>
        <ul className="space-y-2.5 text-sm text-gray-700 mb-4">
          {[
            'Personal loans from banks and NBFCs (most charge SI on reducing balance, not flat SI)',
            'Short-term loans under 1 year from cooperative societies and moneylenders',
            'Government savings bonds and some post office schemes',
            'Partial payment situations — EMI payments are typically calculated using a reducing balance SI method',
          ].map((t, i) => (
            <li key={i} className="flex gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"><span className="text-teal-500 flex-shrink-0">•</span>{t}</li>
          ))}
        </ul>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-gray-700">
          <strong>Note:</strong> Most modern bank FDs, savings accounts, and home loans use <strong>compound interest</strong>, not simple interest. If a lender quotes a flat rate, convert it to an effective annual rate for comparison: <span className="font-mono">Effective Rate ≈ 2 × Flat Rate / (n+1)</span> where n = number of EMIs.
        </div>
      </section>

      {/* 7. FAQ */}
      <section aria-labelledby="si-faq-heading">
        <h2 id="si-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — Simple Interest Calculator
        </h2>
        <div className="space-y-3">
          {[
            ['What is the simple interest formula in maths?', 'SI = (P × R × T) / 100, where P is the principal, R is the annual interest rate in %, and T is time in years. Total amount: A = P + SI. Example: ₹1,00,000 at 8% for 3 years → SI = (1,00,000 × 8 × 3)/100 = ₹24,000, total = ₹1,24,000.'],
            ['What is the difference between simple and compound interest?', 'Simple interest is calculated only on the original principal — same amount every year. Compound interest is calculated on principal plus accumulated interest — it grows faster over time. For ₹1 lakh at 8% for 3 years: SI gives ₹24,000 while CI (compounded annually) gives ₹25,971 — a difference of ₹1,971.'],
            ['How do I find the principal if I know the simple interest?', 'Use: P = (SI × 100) / (R × T). Example: SI = ₹24,000, rate = 8%, time = 3 years → P = (24,000 × 100) / (8 × 3) = ₹1,00,000. Use the "Find Principal" tab in the calculator above.'],
            ['Is EMI calculated on simple interest or compound interest?', 'Most bank EMI loans use a reducing balance method — a form of compound interest where interest is calculated monthly on outstanding principal. As you pay EMIs, the outstanding principal reduces, so the interest component decreases over time. Flat rate SI loans are less common and typically more expensive in total cost.'],
            ['What is the simple interest on ₹10,000 at 10% for 2 years?', 'SI = (10,000 × 10 × 2) / 100 = ₹2,000. Total amount = ₹10,000 + ₹2,000 = ₹12,000. Verification: 10% of ₹10,000 = ₹1,000 per year × 2 years = ₹2,000.'],
          ].map(([q, a], i) => (
            <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm md:text-base select-none list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-gray-100 pt-8 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[['Compound Interest Calculator', '/calculator/compound-interest'], ['FD Calculator', '/calculator/fd'], ['EMI Calculator', '/calculator/home-loan'], ['SIP Calculator', '/calculator/sip']].map(([l, h]) => (
              <Link key={h} href={h} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026</p>
      </section>
    </div>
  );
}
