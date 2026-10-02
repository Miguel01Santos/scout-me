import { changePasswordSchema, updateUserSchema } from './schema.js';
import { changePassword, findUserById, updateUser } from './service.js';

export async function me(request, response) {
  const user = await findUserById(request.userId);

  return response.status(200).json({ user });
}

export async function update(request, response) {
  const data = updateUserSchema.parse(request.body);
  const user = await updateUser(request.userId, data);

  return response.status(200).json({ user });
}

export async function updatePassword(request, response) {
  const data = changePasswordSchema.parse(request.body);

  await changePassword(request.userId, data);

  return response.status(204).send();
}
