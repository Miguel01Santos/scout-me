import { ReactNode } from 'react';
import { Account, UpdateAccountInput } from '../../api/account/type';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { UpdateProfileInput } from '../../api/profile/type';

export interface AccountProviderProps {
  children: ReactNode;
}

export interface AccountContextValue {
  account: Account | null;
  configuration: Configuration;
  isLoading: boolean;
  updateConfiguration: (input: UpdateConfigurationInput) => Promise<void>;
  updateAccount: (input: UpdateAccountInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
}
