// 롯데의 가호(4.7.0~): /lotte/ 전용으로 고정되고 저장되지 않는다. 플레이리스트는 기기(IndexedDB)에만 곡을 둔다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const music = require('../lib/lotte-music.ts');
const { LOTTE_PALETTE } = require('../lib/palette.ts');

// 가호: 롯데 페이지에서만, 바꾸거나 저장하지 않는다.
const theme = fs.readFileSync('lib/theme.ts', 'utf8');
assert.ok(theme.includes("if (isLotte) return { kind: 'lotte' };"), 'lotte page always loads 롯데의 가호');
assert.ok(theme.includes("if (isLotte || choice.kind === 'lotte') return;"), '롯데의 가호 is never chosen or saved elsewhere');
assert.ok(/kind === 'lotte'\) return \{ choice, name: '롯데의 가호'[^\n]*scares: false/.test(theme), '롯데의 가호 has no jump scares');
assert.ok(Object.values(LOTTE_PALETTE).every(v => typeof v === 'string' && v.length));
const toggle = fs.readFileSync('components/swipe/BlessingToggle.tsx', 'utf8');
assert.ok(toggle.includes("theme.choice.kind === 'lotte' ? 'lotte'"), 'blessing button only explains on the lotte page');
assert.ok(fs.readFileSync('components/swipe/Backdrop.tsx', 'utf8').includes("kind === 'lotte' ? <LotteStadium />"), 'night stadium backdrop');
// 디자인은 롯데의 가호에만 걸린다(다른 페이지 · 가호의 모습은 그대로).
const css = fs.readFileSync('components/swipe/lotte-theme.css', 'utf8');
const bare = css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').map(rule => rule.split('{')[0].trim()).filter(sel => sel && !sel.startsWith('@') && !/^(from|to|\d+%)/.test(sel));
for (const sel of bare) for (const part of sel.split(/,(?![^(]*\))/)) {
  const p = part.trim();
  if (!p) continue;
  assert.ok(p.startsWith(':root[data-theme="lotte"]') || /^(\.lotte-|:root\.intro-open \.lotte-|:root:has\(\.streak-flame\) \.lotte-|:root:not\(\.at-home\) \.lotte-|\.intro-logo|\.scene-lotte)/.test(p), `scoped: ${p}`);
}

// 플레이리스트: 곡 이름, 다음 곡(끝없이), 음악 파일만.
assert.equal(music.trackTitle('[롯데자이언츠 응원가] 부산갈매기.mp3'), '부산갈매기');
assert.equal(music.trackTitle('롯데 자이언츠 영광의순간.mp3'), '롯데 자이언츠 영광의순간');
assert.equal(music.trackTitle('조와 정 - 돌아와요 부산항에.mp3'), '조와 정 - 돌아와요 부산항에');
assert.equal(music.trackTitle('[x].mp3'), '[x].mp3');
assert.equal(music.nextIndex(0, 3, false), 1);
assert.equal(music.nextIndex(2, 3, false), 0, 'loops back to the first song');
assert.equal(music.nextIndex(0, 1, true), 0);
for (let i = 0; i < 50; i++) { const n = music.nextIndex(1, 4, true); assert.ok(n !== 1 && n >= 0 && n < 4, 'shuffle picks another song'); }
assert.ok(music.isAudioFile({ name: 'a.mp3', type: '' }) && music.isAudioFile({ name: 'x', type: 'audio/mpeg' }) && !music.isAudioFile({ name: 'a.png', type: 'image/png' }));
assert.ok(music.RADIO_KEY.startsWith('johamin-'));
const store = fs.readFileSync('lib/lotte-music.ts', 'utf8');
assert.ok(store.includes("const DB = 'johamin-lotte-music';"), 'songs live in this device only');

// 플리 파일(4.7.1~): 가호 파일처럼 곡을 base64로 묶어 저장하고, 불러오면 같은 곡이 그대로 나온다.
(async () => {
  const bytes = Uint8Array.from({ length: 70000 }, (_, i) => (i * 37) % 256);
  const json = await music.playlistToJson([{ name: '부산갈매기', blob: new Blob([bytes], { type: 'audio/mpeg' }) }, { name: '뱃노래', blob: new Blob([bytes.slice(0, 10)], { type: '' }) }]);
  const data = JSON.parse(json);
  assert.equal(data.type, 'johamin-lotte-playlist');
  assert.equal(music.checkPlaylistFile(data), null);
  const songs = await music.songsFromPlaylist(data);
  assert.deepEqual(songs.map(s => s.name), ['부산갈매기', '뱃노래'], 'order and names kept');
  assert.deepEqual(new Uint8Array(await songs[0].blob.arrayBuffer()), bytes, 'song bytes survive the round trip');
  assert.equal(songs[1].blob.type, 'audio/mpeg', 'unknown type saved as mp3');
  assert.match(music.checkPlaylistFile({ type: 'johamin-blessing' }), /플리 파일이 아니/);
  assert.match(music.checkPlaylistFile({ type: 'johamin-lotte-playlist', version: 1, tracks: [] }), /곡이 없/);
  assert.match(music.checkPlaylistFile({ type: 'johamin-lotte-playlist', version: 1, tracks: [{ name: 'x', data: 'data:image/png;base64,AAAA' }] }), /곡 파일/);
  assert.match(music.checkPlaylistFile({ type: 'johamin-lotte-playlist', version: 1, tracks: [{ name: '', data: 'data:audio/mpeg;base64,AAAA' }] }), /이름/);
  assert.equal(music.audioType({ name: 'a.M4A', type: '' }), 'audio/mp4');
  const radio = fs.readFileSync('components/swipe/LotteRadio.tsx', 'utf8');
  assert.ok(/link\.download = `johamin-lotte-playlist-\$\{/.test(radio), 'download name is ASCII');
  console.log('PASS: 플리 파일 저장 → 불러오기(곡 그대로) · 잘못된 파일 거르기');
})().catch(error => { console.error(error); process.exit(1); });

// 음원은 저장소에 넣지 않는다(저작권). public/ 어디에도 음악 파일이 없어야 한다.
const audioFiles = [];
const walk = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const f = path.join(dir, e.name); if (e.isDirectory()) walk(f); else if (/\.(mp3|m4a|aac|ogg|oga|wav|flac)$/i.test(e.name)) audioFiles.push(f); } };
walk('public');
assert.deepEqual(audioFiles, [], 'no music files in public/');
const main = fs.readFileSync('app/main.tsx', 'utf8');
assert.ok(main.includes('{isLotte && <LotteRadio />}'), 'player only on the lotte page');
assert.ok(!/from '\.\.\/\.\.\/data\//.test(fs.readFileSync('components/swipe/LotteRadio.tsx', 'utf8')), 'player does not pull in card data');

console.log('PASS: 롯데의 가호는 /lotte/ 전용 · 저장 안 함 · 디자인은 롯데의 가호에만 · 플레이리스트는 기기에만(음원 파일 없음)');
