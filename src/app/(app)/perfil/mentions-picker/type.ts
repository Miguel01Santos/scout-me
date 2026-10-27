export interface MentionsPickerProps {
  value: string[];
  isDisabled: boolean;
  onChange: (usernames: string[]) => void;
}
