import { AccountType } from '../account/constants.js';

export const AvatarColor = {
  INDIGO: 'indigo',
  EMERALD: 'emerald',
  SKY: 'sky',
  AMBER: 'amber',
  ORANGE: 'orange',
  ROSE: 'rose',
  FUCHSIA: 'fuchsia',
  SLATE: 'slate',
};

export const BIO_MAX_LENGTH = 150;

export const ProfileSearchFilter = {
  ALL: 'all',
  USERS: 'users',
  ACCOUNTS: 'accounts',
};

export const SEARCH_FILTER_ACCOUNT_TYPES = {
  [ProfileSearchFilter.USERS]: [AccountType.PLAYER, AccountType.SCOUT],
  [ProfileSearchFilter.ACCOUNTS]: [AccountType.TEAM, AccountType.ORGANIZATION],
};
