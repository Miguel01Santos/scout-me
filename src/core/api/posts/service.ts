import { uploadSignedImage } from '../cloudinary/service';
import { UploadSignature } from '../cloudinary/type';
import { del, get, patch, postAuthenticated } from '../index';
import { ProfileCard } from '../profiles/type';
import { CreatePostInput, Post, UpdatePostInput } from './type';

export function getProfilePosts(accessToken: string, username: string) {
  return get<{ posts: Post[] }>(`/profiles/${encodeURIComponent(username)}/posts`, accessToken);
}

export function getFriends(accessToken: string) {
  return get<{ friends: ProfileCard[] }>('/account/me/friends', accessToken);
}

export function createPost(accessToken: string, input: CreatePostInput) {
  return postAuthenticated<{ post: Post }>('/posts', accessToken, input);
}

export function updatePost(accessToken: string, postId: number, input: UpdatePostInput) {
  return patch<{ post: Post }>(`/posts/${postId}`, accessToken, input);
}

export function deletePost(accessToken: string, postId: number) {
  return del<null>(`/posts/${postId}`, accessToken);
}

export async function uploadPostPhotos(
  accessToken: string,
  images: Blob[],
  onProgress: (uploaded: number) => void
) {
  const { signatures } = await postAuthenticated<{ signatures: UploadSignature[] }>(
    '/posts/signatures',
    accessToken,
    { count: images.length }
  );
  const urls: string[] = [];

  for (const [index, image] of images.entries()) {
    urls.push(await uploadSignedImage(signatures[index], image, `post-${index + 1}.jpg`));
    onProgress(urls.length);
  }

  return urls;
}
