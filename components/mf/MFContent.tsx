import Link from 'next/link';

const Th = ({ c }: { c: string }) => <th className="px-3 py-3 text-xs font-semibold text-gray-600 bg-gray-50 text-left">{c}</th>;
const Td = ({ c, color }: { c: string; color?: string }) => <td className={`px-3 py-2.5 text-sm border-b border-gray-50 ${color ?? 'text-gray-700'}`}>{c}</td>;

export default function MFContent() {
  return (
    <div className="space-y-12 text-gray-700">

      {/* 1. Formula */}
      <section aria-labelledby="mf-formula-heading">
        <h2 id="mf-formula-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">SIP and Lumpsum Return Calculation Formula</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">SIP Formula</p>
            <p className="font-mono text-sm text-emerald-800 font-bold">FV = P × [((1 + r)^n − 1) / r] × (1 + r)</p>
            <p className="text-xs text-gray-500 mt-2">P = monthly investment, r = monthly rate (annual ÷ 12 ÷ 100), n = total months</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Lumpsum Formula</p>
            <p className="font-mono text-sm text-blue-800 font-bold">FV = P × (1 + R/100)^T</p>
            <p className="text-xs text-gray-500 mt-2">P = principal, R = annual return rate, T = years</p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead><tr><Th c="Variable" /><Th c="SIP Formula" /><Th c="Lumpsum Formula" /><Th c="Example" /></tr></thead>
            <tbody>
              {[
                ['P','Monthly investment','One-time investment','₹10,000 / ₹12,00,000'],
                ['r / R','Monthly rate = Annual ÷ 12 ÷ 100','Annual rate ÷ 100','0.01 / 12%'],
                ['n / T','Total months','Years','120 / 10'],
                ['FV','Future value of SIP','Future value of lumpsum','₹23,23,391 / ₹37,27,359'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-emerald-50/20">
                  <td className="px-3 py-2.5 text-sm font-bold text-emerald-700 border-b border-gray-50 font-mono">{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} /><Td c={row[3]} color="text-gray-800 font-semibold" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Worked Examples */}
      <section aria-labelledby="mf-examples-heading">
        <h2 id="mf-examples-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Mutual Fund Return Calculation Examples</h2>
        <div className="space-y-4">
          {[
            { title:'Example 1 — Long-term SIP for Retirement', bg:'bg-emerald-50 border-emerald-100', accent:'text-emerald-700',
              lines:['Priya invests ₹5,000/month in equity fund at 13% p.a. for 25 years.','r = 0.01083, n = 300 → FV = ₹1,88,82,397','Invested = ₹15,00,000 | Returns = ₹1,73,82,397 | Absolute Return = 1159%'] },
            { title:'Example 2 — Lumpsum in Debt Fund', bg:'bg-blue-50 border-blue-100', accent:'text-blue-700',
              lines:['Vijay invests ₹2,00,000 in a debt fund at 7.5% p.a. for 3 years.','FV = 2,00,000 × (1.075)^3 = ₹2,48,542 | Returns = ₹48,542'] },
            { title:'Example 3 — ELSS for Tax Saving', bg:'bg-purple-50 border-purple-100', accent:'text-purple-700',
              lines:['Anita invests ₹12,500/month in ELSS at 13% for 10 years.','FV ≈ ₹28,35,000 | Saves ₹46,800/year under Section 80C | Lock-in: 3 years per instalment'] },
            { title:'Example 4 — Reverse: Child Education Corpus', bg:'bg-amber-50 border-amber-100', accent:'text-amber-700',
              lines:['Rahul wants ₹50 lakhs in 15 years for education at 12% p.a.','Required SIP = FV × r / [((1+r)^n − 1) × (1+r)] ≈ ₹9,450/month'] },
          ].map((ex, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${ex.bg}`}>
              <p className={`text-sm font-bold mb-3 ${ex.accent}`}>{ex.title}</p>
              {ex.lines.map((l, j) => <div key={j} className={`bg-white rounded-xl px-4 py-2 border border-gray-100 text-sm mb-2 ${j===0?'text-gray-700':'font-mono text-gray-800'}`}>{l}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIP vs Lumpsum */}
      <section aria-labelledby="mf-sip-lumpsum-heading">
        <h2 id="mf-sip-lumpsum-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">SIP vs Lumpsum Investment — Key Differences</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Feature" /><Th c="SIP" /><Th c="Lumpsum" /></tr></thead>
            <tbody>
              {[
                ['Investment style','Fixed amount every month','One-time investment'],
                ['Minimum to start','₹500/month','₹1,000 (most funds)'],
                ['Market timing risk','Low (rupee cost averaging)','High (timing matters)'],
                ['Best for','Salaried investors, beginners','Investors with surplus cash'],
                ['Return advantage','Steady compounding','Higher if market is low at entry'],
                ['Flexibility','Can pause or stop anytime','Money locked (especially ELSS)'],
                ['Example (12%, 10yr)','₹23,23,391 on ₹12L invested','₹37,27,359 on ₹12L invested'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} color={i===2?'text-emerald-700 font-semibold':'text-gray-700'} />
                  <Td c={row[2]} color={i===2?'text-orange-600':'text-gray-700'} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100"><strong>Key insight:</strong> For most salaried investors in India, SIP in equity funds over 7+ years has historically outperformed FDs and gold.</p>
      </section>

      {/* 4. Fund Types */}
      <section aria-labelledby="mf-types-heading">
        <h2 id="mf-types-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Types of Mutual Funds and Historical Return Ranges in India</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Fund Type" /><Th c="Risk" /><Th c="Expected Return" /><Th c="Ideal For" /><Th c="Lock-in" /></tr></thead>
            <tbody>
              {[
                ['Liquid Fund','Very Low','6–7%','Emergency corpus, parking surplus','None'],
                ['Debt Fund','Low','7–9%','Short-term goals (1–3 years)','None'],
                ['Hybrid Fund','Moderate','10–12%','Medium-term goals (3–5 years)','None'],
                ['Index Fund (Nifty 50)','Moderate-High','12–13%','Long-term wealth creation','None'],
                ['Large Cap Equity','High','12–14%','5+ year goals','None'],
                ['Mid Cap Equity','High','14–16%','Aggressive long-term investors','None'],
                ['ELSS','High','13–15%','Tax saving + wealth creation','3 years'],
                ['Small Cap','Very High','15–18%','Very long-term (10+ years)','None'],
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-emerald-50/20 ${row[0]==='ELSS'?'bg-purple-50/30':''}`}>
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-800 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} /><Td c={row[2]} color="text-emerald-700 font-semibold" />
                  <Td c={row[3]} /><Td c={row[4]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 px-1">Returns are historical averages. Actual future returns are not guaranteed.</p>
      </section>

      {/* 5. Return Reference Table */}
      <section aria-labelledby="mf-table-heading">
        <h2 id="mf-table-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">SIP Returns at Different Rates and Durations (₹10,000/month)</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="px-3 py-3 text-xs font-semibold text-gray-600 text-left">Rate</th>{['5 Years','10 Years','15 Years','20 Years'].map(h=><th key={h} className="px-3 py-3 text-xs font-semibold text-gray-600 text-right">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['8%','₹7,34,664','₹18,29,460','₹34,60,435','₹58,90,278'],
                ['10%','₹7,74,371','₹20,48,450','₹41,44,960','₹75,93,693'],
                ['12%','₹8,16,697','₹23,23,391','₹49,95,734','₹98,92,554'],
                ['14%','₹8,61,780','₹26,42,735','₹60,46,626','₹1,29,06,553'],
                ['16%','₹9,09,758','₹30,08,554','₹73,21,296','₹1,68,11,660'],
              ].map(([rate,...vals],i)=>(
                <tr key={i} className={`hover:bg-emerald-50/20 ${rate==='12%'?'bg-emerald-50/30':''}`}>
                  <td className={`px-3 py-2.5 text-sm font-bold border-b border-gray-50 ${rate==='12%'?'text-emerald-700':'text-gray-700'}`}>{rate}</td>
                  {vals.map((v,j)=><td key={j} className={`px-3 py-2.5 text-sm text-right border-b border-gray-50 ${rate==='12%'&&j===1?'font-bold text-emerald-700':'text-gray-700'}`}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">All values use FV = P × [((1 + r)^n − 1) / r] × (1 + r), P = ₹10,000/month. Highlighted = 12% default.</p>
      </section>

      {/* 6. Tax */}
      <section aria-labelledby="mf-tax-heading">
        <h2 id="mf-tax-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">How Mutual Fund Returns Are Taxed in India (2026)</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-4">
          <table className="w-full text-sm">
            <thead><tr><Th c="Fund Type" /><Th c="Holding Period" /><Th c="Tax Rate" /><Th c="Notes" /></tr></thead>
            <tbody>
              {[
                ['Equity Funds','< 1 year','20% STCG','Short-term capital gains'],
                ['Equity Funds','≥ 1 year','12.5% LTCG','Gains above ₹1.25 lakh exempt'],
                ['Debt Funds','Any','Slab rate','Added to income, taxed at bracket'],
                ['ELSS','≥ 3 years','12.5% LTCG','₹1.5L deduction under 80C at entry'],
                ['Hybrid Funds','Depends','Equity/Debt rules','Based on equity allocation > 65%'],
              ].map((row,i)=>(
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-800 border-b border-gray-50">{row[0]}</td>
                  <Td c={row[1]} />
                  <Td c={row[2]} color={i===0?'text-red-600 font-semibold':i===1||i===3?'text-emerald-700 font-semibold':'text-orange-600 font-semibold'} />
                  <Td c={row[3]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-gray-700">
          <strong>FY 2024-25 Budget:</strong> LTCG exemption on equity MFs is <strong>₹1.25 lakh/year</strong>. Gains above this taxed at <strong>12.5% without indexation</strong>. Debt fund gains taxed at slab rate regardless of holding period.
        </div>
      </section>

      {/* 7. FAQ */}
      <section aria-labelledby="mf-faq-heading">
        <h2 id="mf-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions — Mutual Fund Calculator</h2>
        <div className="space-y-3">
          {[
            ['How is SIP return calculated?','SIP uses the future value of annuity formula: FV = P × [((1 + r)^n − 1) / r] × (1 + r), where r is the monthly rate and n is total months. For ₹10,000/month at 12% for 10 years: invested = ₹12,00,000, total = ₹23,23,391, returns = ₹11,23,391.'],
            ['Is ₹10,000 SIP enough to become a crorepati?','Yes — at 12% p.a. for about 21 years, a ₹10,000/month SIP grows to ₹1 crore. At 14% p.a. it takes about 19 years. Start early and stay invested through market cycles.'],
            ['Which mutual fund gives the highest return in India?','Historically, small-cap and mid-cap equity funds have given 15–20% p.a. over 10+ year periods but with higher volatility. Nifty 50 index funds have given approximately 12–13% p.a. consistently. Past returns are not guaranteed.'],
            ['What is the difference between CAGR and absolute return?','Absolute return = ((Total − Invested) / Invested) × 100 — total gain without considering time. CAGR is the equivalent yearly return. For SIPs with varying cash flows, XIRR is most accurate — it\'s what Zerodha, Groww, and Kuvera report.'],
            ['Is mutual fund SIP better than FD for long-term investment?','For 7+ year horizons, equity SIPs have historically delivered 12–15% p.a. vs FD rates of 6.5–7.5%. LTCG on equity gains above ₹1.25L is 12.5% vs FD interest taxed at slab rate (up to 30%). For goals under 3 years, debt funds or FDs are safer.'],
          ].map(([q,a],i)=>(
            <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm md:text-base select-none list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">{a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 pt-8 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[['SIP Calculator','/calculator/sip'],['FD Calculator','/calculator/fd'],['Compound Interest','/calculator/compound-interest'],['EMI Calculator','/calculator/home-loan']].map(([l,h])=>(
              <Link key={h} href={h} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-400">Content by <strong className="text-gray-600">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated: May 2026</p>
      </section>
    </div>
  );
}
