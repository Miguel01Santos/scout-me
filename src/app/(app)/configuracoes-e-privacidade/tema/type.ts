export interface OptionGroupProps<TValue extends string> {
  label: string;
  value: TValue;
  options: Record<TValue, string>;
  disabled?: boolean;
  onChange: (value: TValue) => void;
}
