// Server-rendered Principal vs Interest chart fallback
// Renders a static CSS-based donut chart visible in View Source / JS disabled

type Props = {
  loanAmount: number;
  totalInterest: number;
  principalPercent: number;
  interestPercent: number;
};

const fmtLakh = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
};

export default function HomeLoanChartSSR({
  loanAmount,
  totalInterest,
  principalPercent,
  interestPercent,
}: Props) {
  const totalAmount = loanAmount + totalInterest;
  // CSS conic-gradient donut chart — renders server-side, no JS needed
  const principalDeg = (principalPercent / 100) * 360;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" id="payment-chart-ssr">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">Payment Breakdown</h3>
        <p className="text-xs text-gray-500 mt-0.5">Principal vs Interest distribution</p>
      </div>

      <div className="w-full px-2 md:px-4 pb-4">
        {/* CSS Donut Chart */}
        <div className="flex justify-center">
          <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px]">
            {/* Donut ring using conic-gradient */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #10B981 0deg ${principalDeg}deg,
                  #F97316 ${principalDeg}deg 360deg
                )`,
              }}
            />
            {/* Inner cutout for donut effect */}
            <div className="absolute inset-[22%] rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-[10px] font-semibold text-gray-500">Total Payment</span>
              <span className="text-[15px] font-extrabold text-gray-900">{fmtLakh(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 md:px-6 pb-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <div>
            <div className="text-[11px] text-gray-500">Principal ({principalPercent}%)</div>
            <div className="text-xs font-bold text-gray-900">{fmtLakh(loanAmount)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <div>
            <div className="text-[11px] text-gray-500">Interest ({interestPercent}%)</div>
            <div className="text-xs font-bold text-orange-600">{fmtLakh(totalInterest)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
