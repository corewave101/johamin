// 롯데 페이지 플레이리스트(4.7.0~): 사람이 고른 음악 파일을 이 기기의 IndexedDB에만 저장한다.
// 음원은 저장소 · 서버에 올리지 않는다(저작권). 기기마다 각자 곡을 넣는다.
// 4.7.1~: 가호 파일처럼 플리를 파일 하나(.json, 곡이 base64로 들어 있음)로 저장하고 다른 기기에서 불러올 수 있다.

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

const AUDIO_TYPES: Record<string, string> = { mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', oga: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', webm: 'audio/webm' };
/** The file's audio type, guessed from the name when the browser did not give one. */
export const audioType = (file: { name: string; type: string }) => file.type.startsWith('audio/') ? file.type : AUDIO_TYPES[file.name.split('.').pop()?.toLowerCase() ?? ''] ?? 'audio/mpeg';

export const isAudioFile = (file: File) => file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|oga|wav|flac|webm)$/i.test(file.name);

/** Saves songs at the end of the list, skipping ones already there (same title and size). */
async function saveSongs(songs: { name: string; blob: Blob }[], existing: LotteTrack[]) {
  const skipped: string[] = [];
  let order = existing.reduce((max, t) => Math.max(max, t.order), 0);
  const fresh: LotteTrack[] = [];
  for (const song of songs) {
    if (existing.some(t => t.name === song.name && t.blob.size === song.blob.size) || fresh.some(t => t.name === song.name && t.blob.size === song.blob.size)) { skipped.push(song.name); continue; }
    fresh.push({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, name: song.name, blob: song.blob, order: ++order, addedAt: Date.now() });
  }
  if (fresh.length) await run('readwrite', store => { fresh.forEach(t => store.put(t)); });
  return { added: fresh.length, skipped };
}

/** Adds the picked files to the end of the list. Returns how many were added and which were skipped. */
export async function addTracks(files: File[], existing: LotteTrack[]) {
  const bad = files.filter(file => !isAudioFile(file) || file.size > MAX_TRACK_BYTES || file.size === 0).map(file => file.name);
  const songs = files.filter(file => !bad.includes(file.name)).map(file => ({ name: trackTitle(file.name), blob: file.type.startsWith('audio/') ? file : new Blob([file], { type: audioType(file) }) }));
  const result = await saveSongs(songs, existing);
  return { added: result.added, skipped: [...bad, ...result.skipped] };
}

// ----- 플리 파일 (가호 파일과 같은 방식) -----
export const PLAYLIST_FILE_TYPE = 'johamin-lotte-playlist';
/** 플리 파일 최대 크기(불러올 때). */
export const MAX_PLAYLIST_FILE_BYTES = 400 * 1024 * 1024;
export const MAX_PLAYLIST_TRACKS = 100;
const AUDIO_DATA = /^data:audio\/[\w.+-]+;base64,[A-Za-z0-9+/=]+$/;
interface PlaylistFile { type: string; version: number; tracks: { name: string; data: string }[] }

async function blobToDataUrl(blob: Blob, type: string) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `data:${type};base64,${btoa(binary)}`;
}

/** The playlist as one JSON text: names in order, each song inside as base64. */
export async function playlistToJson(tracks: Pick<LotteTrack, 'name' | 'blob'>[]) {
  const file: PlaylistFile = { type: PLAYLIST_FILE_TYPE, version: 1, tracks: [] };
  for (const t of tracks) file.tracks.push({ name: t.name, data: await blobToDataUrl(t.blob, t.blob.type.startsWith('audio/') ? t.blob.type : 'audio/mpeg') });
  return JSON.stringify(file);
}

/** Checks a loaded file before anything is saved. Returns a reason in Korean when it is not a playlist file. */
export function checkPlaylistFile(data: unknown): string | null {
  const f = data as Partial<PlaylistFile> | null;
  if (!f || typeof f !== 'object' || f.type !== PLAYLIST_FILE_TYPE) return '롯데 플리 파일이 아니에요.';
  if (!Array.isArray(f.tracks) || !f.tracks.length) return '플리에 곡이 없어요.';
  if (f.tracks.length > MAX_PLAYLIST_TRACKS) return `곡이 너무 많아요(${MAX_PLAYLIST_TRACKS}곡까지).`;
  for (const t of f.tracks) {
    if (!t || typeof t.name !== 'string' || !t.name.trim() || t.name.length > 120) return '곡 이름이 올바르지 않아요.';
    if (typeof t.data !== 'string' || !AUDIO_DATA.test(t.data)) return '곡 파일이 들어 있지 않아요.';
  }
  return null;
}

/** Songs from a checked playlist file. */
export async function songsFromPlaylist(data: unknown) {
  const problem = checkPlaylistFile(data);
  if (problem) throw new Error(problem);
  const songs: { name: string; blob: Blob }[] = [];
  for (const t of (data as PlaylistFile).tracks) {
    const blob = await (await fetch(t.data)).blob();
    if (blob.size && blob.size <= MAX_TRACK_BYTES) songs.push({ name: t.name.trim(), blob });
  }
  return songs;
}

/** Opens a playlist file and adds its songs after the ones already here (same songs are skipped). */
export async function importPlaylist(file: File, existing: LotteTrack[]) {
  if (file.size > MAX_PLAYLIST_FILE_BYTES) throw new Error('파일이 너무 커요.');
  let data: unknown;
  try { data = JSON.parse(await file.text()); } catch { throw new Error('롯데 플리 파일이 아니에요.'); }
  return saveSongs(await songsFromPlaylist(data), existing);
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
