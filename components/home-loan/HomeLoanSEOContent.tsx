// Static SEO content sections for Home Loan Calculator
// Rendered server-side — visible in View Source with JS disabled

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

// Pre-calculated EMI per lakh values
const emiPerLakhData = [
  { rate: '7.50%', y10: 1187, y15: 927, y20: 806, y25: 739, y30: 699 },
  { rate: '8.00%', y10: 1213, y15: 956, y20: 836, y25: 772, y30: 734 },
  { rate: '8.50%', y10: 1240, y15: 985, y20: 868, y25: 805, y30: 769 },
  { rate: '9.00%', y10: 1267, y15: 1014, y20: 900, y25: 840, y30: 805 },
  { rate: '9.50%', y10: 1294, y15: 1044, y20: 932, y25: 874, y30: 841 },
];

const bankRatesData = [
  { bank: 'SBI', min: '7.50%', max: '8.70%', emiRange: '₹806 – ₹873' },
  { bank: 'HDFC Bank', min: '7.20%', max: '13.20%', emiRange: '₹789 – ₹1,026' },
  { bank: 'ICICI Bank', min: '7.65%', max: '9.80%', emiRange: '₹818 – ₹940' },
  { bank: 'Axis Bank', min: '8.35%', max: '11.90%', emiRange: '₹857 – ₹1,011' },
  { bank: 'Kotak Mahindra', min: '7.70%', max: '9.40%', emiRange: '₹822 – ₹914' },
  { bank: 'PNB', min: '7.30%', max: '9.30%', emiRange: '₹793 – ₹906' },
  { bank: 'Bank of Baroda', min: '7.20%', max: '9.00%', emiRange: '₹789 – ₹900' },
];

const faqItems = [
  {
    q: 'What is the home loan EMI for ₹30 lakh?',
    a: 'At 8.5% interest rate for 20 years, the monthly EMI for a ₹30 lakh home loan is approximately ₹26,030. The total interest payable over the tenure would be around ₹32.47 lakh, making the total repayment ₹62.47 lakh. You can reduce this by choosing a shorter tenure or making prepayments.',
  },
  {
    q: 'What CIBIL score is needed for a home loan?',
    a: 'Most banks require a minimum CIBIL score of 650–700 to approve a home loan. However, a score of 750 or above qualifies you for the lowest interest rates — typically 0.25% to 0.50% lower than standard rates. For example, SBI offers preferential rates starting at 7.50% for applicants with a CIBIL score above 750.',
  },
  {
    q: 'Can I get a home loan on ₹25,000 monthly salary?',
    a: 'Yes. Banks typically allow an EMI-to-income ratio of 40–50%. On a ₹25,000 salary, your maximum EMI would be ₹10,000–₹12,500. At 8.5% interest for 20 years (EMI per lakh = ₹868), this qualifies you for a home loan of approximately ₹11.5–₹14.4 lakh. A co-applicant\'s income can increase your eligibility significantly.',
  },
];

const thClass = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap';
const tdClass = 'px-3 py-2.5 text-sm text-gray-800 font-medium';
const tdRightClass = 'px-3 py-2.5 text-sm text-gray-800 font-medium text-right';

