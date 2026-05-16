// Server-rendered AMC-specific SIP content — renders as static HTML, visible in View Source with JS disabled
import type { SipAmcData } from '@/lib/sipAmcData'
import { amcCaveats } from '@/lib/sipAmcData'

const thClass = 'px-3 py-2.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'
const tdClass = 'px-3 py-2.5 text-sm text-gray-800'

type Props = {
  data: SipAmcData
}

export default function SipAmcContent({ data }: Props) {
  const caveat = amcCaveats[data.slug] ?? `Compare ${data.amcName} with other AMCs before finalising your SIP choice — past returns do not guarantee future performance.`

  // Derive top category from first fund's category
  const topCategory = data.topFunds[0]?.category ?? 'Equity'

  return (
    <div className="space-y-5 md:space-y-6">

      {/* Section 1 — Key Facts */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            {data.amcName} — Key Facts (2026)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quick reference for {data.amcName} SIP investors
          </p>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-4 md:pb-5">
          <table className="w-full text-xs md:text-sm min-w-[380px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thClass}>AUM</th>
                <th className={thClass}>Founded</th>
                <th className={thClass}>Min SIP</th>
                <th className={thClass}>Top Category</th>
                <th className={thClass}>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className={`${tdClass} font-bold text-primary-700`}>{data.aum}</td>
                <td className={tdClass}>{data.founded}</td>
                <td className={`${tdClass} font-semibold text-emerald-700`}>{data.minSip}</td>
                <td className={tdClass}>{topCategory}</td>
                <td className={`${tdClass} text-gray-600`}>{data.bestFor.split(',')[0]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2 — Top Funds Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            Top {data.shortName} Funds for SIP in 2026
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Best performing {data.amcName} schemes for systematic investment
          </p>
        </div>
        <div className="overflow-x-auto px-4 md:px-6 pb-2">
          <table className="w-full text-xs md:text-sm min-w-[460px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={thClass}>Fund Name</th>
                <th className={thClass}>Category</th>
                <th className={`${thClass} text-right`}>3-Year Returns*</th>
                <th className={thClass}>Ideal For</th>
              </tr>
            </thead>
            <tbody>
              {data.topFunds.map((fund, idx) => (
                <tr key={fund.name} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className={`${tdClass} font-semibold text-gray-900`}>{fund.name}</td>
                  <td className={tdClass}>
                    <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {fund.category}
                    </span>
                  </td>
                  <td className={`${tdClass} text-right font-bold text-emerald-600`}>{fund.returns3yr} p.a.</td>
                  <td className={`${tdClass} text-gray-500`}>
                    {idx === 0 ? 'Long-term growth' : idx === 1 ? '7+ year SIP horizon' : 'Diversified allocation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-400 px-4 md:px-6 pb-4 italic">
          *3-year returns are historical and do not guarantee future performance. Source: AMC websites, May 2026.
        </p>
      </div>

      {/* Section 3 — Why Choose */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-base flex-shrink-0">⭐</span>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Why Choose {data.amcName} for Your SIP?
            </h2>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
            <p className="text-sm text-emerald-800 font-semibold leading-relaxed">{data.uniqueFeature}</p>
          </div>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{data.intro}</p>
        </div>
      </div>

      {/* Section 4 — Is It Right for You? */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">🤔</span>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Is {data.amcName} Right for You?
            </h2>
          </div>
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">✅ Best For</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{data.bestFor}</p>
          </div>
          <div className="bg-orange-50/60 rounded-xl p-3.5 border border-orange-100">
            <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1.5">⚠️ Keep in Mind</h4>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{caveat}</p>
          </div>
        </div>
      </div>

      {/* Author & Update Line */}
      <div className="flex items-center justify-between px-1 py-2 text-[10px] md:text-xs text-gray-400">
        <span>Content by <strong className="text-gray-500">Satyapal Khakhal</strong>, Founder, gpaisa.in</span>
        <span>Updated: May 2026</span>
      </div>

    </div>
  )
}
