# 조하민레츠고 — Sites

기존 `C:\Archenon\Johamin` 앱을 그대로 옮긴 Sites 배포용 소스입니다.
행성우주과학 (황) 79장, (전) 121장, 사회(성신제) 166장과 샘플 덱 12장을 포함합니다.

생물 메뉴는 조용민T와 박상영T로 나뉩니다. 조용민T는 객관식 54문제·서술형 15문제,
박상영T는 객관식 47문제·서술형 14문제를 포함합니다.
각 파트에서 객관식 또는 서술형을 선택할 수 있습니다.
서술형은 직접 답안을 작성한 다음 모범답안과 세 항목의 채점 기준을 보고 직접 채점합니다.
답안·체크 항목·채점 완료 표시는 파트 내부에서 이동하는 동안 유지되며, 파트를 나가거나 새로고침하면 초기화됩니다.
생물 문항은 제공된 선생님별 필기·정리본, 유전학 용어 정리, 유전자의 발현 수업자료를 바탕으로 새로 작성했습니다.
객관식 해설과 서술형 답안에는 참고 자료의 페이지를 표시합니다. 원문 PDF 열람 링크를 뜻하지는 않습니다.
생물 검증: `node tests/test_biology_cards.cjs`.

- React + Vite + TypeScript 정적 사이트이며 Python 서버가 필요하지 않습니다.
- `npm install` 후 `npm run build`로 `dist/`를 생성합니다.
- Sites의 프로젝트와 정적 파일 경로는 `.openai/hosting.json`에 보관합니다.
- 최초 배포는 소유자 비공개입니다.
- `#demo`는 샘플 덱을 엽니다.
- Google Drive 근거 링크는 원본 파일의 열람 권한을 따릅니다.
- 진행 상태는 새로고침하면 초기화됩니다. 음소거 설정은 기기에 저장됩니다.
- 기존 로컬 앱은 `C:\Archenon\Johamin`에서 별도로 사용할 수 있습니다.

검증: `node tests/test_swipe_game.cjs`, `node tests/test_social_cards.cjs`, `node tests/check_swipe_browser.cjs`, `node tests/check_jeon_browser.cjs`.
화면 검증은 `JOHAMIN_TEST_URL`로 실행 중인 정적 사이트를 지정합니다.
