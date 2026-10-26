export const AccountType = {
  PLAYER: 'player',
  TEAM: 'team',
  ORGANIZATION: 'organization',
  SCOUT: 'scout',
};

// Organization é plano pago: ainda não pode ser escolhida na tela depois do cadastro.
export const FREE_ACCOUNT_TYPES = [AccountType.PLAYER, AccountType.SCOUT, AccountType.TEAM];

export const USERNAME_PATTERN = /^[a-z][a-z0-9._]{2,29}$/;

export const USERNAME_BASE_MAX_LENGTH = 20;

export const RESERVED_USERNAMES = ['editar', 'atributos', 'admin', 'suporte', 'scoutme', 'scoutmepro'];
