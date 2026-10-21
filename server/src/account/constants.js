export const AccountType = {
  PLAYER: 'player',
  TEAM: 'team',
  ORGANIZATION: 'organization',
  SCOUT: 'scout',
};

// Organization é plano pago: ainda não pode ser escolhida na tela depois do cadastro.
export const FREE_ACCOUNT_TYPES = [AccountType.PLAYER, AccountType.SCOUT, AccountType.TEAM];
