import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { prismaClient } from '../prisma.js';
import { env } from '../env.js';
import { HttpError } from '../http-error.js';

const PASSWORD_SALT_ROUNDS = 10;

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function generateAccessToken(user) {
  return jsonwebtoken.sign({ email: user.email }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn,
  });
}

export async function registerUser({ name, email, password }) {
  const existingUser = await prismaClient.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new HttpError(409, 'Já existe um usuário com esse e-mail');
  }

  const hashedPassword = await bcryptjs.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await prismaClient.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { user: toPublicUser(user), accessToken: generateAccessToken(user) };
}

export async function authenticateUser({ email, password }) {
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, 'E-mail ou senha inválidos');
  }

  const passwordMatches = await bcryptjs.compare(password, user.password);

  if (!passwordMatches) {
    throw new HttpError(401, 'E-mail ou senha inválidos');
  }

  return { user: toPublicUser(user), accessToken: generateAccessToken(user) };
}

export async function findUserById(userId) {
  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado');
  }

  return toPublicUser(user);
}
