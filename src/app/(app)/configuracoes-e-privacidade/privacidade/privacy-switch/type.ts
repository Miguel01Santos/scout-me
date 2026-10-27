export interface PrivacySwitchProps {
  label: string;
  description: string;
  isSelected: boolean;
  isDisabled: boolean;
  errorMessage: string;
  onChange: (isSelected: boolean) => void;
}
