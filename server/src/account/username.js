import { prismaClient } from '../prisma.js';
import { RESERVED_USERNAMES, USERNAME_BASE_MAX_LENGTH } from './constants.js';

function usernameBase(name) {
  const cleaned = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, USERNAME_BASE_MAX_LENGTH);

  if (/^[a-z][a-z0-9]{2,}$/.test(cleaned)) return cleaned;

  return `user${cleaned}`.slice(0, USERNAME_BASE_MAX_LENGTH);
}

export async function generateUniqueUsername(name, database = prismaClient) {
  const base = usernameBase(name);
  const existing = await database.account.findMany({
    where: { username: { startsWith: base } },
    select: { username: true },
  });
  const taken = new Set(existing.map((account) => account.username));

  if (!taken.has(base) && !RESERVED_USERNAMES.includes(base)) return base;

  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}${suffix}`;

    if (!taken.has(candidate)) return candidate;
  }
}
