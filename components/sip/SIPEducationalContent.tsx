// Server component — no 'use client', no hooks, renders as static HTML
import Link from 'next/link';
import { banks } from '@/lib/bankData';

export default function SIPEducationalContent() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* What is SIP */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">What is SIP (Systematic Investment Plan)?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
          A <strong>Systematic Investment Plan (SIP)</strong> is one of the most popular investment methods in India, and using a SIP calculator helps investors estimate their future returns easily.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          SIP is one of the most popular investment methods in India, with over <strong>6 crore SIP accounts</strong> and monthly inflows exceeding ₹15,000 crores. It&apos;s perfect for salaried individuals, young professionals, and anyone looking to build wealth systematically.
        </p>
      </div>

      {/* Formula Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">How Does Our SIP Calculator Work?</h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
          Our SIP calculator uses the compound interest formula to calculate your investment returns:
        </p>
        <div className="bg-white rounded-xl p-4 md:p-6 mb-4 md:mb-6 border border-gray-200">
          <code className="text-base md:text-lg text-gray-800 font-mono">
            M = P × [(1 + i)ⁿ – 1] / i × (1 + i)
          </code>
          <div className="mt-3 md:mt-4 text-sm text-gray-600 space-y-1">
            <div><strong>M</strong> = Maturity amount (future value)</div>
            <div><strong>P</strong> = Monthly SIP amount</div>
            <div><strong>i</strong> = Monthly interest rate (annual rate / 12 / 100)</div>
            <div><strong>n</strong> = Total number of months</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 md:mb-3">📊 Example Calculation</h3>
            <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm">
              <li>• Monthly Investment: ₹5,000</li>
              <li>• Expected Return: 12% p.a.</li>
              <li>• Time Period: 10 years</li>
              <li>• <strong>Total Value: ₹11.6 lakhs</strong></li>
              <li>• Total Invested: ₹6 lakhs</li>
              <li>• Returns: ₹5.6 lakhs</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 md:mb-3">🚀 Step-Up SIP Benefit</h3>
            <ul className="space-y-1.5 md:space-y-2 text-gray-700 text-sm">
              <li>• Starting SIP: ₹5,000</li>
              <li>• Annual Increase: 10%</li>
              <li>• Time Period: 10 years</li>
              <li>• <strong>Total Value: ₹15.2 lakhs</strong></li>
              <li>• Extra Returns: ₹3.6 lakhs</li>
              <li>• 31% more wealth!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SIP Reality Check */}
      <div className="bg-red-50 rounded-2xl p-5 md:p-6 border border-red-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">SIP Reality Check (Important)</h2>
        <ul className="text-gray-700 space-y-2 text-sm md:text-base">
          <li>• Returns are market-linked (not guaranteed)</li>
          <li>• Short-term losses are possible</li>
          <li>• 1–3 year performance can be volatile</li>
        </ul>
        <p className="mt-3 font-semibold text-gray-800 text-sm md:text-base">
          👉 SIP works best when you stay invested for 7–10+ years.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Benefits of SIP Investment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: '💰', title: 'Rupee Cost Averaging', desc: 'Buy more units when prices are low and fewer when high.' },
            { icon: '📈', title: 'Power of Compounding', desc: 'Your returns generate more returns over time.' },
            { icon: '🎯', title: 'Disciplined Investing', desc: 'Automated investments keep you committed.' },
            { icon: '🔄', title: 'Flexibility', desc: 'Start with ₹500, pause, or increase anytime.' },
            { icon: '📊', title: 'No Market Timing', desc: 'Invest regularly without worrying about market.' },
            { icon: '💎', title: 'Wealth Creation', desc: 'Build corpus for retirement, education, or goals.' },
          ].map((b) => (
            <div key={b.title} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 md:p-5 border border-gray-100">
              <div className="text-2xl mb-2">{b.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{b.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Types of SIP */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 md:p-8 border border-green-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Types of SIP Calculators</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: '1. Regular SIP Calculator', desc: 'Calculate returns for fixed monthly investments.', color: 'border-primary-600' },
            { title: '2. Step-Up SIP Calculator', desc: 'Increase your SIP amount every year to maximize wealth.', color: 'border-success-600' },
            { title: '3. Lump Sum Calculator', desc: 'Calculate returns on one-time investments.', color: 'border-gold-600' },
            { title: '4. SIP with Inflation Calculator', desc: 'Adjust SIP for inflation to maintain purchasing power.', color: 'border-agri-600' },
          ].map((t) => (
            <div key={t.title} className={`bg-white rounded-xl p-4 md:p-5 border-l-4 ${t.color}`}>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">{t.title}</h3>
              <p className="text-gray-700 text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SIP vs FD vs Gold */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">SIP vs FD vs Gold</h2>
        <ul className="text-gray-700 space-y-2 text-sm md:text-base">
          <li>• SIP → Growth (10–14%)</li>
          <li>• FD → Stable returns (5–7%)</li>
          <li>• Gold → Inflation hedge</li>
        </ul>
        <p className="mt-3 text-gray-800 text-sm md:text-base">
          👉 Smart investors often combine SIP + Gold for balanced portfolios.
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 md:space-y-5">
          {[
            { q: 'What is a SIP Calculator?', a: 'A SIP Calculator is a financial tool that helps you calculate the returns on your Systematic Investment Plan (SIP) investments in mutual funds.' },
            { q: 'How accurate is the SIP Calculator?', a: 'The SIP calculator provides estimates based on expected rate of return. Actual returns may vary based on market performance.' },
            { q: 'What is the expected return rate for SIP?', a: 'Equity funds typically offer 12-15% returns, Balanced funds 10-12%, and Debt funds 7-9% over the long term.' },
            { q: 'What is Step-Up SIP?', a: 'Step-Up SIP allows you to increase your SIP amount periodically—annually or semi-annually—to align with growing income.' },
            { q: 'Is SIP better than lump sum?', a: 'SIP benefits from rupee cost averaging and reduces market timing risk. Lump sum suits investors with surplus funds during favorable conditions.' },
            { q: 'Can I stop or pause my SIP?', a: 'Yes, SIPs offer complete flexibility. You can pause, stop, or modify your SIP amount anytime without penalties.' },
            { q: 'What is the minimum SIP amount?', a: 'Most mutual funds allow SIP starting at ₹500 per month. Some even offer SIPs starting at ₹100.' },
            { q: 'How is SIP taxed?', a: 'For Equity funds: LTCG above ₹1 lakh taxed at 10%, STCG at 15%. For Debt funds: gains are taxed as per your income slab.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-gray-100 pb-3 md:pb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bank-wise Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 pb-3 border-b border-gray-200">Bank-wise SIP Calculators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {banks.map((bank) => (
            <Link
              key={bank.slug}
              href={`/calculator/${bank.slug}-sip-calculator`}
              className="sip-touch-target block px-3 md:px-4 py-3 min-h-[44px] text-gray-700 active:bg-primary-50 active:text-primary-600 transition-colors border-b border-gray-100 font-medium text-sm flex items-center"
            >
              {bank.name} SIP Calculator
            </Link>
          ))}
        </div>
      </div>

      {/* Other Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3 md:mb-4">Other Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Link href="/calculator/ppf" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">PPF Calculator</div>
                <div className="text-xs text-gray-600">Calculate PPF returns</div>
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
          <Link href="/calculator/emi" className="sip-touch-target block p-4 min-h-[56px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 active:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏠</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">EMI Calculator</div>
                <div className="text-xs text-gray-600">Calculate loan EMI</div>
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
          <Link href="/gold-rate" className="sip-touch-target bg-white rounded-xl p-4 md:p-5 active:shadow-xl transition-shadow border border-gray-200">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Gold vs Silver</h3>
            <p className="text-gray-700 text-xs">Compare precious metals</p>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 via-success-600 to-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 text-white text-center">
        <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">Start Your Wealth Journey Today!</h2>
        <p className="text-sm md:text-base text-green-100 mb-5 md:mb-6 max-w-2xl mx-auto">
          Use our free SIP calculator to plan your investments and achieve your financial dreams.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a href="/finance" className="sip-touch-target bg-white text-primary-600 px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-green-50 transition-colors shadow-lg text-sm flex items-center justify-center">
            Explore More Tools
          </a>
          <a href="/news" className="sip-touch-target bg-primary-500 text-white px-6 py-3.5 min-h-[48px] rounded-full font-bold active:bg-primary-400 transition-colors border-2 border-white/30 text-sm flex items-center justify-center">
            Read Finance News
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-xl border mt-4">
        <div className="px-4 py-5 md:py-6 text-center">
          <p className="text-xs text-gray-500">
            Last Updated: May 2026
          </p>
        </div>
      </div>
    </div>
  );
}
