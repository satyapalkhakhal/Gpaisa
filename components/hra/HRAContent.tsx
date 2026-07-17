import Link from 'next/link';

const Th = ({ c }: { c: string }) => <th className="px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 text-left">{c}</th>;
const Td = ({ c, color }: { c: string; color?: string }) => <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${color ?? 'text-gray-700'}`}>{c}</td>;

export default function HRAContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. Formula */}
      <section aria-labelledby="hra-formula-heading">
        <h2 id="hra-formula-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          How is HRA Exemption Calculated? The Three-Component Formula
        </h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          HRA exemption under <strong>Section 10(13A)</strong> is the <strong>minimum</strong> of these three amounts:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-5">
          <table className="w-full text-sm">
            <thead><tr><Th c="Component" /><Th c="Formula" /><Th c="In Our Example" /></tr></thead>
            <tbody>
              {[
                ['1. Actual HRA received', 'As per salary slip', '₹20,000/month = ₹2,40,000/year'],
                ['2. Rent paid minus 10% of Basic+DA', 'Monthly rent − (10% × Basic+DA) × 12', '(₹15,000 − ₹5,000) × 12 = ₹1,20,000'],
                ['3. % of Basic+DA', '50% for metro, 40% for non-metro', '₹50,000 × 50% × 12 = ₹3,00,000'],
                ['HRA Exempt', 'Least of above three ✓', '₹1,20,000'],
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-sky-50/20 ${i === 3 ? 'bg-sky-50' : ''}`}>
                  <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${i === 3 ? 'font-bold text-sky-700' : 'font-medium text-gray-800'}`}>{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} color={i === 3 ? 'text-sky-700 font-semibold' : 'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-gray-700">
          The exempt amount (<strong>₹1,20,000</strong> in this example) is deducted from your total taxable income. At the <strong>30% tax bracket</strong>, this saves <strong>₹36,000 in annual income tax</strong>.
        </div>
      </section>

      {/* 2. Worked Example */}
      <section aria-labelledby="hra-example-heading">
        <h2 id="hra-example-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          HRA Calculation Example — Step by Step (Priya, Mumbai)
        </h2>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 md:p-6 space-y-4">
          <p className="text-sm text-gray-700">
            <strong>Priya</strong> works in <strong>Mumbai</strong> (metro city) with these salary components:
            Basic ₹60,000/month | HRA ₹24,000/month | Rent paid ₹20,000/month
          </p>
          <div className="space-y-2">
            {[
              ['Step 1 — Component 1', 'Actual HRA received', '₹24,000 × 12 = ₹2,88,000'],
              ['Step 2 — Component 2', 'Rent paid − 10% of Basic', '(₹20,000 − ₹6,000) × 12 = ₹1,68,000'],
              ['Step 3 — Component 3', '50% of Basic (Mumbai is metro)', '₹60,000 × 50% × 12 = ₹3,60,000'],
              ['Step 4 — Least of three', 'HRA Exempt amount', '₹1,68,000 ✓'],
            ].map(([step, label, val], i) => (
              <div key={i} className={`flex justify-between items-start gap-4 bg-white rounded-xl px-4 py-3 border ${i === 3 ? 'border-sky-200' : 'border-gray-100'}`}>
                <div>
                  <p className="text-xs font-bold text-sky-600">{step}</p>
                  <p className="text-sm text-gray-700">{label}</p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${i === 3 ? 'text-sky-700' : 'text-gray-800'}`}>{val}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-sky-100 pt-3 grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-gray-500 text-xs">Taxable HRA</p><p className="font-bold text-orange-600">₹2,88,000 − ₹1,68,000 = ₹1,20,000</p></div>
            <div><p className="text-gray-500 text-xs">Tax saved @ 30% slab</p><p className="font-bold text-emerald-600">₹1,68,000 × 30% = ₹50,400/year</p></div>
          </div>
        </div>
      </section>

      {/* 3. Metro vs Non-Metro */}
      <section aria-labelledby="hra-metro-heading">
        <h2 id="hra-metro-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Which Cities Are Metro for HRA Calculation?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="City Type" /><Th c="Cities" /><Th c="HRA % of Basic+DA" /></tr></thead>
            <tbody>
              <tr className="hover:bg-sky-50/20">
                <td className="px-3 py-3 text-sm font-bold text-sky-700 border-b border-gray-50">Metro</td>
                <Td c="Delhi, Mumbai (incl. Navi Mumbai & Thane), Kolkata, Chennai" color="text-gray-800 font-medium" />
                <td className="px-3 py-3 text-sm font-bold text-sky-700 border-b border-gray-50">50%</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-3 py-3 text-sm font-semibold text-gray-700 border-b border-gray-50">Non-Metro</td>
                <Td c="Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur, Surat, all other cities" />
                <Td c="40%" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-gray-700">
          <strong>Important:</strong> Despite being major cities, <strong>Bengaluru and Hyderabad are classified as non-metro</strong> for HRA purposes. Many employees in these cities incorrectly claim the 50% limit and face issues during ITR filing. Use the 40% limit if you live in these cities.
        </div>
      </section>

      {/* 4. Old vs New Tax Regime */}
      <section aria-labelledby="hra-regime-heading">
        <h2 id="hra-regime-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          HRA Under Old vs New Tax Regime (2026)
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="Old Tax Regime" /><Th c="New Tax Regime" /></tr></thead>
            <tbody>
              {[
                ['HRA exemption', 'Yes — Section 10(13A)', 'No — HRA fully taxable'],
                ['Standard deduction', '₹50,000', '₹75,000 (Budget 2024)'],
                ['Tax slabs', 'Higher rates', 'Lower rates'],
                ['Best for', 'High HRA + 80C + 80D', 'Low deductions, simpler filing'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i === 0 ? 'text-emerald-700 font-semibold' : 'text-gray-700'} />
                  <Td c={row[2]} color={i === 0 ? 'text-red-600 font-semibold' : 'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-gray-700 space-y-2">
          <p>If you pay significant rent and receive HRA, the <strong>old tax regime is almost always better</strong>.</p>
          <p className="text-gray-500 text-xs"><strong>Rule of thumb:</strong> If HRA exemption + other deductions (80C, 80D, home loan interest) exceed ₹3.75 lakh/year, the old regime likely saves you more tax.</p>
        </div>
      </section>

      {/* 5. Form 12BB */}
      <section aria-labelledby="hra-12bb-heading">
        <h2 id="hra-12bb-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          How to Claim HRA Exemption — Form 12BB and Rent Receipts
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>To claim HRA exemption from your employer&apos;s TDS calculation, submit <strong>Form 12BB</strong> — a declaration form specifying your rent paid, landlord&apos;s name, and landlord&apos;s PAN (if annual rent exceeds ₹1 lakh). Submit at the start of each financial year (April) or when rent changes.</p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-amber-800 font-semibold mb-1">If annual rent &gt; ₹1,00,000 (₹8,333+/month)</p>
            <p className="text-amber-700 text-xs">Your landlord&apos;s PAN is mandatory. Without it, your employer cannot apply the full HRA exemption in TDS — you will need to claim it yourself during ITR filing.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1.5">Documents needed:</p>
            <ul className="space-y-1 text-gray-600 text-xs">
              {['Rent receipts (monthly, signed by landlord)', 'Rent agreement (recommended)', "Landlord's PAN card if rent > ₹1 lakh/year", 'Form 12BB (submit to HR/payroll)'].map((d, i) => <li key={i} className="flex gap-2"><span className="text-sky-500">•</span>{d}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Section 80GG */}
      <section aria-labelledby="hra-80gg-heading">
        <h2 id="hra-80gg-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Don&apos;t Receive HRA? Claim Rent Deduction Under Section 80GG
        </h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If your salary does not include an HRA component — common for self-employed individuals, freelancers, and some small company employees — you can still claim a deduction for rent paid under <strong>Section 80GG</strong>.
        </p>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-bold text-indigo-800">Section 80GG deduction is the minimum of:</p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            {['₹5,000 per month (₹60,000/year)', '25% of total income', 'Actual rent paid minus 10% of total income'].map((t, i) => (
              <li key={i} className="flex gap-2 bg-white rounded-lg px-3 py-2 border border-indigo-100"><span className="text-indigo-500 font-bold">{i + 1}.</span>{t}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 bg-white rounded-xl px-3 py-2 border border-indigo-100">
            Section 80GG is only available under the old tax regime and only if neither you, your spouse, nor your minor child owns a residential property in the city where you work.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section aria-labelledby="hra-faq-heading">
        <h2 id="hra-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — HRA Calculator
        </h2>
        <div className="space-y-3">
          {[
            ['What is the HRA exemption limit in India for 2026?', 'There is no fixed rupee limit — it depends on your salary. The exempt amount is the minimum of: actual HRA received, rent paid minus 10% of Basic+DA, and 50% of Basic+DA for metro cities (40% for non-metro). Use the calculator above to find your exact exempt amount.'],
            ['Is HRA available under the new tax regime?', 'No. HRA exemption under Section 10(13A) is only available under the old tax regime. If you opt for the new tax regime, your entire HRA component becomes part of taxable salary. You must compare both regimes to decide which saves you more tax overall.'],
            ['What is the HRA limit for metro cities vs non-metro cities?', 'For metro cities (Delhi, Mumbai, Kolkata, Chennai), the HRA cap is 50% of Basic+DA. For non-metro cities (including Bengaluru, Hyderabad, Pune, Ahmedabad), the cap is 40% of Basic+DA. Bengaluru and Hyderabad — despite being large cities — are classified as non-metro for HRA purposes.'],
            ['Do I need landlord\'s PAN for HRA claim?', 'Yes, if your annual rent exceeds ₹1,00,000 (₹8,333+ per month), you must provide your landlord\'s PAN to your employer. If the landlord does not have a PAN, they must provide a declaration. Without this, claim the HRA exemption yourself when filing your ITR.'],
            ['Can I claim HRA if I live in my own house?', 'No. HRA exemption is specifically for employees paying rent for accommodation. If you own the house you live in, no HRA exemption is applicable — even if HRA is part of your salary package. In that case, HRA received is fully taxable.'],
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
            {[['Income Tax Calculator', '/calculator/income-tax'], ['EPF Calculator', '/calculator/epf'], ['SIP Calculator', '/calculator/sip'], ['Home Loan Calculator', '/calculator/home-loan'], ['NPS Calculator', '/calculator/nps']].map(([l, h]) => (
              <Link key={h} href={h} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sm font-medium text-sky-700 hover:bg-sky-100 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026</p>
      </section>
    </div>
  );
}
