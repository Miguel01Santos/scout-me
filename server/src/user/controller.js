import { changePasswordSchema, setAvatarSchema, updateUserSchema } from './schema.js';
import { changePassword, findUserById, removeAvatar, setAvatar, updateUser } from './service.js';
import { createAvatarUploadSignature } from '../cloudinary/service.js';

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

export async function avatarUploadSignature(request, response) {
  return response.status(200).json(createAvatarUploadSignature());
}

export async function updateAvatar(request, response) {
  const { avatarUrl } = setAvatarSchema.parse(request.body);

  await setAvatar(request.userId, avatarUrl);

  return response.status(200).json({ avatarUrl });
}

export async function deleteAvatar(request, response) {
  await removeAvatar(request.userId);

  return response.status(204).send();
}
