import type { ConceptLesson } from './study-concepts';
import { englishFinalCards, NOTE } from './english-final-cards';

// 기말고사 · 영어(진달래T) 학습지 추가 1번 「연결사와 접속사」를 두 단원으로 정리했다.
// 각 단원의 예시는 같은 단원의 객관식 카드 전부다(카드를 고치면 예시도 같이 바뀐다).
const examplesFor = (topics: string[]) => englishFinalCards
  .filter(card => topics.includes(card.topic))
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: card.sourceNote ?? NOTE }));

const lesson = (id: string, title: string, topicKeys: string[], summary: string, sections: ConceptLesson['sections']): ConceptLesson => ({
  id, deckId: 'english-final', title, summary, sections, topicKeys, sourceNote: NOTE,
  examplesLabel: '문제로 확인', examples: examplesFor(topicKeys),
});

export const englishFinalConcepts: ConceptLesson[] = [
  lesson('english-final-concept-1', '연결사와 접속사 · 같은 상황 두 가지 표현', ['연결사와 접속사', '역접', '인과'],
    '연결사와 접속사는 모두 내용 사이의 관계를 나타내지만 문법적 역할이 다르다. 연결사는 문장과 문장 사이의 부사, 접속사는 한 문장 안에서 두 절을 잇는 필수 성분이다. 뒤에 명사구가 오면 전치사를 쓴다.',
    [
      { heading: '연결사 vs 접속사', table: { columns: ['', '연결사 (Conjunctive Adverb)', '접속사 (Conjunction)'], rows: [
        ['기본 역할', '문장과 문장 사이의 의미 관계를 나타냄', '한 문장 안에서 두 쌍의 주어-동사를 연결함'],
        ['필수 여부', '“부사”이므로 필수 성분이 아님', '필수 성분 (없으면 어법상 틀림)'],
        ['특징', '두 번째 문장 안에서 위치를 바꿀 수 있음 (중간이면 앞뒤 쉼표)', '—'],
      ] } },
      { heading: '역접: 비가 많이 왔지만 경기가 계속되었다', points: [
        '연결사: It rained heavily. However, the game continued. / The game, however, continued. / The game continued, though.',
        '접속사: Although(Though, Even though) it rained heavily, the game continued. / The game continued although it rained heavily.',
        '전치사(+명사구): The game continued despite(in spite of) the heavy rain. / Despite the heavy rain, the game continued.',
        '★ 실제로 일어난 일에는 even though(비록 ~이지만). even if는 “만약 ~하더라도”라는 가정이다.',
        '★ 문장 맨 앞 연결사 자리는 However. though는 연결사(부사)로 쓸 때 문장 중간·끝에 둔다.',
      ] },
      { heading: '인과: 길이 막혀서 늦었다', points: [
        '연결사: The road was blocked. Therefore(Thus), we arrived late. / We, thus, arrived late.',
        '접속사: Because(As, Since) the road was blocked, we arrived late. / We arrived late because the road was blocked.',
        '전치사(+명사구): We arrived late because of(due to, owing to) the blocked road.',
        '등위접속사: 원인, so 결과 / 결과, for 원인',
      ] },
    ]),
  lesson('english-final-concept-2', '자주 쓰는 연결사와 접속사', ['자주 쓰는 연결사와 접속사'],
    '관계별로 대표 연결사와 접속사를 묶어 둔다. 일대일로 대응하는 것은 아니며, 등위접속사(*)는 문장 중간에만 온다.',
    [
      { heading: '관계별 표현', table: { columns: ['관계', '연결사', '접속사'], rows: [
        ['역접', 'however(그러나), nevertheless(그럼에도 불구하고), on the other hand(반면에), though', 'although, though(비록 ~이지만), while(~인 반면), but*, yet*(그러나)'],
        ['인과·결과', 'therefore(그러므로), consequently(결과적으로), thus(따라서), as a result(그 결과)', 'because, since, as(~ 때문에), so*, for*'],
        ['추가', 'moreover, furthermore, besides, in addition(게다가)', 'and*'],
        ['대안', 'instead(대신에), otherwise(그렇지 않으면)', 'or*(그렇지 않으면)'],
        ['시간', 'thereafter(그 후에), meanwhile(그동안, 그 사이에)', 'when(~할 때), while(~하는 동안), before, after, as(~할 때, ~하는 동안)'],
        ['조건', '—', 'if, unless(~하지 않는 한)'],
      ] } },
      { heading: '헷갈리는 것', points: [
        '* 등위접속사(but, yet, so, for, and, or)는 문장 중간에만 올 수 있다',
        'while: 역접(~인 반면)과 시간(~하는 동안) / as: 인과(~ 때문에)와 시간(~할 때)',
        'though는 접속사로도, 연결사로도 쓰인다',
        'therefore(인과·결과) vs thereafter(시간) 철자 주의',
      ] },
    ]),
];
