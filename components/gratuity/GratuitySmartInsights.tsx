'use client';

import { useMemo } from 'react';

type Props = {
  lastSalary: number;
  yearsOfService: number;
  gratuityAmount: number;
  isCovered: boolean;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function GratuitySmartInsights({
  lastSalary,
  yearsOfService,
  gratuityAmount,
  isCovered,
}: Props) {
  const insights = useMemo(() => {
    const results: { icon: string; color: string; title: string; desc: string }[] = [];
    const divisor = isCovered ? 26 : 30;

    // Insight 1: Working 1 more year increases gratuity by
    const currentGratuity = Math.min((lastSalary * 15 * yearsOfService) / divisor, 2000000);
    const nextYearGratuity = Math.min((lastSalary * 15 * (yearsOfService + 1)) / divisor, 2000000);
    const increaseOneYear = nextYearGratuity - currentGratuity;

    if (increaseOneYear > 0) {
      results.push({
        icon: '⏱️',
        color: 'from-emerald-50 to-green-50 border-emerald-200',
        title: `Working 1 more year = +${fmt(Math.round(increaseOneYear))}`,
        desc: `Your gratuity increases from ${fmt(Math.round(currentGratuity))} to ${fmt(Math.round(nextYearGratuity))} with just 1 extra year.`,
      });
    } else if (currentGratuity >= 2000000) {
      results.push({
        icon: '🎯',
        color: 'from-amber-50 to-yellow-50 border-amber-200',
        title: 'Gratuity capped at ₹20 lakh',
        desc: `Your calculated gratuity exceeds the ₹20 lakh cap. Additional years won't increase the payout.`,
      });
    }

    // Insight 2: What if salary increases by 10%?
    const increasedSalary = lastSalary * 1.1;
    const newGratuity = Math.min((increasedSalary * 15 * yearsOfService) / divisor, 2000000);
    const salaryDiff = newGratuity - currentGratuity;
    if (salaryDiff > 0) {
      results.push({
        icon: '📈',
        color: 'from-blue-50 to-sky-50 border-blue-200',
        title: `10% salary hike = +${fmt(Math.round(salaryDiff))} gratuity`,
        desc: `If your salary increases to ${fmt(Math.round(increasedSalary))}, your gratuity jumps to ${fmt(Math.round(newGratuity))}.`,
      });
    }

    // Insight 3: Eligibility status
    if (yearsOfService < 5) {
      const yearsLeft = 5 - yearsOfService;
      const futureGratuity = Math.min((lastSalary * 15 * 5) / divisor, 2000000);
      results.push({
        icon: '⏳',
        color: 'from-red-50 to-orange-50 border-red-200',
        title: `${yearsLeft} more year${yearsLeft > 1 ? 's' : ''} to eligibility`,
        desc: `Complete 5 years to become eligible. At that point, your gratuity would be ${fmt(Math.round(futureGratuity))}.`,
      });
    }

    // Insight 4: Tax benefit
    if (gratuityAmount > 0 && yearsOfService >= 5) {
      results.push({
        icon: '💰',
        color: 'from-purple-50 to-violet-50 border-purple-200',
        title: 'Entire amount is tax-free',
        desc: `Your gratuity of ${fmt(Math.round(gratuityAmount))} is completely exempt from income tax (up to ₹20 lakh limit).`,
      });
    }

    return results;
  }, [lastSalary, yearsOfService, gratuityAmount, isCovered]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">
          💡 Smart Insights
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Personalized gratuity analysis
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
