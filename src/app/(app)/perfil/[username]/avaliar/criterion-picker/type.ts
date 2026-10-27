export interface CriterionPickerProps {
  label: string;
  value: number | null;
  isDisabled: boolean;
  onChange: (value: number) => void;
}
