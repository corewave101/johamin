# 조하민레츠고 작업 가이드 (AI·사람 공용)

이 저장소에서 일하는 사람과 AI는 작업 전에 이 문서를 끝까지 읽는다.
문서와 실제 코드가 다르면 코드를 믿되, 이 문서도 같은 PR에서 고친다.

---

## 0. 절대 규칙 (이것만은 꼭)

1. **main에 직접 push하지 않는다.** 항상 브랜치 → PR → 검사(CI) 통과 → 합치기(merge).
2. **작업 시작 전에 최신 main을 받는다.** (`git fetch` → 최신 main에서 새 브랜치)
3. **카드 내용의 원본은 DB(Supabase)다.** 사이트는 DB 카드를 먼저 읽는다. `data/*.ts`의 카드 문장을 고쳐도 **DB에 반영되기 전까지 사이트에는 안 바뀐다.** (3장 참고)
4. **비밀 키는 절대 커밋하지 않는다.** Supabase `service_role` 키, 비밀번호, 토큰 금지. 저장소에는 공개 키(publishable key)만 있다(`lib/supabase-config.ts`).
5. **버전을 올리면 `CHANGELOG.md` 맨 위에 같은 버전을 쓴다.** 안 쓰면 테스트가 막는다. (4장)
6. **앱의 정체성을 지킨다.** 4방향 카드 넘기기, 모바일 우선, **카드 한 장만 보고 풀 수 있어야 한다**("위 자료에서", "학습지에서" 같은 말 금지).
7. 모르겠거나 되돌리기 어려운 일(DB 대량 수정, 파일 대량 삭제, 기록 지우기)은 **하기 전에 사람에게 묻는다.**

---

## 1. 프로젝트 한눈에

- React 19 + Vite + TypeScript 정적 사이트. 서버 없음.
- 사이트: https://corewave101.github.io/johamin/ — main에 합쳐지면 GitHub Actions(`deploy.yml`)가 자동 배포.
- 오프라인 앱(PWA): `public/sw.js`, `public/manifest.webmanifest`. 빌드 때 `vite.config.ts`가 캐시 목록·버전을 채운다.
- 카드 DB: Supabase 프로젝트 `vlmwrkalgjaduagxavhb`(서울). 표 구조는 `db/README.md`, `db/schema.sql`.

| 폴더·파일 | 내용 |
|---|---|
| `app/` | 시작점 `main.tsx`, CSS(`swipe.css`가 대부분) |
| `components/swipe/` | 화면. `SwipeGame`(문제 카드), `SubjectPicker`(과목 고르기), `SubjectStudy`(개념·문제 메뉴), `ParkStudy`·`ParkVocabulary`(박상영T 전용), `MenuCard`(카드형 메뉴), `OrderDeck`(문장 배치), `BlessingToggle`·`BlessingEditor`(가호) |
| `lib/` | 로직. `card-store.ts`(DB 읽기·캐시), `swipe-game.ts`, `vocabulary.ts`, `theme.ts`, `jumpscare.ts` … |
| `data/` | 코드에 들어 있는 카드(번들). `swipe-subjects.ts`가 과목·덱 목록 |
| `db/` | DB 표 정의와 카드 사본(`cards.json`, `seed.sql`) |
| `scripts/export-cards.cjs` | `data/*.ts` → `db/cards.json`·`db/seed.sql` 생성 |
| `tests/test_*.cjs` | 테스트. 전부 통과해야 합칠 수 있다 |
| `docs/` | 기능별 설명(예: `park-vocabulary.md`) |

---

## 2. 작업 순서 (git)

### 2-1. 시작
```bash
git fetch origin
git switch -c 작업이름 origin/main      # 예: cards/korean-poetry, fix/phone-layout
npm ci                                  # 처음 한 번 또는 package-lock이 바뀌었을 때
```
- 브랜치 이름: `cards/…`(카드), `feat/…`(기능), `fix/…`(버그), `docs/…`(문서).
- **한 브랜치 = 한 가지 일.** 작게 만들고 빨리 합친다. 며칠씩 묵히면 꼬인다.

### 2-2. 작업 중
- 커밋은 자주 해도 된다(브랜치 안에서는 마음대로). 메시지는 무엇을 왜 바꿨는지 한 줄로.
- 다른 사람이 main을 바꿨으면 내 브랜치를 최신으로 맞춘다:
  ```bash
  git fetch origin
  git rebase origin/main      # 충돌 나면 고치고: git add 파일 → git rebase --continue
  ```
- 충돌이 `package.json`·`package-lock.json`의 version이나 `CHANGELOG.md`에서 나면: main 쪽 내용을 살리고, 내 변경을 그 위에 다시 얹는다(버전은 main보다 하나 높게).

### 2-3. 합치기 전 검사 (로컬)
```bash
for t in tests/test_*.cjs; do node "$t" || break; done
npm run build          # 타입 검사(tsc) + 빌드
```
- 화면을 바꿨으면 **PC 크기(1440×900)와 폰 크기(390×844) 둘 다** 직접 눌러 본다. 방향키·스와이프·탭이 모두 되는지도.

