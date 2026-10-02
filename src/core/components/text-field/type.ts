import { ComponentPropsWithRef, ReactNode } from 'react';

export interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
  action?: ReactNode;
  inputClassName?: string;
}
