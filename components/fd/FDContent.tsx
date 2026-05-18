import Link from 'next/link';

const Th = ({ c, right }: { c: string; right?: boolean }) => (
  <th className={`px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 ${right ? 'text-right' : 'text-left'}`}>{c}</th>
);
const Td = ({ c, right, bold, color }: { c: string; right?: boolean; bold?: boolean; color?: string }) => (
  <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${right ? 'text-right' : ''} ${bold ? 'font-bold' : ''} ${color ?? 'text-gray-700'}`}>{c}</td>
);

export default function FDContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. Worked Example */}
      <section aria-labelledby="fd-example-heading">
        <h2 id="fd-example-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Worked Example — How FD Maturity is Calculated
        </h2>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 md:p-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            <strong>Ramesh</strong>, a 45-year-old Mumbai professional, invests <strong>₹2,00,000</strong> in HDFC Bank FD
            at <strong>7.25% p.a.</strong> for <strong>3 years</strong> with quarterly compounding.
          </p>
          <div className="bg-white rounded-xl p-4 border border-blue-100 font-mono text-sm text-gray-800 space-y-1 mb-4">
            <p>A = P × (1 + r/n)^(n×t)</p>
            <p>= ₹2,00,000 × (1 + 0.0725/4)^(4×3)</p>
            <p>= ₹2,00,000 × (1.018125)^12</p>
            <p>= ₹2,00,000 × 1.24027</p>
            <p className="font-bold text-blue-700">= ₹2,48,054</p>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex justify-between"><span className="text-gray-500">Interest earned</span><span className="font-semibold text-emerald-600">₹48,054</span></li>
            <li className="flex justify-between"><span className="text-gray-500">Annual interest (~₹16,018) — below ₹40,000 TDS limit</span><span className="text-gray-600">No TDS deducted ✓</span></li>
            <li className="flex justify-between border-t border-blue-100 pt-1.5"><span className="text-gray-500">If senior citizen (7.75% rate)</span><span className="font-semibold text-blue-600">₹2,51,273 (+₹3,219 more)</span></li>
          </ul>
        </div>
      </section>

      {/* 2. Bank Rate Table */}
      <section aria-labelledby="fd-rates-heading">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 id="fd-rates-heading" className="text-xl md:text-2xl font-bold text-gray-900">
            Current FD Interest Rates — May 2026
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">Updated: May 2026</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-3">
          <table className="w-full text-sm">
            <thead><tr>
              {['Bank','1 Year','2 Years','3 Years','5 Years','Senior Citizen'].map((h,i) => <Th key={i} c={h} right={i>0} />)}
            </tr></thead>
            <tbody>
              {[
                ['Post Office TD','6.90%','7.00%','7.10%','7.50%','Same rate'],
                ['HDFC Bank','7.10%','7.25%','7.25%','7.00%','+0.50%'],
                ['ICICI Bank','7.10%','7.20%','7.20%','7.00%','+0.50%'],
                ['Axis Bank','7.10%','7.20%','7.20%','7.00%','+0.75%'],
                ['SBI','6.80%','7.00%','6.75%','6.50%','+0.50%'],
                ['Kotak Mahindra','7.10%','7.25%','7.20%','6.90%','+0.50%'],
                ['Yes Bank','7.50%','7.75%','7.25%','7.25%','+0.50%'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-50">{row[0]}</td>
                  {row.slice(1).map((v, j) => <Td key={j} c={v} right bold={j===3} color={j===3 ? 'text-blue-700' : j===4 ? 'text-emerald-600' : 'text-gray-700'} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 italic">Rates are indicative. Verify on official bank websites before investing. Next update: June 2026.</p>
      </section>

      {/* 3. FD Maturity Reference Table */}
      <section aria-labelledby="fd-ref-heading">
        <h2 id="fd-ref-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          FD Maturity Quick Reference — ₹1 Lakh, Quarterly Compounding
        </h2>
        <p className="text-sm text-gray-500 mb-4">Tip: For ₹5 lakh, multiply all values by 5. For ₹10 lakh, multiply by 10.</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead><tr>
              {['Rate','1 Year','2 Years','3 Years','5 Years'].map((h,i) => <Th key={i} c={h} right={i>0} />)}
            </tr></thead>
            <tbody>
              {[
                ['6.50%','₹1,06,716','₹1,13,869','₹1,21,386','₹1,38,041'],
                ['7.00%','₹1,07,229','₹1,14,980','₹1,23,144','₹1,41,478'],
                ['7.25%','₹1,07,486','₹1,15,537','₹1,24,027','₹1,43,218'],
                ['7.50%','₹1,07,763','₹1,16,096','₹1,24,948','₹1,44,995'],
                ['7.75%','₹1,08,031','₹1,16,657','₹1,25,864','₹1,46,793'],
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-blue-50/30 transition-colors ${row[0]==='7.00%' ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-3 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-50">{row[0]}</td>
                  {row.slice(1).map((v, j) => <Td key={j} c={v} right bold={j===3} color={j===3 ? 'text-blue-700' : 'text-gray-700'} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. TDS Section */}
      <section aria-labelledby="fd-tds-heading">
        <h2 id="fd-tds-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          TDS on FD Interest — What You Need to Know (2026)
        </h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          TDS applies when your total FD interest from one bank exceeds <strong>₹40,000</strong> in a financial year
          (<strong>₹50,000</strong> for senior citizens).
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-5">
          <table className="w-full text-sm">
            <thead><tr>
              <Th c="Scenario" /><Th c="TDS Rate" right />
            </tr></thead>
            <tbody>
              {[
                ['PAN submitted, interest > limit','10%'],
                ['No PAN submitted','20%'],
                ['Senior citizen, PAN submitted','10%'],
                ['Form 15G / 15H submitted','0%'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-amber-50/30">
                  <Td c={row[0]} />
                  <Td c={row[1]} right bold color={row[1]==='0%' ? 'text-emerald-600' : row[1]==='20%' ? 'text-red-600' : 'text-amber-600'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-2 text-sm text-gray-700">
          <p><strong>Important:</strong> TDS is deducted by the bank, but FD interest is <strong>fully taxable at your income slab rate</strong>. TDS is not a final tax — declare FD interest in ITR under &quot;Income from Other Sources.&quot;</p>
          <p className="text-gray-500 text-xs">Form 15G: For below-60 taxpayers whose total income is below taxable limit. Form 15H: For senior citizens (60+) whose tax liability is nil.</p>
          <div className="bg-white rounded-xl p-4 border border-amber-100 font-mono text-xs text-gray-700">
            <p>Example: Ramesh earns ₹48,054 FD interest. Bank deducts ₹4,805 TDS (10%).</p>
            <p>In ITR (20% slab): Total tax = ₹9,611. Additional tax payable = ₹9,611 − ₹4,805 = ₹4,806.</p>
          </div>
        </div>
      </section>

      {/* 5. Tax-Saving FD */}
      <section aria-labelledby="fd-80c-heading">
        <h2 id="fd-80c-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Tax-Saving FD — Section 80C Deduction
        </h2>
        <p className="text-sm text-gray-600 mb-4">A Tax-Saving FD allows you to claim deduction up to <strong>₹1,50,000</strong> under Section 80C.</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-5">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="Regular FD" /><Th c="Tax-Saving FD" /></tr></thead>
            <tbody>
              {[
                ['Lock-in period','Flexible','5 years (mandatory)'],
                ['Premature withdrawal','Allowed (with penalty)','NOT allowed'],
                ['Loan against FD','Allowed','NOT allowed'],
                ['80C deduction','No','Yes, up to ₹1.5 lakh'],
                ['Interest taxability','Fully taxable','Fully taxable'],
                ['Auto-renewal','Available','NOT available'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} color={row[2].startsWith('NOT') ? 'text-red-600' : row[2].startsWith('Yes') ? 'text-emerald-600' : 'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-sm text-gray-700 space-y-2">
          <p><strong>Example:</strong> Ramesh (30% slab) invests ₹1,50,000 in Tax-Saving FD → saves <strong>₹45,000 in income tax</strong> that year. Combined with FD interest of ~₹10,500/yr at 7%, effective post-tax yield improves significantly in year 1.</p>
          <p className="text-xs text-gray-500"><strong>Best for:</strong> 20–30% tax bracket | <strong>Not ideal for:</strong> 0–5% slab (minimal tax saving, 5-yr liquidity lost)</p>
        </div>
      </section>

      {/* 6. FD vs RD vs Debt Fund */}
      <section aria-labelledby="fd-compare-heading">
        <h2 id="fd-compare-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          FD vs RD vs Debt Mutual Fund — Which is Right for You?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Factor" /><Th c="Fixed Deposit" /><Th c="Recurring Deposit" /><Th c="Debt Mutual Fund" /></tr></thead>
            <tbody>
              {[
                ['Investment type','Lump sum','Monthly instalments','Lump sum or SIP'],
                ['Returns','Fixed (6.5–7.75%)','Fixed (6–7%)','Variable (7–9%)'],
                ['Capital guarantee','Yes (up to ₹5L)','Yes (up to ₹5L)','No'],
                ['Taxation','Slab rate','Slab rate','Slab rate (post 2023)'],
                ['Liquidity','Moderate','Moderate','High (T+1/T+2)'],
                ['TDS applicable','Yes','Yes','No (self-declare)'],
                ['Best for','Lump sum parking','Monthly saving','Better post-tax yield'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  {row.slice(1).map((v, j) => <Td key={j} c={v} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 bg-blue-50 rounded-xl px-4 py-2 border border-blue-100">💡 <strong>DICGC insurance</strong> covers FD + savings + RD up to ₹5 lakh per bank per depositor. Spread large FD amounts across multiple banks if exceeding ₹5 lakh.</p>
      </section>

      {/* 7. Post Office vs Bank FD */}
      <section aria-labelledby="fd-po-heading">
        <h2 id="fd-po-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Post Office Time Deposit vs Bank FD — 2026
        </h2>
        <p className="text-sm text-gray-600 mb-4">Post Office FD (Time Deposit) offers <strong>7.50% for 5 years</strong> — higher than SBI (6.50%) and competitive with the best private banks, backed by the Government of India.</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="Post Office TD" /><Th c="Bank FD" /></tr></thead>
            <tbody>
              {[
                ['5-year rate','7.50%','6.50–7.25%'],
                ['Backed by','Government of India','RBI / DICGC (₹5L)'],
                ['Risk','Zero (sovereign)','Very low (insured)'],
                ['80C benefit','Yes (5-year only)','Yes (5-year only)'],
                ['Premature withdrawal','After 6 months','After 7 days'],
                ['Online access','India Post app','Net banking / app'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i===0 ? 'text-emerald-700 font-semibold' : 'text-gray-700'} />
                  <Td c={row[2]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Who Should Invest */}
      <section aria-labelledby="fd-who-heading">
        <h2 id="fd-who-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Who Should (and Should Not) Invest in FD?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-emerald-700 mb-3">✅ FD is ideal for:</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {['Retirees and senior citizens needing guaranteed income','Emergency fund parking (3–6 months expenses)','Short-term goals (1–3 years) where market risk is unacceptable','Tax-saving with 5-year Tax-Saving FD under Section 80C','People in 0–5% tax bracket (tax drag is minimal)'].map((t,i) => <li key={i} className="flex gap-2"><span className="text-emerald-500 flex-shrink-0">•</span>{t}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-red-600 mb-3">⚠️ FD is NOT ideal for:</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {['Long-term wealth creation (inflation-adjusted real return is low)','People in 30% tax bracket for long durations (post-tax yield < inflation)','Goals over 7+ years (equity mutual funds give far better real returns)'].map((t,i) => <li key={i} className="flex gap-2"><span className="text-red-400 flex-shrink-0">•</span>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section aria-labelledby="fd-faq-heading">
        <h2 id="fd-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — FD Calculator
        </h2>
        <div className="space-y-3">
          {[
            ['What is the TDS limit on FD interest in 2026?','₹40,000/year for regular citizens, ₹50,000 for senior citizens. TDS at 10% with PAN, 20% without. Submit Form 15G (below 60) or Form 15H (senior citizens) if total income is below the taxable limit to get zero TDS deducted.'],
            ['Which bank has the highest FD rate in India in 2026?','Yes Bank offers up to 7.75% for select tenures. Among large banks, HDFC and ICICI offer up to 7.25%. Post Office Time Deposit offers 7.50% for 5 years — backed by the Government of India.'],
            ['Is FD interest taxable in India?','Yes. FD interest is fully taxable as "Income from Other Sources" at your income slab rate. There is no concessional rate like equity LTCG. However, you can claim TDS credit and submit Form 15G/15H to avoid TDS deduction at source.'],
            ['What is the DICGC insurance limit on FDs?','₹5 lakh per depositor per bank — covering principal + interest combined across all accounts in that bank. If your FD exceeds ₹5 lakh, consider spreading across multiple banks for full insurance coverage.'],
            ['Can I break an FD before maturity?','Yes, for regular FDs (not Tax-Saving). Penalty is typically 0.5–1% reduction on the applicable interest rate. SBI charges 0.50% for deposits up to ₹5 lakh and 1% above. Tax-Saving FDs cannot be broken before 5 years.'],
            ['What is the minimum FD amount?','₹1,000 at SBI and most public sector banks. ₹5,000 at HDFC Bank. ₹10,000 at ICICI Bank. ₹1,000 at Post Office. No maximum limit at most banks.'],
            ['Is quarterly or monthly compounding better for FD?','Quarterly compounding gives slightly higher returns because interest is reinvested quarterly. For ₹1 lakh at 7% for 5 years: quarterly = ₹1,41,478 vs annual = ₹1,40,255 — difference of ₹1,223. Always choose the highest compounding frequency available.'],
            ['How does a Tax-Saving FD differ from a regular FD?','Tax-Saving FD has a mandatory 5-year lock-in and offers Section 80C deduction up to ₹1.5 lakh. No premature withdrawal, no loan against it, no auto-renewal. Interest is still fully taxable. Best for people in the 20–30% tax bracket wanting guaranteed returns with tax saving.'],
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

      {/* 10. Bank-specific links + Related */}
      <section className="border-t border-gray-100 pt-8 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Calculate FD for Specific Banks</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'SBI FD Calculator', href: '/calculator/fd/sbi' },
              { label: 'HDFC FD Calculator', href: '/calculator/fd/hdfc' },
              { label: 'ICICI FD Calculator', href: '/calculator/fd/icici' },
              { label: 'Axis FD Calculator', href: '/calculator/fd/axis' },
              { label: 'Post Office FD Calculator', href: '/calculator/fd/post-office' },
              { label: 'Kotak FD Calculator', href: '/calculator/fd/kotak' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'RD Calculator', href: '/calculator/rd' },
              { label: 'PPF Calculator', href: '/calculator/ppf' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
              { label: 'CAGR Calculator', href: '/calculator/cagr' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026
        </p>
      </section>
    </div>
  );
}
