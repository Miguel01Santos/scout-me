export interface AttributeOption<T extends string> {
  value: T;
  label: string;
}

export interface AttributeSelectProps<T extends string> {
  label: string;
  placeholder: string;
  value: T | null;
  options: AttributeOption<T>[];
  isDisabled?: boolean;
  onChange: (value: T | null) => void;
}
