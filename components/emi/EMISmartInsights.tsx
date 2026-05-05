'use client';

import { useMemo } from 'react';

type Props = {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEMI: number;
  totalInterest: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

function calcEMI(P: number, annualRate: number, months: number) {
  const R = annualRate / 12 / 100;
  if (R === 0) return P / months;
  return (P * R * Math.pow(1 + R, months)) / (Math.pow(1 + R, months) - 1);
}

export default function EMISmartInsights({
  loanAmount,
  interestRate,
  tenureMonths,
  monthlyEMI,
  totalInterest,
}: Props) {
  const insights = useMemo(() => {
    const results: { icon: string; color: string; title: string; desc: string }[] = [];

    // Insight 1: Reduce tenure by 2 years (if possible)
    const reducedMonths = Math.max(12, tenureMonths - 24);
    if (reducedMonths < tenureMonths) {
      const reducedEMI = calcEMI(loanAmount, interestRate, reducedMonths);
      const reducedTotal = reducedEMI * reducedMonths;
      const reducedInterest = reducedTotal - loanAmount;
      const savings = totalInterest - reducedInterest;
      if (savings > 0) {
        results.push({
          icon: '⏱️',
          color: 'from-emerald-50 to-green-50 border-emerald-200',
          title: `Reduce tenure by 2 years`,
          desc: `Your EMI increases to ${fmt(Math.round(reducedEMI))}/mo but you save ${fmt(Math.round(savings))} in interest!`,
        });
      }
    }

    // Insight 2: Increase EMI by ₹2,000
    const boostedEMI = monthlyEMI + 2000;
    const R = interestRate / 12 / 100;
    if (R > 0) {
      // Calculate new tenure with boosted EMI
      const newMonths = Math.ceil(
        Math.log(boostedEMI / (boostedEMI - loanAmount * R)) / Math.log(1 + R)
      );
      if (newMonths > 0 && newMonths < tenureMonths && isFinite(newMonths)) {
        const newTotal = boostedEMI * newMonths;
        const newInterest = newTotal - loanAmount;
        const savings = totalInterest - newInterest;
        if (savings > 0) {
          results.push({
            icon: '📈',
            color: 'from-blue-50 to-sky-50 border-blue-200',
            title: `Pay ₹2,000 more per month`,
            desc: `Loan closes ${Math.round((tenureMonths - newMonths) / 12 * 10) / 10} years earlier. You save ${fmt(Math.round(savings))} in interest.`,
          });
        }
      }
    }

    // Insight 3: Lower interest rate by 1%
    if (interestRate > 1) {
      const lowerEMI = calcEMI(loanAmount, interestRate - 1, tenureMonths);
      const lowerTotal = lowerEMI * tenureMonths;
      const lowerInterest = lowerTotal - loanAmount;
      const savings = totalInterest - lowerInterest;
      if (savings > 0) {
        results.push({
          icon: '💡',
          color: 'from-amber-50 to-yellow-50 border-amber-200',
          title: `Get 1% lower interest rate`,
          desc: `EMI drops to ${fmt(Math.round(lowerEMI))}/mo and you save ${fmt(Math.round(savings))} over the loan period.`,
        });
      }
    }

    // Insight 4: Early payments structure
    const firstMonthInterest = loanAmount * R;
    const firstMonthPrincipal = monthlyEMI - firstMonthInterest;
    if (firstMonthInterest > 0 && firstMonthPrincipal > 0) {
      const interestPct = Math.round((firstMonthInterest / monthlyEMI) * 100);
      results.push({
        icon: '🔍',
        color: 'from-purple-50 to-violet-50 border-purple-200',
        title: `${interestPct}% of first EMI goes to interest`,
        desc: `In Month 1, only ${fmt(Math.round(firstMonthPrincipal))} of your ${fmt(Math.round(monthlyEMI))} EMI reduces the principal.`,
      });
    }

    return results;
  }, [loanAmount, interestRate, tenureMonths, monthlyEMI, totalInterest]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">
          💡 Smart Insights
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Ways to optimize your loan
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
