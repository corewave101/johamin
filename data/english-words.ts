import type { Direction, SwipeCard } from './swipe-cards';

// 영어 단어 문제: 영어 학습지 1~4(Dalia Jin) 오른쪽 아래 검은 필기 "(영단어): 뜻"으로 만든 4지선다.
// 카드에 영단어(큰 글씨)와 그 단어가 쓰인 본문 구절을 보여 주고, 본문 속 뜻 + 품사를 함께 고른다.
// 필기에는 품사가 없어서 본문에서 실제로 쓰인 품사로 정했다. 보기 = 정답 + 품사·철자 함정 1개 + 같은 단원 같은 품사의 다른 단어 뜻 2개.
// 필기를 사실에 맞게 고친 단어는 review 메모(☆)에 남긴다. id는 행 순서대로 붙으니 새 단어는 맨 뒤에만 덧붙인다.

type WordRow = [word: string, pos: Pos, meaning: string, trap: string, context: string, unit: 1 | 2 | 3 | 4, page: number, review?: string];
type Pos = '명' | '동' | '형' | '부' | '전' | '접' | '숙어';

export const englishWordUnits = ['단어 1 · 고대 건축물', '단어 2 · Bartleby ①', '단어 3 · Bartleby ②', '단어 4 · 9월 학력평가'] as const;
const unitSource = ['학습지1', '학습지2', '학습지3', '학습지4'];
const posName: Record<Pos, string> = { 명: '명사', 동: '동사', 형: '형용사', 부: '부사', 전: '전치사', 접: '접속사', 숙어: '숙어' };

