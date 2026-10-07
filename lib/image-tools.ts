// Picture helpers for the blessing editor: shrink photos before saving and cut the card picture.
import type { CardCrop } from './blessing-store';

export const CARD_ASPECT = 4 / 5; // width / height of the card picture
const CARD_OUT = { w: 640, h: 800 };

export async function loadBitmap(source: Blob) {
  return createImageBitmap(source, { imageOrientation: 'from-image' });
}

async function toBlob(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.84));
  if (blob) return blob;
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('사진을 저장하지 못했어요.'))), 'image/jpeg', 0.86));
}

/** Shrinks a photo so its long side is at most `max` pixels. */
export async function resizeImage(source: Blob, max = 1600): Promise<Blob> {
  const bitmap = await loadBitmap(source);
  const k = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return toBlob(canvas);
}

/**
 * Card crop geometry, shared by the editor preview and the saved picture.
 * At scale 1 the photo just covers the frame; x/y move the photo (in frame units, 0 = centred).
 */
export function cropBox(imageW: number, imageH: number, crop: CardCrop) {
  const cover = Math.max(CARD_ASPECT / (imageW / imageH), 1); // frame height = 1
  const w = (imageW / imageH) * cover * crop.scale, h = cover * crop.scale; // image size in frame-height units
  const maxX = (w - CARD_ASPECT) / 2, maxY = (h - 1) / 2;
  const x = Math.min(maxX, Math.max(-maxX, crop.x)), y = Math.min(maxY, Math.max(-maxY, crop.y));
  return { w, h, x, y, maxX, maxY };
}

export async function cropCard(source: Blob, crop: CardCrop): Promise<Blob> {
  const bitmap = await loadBitmap(source);
  const box = cropBox(bitmap.width, bitmap.height, crop);
  const canvas = document.createElement('canvas');
  canvas.width = CARD_OUT.w; canvas.height = CARD_OUT.h;
  const unit = CARD_OUT.h; // pixels per frame-height unit
  const left = (CARD_ASPECT - box.w) / 2 + box.x, top = (1 - box.h) / 2 + box.y;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, left * unit, top * unit, box.w * unit, box.h * unit);
  bitmap.close();
  return toBlob(canvas);
}
