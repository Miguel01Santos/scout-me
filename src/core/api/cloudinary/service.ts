import { ApiError } from '../index';
import { CloudinaryUploadResponse, UploadSignature } from './type';

export async function uploadSignedImage(
  { uploadUrl, apiKey, signature, fields }: UploadSignature,
  image: Blob,
  fileName: string
) {
  const form = new FormData();

  Object.entries(fields).forEach(([name, value]) => form.append(name, String(value)));
  form.append('api_key', apiKey);
  form.append('signature', signature);
  form.append('file', image, fileName);

  let response: Response;

  try {
    response = await fetch(uploadUrl, { method: 'POST', body: form });
  } catch {
    throw new ApiError('Não foi possível enviar a foto. Verifique sua conexão.');
  }

  if (!response.ok) {
    throw new ApiError('Não foi possível enviar a foto. Tente novamente.');
  }

  const { secure_url: url } = (await response.json()) as CloudinaryUploadResponse;

  return url;
}
