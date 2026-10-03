export enum AccountType {
  PLAYER = 'player',
  TEAM = 'team',
  ORGANIZATION = 'organization',
  SCOUT = 'scout',
}

export const ACCOUNT_TYPE_NAME: Record<AccountType, string> = {
  [AccountType.PLAYER]: 'Player',
  [AccountType.TEAM]: 'Team',
  [AccountType.ORGANIZATION]: 'Organization',
  [AccountType.SCOUT]: 'Scout',
};

export const ACCOUNT_TYPE_COLOR: Record<AccountType, { ring: string; background: string }> = {
  [AccountType.PLAYER]: { ring: 'ring-emerald-500', background: 'bg-emerald-500' },
  [AccountType.TEAM]: { ring: 'ring-blue-500', background: 'bg-blue-500' },
  [AccountType.ORGANIZATION]: { ring: 'ring-black', background: 'bg-black' },
  [AccountType.SCOUT]: { ring: 'ring-fuchsia-500', background: 'bg-fuchsia-500' },
};

export function toAccountType(type?: string | null): AccountType {
  const accountTypes: string[] = Object.values(AccountType);

  return type && accountTypes.includes(type) ? (type as AccountType) : AccountType.PLAYER;
}
