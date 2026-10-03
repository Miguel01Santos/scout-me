import { useId } from 'react';
import { TextAreaFieldProps } from './type';

const DEFAULT_INPUT_CLASS_NAME =
  'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-600';

export function TextAreaField({
  label,
  error,
  counter,
  inputClassName = DEFAULT_INPUT_CLASS_NAME,
  ...textareaProps
}: TextAreaFieldProps) {
  const textareaId = useId();

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="block text-[10px] uppercase font-bold mb-1 text-slate-400"
      >
        {label}
      </label>
      <textarea
        {...textareaProps}
        id={textareaId}
        aria-invalid={Boolean(error)}
        className={`w-full p-2.5 text-xs border rounded-xl outline-none transition resize-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName} ${
          error ? 'border-rose-500/50!' : ''
        }`}
      />
      <div className="flex justify-between gap-2">
        {error ? <p className="text-[10px] text-rose-400 mt-1 font-semibold">{error}</p> : <span />}
        {counter && <p className="text-[10px] text-slate-400 mt-1">{counter}</p>}
      </div>
    </div>
  );
}
