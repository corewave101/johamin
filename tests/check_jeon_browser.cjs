const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { jeonCards, jeonSources } = require('../data/jeon-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { newGame, answerCard } = require('../lib/swipe-game.ts');
const { chromium } = require(process.env.CODEX_NODE_PACKAGES ? path.join(process.env.CODEX_NODE_PACKAGES, 'playwright') : 'playwright');
const dirs = ['up', 'left', 'right', 'down'];
const keys = { up: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown' };
assert.equal(jeonCards.length, 121);
assert.equal(subjectDecks.find(d => d.id === 'astronomy-jeon').cards, jeonCards);
assert.equal(new Set(jeonCards.map(c => c.id)).size, jeonCards.length);
assert.equal(new Set(jeonCards.map(c => c.question)).size, jeonCards.length);
assert.equal(new Set(jeonCards.map(c => c.source.url)).size, 7);
for (const c of jeonCards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 65 && Object.values(c.answers).every(a => a.length <= 17), c.id);
  const source = jeonSources.find(s => s.url === c.source.url);
  assert.ok(source && c.source.page >= 1 && c.source.page <= source.pages, c.id);
  assert.ok(c.explanation.length > 20 && !/(그림을|위 그림|다음 그림)/.test(c.question), c.id);
}
const correct = phrase => {
  const c = jeonCards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct];
};
assert.equal(correct('근일점의 3배'), '3배'); // r_p v_p = r_a v_a, including correction of a handwritten inversion.
assert.equal(correct('긴반지름이 지구의 4배'), `${Math.sqrt(4 ** 3)}년`);
assert.equal(correct('0.6년이다'), `${Math.round(10 / (1 / 0.6 - 1)) / 10}년`);
assert.equal(correct('적위 −10°'), `${90 - 35 - 10}°`);
const snapshot = JSON.stringify(jeonCards);
let game = newGame(jeonCards), first = game.queue[0];
game = answerCard(game, 'unknown', 1);
assert.equal(game.queue[12].id, first.id); assert.notEqual(game.queue[12].correct, first.correct);
assert.equal(game.queue[12].answers[game.queue[12].correct], first.answers[first.correct]);
assert.equal(JSON.stringify(jeonCards), snapshot);
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 320, height: 844 }, reducedMotion: 'reduce' });
    const errors = [], seen = new Set(); page.on('pageerror', e => errors.push(e.message));
    await page.goto((process.env.JOHAMIN_TEST_URL || 'http://127.0.0.1:5180') + '/?v=jeon#johamin');
    await page.locator('.intro.is-ready .intro-button').click(); await page.locator('.intro').waitFor({ state: 'detached' });
    await page.getByRole('region', { name: '과목 선택 메뉴', exact: true }).waitFor();
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowRight');
    await page.getByRole('button', { name: /문제 파트/ }).click();
    await page.getByRole('button', { name: /^객관식/ }).click();
    await page.locator('.swipe-deck-bar strong').filter({ hasText: '행성우주과학(전)' }).waitFor();
    const read = async () => {
      const q = await page.locator('.swipe-card:not(.swipe-flying) h2').innerText();
      const c = jeonCards.find(c => c.question === q); assert.ok(c, q); seen.add(c.id);
      const a = await page.locator('.swipe-board .swipe-option>span').allTextContents();
      assert.deepEqual([...a].sort(), Object.values(c.answers).sort(), c.id);
      const d = dirs[a.indexOf(c.answers[c.correct])]; assert.ok(d);
      assert.ok(await page.locator('.swipe-card:not(.swipe-flying)').evaluate(el => {
        const box = el.getBoundingClientRect(), caption = el.querySelector('.card-caption'), text = caption.getBoundingClientRect();
        return text.top >= box.top && text.bottom <= box.bottom + 1 && caption.scrollHeight <= caption.clientHeight + 1 && document.documentElement.scrollWidth <= innerWidth;
      }), `Clipped question: ${c.id} ${q}`);
      return { c, d };
    };
    const first = await read(); await page.keyboard.press('Space');
    assert.match(await page.locator('.swipe-feedback-top strong').innerText(), /모름/);
    const solve = async () => {
      const state = await read(); await page.keyboard.press(keys[state.d]);
      const source = page.locator('.swipe-source a');
      assert.equal(await source.getAttribute('href'), state.c.source.url);
      assert.match(await source.innerText(), new RegExp(`PDF ${state.c.source.page}쪽`));
      return state;
    };
    for (let i = 0; i < 12; i++) await solve();
    const retry = await read(); assert.equal(retry.c.id, first.c.id); assert.notEqual(retry.d, first.d);
    fs.mkdirSync('artifacts', { recursive: true });
    await page.screenshot({ path: 'artifacts/jeon-mobile.png', fullPage: true });
    let guard = jeonCards.length + 2;
    while (await page.locator('.swipe-board').count()) { assert.ok(guard--); await solve(); }
    assert.equal(seen.size, jeonCards.length);
    assert.match(await page.locator('.swipe-complete').innerText(), /121장 완료 · 총 122번 선택/);
    await page.getByRole('button', { name: '한 판 더' }).click();
    assert.equal(await page.locator('.streak-flame strong').innerText(), '0');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: 'artifacts/jeon-desktop.png', fullPage: true });
    await page.keyboard.press('Escape');
    await page.getByRole('region', { name: '행성우주과학 메뉴', exact: true }).waitFor();
    assert.match(await page.locator('.swipe-option-right').innerText(), /\(전\)\s*121장/);
    assert.deepEqual(errors, []);
    console.log('PASS: 121 sourced Jeon cards, 7 PDFs, calculations, all mobile layouts, semantic shuffle, 12-card retry, source links, completion/restart and parent menu.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });

