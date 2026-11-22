export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_PIXELS = 50_000_000;
export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

export interface LoadedImage { img: HTMLImageElement; url: string; width: number; height: number; name: string; type: string; size: number }

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return 'Unsupported file type. Please choose a JPEG, PNG, WebP, GIF or BMP image.';
  if (file.size > MAX_FILE_BYTES) return `This file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)}.`;
  return null;
}

export function loadImage(file: File): Promise<LoadedImage> {
  const problem = validateImageFile(file);
  if (problem) return Promise.reject(new Error(problem));
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth * img.naturalHeight > MAX_PIXELS) {
        URL.revokeObjectURL(url);
        reject(new Error('This image has too many pixels to process safely in the browser.'));
        return;
      }
      resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight, name: file.name, type: file.type, size: file.size });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('This file could not be read as an image. It may be damaged.')); };
    img.src = url;
  });
}

export function renderToBlob(img: HTMLImageElement, width: number, height: number, type: string, quality: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('Your browser does not support image processing.'));
  if (type === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height); } // JPEG has no transparency
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the image. Try a smaller size.'))), type, type === 'image/png' ? undefined : quality)
  );
}

export const extFor = (type: string) => (type === 'image/jpeg' ? 'jpg' : type === 'image/webp' ? 'webp' : 'png');
export const baseName = (name: string) => name.replace(/\.[^.]+$/, '') || 'image';
