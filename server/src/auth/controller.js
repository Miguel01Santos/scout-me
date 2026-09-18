import { registerSchema, loginSchema } from './schema.js';
import { registerUser, authenticateUser, findUserById } from './service.js';

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

export async function me(request, response) {
  const user = await findUserById(request.userId);

  return response.status(200).json({ user });
}
