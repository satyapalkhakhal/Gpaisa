import Link from 'next/link';

export default function IncomeTaxContent() {
  return (
    <div className="space-y-10 md:space-y-14 text-gray-700">

      {/* ─── 1. New Regime Slabs ─── */}
      <section aria-labelledby="new-regime-heading">
        <h2 id="new-regime-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          New Tax Regime Slabs — FY 2026-27 (AY 2027-28)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          The new regime (Section 115BAC) is the default regime unless you opt for the old one. Budget 2026 made no changes to these slabs versus FY 2025-26. Standard deduction of ₹75,000 applies for salaried individuals and pensioners.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Taxable Income</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { range: '₹0 – ₹4,00,000', rate: 'Nil' },
                { range: '₹4,00,000 – ₹8,00,000', rate: '5%' },
                { range: '₹8,00,000 – ₹12,00,000', rate: '10%' },
                { range: '₹12,00,000 – ₹16,00,000', rate: '15%' },
                { range: '₹16,00,000 – ₹20,00,000', rate: '20%' },
                { range: '₹20,00,000 – ₹24,00,000', rate: '25%' },
                { range: 'Above ₹24,00,000', rate: '30%' },
              ].map((row) => (
                <tr key={row.range} className="bg-white hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.range}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{row.rate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          <strong>Section 87A rebate:</strong> taxable income up to ₹12,00,000 gets a rebate of up to ₹60,000 — making tax effectively nil up to that point (₹12.75 lakh gross salary, after the ₹75,000 standard deduction).
        </p>
      </section>

      {/* ─── 2. Old Regime Slabs ─── */}
      <section aria-labelledby="old-regime-heading">
        <h2 id="old-regime-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Old Tax Regime Slabs — FY 2026-27
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          The old regime keeps its full range of deductions (80C, HRA, home loan interest, etc.) but at a lower basic exemption. Standard deduction of ₹50,000 applies for salaried individuals and pensioners. The exemption limit depends on age.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Taxable Income</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Below 60</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">60–80 (Senior)</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Above 80 (Super Senior)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">Up to ₹2,50,000</td><td className="px-4 py-3">Nil</td><td className="px-4 py-3">Nil</td><td className="px-4 py-3">Nil</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹2,50,000 – ₹3,00,000</td><td className="px-4 py-3 text-orange-600 font-semibold">5%</td><td className="px-4 py-3">Nil</td><td className="px-4 py-3">Nil</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹3,00,000 – ₹5,00,000</td><td className="px-4 py-3 text-orange-600 font-semibold">5%</td><td className="px-4 py-3 text-orange-600 font-semibold">5%</td><td className="px-4 py-3">Nil</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹5,00,000 – ₹10,00,000</td><td className="px-4 py-3 text-red-600 font-semibold">20%</td><td className="px-4 py-3 text-red-600 font-semibold">20%</td><td className="px-4 py-3 text-red-600 font-semibold">20%</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">Above ₹10,00,000</td><td className="px-4 py-3 text-red-700 font-semibold">30%</td><td className="px-4 py-3 text-red-700 font-semibold">30%</td><td className="px-4 py-3 text-red-700 font-semibold">30%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          <strong>Section 87A rebate:</strong> taxable income up to ₹5,00,000 gets a rebate of up to ₹12,500 — making tax effectively nil up to that point, regardless of age.
        </p>
      </section>

      {/* ─── 3. Surcharge & Cess ─── */}
      <section aria-labelledby="surcharge-heading">
        <h2 id="surcharge-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Surcharge and Cess
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Taxable Income</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Old Regime</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">New Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹50 lakh – ₹1 crore</td><td className="px-4 py-3">10%</td><td className="px-4 py-3">10%</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹1 crore – ₹2 crore</td><td className="px-4 py-3">15%</td><td className="px-4 py-3">15%</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">₹2 crore – ₹5 crore</td><td className="px-4 py-3">25%</td><td className="px-4 py-3 text-emerald-600 font-semibold">25% (capped)</td></tr>
              <tr className="bg-white"><td className="px-4 py-3 font-medium text-gray-800">Above ₹5 crore</td><td className="px-4 py-3">37%</td><td className="px-4 py-3 text-emerald-600 font-semibold">25% (capped)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          A 4% Health &amp; Education Cess applies on (tax + surcharge) under both regimes. The new regime caps surcharge at 25% — it never reaches the old regime&apos;s 37% top rate, even above ₹5 crore.
        </p>
      </section>

      {/* ─── 4. Worked Example ─── */}
      <section aria-labelledby="example-heading">
        <h2 id="example-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Worked Example — ₹12,00,000 Salary
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">New Regime</p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">Standard Deduction</span><span className="font-semibold">₹75,000</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Taxable Income</span><span className="font-semibold">₹11,25,000</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Tax (before rebate)</span><span className="font-semibold">₹52,500</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Rebate (Sec 87A)</span><span className="font-semibold text-emerald-600">− ₹52,500</span></li>
              <li className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5"><span className="font-semibold text-gray-800">Total Tax Payable</span><span className="font-bold text-gray-900">₹0</span></li>
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Old Regime (with ₹1.5L 80C)</p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">Standard Deduction + 80C</span><span className="font-semibold">₹2,00,000</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Taxable Income</span><span className="font-semibold">₹10,00,000</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Tax (before rebate)</span><span className="font-semibold">₹1,12,500</span></li>
              <li className="flex justify-between"><span className="text-gray-500">Rebate (Sec 87A)</span><span className="font-semibold text-gray-400">₹0 (income &gt; ₹5L)</span></li>
              <li className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5"><span className="font-semibold text-gray-800">Total Tax Payable</span><span className="font-bold text-gray-900">₹1,17,000</span></li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          At ₹12 lakh gross salary with just the standard ₹1.5 lakh Section 80C investment, the <strong>new regime results in zero tax</strong> thanks to the ₹12 lakh Section 87A rebate threshold, while the old regime still owes ₹1,17,000. Old regime only wins once your total deductions (80C + HRA + home loan interest + NPS) are large enough to push taxable income below ₹5 lakh, or are otherwise unusually large — use the calculator above with your own numbers rather than relying on rules of thumb.
        </p>
      </section>

      {/* ─── 5. FAQ Section ─── */}
      <section aria-labelledby="tax-faq-heading">
        <h2 id="tax-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — Income Tax Calculator
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Which tax regime should I choose — old or new?',
              a: 'It depends on your total deductions. If your 80C, HRA, home loan interest, and other deductions add up to a large amount relative to your income, the old regime may work out cheaper. For most people with modest deductions, the new regime\'s lower rates and higher rebate threshold (₹12 lakh) result in less tax. Compare both using the calculator above with your actual numbers.',
            },
            {
              q: 'Is the new tax regime the default now?',
              a: 'Yes. Since FY 2023-24, the new tax regime under Section 115BAC is the default. You must actively opt for the old regime when filing your return (or inform your employer for TDS purposes) if you want to use it.',
            },
            {
              q: 'Can I switch between old and new regime every year?',
              a: 'Salaried individuals with no business income can switch between regimes every financial year. Individuals with business or professional income can switch only once in their lifetime back to the old regime after opting for the new one.',
            },
            {
              q: 'Is HRA exemption available under the new tax regime?',
              a: 'No. HRA exemption, Section 80C, home loan interest (Section 24b), and most other deductions are not available under the new tax regime. The new regime instead offers a standard deduction of ₹75,000 and lower slab rates.',
            },
            {
              q: 'What is the Section 87A rebate?',
              a: 'It is a rebate that reduces your tax liability to zero if your taxable income is below a threshold — ₹5,00,000 under the old regime (rebate up to ₹12,500) and ₹12,00,000 under the new regime (rebate up to ₹60,000). It applies before surcharge and cess.',
            },
            {
              q: 'Does this calculator account for surcharge marginal relief?',
              a: 'No. Marginal relief on surcharge — which caps the extra tax so it doesn\'t exceed the amount by which income crosses a surcharge threshold — is not applied here. This only affects incomes very close to the ₹50 lakh, ₹1 crore, ₹2 crore, or ₹5 crore thresholds. Consult a CA if your income falls near these points.',
            },
          ].map(({ q, a }, i) => (
            <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm md:text-base select-none list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ─── 6. Author byline + Related Calculators ─── */}
      <section className="border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500 mb-6">
          Content by <strong className="text-gray-700">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated for FY 2026-27: July 2026
        </p>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'HRA Calculator', href: '/calculator/hra' },
              { label: 'EPF Calculator', href: '/calculator/epf' },
              { label: 'NPS Calculator', href: '/calculator/nps' },
              { label: 'Gratuity Calculator', href: '/calculator/gratuity' },
              { label: 'PPF Calculator', href: '/calculator/ppf' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