// context: 본문 구절(그대로 따옴). '!'로 시작하면 본문에 없는 필기 단어라 질문을 직접 쓴다.
const rows: WordRow[] = [
  // ── 학습지1 · 1쪽 Chichén Itzá ─────────────────────────────
  ['knowledgeable', '형', '아는 것이 많은, 박식한', '(명) 지식', 'the Mayans were knowledgeable astronomers', 1, 1],
  ['archaeologist', '명', '고고학자', '(형) 고고학의', 'Archaeologists have found bones, jewelry', 1, 1],
  ['sacrifice', '명', '제물, 희생', '(동) 희생하다', 'the Mayans made human sacrifices to a rain god', 1, 1],
  ['religious', '형', '종교적인', '(명) 종교', 'both an advanced city center and a religious site', 1, 1],
  ['advanced', '형', '발전된, 앞선', '(동) 발전하다', 'both an advanced city center and a religious site', 1, 1],
  ['temple', '명', '신전', '(형) 신성한', 'Made of stepped pyramids, temples, and other stone structures', 1, 1],
  ['destination', '명', '목적지', '(동) ~로 향하다', 'one of Mexico’s most visited tourist destinations', 1, 1],
  ['equinox', '명', '분점(밤낮의 길이가 같은 때)', '(명) 하지와 동지', 'On the spring and autumn equinoxes each year', 1, 1],
  ['carved', '형', '조각된, 새겨진', '(동) 조각하다', 'eventually join a carved snake head', 1, 1],
  ['join', '동', '합쳐지다, 이어지다', '(명) 가입', 'this shadowy snake goes down the steps to eventually join a carved snake head', 1, 1],
  ['wheel', '명', '바퀴', '(동) 굴러가다', 'they worked without wheels or metal tools', 1, 1, '필기 "수레" → wheel은 "바퀴"(수레바퀴)라 바퀴로 고침'],
  ['base', '명', '토대, 기초', '(형) 기본적인', 'Mayan workers created a base', 1, 1],
  ['level', '명', '층, 단계', '(형) 평평한', 'added smaller and smaller levels as the structure rose', 1, 1],
  ['rose', '동', '올라갔다(rise의 과거형)', '(명) 장미', 'added smaller and smaller levels as the structure rose', 1, 1],
  ['took', '동', '(시간이) 걸렸다(take의 과거형)', '(동) 데려갔다', 'Some pyramids took hundreds of years to complete', 1, 1],
  // ── 학습지1 · 2쪽 Göbekli Tepe ─────────────────────────────
  ['cathedral', '명', '대성당', '(형) 성스러운', 'as though Göbekli Tepe were a cathedral', 1, 2],
  ['container', '명', '용기, 그릇', '(동) 담다, 포함하다', 'with stone containers large enough to hold more than 150 liters', 1, 2],
  ['carving', '명', '조각품, 새긴 무늬', '(형) 조각된', 'Many pillars are covered with carvings of animals', 1, 2],
  ['in height', '숙어', '높이가 (~인)', '(숙어) 무게가 (~인)', 'The tallest pillars are 5.5 meters in height', 1, 2],
  ['weigh', '동', '무게가 ~나가다', '(명) 무게', 'weigh more than 14,500 kilograms', 1, 2],
  ['at the time', '숙어', '그 때(에)', '(숙어) 동시에', 'At the time that Göbekli Tepe was built, there was no writing system', 1, 2],
  ['writing system', '명', '문자 체계', '(명) 작문 실력', 'there was no writing system, and people did not use metal', 1, 2],
  ['shape', '동', '(모양을) 다듬다, 가공하다', '(명) 모양, 형태', 'the builders were able to cut, shape, and transport 16-ton stones', 1, 2],
  ['transport', '동', '운송하다, 나르다', '(명) 교통수단', 'the builders were able to cut, shape, and transport 16-ton stones', 1, 2],
  ['debate', '동', '논의하다, 토론하다(= discuss)', '(명) 토론', 'Archaeologists are still debating the purpose of Göbekli Tepe', 1, 2],
  ['excavate', '동', '발굴하다', '(명) 발굴', 'the archaeologist who originally excavated the site', 1, 2],
  ['put ~ in place', '숙어', '제자리에 두다(세우다)', '(숙어) ~을 대신하여', 'workers carved and put the pillars in place', 1, 2],
  ['represent', '동', '나타내다, 상징하다', '(명) 대표자', 'the T-shaped pillars represent human beings', 1, 2],
  ['ceremony', '명', '의식, 의례', '(형) 격식을 차리는', 'perhaps represent a religious ceremony', 1, 2],
  ['feast', '명', '연회, 잔치', '(동) 단식하다', 'large feasts took place at the site', 1, 2],
  ['take place', '숙어', '일어나다, 열리다(= happen, occur)', '(숙어) 자리를 차지하다', 'large feasts took place at the site', 1, 2],
  // ── 학습지1 · 3쪽 Machu Picchu ─────────────────────────────
  ['guide', '동', '안내하다', '(명) 안내인', 'after local people guided him there', 1, 3],
  ['breathtaking', '형', '숨이 멎을 듯한', '(명) 호흡', 'beautiful stone buildings and breathtaking mountain views', 1, 3],
  ['abandon', '동', '버리다, 떠나다', '(명) 포기', 'why the city was built and why it was later abandoned', 1, 3],
  ['rule', '명', '통치, 지배', '(동) 다스리다', 'during the rule of the Inca emperor Pachacuti', 1, 3],
  ['noble', '명', '귀족', '(형) 고귀한', 'home to nobles, priests, and skilled workers', 1, 3],
  ['priest', '명', '성직자', '(형) 경건한', 'home to nobles, priests, and skilled workers', 1, 3],
  ['crop', '명', '농작물', '(동) 잘라 내다', 'People grew crops on stone terraces', 1, 3],
  ['terrace', '명', '계단식 논밭', '(동) 평평하게 하다', 'People grew crops on stone terraces that covered the mountainside', 1, 3],
  ['canal', '명', '수로, 운하', '(형) 운반하는', 'a system of carefully planned canals and fountains', 1, 3],
  ['fountain', '명', '분수, 샘', '(동) 솟아오르다', 'a system of carefully planned canals and fountains', 1, 3],
  ['stonework', '명', '석조 기술, 석조물', '(형) 돌로 된', 'One of the most impressive features of Machu Picchu is its stonework', 1, 3],
  ['impressive', '형', '인상적인', '(명) 인상', 'One of the most impressive features of Machu Picchu', 1, 3],
  ['mortar', '명', '모르타르, 회반죽', '(명) 벽돌', 'they fit together without mortar', 1, 3, '필기에 뜻이 비어 있어 사전 뜻(모르타르, 회반죽)으로 채움'],
  // ── 학습지2 · 1쪽 배경 ─────────────────────────────────────
  ['isolation', '명', '고립, 소외', '(형) 고립된', 'The psychological isolation in the middle of the "forest of buildings"', 2, 1],
  ['erosion', '명', '침식, 부식', '(동) 침식하다', 'Representing the erosion of humanity', 2, 1],
  ['harsh', '형', '가혹한, 혹독한', '(부) 가혹하게', 'harsh criticism from experts', 2, 1],
  ['reflect', '동', '반영하다', '(명) 반영', 'The story reflects the author’s own sad desire', 2, 1],
  ['demand', '명', '요구', '(동) 요구하다', 'to refuse to follow the demands of the world', 2, 1],
  ['finance', '명', '금융', '(형) 금융의', 'The heart of global finance', 2, 1],
  // ── 학습지2 · 2쪽 본문 ─────────────────────────────────────
  ['intact', '형', '온전한, 손상되지 않은', '(명) 손상', 'private enough to keep his quiet nature intact', 2, 2],
  ['nature', '명', '성격, 본성', '(형) 자연스러운', 'private enough to keep his quiet nature intact', 2, 2],
  ['private', '형', '사적인, 남의 눈에 띄지 않는', '(명) 사생활', 'private enough to keep his quiet nature intact', 2, 2],
  ['forlorn', '형', '쓸쓸한, 버림받은', '(부) 쓸쓸하게', 'pitiably respectable, and incurably forlorn', 2, 2],
  ['incurably', '부', '어찌할 수 없을 만큼', '(형) 치료할 수 없는', 'pitiably respectable, and incurably forlorn', 2, 2],
  ['respectable', '형', '존경할 만한, 점잖은', '(형) 공손한', 'He was pallidly neat, pitiably respectable', 2, 2],
  ['pitiably', '부', '불쌍할 정도로', '(형) 불쌍한', 'He was pallidly neat, pitiably respectable', 2, 2],
  ['neat', '형', '깔끔한', '(부) 깔끔하게', 'He was pallidly neat, pitiably respectable', 2, 2],
  ['pallidly', '부', '창백하게', '(형) 창백한', 'He was pallidly neat, pitiably respectable', 2, 2],
  ['threshold', '명', '문턱, 문간', '(동) 넘어서다', 'a young man appeared on my office threshold one morning', 2, 2],
  ['duty', '명', '임무, 할 일', '(형) 의무적인', 'whose most important duty was to buy apples and ginger nuts', 2, 2],
  ['errand', '명', '심부름', '(동) 실수하다', 'my twelve-year-old errand boy', 2, 2],
  ['functional', '형', '제대로 돌아가는, 기능을 하는', '(명) 기능', 'Between them, I had a functional office', 2, 2],
  ['irritable', '형', '짜증을 잘 내는', '(동) 짜증 나게 하다', 'He was nervous and irritable in the morning', 2, 2],
  ['nervous', '형', '불안해하는, 신경이 날카로운', '(명) 신경', 'He was nervous and irritable in the morning', 2, 2],
  ['on the other hand', '숙어', '반면에', '(숙어) 게다가', 'Nippers, on the other hand, was a victim of ambition', 2, 2],
  ['messy', '형', '지저분한, 엉망인', '(명) 엉망인 상태', 'energetic but reckless and messy with his ink', 2, 2],
  ['reckless', '형', '무모한(≒ careless)', '(부) 무모하게', 'energetic but reckless and messy with his ink', 2, 2],
  ['energetic', '형', '활기찬', '(명) 에너지', 'he became energetic but reckless', 2, 2],
  ['everlasting', '형', '영원히 계속되는', '(부) 영원히', 'black by age and everlasting shade', 2, 2],
  ['lofty', '형', '높은, 우뚝 솟은', '(명) 다락방', 'an unobstructed view of a lofty brick wall', 2, 2],
  ['unobstructed', '형', '막힌 데 없는', '(동) 가로막다', 'my windows commanded an unobstructed view', 2, 2],
  ['shaft', '명', '(채광·환기용) 수직 통로', '(형) 비스듬한', 'the white wall of the interior of a spacious sky-light shaft', 2, 2],
  ['passage', '명', '(글의) 구절, 단락', '(동) 지나가다', 'for a few passages from the life of Bartleby', 2, 2],
  ['biography', '명', '전기(한 사람의 일생 기록)', '(형) 생물학의', 'I’ll leave out the biographies of all other scriveners', 2, 2],
  ['leave out', '숙어', '생략하다, 빼다', '(숙어) ~로 떠나다', 'I’ll leave out the biographies of all other scriveners', 2, 2],
  ['weep', '동', '울다, 눈물을 흘리다', '(형) 슬픈', 'stories that might make you smile or weep', 2, 2, '필기 "울게 하다" → weep은 "울다". "울게 하다"는 make you weep 전체의 뜻이라 고침'],
  // ── 학습지3 · 1쪽 거절과 갈등 ─────────────────────────────
  ['dead', '형', '막다른, 생기 없는', '(명) 죽음', 'staring out the window at the dead brick wall', 3, 1],
  ['stare', '동', '빤히 쳐다보다', '(명) 계단', 'staring out the window at the dead brick wall', 3, 1],
  ['altogether', '부', '완전히(= completely)', '(부) 다 함께', 'he had stopped writing altogether', 3, 1],
  ['bizarre', '형', '기이한, 별난', '(명) 시장, 바자회', 'the situation grew more bizarre', 3, 1],
  ['paralyze', '동', '마비시키다', '(명) 마비', 'his calmness fascinated and paralyzed me', 3, 1],
  ['fascinate', '동', '매혹하다, 사로잡다', '(형) 매혹적인', 'his calmness fascinated and paralyzed me', 3, 1],
  ['impatience', '명', '조급함, 성급함', '(형) 참을성 없는', 'no sign of anger, impatience, or rudeness in his face', 3, 1],
  ['patient', '형', '참을성 있는', '(명) 조급함', '!impatience의 반대말로 필기한 patient의 뜻과 품사는?', 3, 1, '필기 "인내심"(명사처럼 적음) → patient는 형용사 "참을성 있는". 인내심(명사)은 patience'],
  ['sign', '명', '기색, 징후', '(동) 서명하다', 'There was no sign of anger, impatience, or rudeness', 3, 1],
  ['deceive', '동', '속이다', '(명) 속임수', 'I thought my ears had deceived me', 3, 1],
  ['stunned', '형', '어안이 벙벙한, 깜짝 놀란', '(동) 기절시키다', 'I sat in stunned silence', 3, 1],
  ['firm', '형', '단호한, 확고한', '(명) 회사', 'Bartleby replied in a unusually gentle and firm voice', 3, 1],
  ['unusually', '부', '평소와 달리, 유난히', '(형) 특이한', 'Bartleby replied in a unusually gentle and firm voice', 3, 1],
  ['routine', '명', '(판에 박힌) 일상', '(부) 정기적으로', 'the first crack appeared in this routine', 3, 1],
  ['cheerfully', '부', '즐겁게, 기꺼이', '(형) 쾌활한', 'if he had worked cheerfully', 3, 1],
  ['eagerly', '부', '열심히, 간절히', '(형) 열망하는', 'he eagerly copied my documents', 3, 1],
  ['famishing', '형', '굶주린', '(명) 기근', 'As if long famishing for something to copy', 3, 1],
  ['famine', '명', '기근', '(형) 굶주린', '!famishing(굶주린) 옆에 필기한 famine의 뜻과 품사는?', 3, 1],
  ['as if', '접', '마치 ~인 것처럼(= as though)', '(접) ~하는 한', 'As if long famishing for something to copy', 3, 1],
  ['extraordinary', '형', '엄청난, 비범한', '(형) 평범한', 'Bartleby did an extraordinary amount of writing', 3, 1],
  // ── 학습지3 · 2쪽 연민과 결단 ─────────────────────────────
  ['particular', '형', '까다로운', '(명) 세부 사항', '“I would prefer not to. I am not particular,” he said.', 3, 2],
  ['scandal', '명', '추문, 스캔들', '(형) 수치스러운', 'To avoid a public scandal, I went back', 3, 2],
  ['disturbed', '형', '불안해하는, 동요한', '(명) 방해', 'Everyone was disturbed.', 3, 2],
  ['tenant', '명', '세입자', '(명) 집주인', 'the new tenant of my old office came to me', 3, 2],
  ['measure', '명', '조치, 대책', '(동) 측정하다', 'I decided on an extreme measure', 3, 2],
  ['helpless', '형', '무력한', '(명) 도움', 'unable to throw this pale, helpless man into the street', 3, 2],
  ['fixture', '명', '붙박이 가구(늘 그 자리에 있는 것)', '(동) 고치다', 'why I kept such a ‘useless fixture’ in my office', 3, 2],
  ['as long as', '접', '~하는 한', '(숙어) ~에 관한 한', 'as long as he remained in my office, he was my responsibility', 3, 2],
  ['lie', '동', '(그대로) 놓여 있다', '(명) 거짓말', 'I offered him money; he let it lie on the table', 3, 2],
  ['before', '전', '~ 앞에서', '(부) 이전에', 'my authority was slowly fading before a man who did nothing', 3, 2],
  ['authority', '명', '권위, 권한', '(형) 권위적인', 'my authority was slowly fading', 3, 2],
  ['plague', '명', '전염병', '(동) 괴롭히다', 'His passive resistance was like a quiet plague', 3, 2],
  ['presence', '명', '존재(감)', '(형) 현재의', 'His presence began to affect the atmosphere of the office', 3, 2],
  ['dread', '명', '(지속적인) 두려움', '(형) 끔찍한', 'pity soon turned to a sense of dread', 3, 2],
  ['district', '명', '구역, 지구', '(형) 뚜렷한', 'the total silence of the empty business district', 3, 2],
  ['basin', '명', '(세면용) 대야', '(명) 지하실', 'washed his face in a small basin', 3, 2],
  ['pity', '명', '연민, 동정', '(형) 불쌍한', 'Sometimes I felt a deep, melancholy pity', 3, 2],
  ['melancholy', '형', '우울한, 구슬픈', '(부) 우울하게', 'Sometimes I felt a deep, melancholy pity', 3, 2],
  // ── 학습지3 · 3쪽 결말 ─────────────────────────────────────
  ['reverie', '명', '몽상, 공상', '(형) 경건한', 'his ‘dead-wall reveries.’', 3, 3],
  ['destined', '형', '~할 운명인', '(명) 목적지', 'These letters, intended for life, were destined for the flames.', 3, 3],
  ['subordinate', '형', '하위의, 하급의', '(형) 상급의', 'Bartleby had been a subordinate clerk in the Dead Letter Office', 3, 3],
  ['courtyard', '명', '안마당, 뜰', '(명) 법정', 'he was standing alone in a quiet courtyard', 3, 3, '필기는 court(마당)로 적음 → 본문 낱말 courtyard(안마당)로 출제'],
  // ── 학습지4 · 1쪽 예술과 모방 (33번) ─────────────────────
  ['regardless of', '숙어', '~와 관계없이', '(숙어) ~에 관해서는', 'proves art is universal regardless of time period', 4, 1],
  ['universal', '형', '보편적인', '(명) 우주', 'proves art is universal regardless of time period', 4, 1],
  ['criticize', '동', '비판하다', '(명) 비평가', 'cannot be criticized as much as modern art', 4, 1],
  ['prefer', '동', '선호하다(prefer A to B: B보다 A를 선호하다)', '(명) 선호', 'is historically preferred to abstract art', 4, 1],
  ['demonstrate', '동', '입증하다, 보여 주다', '(명) 시위', 'thus demonstrating that the ancient Greek view of art', 4, 1],
  ['thus', '부', '그러므로, 따라서', '(접) 그러나', 'thus demonstrating that the ancient Greek view of art', 4, 1],
  ['passage', '명', '(그림의) 부분, 구획', '(동) 통과하다', 'avoid making marks or passages that resembled recognizable objects', 4, 1],
  ['mark', '명', '표시, 자국', '(형) 뚜렷한', 'avoid making marks or passages that resembled recognizable objects', 4, 1],
  ['fellow', '형', '동료의', '(동) 따르다', 'Pollock and his fellow artists would consciously avoid', 4, 1, '필기 "동료"(명사) → 본문은 명사 artists 앞에서 꾸미는 "동료의"(형용사)'],
  ['school', '명', '(예술·학문의) 파, 유파', '(형) 학문적인', 'a leader in the New York School of the 1950’s', 4, 1],
  ['though', '부', '그렇지만, 하지만(= however)', '(접) 비록 ~이지만', 'This definition of art as copying reality has a problem, though.', 4, 1],
  ['obvious', '형', '명백한, 뚜렷한', '(부) 분명히', 'the obvious skill in ancient Greek sculpture', 4, 1],
  ['tale', '명', '이야기', '(명) 꼬리', 'based on tales such as that of Zeuxis and Parhassios', 4, 1],
  ['surmise', '동', '짐작하다, 추측하다', '(명) 놀람', 'We can only surmise their quality', 4, 1],
  ['note', '동', '주목하다, 언급하다', '(형) 눈에 띄는', 'We must sadly note that, due to the action of time and weather', 4, 1],
  ['notable', '형', '눈에 띄는, 주목할 만한', '(명) 주목', '!note(주목하다) 옆에 필기한 notable의 뜻과 품사는?', 4, 1],
  ['pottery', '명', '도자기', '(명) 시', 'the realism of ancient Greek sculpture and pottery', 4, 1],
  ['sculpture', '명', '조각(상)', '(형) 조각 같은', 'the realism of ancient Greek sculpture and pottery', 4, 1],
  ['realism', '명', '사실주의', '(형) 현실적인', 'This approach appears in the realism of ancient Greek sculpture', 4, 1, '필기 "현실주의" → 미술에서 realism은 "사실주의"라 고침'],
  ['goal', '명', '목표(= objective)', '(형) 객관적인', 'the visual artist’s goal was to copy visual experience', 4, 1],
  ['visual artist', '명', '시각 예술가(화가, 조각가)', '(명) 미술 평론가', 'the visual artist’s goal was to copy visual experience', 4, 1],
  // ── 학습지4 · 2쪽 측정의 일관성 (38번) ───────────────────
  ['disagreement', '명', '(의견) 불일치', '(동) 동의하지 않다', 'Imagine a disagreement over trade or tribute', 4, 2],
  ['settlement', '명', '정착지, 마을', '(동) 정착하다', 'no more widely than a single settlement', 4, 2],
  ['reliable', '형', '믿을 수 있는(= dependable)', '(동) 의지하다', 'individual units need reliable definitions', 4, 2],
  ['as with', '숙어', '~와 마찬가지로, ~처럼', '(숙어) ~와 함께', 'just as with words, individual units need reliable definitions', 4, 2],
  ['then', '부', '그러면, 그렇다면', '(접) ~보다', 'if measurement is another sort of language, then just as with words', 4, 2],
  ['subjective', '형', '주관적인', '(형) 객관적인', 'Subjective measures contain useful knowledge', 4, 2],
  ['objective', '형', '객관적인', '(형) 주관적인', '!subjective(주관적인)의 반대말로 필기한 objective의 뜻과 품사는?', 4, 2],
  ['consistency', '명', '일관성', '(형) 일관된', 'we need some degree of consistency', 4, 2, '필기는 consistent(일관적인)로 적음 → 본문 낱말 consistency(일관성)로 출제'],
  ['degree', '명', '정도', '(형) 점진적인', 'we need some degree of consistency', 4, 2],
  ['evident', '형', '명백한, 분명한', '(명) 증거', 'the inadequacies of this system would become evident', 4, 2],
  ['inadequacy', '명', '부적절함, 불충분함', '(형) 부적절한', 'the inadequacies of this system would become evident', 4, 2],
  ['adequacy', '명', '적절성', '(형) 적절한', '!inadequacy(부적절함)의 반대말로 필기한 adequacy의 뜻과 품사는?', 4, 2],
  ['adequate', '형', '적절한, 충분한', '(명) 적절성', '!adequacy 아래에 필기한 adequate의 뜻과 품사는?', 4, 2],
];

