import { uploadSignedImage } from '../cloudinary/service';
import { del, postAuthenticated, put } from '../index';
import { AvatarUploadSignature } from './type';

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
  const signature = await getAvatarUploadSignature(accessToken);
  const avatarUrl = await uploadSignedImage(signature, image, 'avatar.jpg');

  await saveAvatarUrl(accessToken, avatarUrl);
}
