// 2.0 blessings: natural palettes, blessing file checks, Korean particles, coin defaults, saved choice and legacy switch.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const store = new Map();
global.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
const { paletteFrom, hexToOklch, HAMIN_PALETTE, PRESET_COLORS } = require('../lib/palette.ts');
const { checkBlessingFile, objectParticle, coinDefaults, clamp } = require('../lib/blessing-store.ts');

// Palette keeps the hue but settles lightness and chroma into a calm, readable range.
for (const picked of ['#00ff00', '#ff00ff', '#0000ff', '#ff2a6d', '#e8b931', ...PRESET_COLORS]) {
  const p = paletteFrom(picked), pick = hexToOklch(picked);
  const [light, base, deep, ink] = [p.light, p.base, p.deep, p.ink].map(hexToOklch);
  assert.ok(light.l > base.l && base.l > deep.l && deep.l > ink.l, `${picked}: tones from light to dark`);
  assert.ok(base.c <= 0.16, `${picked}: chroma calmed (${base.c.toFixed(3)})`);
  assert.ok(Math.abs(((base.h - pick.h + 540) % 360) - 180) < 12, `${picked}: hue kept`);
  assert.ok(base.l - ink.l > 0.4, `${picked}: coin text readable`);
  assert.match(p.glow, /^\d+ \d+ \d+$/);
}
const grey = hexToOklch(paletteFrom('#808080').base);
assert.ok(grey.c < 0.01, 'Grey stays grey');
assert.equal(HAMIN_PALETTE.base, '#e8b931', '하민 gold is untouched');

// Blessing files
const image = 'data:image/webp;base64,AAAA';
const good = { type: 'johamin-blessing', version: 1, name: '철수의 가호', coinFront: '철수', coinBack: '철수!', color: '#3fb8b0', focusX: 50, focusY: 40, crop: { x: 0, y: 0, scale: 1.2 }, background: image, cardSource: image, card: image };
assert.equal(checkBlessingFile(good), null);
assert.equal(checkBlessingFile({ ...good, type: 'other' }), '조하민레츠고 가호 파일이 아니에요.');
assert.equal(checkBlessingFile({ ...good, name: '' }), '가호 이름이 올바르지 않아요.');
assert.equal(checkBlessingFile({ ...good, color: 'red' }), '가호 색이 올바르지 않아요.');
assert.equal(checkBlessingFile({ ...good, card: 'javascript:alert(1)' }), '사진이 들어 있지 않아요.');
assert.equal(checkBlessingFile(null), '조하민레츠고 가호 파일이 아니에요.');
assert.equal(clamp(NaN, 0, 100), 0);

// Words
assert.equal(objectParticle('하민의 가호'), '를');
assert.equal(objectParticle('철수의 가호'), '를');
assert.equal(objectParticle('영웅'), '을');
assert.equal(objectParticle('JO'), '을(를)');
assert.deepEqual(coinDefaults('철수의 가호'), { front: '철수', back: '철수!' });
assert.deepEqual(coinDefaults(''), { front: 'JO', back: 'HAMIN!' });

// Saved choice: 1.x users who turned the blessing off start without a blessing; others start with 하민.
store.set('johamin-blessing', '0');
let theme = require('../lib/theme.ts');
assert.equal(theme.getTheme().choice.kind, 'none');
assert.equal(require('../lib/blessing.ts').isBlessed(), false);
theme.setThemeChoice({ kind: 'hamin' });
assert.equal(theme.getTheme().scares, true);
assert.deepEqual(JSON.parse(store.get('johamin-theme')), { kind: 'hamin' });
global.indexedDB = { open() { throw new Error('no device storage in tests'); } };
let changes = 0;
const stop = require('../lib/blessing.ts').onBlessedChange(() => changes++);
theme.setThemeChoice({ kind: 'custom', id: 'b1', name: '철수의 가호', coinFront: '철수', coinBack: '철수!', color: '#3fb8b0' });
assert.equal(theme.getTheme().scares, false, 'No scares under a custom blessing');
assert.equal(theme.getTheme().name, '철수의 가호');
assert.equal(changes, 1);
stop();
(async () => {
  await new Promise(r => setTimeout(r, 10));
  assert.equal(theme.getTheme().choice.kind, 'none', 'A custom blessing whose pictures are gone falls back to no blessing');
console.log('PASS: blessing palettes keep hue and stay calm, blessing files are checked, particles and coin defaults, saved choice, legacy switch and missing-picture fallback.');
})();
