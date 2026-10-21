'use client';

import { FieldError, Label, TextArea, TextField as HeroTextField } from '@heroui/react';
import { TextAreaFieldProps } from './type';

const DEFAULT_INPUT_CLASS_NAME =
  'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-600';

export function TextAreaField({
  label,
  error,
  counter,
  placeholder,
  rows,
  inputClassName = DEFAULT_INPUT_CLASS_NAME,
  ref,
  ...fieldProps
}: TextAreaFieldProps) {
  return (
    <HeroTextField {...fieldProps} isInvalid={error ? true : undefined} fullWidth>
      <Label className="block text-[10px] uppercase font-bold text-slate-400 after:content-none">
        {label}
      </Label>
      <TextArea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-2.5 text-xs border rounded-xl shadow-none ring-0 ring-offset-0 outline-none transition resize-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid=true]:border-rose-500/50! ${inputClassName}`}
      />
      <div className="flex justify-between gap-2">
        <FieldError className="px-0 text-[10px] text-rose-400 font-semibold">
          {({ validationErrors }) => error ?? validationErrors.join(' ')}
        </FieldError>
        {counter && <span className="ml-auto text-[10px] text-slate-400">{counter}</span>}
      </div>
    </HeroTextField>
  );
}
