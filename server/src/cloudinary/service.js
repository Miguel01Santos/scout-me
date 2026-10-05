import { createHash, randomUUID } from 'node:crypto';
import { env } from '../env.js';
import { HttpError } from '../http-error.js';

const AVATAR_FOLDER = 'scoutme/avatars';
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

export function createAvatarUploadSignature() {
  const config = requireConfig();
  const fields = {
    allowed_formats: ALLOWED_FORMATS,
    public_id: `${AVATAR_FOLDER}/${randomUUID()}`,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return {
    uploadUrl: `${config.apiBaseUrl}/v1_1/${config.cloudName}/image/upload`,
    apiKey: config.apiKey,
    signature: signParams(fields, config.apiSecret),
    fields,
  };
}

export function extractAvatarPublicId(url, cloudName) {
  if (!url || !cloudName) return null;

  const escapedCloudName = cloudName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^https://res\\.cloudinary\\.com/${escapedCloudName}/image/upload/(?:v\\d+/)?(${AVATAR_FOLDER}/[0-9a-f-]{36})\\.(?:jpg|png|webp)$`
  );

  return url.match(pattern)?.[1] ?? null;
}

export function toOwnedAvatarPublicId(url) {
  return extractAvatarPublicId(url, env.cloudinary?.cloudName);
}

export async function destroyAvatar(publicId) {
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
