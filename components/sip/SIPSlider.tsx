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
    valueBg: 'bg-emerald-50/80',
    valueText: 'text-emerald-600',
    valueRing: 'ring-emerald-200/50',
    thumbBorder: '#00d09c',
    trackActive: '#00d09c',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    valueBg: 'bg-emerald-50/80',
    valueText: 'text-emerald-600',
    valueRing: 'ring-emerald-200/50',
    thumbBorder: '#00d09c',
    trackActive: '#00d09c',
  },
  amber: {
    gradient: 'from-emerald-400 to-emerald-500',
    valueBg: 'bg-emerald-50/80',
    valueText: 'text-emerald-600',
    valueRing: 'ring-emerald-200/50',
    thumbBorder: '#00d09c',
    trackActive: '#00d09c',
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
      {/* Groww-style: Label left, Value right — same row */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm text-gray-700"
        >
          {label}
        </label>
        <div
          className={`text-base font-bold px-3 py-1 rounded-md ring-1 ${tokens.valueBg} ${tokens.valueText} ${tokens.valueRing}`}
        >
          {displayValue}
        </div>
      </div>

      {/* Slim slider track — Groww style */}
      <div className="relative h-10 flex items-center">
        <div className="absolute inset-x-0 h-[3px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-out"
            style={{ width: `${pct}%`, backgroundColor: tokens.trackActive }}
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
          className="sip-slider absolute inset-x-0 w-full h-[3px] appearance-none bg-transparent cursor-pointer z-10"
          style={
            {
              '--thumb-border': tokens.thumbBorder,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-[11px] text-gray-400 mt-0 px-0.5 select-none">
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
