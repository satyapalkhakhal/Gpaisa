// Server component — no 'use client'. FAQ accordion uses native <details> / <summary>
// so it works without JavaScript and is visible in View Source.
import Link from 'next/link';

const faqs = [
  { q: 'How much EMI do I need to pay for ₹50 lakh home loan?', a: 'For a ₹50 lakh home loan at 8.5% interest for 20 years, your monthly EMI would be approximately ₹43,391. The exact EMI depends on the interest rate and tenure you choose. Use the calculator above to get the precise EMI for your loan parameters.' },
  { q: 'What are the current home loan interest rates in India?', a: 'Home loan interest rates in India currently range from 7.20% to 9.80% across major banks (May 2026). SBI offers rates from 7.50%, HDFC Bank from 7.20%, ICICI Bank from 7.65%, and Bank of Baroda from 7.20%. Your actual rate depends on your CIBIL score, loan amount, employment type, and property location.' },
  { q: 'Can I prepay my home loan without penalty?', a: 'Yes. As per RBI guidelines, banks cannot charge any prepayment or foreclosure penalty on floating rate home loans. This applies to all banks in India — SBI, HDFC, ICICI, Axis, and others. For fixed rate loans, a prepayment penalty of up to 2% may apply. Prepaying even small amounts early in the loan tenure can significantly reduce your total interest.' },
  { q: 'Does increasing tenure reduce EMI?', a: 'Yes, increasing the loan tenure reduces your monthly EMI. However, it increases the total interest you pay over the life of the loan. For example, a ₹30L loan at 8.5%: 15 years = ₹29,542/month (₹23.2L interest) vs 25 years = ₹24,157/month (₹42.5L interest). Choose a tenure that balances affordable EMI with total cost.' },
  { q: 'How is EMI different from total interest?', a: 'EMI (Equated Monthly Installment) is the fixed amount you pay every month — it includes both principal repayment and interest. Total interest is the cumulative interest paid over the entire loan tenure. In the early years, a larger portion of EMI goes towards interest, and over time, more goes towards principal.' },
  { q: 'Is a home loan interest rate fixed or floating?', a: 'Most home loans in India are floating rate loans, linked to an external benchmark like the RBI repo rate. This means your EMI can change when the repo rate changes. Some banks offer fixed rate loans at a slightly higher rate for the first 2-3 years, then convert to floating. Most borrowers prefer floating rates as they are generally lower and allow penalty-free prepayment.' },
  { q: 'What documents are needed for a home loan?', a: 'Key documents include: Identity proof (Aadhaar, PAN), address proof, income proof (salary slips for 3 months, bank statements for 6 months, Form 16), property documents (sale agreement, title deed, approved plan), and passport-size photographs. Self-employed applicants need ITR for 3 years and business proof.' },
  { q: 'What is the maximum home loan amount I can get?', a: 'Banks typically offer home loans up to 80-90% of the property value (LTV ratio). The actual amount depends on your income, existing EMIs, credit score, age, and property value. As a rule of thumb, banks approve loans where EMI does not exceed 50-60% of your net monthly income.' },
];

