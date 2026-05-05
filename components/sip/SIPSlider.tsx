'use client';

import { useCallback, useId } from 'react';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  color: 'blue' | 'emerald' | 'amber';
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
};

const colorTokens = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    valueBg: 'bg-blue-50',
    valueText: 'text-blue-700',
    valueRing: 'ring-blue-200/60',
    thumbBorder: '#2563EB',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    valueBg: 'bg-emerald-50',
    valueText: 'text-emerald-700',
    valueRing: 'ring-emerald-200/60',
    thumbBorder: '#059669',
  },
  amber: {
    gradient: 'from-amber-400 to-amber-500',
    valueBg: 'bg-amber-50',
    valueText: 'text-amber-700',
    valueRing: 'ring-amber-200/60',
    thumbBorder: '#D97706',
  },
};

export default function SIPSlider({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  prefix = '',
  color,
  onChange,
  formatDisplay,
}: Props) {
  const id = useId();
  const tokens = colorTokens[color];
  const pct = ((value - min) / (max - min)) * 100;
  const displayValue = formatDisplay
    ? formatDisplay(value)
    : `${prefix}${value.toLocaleString('en-IN')}${suffix}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  return (
    <div className="sip-touch-target">
      {/* Label — own row on top */}
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold text-gray-500 mb-1.5"
      >
        {label}
      </label>

      {/* Value — prominent, displayed above slider */}
      <div
        className={`inline-block text-lg font-bold px-3 py-1.5 rounded-lg ring-1 mb-3 ${tokens.valueBg} ${tokens.valueText} ${tokens.valueRing}`}
      >
        {displayValue}
      </div>

      {/* Slider Track — min 48px touch area */}
      <div className="relative h-12 flex items-center">
        <div className="absolute inset-x-0 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${tokens.gradient} rounded-full transition-[width] duration-100 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="sip-slider absolute inset-x-0 w-full h-2 appearance-none bg-transparent cursor-pointer z-10"
          style={
            {
              '--thumb-border': tokens.thumbBorder,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-0.5 px-0.5 select-none">
        <span>
          {prefix}
          {min.toLocaleString('en-IN')}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString('en-IN')}
          {suffix}
        </span>
      </div>
    </div>
  );
}