export default function HomeLoanSEOContent() {
  return (
    <div className="space-y-5 md:space-y-6">

      {/* Section A — EMI Per Lakh Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Home Loan EMI Per Lakh (₹)</h3>
          <p className="text-xs text-gray-500 mt-0.5">Monthly EMI for every ₹1,00,000 borrowed at different rates and tenures</p>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-4 md:pb-5">
          <table className="w-full text-xs md:text-sm min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thClass}>Interest Rate</th>
                <th className={`${thClass} text-right`}>10 Years</th>
                <th className={`${thClass} text-right`}>15 Years</th>
                <th className={`${thClass} text-right`}>20 Years</th>
                <th className={`${thClass} text-right`}>25 Years</th>
                <th className={`${thClass} text-right`}>30 Years</th>
              </tr>
            </thead>
            <tbody>
              {emiPerLakhData.map((row, idx) => (
                <tr key={row.rate} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} ${row.rate === '8.50%' ? 'bg-emerald-50/50 font-semibold' : ''}`}>
                  <td className={`${tdClass} text-primary-700 font-bold`}>{row.rate}</td>
                  <td className={tdRightClass}>₹{fmt(row.y10)}</td>
                  <td className={tdRightClass}>₹{fmt(row.y15)}</td>
                  <td className={tdRightClass}>₹{fmt(row.y20)}</td>
                  <td className={tdRightClass}>₹{fmt(row.y25)}</td>
                  <td className={tdRightClass}>₹{fmt(row.y30)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-gray-400 mt-2">Example: At 8.5% for 20 years, you pay ₹868/month for every ₹1 lakh borrowed. For a ₹50L loan, EMI = 50 × ₹868 = ₹43,400.</p>
        </div>
      </div>

      {/* Section B — Current Home Loan Rates */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">🏦</span>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900">Current Home Loan Interest Rates — May 2026</h3>
              <p className="text-xs text-gray-500 mt-0.5">Compare rates and EMI across top Indian banks</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-4 md:pb-5">
          <table className="w-full text-xs md:text-sm min-w-[420px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thClass}>Bank</th>
                <th className={`${thClass} text-right`}>Min Rate</th>
                <th className={`${thClass} text-right`}>Max Rate</th>
                <th className={`${thClass} text-right`}>EMI per ₹1L (20yr)</th>
              </tr>
            </thead>
            <tbody>
              {bankRatesData.map((row, idx) => (
                <tr key={row.bank} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className={`${tdClass} font-bold text-gray-900`}>{row.bank}</td>
                  <td className={`${tdRightClass} text-emerald-600`}>{row.min}</td>
                  <td className={tdRightClass}>{row.max}</td>
                  <td className={`${tdRightClass} font-bold text-primary-700`}>{row.emiRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-gray-400 mt-2 italic">Rates sourced from Paisabazaar and official bank websites, May 2026. Actual rate depends on your CIBIL score, loan amount, income type, and property location. Verify current rates directly with the bank before applying.</p>
        </div>
      </div>

      {/* Section C — How to Reduce Your Home Loan EMI */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-base flex-shrink-0">💡</span>
            <h3 className="text-base md:text-lg font-bold text-gray-900">How to Reduce Your Home Loan EMI</h3>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-1">1. Make a Higher Down Payment</h4>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Increasing your down payment from 20% to 30% on a ₹75 lakh property reduces your loan from ₹60L to ₹52.5L. At 8.5% for 20 years, this lowers your EMI from ₹52,080 to ₹45,570 — saving ₹6,510 every month and ₹15.6 lakh in total interest.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-1">2. Improve Your CIBIL Score</h4>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Improving your CIBIL score from 700 to 750+ can reduce your interest rate by 0.25–0.50%. On a ₹50 lakh loan for 20 years, dropping from 9.0% to 8.5% saves ₹1,600/month and ₹3.84 lakh in total interest. Pay credit card bills on time and keep utilization below 30%.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-1">3. Balance Transfer to a Lower-Rate Bank</h4>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              If your current rate is 9.5% and another bank offers 8.5%, transferring a ₹40 lakh outstanding balance (15 years remaining) reduces your EMI from ₹41,760 to ₹39,400 — saving ₹2,360/month. Factor in the processing fee (0.5–1%) before switching.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-1">4. Make Lump-Sum Prepayments</h4>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              A one-time prepayment of ₹5 lakh in the 3rd year of a ₹50 lakh loan (8.5%, 20 years) can reduce your tenure by 2.5 years and save over ₹7 lakh in interest. RBI rules prohibit prepayment charges on floating-rate home loans, so there&apos;s no penalty.
            </p>
          </div>
        </div>
      </div>

      {/* Section D — Tax Benefits */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-base flex-shrink-0">🛡️</span>
            <h3 className="text-base md:text-lg font-bold text-gray-900">Tax Benefits on Home Loan in India (2026)</h3>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
              <h4 className="text-sm font-bold text-emerald-800 mb-1">Section 80C — Principal Repayment</h4>
              <p className="text-xs md:text-sm text-emerald-700 leading-relaxed">
                Claim up to <strong>₹1.5 lakh per year</strong> on principal repaid. On a ₹50L loan at 8.5% for 20 years (EMI ₹43,391), the principal component in Year 1 is approximately ₹90,000 — fully deductible under 80C. This includes stamp duty and registration charges in the year of purchase.
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3.5 border border-orange-200">
              <h4 className="text-sm font-bold text-orange-800 mb-1">Section 24(b) — Interest Deduction</h4>
              <p className="text-xs md:text-sm text-orange-700 leading-relaxed">
                Claim up to <strong>₹2 lakh per year</strong> on interest paid for a self-occupied property. In Year 1 of a ₹50L loan at 8.5%, the interest component is approximately ₹4.2 lakh — but the deduction is capped at ₹2 lakh. For let-out properties, the entire interest is deductible with no upper limit.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-200">
            <p className="text-xs md:text-sm text-blue-700 leading-relaxed">
              <strong>Combined tax saving example:</strong> If you&apos;re in the 30% tax bracket, claiming ₹1.5L (80C) + ₹2L (24b) = ₹3.5L total deduction saves you up to <strong>₹1,09,200/year</strong> in taxes (including cess). First-time home buyers may also claim an additional deduction of ₹1.5 lakh under <strong>Section 80EEA</strong> for affordable housing (stamp value up to ₹45 lakh).
            </p>
          </div>
        </div>
      </div>

      {/* Section E — FAQ (visible text) */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-4">
          {faqItems.map((item, idx) => (
            <details key={idx} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden" open={idx === 0}>
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none">
                <h4 className="text-sm font-bold text-gray-900 pr-4">{item.q}</h4>
                <span className="text-gray-400 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Author & Update Line */}
      <div className="flex items-center justify-between px-1 py-2 text-[10px] md:text-xs text-gray-400">
        <span>Content by <strong className="text-gray-500">Satyapal Khakhal</strong>, Founder, gpaisa.in</span>
        <span>Rates updated: May 2026</span>
      </div>
    </div>
  );
}

// Export FAQ items for JSON-LD schema in page.tsx
export { faqItems };