### 2-4. PR → 합치기
```bash
git push -u origin 작업이름
```
- GitHub에서 PR을 만든다. PR 설명에: 무엇을 바꿨는지, 화면 변화, **DB 반영이 필요한지(3장)**.
- `Check` 검사(테스트 + 빌드)가 초록불이 되면 합친다. 빨간불이면 합치지 않는다.
- 합치면 main이 자동 배포된다. 합친 브랜치는 지운다.

### 2-5. 꼬였을 때
- 내 컴퓨터 폴더가 이상하면(아직 안 올린 변경을 버려도 될 때):
  ```bash
  git fetch origin
  git reset --hard origin/main
  ```
- 잘못 합쳐진 커밋을 되돌릴 때는 기록을 지우지 말고 **되돌림 커밋**을 만든다: `git revert 커밋번호` → PR.
- **`git push --force`로 main을 덮어쓰지 않는다.**

---

## 3. 카드 작업 (가장 많이 꼬이는 곳)

### 3-1. 구조
- 카드는 두 군데 있다: **DB(`cards` 표)** 와 **코드(`data/*.ts`)**.
- 사이트는 DB를 먼저 읽는다(`lib/card-store.ts`의 `withLiveCards`). **DB에 있는 덱은 DB 카드가 그 덱 전체를 대신한다.** 그래서:
  - 이미 DB에 있는 덱에 코드로 카드를 추가하거나 고쳐도 → **DB에 올리기 전까지 사이트에 안 보인다.**
  - DB에 아직 없는 새 덱 → 코드 카드가 그대로 보인다.
  - 인터넷이 없으면 마지막으로 받은 DB 카드(기기 캐시 `johamin-cards-cache-v1`), 그것도 없으면 코드 카드.
- 그래서 **DB와 코드는 항상 같아야 한다.** 다르면 다음에 누가 내보내기(export)를 할 때 고친 게 사라진다.

### 3-2. 누가 무엇을 하나
- **DB 수정 권한:** 저장소 주인과 공동 작업자(Supabase 조직 팀 멤버, Developer 역할). 둘 다 Supabase 대시보드(Table Editor)나, 각자 로그인한 AI의 Supabase 연결로 DB를 고칠 수 있다. `service_role` 키는 어디에도 붙여 넣지 않는다.
- **카드를 고치는 작업은 DB와 코드를 같은 작업에서 둘 다 고친다.** 한쪽만 고치면 다음 export 때 사라지거나 사이트에 안 보인다.
- 순서:
  1. 최신 main에서 브랜치를 만들고 `data/*.ts`의 카드를 쓰거나 고친다(아래 3-3 규격).
  2. `node scripts/export-cards.cjs` 실행 → `db/cards.json`·`db/seed.sql` 갱신(이 파일들도 커밋). 테스트를 돌린다.
  3. PR을 만든다. 설명에 **바뀐 카드 id(또는 덱)** 와 **DB 반영 여부**를 적는다.
  4. 검사가 초록불이면, 합치기 직전에 **같은 내용을 DB에 반영**한다(대시보드에서 고치거나 AI가 `db/cards.json`의 해당 카드로 UPDATE/INSERT). 반영 후 PR에 "DB 반영 완료"를 남기고 합친다.
- 대시보드에서 먼저 급하게 고쳤다면: 같은 날 `data/*.ts`에도 똑같이 고치고 export를 다시 돌려 PR로 올린다.
- **같은 덱을 동시에 고치지 않게** 시작 전에 서로 말한다(어느 덱·어느 카드).
- 카드 여러 장을 한꺼번에 지우거나 덮어쓰는 DB 작업은 하기 전에 상대에게 묻는다.
- DB가 바뀐 기록은 `card_history` 표에 자동으로 남는다(누가·언제·무엇을). 잘못 고친 건 거기서 되살린다.
- 확인 방법: DB 카드와 `db/cards.json`이 같은지 비교한다(주인의 AI에게 "DB랑 코드 비교해 줘"라고 하면 된다).

### 3-3. 카드 규격
객관식(`SwipeCard`, `data/swipe-cards.ts`):
```ts
{
  id: 'social-210',               // 덱이름-번호. 한번 정하면 바꾸지 않는다(풀이 기록이 id로 저장됨)
  topic: '사회 불평등',            // 단원. 개념 파트·단원 고르기와 연결
  subject: '부·권력·명예',         // 카드 위 큰 줄(선택)
  question: '…현상 X. X가 심해지면?',
  answers: { up: '…', left: '…', right: '…', down: '…' },
  correct: 'right',               // 정답 방향. 덱 안에서 정답 방향이 한쪽에 몰리지 않게 섞는다
  explanation: '…',               // 해설(필수)
  sourceNote: '성신제T 학습지 212 · 2쪽',  // 근거
}
```
서술형(`WrittenQuestion`, `data/biology-written.ts`): `id, topic, question, modelAnswer, criteria(채점 기준 1개 이상), sourceNote`.

