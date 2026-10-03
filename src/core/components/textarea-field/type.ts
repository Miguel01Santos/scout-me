import { ComponentPropsWithRef } from 'react';

export interface TextAreaFieldProps extends ComponentPropsWithRef<'textarea'> {
  label: string;
  error?: string;
  inputClassName?: string;
  counter?: string;
}
