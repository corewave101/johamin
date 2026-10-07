# 조하민레츠고 — Sites

기존 `C:\Archenon\Johamin` 앱을 그대로 옮긴 Sites 배포용 소스입니다.
행성우주과학 (황) 79장, (전) 121장과 샘플 덱 12장을 포함합니다.

- React + Vite + TypeScript 정적 사이트이며 Python 서버가 필요하지 않습니다.
- `npm install` 후 `npm run build`로 `dist/`를 생성합니다.
- Sites의 프로젝트와 정적 파일 경로는 `.openai/hosting.json`에 보관합니다.
- 최초 배포는 소유자 비공개입니다.
- `#demo`는 샘플 덱을 엽니다.
- Google Drive 근거 링크는 원본 파일의 열람 권한을 따릅니다.
- 진행 상태는 새로고침하면 초기화됩니다. 음소거 설정은 기기에 저장됩니다.
- 기존 로컬 앱은 `C:\Archenon\Johamin`에서 별도로 사용할 수 있습니다.

검증: `node tests/test_swipe_game.cjs`, `node tests/check_swipe_browser.cjs`, `node tests/check_jeon_browser.cjs`.
화면 검증은 `JOHAMIN_TEST_URL`로 실행 중인 정적 사이트를 지정합니다.