DB와 테스트가 검사하는 것(어기면 저장·합치기가 막힌다):
- 오답은 정확히 3개, 보기 4개가 모두 서로 다름. 보기는 40자 이하(덱마다 테스트가 더 짧게 제한하기도 함: 예 사회 26자).
- 해설 필수(대략 16자 이상). 질문 길이 제한은 덱 테스트(`tests/test_*cards*.cjs`, `test_study_content.cjs`)를 따른다.
- id는 덱 안에서 고유.

내용 원칙:
- **카드 한 장만 보고 풀 수 있게.** "위 그림", "학습지에서", "앞 문제" 금지. 필요한 조건은 질문에 다 넣는다.
- 오답도 그럴듯하게(뻔한 오답 금지). 정답만 혼자 길거나 튀지 않게.
- 근거(`sourceNote`)는 실제 자료 이름과 쪽. 자료에 없는 내용을 지어내지 않는다.
- 문장은 자연스러운 한국어. 해설은 "~다"체.
- 박상영T 원문 단어장(`data/park-vocabulary.ts`)의 정의는 **교사용 정답지 문구 그대로**. 핵심어(`keywords`)와 조각(`pieces`)을 바꾸면 테스트가 정의와 맞는지 검사한다.

---

## 4. 버전과 업데이트 기록

- 버전은 `package.json`의 `version`(화면 오른쪽 아래에 표시). `주.부.수` — 큰 기능 묶음은 부 버전, 작은 수정은 수 버전.
- 버전을 올리는 PR에서 `package.json`과 `package-lock.json`(맨 위 두 곳)을 같이 바꾸고, `CHANGELOG.md` 맨 위에 추가한다:
  ```md
  ## 3.2.2 — 2026-10-09

  - 사용자가 알아볼 수 있는 말로 바뀐 점 한 줄씩
    - 필요하면 들여쓴 하위 항목
  ```
- 화면 오른쪽 아래 버전을 누르면 이 기록이 그대로 보인다. **사용자가 읽는 글**이니 쉬운 한국어로, 코드 이름 대신 화면에 보이는 이름으로 쓴다.
- `tests/test_changelog.cjs`가 "CHANGELOG 맨 위 버전 = package.json 버전"을 검사한다.
- 문서·테스트만 바꾼 PR은 버전을 안 올려도 된다.

---

## 5. 코드 규칙

- 기존 스타일을 따른다. 새 라이브러리는 꼭 필요할 때만(추가하면 PR에 이유).
- **입력 방식 통일:** 메뉴·문제는 방향키 = 카드 밀기 = 버튼 누르기가 같은 동작. ↓는 메뉴에서 "뒤로", Esc도 뒤로. 새 메뉴는 `MenuCard`를 쓴다. 마우스로만 되는 기능을 새로 만들지 않는다.
- 모바일 우선. 폰(390px)에서 글자가 잘리거나 버튼이 겹치지 않는지 확인.
- 화면 문구는 존댓말 "~요"체, 짧게.
- 색은 하드코딩 대신 가호 색 변수(`--theme-base`, `--theme-soft`, `--theme-ink` …)를 쓴다. 가호(하민/없음/다른 가호) 세 가지에서 다 보기 좋은지 확인.
- 기기에 저장하는 값(`localStorage`)은 키 이름에 `johamin-` 접두사, 구조를 바꾸면 키에 버전(`-v2`)을 올린다. 사용자의 기록을 지우는 변경은 금지.
- 내려받기 파일 이름은 영어(ASCII). 한글 이름은 일부 크롬에서 "download"로 바뀐다.
- 갑툭튀(하민의 가호)·가호 기능은 앱의 개성이다. 함부로 없애지 않는다.

---

## 6. 하지 말 것

- main에 직접 push, `--force` push
- 비밀 키 커밋, `.env`에 비밀 값 넣고 커밋
- 코드 카드만 고치고 DB는 그대로 두기, 또는 DB만 고치고 코드는 그대로 두기(3장)
- 카드 id 바꾸기·재사용하기
- 원문 정의·근거 자료 내용을 지어내기
- 테스트를 통과시키려고 테스트를 지우거나 느슨하게 고치기(정말 규칙이 바뀐 거면 PR에 이유를 쓴다)
- 남이 작업 중인 파일을 통째로 다시 쓰기(부분만 고치기)

---

## 7. 자주 쓰는 명령

```bash
npm ci                                   # 의존성 설치
npm run dev                              # 로컬 실행 (http://127.0.0.1:5175)
for t in tests/test_*.cjs; do node "$t" || break; done   # 테스트 전부
npm run build                            # 타입 검사 + 빌드
node scripts/export-cards.cjs            # 카드 → db/cards.json, db/seed.sql
```
