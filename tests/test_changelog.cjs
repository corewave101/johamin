// The update log (click the version) is read from CHANGELOG.md: every version heading becomes a section with its bullets.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { parseChangelog } = require('../lib/changelog.ts');
const sample = '# 변경 기록\n\n소개 문단\n\n## 2.0.0 — 2026-01-02\n\n- 첫째 `코드`\n  - 하위 **굵게**\n- 둘째\n\n## 1.0.0\n\n- 처음\n';
assert.deepEqual(parseChangelog(sample), [
  { version: '2.0.0', date: '2026-01-02', items: [{ text: '첫째 코드', children: ['하위 굵게'] }, { text: '둘째', children: [] }] },
  { version: '1.0.0', date: '', items: [{ text: '처음', children: [] }] },
]);
assert.deepEqual(parseChangelog(sample.replace(/\n/g, '\r\n'))[0].items.length, 2);
const versions = parseChangelog(fs.readFileSync('CHANGELOG.md', 'utf8'));
const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.ok(versions.length >= 5);
assert.equal(versions[0].version, version, 'CHANGELOG.md의 맨 위 버전이 package.json 버전과 같아야 해요');
console.log(`PASS: update log reads ${versions.length} versions from CHANGELOG.md, newest (${version}) first, with sub-bullets and markdown markers cleaned.`);
