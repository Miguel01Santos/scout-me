import { AccountType } from '@/src/core/enums/account-type';
import { AccountTypeOption, PlanLabel } from '../type';

export interface AccountTypeCardProps {
  option: AccountTypeOption;
  planLabel: PlanLabel;
  isSaving: boolean;
  isDisabled: boolean;
  onSelect: (type: AccountType) => void;
}
