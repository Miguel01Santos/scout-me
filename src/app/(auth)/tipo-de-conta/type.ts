import { LucideIcon } from 'lucide-react';
import { AccountType } from '@/src/core/enums/account-type';

export interface AccountTypeOption {
  type: AccountType;
  icon: LucideIcon;
  description: string;
}

export interface PlanLabel {
  free: string;
  paid: string;
}
