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
    badge: 'bg-blue-50 text-blue-700 ring-blue-200',
    thumbBorder: '#2563EB',
    trackActive: '#2563EB',
    glow: 'shadow-blue-200',
    labelDot: 'bg-blue-500',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    thumbBorder: '#059669',
    trackActive: '#059669',
    glow: 'shadow-emerald-200',
    labelDot: 'bg-emerald-500',
  },
  amber: {
    gradient: 'from-amber-400 to-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    thumbBorder: '#D97706',
    trackActive: '#D97706',
    glow: 'shadow-amber-200',
    labelDot: 'bg-amber-500',
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
    <div className="group">
      {/* Label + Value Badge */}
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${tokens.labelDot}`} />
          {label}
        </label>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ring-1 transition-all duration-300 ${tokens.badge}`}
        >
          {displayValue}
        </span>
      </div>

      {/* Slider Track */}
      <div className="relative h-10 flex items-center">
        <div className="absolute inset-x-0 h-[6px] bg-gray-100 rounded-full overflow-hidden">
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
          className="sip-slider absolute inset-x-0 w-full h-[6px] appearance-none bg-transparent cursor-pointer z-10"
          style={
            {
              '--thumb-border': tokens.thumbBorder,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 px-0.5 select-none">
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
