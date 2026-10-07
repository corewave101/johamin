// Intro loading tracker: average progress, pending count, success and failure both finish a part.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { trackLoad, trackPromise, loadState, onLoadChange, resetLoads } = require('../lib/boot.ts');

(async () => {
  assert.deepEqual(loadState(), { progress: 1, pending: 0, total: 0 }, 'Nothing to wait for');
  let calls = 0;
  const stop = onLoadChange(() => calls++);
  const video = trackLoad('video');
  const cards = trackLoad('cards');
  assert.deepEqual(loadState(), { progress: 0, pending: 2, total: 2 });
  video.progress(0.5);
  video.progress(0.3); // never goes backwards
  assert.equal(loadState().progress, 0.25);
  video.done(); video.done();
  assert.deepEqual(loadState(), { progress: 0.5, pending: 1, total: 2 });
  video.progress(0.1);
  assert.equal(loadState().progress, 0.5, 'A finished part stays at 100%');
  cards.progress(5);
  assert.equal(loadState().progress, 1, 'Progress is capped at 1');
  cards.done();
  assert.equal(loadState().pending, 0);

  resetLoads();
  const failed = Promise.reject(new Error('offline'));
  trackPromise('db', failed).catch(() => {});
  trackPromise('fonts', Promise.resolve());
  assert.equal(loadState().pending, 2);
  await new Promise(r => setTimeout(r, 0));
  assert.deepEqual(loadState(), { progress: 1, pending: 0, total: 2 }, 'A failed part does not block the intro');
  stop();
  const before = calls;
  trackLoad('late');
  assert.equal(calls, before, 'Unsubscribed listeners stay quiet');
  console.log('PASS: intro loading tracker.');
})();
