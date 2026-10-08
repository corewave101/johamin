# 카드 DB (Supabase)

카드를 한 장씩 표로 관리하는 DB입니다. **사이트는 이 DB의 카드를 먼저 읽습니다**(DB에 있는 덱은 DB 카드가 덱 전체를 대신함). 인터넷이 없을 때만 기기에 저장된 DB 사본이나 `data/*.ts`의 내장 카드를 씁니다. 코드에서 카드를 고치면 DB에도 올려야 사이트에 보입니다. 작업 순서는 저장소 맨 위 `AGENTS.md` 3장을 보세요.

**현재 상태:** Supabase 프로젝트(서울, `vlmwrkalgjaduagxavhb`)에 표·권한 규칙이 적용되었고 덱 9개·카드 926장이 들어 있습니다. 앱에서 쓸 주소와 공개 키는 `lib/supabase-config.ts`에 있습니다.

## 물리학Ⅱ 추가 브랜치

`db/physics-release.sql`은 기존 926개 카드 내용을 변경하지 않고 새 물리학Ⅱ 90개 카드만 추가합니다. **DB 반영은 아직 실행하지 않았습니다.** 팀 멤버가 SQL Editor에서 검토·실행한 뒤 PR을 병합해야 합니다. 상세 절차는 `docs/science-study.md`를 보세요.

## 카드 고치기 (지금 방법)

1. supabase.com 로그인 → 프로젝트 → **Table Editor** → `cards`
2. 위쪽 검색·필터(Filter)로 `deck_id = social`, `question` 포함 `노직` 처럼 찾기
3. 칸을 더블클릭해 고치고 저장. 오답 수가 3개가 아니거나 보기가 겹치면 DB가 저장을 거부합니다
4. 바뀐 내용은 `card_history` 표에 자동으로 남습니다

## 파일

| 파일 | 내용 |
|---|---|
| `schema.sql` | 표·권한 규칙·수정 이력. Supabase SQL Editor에서 한 번 실행 |
| `seed.sql` | 지금 있는 카드 전부(덱 9개, 카드 926장). 새 프로젝트에서 `schema.sql` 다음에 실행 |
| `cards.json` | `seed.sql`과 같은 내용을 사람이 읽기 쉽게 정리한 사본 |
| `../scripts/export-cards.cjs` | `data/*.ts`에서 위 두 파일을 다시 만드는 스크립트 |

## 카드 한 장의 규격 (`cards` 표)

| 열 | 뜻 | 예 |
|---|---|---|
| `id` | 카드 번호(고유) | `social-042` |
| `deck_id` | 덱 | `social` |
| `kind` | `choice`(4지선다) / `written`(서술형) | `choice` |
| `topic` | 주제 | `분배적 정의` |
| `badge` | 질문 위 작은 표시 | `박상영T`, `영어` |
| `question` | 질문 | `취득·이전·교정의 원칙을 말한 X. …` |
| `passage` | 함께 보여 줄 지문(영어) | |
| `answer` | 정답(서술형은 모범 답안) | `최소 국가` |
| `wrong` | 오답 3개 | `{복지 국가, 확대 국가, 공화정 연맹}` |
| `criteria` | 서술형 채점 기준 | `{상동염색체 분리, …}` |
| `explanation` | 해설 | |
| `source_label` / `source_page` / `source_slide` / `source_url` | 근거 | `성신제T · 분배적 정의`, 3 |

DB가 저장 전에 검사합니다: 오답은 정확히 3개, 정답·오답 4개가 모두 다름, 보기 40자 이하, 해설 있음, 서술형은 채점 기준 1개 이상.

## 권한

- 카드·덱 읽기: 누구나(로그인 없이)
- 카드·덱 수정: Supabase 대시보드(계정 로그인 필요)에서. 앱에 로그인을 붙이면 `editors` 표의 이메일만 수정 가능 (처음에는 `mungga1111@gmail.com`)
- 편집자 추가: Supabase 대시보드 → Table Editor → `editors` → Insert row (앱에서는 못 바꿈)
- 풀이 기록(`attempts`): 각자 자기 것만 읽고 쓰기
- 카드가 바뀌면 `card_history`에 누가·언제·무엇을 바꿨는지 자동으로 남음

## 새 프로젝트에 다시 만들 때

1. SQL Editor → `schema.sql` 실행
2. SQL Editor → `seed.sql` 실행
3. `lib/supabase-config.ts`의 주소·공개 키 교체 (service_role key는 절대 넣지 말 것)

두 파일 모두 다시 실행해도 표·카드가 중복되지 않습니다(정책 생성 줄은 이미 있으면 에러가 나니 그 부분만 건너뛰세요).
