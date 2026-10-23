import type { Direction, SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';

// 기말고사 · 영어(진달래T) 「2학기 학습지 추가 1번 · 연결사와 접속사」(1쪽, 필기 포함).
// 학습지 내용은 그대로 따랐다. 필기 중 어법상 틀린 곳은 바로잡아 냈다:
//   ★ 실제로 일어난 일(비가 많이 왔다)에는 even if(가정)가 아니라 even though
//   ★ 문장 맨 앞 연결사 자리(___, the game continued.)는 However — though는 부사로 쓸 때 문장 중간·끝에 둔다
export const NOTE = '진달래T 학습지 추가 1번 · 1쪽';

type Row = [topic: string, question: string, choices: [string, string, string, string], explanation: string];
// Correct text comes first; the game randomizes the four directions on every run and retry.
const rows: Row[] = [
  // 연결사와 접속사의 차이
  ['연결사와 접속사', '문장과 문장 사이의 의미 관계를 나타내는 부사를 무엇이라 하는가?', ['연결사', '접속사', '전치사', '관계대명사'], '연결사(conjunctive adverb)는 문장과 문장 사이의 의미 관계를 나타내는 부사다.'],
  ['연결사와 접속사', '한 문장 안에서 두 쌍의 주어-동사를 연결하는 것은?', ['접속사', '연결사', '전치사', '부사'], '접속사(conjunction)는 한 문장 안에서 두 쌍의 주어-동사를 연결한다.'],
  ['연결사와 접속사', '연결사가 문장에서 필수 성분이 아닌 까닭은?', ['부사이기 때문에', '명사이기 때문에', '동사이기 때문에', '전치사이기 때문에'], '연결사는 부사이므로 문장 안에서 필수 성분이 아니다.'],
  ['연결사와 접속사', '없으면 문장이 어법적으로 틀리게 되는 필수 성분은?', ['접속사', '연결사', '부사', '감탄사'], '접속사는 두 절을 잇는 필수 성분이라, 빼면 문장이 어법적으로 틀린다. 연결사는 부사라 필수 성분이 아니다.'],
  ['연결사와 접속사', '두 번째 문장 안에서 위치를 바꿀 수 있는 것은?', ['연결사', '접속사', '등위접속사', '전치사'], '연결사는 두 번째 문장의 맨 앞, 중간, 끝으로 위치를 바꿀 수 있다.'],
  ['연결사와 접속사', 'It rained heavily. The game, however, continued. 에서 however 앞뒤의 쉼표는?', ['반드시 필요하다', '없어도 된다', '앞에만 필요하다', '뒤에만 필요하다'], '연결사를 문장 중간에 넣을 때는 앞뒤를 쉼표로 끊는다. The game, however, continued.'],
  ['연결사와 접속사', '내용 사이의 관계를 나타내는 연결사와 접속사가 서로 다른 점은?', ['문법적 역할', '나타내는 의미 관계', '쓰이는 언어', '글자 수'], '연결사와 접속사는 모두 내용 사이의 관계를 나타내지만, 문법적 역할이 다르다.'],
  // 역접: 비가 많이 왔지만 경기가 계속되었다
  ['역접', 'It rained heavily. ___, the game continued. (비가 많이 왔지만 경기가 계속되었다)', ['However', 'Although', 'Despite', 'Because'], '두 문장 사이에서 역접을 나타내는 연결사 However를 쓴다. Although는 접속사, Despite는 전치사라 이 자리에 올 수 없다.'],
  ['역접', 'It rained heavily. The game continued, ___. (비가 많이 왔지만 경기가 계속되었다)', ['though', 'although', 'despite', 'because'], 'though는 연결사(부사)로 쓰일 때 문장 중간이나 끝에 올 수 있다. although는 접속사라 문장 끝에 올 수 없다.'],
  ['역접', '___ it rained heavily, the game continued. (비가 많이 왔지만 경기가 계속되었다)', ['Although', 'However', 'Despite', 'Therefore'], '뒤에 주어-동사(it rained)가 오므로 역접 접속사 Although(Though, Even though)를 쓴다.'],
  ['역접', 'The game continued ___ it rained heavily. (비가 많이 왔지만 경기가 계속되었다)', ['although', 'despite', 'however', 'therefore'], '두 절(The game continued / it rained heavily)을 한 문장으로 잇는 역접 접속사 although를 쓴다.'],
  ['역접', 'The game continued ___ the heavy rain. (심한 비에도 불구하고)', ['despite', 'although', 'however', 'because'], '뒤에 명사구(the heavy rain)가 오므로 전치사 despite(in spite of)를 쓴다.'],
  ['역접', 'despite와 같은 뜻으로, 뒤에 명사구가 오는 전치사구는?', ['in spite of', 'even though', 'on the other hand', 'instead of'], 'despite = in spite of(~에도 불구하고). 둘 다 뒤에 명사(구)가 온다.'],
  ['역접', '어법상 옳은 것은?', ['despite the heavy rain', 'despite of the heavy rain', 'although the heavy rain', 'however the heavy rain'], 'despite는 바로 뒤에 명사구가 온다(of를 붙이지 않는다). in spite of와 헷갈리지 않도록 주의한다.'],
  ['역접', '실제로 비가 많이 왔던 일을 두고 "비가 많이 왔지만"이라고 할 때 알맞은 것은?', ['Even though', 'Even if', 'However', 'Despite'], 'even though는 실제 사실을 두고 "~이지만"이라는 뜻이다. even if는 "만약 ~하더라도"라는 가정이라 이미 일어난 일에는 어울리지 않는다.'],
  ['역접', '역접의 연결사와 접속사 양쪽에 모두 쓰이는 단어는?', ['though', 'however', 'although', 'despite'], 'though는 접속사(비록 ~이지만)로도, 연결사(그래도, 그러나)로도 쓰인다.'],
  // 인과: 길이 막혀서 늦었다
  ['인과', 'The road was blocked. ___, we arrived late. (길이 막혀서 늦었다)', ['Therefore', 'Because', 'Because of', 'Although'], '두 문장 사이에서 결과를 이끄는 연결사 Therefore(Thus)를 쓴다. Because는 접속사, Because of는 전치사구다.'],
  ['인과', 'The road was blocked. We, ___, arrived late. (길이 막혀서 늦었다)', ['thus', 'because', 'due to', 'although'], '결과를 나타내는 연결사 thus는 두 번째 문장 중간에 쉼표와 함께 넣을 수 있다.'],
  ['인과', '___ the road was blocked, we arrived late. (길이 막혀서 늦었다)', ['Because', 'Therefore', 'Due to', 'However'], '뒤에 주어-동사(the road was blocked)가 오므로 인과 접속사 Because(As, Since)를 쓴다.'],
  ['인과', 'We arrived late ___ the road was blocked. (길이 막혀서 늦었다)', ['since', 'due to', 'therefore', 'despite'], '두 절을 이어 원인을 나타내는 접속사 since(because, as)를 쓴다.'],
  ['인과', 'We arrived late ___ the blocked road. (막힌 길 때문에)', ['due to', 'because', 'therefore', 'since'], '뒤에 명사구(the blocked road)가 오므로 전치사구 due to(because of, owing to)를 쓴다.'],
  ['인과', 'because of, due to, owing to의 공통점은?', ['뒤에 명사구가 온다', '뒤에 절이 온다', '문장 맨 앞에만 온다', '등위접속사다'], 'because of · due to · owing to는 전치사(구)라서 뒤에 명사(구)가 온다. 절이 오면 because를 쓴다.'],
  ['인과', 'The road was blocked, ___ we arrived late. (원인, ___ 결과)', ['so', 'for', 'because', 'though'], '원인 다음에 결과를 이을 때는 등위접속사 so를 쓴다. 원인 so 결과.'],
  ['인과', 'We arrived late, ___ the road was blocked. (결과, ___ 원인)', ['for', 'so', 'therefore', 'though'], '결과 다음에 원인을 이을 때는 등위접속사 for를 쓴다. 결과 for 원인.'],
  ['인과', '인과를 나타내는 접속사가 아닌 것은?', ['therefore', 'because', 'since', 'as'], 'because, since, as는 인과 접속사다. therefore는 인과·결과를 나타내는 연결사(부사)다.'],
  ['인과', 'Since the road was blocked, we arrived late. 에서 since의 뜻은?', ['~ 때문에', '~ 이후로', '~하는 동안', '~에도 불구하고'], '여기서 since는 인과 접속사로 "~ 때문에"라는 뜻이다.'],
  // 자주 쓰는 연결사와 접속사
  ['자주 쓰는 연결사와 접속사', '역접을 나타내는 연결사가 아닌 것은?', ['although', 'however', 'nevertheless', 'on the other hand'], '역접 연결사는 however, nevertheless, on the other hand, though다. although는 역접 접속사다.'],
  ['자주 쓰는 연결사와 접속사', 'nevertheless의 뜻은?', ['그럼에도 불구하고', '그러므로', '게다가', '그 후에'], 'nevertheless는 역접 연결사로 "그럼에도 불구하고"라는 뜻이다.'],
  ['자주 쓰는 연결사와 접속사', 'on the other hand의 뜻은?', ['반면에', '게다가', '대신에', '그동안'], 'on the other hand는 역접 연결사로 "반면에"라는 뜻이다.'],
  ['자주 쓰는 연결사와 접속사', '인과·결과를 나타내는 연결사로 짝지은 것은?', ['consequently · as a result', 'moreover · besides', 'instead · otherwise', 'thereafter · meanwhile'], '인과·결과 연결사는 therefore, consequently, thus, as a result다. moreover·besides는 추가, instead·otherwise는 대안, thereafter·meanwhile은 시간이다.'],
  ['자주 쓰는 연결사와 접속사', 'as a result의 뜻은?', ['그 결과', '반면에', '대신에', '그동안'], 'as a result는 인과·결과 연결사로 "그 결과"라는 뜻이다. consequently는 "결과적으로"다.'],
  ['자주 쓰는 연결사와 접속사', '추가를 나타내는 연결사가 아닌 것은?', ['therefore', 'moreover', 'furthermore', 'in addition'], '추가 연결사는 moreover, furthermore, besides, in addition(게다가)이다. therefore는 인과·결과 연결사다.'],
  ['자주 쓰는 연결사와 접속사', '대안을 나타내는 연결사 otherwise의 뜻은?', ['그렇지 않으면', '대신에', '게다가', '그 후에'], '대안 연결사는 instead(대신에), otherwise(그렇지 않으면)다.'],
  ['자주 쓰는 연결사와 접속사', '시간을 나타내는 연결사는?', ['thereafter', 'therefore', 'moreover', 'otherwise'], '시간 연결사는 thereafter(그 후에), meanwhile(그동안, 그 사이에)이다. therefore는 인과·결과 연결사라 헷갈리지 않게 한다.'],
  ['자주 쓰는 연결사와 접속사', 'meanwhile의 뜻은?', ['그동안', '그 후에', '그러므로', '반면에'], 'meanwhile은 시간 연결사로 "그동안, 그 사이에"라는 뜻이다. thereafter는 "그 후에"다.'],
  ['자주 쓰는 연결사와 접속사', '조건을 나타내는 접속사는?', ['unless', 'while', 'since', 'though'], '조건 접속사는 if와 unless다. 조건을 나타내는 연결사는 따로 정리하지 않았다.'],
  ['자주 쓰는 연결사와 접속사', 'unless의 뜻은?', ['~하지 않는 한', '~할 때', '~ 때문에', '~인 반면'], 'unless는 조건 접속사로 "~하지 않는 한"이라는 뜻이다.'],
  ['자주 쓰는 연결사와 접속사', '접속사 while이 나타내는 두 관계 A–B는?', ['역접–시간', '인과–시간', '추가–조건', '대안–역접'], 'while은 역접(~인 반면)과 시간(~하는 동안)을 모두 나타내는 접속사다.'],
  ['자주 쓰는 연결사와 접속사', '접속사 as가 나타내는 두 관계 A–B는?', ['인과–시간', '역접–시간', '추가–인과', '조건–대안'], 'as는 인과(~ 때문에)와 시간(~할 때, ~하는 동안)을 모두 나타내는 접속사다.'],
  ['자주 쓰는 연결사와 접속사', '등위접속사가 아닌 것은?', ['although', 'but', 'yet', 'so'], '등위접속사는 but, yet, so, for, and, or다. although는 문장 맨 앞에도 올 수 있는 종속접속사다.'],
  ['자주 쓰는 연결사와 접속사', '등위접속사(but, yet, so, for, and, or)가 올 수 있는 자리는?', ['문장 중간에만', '문장 맨 앞에만', '문장 끝에만', '어디든 자유롭게'], '등위접속사는 두 절 사이, 즉 문장 중간에만 올 수 있다.'],
  ['자주 쓰는 연결사와 접속사', '대안을 나타내는 접속사 or의 뜻으로 알맞은 것은?', ['그렇지 않으면', '그리고', '그러나', '왜냐하면'], 'or는 대안 접속사로, 명령문 뒤에서 "그렇지 않으면(~하지 않으면)"의 뜻이 된다.'],
];

const directions: Direction[] = ['up', 'left', 'right', 'down'];
export const englishFinalCards: SwipeCard[] = rows.map(([topic, question, choices, explanation], index) => ({
  id: `english-final-${String(index + 1).padStart(3, '0')}`,
  topic, question,
  answers: Object.fromEntries(directions.map((direction, i) => [direction, choices[i]])) as Record<Direction, string>,
  correct: 'up', explanation, sourceNote: NOTE,
}));

export const englishFinalWritten: WrittenQuestion[] = [
  { id: 'english-final-written-001', topic: '연결사와 접속사', question: '연결사와 접속사의 차이를 기본 역할, 필수 성분 여부, 위치의 세 가지로 비교하여 서술하시오.',
    modelAnswer: '연결사와 접속사는 모두 내용 사이의 관계를 나타내지만 문법적 역할이 다르다. 연결사는 문장과 문장 사이의 의미 관계를 나타내는 부사이므로 필수 성분이 아니며, 두 번째 문장 안에서 맨 앞·중간·끝으로 위치를 바꿀 수 있다(예: However, the game continued. / The game, however, continued.). 접속사는 한 문장 안에서 두 쌍의 주어-동사를 연결하는 필수 성분으로, 없으면 문장이 어법적으로 틀린다(예: Although it rained heavily, the game continued.).',
    criteria: ['연결사: 문장과 문장 사이의 의미 관계, 부사', '연결사: 필수 성분 아님, 두 번째 문장 안에서 위치 이동 가능', '접속사: 한 문장 안에서 두 주어-동사를 연결', '접속사: 필수 성분, 없으면 어법상 틀림'], sourceNote: NOTE },
  { id: 'english-final-written-002', topic: '역접', question: '"비가 많이 왔지만 경기가 계속되었다."를 연결사, 접속사, 전치사를 각각 써서 영작하고, 세 표현의 뒤에 오는 말이 어떻게 다른지 서술하시오.',
    modelAnswer: '연결사: It rained heavily. However, the game continued. (The game, however, continued. / The game continued, though.) 접속사: Although it rained heavily, the game continued. (The game continued although it rained heavily.) 전치사: Despite the heavy rain, the game continued. (The game continued in spite of the heavy rain.) 연결사는 두 문장 사이에 쓰여 쉼표로 끊고, 접속사 뒤에는 주어-동사를 갖춘 절이, 전치사 뒤에는 명사구가 온다.',
    criteria: ['연결사: However / though (쉼표와 함께)', '접속사: Although(Though, Even though) + 절', '전치사: Despite / in spite of + 명사구', '뒤에 오는 말: 문장 / 절 / 명사구의 차이'], sourceNote: NOTE },
  { id: 'english-final-written-003', topic: '인과', question: '"길이 막혀서 늦었다."를 연결사, 접속사, 전치사를 각각 써서 영작하고, 등위접속사 so와 for가 원인·결과를 잇는 순서를 서술하시오.',
    modelAnswer: '연결사: The road was blocked. Therefore(Thus), we arrived late. (We, thus, arrived late.) 접속사: Because(As, Since) the road was blocked, we arrived late. (We arrived late because the road was blocked.) 전치사: Because of(Due to, Owing to) the blocked road, we arrived late. 등위접속사는 문장 중간에만 오는데, so는 "원인, so 결과"(The road was blocked, so we arrived late.) 순서로, for는 "결과, for 원인"(We arrived late, for the road was blocked.) 순서로 쓴다.',
    criteria: ['연결사: Therefore / Thus', '접속사: Because / As / Since + 절', '전치사: Because of / Due to / Owing to + 명사구', 'so: 원인 so 결과 / for: 결과 for 원인'], sourceNote: NOTE },
];
