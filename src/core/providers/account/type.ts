import { ReactNode } from 'react';
import { Account, UpdateAccountInput } from '../../api/account/type';
import { Configuration, UpdateConfigurationInput } from '../../api/configuration/type';
import { UpdatePlayerAttributesInput } from '../../api/player-attributes/type';
import { UpdateProfileInput } from '../../api/profile/type';

export interface AccountProviderProps {
  children: ReactNode;
}

export interface AccountContextValue {
  account: Account | null;
  configuration: Configuration;
  isLoading: boolean;
  // Só fica true depois de confirmar que há sessão; até lá as páginas do app não aparecem.
  isAuthenticated: boolean;
  updateConfiguration: (input: UpdateConfigurationInput) => Promise<void>;
  updateAccount: (input: UpdateAccountInput) => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  updatePlayerAttributes: (input: UpdatePlayerAttributesInput) => Promise<void>;
  acceptFollowRequest: (username: string) => Promise<void>;
  declineFollowRequest: (username: string) => Promise<void>;
  publishPendingRating: (username: string) => Promise<void>;
  hidePendingRating: (username: string) => Promise<void>;
  setUnreadNotificationsCount: (count: number) => void;
  refreshAccount: () => Promise<void>;
  changeAvatar: (image: Blob) => Promise<void>;
  removeAvatar: () => Promise<void>;
}
