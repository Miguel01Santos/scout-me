import { Ref } from 'react';
import { TextFieldProps as HeroTextFieldProps } from '@heroui/react';

export interface TextAreaFieldProps extends Omit<HeroTextFieldProps, 'children' | 'className' | 'ref'> {
  label: string;
  error?: string;
  counter?: string;
  placeholder?: string;
  rows?: number;
  inputClassName?: string;
  ref?: Ref<HTMLTextAreaElement>;
}
