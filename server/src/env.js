const requiredVariables = ['DATABASE_URL', 'JWT_SECRET'];
const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if (missingVariables.length > 0) {
  throw new Error(`Variáveis de ambiente ausentes: ${missingVariables.join(', ')}`);
}

const isHostedEnvironment = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
const devLoginEnabled = process.env.DEV_LOGIN_ENABLED === 'true';

if (devLoginEnabled && isHostedEnvironment) {
  throw new Error('DEV_LOGIN_ENABLED não pode ser usada em produção');
}

// Aceita várias origens separadas por vírgula, por exemplo o front publicado e o localhost.
function parseCorsOrigin(value) {
  if (!value || value.trim() === '*') return '*';

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length === 1 ? origins[0] : origins;
}

const cloudinaryConfigured = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every(
  (variable) => process.env[variable]
);

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  devLoginEnabled,
  cloudinary: cloudinaryConfigured
    ? {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        apiBaseUrl: process.env.CLOUDINARY_API_BASE_URL ?? 'https://api.cloudinary.com',
      }
    : null,
};
