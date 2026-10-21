const DAY_MS = 24 * 60 * 60 * 1000;

// A validade é renovada a cada refresh: quem usa o app não cai, quem some por esse tempo sai.
export const SESSION_TTL_MS = {
  REMEMBER: 90 * DAY_MS,
  DEFAULT: DAY_MS,
};

// Duas abas renovando juntas mandam o mesmo token; dentro dessa folga não é tratado como roubo.
export const REFRESH_TOKEN_REUSE_GRACE_MS = 60 * 1000;
