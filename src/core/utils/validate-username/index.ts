const USERNAME_PATTERN = /^[a-z][a-z0-9._]{2,29}$/;
const RESERVED_USERNAMES = ['editar', 'atributos', 'admin', 'suporte', 'scoutme', 'scoutmepro'];

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): string | undefined {
  const normalized = normalizeUsername(username);

  if (!USERNAME_PATTERN.test(normalized)) {
    return 'Use de 3 a 30 caracteres: letras, números, ponto ou _, começando com letra';
  }
  if (RESERVED_USERNAMES.includes(normalized)) return 'Esse nome de usuário não está disponível';

  return undefined;
}
