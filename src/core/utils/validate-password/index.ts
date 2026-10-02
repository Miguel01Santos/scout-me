export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

// Devolve a mensagem do problema da nova senha, ou undefined se estiver válida.
// Mantenha em sincronia com changePasswordSchema em server/src/user/schema.js.
export function validateNewPassword(password: string): string | undefined {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `A nova senha precisa ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `A nova senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres`;
  }

  return undefined;
}
