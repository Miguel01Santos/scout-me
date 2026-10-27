const UPLOAD_SEGMENT = '/image/upload/';

export function cloudinaryImage(url: string, width: number) {
  if (!url.includes(UPLOAD_SEGMENT)) return url;

  const height = Math.round((width * 5) / 4);

  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}c_fill,w_${width},h_${height},q_auto,f_auto/`);
}
