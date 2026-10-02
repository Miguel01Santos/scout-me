import { useId } from 'react';
import { TextFieldProps } from './type';

// Visual padrão (escuro), usado onde não há tema, como login e cadastro.
const DEFAULT_INPUT_CLASS_NAME =
  'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-600';

export function TextField({
  label,
  error,
  action,
  inputClassName = DEFAULT_INPUT_CLASS_NAME,
  ...inputProps
}: TextFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[10px] uppercase font-bold mb-1 text-slate-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={`w-full p-2.5 text-xs border rounded-xl outline-none transition focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName} ${
            action ? 'pr-10' : ''
          } ${error ? 'border-rose-500/50!' : ''}`}
        />
        {action && <div className="absolute inset-y-0 right-1 flex items-center">{action}</div>}
      </div>
      {error && <p className="text-[10px] text-rose-400 mt-1 font-semibold">{error}</p>}
    </div>
  );
}
