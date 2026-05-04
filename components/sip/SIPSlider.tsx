'use client';

import { useCallback, useRef } from 'react';

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

const colorMap = {
  blue: {
    track: 'accent-blue-600',
    badge: 'bg-blue-600 text-white',
    ring: 'focus:ring-blue-500',
  },
  emerald: {
    track: 'accent-emerald-600',
    badge: 'bg-emerald-600 text-white',
    ring: 'focus:ring-emerald-500',
  },
  amber: {
    track: 'accent-amber-500',
    badge: 'bg-amber-500 text-white',
    ring: 'focus:ring-amber-500',
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
  const inputRef = useRef<HTMLInputElement>(null);
  const colors = colorMap[color];
  const pct = ((value - min) / (max - min)) * 100;
  const displayValue = formatDisplay ? formatDisplay(value) : `${prefix}${value.toLocaleString('en-IN')}${suffix}`;

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        onChange(Math.min(max, Math.max(min, num)));
      }
    },
    [onChange, min, max]
  );

  return (
    <div className="space-y-2">
      {/* Label + Value */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${colors.badge}`}>
          {displayValue}
        </span>
      </div>

      {/* Slider */}
      <div className="relative pt-1">
        <input
          ref={inputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className={`w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer ${colors.track} slider-thumb`}
          style={{
            background: `linear-gradient(to right, ${
              color === 'blue' ? '#2563EB' : color === 'emerald' ? '#059669' : '#F59E0B'
            } 0%, ${
              color === 'blue' ? '#2563EB' : color === 'emerald' ? '#059669' : '#F59E0B'
            } ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
          <span>{prefix}{min.toLocaleString('en-IN')}{suffix}</span>
          <span>{prefix}{max.toLocaleString('en-IN')}{suffix}</span>
        </div>
      </div>

      {/* Manual Input */}
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent transition-all`}
        inputMode="decimal"
      />
    </div>
  );
}
