// 롯데 페이지 플레이리스트(4.7.0~): 사람이 고른 음악 파일을 이 기기의 IndexedDB에만 저장한다.
// 음원은 저장소 · 서버에 올리지 않는다(저작권). 기기마다 각자 곡을 넣는다.

export interface LotteTrack { id: string; name: string; blob: Blob; order: number; addedAt: number }

const DB = 'johamin-lotte-music';
const STORE = 'tracks';
/** 재생 상태(몇 번째 곡, 멈춤, 섞기) — 기기에 저장. */
export const RADIO_KEY = 'johamin-lotte-radio-v1';
/** 한 곡 최대 크기(너무 큰 파일로 기기 저장 공간이 차지 않게). */
export const MAX_TRACK_BYTES = 40 * 1024 * 1024;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE, { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await open();
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = work(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(request ? request.result : undefined);
      tx.onerror = tx.onabort = () => reject(tx.error ?? request?.error);
    });
  } finally {
    db.close();
  }
}

export const listTracks = async () => ((await run<LotteTrack[]>('readonly', store => store.getAll())) ?? []).sort((a, b) => a.order - b.order || a.addedAt - b.addedAt);
export const deleteTrack = (id: string) => run('readwrite', store => store.delete(id));

/** "[롯데자이언츠 응원가] 부산갈매기.mp3" → "부산갈매기". */
export function trackTitle(fileName: string) {
  const bare = fileName.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/^\s*[[(【][^\])】]*[\])】]\s*/, '').trim();
  return bare || fileName;
}

export const isAudioFile = (file: File) => file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|oga|wav|flac|webm)$/i.test(file.name);

/** Adds the picked files to the end of the list. Returns how many were added and which were skipped. */
export async function addTracks(files: File[], existing: LotteTrack[]) {
  const skipped: string[] = [];
  let order = existing.reduce((max, t) => Math.max(max, t.order), 0);
  const fresh: LotteTrack[] = [];
  for (const file of files) {
    if (!isAudioFile(file) || file.size > MAX_TRACK_BYTES || file.size === 0) { skipped.push(file.name); continue; }
    if (existing.some(t => t.name === trackTitle(file.name) && t.blob.size === file.size)) { skipped.push(file.name); continue; }
    fresh.push({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, name: trackTitle(file.name), blob: file, order: ++order, addedAt: Date.now() });
  }
  if (fresh.length) await run('readwrite', store => { fresh.forEach(t => store.put(t)); });
  return { added: fresh.length, skipped };
}

export interface RadioState { index: number; paused: boolean; shuffle: boolean }
export function loadRadio(): RadioState {
  try {
    const saved = JSON.parse(localStorage.getItem(RADIO_KEY) ?? 'null') as Partial<RadioState> | null;
    return { index: Number.isInteger(saved?.index) ? saved!.index! : 0, paused: saved?.paused === true, shuffle: saved?.shuffle === true };
  } catch { return { index: 0, paused: false, shuffle: false }; }
}
export function saveRadio(state: RadioState) {
  try { localStorage.setItem(RADIO_KEY, JSON.stringify(state)); } catch { /* storage may be unavailable */ }
}

/** Next index in the playlist, looping forever. With shuffle, any other song. */
export function nextIndex(current: number, length: number, shuffle: boolean, random = Math.random) {
  if (length <= 1) return 0;
  if (!shuffle) return (current + 1) % length;
  const pick = Math.floor(random() * (length - 1));
  return pick >= current ? pick + 1 : pick;
}
