'use client';

import { useMemo } from 'react';

type Props = {
  initialValue: number;
  finalValue: number;
  cagr: number;
  duration: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function CAGRSmartInsights({
  initialValue,
  finalValue,
  cagr,
  duration,
}: Props) {
  const insights = useMemo(() => {
    const results: { icon: string; color: string; title: string; desc: string }[] = [];

    // Insight 1: Doubling time (Rule of 72)
    if (cagr > 0) {
      const doublingYears = 72 / cagr;
      results.push({
        icon: '🔄',
        color: 'from-emerald-50 to-green-50 border-emerald-200',
        title: `Investment doubles in ~${doublingYears.toFixed(1)} years`,
        desc: `At ${cagr.toFixed(1)}% CAGR, your money doubles every ${doublingYears.toFixed(1)} years (Rule of 72).`,
      });
    }

    // Insight 2: What if CAGR increases by 2%
    if (cagr > 0 && initialValue > 0) {
      const boostedCAGR = cagr + 2;
      const boostedFinal = initialValue * Math.pow(1 + boostedCAGR / 100, duration);
      const extraGain = boostedFinal - finalValue;
      if (extraGain > 0) {
        results.push({
          icon: '📈',
          color: 'from-blue-50 to-sky-50 border-blue-200',
          title: `+2% CAGR = +${fmt(Math.round(extraGain))} more`,
          desc: `If CAGR increases to ${boostedCAGR.toFixed(1)}%, your final value becomes ${fmt(Math.round(boostedFinal))} instead of ${fmt(Math.round(finalValue))}.`,
        });
      }
    }

    // Insight 3: Comparison with benchmarks
    const benchmarks = [
      { name: 'FD', rate: 7 },
      { name: 'Gold', rate: 9 },
      { name: 'Nifty 50', rate: 12 },
    ];
    const better: string[] = [];
    const worse: string[] = [];
    for (const b of benchmarks) {
      if (cagr >= b.rate) better.push(`${b.name} (${b.rate}%)`);
      else worse.push(`${b.name} (${b.rate}%)`);
    }
    if (better.length > 0) {
      results.push({
        icon: '🏆',
        color: 'from-amber-50 to-yellow-50 border-amber-200',
        title: `Outperforms ${better.join(', ')}`,
        desc: `Your ${cagr.toFixed(1)}% CAGR beats these asset classes.${worse.length > 0 ? ` Falls behind ${worse.join(', ')}.` : ' Excellent performance!'}`,
      });
    } else if (worse.length > 0) {
      results.push({
        icon: '⚡',
        color: 'from-orange-50 to-red-50 border-orange-200',
        title: `Below all major benchmarks`,
        desc: `Your ${cagr.toFixed(1)}% CAGR trails ${worse.join(', ')}. Consider diversifying your portfolio.`,
      });
    }

    // Insight 4: 10-year projection
    if (cagr > 0 && initialValue > 0) {
      const tenYearValue = initialValue * Math.pow(1 + cagr / 100, 10);
      results.push({
        icon: '🔮',
        color: 'from-purple-50 to-violet-50 border-purple-200',
        title: `10-year projection: ${fmt(Math.round(tenYearValue))}`,
        desc: `If you invest ${fmt(initialValue)} at ${cagr.toFixed(1)}% CAGR for 10 years, it grows to ${fmt(Math.round(tenYearValue))}.`,
      });
    }

    return results;
  }, [initialValue, finalValue, cagr, duration]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">
          💡 Smart Insights
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Investment performance analysis
        </p>
      </div>
      <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${insight.color} rounded-xl p-3 md:p-4 border`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">{insight.title}</h4>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
