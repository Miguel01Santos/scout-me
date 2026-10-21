import { createHash, randomBytes } from 'node:crypto';
import { prismaClient } from '../prisma.js';
import { HttpError } from '../http-error.js';
import { REFRESH_TOKEN_REUSE_GRACE_MS, SESSION_TTL_MS } from './constants.js';

const INVALID_SESSION_MESSAGE = 'Sessão expirada. Entre novamente.';

function generateRefreshToken() {
  return randomBytes(32).toString('base64url');
}

// O banco guarda só o hash: quem ler a tabela não consegue usar os tokens.
function hashRefreshToken(refreshToken) {
  return createHash('sha256').update(refreshToken).digest('hex');
}

function expiresAtFor(remember) {
  return new Date(Date.now() + (remember ? SESSION_TTL_MS.REMEMBER : SESSION_TTL_MS.DEFAULT));
}

export async function createSession(userId, { remember }, database = prismaClient) {
  const refreshToken = generateRefreshToken();

  await database.session.deleteMany({
    where: { userId, OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }] },
  });

  const session = await database.session.create({
    data: {
      userId,
      remember,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: expiresAtFor(remember),
    },
  });

  return { sessionId: session.id, refreshToken };
}

// Um token já trocado voltando depois da folga indica que alguém copiou o token: a sessão cai.
async function revokeIfReused(tokenHash, now) {
  const session = await prismaClient.session.findUnique({ where: { previousTokenHash: tokenHash } });

  if (!session || session.revokedAt) return;
  if (now - session.rotatedAt <= REFRESH_TOKEN_REUSE_GRACE_MS) return;

  await prismaClient.session.update({ where: { id: session.id }, data: { revokedAt: now } });
}

export async function rotateSession(refreshToken) {
  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();
  const session = await prismaClient.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) {
    await revokeIfReused(tokenHash, now);
    throw new HttpError(401, INVALID_SESSION_MESSAGE);
  }

  if (session.revokedAt || session.expiresAt <= now) {
    throw new HttpError(401, INVALID_SESSION_MESSAGE);
  }

  const nextRefreshToken = generateRefreshToken();

  // O filtro pelo hash atual impede que duas renovações simultâneas usem o mesmo token.
  const { count } = await prismaClient.session.updateMany({
    where: { id: session.id, tokenHash },
    data: {
      tokenHash: hashRefreshToken(nextRefreshToken),
      previousTokenHash: tokenHash,
      rotatedAt: now,
      expiresAt: expiresAtFor(session.remember),
    },
  });

  if (count === 0) {
    throw new HttpError(401, INVALID_SESSION_MESSAGE);
  }

  return { user: session.user, sessionId: session.id, refreshToken: nextRefreshToken };
}

export async function revokeSession(refreshToken) {
  const tokenHash = hashRefreshToken(refreshToken);

  await prismaClient.session.updateMany({
    where: { OR: [{ tokenHash }, { previousTokenHash: tokenHash }], revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeOtherSessions(userId, currentSessionId) {
  await prismaClient.session.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(currentSessionId && { id: { not: currentSessionId } }),
    },
    data: { revokedAt: new Date() },
  });
}
