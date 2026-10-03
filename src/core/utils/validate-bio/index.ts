export const BIO_MAX_LENGTH = 150;

export function validateBio(bio: string): string | undefined {
  if (bio.length > BIO_MAX_LENGTH) {
    return `A descrição pode ter no máximo ${BIO_MAX_LENGTH} caracteres`;
  }

  return undefined;
}
