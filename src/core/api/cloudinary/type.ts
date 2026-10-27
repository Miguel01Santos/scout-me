export interface UploadSignature {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  fields: Record<string, string | number>;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
}
