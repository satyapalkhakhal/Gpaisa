// Server component — pure computation from props, no hooks needed

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  monthlyEMI: number;
};

export default function HomeLoanFormula({ loanAmount, interestRate, loanTenure, monthlyEMI }: Props) {
  const R = interestRate / 12 / 100;
  const N = loanTenure * 12;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">How is Home Loan EMI Calculated?</h3>
        <p className="text-xs text-gray-500 mt-0.5">The standard EMI formula used by all banks in India</p>
      </div>

      <div className="px-4 md:px-6 pb-4 md:pb-5 space-y-4">
        {/* Formula Block */}
        <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100">
          <div className="text-center">
            <code className="text-base md:text-lg text-gray-800 font-mono font-semibold leading-relaxed">
              EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]
            </code>
          </div>
        </div>

        {/* Variable Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3">
          {[
            { var: 'P', label: 'Principal Amount', desc: 'Loan amount borrowed from bank', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { var: 'R', label: 'Monthly Rate', desc: 'Annual rate ÷ 12 ÷ 100', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { var: 'N', label: 'Total Months', desc: 'Loan tenure in months', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          ].map((item) => (
            <div key={item.var} className={`rounded-lg border p-3 ${item.color}`}>
              <div className="text-lg md:text-xl font-bold font-mono">{item.var}</div>
              <div className="text-[11px] font-semibold mt-0.5">{item.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Live Calculation Example */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-xl p-4 md:p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h4 className="text-sm font-bold text-gray-900">Your Calculation</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">P (Principal)</span>
              <span className="font-bold text-gray-900">{fmt(loanAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">R (Monthly Rate)</span>
              <span className="font-bold text-gray-900">{interestRate}% ÷ 12 = {(R * 100).toFixed(4)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">N (Months)</span>
              <span className="font-bold text-gray-900">{loanTenure} × 12 = {N} months</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm text-gray-700 font-mono flex-wrap">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{fmt(loanAmount)}</span>
                  <span className="text-gray-400">×</span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">{(R).toFixed(6)}</span>
                  <span className="text-gray-400">×</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">(1+R)<sup>{N}</sup></span>
                </div>
                <div className="text-center my-1.5">
                  <div className="w-32 h-px bg-gray-300 mx-auto" />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm text-gray-700 font-mono flex-wrap">
                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">(1+R)<sup>{N}</sup> − 1</span>
                </div>
                <div className="text-center mt-2.5">
                  <span className="text-gray-400 text-xs">=</span>
                  <span className="ml-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-lg font-bold text-base">{fmt(monthlyEMI)}/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Explanation */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>In simple words:</strong> EMI (Equated Monthly Installment) is the fixed amount you pay every month to the bank. 
            It includes both the principal repayment and the interest charged on your outstanding loan balance. 
            In the early years, most of your EMI goes towards paying interest. As the loan matures, 
            more of your EMI goes towards reducing the principal amount.
          </p>
        </div>
      </div>
    </div>
  );
}