export default function HomeLoanEducational() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What Affects EMI */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Home Loan EMI Guide (2026)</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
          A home loan EMI depends on three factors: <strong>loan amount</strong>, <strong>interest rate</strong>, and <strong>loan tenure</strong>. Understanding how these factors interact helps you make better financial decisions and save lakhs in interest.
        </p>

        <div className="space-y-3 md:space-y-4">
          {[
            { title: 'Loan Amount', desc: 'Higher loan = higher EMI. Try to maximize your down payment (20-30% of property value) to keep the loan amount — and EMI — lower.', icon: '💰', border: 'border-blue-500' },
            { title: 'Interest Rate', desc: 'Even a 0.5% difference in rate can save ₹2-5 lakh over 20 years. Always compare rates across banks and negotiate for the best deal.', icon: '📊', border: 'border-amber-500' },
            { title: 'Loan Tenure', desc: 'Shorter tenure = higher EMI but much less total interest. Longer tenure = lower EMI but significantly more interest paid over time.', icon: '📅', border: 'border-emerald-500' },
          ].map((item) => (
            <div key={item.title} className={`bg-gray-50 rounded-xl p-4 md:p-5 border-l-4 ${item.border}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenure Comparison */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Short vs Long Tenure: What&apos;s Better?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-blue-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-700">For ₹30L @ 8.5%</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">10 Years</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">20 Years</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">30 Years</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-100">
                <td className="py-2.5 px-3 font-medium text-gray-700">Monthly EMI</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹37,196</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹26,035</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹23,068</td>
              </tr>
              <tr className="border-b border-blue-100">
                <td className="py-2.5 px-3 font-medium text-gray-700">Total Interest</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-600">₹14.6L</td>
                <td className="py-2.5 px-3 text-right font-bold text-orange-600">₹32.5L</td>
                <td className="py-2.5 px-3 text-right font-bold text-red-600">₹53.0L</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-gray-700">Total Payment</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹44.6L</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹62.5L</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-900">₹83.0L</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-blue-700 mt-3 leading-relaxed">
          💡 <strong>Key takeaway:</strong> A 30-year tenure costs you ₹38.4 lakh MORE in interest compared to 10-year tenure, even though the monthly EMI is only ₹14,128 less.
        </p>
      </div>

      {/* Fixed vs Floating */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Fixed vs Floating Interest Rate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-amber-50 rounded-xl p-4 md:p-5 border border-amber-200">
            <h3 className="text-sm md:text-base font-bold text-amber-900 mb-2">🔒 Fixed Rate</h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-gray-700">
              <li>• Rate stays constant for initial period (2-3 yrs)</li>
              <li>• Predictable EMI, easier budgeting</li>
              <li>• Usually 0.5-1% higher than floating</li>
              <li>• Prepayment penalties may apply</li>
            </ul>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 md:p-5 border border-emerald-200">
            <h3 className="text-sm md:text-base font-bold text-emerald-900 mb-2">📈 Floating Rate</h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-gray-700">
              <li>• Linked to RBI repo rate, changes periodically</li>
              <li>• Generally lower rates</li>
              <li>• EMI may increase or decrease</li>
              <li>• No prepayment charges (by RBI rule)</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          <strong>Recommendation:</strong> Most financial experts recommend floating rate home loans for long tenures because rates tend to decrease over time and you get the flexibility to prepay without penalties.
        </p>
      </div>

      {/* Prepayment Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Benefits of Home Loan Prepayment</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { icon: '💸', title: 'Save Lakhs in Interest', desc: 'A ₹5L prepayment in year 3 on a ₹50L/20yr loan can save ₹8-10 lakh in interest.' },
            { icon: '⏱️', title: 'Reduce Loan Tenure', desc: 'Even small regular prepayments can cut your tenure by 3-5 years.' },
            { icon: '🛡️', title: 'Financial Freedom', desc: 'Becoming debt-free sooner gives you flexibility to invest elsewhere.' },
            { icon: '📉', title: 'Lower EMI Option', desc: 'Choose to reduce your monthly EMI instead, improving cash flow.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg border border-green-200">
              <div className="text-xl md:text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-0.5 text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-700 text-xs md:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Home Loan Tax Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-200">
            <h3 className="text-sm md:text-base font-bold text-blue-900 mb-2">Section 80C — Principal</h3>
            <p className="text-xs md:text-sm text-gray-700">Deduction up to <strong>₹1.5 lakh/year</strong> on principal repayment (including stamp duty and registration in the year of purchase).</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 md:p-5 border border-purple-200">
            <h3 className="text-sm md:text-base font-bold text-purple-900 mb-2">Section 24(b) — Interest</h3>
            <p className="text-xs md:text-sm text-gray-700">Deduction up to <strong>₹2 lakh/year</strong> on interest paid for self-occupied property. No limit for rented property.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 md:p-5 border border-emerald-200">
            <h3 className="text-sm md:text-base font-bold text-emerald-900 mb-2">Section 80EEA — Additional</h3>
            <p className="text-xs md:text-sm text-gray-700">First-time buyers can claim additional <strong>₹1.5 lakh</strong> deduction on interest for affordable housing (stamp value up to ₹45 lakh).</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 md:p-5 border border-amber-200">
            <h3 className="text-sm md:text-base font-bold text-amber-900 mb-2">Joint Home Loan</h3>
            <p className="text-xs md:text-sm text-gray-700">Both co-borrowers can claim <strong>individual deductions</strong>, effectively doubling the tax benefit to ₹3 lakh (80C) + ₹4 lakh (24b).</p>
          </div>
        </div>
      </div>

      {/* FAQ Section — native <details> works without JS */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-5 md:pt-6 pb-2">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 mt-1">Common questions about home loans and EMI</p>
        </div>
        <div className="px-4 md:px-6 pb-4 mt-2 space-y-2">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden" open={idx === 0}>
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none">
                <h3 className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</h3>
                <span className="text-gray-400 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Other Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">Other Financial Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: '📊', title: 'SIP Calculator', desc: 'Mutual fund returns', href: '/calculator/sip' },
            { icon: '🏦', title: 'EMI Calculator', desc: 'General loan EMI', href: '/calculator/emi' },
            { icon: '🚗', title: 'Car Loan Calculator', desc: 'Car loan EMI', href: '/calculator/car-loan' },
            { icon: '💼', title: 'EPF Calculator', desc: 'Provident fund returns', href: '/calculator/epf' },
            { icon: '📈', title: 'FD Calculator', desc: 'Fixed deposit returns', href: '/calculator/fd' },
          ].map((calc) => (
            <a key={calc.href} href={calc.href} className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 active:shadow-lg transition-all">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{calc.icon}</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{calc.title}</div>
                  <div className="text-xs text-gray-600">{calc.desc}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Plan Your Dream Home Today!</h2>
        <p className="text-sm md:text-base text-blue-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          Use our advanced home loan calculator with prepayment analysis and amortization schedule to plan the most efficient repayment strategy.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/calculator/sip" className="sip-touch-target bg-white text-primary-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-blue-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Try SIP Calculator
          </Link>
          <Link href="/calculator/fd" className="sip-touch-target bg-primary-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-primary-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            FD Calculator
          </Link>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Popular Searches:</strong> home loan calculator, home loan EMI calculator, HDFC home loan calculator, SBI home loan EMI, housing loan calculator, home loan interest calculator, mortgage calculator India, amortization schedule, home loan prepayment calculator, home loan tax benefits, Section 80C home loan, home loan eligibility calculator 2026
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: May 2026
          </p>
        </div>
      </div>
    </div>
  );
}
