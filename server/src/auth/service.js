import { randomUUID } from 'node:crypto';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { prismaClient } from '../prisma.js';
import { env } from '../env.js';
import { HttpError } from '../http-error.js';
import { toPublicUser } from '../user/service.js';
import { AccountType } from '../account/constants.js';
import { createSession, revokeSession, rotateSession } from '../session/service.js';

const PASSWORD_SALT_ROUNDS = 10;
const EMAIL_TAKEN_MESSAGE = 'Já existe um usuário com esse e-mail';
const UNIQUE_CONSTRAINT_ERROR = 'P2002';

// Vai como issue do campo para o front mostrar o erro embaixo do e-mail.
function emailTakenError() {
  return new HttpError(409, EMAIL_TAKEN_MESSAGE, [{ field: 'email', message: EMAIL_TAKEN_MESSAGE }]);
}

function generateAccessToken(user, sessionId) {
  return jsonwebtoken.sign({ email: user.email, sid: sessionId }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn,
  });
}

async function startSession(user, { remember }, database) {
  const { sessionId, refreshToken } = await createSession(user.id, { remember }, database);

  return {
    user: toPublicUser(user),
    accessToken: generateAccessToken(user, sessionId),
    refreshToken,
  };
}

export async function registerUser({ name, email, password, remember }) {
  const existingUser = await prismaClient.user.findUnique({ where: { email } });

  if (existingUser) {
    throw emailTakenError();
  }

  const hashedPassword = await bcryptjs.hash(password, PASSWORD_SALT_ROUNDS);

  try {
    // Se a sessão falhar, o usuário também não fica criado e o cadastro pode ser refeito.
    return await prismaClient.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accounts: {
            create: { type: AccountType.PLAYER, configuration: { create: {} } },
          },
        },
      });

      return startSession(user, { remember }, transaction);
    });
  } catch (error) {
    // Dois cadastros simultâneos com o mesmo e-mail passam pela checagem acima; o índice único barra o segundo.
    if (error.code === UNIQUE_CONSTRAINT_ERROR) throw emailTakenError();

    throw error;
  }
}

export async function authenticateUser({ email, password, remember }) {
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, 'E-mail ou senha inválidos');
  }

  const passwordMatches = await bcryptjs.compare(password, user.password);

  if (!passwordMatches) {
    throw new HttpError(401, 'E-mail ou senha inválidos');
  }

  return startSession(user, { remember });
}

export async function refreshSession({ refreshToken }) {
  const { user, sessionId, refreshToken: nextRefreshToken } = await rotateSession(refreshToken);

  return { accessToken: generateAccessToken(user, sessionId), refreshToken: nextRefreshToken };
}

export async function logoutSession({ refreshToken }) {
  await revokeSession(refreshToken);
}

const DEV_USER_EMAIL = 'dev@localhost';

export async function loginDevUser() {
  const user =
    (await prismaClient.user.findUnique({ where: { email: DEV_USER_EMAIL } })) ??
    (await prismaClient.user.create({
      data: {
        name: 'Dev Local',
        email: DEV_USER_EMAIL,
        password: await bcryptjs.hash(randomUUID(), PASSWORD_SALT_ROUNDS),
        accounts: {
          create: { type: AccountType.PLAYER, configuration: { create: {} } },
        },
      },
    }));

  return startSession(user, { remember: true });
}
