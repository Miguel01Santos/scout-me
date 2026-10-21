'use client';

import { useState } from 'react';
import { Button, FieldError, Input, Label, TextField as HeroTextField } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { TextFieldProps } from './type';

const DEFAULT_INPUT_CLASS_NAME =
  'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-600';

export function TextField({
  label,
  error,
  action,
  placeholder,
  inputClassName = DEFAULT_INPUT_CLASS_NAME,
  ref,
  type,
  ...fieldProps
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  const suffix = isPassword ? (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
      onPress={() => setIsPasswordVisible((isVisible) => !isVisible)}
      className="size-8 opacity-70 hover:opacity-100"
    >
      {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
    </Button>
  ) : (
    action
  );

  return (
    <HeroTextField
      {...fieldProps}
      type={isPassword && isPasswordVisible ? 'text' : type}
      // `undefined` deixa a validação nativa (required, type="email") aparecer no FieldError.
      isInvalid={error ? true : undefined}
      fullWidth
    >
      <Label className="block text-[10px] uppercase font-bold text-slate-400 after:content-none">
        {label}
      </Label>
      <div className="relative">
        <Input
          ref={ref}
          placeholder={placeholder}
          className={`w-full p-2.5 text-xs border rounded-xl shadow-none ring-0 ring-offset-0 outline-none transition focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid=true]:border-rose-500/50! ${inputClassName} ${
            suffix ? 'pr-10' : ''
          }`}
        />
        {suffix && <div className="absolute inset-y-0 right-1 flex items-center">{suffix}</div>}
      </div>
      <FieldError className="px-0 text-[10px] text-rose-400 font-semibold">
        {({ validationErrors }) => error ?? validationErrors.join(' ')}
      </FieldError>
    </HeroTextField>
  );
}
