const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { astronomyCards } = require('../data/astronomy-cards.ts');
const { swipeCards } = require('../data/swipe-cards.ts');
const { chromium } = require(process.env.CODEX_NODE_PACKAGES ? path.join(process.env.CODEX_NODE_PACKAGES, 'playwright') : 'playwright');
const base = process.env.JOHAMIN_TEST_URL || 'http://127.0.0.1:5180';
const directions = ['up', 'left', 'right', 'down'];
const keys = { up: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown' };
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [], seen = new Set();
    page.on('pageerror', e => errors.push(e.message));
    const menu = name => page.getByRole('region', { name: `${name} 메뉴`, exact: true });
    // Every page load starts on the intro: wait for the JO button and press it.
    const enter = async () => { await page.locator('.intro.is-ready .intro-button').click(); await page.locator('.intro').waitFor({ state: 'detached' }); };
    const read = async (deck = astronomyCards) => {
      const question = await page.locator('.swipe-card:not(.swipe-flying) h2').innerText();
      const subjectEl = page.locator('.swipe-card:not(.swipe-flying) .card-subject');
      const subject = await subjectEl.count() ? await subjectEl.innerText() : '';
      const card = deck.find(c => c.question === question && (c.subject ?? '') === subject);
      assert.ok(card, question);
      const answers = await page.locator('.swipe-board .swipe-option>span').allTextContents();
      const correct = directions[answers.indexOf(card.answers[card.correct])];
      assert.ok(correct, `Correct answer lost for ${card.id}`);
      if (deck === astronomyCards) {
        seen.add(card.id);
        assert.ok(await page.locator('.swipe-card:not(.swipe-flying)').evaluate(el => {
          const box = el.getBoundingClientRect(), caption = el.querySelector('.card-caption'), text = caption.getBoundingClientRect();
          return text.top >= box.top && text.bottom <= box.bottom + 1 && caption.scrollHeight <= caption.clientHeight + 1 && document.documentElement.scrollWidth <= innerWidth;
        }), `Card clips: ${card.id}`);
      }
      return { card, correct, answers };
    };
    const solve = async (deck = astronomyCards) => {
      const state = await read(deck);
      await page.keyboard.press(keys[state.correct]);
      if (state.card.sourceSlide) assert.match(await page.locator('.swipe-source').innerText(), new RegExp(`슬라이드 ${state.card.sourceSlide}$`));
      return state;
    };
    await page.goto(base + '/#johamin'); await enter();
    await menu('과목 선택').waitFor();
    await page.keyboard.press('ArrowLeft');
    await menu('인문').waitFor();
    // 국어 is a group of three parts: 문법 has cards, 뉴욕제과점 and 고전 시가 are waiting for material.
    await page.keyboard.press('ArrowUp'); await menu('국어').waitFor();
    await page.keyboard.press('ArrowUp'); await page.getByRole('heading', { name: '국어(문법)' }).waitFor();
    await page.keyboard.press('Escape'); await menu('국어').waitFor();
    await page.keyboard.press('ArrowLeft'); await page.getByText('아직 자료가 없어요').waitFor();
    await page.keyboard.press('Escape'); await menu('국어').waitFor();
    await page.keyboard.press('ArrowDown'); await menu('인문').waitFor();
    await page.keyboard.press('ArrowRight'); await page.getByRole('region', { name: '학습 메뉴' }).waitFor();
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowLeft');
    await page.getByRole('button', { name: /문제 파트/ }).click();
    await page.getByRole('button', { name: /^객관식/ }).click();
    await page.locator('.swipe-deck-bar strong').filter({ hasText: '사회(성신제)' }).waitFor();
    await page.keyboard.press('Escape');
    await menu('인문').waitFor();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await menu('과학').waitFor();
    await page.keyboard.press('ArrowLeft');
    await menu('지구과학').waitFor();
    await page.keyboard.press('ArrowRight');
    await page.getByRole('button', { name: /문제 파트/ }).click();
    await page.getByRole('button', { name: /^객관식/ }).click();
    await page.locator('.swipe-deck-bar strong').filter({ hasText: '행성우주과학(전)' }).waitFor();
    assert.ok(await page.locator('.swipe-board').count());
    await page.keyboard.press('Escape');
    await page.keyboard.press('ArrowLeft');
    await page.getByRole('button', { name: /문제 파트/ }).click();
    await page.getByRole('button', { name: /^객관식/ }).click();
    await page.locator('.streak-flame').waitFor();
    assert.match(await page.locator('.swipe-progress-row').innerText(), /0 \/ 75/);
    assert.equal(await page.locator('.swipe-verdict').count(), 0);
    await page.screenshot({ path: 'artifacts/astronomy-compact-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 320, height: 844 });
    const original = await read();
    await page.keyboard.down('Space'); await page.keyboard.down('Space'); await page.keyboard.up('Space');
    assert.match(await page.locator('.swipe-feedback-top strong').innerText(), /모름/);
    const cooled = await page.locator('.streak-flame svg').evaluate(el => getComputedStyle(el).transform);
    for (let i = 0; i < 12; i++) await solve();
    const retry = await read();
    assert.equal(retry.card.id, original.card.id);
    assert.notEqual(retry.correct, original.correct, 'Unknown retry changes the answer arrow');
    assert.equal(await page.locator('.streak-flame strong').innerText(), '12');
    const heated = await page.locator('.streak-flame svg').evaluate(el => getComputedStyle(el).transform);
    assert.notEqual(heated, cooled);
    await page.screenshot({ path: 'artifacts/astronomy-flame-hot.png', fullPage: true });
    await solve();
    const beforeWrong = await read();
    await page.keyboard.press(keys[directions.find(d => d !== beforeWrong.correct)]);
    assert.equal(await page.locator('.streak-flame strong').innerText(), '0');
    assert.equal(await page.locator('.streak-flame.is-cool').count(), 1);
    assert.ok(await page.locator('.swipe-feedback-top strong').evaluate(el => parseFloat(getComputedStyle(el).fontSize) <= 16));
    for (let i = 0; i < 12; i++) await solve();
    const wrongRetry = await read();
    assert.equal(wrongRetry.card.id, beforeWrong.card.id);
    assert.notEqual(wrongRetry.correct, beforeWrong.correct);
    let guard = 100;
    while (await page.locator('.swipe-board').count()) { assert.ok(guard-- > 0); await solve(); }
    assert.equal(seen.size, 75);
    assert.match(await page.locator('.swipe-complete').innerText(), /75장 완료 · 총 77번 선택/);
    await page.getByRole('button', { name: '한 판 더' }).click();
    assert.equal(await page.locator('.streak-flame strong').innerText(), '0');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'artifacts/astronomy-compact-mobile.png', fullPage: true });
    await page.getByRole('button', { name: /^모름/ }).click();
    await page.keyboard.press('Escape');
    await menu('지구과학').waitFor();
    await page.keyboard.press('Escape');
    await menu('과학').waitFor();
    await page.keyboard.press('Escape');
    await menu('과목 선택').waitFor();
    await page.goto(base + '/#johamin/demo'); await page.reload(); await enter();
    await page.locator('.swipe-progress-row').waitFor();
    for (let i = 0; i < 12; i++) await solve(swipeCards);
    await page.getByRole('heading', { name: '깔끔하게 털었다!' }).waitFor();
    await page.goto(base + '/'); await enter(); await menu('과목 선택').waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: nested menus, all 75 shuffled cards at 320px, semantic answers preserved, wrong/unknown retry at 12 with changed arrows, flame heats/cools, compact feedback, complete/restart, demo deck and root menu, intro button.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

