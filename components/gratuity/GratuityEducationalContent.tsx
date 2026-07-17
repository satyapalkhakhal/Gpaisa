'use client';

import Link from 'next/link';

export default function GratuityEducationalContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What is Gratuity */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">What is Gratuity?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          <strong>Gratuity</strong> is a lump sum amount paid by an employer to an employee as a token of appreciation for services rendered. It is governed by the <strong>Payment of Gratuity Act, 1972</strong> and is payable on retirement, resignation, superannuation, death, or disability.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          It&apos;s one of the key retirement benefits in India and applies to establishments with 10 or more employees. The amount is completely tax-free up to ₹20 lakh, making it a significant component of retirement planning.
        </p>
      </div>

      {/* Eligibility Rules */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Gratuity Eligibility Rules</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: 'Minimum Service Period', desc: '5 years of continuous service is mandatory for gratuity eligibility.', color: 'border-blue-500' },
            { title: 'Exception — Death/Disability', desc: 'The 5-year rule does NOT apply in case of death or disability of the employee.', color: 'border-red-500' },
            { title: 'Rounding Rule', desc: 'If service exceeds 6 months in the last year, it is rounded up to the next full year.', color: 'border-emerald-500' },
            { title: 'Maximum Limit', desc: 'Maximum gratuity payable is capped at ₹20 lakh under the Act.', color: 'border-amber-500' },
          ].map((rule) => (
            <div key={rule.title} className={`bg-white rounded-xl p-4 md:p-5 border-l-4 ${rule.color}`}>
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{rule.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Section */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Gratuity Calculation Formula</h2>
        <div className="space-y-4 md:space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
            <h3 className="text-sm md:text-base font-bold text-blue-900 mb-2">Covered under Gratuity Act (÷26)</h3>
            <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
              Gratuity = (Salary × 15 × Years) / 26
            </code>
            <p className="text-xs text-blue-700 mt-2">Applies to employees in establishments with 10+ employees.</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <h3 className="text-sm md:text-base font-bold text-amber-900 mb-2">Not Covered under Act (÷30)</h3>
            <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
              Gratuity = (Salary × 15 × Years) / 30
            </code>
            <p className="text-xs text-amber-700 mt-2">For employees not covered under the Payment of Gratuity Act.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
          {[
            { var: 'Salary', desc: 'Basic + DA', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { var: '15', desc: 'Days per month', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { var: 'Years', desc: 'Completed years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { var: '26', desc: 'Working days', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((item) => (
            <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
              <div className="text-base md:text-lg font-bold font-mono">{item.var}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Gratuity Tax Rules</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            {
              icon: '🏛️',
              title: 'Government Employees',
              desc: 'Entire gratuity received is completely exempt from income tax.',
            },
            {
              icon: '🏢',
              title: 'Private Sector (Covered)',
              desc: 'Tax-free up to ₹20 lakh. Amount exceeding ₹20 lakh is taxable as per income slab.',
            },
            {
              icon: '📋',
              title: 'Private Sector (Not Covered)',
              desc: 'Exemption is the least of: (a) actual gratuity, (b) ₹20 lakh, or (c) half month salary × years of service.',
            },
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

      {/* Quick Info Block */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Quick Facts About Gratuity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: '⏰', title: 'Min 5 Years', desc: 'Continuous service required (except death/disability).' },
            { icon: '💰', title: 'Max ₹20 Lakh', desc: 'Upper limit under the Gratuity Act.' },
            { icon: '🛡️', title: 'Tax Free', desc: 'Exempt up to ₹20 lakh under Income Tax Act.' },
            { icon: '📊', title: 'Salary = Basic + DA', desc: 'Excludes HRA, bonus, and other allowances.' },
            { icon: '📅', title: 'Rounding Rule', desc: '>6 months = next year, ≤6 months = ignore.' },
            { icon: '⚖️', title: 'Legal Right', desc: 'Cannot be denied if eligibility criteria met.' },
          ].map((b) => (
            <div key={b.title} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 md:p-5 border border-gray-100">
              <div className="text-2xl mb-2">{b.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{b.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl shadow-lg p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { q: 'What is the gratuity formula?', a: 'Gratuity = (Last Salary × 15 × Years of Service) / 26 for employees covered under the Payment of Gratuity Act. For non-covered employees, the divisor is 30.' },
            { q: 'Is gratuity taxable in India?', a: 'Gratuity up to ₹20 lakh is completely tax-free. Any amount exceeding ₹20 lakh is taxable as per the individual\'s income tax slab.' },
            { q: 'Can I get gratuity before 5 years?', a: 'No, minimum 5 years of continuous service is required. Exception: Death or disability of the employee — the 5-year rule does not apply.' },
            { q: 'What salary is used for gratuity?', a: 'Only Basic Salary + Dearness Allowance (DA) is considered. Other components like HRA, bonus, overtime, etc., are excluded.' },
            { q: 'Is gratuity applicable on resignation?', a: 'Yes, gratuity is payable on resignation provided you have completed 5 years of continuous service.' },
            { q: 'What is the ₹20 lakh gratuity cap?', a: 'Under the Payment of Gratuity Act, the maximum gratuity payable is capped at ₹20 lakh. Employers can pay more voluntarily.' },
            { q: 'How is service period rounded?', a: 'If you have worked more than 6 months in the last year, it\'s rounded up to the next full year. If ≤6 months, the fraction is ignored.' },
            { q: 'Can employer deny gratuity?', a: 'Gratuity can be partially or fully forfeited only if the employee is terminated for criminal offence or moral turpitude. Otherwise, it is a legal right.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-blue-200/50 pb-3 md:pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">Other Employment Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: '💰', title: 'EPF Calculator', desc: 'Provident fund returns', href: '/calculator/epf' },
            { icon: '🏦', title: 'NPS Calculator', desc: 'Pension scheme returns', href: '/calculator/nps' },
            { icon: '🏛️', title: 'PPF Calculator', desc: 'Public provident fund', href: '/calculator/ppf' },
            { icon: '💸', title: 'SWP Calculator', desc: 'Systematic withdrawal plan', href: '/calculator/swp' },
            { icon: '🏠', title: 'HRA Calculator', desc: 'House rent exemption', href: '/calculator/hra' },
            { icon: '📊', title: 'SIP Calculator', desc: 'Mutual fund returns', href: '/calculator/sip' },
          ].map((calc) => (
            <Link key={calc.href} href={calc.href} className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 active:shadow-lg transition-all">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{calc.icon}</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{calc.title}</div>
                  <div className="text-xs text-gray-600">{calc.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Plan Your Retirement with Gratuity!</h2>
        <p className="text-sm md:text-base text-blue-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          Gratuity is a significant part of your retirement corpus. Use this tool to plan ahead and maximize your benefits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/calculator/epf" className="sip-touch-target bg-white text-primary-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-blue-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Calculate EPF Returns
          </Link>
          <Link href="/calculator/nps" className="sip-touch-target bg-primary-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-primary-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            Try NPS Calculator
          </Link>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Popular Searches:</strong> gratuity calculator, gratuity calculation formula, gratuity calculator india, payment of gratuity act calculator, retirement gratuity calculator, gratuity amount calculator, gratuity formula, gratuity eligibility, gratuity tax exemption, gratuity maximum limit, gratuity calculator 2024, gratuity calculator online, gratuity on resignation, gratuity act 1972
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
