// Server component — renders as static HTML, visible in View Source with JS disabled

type YearRow = {
  year: number
  age: number
  basicSalary: number
  employeeContrib: number
  employerContrib: number
  interest: number
  closingBalance: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const thC = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'
const tdC = 'px-3 py-2.5 text-sm text-gray-800'

type Props = { first5Years?: YearRow[] }

export default function EPFContent({ first5Years }: Props) {
  return (
    <div className="space-y-5 md:space-y-6 mt-8 md:mt-10">

      {/* ── Section 1: Contribution Breakdown ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPF Contribution Breakdown</h2>
          <p className="text-xs text-gray-500 mt-0.5">Where does each rupee of your PF go?</p>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-2">
          <table className="w-full text-xs md:text-sm min-w-[440px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thC}>Contributor</th>
                <th className={thC}>% of Basic Salary</th>
                <th className={thC}>Where It Goes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-emerald-50/40 border-b border-gray-100">
                <td className={`${tdC} font-semibold text-emerald-700`}>Employee</td>
                <td className={`${tdC} font-bold`}>12%</td>
                <td className={tdC}>Fully to EPF account</td>
              </tr>
              <tr className="bg-white border-b border-gray-100">
                <td className={`${tdC} font-semibold`}>Employer</td>
                <td className={tdC}>3.67%</td>
                <td className={tdC}>To EPF account</td>
              </tr>
              <tr className="bg-blue-50/30">
                <td className={`${tdC} font-semibold text-blue-700`}>Employer</td>
                <td className={tdC}>8.33%</td>
                <td className={tdC}>To EPS (pension) — capped at ₹1,250/month</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-4 md:px-6 pb-4 text-xs text-gray-500 mt-1 italic">
          If basic salary &gt; ₹15,000, employer pension contribution is capped at ₹1,250/month (8.33% of ₹15,000).
        </p>
      </div>

      {/* ── Section 2: Interest Formula ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPF Interest Calculation Formula</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
            <code className="text-sm font-mono text-gray-800 font-semibold">
              Monthly Interest = Monthly Closing Balance × (8.25% ÷ 12)
            </code>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            EPF interest is calculated monthly but credited annually. Example: ₹1,00,000 EPF balance earns
            <strong> ₹687.50 interest per month = ₹8,250 per year</strong>.
          </p>
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
            <p className="text-xs md:text-sm text-emerald-800 leading-relaxed">
              <strong>Tax-free:</strong> Unlike FD where TDS is deducted, EPF interest is completely tax-free under
              Section 10(11) and 10(12) of the Income Tax Act — provided employee contributions do not exceed
              ₹2.5 lakh per year.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 3: VPF ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-base flex-shrink-0">⭐</span>
            <h2 className="text-base md:text-lg font-bold text-gray-900">VPF — Voluntary Provident Fund (the hidden wealth builder)</h2>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            VPF lets you contribute more than the mandatory 12% of basic salary to your EPF account — up to 100% of basic salary.
            The same <strong>8.25% guaranteed rate</strong> applies, and it is completely tax-free.
            VPF is the best guaranteed return tax-free investment available in India — beating FD, RD, and NSC on both rate and tax treatment.
          </p>
          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
            <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
              <strong>Who should use VPF:</strong> Anyone in the 30% tax bracket who has surplus salary and wants guaranteed returns.
              A person earning ₹1 lakh/month can voluntarily add ₹50,000/month to VPF and earn 8.25% tax-free on the full amount.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 4: Withdrawal Rules ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPF Withdrawal Rules 2026</h2>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-2">
          <table className="w-full text-xs md:text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thC}>Situation</th>
                <th className={thC}>Withdrawal Allowed</th>
                <th className={thC}>Tax Treatment</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: 'Resignation before 5 years', w: 'Partial EPF', t: 'Taxable (TDS if >₹50,000)', c: 'bg-red-50/30' },
                { s: 'Resignation after 5 years', w: 'Full EPF + interest', t: 'Completely tax-free', c: 'bg-emerald-50/30' },
                { s: 'Retirement at 58', w: 'Full EPF + EPS pension', t: 'Completely tax-free', c: 'bg-emerald-50/30' },
                { s: 'Medical emergency', w: "Up to 6 months' salary", t: 'Tax-free', c: 'bg-white' },
                { s: 'Home purchase', w: 'Up to 90% of corpus', t: 'Tax-free', c: 'bg-white' },
                { s: 'Unemployment > 2 months', w: 'Full withdrawal', t: 'Tax-free after 5 yrs service', c: 'bg-white' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${row.c}`}>
                  <td className={`${tdC} font-medium`}>{row.s}</td>
                  <td className={tdC}>{row.w}</td>
                  <td className={`${tdC} ${row.t.includes('tax-free') ? 'text-emerald-700 font-semibold' : 'text-orange-700 font-medium'}`}>{row.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 md:px-6 pb-4 mt-2">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Key rule:</strong> Always transfer — never withdraw — EPF when changing jobs before 5 years.
              Using UAN for transfer preserves service continuity for tax-free treatment and maintains your EPS pension record.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 5: EPF vs PPF vs VPF vs NPS ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPF vs PPF vs VPF vs NPS — Which is Best for Retirement?</h2>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-2">
          <table className="w-full text-xs min-w-[580px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thC}>Option</th>
                <th className={thC}>Rate</th>
                <th className={thC}>Tax on Contrib.</th>
                <th className={thC}>Tax on Returns</th>
                <th className={thC}>Tax at Maturity</th>
                <th className={thC}>Lock-in</th>
              </tr>
            </thead>
            <tbody>
              {[
                { o: 'EPF', r: '8.25%', tc: '80C (up to ₹1.5L)', tr: 'Tax-free', tm: 'Tax-free (5+ yrs)', li: 'Until retirement', h: true },
                { o: 'VPF', r: '8.25%', tc: '80C (up to ₹1.5L)', tr: 'Tax-free*', tm: 'Tax-free (5+ yrs)', li: 'Until retirement', h: true },
                { o: 'PPF', r: '7.1%', tc: '80C (up to ₹1.5L)', tr: 'Tax-free', tm: 'Tax-free', li: '15 years', h: false },
                { o: 'NPS', r: 'Market-linked', tc: '80C + extra ₹50K (80CCD)', tr: 'Tax-free', tm: '60% tax-free', li: 'Until 60', h: false },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${row.h ? 'bg-emerald-50/30' : 'bg-white'}`}>
                  <td className={`${tdC} font-bold ${row.h ? 'text-emerald-700' : 'text-gray-800'}`}>{row.o}</td>
                  <td className={`${tdC} font-semibold`}>{row.r}</td>
                  <td className={tdC}>{row.tc}</td>
                  <td className={`${tdC} text-emerald-700`}>{row.tr}</td>
                  <td className={tdC}>{row.tm}</td>
                  <td className={tdC}>{row.li}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 md:px-6 pb-4 text-xs text-gray-500 mt-1.5">
          *VPF interest is tax-free only on contributions up to ₹2.5 lakh/year (employee portion).
          <strong className="text-gray-700"> Verdict: EPF+VPF wins for salaried employees</strong> — guaranteed 8.25% fully tax-free beats any FD post-tax.
        </p>
      </div>

      {/* ── Section 6: EPS Pension Formula ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPS Pension Calculator — How is Pension Calculated?</h2>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
            <code className="text-sm font-mono text-gray-800 font-semibold block mb-1">
              Monthly Pension = (Pensionable Salary × Pensionable Service) ÷ 70
            </code>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-[10px] text-gray-500">
                <strong>Pensionable Salary</strong> = avg of last 60 months, <strong>capped at ₹15,000</strong>
              </div>
              <div className="text-[10px] text-gray-500">
                <strong>Pensionable Service</strong> = total EPF contribution years (max 35 yrs)
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200">
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
              <strong>Example:</strong> 28 years service, pensionable salary ₹15,000:
              Monthly Pension = (15,000 × 28) ÷ 70 = <strong>₹6,000/month</strong>.
              Maximum possible: (15,000 × 35) ÷ 70 = <strong>₹7,500/month</strong>.
              Minimum guaranteed: <strong>₹1,000/month</strong>.
            </p>
          </div>
          <p className="text-xs text-gray-500">
            <strong>Higher Pension option:</strong> Supreme Court 2022 ruling allows pension on actual salary above ₹15,000 — apply through EPFO portal if eligible.
          </p>

          {/* SSR year-wise table */}
          {first5Years && first5Years.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Year-wise EPF Growth (Default: ₹50K salary, 8.25%, 5% increment)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[560px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className={thC}>Year</th>
                      <th className={thC}>Age</th>
                      <th className={thC}>Basic Salary</th>
                      <th className={thC}>Emp. Contrib.</th>
                      <th className={thC}>Employer Contrib.</th>
                      <th className={thC}>Interest</th>
                      <th className={thC}>Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {first5Years.map((row, idx) => (
                      <tr key={row.year} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                        <td className={`${tdC} font-semibold`}>{row.year}</td>
                        <td className={tdC}>{row.age}</td>
                        <td className={tdC}>{fmt(row.basicSalary)}</td>
                        <td className={`${tdC} text-blue-600`}>{fmt(row.employeeContrib)}</td>
                        <td className={tdC}>{fmt(row.employerContrib)}</td>
                        <td className={`${tdC} text-emerald-600 font-semibold`}>{fmt(row.interest)}</td>
                        <td className={`${tdC} font-bold text-gray-900`}>{fmt(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 italic">Showing years 1–5. Use the calculator above to see all 28 years interactively.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 7: FAQ ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">EPF Calculator — Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              q: 'What is the EPF interest rate for 2025–26?',
              a: 'EPFO declared 8.25% p.a. for FY 2024–25 — same as FY 2023–24. The rate is announced annually by the EPFO Central Board of Trustees and approved by the Finance Ministry. Interest is calculated monthly but credited to your account at the end of the financial year.',
            },
            {
              q: 'How do I check my EPF balance?',
              a: 'Four ways: (1) EPFO member portal at epfindia.gov.in using UAN login, (2) UMANG app, (3) SMS "EPFOHO UAN ENG" to 7738299899, (4) Missed call to 011-22901406 from your registered mobile. Your UAN (Universal Account Number) is required for all methods.',
            },
            {
              q: 'Can I withdraw EPF before retirement?',
              a: 'Yes, partial withdrawal is allowed for specific reasons: medical emergency (6 months\' salary), home purchase (90% of corpus), marriage/education (50% of employee share after 7 years). Full withdrawal is allowed after retirement (age 58) or after 2 months of unemployment. Withdrawal before 5 years attracts TDS at 10% (with PAN) or 34.6% (without PAN).',
            },
            {
              q: 'What happens to EPF when I change jobs?',
              a: 'Always transfer your EPF to your new employer using the UAN portal (Online Transfer Claim). Never withdraw — this preserves your 5-year continuity for tax-free treatment and maintains your EPS pension service record. The transfer is online and typically completes in 3–5 working days.',
            },
            {
              q: 'Is EPF better than NPS?',
              a: 'For most salaried employees: EPF+VPF is better because returns are guaranteed (8.25%) and 100% tax-free at maturity. NPS returns are market-linked and only 60% is tax-free at withdrawal (40% must be converted to annuity). However, NPS gives an additional ₹50,000 deduction under 80CCD(1B) beyond the ₹1.5 lakh 80C limit — making both together optimal for high earners.',
            },
            {
              q: 'What is the EPF wage ceiling?',
              a: 'The current EPF wage ceiling is ₹15,000/month basic salary. Employees with basic salary above ₹15,000 are "excluded employees" and EPF contribution becomes voluntary. However, if you were already a member when salary crossed ₹15,000, contributions continue on actual salary. Employer\'s EPS contribution is always capped at 8.33% of ₹15,000 = ₹1,250/month regardless of actual salary.',
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
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'NPS Calculator', href: '/calculator/nps' },
              { label: 'Gratuity Calculator', href: '/calculator/gratuity' },
              { label: 'SWP Calculator', href: '/calculator/swp' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
              { label: 'HRA Calculator', href: '/calculator/hra' },
              { label: 'Income Tax Calculator', href: '/calculator/income-tax' },
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
