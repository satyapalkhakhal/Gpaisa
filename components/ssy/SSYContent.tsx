import Link from 'next/link';

export default function SSYContent() {
  return (
    <div className="space-y-10 md:space-y-14 text-gray-700">
      <section aria-labelledby="ssy-faq-heading">
        <h2 id="ssy-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — SSY Calculator
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Who is eligible to open an SSY account?', a: 'Any parent or legal guardian of a girl child below 10 years of age (at the time of account opening) can open a Sukanya Samriddhi Yojana account. A maximum of two accounts per family is allowed (three in case of twins/triplets in the second birth).' },
            { q: 'What is the minimum and maximum deposit for SSY?', a: 'Minimum ₹250 per year and maximum ₹1,50,000 per year. If the minimum isn\'t deposited in a year, the account becomes inactive but can be revived by paying a small penalty along with the minimum due.' },
            { q: 'When does an SSY account mature?', a: 'The account matures 21 years from the date of opening. Deposits are required only for the first 15 years — after that, the balance continues to earn interest until maturity with no further deposits needed.' },
            { q: 'Can I withdraw money from SSY before maturity?', a: 'Partial withdrawal of up to 50% of the balance (as of the previous financial year end) is allowed once the girl turns 18, for higher education or marriage expenses. Premature closure is allowed in specific cases like the death of the account holder.' },
            { q: 'Is SSY interest and maturity amount taxable?', a: 'No. SSY has EEE (Exempt-Exempt-Exempt) tax status — the deposit qualifies for Section 80C deduction (up to ₹1.5 lakh), the annual interest is tax-free, and the maturity amount is also fully tax-free.' },
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
              { label: 'NSC Calculator', href: '/calculator/nsc' },
              { label: 'SCSS Calculator', href: '/calculator/scss' },
              { label: 'FD Calculator', href: '/calculator/fd' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
