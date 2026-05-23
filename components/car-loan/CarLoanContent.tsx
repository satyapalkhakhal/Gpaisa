import Link from 'next/link';

const Th = ({ c, right }: { c: string; right?: boolean }) => (
  <th className={`px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 ${right ? 'text-right' : 'text-left'}`}>{c}</th>
);
const Td = ({ c, right, bold, color }: { c: string; right?: boolean; bold?: boolean; color?: string }) => (
  <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${right ? 'text-right' : ''} ${bold ? 'font-bold' : ''} ${color ?? 'text-gray-700'}`}>{c}</td>
);

export default function CarLoanContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. Bank Rate Comparison */}
      <section aria-labelledby="car-rates-heading">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 id="car-rates-heading" className="text-xl md:text-2xl font-bold text-gray-900">Car Loan Interest Rates — May 2026</h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">Updated: May 2026</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-3">
          <table className="w-full text-sm">
            <thead><tr>{['Bank','New Car','Used Car','Processing Fee','Foreclosure'].map((h,i) => <Th key={i} c={h} right={i>0} />)}</tr></thead>
            <tbody>
              {[
                ['SBI Car Loan','8.75%–10.85%','10.75%–12.85%','Nil (limited period)','Nil'],
                ['HDFC Bank','9.10%–10.75%','11.00%–13.50%','₹3,500–₹6,500','Nil (floating)'],
                ['ICICI Bank','9.10%–10.90%','11.00%–14.00%','₹3,500 onwards','Nil (floating)'],
                ['Axis Bank','9.15%–10.80%','11.25%–13.75%','₹3,500–₹5,500','Nil'],
                ['Kotak Mahindra','9.25%–12.00%','12.00%–14.50%','₹5,000','5% (within 1yr)'],
                ['Bank of Baroda','8.80%–10.65%','11.00%–13.00%','₹1,500–₹5,000','Nil'],
                ['Federal Bank','9.30%–11.00%','12.00%–15.00%','1% of loan','2%'],
                ['IndusInd Bank','9.50%–13.00%','12.50%–16.00%','₹3,500–₹7,500','5%'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-50">{row[0]}</td>
                  {row.slice(1).map((v, j) => <Td key={j} c={v} right bold={j===0} color={j===0 ? 'text-blue-700' : j===4 ? 'text-emerald-600' : 'text-gray-700'} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">Rates are indicative. Final rate depends on credit score, income, and vehicle type. Verify on official bank websites before applying. Rates updated May 2026.</p>
      </section>

      {/* 2. EMI Per Lakh Reference */}
      <section aria-labelledby="emi-ref-heading">
        <h2 id="emi-ref-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Car Loan EMI Per ₹1 Lakh — Quick Reference</h2>
        <p className="text-sm text-gray-500 mb-4">Tip: For ₹10 lakh loan, multiply all values by 10.</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead><tr>{['Rate','3 Years','5 Years','7 Years'].map((h,i) => <Th key={i} c={h} right={i>0} />)}</tr></thead>
            <tbody>
              {[
                ['8.75%','₹3,165','₹2,063','₹1,580'],
                ['9.00%','₹3,180','₹2,076','₹1,609'],
                ['9.50%','₹3,195','₹2,100','₹1,622'],
                ['10.00%','₹3,227','₹2,125','₹1,650'],
                ['10.50%','₹3,250','₹2,149','₹1,678'],
                ['11.00%','₹3,274','₹2,174','₹1,706'],
                ['12.00%','₹3,321','₹2,225','₹1,765'],
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-blue-50/30 transition-colors ${row[0]==='9.50%' ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-50">{row[0]}</td>
                  {row.slice(1).map((v, j) => <Td key={j} c={v} right bold={j===1} color={j===1 ? 'text-blue-700' : 'text-gray-700'} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Worked Example */}
      <section aria-labelledby="car-example-heading">
        <h2 id="car-example-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Worked Example — How Car Loan EMI is Calculated</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 md:p-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            <strong>Rahul</strong>, a 32-year-old IT professional in Pune, wants to buy a Maruti Suzuki Swift at <strong>₹10,00,000</strong> on-road price. He pays <strong>₹2,00,000</strong> as down payment and takes a loan of <strong>₹8,00,000</strong> from HDFC Bank at <strong>9.10%</strong> for <strong>5 years</strong>.
          </p>
          <div className="bg-white rounded-xl p-4 border border-blue-100 font-mono text-sm text-gray-800 space-y-1 mb-4">
            <p>EMI = P × r × (1+r)^n / ((1+r)^n - 1)</p>
            <p>P = ₹8,00,000 | r = 9.10%/12 = 0.7583% | n = 60 months</p>
            <p>EMI = ₹8,00,000 × 0.007583 × (1.007583)^60 / ((1.007583)^60 - 1)</p>
            <p className="font-bold text-blue-700">= ₹16,660/month</p>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex justify-between"><span className="text-gray-500">Total paid</span><span className="font-semibold">₹16,660 × 60 = ₹9,99,600</span></li>
            <li className="flex justify-between"><span className="text-gray-500">Total interest</span><span className="font-semibold text-red-500">₹1,99,600 (24.9% of loan)</span></li>
            <li className="flex justify-between border-t border-blue-100 pt-1.5"><span className="text-gray-500">Monthly cost as % of ₹75,000 salary</span><span className="font-semibold text-emerald-600">22.2% — within safe limit</span></li>
          </ul>
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            💡 <strong>Tip:</strong> Most banks recommend your car EMI should not exceed 15–20% of monthly take-home salary. At ₹75,000 salary, max advisable EMI = ₹11,250–₹15,000.
          </div>
        </div>
      </section>

      {/* 4. New Car vs Used Car */}
      <section aria-labelledby="car-compare-heading">
        <h2 id="car-compare-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">New Car Loan vs Used Car Loan — Key Differences</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Factor" /><Th c="New Car Loan" /><Th c="Used Car Loan" /></tr></thead>
            <tbody>
              {[
                ['Interest rate','8.75%–12%','10.75%–16%'],
                ['Max loan tenure','7–8 years','3–5 years'],
                ['LTV (Loan-to-Value)','Up to 90%','Up to 80%'],
                ['Processing fee','Lower (₹0–₹5,000)','Higher (₹3,000–₹10,000)'],
                ['Documentation','Simpler','More complex (RC, insurance)'],
                ['Resale risk','Lower','Higher'],
                ['Best for','Budget planning, tax savings','Lower upfront cost, older models'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color="text-blue-700" />
                  <Td c={row[2]} color="text-amber-700" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">For cars older than 3 years, some banks limit tenure to 3 years maximum. Cars older than 7 years may not be eligible for financing at most banks.</p>
      </section>

      {/* 5. Eligibility */}
      <section aria-labelledby="car-eligibility-heading">
        <h2 id="car-eligibility-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Car Loan Eligibility — What Banks Actually Check</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
            <div><p className="text-sm font-bold text-blue-700 mb-1">✅ Credit Score</p><ul className="text-xs text-gray-700 space-y-1"><li>CIBIL 750+ → best rates (8.75%–9.50%)</li><li>CIBIL 700–749 → standard rates (+0.5% to +1%)</li><li>CIBIL 650–699 → higher rates or rejection</li><li>Below 650 → most banks reject; NBFCs may offer at 14–18%</li></ul></div>
            <div><p className="text-sm font-bold text-blue-700 mb-1">✅ Income Requirement</p><ul className="text-xs text-gray-700 space-y-1"><li>Salaried: min ₹2–3 lakh annual income</li><li>Self-employed: min ₹2.5–4 lakh annual ITR</li><li>Min 1 year employment / 2 years in business</li></ul></div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
            <div><p className="text-sm font-bold text-blue-700 mb-1">✅ Age</p><p className="text-xs text-gray-700">Minimum 21 years | Maximum 65–70 years at loan maturity</p></div>
            <div><p className="text-sm font-bold text-blue-700 mb-1">✅ LTV (Loan-to-Value)</p><ul className="text-xs text-gray-700 space-y-1"><li>New car: banks finance up to 85–90% of on-road price</li><li>Used car: banks finance up to 70–80% of car valuation</li></ul></div>
            <div><p className="text-sm font-bold text-blue-700 mb-1">✅ Safe EMI Rule</p><p className="text-xs text-gray-700">Total EMIs (car + home + personal) should not exceed 40–50% of monthly take-home salary.</p><p className="text-xs text-gray-500 mt-1">Example: Salary ₹60,000/month → max total EMI = ₹24,000–₹30,000</p></div>
          </div>
        </div>
      </section>

      {/* 7. Tips */}
      <section aria-labelledby="car-tips-heading">
        <h2 id="car-tips-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">5 Ways to Reduce Your Car Loan Cost</h2>
        <div className="space-y-4">
          {[
            { title: '1. Improve your CIBIL score before applying', desc: 'A score of 750+ vs 700 can save 0.5%–1% on rate. On ₹8L for 5 years, 1% lower rate = ₹20,000+ saved in total interest.' },
            { title: '2. Make a larger down payment', desc: '20% down instead of 10% reduces loan from ₹9L to ₹8L on a ₹10L car. Saves ₹12,500+ in total interest at 9.5%.' },
            { title: '3. Choose shorter tenure if EMI is affordable', desc: '₹8L at 9.5%: 7-year tenure = ₹3,82,640 total interest. 5-year tenure = ₹2,07,394 total interest. Saves ₹1,75,246.' },
            { title: '4. Prepay when you get annual bonus', desc: '₹1 lakh prepayment after year 1 on a 5-year ₹8L loan saves approximately ₹42,000 in interest.' },
            { title: '5. Negotiate the processing fee', desc: 'Many banks waive processing fees for salaried employees with salary accounts. SBI regularly runs zero-processing-fee campaigns. Ask explicitly.' },
          ].map((tip, i) => (
            <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-900 mb-1">{tip.title}</p>
              <p className="text-xs text-gray-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ */}
      <section aria-labelledby="car-faq-heading">
        <h2 id="car-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions — Car Loan Calculator</h2>
        <div className="space-y-3">
          {[
            ['What is the car loan interest rate in India in 2026?','Car loan interest rates in India range from 8.75% to 12.00% depending on the bank and your credit profile. SBI offers from 8.75%, HDFC from 9.10%, ICICI from 9.10%, Axis from 9.15%, and Kotak from 9.25%. Used car loans are typically 1–2% higher than new car loans.'],
            ['What is the EMI for a ₹8 lakh car loan for 7 years?','For a ₹8 lakh car loan at 9.5% interest for 7 years, the EMI is approximately ₹13,102/month. Total interest paid = ₹2,99,568. Total amount paid = ₹10,99,568. Use the calculator above to get exact figures for your loan amount and tenure.'],
            ['Which bank gives the lowest car loan interest rate in India?','SBI currently offers the lowest new car loan rate starting at 8.75% for salaried employees with a good credit score. Bank of Baroda also offers competitive rates from 8.80%. Rates vary based on credit score, employment type, loan amount, and vehicle category. Always compare the final on-road loan offer from multiple lenders.'],
            ['What is the maximum tenure for a car loan in India?','Most banks offer car loan tenures from 1 to 7 years (12 to 84 months). Some lenders like HDFC and ICICI offer up to 8 years for select models. Longer tenure means lower EMI but higher total interest paid. A 7-year loan on ₹10 lakh at 9.5% costs ₹4.73 lakh more in interest than a 5-year loan.'],
            ['Can I prepay my car loan without penalty?','Most banks allow car loan prepayment after 6–12 EMIs. RBI guidelines prohibit foreclosure charges on floating rate loans. Fixed rate car loans may have a prepayment penalty of 2–5% of the outstanding amount. SBI, HDFC, and ICICI charge nil foreclosure on floating rate car loans. Always check your loan agreement for specific terms.'],
            ['What is the minimum down payment for a car loan?','Most banks finance up to 85–90% of the car\'s on-road price, meaning a minimum down payment of 10–15% is required. For a ₹10 lakh car, you need ₹1–1.5 lakh as down payment. Some banks offer 100% financing for select models to existing customers with excellent credit. A higher down payment reduces your EMI and total interest.'],
            ['Does a car loan affect my credit score?','Yes. Taking a car loan creates a hard inquiry which may temporarily lower your CIBIL score by 5–10 points. However, making all EMIs on time consistently improves your credit score over time. Missing even one EMI can reduce your score by 50–100 points and negatively impact future loan eligibility.'],
            ['Is car loan interest tax deductible in India?','For personal use vehicles, car loan interest is NOT tax deductible in India. However, if the vehicle is used for business purposes, you can claim the interest paid as a business expense under Section 37(1) of the Income Tax Act. Self-employed individuals and business owners can thus deduct car loan interest from their taxable income.'],
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

      {/* 9. Related + Author */}
      <section className="border-t border-gray-100 pt-8 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Home Loan Calculator', href: '/calculator/home-loan' },
              { label: 'EMI Calculator', href: '/calculator/emi' },
              { label: 'FD Calculator', href: '/calculator/fd' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026
        </p>
        <p className="text-xs text-gray-400">
          Rates verified from official bank websites — May 2026 | Next update: June 2026
        </p>
      </section>
    </div>
  );
}
