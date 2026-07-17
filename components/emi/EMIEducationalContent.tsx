'use client';

import Link from 'next/link';

export default function EMIEducationalContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What is EMI */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">What is EMI?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          <strong>EMI (Equated Monthly Installment)</strong> is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month, so that over a specified number of years, the loan is paid off in full.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          EMIs apply to various types of loans — home loans, car loans, personal loans, education loans, and more. The EMI amount depends on three key factors: the loan amount (principal), the interest rate, and the loan tenure.
        </p>
      </div>

      {/* How EMI Works — Education Block */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">How EMI Works</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            {
              icon: '1️⃣',
              title: 'EMI is a fixed monthly payment',
              desc: 'Your EMI amount remains the same every month for the entire loan tenure (for fixed-rate loans). This makes budgeting easier.',
            },
            {
              icon: '2️⃣',
              title: 'Early payments go mostly toward interest',
              desc: 'In the beginning of your loan, a larger portion of your EMI goes toward paying interest. As time progresses, more goes toward reducing the principal.',
            },
            {
              icon: '3️⃣',
              title: 'Later payments reduce principal faster',
              desc: 'Toward the end of the loan tenure, most of your EMI payment reduces the outstanding principal. This is why prepayments early on save the most interest.',
            },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg border border-blue-200">
              <div className="text-xl md:text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-0.5 text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-700 text-xs md:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EMI Formula */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">EMI Calculation Formula</h2>
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-gray-200">
          <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
            EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> - 1]
          </code>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-3 mt-4">
            {[
              { var: 'P', desc: 'Principal loan amount', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { var: 'R', desc: 'Monthly interest rate', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { var: 'N', desc: 'Total months', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((item) => (
              <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                <div className="text-lg font-bold font-mono">{item.var}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          <strong>Note:</strong> R (monthly rate) = Annual rate / 12 / 100. For example, 10% annual rate = 0.00833 monthly rate.
        </p>
      </div>

      {/* Types of Loans */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Types of Loans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[
            { icon: '🏠', title: 'Home Loan', rate: '8.5% – 9.5%', tenure: 'Up to 30 years', desc: 'Longest tenure, lowest rates.' },
            { icon: '🚗', title: 'Car Loan', rate: '9% – 12%', tenure: 'Up to 7 years', desc: 'Moderate tenure, secured loan.' },
            { icon: '💰', title: 'Personal Loan', rate: '10% – 18%', tenure: 'Up to 5 years', desc: 'Unsecured, higher rates.' },
            { icon: '🎓', title: 'Education Loan', rate: '8% – 14%', tenure: 'Up to 15 years', desc: 'Moratorium period available.' },
          ].map((loan) => (
            <div key={loan.title} className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{loan.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">{loan.title}</h3>
              </div>
              <div className="space-y-1 text-xs md:text-sm text-gray-600">
                <div>Rate: <span className="font-semibold text-gray-800">{loan.rate}</span></div>
                <div>Tenure: <span className="font-semibold text-gray-800">{loan.tenure}</span></div>
                <div className="text-gray-500 text-xs">{loan.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Factors Affecting EMI */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Factors Affecting Your EMI</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: 'Loan Amount', desc: 'Higher loan amount means higher EMI. Try to maximize down payment to reduce the principal.', color: 'border-blue-500' },
            { title: 'Interest Rate', desc: 'Even 0.5% difference can save lakhs over the loan period. Compare rates across lenders.', color: 'border-orange-500' },
            { title: 'Loan Tenure', desc: 'Longer tenure reduces monthly EMI but significantly increases total interest. Choose wisely.', color: 'border-amber-500' },
            { title: 'Credit Score', desc: 'CIBIL score 750+ gets you the best interest rates. Check and improve your score before applying.', color: 'border-emerald-500' },
          ].map((factor) => (
            <div key={factor.title} className={`bg-gray-50 rounded-xl p-4 md:p-5 border-l-4 ${factor.color}`}>
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{factor.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm">{factor.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips to Reduce EMI */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Tips to Reduce Your EMI</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: '1. Make a higher down payment', desc: 'Reduces the loan principal, resulting in lower EMI and less interest over time.' },
            { title: '2. Compare interest rates', desc: 'Banks offer different rates. Even 0.25% lower can save significant money.' },
            { title: '3. Maintain a good credit score', desc: 'CIBIL 750+ qualifies you for preferential rates at most banks.' },
            { title: '4. Consider prepayments', desc: 'Partial prepayments reduce principal and either lower EMI or shorten tenure.' },
            { title: '5. Opt for balance transfer', desc: 'Switch to a lender offering lower interest rates to reduce remaining EMIs.' },
            { title: '6. Choose the right tenure', desc: 'Shorter tenure means higher EMI but much less total interest paid.' },
          ].map((tip) => (
            <div key={tip.title} className="bg-white/80 rounded-xl p-4 md:p-5 border border-blue-200">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{tip.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { q: 'What is EMI?', a: 'EMI (Equated Monthly Installment) is a fixed payment amount made monthly to repay a loan. Each EMI includes both principal and interest components.' },
            { q: 'How is EMI calculated?', a: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is the principal, R is the monthly interest rate, and N is the number of months.' },
            { q: 'Does EMI change during the loan period?', a: 'For fixed-rate loans, EMI remains constant. For floating-rate loans, EMI may change when the interest rate is revised by the lender.' },
            { q: 'Can I reduce my EMI?', a: 'Yes — through prepayments, balance transfer to lower-rate lender, extending the tenure, or negotiating a better rate with your bank.' },
            { q: 'What happens if I miss an EMI payment?', a: 'Late fees are charged, and it negatively impacts your credit score (CIBIL). Consistent defaults can lead to legal action and asset seizure for secured loans.' },
            { q: 'Is prepayment of loan beneficial?', a: 'Yes, prepayment reduces the outstanding principal, which reduces total interest paid. For home loans, there is no prepayment penalty on floating-rate loans (per RBI rules).' },
            { q: 'What is the ideal EMI-to-income ratio?', a: 'Financial experts recommend keeping total EMIs under 40% of your monthly income. Banks typically consider 50-60% of income as the maximum.' },
            { q: 'Home loan vs personal loan EMI — which is higher?', a: 'Personal loans have higher EMI because of higher interest rates (10-18%) and shorter tenure (1-5 years) compared to home loans (8-9.5%, up to 30 years).' },
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
          <Link href="/calculator/ppf" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">PPF Calculator</div>
                <div className="text-xs text-gray-600">Calculate PPF returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/home-loan" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏠</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Home Loan</div>
                <div className="text-xs text-gray-600">Home loan EMI</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/car-loan" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🚗</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Car Loan</div>
                <div className="text-xs text-gray-600">Car loan EMI</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Related Financial Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Link href="/gold-rate" className="sip-touch-target bg-white rounded-xl p-4 md:p-5 active:shadow-xl transition-shadow border border-gray-200">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Gold Rate Today</h3>
            <p className="text-gray-700 text-xs">Check live gold prices</p>
          </Link>
          <Link href="/silver-rate" className="sip-touch-target bg-white rounded-xl p-4 md:p-5 active:shadow-xl transition-shadow border border-gray-200">
            <div className="text-2xl mb-2">⚪</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Silver Rate Today</h3>
            <p className="text-gray-700 text-xs">Live silver prices</p>
          </Link>
          <Link href="/calculator/fd" className="sip-touch-target bg-white rounded-xl p-4 md:p-5 active:shadow-xl transition-shadow border border-gray-200">
            <div className="text-2xl mb-2">🏦</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">FD Calculator</h3>
            <p className="text-gray-700 text-xs">Fixed deposit returns</p>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Plan Your Loan Wisely!</h2>
        <p className="text-sm md:text-base text-blue-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          Compare EMIs across different loan options and choose the best deal for your financial goals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/finance" className="sip-touch-target bg-white text-primary-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-blue-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Explore More Tools
          </Link>
          <Link href="/calculator/sip" className="sip-touch-target bg-primary-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-primary-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            Try SIP Calculator
          </Link>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Popular Searches:</strong> emi calculator, loan emi calculator, home loan emi calculator, car loan emi calculator, personal loan emi calculator, education loan emi, emi calculation, loan calculator, monthly emi, interest calculator, amortization schedule, emi calculator india, emi calculator online, emi calculator 2024, emi calculator sbi, hdfc emi calculator
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
