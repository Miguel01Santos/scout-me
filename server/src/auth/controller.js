import { registerSchema, loginSchema, refreshTokenSchema } from './schema.js';
import {
  registerUser,
  authenticateUser,
  loginDevUser,
  refreshSession,
  logoutSession,
} from './service.js';

export async function register(request, response) {
  const data = registerSchema.parse(request.body);
  const result = await registerUser(data);

  return response.status(201).json(result);
}

export async function login(request, response) {
  const data = loginSchema.parse(request.body);
  const result = await authenticateUser(data);

  return response.status(200).json(result);
}

export async function refresh(request, response) {
  const data = refreshTokenSchema.parse(request.body);
  const result = await refreshSession(data);

  return response.status(200).json(result);
}

export async function logout(request, response) {
  const data = refreshTokenSchema.parse(request.body);

  await logoutSession(data);

  return response.status(204).send();
}

export async function devLogin(request, response) {
  const result = await loginDevUser();

  return response.status(200).json(result);
}
