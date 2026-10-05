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

const cloudinaryConfigured = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].every(
  (variable) => process.env[variable]
);

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
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
