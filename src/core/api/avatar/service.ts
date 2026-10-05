import { ApiError, del, postAuthenticated, put } from '../index';
import { AvatarUploadSignature, CloudinaryUploadResponse } from './type';

export function getAvatarUploadSignature(accessToken: string) {
  return postAuthenticated<AvatarUploadSignature>('/user/me/avatar/signature', accessToken);
}

export function saveAvatarUrl(accessToken: string, avatarUrl: string) {
  return put<{ avatarUrl: string }>('/user/me/avatar', accessToken, { avatarUrl });
}

export function deleteAvatar(accessToken: string) {
  return del<null>('/user/me/avatar', accessToken);
}

export async function uploadAvatar(accessToken: string, image: Blob) {
  const { uploadUrl, apiKey, signature, fields } = await getAvatarUploadSignature(accessToken);
  const form = new FormData();

  Object.entries(fields).forEach(([name, value]) => form.append(name, String(value)));
  form.append('api_key', apiKey);
  form.append('signature', signature);
  form.append('file', image, 'avatar.jpg');

  let response: Response;

  try {
    response = await fetch(uploadUrl, { method: 'POST', body: form });
  } catch {
    throw new ApiError('Não foi possível enviar a foto. Verifique sua conexão.');
  }

  if (!response.ok) {
    throw new ApiError('Não foi possível enviar a foto. Tente novamente.');
  }

  const { secure_url: avatarUrl } = (await response.json()) as CloudinaryUploadResponse;

  await saveAvatarUrl(accessToken, avatarUrl);
}
