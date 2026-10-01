import { ReactNode } from 'react';
import { Account } from '../../api/account/type';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';

export interface AccountProviderProps {
  children: ReactNode;
}

export interface AccountContextValue {
  account: Account | null;
  configuration: Configuration;
  isLoading: boolean;
  updateConfiguration: (input: UpdateConfigurationInput) => Promise<void>;
}
