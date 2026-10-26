export enum AccountType {
  PLAYER = 'player',
  TEAM = 'team',
  ORGANIZATION = 'organization',
  SCOUT = 'scout',
}

// Mesma lista da API: Organization é plano pago e ainda não pode ser escolhida.
export const FREE_ACCOUNT_TYPES: AccountType[] = [
  AccountType.PLAYER,
  AccountType.SCOUT,
  AccountType.TEAM,
];

export const ACCOUNT_TYPE_NAME: Record<AccountType, string> = {
  [AccountType.PLAYER]: 'Player',
  [AccountType.TEAM]: 'Team',
  [AccountType.ORGANIZATION]: 'Organization',
  [AccountType.SCOUT]: 'Scout',
};

export const ACCOUNT_TYPE_COLOR: Record<AccountType, { ring: string; background: string }> = {
  [AccountType.PLAYER]: { ring: 'ring-blue-500', background: 'bg-blue-500' },
  [AccountType.TEAM]: { ring: 'ring-emerald-500', background: 'bg-emerald-500' },
  [AccountType.ORGANIZATION]: { ring: 'ring-black', background: 'bg-black' },
  [AccountType.SCOUT]: { ring: 'ring-fuchsia-500', background: 'bg-fuchsia-500' },
};

// Tipo desconhecido (conta ainda carregando) vira null, e não Player: quem mostra a cor
// do tipo espera ele chegar em vez de piscar a cor errada.
export function toAccountType(type?: string | null): AccountType | null {
  const accountTypes: string[] = Object.values(AccountType);

  return type && accountTypes.includes(type) ? (type as AccountType) : null;
}
