const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const OUTPUT_SIZE_PX = 512;
const OUTPUT_QUALITY = 0.85;

export async function prepareAvatarImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('A foto é grande demais. O máximo é 10 MB.');
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('Não foi possível ler essa imagem. Use JPG, PNG ou WebP.');
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = OUTPUT_SIZE_PX;
  canvas.height = OUTPUT_SIZE_PX;

  if (!context) throw new Error('Não foi possível processar a foto.');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, OUTPUT_SIZE_PX, OUTPUT_SIZE_PX);
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    OUTPUT_SIZE_PX,
    OUTPUT_SIZE_PX
  );
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível processar a foto.'))),
      'image/jpeg',
      OUTPUT_QUALITY
    );
  });
}
