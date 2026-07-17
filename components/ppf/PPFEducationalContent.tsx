'use client';

import Link from 'next/link';

export default function PPFEducationalContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What is PPF */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">What is Public Provident Fund (PPF)?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          <strong>Public Provident Fund (PPF)</strong> is a long-term savings scheme backed by the Government of India. It offers attractive interest rates with complete tax benefits under the EEE (Exempt-Exempt-Exempt) category. PPF is one of the safest investment options in India, ideal for building a retirement corpus or achieving long-term financial goals.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          With a lock-in period of 15 years (extendable in blocks of 5 years), PPF encourages disciplined savings while providing guaranteed returns. The scheme is available at all post offices and authorized banks across India, making it easily accessible to every Indian citizen.
        </p>
      </div>

      {/* How PPF Calculator Works */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">How Does PPF Calculator Work?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
          Our PPF calculator uses the compound interest formula to calculate your maturity amount:
        </p>
        <div className="bg-white rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-gray-200">
          <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
            F = P × [((1 + i)<sup>n</sup> - 1) / i]
          </code>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
            {[
              { var: 'F', desc: 'Maturity amount', color: 'bg-primary-50 text-primary-700 border-primary-200' },
              { var: 'P', desc: 'Yearly deposit', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { var: 'i', desc: 'Interest rate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { var: 'n', desc: 'Total years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((item) => (
              <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                <div className="text-lg font-bold font-mono">{item.var}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          Interest is compounded annually and credited to your account at the end of each financial year. Deposits made before the 5th of any month earn interest for that entire month.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Benefits of PPF Investment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: '🛡️', title: 'Government Backed', desc: '100% safe investment backed by Government of India. No market risk.' },
            { icon: '💰', title: 'EEE Tax Benefits', desc: 'Investment, interest, and maturity all completely tax-free under 80C.' },
            { icon: '📈', title: 'Attractive Returns', desc: 'Current rate 7.1% p.a. compounded annually, beats most FDs.' },
            { icon: '🔄', title: 'Flexible Deposits', desc: 'Deposit in lump sum or installments, up to 12 per year.' },
            { icon: '💳', title: 'Loan Facility', desc: 'Avail loans from 3rd to 6th year at just 2% above PPF rate.' },
            { icon: '👨‍👩‍👧', title: 'Minor Account', desc: 'Open PPF for minors — build wealth for children\'s future.' },
          ].map((b) => (
            <div key={b.title} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 md:p-5 border border-gray-100">
              <div className="text-2xl mb-2">{b.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{b.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">PPF Tax Benefits — EEE Status</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
          PPF enjoys the rare <strong>EEE (Exempt-Exempt-Exempt)</strong> tax status, making it one of the best tax-saving investments in India:
        </p>
        <div className="space-y-3">
          {[
            { step: '1️⃣', title: 'Investment is Exempt (Section 80C)', desc: 'Investments up to ₹1.5 lakh/year qualify for deduction. Save up to ₹46,800 in taxes.' },
            { step: '2️⃣', title: 'Interest is Exempt', desc: 'All interest earned is completely tax-free. No TDS deducted, no tax liability.' },
            { step: '3️⃣', title: 'Maturity Amount is Exempt', desc: 'The entire maturity amount (principal + interest) is tax-free on withdrawal.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg border border-green-200">
              <div className="text-xl md:text-2xl flex-shrink-0">{item.step}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-0.5 text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-700 text-xs md:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PPF Rules */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">PPF Rules & Regulations</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: 'Investment Limits', desc: 'Minimum: ₹500 per year | Maximum: ₹1,50,000 per year', color: 'border-primary-600' },
            { title: 'Lock-in Period', desc: '15 years from end of financial year. Extendable in blocks of 5 years.', color: 'border-success-600' },
            { title: 'Interest Rate', desc: 'Currently 7.1% p.a. (reviewed quarterly). Compounded annually.', color: 'border-amber-500' },
            { title: 'Account Opening', desc: 'Available at post offices and authorized banks. Individuals and minors (via guardian).', color: 'border-blue-500' },
          ].map((rule) => (
            <div key={rule.title} className={`bg-gray-50 rounded-xl p-4 md:p-5 border-l-4 ${rule.color}`}>
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{rule.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Rules */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">PPF Withdrawal Rules</h2>
        <div className="space-y-4 md:space-y-6">
          <div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Partial Withdrawal</h3>
            <p className="text-sm text-gray-700 mb-2">Allowed from 7th financial year onwards:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 md:ml-4 text-sm">
              <li>Maximum: 50% of balance at end of 4th preceding year</li>
              <li>Only one withdrawal per financial year</li>
              <li>Completely tax-free</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Premature Closure</h3>
            <p className="text-sm text-gray-700 mb-2">Allowed after 5 years in specific cases:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 md:ml-4 text-sm">
              <li>Life-threatening disease of self, spouse, or dependent children</li>
              <li>Higher education of account holder or children</li>
              <li>Change in residency status (NRI)</li>
              <li>Interest rate reduced by 1% on premature closure</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Maturity</h3>
            <p className="text-sm text-gray-700">After 15 years, withdraw entire amount or extend in blocks of 5 years (with or without contributions).</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { q: 'What is the current PPF interest rate?', a: 'The current PPF interest rate is 7.1% per annum (as of 2024), compounded annually. The rate is reviewed quarterly by the Government of India.' },
            { q: 'Can I have multiple PPF accounts?', a: 'No, an individual can have only one PPF account. However, you can open a separate account for your minor child.' },
            { q: 'What happens if I don\'t deposit the minimum?', a: 'Your account becomes inactive. Reactivate by paying ₹50 penalty per year along with the minimum ₹500 deposit for each defaulted year.' },
            { q: 'Can NRIs invest in PPF?', a: 'No, NRIs cannot open new PPF accounts. Existing accounts opened as resident can continue until maturity.' },
            { q: 'Is PPF better than Fixed Deposit?', a: 'PPF generally beats FD for long-term savings due to tax-free returns (EEE status), higher effective returns, and government backing.' },
            { q: 'Can I take a loan against PPF?', a: 'Yes, from 3rd to 6th year. Loan amount limited to 25% of balance at end of 2nd preceding year. Must be repaid within 36 months.' },
            { q: 'What is the best time to deposit?', a: 'Deposit before the 5th of any month for full month\'s interest. For maximum returns, deposit the full ₹1.5 lakh in April.' },
            { q: 'How is PPF different from EPF?', a: 'PPF is voluntary for all; EPF is mandatory for salaried employees. PPF has 15-year lock-in with flexible deposits; EPF is employment-linked.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 pb-3 md:pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">PPF Investment Best Practices</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { title: '1. Start Early for Maximum Compounding', desc: 'The power of compounding works best over long periods. Starting PPF in your 20s or 30s can create a substantial retirement corpus.' },
            { title: '2. Maximize Annual Contribution', desc: 'Invest the maximum ₹1.5 lakh per year for full Section 80C tax benefits and maximum returns.' },
            { title: '3. Deposit Early in the Month', desc: 'Always deposit before the 5th to earn interest for the entire month. For best results, invest the annual amount in April.' },
            { title: '4. Extend After Maturity', desc: 'After 15 years, extend in blocks of 5 years to continue earning tax-free interest, even without new deposits.' },
            { title: '5. Open Account for Children', desc: 'Open PPF for minors. By the time they turn 18, they\'ll have a substantial corpus for education or other goals.' },
            { title: '6. Combine with Other Investments', desc: 'PPF should be part of a diversified portfolio. Combine with equity funds for higher growth while PPF provides stability.' },
          ].map((tip) => (
            <div key={tip.title} className="bg-white/80 rounded-xl p-4 md:p-5 border border-green-200">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{tip.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">Retirement &amp; Savings Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Link href="/calculator/epf" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💼</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">EPF Calculator</div>
                <div className="text-xs text-gray-600">Provident fund returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/nps" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏛️</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">NPS Calculator</div>
                <div className="text-xs text-gray-600">National Pension System</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/gratuity" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎁</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Gratuity Calculator</div>
                <div className="text-xs text-gray-600">Retirement gratuity amount</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/sip" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">SIP Calculator</div>
                <div className="text-xs text-gray-600">Calculate SIP returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/swp" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💸</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">SWP Calculator</div>
                <div className="text-xs text-gray-600">Calculate SWP returns</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/ssy" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👧</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">SSY Calculator</div>
                <div className="text-xs text-gray-600">Sukanya Samriddhi Yojana</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/nsc" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📜</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">NSC Calculator</div>
                <div className="text-xs text-gray-600">National Savings Certificate</div>
              </div>
            </div>
          </Link>
          <Link href="/calculator/scss" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👴</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">SCSS Calculator</div>
                <div className="text-xs text-gray-600">Senior Citizens Savings Scheme</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Related Tools */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
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
          <Link href="/calculator/sip" className="sip-touch-target bg-white rounded-xl p-4 md:p-5 active:shadow-xl transition-shadow border border-gray-200">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">SIP Calculator</h3>
            <p className="text-gray-700 text-xs">Compare with mutual funds</p>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 via-success-600 to-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Start Your PPF Journey Today!</h2>
        <p className="text-sm md:text-base text-green-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          PPF is one of the safest and most tax-efficient investments in India. Plan your deposits and build a secure financial future.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/finance" className="sip-touch-target bg-white text-primary-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-green-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Learn More About PPF
          </Link>
          <Link href="/calculator/sip" className="sip-touch-target bg-primary-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-primary-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            Try SIP Calculator
          </Link>
        </div>
      </div>

      {/* SEO Keywords Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Popular Searches:</strong> ppf calculator, public provident fund calculator, ppf calculator online, ppf maturity calculator, ppf interest calculator, ppf calculator 2024, ppf calculator india, ppf return calculator, ppf investment calculator, ppf calculator with interest rate, ppf calculator 15 years, ppf calculator sbi, ppf calculator post office, ppf tax benefits, ppf withdrawal rules, ppf vs fd, ppf vs sip, ppf account opening, ppf interest rate 2024, ppf maturity period
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
