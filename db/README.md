# 카드 DB (Supabase)

카드를 한 장씩 표로 관리하기 위한 준비물입니다. 아직 앱은 DB를 읽지 않고 `data/*.ts`의 내장 카드를 씁니다.

## 파일

| 파일 | 내용 |
|---|---|
| `schema.sql` | 표·권한 규칙·수정 이력. Supabase SQL Editor에서 한 번 실행 |
| `seed.sql` | 지금 있는 카드 전부(덱 7개, 카드 496장). `schema.sql` 다음에 실행 |
| `cards.json` | `seed.sql`과 같은 내용을 사람이 읽기 쉽게 정리한 사본 |
| `../scripts/export-cards.cjs` | `data/*.ts`에서 위 두 파일을 다시 만드는 스크립트 |

## 카드 한 장의 규격 (`cards` 표)

| 열 | 뜻 | 예 |
|---|---|---|
| `id` | 카드 번호(고유) | `social-042` |
| `deck_id` | 덱 | `social` |
| `kind` | `choice`(4지선다) / `written`(서술형) | `choice` |
| `topic` | 주제 | `분배적 정의` |
| `question` | 질문 | `취득·이전·교정의 원칙을 말한 X. …` |
| `answer` | 정답(서술형은 모범 답안) | `최소 국가` |
| `wrong` | 오답 3개 | `{복지 국가, 확대 국가, 공화정 연맹}` |
| `criteria` | 서술형 채점 기준 | `{상동염색체 분리, …}` |
| `explanation` | 해설 | |
| `source_label` / `source_page` / `source_slide` / `source_url` | 근거 | `성신제T · 분배적 정의`, 3 |

DB가 저장 전에 검사합니다: 오답은 정확히 3개, 정답·오답 4개가 모두 다름, 보기 40자 이하, 해설 있음, 서술형은 채점 기준 1개 이상.

## 권한

- 카드·덱 읽기: 누구나(로그인 없이)
- 카드·덱 수정: 구글 로그인 + `editors` 표에 있는 이메일만. 처음에는 `mungga1111@gmail.com` 하나
- 편집자 추가: Supabase 대시보드 → Table Editor → `editors` → Insert row (앱에서는 못 바꿈)
- 풀이 기록(`attempts`): 각자 자기 것만 읽고 쓰기
- 카드가 바뀌면 `card_history`에 누가·언제·무엇을 바꿨는지 자동으로 남음

## 설정 순서

1. supabase.com 가입 → New project (지역은 Northeast Asia (Seoul) 추천)
2. SQL Editor → `schema.sql` 내용 붙여넣기 → Run
3. SQL Editor → `seed.sql` 내용 붙여넣기 → Run
4. Authentication → Providers → Google 켜기
5. Project Settings → API의 Project URL과 anon key를 Claude에게 전달 (service_role key는 절대 공유·커밋하지 말 것)

`schema.sql`과 `seed.sql`은 다시 실행해도 안전합니다(이미 있는 표·카드는 건너뜀).
