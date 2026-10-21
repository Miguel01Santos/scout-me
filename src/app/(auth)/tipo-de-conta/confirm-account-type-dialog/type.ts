import { AccountType } from '@/src/core/enums/account-type';

export interface ConfirmAccountTypeDialogProps {
  isOpen: boolean;
  type: AccountType | null;
  isSaving: boolean;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
}
