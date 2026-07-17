import Link from 'next/link';

export default function GSTContent() {
  return (
    <div className="space-y-10 md:space-y-14 text-gray-700">

      {/* ─── 1. Formula Section ─── */}
      <section aria-labelledby="gst-formula-heading">
        <h2 id="gst-formula-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          How is GST Calculated? The Formula Explained
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">Add GST (Exclusive)</p>
            <p className="text-sm font-mono text-gray-800 mb-1">GST Amount = Original × (Rate ÷ 100)</p>
            <p className="text-sm font-mono text-gray-800">Total = Original + GST Amount</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Remove GST (Inclusive)</p>
            <p className="text-sm font-mono text-gray-800 mb-1">Original = Total ÷ (1 + Rate / 100)</p>
            <p className="text-sm font-mono text-gray-800">GST Amount = Total − Original</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📘 Worked Example — Add GST</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Priya buys software worth <strong>₹10,000</strong>. GST rate = <strong>18%</strong>.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">CGST (9%)</span><span className="font-semibold text-purple-600">₹900</span></li>
              <li className="flex justify-between"><span className="text-gray-500">SGST (9%)</span><span className="font-semibold text-purple-600">₹900</span></li>
              <li className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5"><span className="font-semibold text-gray-800">Total Invoice</span><span className="font-bold text-gray-900">₹11,800</span></li>
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">📗 Worked Example — Remove GST</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              An invoice shows <strong>₹11,800</strong> inclusive of 18% GST.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">Original = ₹11,800 ÷ 1.18</span><span className="font-semibold text-emerald-600">₹10,000</span></li>
              <li className="flex justify-between"><span className="text-gray-500">GST Component</span><span className="font-semibold text-emerald-600">₹1,800</span></li>
              <li className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5"><span className="font-semibold text-gray-800">Base Price</span><span className="font-bold text-gray-900">₹10,000</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 2. GST Rate Slab Table ─── */}
      <section aria-labelledby="gst-slabs-heading">
        <h2 id="gst-slabs-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          GST Rate Slabs in India (GST 2.0, effective 22 Sep 2025)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          The GST Council&apos;s GST 2.0 reform replaced the old four-slab structure with a simpler three-slab system. The 12% and 28% slabs have been withdrawn — most items in those slabs moved to 5% or 18%, with a small set of de-merit/luxury goods moved to the new 40% slab.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">GST Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="bg-white hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">0%</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">Exempt</td>
                <td className="px-4 py-3 text-gray-600">Fresh milk, eggs, vegetables, books, newspapers, individual life &amp; health insurance</td>
              </tr>
              <tr className="bg-white hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">5%</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">Essential</td>
                <td className="px-4 py-3 text-gray-600">Edible oil, sugar, spices, tea, coffee, coal, butter, cheese, frozen meat</td>
              </tr>
              <tr className="bg-white hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">18%</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">Standard</td>
                <td className="px-4 py-3 text-gray-600">Most services, mobile phones, AC restaurants, IT services, financial services</td>
              </tr>
              <tr className="bg-white hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">40%</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">De-merit / luxury</td>
                <td className="px-4 py-3 text-gray-600">Cars, tobacco, aerated drinks, 5-star hotels, casinos</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Special rates outside these slabs still apply — e.g. 0.25% on rough precious stones and 3% on gold, silver, and jewellery.
        </p>
      </section>

      {/* ─── 3. CGST vs SGST vs IGST ─── */}
      <section aria-labelledby="gst-types-heading">
        <h2 id="gst-types-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          CGST, SGST and IGST — What&apos;s the Difference?
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">CGST</p>
            <p className="text-base font-bold text-gray-900 mb-2">Central GST</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Collected by the <strong>central government</strong> on intrastate sales. Rate = <strong>half</strong> of the total GST rate.
            </p>
            <p className="text-sm text-purple-600 font-semibold mt-3">18% GST → CGST 9%</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">SGST</p>
            <p className="text-base font-bold text-gray-900 mb-2">State GST</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Collected by the <strong>state government</strong> on intrastate sales. Rate = <strong>half</strong> of the total GST rate.
            </p>
            <p className="text-sm text-blue-600 font-semibold mt-3">18% GST → SGST 9%</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">IGST</p>
            <p className="text-base font-bold text-gray-900 mb-2">Integrated GST</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Collected by the <strong>central government</strong> on <em>interstate</em> sales. Rate = <strong>full</strong> GST rate.
            </p>
            <p className="text-sm text-emerald-600 font-semibold mt-3">Interstate → IGST 18%</p>
          </div>
        </div>

        {/* Visual example */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5">
          <p className="text-sm font-bold text-gray-700 mb-4">📊 Visual Example — ₹10,000 sale at 18% GST</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <p className="font-semibold text-gray-800 mb-2">🏪 Intrastate (same state)</p>
              <p className="text-gray-600 mb-1">Seller &amp; buyer in same state</p>
              <p className="text-purple-600 font-mono">CGST ₹900 + SGST ₹900 = ₹1,800</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <p className="font-semibold text-gray-800 mb-2">🚚 Interstate (Mumbai → Delhi)</p>
              <p className="text-gray-600 mb-1">Seller in Mumbai, buyer in Delhi</p>
              <p className="text-emerald-600 font-mono">IGST ₹1,800 (no CGST/SGST)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Who needs to pay GST? ─── */}
      <section aria-labelledby="gst-who-heading">
        <h2 id="gst-who-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Who Needs to Pay GST?
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">🏢</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Businesses (Mandatory Registration)</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Businesses with annual turnover above <strong>₹40 lakh (goods)</strong> or <strong>₹20 lakh (services)</strong> must register for GST. Threshold is ₹10 lakh for special category states.
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">🧾</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Composition Scheme</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Businesses with turnover up to <strong>₹1.5 crore</strong> can opt for the Composition Scheme — a simplified flat-rate GST with reduced compliance burden. Not available for service providers (except restaurants).
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">🛒</div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Consumers</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                GST is already included in the <strong>MRP of most products</strong>. As a consumer, you don&apos;t file or pay GST separately. Use the <em>Remove GST</em> mode above to find the base price of any MRP-tagged item.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Slab-wise Example Table ─── */}
      <section aria-labelledby="gst-examples-heading">
        <h2 id="gst-examples-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          GST Calculation Examples — All Slabs
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Amount</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">GST Rate</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">GST Amount</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">CGST</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">SGST</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { amount: '₹1,000',  rate: '5%',  gst: '₹50',    cgst: '₹25',   sgst: '₹25',   total: '₹1,050' },
                { amount: '₹1,000',  rate: '18%', gst: '₹180',   cgst: '₹90',   sgst: '₹90',   total: '₹1,180' },
                { amount: '₹1,000',  rate: '40%', gst: '₹400',   cgst: '₹200',  sgst: '₹200',  total: '₹1,400' },
                { amount: '₹10,000', rate: '18%', gst: '₹1,800', cgst: '₹900',  sgst: '₹900',  total: '₹11,800' },
                { amount: '₹50,000', rate: '40%', gst: '₹20,000',cgst: '₹10,000',sgst: '₹10,000',total: '₹70,000' },
              ].map((row, i) => (
                <tr key={i} className="bg-white hover:bg-purple-50/30 transition-colors">
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{row.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-700">{row.rate}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{row.gst}</td>
                  <td className="px-4 py-3 text-right text-purple-600">{row.cgst}</td>
                  <td className="px-4 py-3 text-right text-purple-600">{row.sgst}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 6. FAQ Section ─── */}
      <section aria-labelledby="gst-faq-heading">
        <h2 id="gst-faq-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
          Frequently Asked Questions — GST Calculator
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'What is the GST rate on services in India?',
              a: 'Most services in India fall under the 18% GST slab. Notable exceptions include healthcare and education (0%), food delivery apps (5%), and financial services (18%). Always check the latest CBIC notifications for specific service categories.',
            },
            {
              q: 'How do I calculate GST on an inclusive amount?',
              a: 'Divide the total amount by (1 + rate/100). Example: ₹11,800 ÷ 1.18 = ₹10,000 base price. The GST component is ₹11,800 − ₹10,000 = ₹1,800. Use the "Remove GST" mode in the calculator above.',
            },
            {
              q: 'What is the difference between CGST and IGST?',
              a: 'CGST (Central GST) + SGST (State GST) apply to intrastate transactions and are split equally between centre and state. IGST (Integrated GST) applies to interstate transactions at the full rate and goes entirely to the central government before being shared.',
            },
            {
              q: 'Is GST applicable on exports?',
              a: 'No. Exports are zero-rated under GST. This means no GST is charged on exported goods or services. Exporters can also claim refund of input tax credit (ITC) paid on inputs used in export production.',
            },
            {
              q: 'What items are exempt from GST?',
              a: 'Fresh fruits and vegetables, milk, eggs, bread, books, newspapers, and most agricultural produce are exempt (0% GST). Petroleum products, alcohol for human consumption, and electricity are currently outside the GST framework.',
            },
          ].map(({ q, a }, i) => (
            <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm md:text-base select-none list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ─── 7. Author byline + Related Calculators ─── */}
      <section className="border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500 mb-6">
          Content by <strong className="text-gray-700">Satyapal Khakhal</strong>, Founder, gpaisa.in | Updated for GST 2.0: July 2026
        </p>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'EMI Calculator', href: '/calculator/emi' },
              { label: 'Home Loan Calculator', href: '/calculator/home-loan' },
              { label: 'FD Calculator', href: '/calculator/fd' },
              { label: 'SIP Calculator', href: '/calculator/sip' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
