import { createHash, randomUUID } from 'node:crypto';
import { env } from '../env.js';
import { HttpError } from '../http-error.js';

const AVATAR_FOLDER = 'scoutme/avatars';
const POSTS_FOLDER = 'scoutme/posts';
const PUBLIC_ID_PATTERN = '[0-9a-f-]{36}';
const ALLOWED_FORMATS = 'jpg,png,webp';

function requireConfig() {
  if (!env.cloudinary) {
    throw new HttpError(503, 'O envio de fotos não está configurado');
  }

  return env.cloudinary;
}

export function signParams(params, apiSecret) {
  const stringToSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return createHash('sha1').update(`${stringToSign}${apiSecret}`).digest('hex');
}

function createUploadSignature(folder) {
  const config = requireConfig();
  const fields = {
    allowed_formats: ALLOWED_FORMATS,
    public_id: `${folder}/${randomUUID()}`,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return {
    uploadUrl: `${config.apiBaseUrl}/v1_1/${config.cloudName}/image/upload`,
    apiKey: config.apiKey,
    signature: signParams(fields, config.apiSecret),
    fields,
  };
}

function extractPublicId(url, cloudName, folder) {
  if (!url || !cloudName) return null;

  const escapedCloudName = cloudName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^https://res\\.cloudinary\\.com/${escapedCloudName}/image/upload/(?:v\\d+/)?(${folder}/${PUBLIC_ID_PATTERN})\\.(?:jpg|png|webp)$`
  );

  return url.match(pattern)?.[1] ?? null;
}

function postFolder(accountId) {
  return `${POSTS_FOLDER}/${accountId}`;
}

export function createAvatarUploadSignature() {
  return createUploadSignature(AVATAR_FOLDER);
}

export function extractAvatarPublicId(url, cloudName) {
  return extractPublicId(url, cloudName, AVATAR_FOLDER);
}

export function toOwnedAvatarPublicId(url) {
  return extractAvatarPublicId(url, env.cloudinary?.cloudName);
}

export function createPostUploadSignatures(accountId, count) {
  return Array.from({ length: count }, () => createUploadSignature(postFolder(accountId)));
}

export function toOwnedPostPhotoPublicId(url, accountId) {
  return extractPublicId(url, env.cloudinary?.cloudName, postFolder(accountId));
}

export async function destroyImage(publicId) {
  if (!env.cloudinary) return false;

  const { cloudName, apiKey, apiSecret, apiBaseUrl } = env.cloudinary;
  const fields = {
    invalidate: true,
    public_id: publicId,
    timestamp: Math.floor(Date.now() / 1000),
  };

  try {
    const response = await fetch(`${apiBaseUrl}/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: new URLSearchParams({
        ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, String(value)])),
        api_key: apiKey,
        signature: signParams(fields, apiSecret),
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
