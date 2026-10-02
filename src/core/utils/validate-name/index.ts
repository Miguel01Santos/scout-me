export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 25;

// Devolve a mensagem do primeiro problema do nome, ou undefined se estiver válido.
// Os espaços contam no tamanho. Mantenha em sincronia com server/src/user/schema.js.
export function validateName(name: string): string | undefined {
  if (name.length === 0) return 'O nome não pode ficar vazio';
  if (name.startsWith(' ')) return 'O nome não pode começar com espaço';
  if (name.length < NAME_MIN_LENGTH) {
    return `O nome precisa ter ao menos ${NAME_MIN_LENGTH} caracteres`;
  }
  if (name.length > NAME_MAX_LENGTH) {
    return `O nome pode ter no máximo ${NAME_MAX_LENGTH} caracteres`;
  }

  return undefined;
}
