export enum AccountType {
  PERSON = 'person',
  TEAM = 'team',
  FEDERATION = 'federation',
  SCOUT = 'scout',
}

export const ACCOUNT_TYPE_NAME: Record<AccountType, string> = {
  [AccountType.PERSON]: 'Person',
  [AccountType.TEAM]: 'Team',
  [AccountType.FEDERATION]: 'Federation',
  [AccountType.SCOUT]: 'Scout',
};

export const ACCOUNT_TYPE_COLOR: Record<AccountType, { ring: string; background: string }> = {
  [AccountType.PERSON]: { ring: 'ring-emerald-500', background: 'bg-emerald-500' },
  [AccountType.TEAM]: { ring: 'ring-blue-500', background: 'bg-blue-500' },
  [AccountType.FEDERATION]: { ring: 'ring-black', background: 'bg-black' },
  [AccountType.SCOUT]: { ring: 'ring-fuchsia-500', background: 'bg-fuchsia-500' },
};

export function toAccountType(type?: string | null): AccountType {
  const accountTypes: string[] = Object.values(AccountType);

  return type && accountTypes.includes(type) ? (type as AccountType) : AccountType.PERSON;
}
