import Link from 'next/link';

const Th = ({ c, left }: { c: string; left?: boolean }) => (
  <th className={`px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 ${left !== false ? 'text-left' : 'text-right'}`}>{c}</th>
);
const Td = ({ c, color }: { c: string; color?: string }) => (
  <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${color ?? 'text-gray-700'}`}>{c}</td>
);

export default function NPSContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. How It Works */}
      <section aria-labelledby="nps-how-heading">
        <h2 id="nps-how-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          NPS Returns Calculator — How It Works
        </h2>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed space-y-3">
          <p>The NPS calculator uses <strong>monthly compounding</strong> to estimate your retirement corpus. Each month, your existing corpus grows at (annual return ÷ 12) and your new contribution is added.</p>
          <div className="bg-white rounded-xl px-4 py-3 border border-indigo-100 font-mono text-sm">
            Corpus (next month) = Corpus × (1 + r/12) + Monthly Contribution
          </div>
          <p>At retirement, the corpus is split into lump sum (up to <strong>80%</strong> tax-free for non-government subscribers under PFRDA Dec 2025 rules) and annuity (minimum 20%, used to purchase monthly pension). <strong>Monthly Pension = (Annuity Amount × Annuity Rate) ÷ 12.</strong></p>
        </div>
      </section>

      {/* 2. Tax Benefits */}
      <section aria-labelledby="nps-tax-heading">
        <h2 id="nps-tax-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          NPS Tax Benefits — Save Up to ₹2 Lakh Every Year
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-5">
          <table className="w-full text-sm">
            <thead><tr><Th c="Section" /><Th c="Benefit" /><Th c="Annual Limit" /></tr></thead>
            <tbody>
              {[
                ['80CCD(1)','Own contribution deduction','Up to 10% of salary, within ₹1.5L of 80C'],
                ['80CCD(1B)','Additional NPS deduction (exclusive)','Extra ₹50,000 over and above 80C limit'],
                ['80CCD(2)','Employer contribution','Up to 10% of basic salary — no upper limit'],
                ['Total (salaried)','All three combined','₹2,00,000+ for salaried employees'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-indigo-50/20">
                  <td className="px-3 py-2.5 text-sm font-semibold text-indigo-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['The ₹50,000 under 80CCD(1B) is exclusive to NPS — no other investment qualifies for this extra deduction.', 'text-indigo-600'],
            ['Lump sum withdrawal of up to 80% at retirement is completely tax-free (non-govt subscribers).', 'text-emerald-600'],
            ['At 30% slab: ₹2 lakh deduction saves ₹62,400 in taxes per year.', 'text-orange-600'],
            ['Annuity income after retirement is taxable at your applicable income slab rate.', 'text-gray-600'],
          ].map(([t, c], i) => (
            <div key={i} className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-sm ${c}`}>{t}</div>
          ))}
        </div>
      </section>

      {/* 3. PFRDA 2025 Rules */}
      <section aria-labelledby="nps-rules-heading">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 id="nps-rules-heading" className="text-xl md:text-2xl font-bold text-gray-900">
            Key NPS Rule Changes You Must Know (Updated December 2025)
          </h2>
          <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">PFRDA Dec 2025</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">PFRDA introduced significant amendments in late 2025 that affect every NPS subscriber:</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Change" /><Th c="Old Rule" /><Th c="New Rule (Dec 2025)" /></tr></thead>
            <tbody>
              {[
                ['Maximum NPS age','75 years','85 years'],
                ['Lump sum withdrawal (non-govt)','60% maximum','80% maximum'],
                ['Minimum annuity (non-govt)','40% mandatory','20% mandatory'],
                ['Small corpus rule','100% lump sum if ≤ ₹2 lakh','100% lump sum if ≤ ₹5 lakh'],
                ['Systematic Lump sum Withdrawal (SLW)','Not available','Now available'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-indigo-50/20">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-800 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color="text-gray-500 line-through" />
                  <Td c={row[2]} color="text-emerald-700 font-semibold" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-gray-700">
          💡 If your corpus is <strong>₹5 lakh or less</strong> at maturity, you can withdraw <strong>100% as lump sum</strong> with no annuity requirement under the new PFRDA rules.
        </div>
      </section>

      {/* 4. NPS vs PPF vs EPF */}
      <section aria-labelledby="nps-compare-heading">
        <h2 id="nps-compare-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          NPS vs PPF vs EPF — Complete Comparison for 2026
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="NPS" /><Th c="PPF" /><Th c="EPF" /></tr></thead>
            <tbody>
              {[
                ['Who can invest','All citizens 18–70','All citizens','Salaried employees only'],
                ['Returns','Market-linked 8–12%','Fixed ~7.1%','Fixed ~8.25%'],
                ['Risk level','Moderate','Zero','Zero'],
                ['Tax on maturity','80% tax-free lump sum','100% tax-free','100% tax-free'],
                ['Withdrawal flexibility','Partial after 3 years','After 7 years','After 5 years'],
                ['Extra tax benefit','₹50,000 under 80CCD(1B)','None','None'],
                ['Lock-in','Until retirement (60)','15 years','Until employment ends'],
                ['Best for','High returns + max tax saving','Safe capital + tax','Salaried + employer match'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i === 4 ? 'text-indigo-700 font-semibold' : 'text-gray-700'} />
                  <Td c={row[2]} /><Td c={row[3]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
          <strong>Verdict:</strong> NPS is best for investors wanting the highest potential corpus and maximum tax savings. PPF is best for conservative investors. EPF is mandatory for salaried employees and provides solid baseline retirement savings.
        </p>
      </section>

      {/* 5. Tier 1 vs Tier 2 */}
      <section aria-labelledby="nps-tier-heading">
        <h2 id="nps-tier-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          NPS Tier 1 vs Tier 2 Account — Key Differences
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="Tier 1 (Pension Account)" /><Th c="Tier 2 (Voluntary Savings)" /></tr></thead>
            <tbody>
              {[
                ['Purpose','Retirement savings','Flexible savings'],
                ['Withdrawals','Restricted until age 60','Anytime, no restrictions'],
                ['Tax benefits','Yes — 80CCD(1), (1B), (2)','No tax deduction'],
                ['Minimum contribution','₹1,000/year','No minimum'],
                ['Lock-in','Yes — until retirement','No lock-in'],
                ['Who should use','Everyone investing in NPS','Those wanting liquid NPS'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i === 2 ? 'text-emerald-700 font-semibold' : 'text-gray-700'} />
                  <Td c={row[2]} color={i === 2 ? 'text-red-600' : 'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">You must have an active Tier 1 account to open a Tier 2 account. Always prioritise Tier 1 first for tax benefits and retirement planning.</p>
      </section>

      {/* 6. Who Should Invest */}
      <section aria-labelledby="nps-who-heading">
        <h2 id="nps-who-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Is NPS Right for You?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-emerald-700 mb-3">✅ Suitable for:</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {['Salaried professionals wanting extra ₹50,000 tax deduction beyond 80C','Self-employed individuals building their own retirement corpus','Government employees where NPS is mandatory','Anyone aged 25–45 with long investment horizon and can tolerate market-linked returns'].map((t, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{t}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-sm font-bold text-red-600 mb-3">⚠️ Not ideal for:</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {['People within 5 years of retirement (insufficient time for compounding)','Extremely risk-averse investors who need guaranteed returns (PPF or EPF is better)','People who need liquidity before retirement age'].map((t, i) => <li key={i} className="flex gap-2"><span className="text-red-400">•</span>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section aria-labelledby="nps-faq-heading">
        <h2 id="nps-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — NPS Calculator
        </h2>
        <div className="space-y-3">
          {[
            ['What is the NPS interest rate in India in 2026?', 'NPS does not have a fixed interest rate — returns are market-linked and depend on your asset allocation and chosen pension fund manager. Historically, equity-heavy NPS portfolios (Scheme E) have delivered 10–13% CAGR over 10-year periods. Conservative portfolios (Scheme G — government bonds) typically return 7–9%.'],
            ['What is the minimum NPS contribution per month?', 'The minimum contribution for Tier 1 NPS is ₹1,000 per year. If paying monthly, minimum is ₹500/month. There is no maximum contribution limit, but tax benefits are capped at ₹2 lakh per year under 80CCD(1) + 80CCD(1B).'],
            ['How much monthly pension will I get from NPS?', 'Monthly pension = (Annuity Corpus × Annuity Rate) ÷ 12. Example: If corpus at 60 is ₹1 crore and you use 20% (₹20 lakh) to buy annuity at 6%, your monthly pension = (₹20,00,000 × 6%) ÷ 12 = ₹10,000/month. Use the calculator above to estimate your specific pension.'],
            ['Can I withdraw NPS before 60 years?', 'Yes, partial withdrawal of up to 25% of own contributions is allowed after 3 years for higher education, marriage, medical treatment, home purchase, or skill development. For complete exit before 60, minimum 80% of corpus must be used to buy annuity. If corpus is ₹5 lakh or less (PFRDA Dec 2025), 100% lump sum withdrawal is allowed.'],
            ['What happens to NPS corpus after death?', 'The entire accumulated NPS corpus goes to the registered nominee or legal heir as lump sum — no annuity purchase required. The full 100% is paid out. Ensure you register a nominee when opening your NPS account.'],
            ['NPS or Mutual Fund SIP — which is better for retirement?', 'NPS wins on tax efficiency — the extra ₹50,000 deduction under 80CCD(1B) and 80% tax-free lump sum are unique advantages no mutual fund offers. However, SIPs offer complete flexibility with no lock-in. For a complete strategy, use both: NPS for tax benefits and pension structure, SIP for flexible wealth creation.'],
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

      {/* Footer */}
      <section className="border-t border-gray-100 pt-8 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[['EPF Calculator', '/calculator/epf'], ['PPF Calculator', '/calculator/ppf'], ['Gratuity Calculator', '/calculator/gratuity'], ['SWP Calculator', '/calculator/swp'], ['SIP Calculator', '/calculator/sip'], ['CAGR Calculator', '/calculator/cagr']].map(([l, h]) => (
              <Link key={h} href={h} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026</p>
      </section>
    </div>
  );
}
