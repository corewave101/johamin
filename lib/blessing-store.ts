// "다른 가호": blessings people make themselves. Kept only on this device (IndexedDB); pictures never go to a server.
// A blessing can be saved to a file and opened on another device or by a friend.

export interface CardCrop { x: number; y: number; scale: number } // pan in source pixels from centre, zoom over "cover"
export interface BlessingRecord {
  id: string;
  name: string;
  coinFront: string;
  coinBack: string;
  color: string;          // the colour the person picked; the palette is derived from it
  background: Blob;       // resized photo
  focusX: number;         // 0–100: which part of the background stays in view
  focusY: number;
  cardSource: Blob;       // resized original, so the crop can be changed later
  crop: CardCrop;
  card: Blob;             // the cropped card picture actually shown
  createdAt: number;
}
export type BlessingSummary = Pick<BlessingRecord, 'id' | 'name' | 'coinFront' | 'coinBack' | 'color'>;

const DB = 'johamin';
const STORE = 'blessings';
export const LIMITS = { name: 12, coinFront: 6, coinBack: 10 };

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE, { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = work(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(tx.error ?? request.error);
    });
  } finally {
    db.close();
  }
}

export const listBlessings = async () => (await run<BlessingRecord[]>('readonly', store => store.getAll())).sort((a, b) => a.createdAt - b.createdAt);
export const getBlessing = (id: string) => run<BlessingRecord | undefined>('readonly', store => store.get(id));
export const saveBlessing = (record: BlessingRecord) => run('readwrite', store => store.put(record));
export const deleteBlessing = (id: string) => run('readwrite', store => store.delete(id));

export const newBlessingId = () => `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Coin text used when a field is left empty. */
export function coinDefaults(name: string) {
  const core = name.replace(/의?\s*가호$/, '').trim() || name.trim();
  return { front: [...core].slice(0, 2).join('') || 'JO', back: core ? `${core}!` : 'HAMIN!' };
}

/** 을/를 after a name, decided by whether the last Hangul syllable has a final consonant. */
export function objectParticle(word: string) {
  const last = word.trim().at(-1) ?? '';
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return '을(를)';
  return code % 28 ? '을' : '를';
}

// ----- files -----
const FILE_TYPE = 'johamin-blessing';

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});
async function dataUrlToBlob(url: string) { return (await fetch(url)).blob(); }

export async function exportBlessing(record: BlessingRecord): Promise<Blob> {
  const { id: _id, createdAt: _created, background, cardSource, card, ...rest } = record;
  const file = { type: FILE_TYPE, version: 1, ...rest, background: await blobToDataUrl(background), cardSource: await blobToDataUrl(cardSource), card: await blobToDataUrl(card) };
  return new Blob([JSON.stringify(file)], { type: 'application/json' });
}

type BlessingFile = Omit<BlessingRecord, 'id' | 'createdAt' | 'background' | 'cardSource' | 'card'> & { type: string; version: number; background: string; cardSource: string; card: string };

/** Checks a loaded file before anything is saved. Returns a reason in Korean when it is not a blessing file. */
export function checkBlessingFile(data: unknown): string | null {
  const f = data as Partial<BlessingFile> | null;
  if (!f || typeof f !== 'object' || f.type !== FILE_TYPE) return '조하민레츠고 가호 파일이 아니에요.';
  if (typeof f.name !== 'string' || !f.name.trim() || [...f.name].length > LIMITS.name) return '가호 이름이 올바르지 않아요.';
  if (typeof f.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(f.color)) return '가호 색이 올바르지 않아요.';
  for (const key of ['background', 'cardSource', 'card'] as const) {
    if (typeof f[key] !== 'string' || !/^data:image\/(webp|jpeg|png);base64,/.test(f[key] as string)) return '사진이 들어 있지 않아요.';
  }
  if (typeof f.focusX !== 'number' || typeof f.focusY !== 'number' || !f.crop || typeof f.crop.scale !== 'number') return '사진 위치 정보가 없어요.';
  return null;
}

export async function importBlessing(file: File): Promise<BlessingRecord> {
  if (file.size > 15 * 1024 * 1024) throw new Error('파일이 너무 커요.');
  let data: unknown;
  try { data = JSON.parse(await file.text()); } catch { throw new Error('조하민레츠고 가호 파일이 아니에요.'); }
  const problem = checkBlessingFile(data);
  if (problem) throw new Error(problem);
  const f = data as BlessingFile;
  const record: BlessingRecord = {
    id: newBlessingId(), createdAt: Date.now(),
    name: f.name.trim(), coinFront: String(f.coinFront ?? '').slice(0, 12), coinBack: String(f.coinBack ?? '').slice(0, 20), color: f.color,
    focusX: clamp(f.focusX, 0, 100), focusY: clamp(f.focusY, 0, 100),
    crop: { x: Number(f.crop.x) || 0, y: Number(f.crop.y) || 0, scale: clamp(f.crop.scale, 1, 6) },
    background: await dataUrlToBlob(f.background), cardSource: await dataUrlToBlob(f.cardSource), card: await dataUrlToBlob(f.card),
  };
  await saveBlessing(record);
  return record;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
