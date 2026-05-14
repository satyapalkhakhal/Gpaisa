'use client';

import SIPSlider from '@/components/sip/SIPSlider';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtLakh = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return fmt(n);
};

export type PrepaymentConfig = {
  enabled: boolean;
  amount: number;
  type: 'emi-cut' | 'tenure-cut';
  startMonth: number;
  frequency: 'one-time' | 'monthly' | 'yearly';
};

type Props = {
  config: PrepaymentConfig;
  onChange: (config: PrepaymentConfig) => void;
  maxTenureMonths: number;
  // Comparison data
  originalInterest: number;
  originalTenureMonths: number;
  prepayInterest: number;
  prepayTenureMonths: number;
  originalEMI: number;
  prepayEMI: number;
};

export default function HomeLoanPrepayment({
  config,
  onChange,
  maxTenureMonths,
  originalInterest,
  originalTenureMonths,
  prepayInterest,
  prepayTenureMonths,
  originalEMI,
  prepayEMI,
}: Props) {
  const interestSaved = originalInterest - prepayInterest;
  const tenureSaved = originalTenureMonths - prepayTenureMonths;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => onChange({ ...config, enabled: !config.enabled })}
        className="w-full flex justify-between items-center px-4 md:px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">⚡</span>
          <div>
            <h3 className="text-sm md:text-base font-bold text-gray-900">Prepayment Simulator</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">See how prepayment reduces your loan burden</p>
          </div>
        </div>
        <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${
          config.enabled ? 'bg-primary-500' : 'bg-gray-300'
        }`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            config.enabled ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </div>
      </button>

      {config.enabled && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4">
          {/* Prepayment Amount */}
          <SIPSlider
            label="Prepayment Amount"
            value={config.amount}
            min={50000}
            max={5000000}
            step={50000}
            prefix="₹"
            color="blue"
            onChange={(v) => onChange({ ...config, amount: v })}
            formatDisplay={(v) => fmtLakh(v)}
          />

          {/* Prepayment Type Toggle */}
          <div>
            <span className="text-[13px] font-semibold text-gray-500 block mb-2">Prepayment Impact</span>
            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <button
                onClick={() => onChange({ ...config, type: 'tenure-cut' })}
                className={`sip-touch-target flex-1 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                  config.type === 'tenure-cut'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                    : 'text-gray-500 active:bg-gray-100/80'
                }`}
              >
                🗓️ Reduce Tenure
              </button>
              <button
                onClick={() => onChange({ ...config, type: 'emi-cut' })}
                className={`sip-touch-target flex-1 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                  config.type === 'emi-cut'
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                    : 'text-gray-500 active:bg-gray-100/80'
                }`}
              >
                💰 Reduce EMI
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {config.type === 'tenure-cut'
                ? 'EMI stays same, loan ends earlier — saves more interest'
                : 'Tenure stays same, monthly EMI reduces — lowers monthly burden'}
            </p>
          </div>

          {/* Frequency Toggle */}
          <div>
            <span className="text-[13px] font-semibold text-gray-500 block mb-2">Frequency</span>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
              {(['one-time', 'yearly', 'monthly'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => onChange({ ...config, frequency: freq })}
                  className={`sip-touch-target flex-1 px-2 py-2 rounded-md text-xs font-bold transition-all ${
                    config.frequency === freq
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                      : 'text-gray-500 active:bg-gray-100/80'
                  }`}
                >
                  {freq === 'one-time' ? 'One-time' : freq === 'yearly' ? 'Yearly' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          {/* Prepayment Start Month */}
          <SIPSlider
            label="Start After Month"
            value={config.startMonth}
            min={1}
            max={Math.max(1, maxTenureMonths - 12)}
            step={1}
            suffix=""
            color="amber"
            onChange={(v) => onChange({ ...config, startMonth: v })}
            formatDisplay={(v) => {
              const years = Math.floor(v / 12);
              const months = v % 12;
              return years > 0
                ? `${years} yr${years > 1 ? 's' : ''} ${months > 0 ? `${months} mo` : ''}`
                : `${months} month${months !== 1 ? 's' : ''}`;
            }}
          />

          {/* Comparison Table */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
              <div className="px-3 py-2 text-gray-500">Metric</div>
              <div className="px-3 py-2 text-gray-500 text-right">Original</div>
              <div className="px-3 py-2 text-emerald-600 text-right">With Prepay</div>
              <div className="px-3 py-2 text-primary-600 text-right">Savings</div>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {/* EMI */}
              <div className="grid grid-cols-4 text-xs md:text-sm">
                <div className="px-3 py-2.5 text-gray-700 font-medium">EMI</div>
                <div className="px-3 py-2.5 text-right text-gray-800 font-semibold">{fmt(originalEMI)}</div>
                <div className="px-3 py-2.5 text-right text-emerald-700 font-semibold">{fmt(prepayEMI)}</div>
                <div className="px-3 py-2.5 text-right text-primary-700 font-bold">
                  {originalEMI - prepayEMI > 0 ? `${fmt(originalEMI - prepayEMI)}/mo` : '—'}
                </div>
              </div>
              {/* Interest */}
              <div className="grid grid-cols-4 text-xs md:text-sm">
                <div className="px-3 py-2.5 text-gray-700 font-medium">Interest</div>
                <div className="px-3 py-2.5 text-right text-orange-600 font-semibold">{fmtLakh(originalInterest)}</div>
                <div className="px-3 py-2.5 text-right text-emerald-700 font-semibold">{fmtLakh(prepayInterest)}</div>
                <div className="px-3 py-2.5 text-right text-primary-700 font-bold">
                  {interestSaved > 0 ? fmtLakh(interestSaved) : '—'}
                </div>
              </div>
              {/* Tenure */}
              <div className="grid grid-cols-4 text-xs md:text-sm">
                <div className="px-3 py-2.5 text-gray-700 font-medium">Tenure</div>
                <div className="px-3 py-2.5 text-right text-gray-800 font-semibold">
                  {Math.floor(originalTenureMonths / 12)}y {originalTenureMonths % 12}m
                </div>
                <div className="px-3 py-2.5 text-right text-emerald-700 font-semibold">
                  {Math.floor(prepayTenureMonths / 12)}y {prepayTenureMonths % 12}m
                </div>
                <div className="px-3 py-2.5 text-right text-primary-700 font-bold">
                  {tenureSaved > 0 ? `${Math.floor(tenureSaved / 12)}y ${tenureSaved % 12}m` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-[11px] text-blue-800 leading-relaxed">
              💡 <strong>Pro Tip:</strong> {config.type === 'tenure-cut'
                ? 'Reducing tenure saves significantly more interest compared to reducing EMI. Even a small prepayment in the early years can save lakhs in interest.'
                : 'Reducing EMI lowers your monthly burden and improves cash flow. Useful if your monthly expenses have increased.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
