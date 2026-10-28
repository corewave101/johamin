// 4.11.0 문제 화면 정리: 설정(≡) 버튼 · 갑툭튀/롯데 로고 끄기 · 모름 삭제 · 처음으로 돌아가기 칸 · 한 화면 고정.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const store = new Map([['johamin-scares-v1', 'off']]);
global.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) };
const settings = require('../lib/settings.ts');

// 켜고 끄기: 저장된 값을 읽고, 바꾸면 저장하고 알린다. 기본은 둘 다 켜짐.
assert.equal(settings.isOn('scares'), false, '저장된 off');
assert.equal(settings.isOn('lottePeek'), true, '기본 on');
const seen = [];
const stop = settings.onToggle((k, on) => seen.push([k, on]));
settings.setOn('lottePeek', false); settings.setOn('scares', true);
assert.deepEqual(seen, [['lottePeek', false], ['scares', true]]);
assert.equal(store.get('johamin-lotte-peek-v1'), 'off');
assert.equal(store.get('johamin-scares-v1'), 'on');
stop();

// 설정 버튼 위치: 놓은 쪽 가장자리에 붙고, 세로는 화면 안으로 잘린다.
assert.deepEqual(settings.snapDock(30, 400, 390, 800), { side: 'left', y: 0.5 });
assert.deepEqual(settings.snapDock(380, 5, 390, 800), { side: 'right', y: 64 / 800 });
assert.deepEqual(settings.snapDock(380, 900, 390, 800), { side: 'right', y: 736 / 800 });
assert.equal(settings.dockSpot(), null);
settings.saveDockSpot({ side: 'left', y: 0.3 });
assert.deepEqual(settings.dockSpot(), { side: 'left', y: 0.3 });
store.set('johamin-settings-dock-v1', '{"side":"top","y":3}');
assert.equal(settings.dockSpot(), null, '이상한 값은 기본 자리로');

// 갑툭튀 끄기: 하민의 가호 갑툭튀도, 직접 만든 가호의 갑툭튀도 안 나온다.
const jump = fs.readFileSync('lib/jumpscare.ts', 'utf8');
assert.ok(/triggerScare[\s\S]{0,120}!isOn\('scares'\)/.test(jump) && /triggerCustomScare[\s\S]{0,80}if \(!isOn\('scares'\)\) return false/.test(jump));
assert.ok(fs.readFileSync('components/swipe/LottePeek.tsx', 'utf8').includes("isOn('lottePeek')"));

// 화면: 소리 · 크기 · 업데이트 확인은 설정 버튼 안으로(정보 페이지는 위쪽 막대 그대로).
const main = fs.readFileSync('app/main.tsx', 'utf8');
assert.ok(main.includes('{!isElice && <><BlessingToggle /><SettingsDock /></>}'));
assert.ok(!main.includes('CardSizeControl') && !main.includes('{!isElice && <AppStatus />}'));
const dock = fs.readFileSync('components/swipe/SettingsDock.tsx', 'utf8');
for (const label of ['소리', '답 가리기', '카드 크기', '갑툭튀', '롯데 로고', '<AppStatus />']) assert.ok(dock.includes(label), label);
assert.ok(dock.includes('role="dialog" aria-modal="true"'), '열려 있는 동안 카드가 방향키에 반응하지 않게');

// 문제 화면: 모름 · 답 가리기 버튼 · 제목 · 돌아가기 버튼이 없고, 점선 칸으로 돌아간다.
const game = fs.readFileSync('components/swipe/SwipeGame.tsx', 'utf8');
assert.ok(!game.includes("choose('unknown')") && !game.includes("'Space' ? 'unknown'"), '모름 완전히 삭제');
assert.ok(!game.includes('answer-view-toggle') && !game.includes('swipe-heading') && !game.includes('BRAND'));
assert.ok(game.includes('여기로 드래그하면 처음으로 돌아가요') && game.includes('swipe-home-zone'));
assert.ok(game.includes("classList.add('in-game')") && game.includes("'--fit'"));
const css = fs.readFileSync('app/swipe.css', 'utf8');
assert.ok(css.includes(':root.in-game, :root.in-game body { height: 100%; overflow: hidden;'), '문제 화면은 스크롤 잠금');
assert.ok(css.includes('calc(var(--fy) - 75vh)') && css.includes('.swipe-back.from-down { --by: 55%; }'), '위아래 넘김 · 해설 카드 동작');
console.log('PASS: 설정(≡) 버튼, 갑툭튀 · 롯데 로고 끄기, 모름 삭제, 처음으로 칸, 한 화면 고정.');
