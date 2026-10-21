import { ReactNode, Ref } from 'react';
import { TextFieldProps as HeroTextFieldProps } from '@heroui/react';

export interface TextFieldProps extends Omit<HeroTextFieldProps, 'children' | 'className' | 'ref'> {
  label: string;
  error?: string;
  action?: ReactNode;
  placeholder?: string;
  inputClassName?: string;
  ref?: Ref<HTMLInputElement>;
}
