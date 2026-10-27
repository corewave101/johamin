// 원중이레츠고 · 롯데 자이언츠 문제(4.8.0~): 500문제 이상, 찐팬 150문제 안팎, 카드 규격, 근거, 주요 사실.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { lotteCards: cards, isHardcore } = require('../data/lotte-cards.ts');
const { lotteMenu } = require('../data/lotte-subjects.ts');

const deck = lotteMenu.children.find(d => d.id === 'lotte-giants');
assert.equal(deck.cards, cards);
assert.ok(cards.length >= 500, `${cards.length} cards`);
const hard = cards.filter(isHardcore);
assert.ok(hard.length >= 140 && hard.length <= 170, `찐팬 ${hard.length}`);
assert.equal(new Set(cards.map(c => c.id)).size, cards.length);
assert.ok(cards.every((c, i) => c.id === `lotte-giants-${String(i + 1).padStart(3, '0')}`), 'ids in order (never renumber: records are saved by id)');
assert.equal(new Set(cards.map(c => c.question)).size, cards.length, 'no repeated question');
const topics = new Set(cards.map(c => c.topic));
for (const t of ['창단과 구단', '1984 우승', '1992 우승', '가을야구', '레전드 투수', '레전드 타자', '기록실', '감독', '사직과 응원', '최근 롯데', '찐팬 · 시즌']) assert.ok(topics.has(t), t);
const dirs = ['up', 'left', 'right', 'down'];
const byDir = Object.fromEntries(dirs.map(d => [d, cards.filter(c => c.correct === d).length]));
assert.ok(Object.values(byDir).every(n => n >= cards.length / 4 - 2), JSON.stringify(byDir));
for (const c of cards) {
  assert.ok(dirs.includes(c.correct) && c.answers[c.correct], c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, `${c.id} 4 different answers`);
  assert.ok(Object.values(c.answers).every(a => a.trim() && a.length <= 24), `${c.id} answers ≤ 24: ${Object.values(c.answers).join(' | ')}`);
  assert.ok(c.question.length <= 90, `${c.id} question ${c.question.length}`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), `${c.id} explanation`);
  assert.ok(c.sourceNote && /^(위키백과 「|부산일보 |경향신문 |스포츠경향 |OSEN |스포츠조선 |일간스포츠 |엑스포츠뉴스 |마이데일리 )/.test(c.sourceNote), `${c.id} source ${c.sourceNote}`);
  // 카드 한 장만 보고 풀 수 있게.
  assert.ok(!/(위 그림|위 자료|학습지|앞 문제|다음 표|기사에서)/.test(c.question), c.id);
}

// 사실 확인: 정답이 근거와 맞는지 대표 문제로 검사한다.
const answer = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(answer('실업 야구단으로 처음 창단한 해'), '1975년');
assert.equal(answer('7차전까지 간 이 시리즈의 상대 팀'), '삼성 라이온즈');
assert.equal(answer('1984년 한국시리즈에서 최동원이 혼자 거둔 성적'), '4승 1패');
assert.equal(answer('역전 3점 홈런을 치고 MVP가 된 선수'), '유두열');
assert.equal(answer('두 번째 한국시리즈 우승. 상대 팀과 전적'), '빙그레 · 4승 1패');
assert.equal(answer('2승 1세이브를 올린 롯데 투수'), '박동희');
assert.equal(answer('최동원의 등번호'), '11번');
assert.equal(answer('이대호의 등번호'), '10번');
assert.equal(answer('‘연속 경기 홈런’ 세계 기록'), '9경기');
assert.equal(answer('타격 7관왕에 들지 않는 부문'), '도루');
assert.equal(answer('KBO 리그 최초의 외국인 감독'), '제리 로이스터');
assert.equal(answer('22대 감독으로 선임된 사람'), '이동욱');
assert.equal(answer('KBO 한 시즌 최다 안타(202개)'), '빅터 레이예스');
assert.equal(answer('사직야구장 외야 펜스 높이의 변화'), '4.8m → 6m');
assert.equal(answer('35승 1무 97패'), '2002년');
assert.equal(answer('1999년 한국시리즈에서 롯데를 꺾고'), '한화 이글스');
assert.equal(answer('1995년 한국시리즈에서 롯데와 맞붙어'), 'OB 베어스');
assert.equal(answer('구단 최초로 달성한 기록은?'), '통산 140세이브');
// 정규시즌 순위는 정규시즌 기준(1992년 3위)으로만 묻는다.
assert.equal(answer('1992년 롯데의 정규시즌 순위'), '3위');

console.log(`PASS: 롯데 자이언츠 ${cards.length}문제(찐팬 ${hard.length}) · ${topics.size}단원 · 정답 방향 ${JSON.stringify(byDir)} · 근거와 대표 사실 확인`);

// 정답 네온(LotteNeon): 맞힐 때만, 연속 정답 · 찐팬은 따로, 가사 없이 짧게.
const { neonFor, NEON_LINES } = require('../lib/lotte-neon.ts');
assert.equal(neonFor({ correct: false, unknown: false, streakAfter: 0 }, 0), null);
assert.equal(neonFor({ correct: true, unknown: true, streakAfter: 0 }, 0), null);
assert.deepEqual(neonFor({ correct: true, unknown: false, streakAfter: 3 }, 0), ['3연속', '정답!']);
assert.deepEqual(neonFor({ correct: true, unknown: false, streakAfter: 1, topic: '찐팬 · 시즌' }, 0), ['찐팬', '인정!']);
assert.deepEqual(neonFor({ correct: true, unknown: false, streakAfter: 1, topic: '감독' }, 0), NEON_LINES[0]);
assert.ok(NEON_LINES.every(([a, b]) => a.length <= 6 && b.length <= 7), 'short neon lines');
assert.ok(fs.readFileSync('components/swipe/SwipeGame.tsx', 'utf8').includes("new CustomEvent('johamin:answer'"));
assert.ok(fs.readFileSync('app/main.tsx', 'utf8').includes('{isLotte && <><LotteRadio /><LotteNeon /></>}'));
console.log('PASS: 정답 네온 문구');
