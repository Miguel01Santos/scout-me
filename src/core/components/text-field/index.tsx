import { useId } from 'react';
import { TextFieldProps } from './type';

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[10px] uppercase font-bold mb-1 text-slate-400"
      >
        {label}
      </label>
      <input
        {...inputProps}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`w-full p-2.5 text-xs border rounded-xl outline-none transition bg-slate-900/90 placeholder:text-slate-600 focus:border-indigo-500 ${
          error ? 'border-rose-500/50' : 'border-slate-800'
        }`}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1 font-semibold">{error}</p>}
    </div>
  );
}