const label = (pos: Pos, meaning: string) => `(${pos}) ${meaning}`;
const directions: Direction[] = ['up', 'left', 'right', 'down'];
// 같은 단원·같은 품사에서 정답과 겹치지 않는 다른 단어 뜻 2개를 고른다(행 번호로 고정해 매번 같은 카드).
function others(index: number): string[] {
  const [word, pos, meaning, trap, , unit] = rows[index];
  const taken = new Set([label(pos, meaning), trap]);
  const head = (text: string) => text.split(/[,(]/)[0];
  const fits = (r: WordRow) => r[0] !== word && !taken.has(label(r[1], r[2])) && head(r[2]) !== head(meaning);
  // 같은 단원·같은 품사 → 다른 단원·같은 품사 → 같은 단원·다른 품사 순서로 채운다.
  const tiers = [rows.filter(r => r[5] === unit && r[1] === pos), rows.filter(r => r[5] !== unit && r[1] === pos), rows.filter(r => r[5] === unit)];
  const picked: string[] = [];
  for (const tier of tiers) {
    const pool = tier.filter(fits);
    for (let k = 0; picked.length < 2 && k < pool.length; k++) {
      const r = pool[(index * 7 + k) % pool.length];
      const option = label(r[1], r[2]);
      if (!taken.has(option)) { taken.add(option); picked.push(option); }
    }
  }
  return picked;
}

export const englishWordCards: SwipeCard[] = rows.map((row, index) => {
  const [word, pos, meaning, trap, context, unit, page, review] = row;
  const custom = context.startsWith('!');
  const [a, b] = others(index);
  return {
    id: `english-word-${String(index + 1).padStart(3, '0')}`,
    topic: englishWordUnits[unit - 1], subject: word,
    question: custom ? context.slice(1) : `“${context}” 속 뜻과 품사는?`,
    answers: Object.fromEntries(directions.map((direction, i) => [direction, [label(pos, meaning), trap, a, b][i]])) as Record<Direction, string>,
    correct: 'up' as Direction,
    explanation: (custom ? `${word}: ${posName[pos]} "${meaning}"의 뜻이다.` : `${word}: 본문에서 ${posName[pos]} "${meaning}"의 뜻으로 쓰였다.`) + (review ? ` (☆ ${review})` : ''),
    sourceNote: `영어 ${unitSource[unit - 1]} · ${page}쪽 단어 필기`,
  };
});

export const isEnglishWordCard = (card: { id: string }) => card.id.startsWith('english-word-');

/** 검토용: 필기를 고쳐 출제한 단어(☆). */
export const englishWordReview: Record<string, string> = Object.fromEntries(rows.flatMap((row, index) => row[7] ? [[englishWordCards[index].id, row[7]]] : []));
