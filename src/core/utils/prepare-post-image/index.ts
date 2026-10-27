const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const OUTPUT_WIDTH_PX = 1080;
const OUTPUT_HEIGHT_PX = 1350;
const OUTPUT_QUALITY = 0.85;

export async function preparePostImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha só arquivos de imagem.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Uma das fotos é grande demais. O máximo é 15 MB.');
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('Não foi possível ler uma das imagens. Use JPG, PNG ou WebP.');
  }

  const targetRatio = OUTPUT_WIDTH_PX / OUTPUT_HEIGHT_PX;
  const cropWidth = Math.min(bitmap.width, bitmap.height * targetRatio);
  const cropHeight = cropWidth / targetRatio;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = OUTPUT_WIDTH_PX;
  canvas.height = OUTPUT_HEIGHT_PX;

  if (!context) throw new Error('Não foi possível processar a foto.');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, OUTPUT_WIDTH_PX, OUTPUT_HEIGHT_PX);
  context.drawImage(
    bitmap,
    (bitmap.width - cropWidth) / 2,
    (bitmap.height - cropHeight) / 2,
    cropWidth,
    cropHeight,
    0,
    0,
    OUTPUT_WIDTH_PX,
    OUTPUT_HEIGHT_PX
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
