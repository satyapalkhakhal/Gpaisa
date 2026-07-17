import Link from 'next/link';

export default function SCSSContent() {
  return (
    <div className="space-y-10 md:space-y-14 text-gray-700">
      <section aria-labelledby="scss-faq-heading">
        <h2 id="scss-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — SCSS Calculator
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Who is eligible to open an SCSS account?', a: 'Individuals aged 60 years or above. Retired defence personnel can open an account from age 55, and civilian employees who retired under a voluntary retirement scheme (VRS) or superannuation can open one from age 50, provided the account is opened within 1 month of receiving retirement funds.' },
            { q: 'How is SCSS interest paid out?', a: 'Interest is paid out quarterly (on the 1st of April, July, October, and January) directly to your savings account — it is not compounded or reinvested automatically.' },
            { q: 'What happens after the 5-year SCSS tenure ends?', a: 'You can withdraw the full maturity amount, or extend the account once for a further 3 years within 1 year of maturity. Extended accounts earn interest at the rate applicable on the date of maturity, not the original rate.' },
            { q: 'Is SCSS interest taxable?', a: 'Yes, SCSS interest is fully taxable as per your income slab. TDS is deducted if total interest exceeds ₹50,000 in a financial year (for those who submit Form 15H/15G if eligible, TDS can be avoided).' },
            { q: 'What is the maximum SCSS investment limit?', a: '₹30,00,000 per individual (raised from ₹15,00,000 in the 2023 Budget). A couple can each open a separate account, effectively doubling the household limit.' },
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
              { label: 'NSC Calculator', href: '/calculator/nsc' },
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'FD Calculator', href: '/calculator/fd' },
              { label: 'Gratuity Calculator', href: '/calculator/gratuity' },
              { label: 'NPS Calculator', href: '/calculator/nps' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
