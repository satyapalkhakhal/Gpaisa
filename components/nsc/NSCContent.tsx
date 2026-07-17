import Link from 'next/link';

export default function NSCContent() {
  return (
    <div className="space-y-10 md:space-y-14 text-gray-700">
      <section aria-labelledby="nsc-faq-heading">
        <h2 id="nsc-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — NSC Calculator
        </h2>
        <div className="space-y-4">
          {[
            { q: 'What is the current NSC interest rate?', a: 'The National Savings Certificate rate is reviewed quarterly by the Ministry of Finance. For the April–June 2026 quarter it is 7.7% p.a., compounded annually — the same rate that has held since April 2023. The rate applicable when you buy the certificate is locked in for its full 5-year tenure.' },
            { q: 'Can I withdraw NSC before maturity?', a: 'No, premature withdrawal is generally not allowed except in specific cases — death of the holder, forfeiture by a pledgee (e.g. a bank against a loan), or a court order.' },
            { q: 'Is NSC interest taxable?', a: 'Yes. The interest earned each year (except the final year) is deemed to be reinvested and qualifies for Section 80C deduction, but it is still added to your taxable income each year as "Income from Other Sources." The final year\'s interest is paid out along with the principal and is taxable but not eligible for 80C.' },
            { q: 'Can NSC be used as loan collateral?', a: 'Yes, NSC certificates can be pledged as collateral security to avail loans from banks and NBFCs.' },
            { q: 'What is the difference between NSC and a tax-saving FD?', a: 'Both offer Section 80C deduction up to ₹1.5 lakh with a 5-year lock-in. NSC currently offers a government-backed rate that\'s often comparable to or higher than bank tax-saving FDs, and its interest compounds annually versus some FDs which pay out periodically.' },
          ].map(({ q, a }, i) => (
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

      <section className="border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500 mb-6">
          Content by <strong className="text-gray-700">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: July 2026
        </p>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'SSY Calculator', href: '/calculator/ssy' },
              { label: 'SCSS Calculator', href: '/calculator/scss' },
              { label: 'FD Calculator', href: '/calculator/fd' },
              { label: 'Simple Interest Calculator', href: '/calculator/simple-interest' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
