'use client';

import { OptionGroupProps } from '../type';

export function OptionGroup<TValue extends string>({
  label,
  value,
  options,
  disabled,
  onChange,
}: OptionGroupProps<TValue>) {
  const entries = Object.entries(options) as [TValue, string][];

  return (
    <div>
      <p className="block text-[10px] uppercase font-bold mb-1 opacity-60">{label}</p>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={label}>
        {entries.map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={optionValue === value}
            disabled={disabled}
            onClick={() => onChange(optionValue)}
            className={`p-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 ${
              optionValue === value ? 'bg-indigo-600 text-white shadow-md' : 'border'
            }`}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
