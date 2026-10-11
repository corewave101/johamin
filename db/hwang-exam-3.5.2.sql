-- 283 new Hwang exam exercises; INSERT only. Existing rows unchanged.
begin;
insert into public.cards (id, deck_id, kind, topic, badge, question, passage, answer, wrong, criteria, explanation, source_label, source_page, source_slide, source_url, sort) values
  ('hwang-exam-short-001', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '탐구에서 관측하려는 태양계 천체는?', null, '행성', '{}'::text[], array['정답: 행성'], '', '황윤환T · 행성우주과학 수정본', 3, null, null, 1044),
  ('hwang-exam-short-002', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '주변 불빛이 적고 탁 트인 곳에서 망원경을 설치할 때 지면은 어떤 상태여야 하는가?', null, '평평한 지면', '{}'::text[], array['정답: 평평한 지면'], '', '황윤환T · 행성우주과학 수정본', 3, null, null, 1045),
  ('hwang-exam-short-003', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '대상을 정한 뒤 설치 전에 프로그램으로 확인하는 시간 정보는?', null, '관측 가능한 날짜와 시간', '{}'::text[], array['정답: 관측 가능한 날짜와 시간'], '', '황윤환T · 행성우주과학 수정본', 4, null, null, 1046),
  ('hwang-exam-short-004', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '행성의 출몰 시간이 시기마다 달라지는 원인이 되는 각은?', null, '이각', '{}'::text[], array['정답: 이각'], '', '황윤환T · 행성우주과학 수정본', 5, null, null, 1047),
  ('hwang-exam-short-005', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '수업자료에 소개된 무료 천체 관측 프로그램은?', null, 'Stellarium', '{}'::text[], array['정답: Stellarium'], '', '황윤환T · 행성우주과학 수정본', 5, null, null, 1048),
  ('hwang-exam-short-006', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '수업자료에 소개된 국내 천체 관측 프로그램은?', null, 'MiniAstro', '{}'::text[], array['정답: MiniAstro'], '', '황윤환T · 행성우주과학 수정본', 5, null, null, 1049),
  ('hwang-exam-short-007', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '수업자료에 소개된 극축 정렬용 앱은?', null, 'PolarScopeAlign', '{}'::text[], array['정답: PolarScopeAlign'], '', '황윤환T · 행성우주과학 수정본', 5, null, null, 1050),
  ('hwang-exam-short-008', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '볼록렌즈로 빛을 모으는 주망원경의 부품은?', null, '대물렌즈', '{}'::text[], array['정답: 대물렌즈'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1051),
  ('hwang-exam-short-009', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '대물렌즈가 만든 천체의 상을 확대하는 부품은?', null, '접안렌즈', '{}'::text[], array['정답: 접안렌즈'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1052),
  ('hwang-exam-short-010', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '대물렌즈·접안렌즈·파인더가 연결되는 몸체는?', null, '경통', '{}'::text[], array['정답: 경통'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1053),
  ('hwang-exam-short-011', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '경통과 삼각대를 연결해 경통의 방향을 바꾸는 부품은?', null, '가대', '{}'::text[], array['정답: 가대'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1054),
  ('hwang-exam-short-012', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '경통과 무게 균형을 맞추는 부품은?', null, '균형추', '{}'::text[], array['정답: 균형추'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1055),
  ('hwang-exam-short-013', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '천체 망원경을 세우고 고정하는 부품은?', null, '삼각대', '{}'::text[], array['정답: 삼각대'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1056),
  ('hwang-exam-short-014', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '천체를 찾는 데 사용하는 보조 망원경은?', null, '파인더', '{}'::text[], array['정답: 파인더'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1057),
  ('hwang-exam-short-015', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 1단계에서 삼각대 다음 설치하는 것은?', null, '가대', '{}'::text[], array['정답: 가대'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1058),
  ('hwang-exam-short-016', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 2단계에서 경통보다 먼저 연결하는 것은?', null, '균형추', '{}'::text[], array['정답: 균형추'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1059),
  ('hwang-exam-short-017', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 3단계에서 파인더와 함께 끼우는 것은?', null, '접안렌즈', '{}'::text[], array['정답: 접안렌즈'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1060),
  ('hwang-exam-short-018', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 4단계는?', null, '균형 맞추기', '{}'::text[], array['정답: 균형 맞추기'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1061),
  ('hwang-exam-short-019', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 5단계는?', null, '파인더 조정', '{}'::text[], array['정답: 파인더 조정'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1062),
  ('hwang-exam-short-020', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '설치 6단계 중 마지막 6단계는?', null, '극축 맞추기', '{}'::text[], array['정답: 극축 맞추기'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1063),
  ('hwang-exam-short-021', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '우리나라에서 행성이 주로 위치하는 천구의 길은?', null, '황도', '{}'::text[], array['정답: 황도'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1064),
  ('hwang-exam-short-022', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '파인더에서 행성을 맞추는 기준 선은?', null, '십자선', '{}'::text[], array['정답: 십자선'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1065),
  ('hwang-exam-short-023', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '접안렌즈를 교환하며 관측할 때 처음 사용하는 배율은?', null, '저배율', '{}'::text[], array['정답: 저배율'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1066),
  ('hwang-exam-short-024', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '행성을 시야에 계속 두기 위해 동서로 회전시키는 기준 축은?', null, '극축', '{}'::text[], array['정답: 극축'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1067),
  ('hwang-exam-short-025', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '극축을 맞추기 위해 찾는 북쪽의 기준 별은?', null, '북극성', '{}'::text[], array['정답: 북극성'], '', '황윤환T · 행성우주과학 수정본', 9, null, null, 1068),
  ('hwang-exam-short-026', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '일몰 방향을 이용할 때 해가 지는 방향은?', null, '서쪽', '{}'::text[], array['정답: 서쪽'], '', '황윤환T · 행성우주과학 수정본', 9, null, null, 1069),
  ('hwang-exam-short-027', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '북극성 고도와 거의 같은 관측지의 좌표는?', null, '위도', '{}'::text[], array['정답: 위도'], '', '황윤환T · 행성우주과학 수정본', 9, null, null, 1070),
  ('hwang-exam-short-028', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '수업자료의 독일식 적도의 가대 모델은?', null, 'EM200', '{}'::text[], array['정답: EM200'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1071),
  ('hwang-exam-short-029', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 탑재 중량은 몇 kg인가? 숫자만 쓰세요.', null, '16', '{}'::text[], array['정답: 16'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1072),
  ('hwang-exam-short-030', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 가대 자체의 무게는 몇 kg인가? 숫자만 쓰세요.', null, '16.5', '{}'::text[], array['정답: 16.5'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1073),
  ('hwang-exam-short-031', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에 제시된 균형추 하나의 무게는 몇 kg인가? 숫자만 쓰세요.', null, '5', '{}'::text[], array['정답: 5'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1074),
  ('hwang-exam-short-032', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에 제시된 5 kg 균형추의 개수는? 숫자만 쓰세요.', null, '2', '{}'::text[], array['정답: 2'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1075),
  ('hwang-exam-short-033', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에 내장된 Go-to 시스템 명칭은?', null, 'Temma2M', '{}'::text[], array['정답: Temma2M'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1076),
  ('hwang-exam-short-034', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 적경·적위 회전의 웜휠 기어비는?', null, '180:1', '{}'::text[], array['정답: 180:1'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1077),
  ('hwang-exam-short-035', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 구동에 쓰이는 모터 종류는?', null, '스테핑 모터', '{}'::text[], array['정답: 스테핑 모터'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1078),
  ('hwang-exam-short-036', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '스테핑 모터 구동의 기준 제어 방식은?', null, '수정발진 제어', '{}'::text[], array['정답: 수정발진 제어'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1079),
  ('hwang-exam-short-037', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 방위는 좌우 각각 몇 도 조절 가능한가? 숫자만 쓰세요.', null, '15', '{}'::text[], array['정답: 15'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1080),
  ('hwang-exam-short-038', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 고도 조정 범위는? 단위 °를 포함해 쓰세요.', null, '0~50°', '{}'::text[], array['정답: 0~50°'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1081),
  ('hwang-exam-short-039', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 고도 조절에 쓰이는 방식은?', null, '스크루 방식', '{}'::text[], array['정답: 스크루 방식'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1082),
  ('hwang-exam-short-040', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 설정환의 적경 눈금 간격은? 자료의 표기로 쓰세요.', null, '10′', '{}'::text[], array['정답: 10′'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1083),
  ('hwang-exam-short-041', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 설정환의 적위 눈금 간격은? 자료의 표기로 쓰세요.', null, '2°', '{}'::text[], array['정답: 2°'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1084),
  ('hwang-exam-short-042', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 내장 극축 망원경 배율은? 숫자만 쓰세요.', null, '9', '{}'::text[], array['정답: 9'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1085),
  ('hwang-exam-short-043', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '가대의 수평을 확인하는 부품은?', null, '수평계', '{}'::text[], array['정답: 수평계'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1086),
  ('hwang-exam-short-044', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '자료에서 EM200 세차보정 눈금이 대응하는 마지막 연도는? 숫자만 쓰세요.', null, '2030', '{}'::text[], array['정답: 2030'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1087),
  ('hwang-exam-short-045', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 적경 축을 잠그고 푸는 부품은?', null, '적경 클램프', '{}'::text[], array['정답: 적경 클램프'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1088),
  ('hwang-exam-short-046', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 적위 축을 잠그고 푸는 부품은?', null, '적위 클램프', '{}'::text[], array['정답: 적위 클램프'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1089),
  ('hwang-exam-short-047', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에서 극축의 좌우 방향을 미세 조정하는 부품은?', null, '방위 조정 나사', '{}'::text[], array['정답: 방위 조정 나사'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1090),
  ('hwang-exam-short-048', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에서 극축의 기울기를 미세 조정하는 부품은?', null, '고도 조정 나사', '{}'::text[], array['정답: 고도 조정 나사'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1091),
  ('hwang-exam-short-049', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 도해의 Altitude lock에 해당하는 부품은?', null, '고도 잠금 장치', '{}'::text[], array['정답: 고도 잠금 장치'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1092),
  ('hwang-exam-short-050', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 도해의 Polar telescope cover에 해당하는 것은?', null, '극축 망원경 커버', '{}'::text[], array['정답: 극축 망원경 커버'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1093),
  ('hwang-exam-short-051', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 도해에서 삼각대와 가대 사이의 연결 부품은?', null, '삼각대 어댑터', '{}'::text[], array['정답: 삼각대 어댑터'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1094),
  ('hwang-exam-short-052', 'astronomy-hwang', 'written', '설치·안전·균형', null, '망원경과 파인더로 절대 직접 관측하면 안 되는 천체는?', null, '태양', '{}'::text[], array['정답: 태양'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1095),
  ('hwang-exam-short-053', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통 밴드를 과도하게 조이면 경통 변형 외에 틀어질 수 있는 것은?', null, '광축', '{}'::text[], array['정답: 광축'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1096),
  ('hwang-exam-short-054', 'astronomy-hwang', 'written', '설치·안전·균형', null, '추봉 끝에 끼워 균형추의 추락을 막는 부품은?', null, '안전 너트', '{}'::text[], array['정답: 안전 너트'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1097),
  ('hwang-exam-short-055', 'astronomy-hwang', 'written', '설치·안전·균형', null, '가대가 비에 젖으면 습기로 전기 회로에 생길 수 있는 현상은?', null, '쇼트', '{}'::text[], array['정답: 쇼트'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1098),
  ('hwang-exam-short-056', 'astronomy-hwang', 'written', '설치·안전·균형', null, '습기가 가대에서 씻어낼 수 있는 기계적 보호 물질은?', null, '윤활유', '{}'::text[], array['정답: 윤활유'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1099),
  ('hwang-exam-short-057', 'astronomy-hwang', 'written', '설치·안전·균형', null, '우천이 예상되어 즉시 철수할 수 없다면 가대를 무엇으로 덮는가?', null, '방수천', '{}'::text[], array['정답: 방수천'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1100),
  ('hwang-exam-short-058', 'astronomy-hwang', 'written', '설치·안전·균형', null, '삼각대 다리 사이에 부착하는 Tray의 한글 명칭은?', null, '삼각판', '{}'::text[], array['정답: 삼각판'], '', '황윤환T · 행성우주과학 수정본', 13, null, null, 1101),
  ('hwang-exam-short-059', 'astronomy-hwang', 'written', '설치·안전·균형', null, '삼각판을 다리 브래킷에 고정하는 Boss의 부품 이름은?', null, '커넥터', '{}'::text[], array['정답: 커넥터'], '', '황윤환T · 행성우주과학 수정본', 13, null, null, 1102),
  ('hwang-exam-short-060', 'astronomy-hwang', 'written', '설치·안전·균형', null, '삼각대 퀵클램프 레버는 어느 방향으로 조여 고정하는가?', null, '아래', '{}'::text[], array['정답: 아래'], '', '황윤환T · 행성우주과학 수정본', 13, null, null, 1103),
  ('hwang-exam-short-061', 'astronomy-hwang', 'written', '설치·안전·균형', null, '삼각판과 견고하게 결합했는지 확인하는 다리 쪽 지지 부품은?', null, '다리 지지 브래킷', '{}'::text[], array['정답: 다리 지지 브래킷'], '', '황윤환T · 행성우주과학 수정본', 13, null, null, 1104),
  ('hwang-exam-short-062', 'astronomy-hwang', 'written', '설치·안전·균형', null, '가대의 방위 조정 나사 사이에 들어가는 삼각대의 핀은?', null, '방위각 핀', '{}'::text[], array['정답: 방위각 핀'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1105),
  ('hwang-exam-short-063', 'astronomy-hwang', 'written', '설치·안전·균형', null, '가대를 삼각대에 설치할 때 내려놓는 방향은?', null, '수직', '{}'::text[], array['정답: 수직'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1106),
  ('hwang-exam-short-064', 'astronomy-hwang', 'written', '설치·안전·균형', null, 'EM200 가대는 안전 운용을 위해 몇 명이 협력하는가? 숫자만 쓰세요.', null, '2', '{}'::text[], array['정답: 2'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1107),
  ('hwang-exam-short-065', 'astronomy-hwang', 'written', '설치·안전·균형', null, '가대 아래에서 삼각대와 가대를 고정하는 부품은?', null, '장착 너트', '{}'::text[], array['정답: 장착 너트'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1108),
  ('hwang-exam-short-066', 'astronomy-hwang', 'written', '설치·안전·균형', null, '극축 조정 전 장착 너트를 너무 조이지 않는 이유가 되는 조작은?', null, '방위 조정', '{}'::text[], array['정답: 방위 조정'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1109),
  ('hwang-exam-short-067', 'astronomy-hwang', 'written', '설치·안전·균형', null, '장착 너트를 완전히 조이는 시점은?', null, '극축 조정 후', '{}'::text[], array['정답: 극축 조정 후'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1110),
  ('hwang-exam-short-068', 'astronomy-hwang', 'written', '설치·안전·균형', null, '균형추 장착 전 가대에서 꺼내는 막대 부품은?', null, '추봉', '{}'::text[], array['정답: 추봉'], '', '황윤환T · 행성우주과학 수정본', 15, null, null, 1111),
  ('hwang-exam-short-069', 'astronomy-hwang', 'written', '설치·안전·균형', null, '추봉을 빼낸 뒤 단단히 잠그는 부품은?', null, '추봉 클램프', '{}'::text[], array['정답: 추봉 클램프'], '', '황윤환T · 행성우주과학 수정본', 15, null, null, 1112),
  ('hwang-exam-short-070', 'astronomy-hwang', 'written', '설치·안전·균형', null, '균형추를 추봉의 선택한 위치에 고정하는 나사는?', null, '클램프 나사', '{}'::text[], array['정답: 클램프 나사'], '', '황윤환T · 행성우주과학 수정본', 15, null, null, 1113),
  ('hwang-exam-short-071', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통 밴드를 받침대에 고정하는 캡 볼트는 몇 개인가? 숫자만 쓰세요.', null, '2', '{}'::text[], array['정답: 2'], '', '황윤환T · 행성우주과학 수정본', 16, null, null, 1114),
  ('hwang-exam-short-072', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통 밴드 캡 볼트를 조이는 도구는?', null, '육각렌치', '{}'::text[], array['정답: 육각렌치'], '', '황윤환T · 행성우주과학 수정본', 16, null, null, 1115),
  ('hwang-exam-short-073', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통을 안전하게 수평으로 올리려면 미리 돌려두는 축은?', null, '적위축', '{}'::text[], array['정답: 적위축'], '', '황윤환T · 행성우주과학 수정본', 16, null, null, 1116),
  ('hwang-exam-short-074', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통 밴드를 닫은 뒤 적당히 조이는 부품은?', null, '고정 너트', '{}'::text[], array['정답: 고정 너트'], '', '황윤환T · 행성우주과학 수정본', 16, null, null, 1117),
  ('hwang-exam-short-075', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적경·적위 클램프를 어느 부품 쪽으로 돌리면 풀리는가?', null, '포스트', '{}'::text[], array['정답: 포스트'], '', '황윤환T · 행성우주과학 수정본', 17, null, null, 1118),
  ('hwang-exam-short-076', 'astronomy-hwang', 'written', '설치·안전·균형', null, '클램프를 풀었을 때 축을 움직이는 방식은?', null, '수동 조작', '{}'::text[], array['정답: 수동 조작'], '', '황윤환T · 행성우주과학 수정본', 17, null, null, 1119),
  ('hwang-exam-short-077', 'astronomy-hwang', 'written', '설치·안전·균형', null, '모터 구동 준비를 위해 수동 이동 뒤 해야 할 조작은?', null, '클램프 고정', '{}'::text[], array['정답: 클램프 고정'], '', '황윤환T · 행성우주과학 수정본', 17, null, null, 1120),
  ('hwang-exam-short-078', 'astronomy-hwang', 'written', '설치·안전·균형', null, '불균형 상태에서 클램프를 조금만 풀어도 나타나는 위험한 운동은?', null, '급격한 회전', '{}'::text[], array['정답: 급격한 회전'], '', '황윤환T · 행성우주과학 수정본', 18, null, null, 1121),
  ('hwang-exam-short-079', 'astronomy-hwang', 'written', '설치·안전·균형', null, '불균형 상태의 모터 구동으로 큰 부담을 받는 부품은?', null, '기어', '{}'::text[], array['정답: 기어'], '', '황윤환T · 행성우주과학 수정본', 18, null, null, 1122),
  ('hwang-exam-short-080', 'astronomy-hwang', 'written', '설치·안전·균형', null, '실제 관측 시 균형을 맞추기 전에 접안렌즈와 카메라를 달아야 하는 이유는?', null, '무게 균형 변화', '{}'::text[], array['정답: 무게 균형 변화'], '', '황윤환T · 행성우주과학 수정본', 18, null, null, 1123),
  ('hwang-exam-short-081', 'astronomy-hwang', 'written', '설치·안전·균형', null, '균형 맞추기 준비에서 수평으로 놓는 축은?', null, '적위축', '{}'::text[], array['정답: 적위축'], '', '황윤환T · 행성우주과학 수정본', 18, null, null, 1124),
  ('hwang-exam-short-082', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적위축 균형 확인에서 천천히 푸는 클램프는?', null, '적위 클램프', '{}'::text[], array['정답: 적위 클램프'], '', '황윤환T · 행성우주과학 수정본', 19, null, null, 1125),
  ('hwang-exam-short-083', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적위축 균형을 바꾸기 위해 경통을 움직이는 방향은?', null, '전후', '{}'::text[], array['정답: 전후'], '', '황윤환T · 행성우주과학 수정본', 19, null, null, 1126),
  ('hwang-exam-short-084', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적위축 균형을 바꿀 때 풀어야 하는 경통 고정 부품은?', null, '경통 밴드', '{}'::text[], array['정답: 경통 밴드'], '', '황윤환T · 행성우주과학 수정본', 19, null, null, 1127),
  ('hwang-exam-short-085', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적경축 균형 확인에서 푸는 클램프는?', null, '적경 클램프', '{}'::text[], array['정답: 적경 클램프'], '', '황윤환T · 행성우주과학 수정본', 20, null, null, 1128),
  ('hwang-exam-short-086', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적경축 균형을 맞출 때 위치를 바꾸는 부품은?', null, '균형추', '{}'::text[], array['정답: 균형추'], '', '황윤환T · 행성우주과학 수정본', 20, null, null, 1129),
  ('hwang-exam-short-087', 'astronomy-hwang', 'written', '설치·안전·균형', null, '균형추를 추봉 끝까지 옮겨도 경통 쪽이 무거우면 무엇을 추가하는가?', null, '균형추', '{}'::text[], array['정답: 균형추'], '', '황윤환T · 행성우주과학 수정본', 20, null, null, 1130),
  ('hwang-exam-short-088', 'astronomy-hwang', 'written', '설치·안전·균형', null, '두 축의 균형은 동시에 맞추는가, 한 축씩 맞추는가?', null, '한 축씩', '{}'::text[], array['정답: 한 축씩'], '', '황윤환T · 행성우주과학 수정본', 20, null, null, 1131),
  ('hwang-exam-short-089', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '수업자료의 주망원경 경통 모델은?', null, 'TSA120', '{}'::text[], array['정답: TSA120'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1132),
  ('hwang-exam-short-090', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120은 몇 군 몇 매 구성인가?', null, '3군 3매', '{}'::text[], array['정답: 3군 3매'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1133),
  ('hwang-exam-short-091', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 광학 형식은?', null, '아포크로매트', '{}'::text[], array['정답: 아포크로매트'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1134),
  ('hwang-exam-short-092', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 유효 구경은 몇 mm인가? 숫자만 쓰세요.', null, '120', '{}'::text[], array['정답: 120'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1135),
  ('hwang-exam-short-093', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 초점거리는 몇 mm인가? 숫자만 쓰세요.', null, '900', '{}'::text[], array['정답: 900'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1136),
  ('hwang-exam-short-094', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 구경비를 f/ 표기로 쓰세요.', null, 'f/7.5', '{}'::text[], array['정답: f/7.5'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1137),
  ('hwang-exam-short-095', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 분해능은 몇 초각인가? 숫자만 쓰세요.', null, '0.97', '{}'::text[], array['정답: 0.97'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1138),
  ('hwang-exam-short-096', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 극한등급은? 숫자만 쓰세요.', null, '12.1', '{}'::text[], array['정답: 12.1'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1139),
  ('hwang-exam-short-097', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 집광력은 몇 배인가? 숫자만 쓰세요.', null, '293', '{}'::text[], array['정답: 293'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1140),
  ('hwang-exam-short-098', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 코팅 명칭은?', null, '전면 멀티 하드 코트', '{}'::text[], array['정답: 전면 멀티 하드 코트'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1141),
  ('hwang-exam-short-099', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120 파인더 규격을 배율×구경으로 쓰세요.', null, '7.5×50', '{}'::text[], array['정답: 7.5×50'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1142),
  ('hwang-exam-short-100', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드를 앞에서 막는 덮개 부품은?', null, '후드 캡', '{}'::text[], array['정답: 후드 캡'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1143),
  ('hwang-exam-short-101', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드의 슬라이드를 잠그는 부품은?', null, '후드 고정 나사', '{}'::text[], array['정답: 후드 고정 나사'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1144),
  ('hwang-exam-short-102', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '초점 핸들로 앞뒤 이동하는 접안부 관은?', null, '드로우튜브', '{}'::text[], array['정답: 드로우튜브'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1145),
  ('hwang-exam-short-103', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '드로우튜브를 고정하는 부품은?', null, '드로우튜브 클램프', '{}'::text[], array['정답: 드로우튜브 클램프'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1146),
  ('hwang-exam-short-104', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120 뒤쪽에서 빛을 눈으로 받는 렌즈를 끼우는 부위는?', null, '접안체', '{}'::text[], array['정답: 접안체'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1147),
  ('hwang-exam-short-105', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120 드로우튜브의 스트로크는 몇 mm인가? 숫자만 쓰세요.', null, '86.5', '{}'::text[], array['정답: 86.5'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1148),
  ('hwang-exam-short-106', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '접안부 부품 중 50.8 연장통 L 앞에 오는 굴절용 부품은?', null, '50.8 어댑터', '{}'::text[], array['정답: 50.8 어댑터'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1149),
  ('hwang-exam-short-107', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '접안부 부품 중 굴절용 50.8 어댑터 다음에 오는 것은?', null, '50.8 연장통 L', '{}'::text[], array['정답: 50.8 연장통 L'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1150),
  ('hwang-exam-short-108', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '50.8 연장통 L 뒤쪽에 연결되는 부품은?', null, '50.8 슬리브', '{}'::text[], array['정답: 50.8 슬리브'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1151),
  ('hwang-exam-short-109', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '50.8 슬리브와 31.7 아이피스 어댑터 사이의 부품은?', null, '아이피스 어댑터 접속환', '{}'::text[], array['정답: 아이피스 어댑터 접속환'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1152),
  ('hwang-exam-short-110', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '접안부 끝에서 31.7 mm 아이피스를 받아주는 부품은?', null, '31.7 아이피스 어댑터', '{}'::text[], array['정답: 31.7 아이피스 어댑터'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1153),
  ('hwang-exam-short-111', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '도해에서 굴절용 50.8 어댑터 길이는 몇 mm인가? 숫자만 쓰세요.', null, '40.0', '{}'::text[], array['정답: 40.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1154),
  ('hwang-exam-short-112', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '도해에서 50.8 연장통 L 길이는 몇 mm인가? 숫자만 쓰세요.', null, '73.5', '{}'::text[], array['정답: 73.5'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1155),
  ('hwang-exam-short-113', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '도해에서 50.8 슬리브 표시 길이는 몇 mm인가? 숫자만 쓰세요.', null, '5.0', '{}'::text[], array['정답: 5.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1156),
  ('hwang-exam-short-114', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '도해에서 아이피스 어댑터 접속환 길이는 몇 mm인가? 숫자만 쓰세요.', null, '10.0', '{}'::text[], array['정답: 10.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1157),
  ('hwang-exam-short-115', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '도해에서 31.7 아이피스 어댑터 길이는 몇 mm인가? 숫자만 쓰세요.', null, '29.0', '{}'::text[], array['정답: 29.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1158),
  ('hwang-exam-short-116', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '드로우튜브 연결부의 나사 규격은? 자료의 표기로 쓰세요.', null, 'M72×1.0', '{}'::text[], array['정답: M72×1.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1159),
  ('hwang-exam-short-117', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '50.8 슬리브 쪽 접속 나사 규격은? 자료의 표기로 쓰세요.', null, 'M43×0.75', '{}'::text[], array['정답: M43×0.75'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1160),
  ('hwang-exam-short-118', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '31.7 아이피스 어댑터 쪽 접속 나사 규격은? 자료의 표기로 쓰세요.', null, 'M36.5×1.0', '{}'::text[], array['정답: M36.5×1.0'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1161),
  ('hwang-exam-short-119', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '1.25인치 아이피스의 슬리브 직경은 몇 mm인가? 숫자만 쓰세요.', null, '31.7', '{}'::text[], array['정답: 31.7'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1162),
  ('hwang-exam-short-120', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '2인치 아이피스의 슬리브 직경은 몇 mm인가? 숫자만 쓰세요.', null, '50.8', '{}'::text[], array['정답: 50.8'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1163),
  ('hwang-exam-short-121', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '31.7 mm 아이피스 장착 전에 풀어주는 어댑터 부품은?', null, '고정환', '{}'::text[], array['정답: 고정환'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1164),
  ('hwang-exam-short-122', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '31.7 mm 아이피스 삽입 전 벗기는 덮개는?', null, '접안 캡', '{}'::text[], array['정답: 접안 캡'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1165),
  ('hwang-exam-short-123', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '50.8 mm 아이피스 장착 때 풀어주는 연장통 L의 부품은?', null, '고정 나사', '{}'::text[], array['정답: 고정 나사'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1166),
  ('hwang-exam-short-124', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '50.8 mm 아이피스를 끼우기 위해 분리하는 앞부분의 시작 부품은?', null, '50.8 슬리브', '{}'::text[], array['정답: 50.8 슬리브'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1167),
  ('hwang-exam-short-125', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '아이피스 고정부 도해에서 고정환 안쪽에 표시된 링은?', null, '수지 링', '{}'::text[], array['정답: 수지 링'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1168),
  ('hwang-exam-short-126', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '초점 조절 전 풀렸는지 확인하는 것은?', null, '드로우튜브 클램프', '{}'::text[], array['정답: 드로우튜브 클램프'], '', '황윤환T · 행성우주과학 수정본', 25, null, null, 1169),
  ('hwang-exam-short-127', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '드로우튜브를 이동시켜 초점을 조절하는 부품은?', null, '초점 핸들', '{}'::text[], array['정답: 초점 핸들'], '', '황윤환T · 행성우주과학 수정본', 25, null, null, 1170),
  ('hwang-exam-short-128', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '초점 핸들을 그림의 화살표 방향으로 돌릴 때 드로우튜브는 안쪽과 바깥쪽 중 어디로 움직이는가?', null, '바깥쪽', '{}'::text[], array['정답: 바깥쪽'], '', '황윤환T · 행성우주과학 수정본', 25, null, null, 1171),
  ('hwang-exam-short-129', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '초점 핸들을 그림 화살표의 반대 방향으로 돌릴 때 드로우튜브는 어디로 움직이는가?', null, '안쪽', '{}'::text[], array['정답: 안쪽'], '', '황윤환T · 행성우주과학 수정본', 25, null, null, 1172),
  ('hwang-exam-short-130', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '이동할 때 후드를 격납하는 주된 이유는?', null, '부피 감소', '{}'::text[], array['정답: 부피 감소'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1173),
  ('hwang-exam-short-131', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '관측할 때 후드를 끌어내어 막는 원치 않는 빛은?', null, '미광', '{}'::text[], array['정답: 미광'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1174),
  ('hwang-exam-short-132', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드를 슬라이드하기 전에 반드시 벗기는 것은?', null, '후드 캡', '{}'::text[], array['정답: 후드 캡'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1175),
  ('hwang-exam-short-133', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드를 끌어내기 위해 먼저 푸는 로크 나사는 몇 개인가? 숫자만 쓰세요.', null, '2', '{}'::text[], array['정답: 2'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1176),
  ('hwang-exam-short-134', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드를 끌어낸 뒤 다시 조이는 것은?', null, '후드 로크 나사', '{}'::text[], array['정답: 후드 로크 나사'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1177),
  ('hwang-exam-short-135', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리를 고정할 때 먼저 확인하는 방향은?', null, '전후', '{}'::text[], array['정답: 전후'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1178),
  ('hwang-exam-short-136', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리는 경통의 어느 부분에 캡 볼트로 고정하는가?', null, '접안체', '{}'::text[], array['정답: 접안체'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1179),
  ('hwang-exam-short-137', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리 캡 볼트용 육각렌치 규격은 몇 mm인가? 숫자만 쓰세요.', null, '4', '{}'::text[], array['정답: 4'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1180),
  ('hwang-exam-short-138', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리 없이 캡 볼트를 조이면 볼트 끝이 닿는 부품은?', null, '드로우튜브', '{}'::text[], array['정답: 드로우튜브'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1181),
  ('hwang-exam-short-139', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 경통과 주망원경 경통을 처음 맞추는 방향 관계는?', null, '평행', '{}'::text[], array['정답: 평행'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1182),
  ('hwang-exam-short-140', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 방향을 바꾸는 나사는?', null, '파인더 조정 나사', '{}'::text[], array['정답: 파인더 조정 나사'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1183),
  ('hwang-exam-short-141', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 삽입을 방해하지 않도록 다리 안쪽으로 나오지 않아야 하는 것은?', null, '나사 끝', '{}'::text[], array['정답: 나사 끝'], '', '황윤환T · 행성우주과학 수정본', 28, null, null, 1184),
  ('hwang-exam-short-142', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 조정 나사를 잠그는 너트는?', null, '록 너트', '{}'::text[], array['정답: 록 너트'], '', '황윤환T · 행성우주과학 수정본', 28, null, null, 1185),
  ('hwang-exam-short-143', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 고정 비스를 조이는 드라이버 형태는?', null, '가는 일자 드라이버', '{}'::text[], array['정답: 가는 일자 드라이버'], '', '황윤환T · 행성우주과학 수정본', 28, null, null, 1186),
  ('hwang-exam-short-144', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더를 다리 중앙에 고정하는 비스는 몇 개인가? 숫자만 쓰세요.', null, '3', '{}'::text[], array['정답: 3'], '', '황윤환T · 행성우주과학 수정본', 28, null, null, 1187),
  ('hwang-exam-short-145', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 도해에서 조명을 부착하는 나사의 명칭은?', null, '조명 유닛 장착 나사', '{}'::text[], array['정답: 조명 유닛 장착 나사'], '', '황윤환T · 행성우주과학 수정본', 28, null, null, 1188),
  ('hwang-exam-short-146', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더는 저배율과 고배율 중 어느 쪽인가?', null, '저배율', '{}'::text[], array['정답: 저배율'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1189),
  ('hwang-exam-short-147', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더의 시야는 주망원경 고배율 시야보다 넓은가 좁은가?', null, '넓다', '{}'::text[], array['정답: 넓다'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1190),
  ('hwang-exam-short-148', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 시야에 포함된 목표물 위치 기준 스케일은?', null, '십자선', '{}'::text[], array['정답: 십자선'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1191),
  ('hwang-exam-short-149', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더의 앞쪽 렌즈가 들어 있는 부분의 이름은?', null, '대물 경실', '{}'::text[], array['정답: 대물 경실'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1192),
  ('hwang-exam-short-150', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 대물 경실을 고정하는 링은?', null, '대물 고정링', '{}'::text[], array['정답: 대물 고정링'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1193),
  ('hwang-exam-short-151', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 초점 조절 시 먼저 푸는 링은?', null, '접안부 고정링', '{}'::text[], array['정답: 접안부 고정링'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1194),
  ('hwang-exam-short-152', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 초점 조절에서 손으로 좌우 회전시키는 부분은?', null, '접안부', '{}'::text[], array['정답: 접안부'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1195),
  ('hwang-exam-short-153', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 초점이 맞은 뒤 다시 조이는 것은?', null, '접안부 고정링', '{}'::text[], array['정답: 접안부 고정링'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1196),
  ('hwang-exam-short-154', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 광축 조정에서 주망원경에 처음 끼우는 아이피스 배율은?', null, '저배율', '{}'::text[], array['정답: 저배율'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1197),
  ('hwang-exam-short-155', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '주망원경으로 목표물을 고를 때 거리는 가능한 가까운가 먼가?', null, '먼 것', '{}'::text[], array['정답: 먼 것'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1198),
  ('hwang-exam-short-156', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '저배율 중앙 도입 뒤 아이피스를 어떤 배율로 교체하는가?', null, '고배율', '{}'::text[], array['정답: 고배율'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1199),
  ('hwang-exam-short-157', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '광축 조정에서 목표물을 맞추는 파인더 십자선의 위치는?', null, '교점', '{}'::text[], array['정답: 교점'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1200),
  ('hwang-exam-short-158', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '광축 조정 중 록 너트를 조정 나사의 어느 쪽에 바짝 붙이는가?', null, '머리 쪽', '{}'::text[], array['정답: 머리 쪽'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1201),
  ('hwang-exam-short-159', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '그림의 큰 화살표 방향으로 파인더 접안부를 옮길 때 푸는 조정 나사는?', null, 'a와 b', '{}'::text[], array['정답: a와 b'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1202),
  ('hwang-exam-short-160', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '그림의 큰 화살표 방향으로 파인더 접안부를 옮길 때 누르는 조정 나사는?', null, 'c', '{}'::text[], array['정답: c'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1203),
  ('hwang-exam-short-161', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 접안부가 큰 화살표 방향으로 이동하면 앞부분은 어느 방향으로 이동하는가?', null, '반대 방향', '{}'::text[], array['정답: 반대 방향'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1204),
  ('hwang-exam-short-162', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈 표면의 먼지를 사용 때마다 먼저 제거하는 도구는?', null, '블로어', '{}'::text[], array['정답: 블로어'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1205),
  ('hwang-exam-short-163', 'astronomy-hwang', 'written', '손질과 보관', null, '자료에서 오염 청소에 권장한 약국 판매 알코올은?', null, '무수 에탄올', '{}'::text[], array['정답: 무수 에탄올'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1206),
  ('hwang-exam-short-164', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈 표면을 닦을 때 사용하는 전용 종이는?', null, '렌즈 청소용 클리닝 페이퍼', '{}'::text[], array['정답: 렌즈 청소용 클리닝 페이퍼'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1207),
  ('hwang-exam-short-165', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈를 닦기 전에 블로어로 충분히 불어내는 것은?', null, '먼지', '{}'::text[], array['정답: 먼지'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1208),
  ('hwang-exam-short-166', 'astronomy-hwang', 'written', '손질과 보관', null, '이슬 자국 청소를 미루면 시간이 지나 지워지는가?', null, '지워지지 않는다', '{}'::text[], array['정답: 지워지지 않는다'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1209),
  ('hwang-exam-short-167', 'astronomy-hwang', 'written', '손질과 보관', null, '야외 관측 후 따뜻한 방에 바로 넣을 때 피해야 하는 변화는?', null, '급격한 온도 변화', '{}'::text[], array['정답: 급격한 온도 변화'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1210),
  ('hwang-exam-short-168', 'astronomy-hwang', 'written', '손질과 보관', null, '이슬을 머금은 채 보관하면 렌즈에 생길 수 있는 생물성 오염은?', null, '곰팡이', '{}'::text[], array['정답: 곰팡이'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1211),
  ('hwang-exam-short-169', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈를 충분히 말린 뒤 보관 장소에서 확보해야 하는 조건은?', null, '통풍', '{}'::text[], array['정답: 통풍'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1212),
  ('hwang-exam-short-170', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈를 꺼내거나 경실을 수납하는 데 필요한 전용 도구는?', null, '전용 치구', '{}'::text[], array['정답: 전용 치구'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1213),
  ('hwang-exam-short-171', 'astronomy-hwang', 'written', '손질과 보관', null, '설정 장치 없이 분해한 렌즈를 재조립하면 악화되는 것은?', null, '상의 품질', '{}'::text[], array['정답: 상의 품질'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1214),
  ('hwang-exam-short-172', 'astronomy-hwang', 'written', '손질과 보관', null, '국부 냉각으로 렌즈 파손을 유발할 수 있어 금지된 청소 도구는?', null, '스프레이식 에어 클리너', '{}'::text[], array['정답: 스프레이식 에어 클리너'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1215),
  ('hwang-exam-short-173', 'astronomy-hwang', 'written', '손질과 보관', null, '블로어로 먼지를 제거할 때 렌즈는 어떤 온도 상태여야 하는가?', null, '상온으로 안정된 상태', '{}'::text[], array['정답: 상온으로 안정된 상태'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1216),
  ('hwang-exam-short-174', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성이 속하는 별자리는?', null, '작은곰자리', '{}'::text[], array['정답: 작은곰자리'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1217),
  ('hwang-exam-short-175', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성의 별 기호를 그리스 문자와 별자리 약자로 쓰세요.', null, 'α UMi', '{}'::text[], array['정답: α UMi'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1218),
  ('hwang-exam-short-176', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성은 천구 북극에서 약 몇 도 떨어져 있는가? 숫자만 쓰세요.', null, '0.7', '{}'::text[], array['정답: 0.7'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1219),
  ('hwang-exam-short-177', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성도 작은 원을 그리며 도는 일주운동의 중심은?', null, '천구 북극', '{}'::text[], array['정답: 천구 북극'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1220),
  ('hwang-exam-short-178', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 거리는 몇 pc인가? 숫자만 쓰세요.', null, '143', '{}'::text[], array['정답: 143'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1221),
  ('hwang-exam-short-179', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 거리는 몇 광년인가? 숫자만 쓰세요.', null, '466', '{}'::text[], array['정답: 466'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1222),
  ('hwang-exam-short-180', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 안시등급 V는? 숫자만 쓰세요.', null, '2.02', '{}'::text[], array['정답: 2.02'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1223),
  ('hwang-exam-short-181', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 색지수 U−B는? 숫자만 쓰세요.', null, '0.38', '{}'::text[], array['정답: 0.38'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1224),
  ('hwang-exam-short-182', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 색지수 B−V는? 숫자만 쓰세요.', null, '0.60', '{}'::text[], array['정답: 0.60'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1225),
  ('hwang-exam-short-183', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 분광형은?', null, 'F5-8 Ib', '{}'::text[], array['정답: F5-8 Ib'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1226),
  ('hwang-exam-short-184', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성의 광도 계급 Ib에 해당하는 별 분류는?', null, '초거성', '{}'::text[], array['정답: 초거성'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1227),
  ('hwang-exam-short-185', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성의 변광성 종류는?', null, '세페이드형 변광성', '{}'::text[], array['정답: 세페이드형 변광성'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1228),
  ('hwang-exam-short-186', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에 적힌 북극성 변광 주기는 약 며칠인가? 숫자만 쓰세요.', null, '4', '{}'::text[], array['정답: 4'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1229),
  ('hwang-exam-short-187', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북두칠성이 속하는 별자리는?', null, '큰곰자리', '{}'::text[], array['정답: 큰곰자리'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1230),
  ('hwang-exam-short-188', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '카시오페이아자리의 대표적인 모양은?', null, 'W', '{}'::text[], array['정답: W'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1231),
  ('hwang-exam-short-189', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북두칠성 국자 머리 두 별의 간격을 북극성까지 몇 배 연장하는가? 숫자만 쓰세요.', null, '5', '{}'::text[], array['정답: 5'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1232),
  ('hwang-exam-short-190', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '카시오페이아 W 양변 연장선 교점에서 가운데 별까지의 간격을 북극성까지 몇 배 연장하는가? 숫자만 쓰세요.', null, '5', '{}'::text[], array['정답: 5'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1233),
  ('hwang-exam-short-191', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성의 고도는 관측자의 무엇과 거의 같은가?', null, '위도', '{}'::text[], array['정답: 위도'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1234),
  ('hwang-exam-short-192', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에서 부산 북극성의 고도는 약 몇 도인가? 숫자만 쓰세요.', null, '35', '{}'::text[], array['정답: 35'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1235),
  ('hwang-exam-short-193', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '적도의에서 시간각과 적경 변화의 기준이 되는 축은?', null, '극축', '{}'::text[], array['정답: 극축'], '', '황윤환T · 행성우주과학 수정본', 37, null, null, 1236),
  ('hwang-exam-short-194', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '극축의 다른 이름을 좌표축 이름으로 쓰세요.', null, '적경축', '{}'::text[], array['정답: 적경축'], '', '황윤환T · 행성우주과학 수정본', 37, null, null, 1237),
  ('hwang-exam-short-195', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '올바르게 정렬된 극축과 평행한 지구의 축은?', null, '자전축', '{}'::text[], array['정답: 자전축'], '', '황윤환T · 행성우주과학 수정본', 37, null, null, 1238),
  ('hwang-exam-short-196', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북반구의 극축이 정확히 향해야 하는 천구의 지점은?', null, '천구 북극', '{}'::text[], array['정답: 천구 북극'], '', '황윤환T · 행성우주과학 수정본', 37, null, null, 1239),
  ('hwang-exam-short-197', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '극축을 지구 자전축과 나란하게 조정하는 과정은?', null, '극축 정렬', '{}'::text[], array['정답: 극축 정렬'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1240),
  ('hwang-exam-short-198', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '정렬이 불충분하면 천체가 시야 밖으로 나가는 원인이 되는 겉보기 운동은?', null, '일주운동', '{}'::text[], array['정답: 일주운동'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1241),
  ('hwang-exam-short-199', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '자료에서 대상의 시야 이탈 속도는 무엇에 비례하는가?', null, '배율', '{}'::text[], array['정답: 배율'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1242),
  ('hwang-exam-short-200', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '극축 정렬이 중요한, 어두운 천체 촬영 방식은?', null, '장노출', '{}'::text[], array['정답: 장노출'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1243),
  ('hwang-exam-short-201', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '극축과 지평면이 이루는 각은 관측지의 무엇과 같게 맞추는가?', null, '위도', '{}'::text[], array['정답: 위도'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1244),
  ('hwang-exam-short-202', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '지평면에 투영한 극축이 향해야 하는 방위는?', null, '정북', '{}'::text[], array['정답: 정북'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1245),
  ('hwang-exam-short-203', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '극축 망원경 안에 새겨진 정렬용 눈금판은?', null, '레티클', '{}'::text[], array['정답: 레티클'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1246),
  ('hwang-exam-short-204', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 레티클로 남북반구의 극을 어느 해까지 보정하는가? 숫자만 쓰세요.', null, '2030', '{}'::text[], array['정답: 2030'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1247),
  ('hwang-exam-short-205', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '자료에서 EM200 정렬 오차는 몇 각분 이내인가? 숫자만 쓰세요.', null, '2', '{}'::text[], array['정답: 2'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1248),
  ('hwang-exam-short-206', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 레티클의 외측 원 눈금은 무엇을 표시하는가?', null, '날짜', '{}'::text[], array['정답: 날짜'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1249),
  ('hwang-exam-short-207', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 레티클의 내측 원 눈금은 무엇을 표시하는가?', null, '시간', '{}'::text[], array['정답: 시간'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1250),
  ('hwang-exam-short-208', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '레티클 원 내부의 α UMi 눈금은 어느 반구용인가?', null, '북반구', '{}'::text[], array['정답: 북반구'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1251),
  ('hwang-exam-short-209', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '레티클 원 내부의 σ Oct 눈금은 어느 반구용인가?', null, '남반구', '{}'::text[], array['정답: 남반구'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1252),
  ('hwang-exam-short-210', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '남반구 정렬에 쓰이는 별을 한글 명칭으로 쓰세요.', null, '시그마 옥탄', '{}'::text[], array['정답: 시그마 옥탄'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1253),
  ('hwang-exam-short-211', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '레티클 확인을 위해 극축 망원경 커버는 앞뒤 중 어느 것을 여는가?', null, '앞뒤 모두', '{}'::text[], array['정답: 앞뒤 모두'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1254),
  ('hwang-exam-short-212', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '극축 망원경 통로를 열기 위해 먼저 푸는 클램프는?', null, '적위 클램프', '{}'::text[], array['정답: 적위 클램프'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1255),
  ('hwang-exam-short-213', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '극축 망원경 전체가 구멍으로 보이게 돌리는 축은?', null, '적위축', '{}'::text[], array['정답: 적위축'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1256),
  ('hwang-exam-short-214', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '레티클 확인 시 관측자는 어느 막대 앞에서 들여다보는가?', null, '무게추 봉', '{}'::text[], array['정답: 무게추 봉'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1257),
  ('hwang-exam-short-215', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 정렬 4단계 중 맨 처음 하는 보정은?', null, '경도 보정', '{}'::text[], array['정답: 경도 보정'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1258),
  ('hwang-exam-short-216', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '경도 보정 다음에 확인하는 자세 조건은?', null, '수평', '{}'::text[], array['정답: 수평'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1259),
  ('hwang-exam-short-217', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '날짜 눈금을 회전시킬 때 돌리는 부분은?', null, '접안부', '{}'::text[], array['정답: 접안부'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1260),
  ('hwang-exam-short-218', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '날짜·시각 눈금을 맞춘 뒤 지정된 틀에 도입하는 별은?', null, '북극성', '{}'::text[], array['정답: 북극성'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1261),
  ('hwang-exam-short-219', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '그림의 날짜·시각 설정 예시 날짜는 몇 월 며칠인가?', null, '2월 2일', '{}'::text[], array['정답: 2월 2일'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1262),
  ('hwang-exam-short-220', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '그림의 날짜·시각 설정 예시 시각은?', null, '21:50', '{}'::text[], array['정답: 21:50'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1263),
  ('hwang-exam-short-221', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '자료의 2021년 정렬 예시에서 선택하는 것은 해당 연도의 무엇인가?', null, '포인터 위치', '{}'::text[], array['정답: 포인터 위치'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1264),
  ('hwang-exam-short-222', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 방식은 북극성 외의 별도 반드시 필요한가?', null, '아니다', '{}'::text[], array['정답: 아니다'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1265),
  ('hwang-exam-short-223', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '경도 보정과 수평 맞추기에 쓰는 눈금의 위치는 극축 몸체의 어디인가?', null, '측면', '{}'::text[], array['정답: 측면'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1266),
  ('hwang-exam-short-224', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '극축 망원경을 들여다보며 회전시켜 두 스케일을 맞추는 부분은?', null, '접안부', '{}'::text[], array['정답: 접안부'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1267),
  ('hwang-exam-short-225', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '북극성의 위치를 틀 안으로 좌우 이동시킬 때 사용하는 것은?', null, '방위각 미동 나사', '{}'::text[], array['정답: 방위각 미동 나사'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1268),
  ('hwang-exam-short-226', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '북극성의 위치를 틀 안으로 상하 이동시킬 때 사용하는 것은?', null, '고도 미동 나사', '{}'::text[], array['정답: 고도 미동 나사'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1269),
  ('hwang-exam-short-227', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '세차를 보정할 때 북극성 도입 틀에서 고려하는 시간 정보는?', null, '연도', '{}'::text[], array['정답: 연도'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1270),
  ('hwang-exam-short-228', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 북극성 도입 위치 세차보정 눈금의 간격은 몇 년 단위인가? 숫자만 쓰세요.', null, '10', '{}'::text[], array['정답: 10'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1271),
  ('hwang-exam-short-229', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '자료의 도해에서 Offset scale의 한글 의미는?', null, '보정 눈금', '{}'::text[], array['정답: 보정 눈금'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1272),
  ('hwang-exam-short-230', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '자료의 도해에서 Indicator의 한글 의미는?', null, '지시선', '{}'::text[], array['정답: 지시선'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1273),
  ('hwang-exam-short-231', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '자료의 도해에서 Scale clamp의 한글 의미는?', null, '눈금 클램프', '{}'::text[], array['정답: 눈금 클램프'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1274),
  ('hwang-exam-short-232', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '실제 레티클 시야에서 원 둘레의 두 겹 눈금은 날짜와 무엇인가?', null, '시간', '{}'::text[], array['정답: 시간'], '', '황윤환T · 행성우주과학 수정본', 46, null, null, 1275),
  ('hwang-exam-short-233', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '실제 레티클 시야의 중앙 십자에 북극성을 무조건 놓으면 되는가?', null, '아니다', '{}'::text[], array['정답: 아니다'], '', '황윤환T · 행성우주과학 수정본', 46, null, null, 1276),
  ('hwang-exam-short-234', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '실제 레티클에서 α UMi 옆 눈금의 연도별 위치 차이를 만드는 장기 변화는?', null, '세차', '{}'::text[], array['정답: 세차'], '', '황윤환T · 행성우주과학 수정본', 46, null, null, 1277),
  ('hwang-exam-short-235', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '실제 레티클 그림에서 α UMi가 표시된 작은 틀의 기능은?', null, '북극성 도입 위치 표시', '{}'::text[], array['정답: 북극성 도입 위치 표시'], '', '황윤환T · 행성우주과학 수정본', 46, null, null, 1278),
  ('hwang-exam-short-236', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '프로그램이 설치되어 있어야 하는 탐구 준비물은?', null, '스마트 기기', '{}'::text[], array['정답: 스마트 기기'], '', '황윤환T · 행성우주과학 수정본', 3, null, null, 1279),
  ('hwang-exam-short-237', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '어두운 환경에서 충돌을 막기 위해 장비 외에 위치를 확인하는 대상은?', null, '친구', '{}'::text[], array['정답: 친구'], '', '황윤환T · 행성우주과학 수정본', 3, null, null, 1280),
  ('hwang-exam-short-238', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '나사를 조이거나 풀 때 떨어지지 않도록 지지해야 하는 것은?', null, '무거운 장비', '{}'::text[], array['정답: 무거운 장비'], '', '황윤환T · 행성우주과학 수정본', 3, null, null, 1281),
  ('hwang-exam-short-239', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '우리나라에서 행성은 동쪽·남쪽·서쪽과 북쪽 중 어느 쪽 하늘을 주로 이용해 찾는가? 세 방향을 쓰세요.', null, '동쪽·남쪽·서쪽', '{}'::text[], array['정답: 동쪽·남쪽·서쪽'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1282),
  ('hwang-exam-short-240', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200에서 고속 운전 모드 변경은 가능한가?', null, '가능하다', '{}'::text[], array['정답: 가능하다'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1283),
  ('hwang-exam-short-241', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 모터 구동 체계를 수동으로 구동하는 것이 가능한가? 클램프를 풀고 축을 움직이는 것과 구별하여 답하세요.', null, '불가능하다', '{}'::text[], array['정답: 불가능하다'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1284),
  ('hwang-exam-short-242', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '적경의 영문 약자는?', null, 'R.A.', '{}'::text[], array['정답: R.A.'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1285),
  ('hwang-exam-short-243', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, '적위의 영문 약자는?', null, 'Dec.', '{}'::text[], array['정답: Dec.'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1286),
  ('hwang-exam-short-244', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200 도해에서 삼각대 다리를 고정하는 나사는?', null, '삼각대 잠금 나사', '{}'::text[], array['정답: 삼각대 잠금 나사'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1287),
  ('hwang-exam-short-245', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120 도해에서 후드 뒤쪽에 표시된 원형 부품은?', null, '후드 링', '{}'::text[], array['정답: 후드 링'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1288),
  ('hwang-exam-short-246', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120 도해에서 접안부 끝을 막는 덮개는?', null, '접안 캡', '{}'::text[], array['정답: 접안 캡'], '', '황윤환T · 행성우주과학 수정본', 22, null, null, 1289),
  ('hwang-exam-short-247', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리 캡 볼트와 함께 도해에 표시된 받침 부품은?', null, '와셔', '{}'::text[], array['정답: 와셔'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1290),
  ('hwang-exam-short-248', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '큰곰자리의 영문 약자는?', null, 'UMa', '{}'::text[], array['정답: UMa'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1291),
  ('hwang-exam-short-249', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '카시오페이아자리의 영문 약자는?', null, 'Cas', '{}'::text[], array['정답: Cas'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1292),
  ('hwang-exam-short-250', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '레티클 정밀도 2′에서 프라임 기호 ′의 각도 단위는?', null, '각분', '{}'::text[], array['정답: 각분'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1293),
  ('hwang-exam-written-001', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '천체 망원경 조립과 조정을 수업자료의 6단계 순서에 맞춰 자세히 설명하시오.', null, '① 평평한 곳에 삼각대를 설치하고 그 위에 가대를 장착한다.
② 균형추를 연결한 뒤 경통을 가대에 고정한다.
③ 파인더와 접안렌즈를 끼운다.
④ 경통 앞뒤의 적위축 균형과 경통·균형추 사이의 적경축 균형을 한 축씩 맞춘다.
⑤ 뚜렷하고 먼 목표를 주망원경 중앙에 넣고 파인더 십자선 교점도 같은 목표를 보게 조정한다.
⑥ 적도의 가대의 극축을 지구 자전축과 평행하게 정렬한다.', '{}'::text[], array['① 평평한 곳에 삼각대를 설치하고 그 위에 가대를 장착한다.', '② 균형추를 연결한 뒤 경통을 가대에 고정한다.', '③ 파인더와 접안렌즈를 끼운다.', '④ 경통 앞뒤의 적위축 균형과 경통·균형추 사이의 적경축 균형을 한 축씩 맞춘다.', '⑤ 뚜렷하고 먼 목표를 주망원경 중앙에 넣고 파인더 십자선 교점도 같은 목표를 보게 조정한다.', '⑥ 적도의 가대의 극축을 지구 자전축과 평행하게 정렬한다.'], '', '황윤환T · 행성우주과학 수정본', 7, null, null, 1294),
  ('hwang-exam-written-002', 'astronomy-hwang', 'written', '설치·안전·균형', null, '망원경 조립·관측 시 주의사항을 서로 다른 5가지로 쓰고 각각의 이유를 설명하시오.', null, '망원경과 파인더로 태양을 직접 보지 않는다. 강한 빛과 열로 실명할 위험이 있다.
경통 밴드를 과도하게 조이지 않는다. 경통이 변형되거나 광축이 틀어질 수 있다.
삼각대는 평평한 지면에 견고하게 설치한다. 무거운 가대를 안정적으로 지지해야 한다.
균형추를 넣은 뒤 추봉 끝의 안전 너트를 반드시 체결하고 수시로 확인한다. 추락하면 사람과 장비가 크게 다칠 수 있다.
가대가 젖는 우천 시 사용하지 않는다. 습기는 회로 쇼트와 윤활유 유실을 일으키므로 철수하거나 방수천으로 덮는다.', '{}'::text[], array['망원경과 파인더로 태양을 직접 보지 않는다. 강한 빛과 열로 실명할 위험이 있다.', '경통 밴드를 과도하게 조이지 않는다. 경통이 변형되거나 광축이 틀어질 수 있다.', '삼각대는 평평한 지면에 견고하게 설치한다. 무거운 가대를 안정적으로 지지해야 한다.', '균형추를 넣은 뒤 추봉 끝의 안전 너트를 반드시 체결하고 수시로 확인한다. 추락하면 사람과 장비가 크게 다칠 수 있다.', '가대가 젖는 우천 시 사용하지 않는다. 습기는 회로 쇼트와 윤활유 유실을 일으키므로 철수하거나 방수천으로 덮는다.'], '', '황윤환T · 행성우주과학 수정본', 12, null, null, 1295),
  ('hwang-exam-written-003', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '대상 선정부터 행성 관측까지 탐구의 전체 수행 순서를 설명하시오.', null, '관측할 행성을 정하고 같은 행성을 선택한 친구들과 모둠을 구성한다.
천체 관측 프로그램으로 관측 가능한 날짜·시간·방향과 하늘에 떠 있는 시간을 미리 파악한다.
망원경 구조와 설치 방법을 숙지하고 조립·균형·파인더·극축 정렬을 차례로 수행한다.
행성을 찾아 접안렌즈로 모습을 관측한다.', '{}'::text[], array['관측할 행성을 정하고 같은 행성을 선택한 친구들과 모둠을 구성한다.', '천체 관측 프로그램으로 관측 가능한 날짜·시간·방향과 하늘에 떠 있는 시간을 미리 파악한다.', '망원경 구조와 설치 방법을 숙지하고 조립·균형·파인더·극축 정렬을 차례로 수행한다.', '행성을 찾아 접안렌즈로 모습을 관측한다.'], '', '황윤환T · 행성우주과학 수정본', 4, null, null, 1296),
  ('hwang-exam-written-004', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '대물렌즈·접안렌즈·경통·파인더·가대·균형추·삼각대의 역할을 각각 설명하시오.', null, '대물렌즈는 볼록렌즈로 빛을 모아 상을 맺고 접안렌즈는 그 상을 확대한다.
경통은 대물렌즈·접안렌즈·파인더가 연결되는 몸체다.
파인더는 넓은 시야로 관측 대상을 찾는다.
가대는 경통과 삼각대를 연결하고 경통을 원하는 방향으로 움직이게 한다.
균형추는 경통과 무게 균형을 맞춰 원활한 작동을 돕는다.
삼각대는 망원경을 세우고 고정한다.', '{}'::text[], array['대물렌즈는 볼록렌즈로 빛을 모아 상을 맺고 접안렌즈는 그 상을 확대한다.', '경통은 대물렌즈·접안렌즈·파인더가 연결되는 몸체다.', '파인더는 넓은 시야로 관측 대상을 찾는다.', '가대는 경통과 삼각대를 연결하고 경통을 원하는 방향으로 움직이게 한다.', '균형추는 경통과 무게 균형을 맞춰 원활한 작동을 돕는다.', '삼각대는 망원경을 세우고 고정한다.'], '', '황윤환T · 행성우주과학 수정본', 6, null, null, 1297),
  ('hwang-exam-written-005', 'astronomy-hwang', 'written', '관측 준비와 기본 구조', null, '행성을 찾고 확대해 관측하며 시야 안에 유지하는 순서를 설명하시오.', null, '관측지의 동서남북을 확인하고 황도 부근의 동쪽·남쪽·서쪽 하늘에서 목표 행성을 찾는다.
행성을 파인더의 십자선 안에 넣은 뒤 주망원경 접안렌즈의 상을 찾는다.
저배율에서 고배율 순으로 접안렌즈를 바꾸며 관측한다.
극축을 기준으로 경통을 동서로 회전시켜 행성을 시야에 유지한다.', '{}'::text[], array['관측지의 동서남북을 확인하고 황도 부근의 동쪽·남쪽·서쪽 하늘에서 목표 행성을 찾는다.', '행성을 파인더의 십자선 안에 넣은 뒤 주망원경 접안렌즈의 상을 찾는다.', '저배율에서 고배율 순으로 접안렌즈를 바꾸며 관측한다.', '극축을 기준으로 경통을 동서로 회전시켜 행성을 시야에 유지한다.'], '', '황윤환T · 행성우주과학 수정본', 8, null, null, 1298),
  ('hwang-exam-written-006', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북쪽 방향과 북극성을 찾는 방법을 네 가지 이상 설명하시오.', null, '스마트폰이나 나침반으로 북쪽 방향을 찾는다.
해가 지는 방향이 서쪽인 것을 이용해 북쪽을 추정한다.
북극성 고도가 관측지 위도와 거의 같다는 점을 이용해 위치를 찾는다.
북두칠성의 국자 머리 두 별 간격을 약 5배 연장한다.
카시오페이아 W 양쪽 변의 연장선이 만나는 점에서 가운데 별까지의 간격을 약 5배 연장한다.', '{}'::text[], array['스마트폰이나 나침반으로 북쪽 방향을 찾는다.', '해가 지는 방향이 서쪽인 것을 이용해 북쪽을 추정한다.', '북극성 고도가 관측지 위도와 거의 같다는 점을 이용해 위치를 찾는다.', '북두칠성의 국자 머리 두 별 간격을 약 5배 연장한다.', '카시오페이아 W 양쪽 변의 연장선이 만나는 점에서 가운데 별까지의 간격을 약 5배 연장한다.'], '', '황윤환T · 행성우주과학 수정본', 9, null, null, 1299),
  ('hwang-exam-written-007', 'astronomy-hwang', 'written', 'EM200 구조와 수치', null, 'EM200의 두 회전축·구동·방위·고도 조절과 극축 망원경 사양을 설명하시오.', null, '적경과 적위 두 축으로 움직이며 웜휠 비는 180:1이다.
수정발진 제어의 스테핑 모터로 구동되고 고속 운전 모드 변경이 가능하다.
방위는 좌우 각각 15° 조정 가능하고 고도는 스크루 방식으로 0~50° 조절한다.
설정환의 적경 눈금은 자료 표기로 10′, 적위 눈금은 2°다.
9배율 극축 망원경이 고정 내장되어 있고 수평계가 있다.
자료에서 세차보정 눈금은 2030년까지 대응한다.', '{}'::text[], array['적경과 적위 두 축으로 움직이며 웜휠 비는 180:1이다.', '수정발진 제어의 스테핑 모터로 구동되고 고속 운전 모드 변경이 가능하다.', '방위는 좌우 각각 15° 조정 가능하고 고도는 스크루 방식으로 0~50° 조절한다.', '설정환의 적경 눈금은 자료 표기로 10′, 적위 눈금은 2°다.', '9배율 극축 망원경이 고정 내장되어 있고 수평계가 있다.', '자료에서 세차보정 눈금은 2030년까지 대응한다.'], '', '황윤환T · 행성우주과학 수정본', 11, null, null, 1300),
  ('hwang-exam-written-008', 'astronomy-hwang', 'written', '설치·안전·균형', null, '삼각대 설치를 삼각판·커넥터·브래킷·레버의 관계를 포함하여 설명하시오.', null, '평평한 곳을 골라 충분한 설치 공간과 장시간 수평 유지 조건을 확보한다.
삼각판을 다리에 부착하고 Boss/Connector를 다리 브래킷에 딸깍 고정한다.
퀵클램프 레버를 아래로 조여 잠근다.
다리 지지 브래킷과 삼각판이 견고하게 결합했는지 점검한다.', '{}'::text[], array['평평한 곳을 골라 충분한 설치 공간과 장시간 수평 유지 조건을 확보한다.', '삼각판을 다리에 부착하고 Boss/Connector를 다리 브래킷에 딸깍 고정한다.', '퀵클램프 레버를 아래로 조여 잠근다.', '다리 지지 브래킷과 삼각판이 견고하게 결합했는지 점검한다.'], '', '황윤환T · 행성우주과학 수정본', 13, null, null, 1301),
  ('hwang-exam-written-009', 'astronomy-hwang', 'written', '설치·안전·균형', null, 'EM200 가대 설치와 장착 너트 조임을 극축 정렬 전후로 구분하여 설명하시오.', null, '16 kg 가대는 두 사람이 협력하여 안전하게 옮긴다.
방위 조정 나사 사이에 삼각대 방위각 핀이 들어가도록 가대를 수직으로 설치한다.
가대 아래 장착 너트를 끼워 적당히 고정한다.
극축의 방위를 미세 조정할 수 있도록 너트를 지나치게 조이지 않고 유격을 둔다.
극축 조정이 끝나면 장착 너트를 완전히 조여 고정한다.', '{}'::text[], array['16 kg 가대는 두 사람이 협력하여 안전하게 옮긴다.', '방위 조정 나사 사이에 삼각대 방위각 핀이 들어가도록 가대를 수직으로 설치한다.', '가대 아래 장착 너트를 끼워 적당히 고정한다.', '극축의 방위를 미세 조정할 수 있도록 너트를 지나치게 조이지 않고 유격을 둔다.', '극축 조정이 끝나면 장착 너트를 완전히 조여 고정한다.'], '', '황윤환T · 행성우주과학 수정본', 14, null, null, 1302),
  ('hwang-exam-written-010', 'astronomy-hwang', 'written', '설치·안전·균형', null, '추봉과 균형추 장착 과정을 안전 너트의 역할과 함께 설명하시오.', null, '추봉 클램프를 풀고 추봉을 꺼낸 뒤 클램프를 단단히 잠근다.
추봉 끝의 안전 너트를 풀어 균형추를 끼운다.
균형추의 고정 나사를 잠그고 안전 너트를 다시 체결한다.
무게추 위치 조정 전에도 안전 너트 체결을 수시로 확인한다.
안전 너트는 균형추가 추봉 끝에서 빠져 추락하는 사고를 막는다.', '{}'::text[], array['추봉 클램프를 풀고 추봉을 꺼낸 뒤 클램프를 단단히 잠근다.', '추봉 끝의 안전 너트를 풀어 균형추를 끼운다.', '균형추의 고정 나사를 잠그고 안전 너트를 다시 체결한다.', '무게추 위치 조정 전에도 안전 너트 체결을 수시로 확인한다.', '안전 너트는 균형추가 추봉 끝에서 빠져 추락하는 사고를 막는다.'], '', '황윤환T · 행성우주과학 수정본', 15, null, null, 1303),
  ('hwang-exam-written-011', 'astronomy-hwang', 'written', '설치·안전·균형', null, '경통 밴드 장착부터 경통 고정까지의 과정과 주의사항을 설명하시오.', null, '가대 밴드 받침대에 경통 밴드를 두 개의 캡 볼트로 부착한다.
적위축을 돌려 경통을 수평으로 올릴 수 있게 해 미끄러짐과 낙하를 막는다.
경통을 올리고 밴드를 닫아 고정 너트를 적당히 조인다.
지나치게 조이면 경통 변형과 광축 틀어짐이 생길 수 있다.
캡 볼트와 육각렌치의 정위치를 기억해 분실을 막는다.', '{}'::text[], array['가대 밴드 받침대에 경통 밴드를 두 개의 캡 볼트로 부착한다.', '적위축을 돌려 경통을 수평으로 올릴 수 있게 해 미끄러짐과 낙하를 막는다.', '경통을 올리고 밴드를 닫아 고정 너트를 적당히 조인다.', '지나치게 조이면 경통 변형과 광축 틀어짐이 생길 수 있다.', '캡 볼트와 육각렌치의 정위치를 기억해 분실을 막는다.'], '', '황윤환T · 행성우주과학 수정본', 16, null, null, 1304),
  ('hwang-exam-written-012', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적경·적위 클램프의 풀기·잠그기 방향과 수동 조작 후 잠가야 하는 이유를 설명하시오.', null, '클램프를 포스트 쪽으로 돌리면 축이 풀려 수동 조작이 가능하다.
포스트 반대쪽으로 돌리면 축이 고정되어 모터 구동 준비가 된다.
목표를 파인더에 넣을 때 가대를 수동으로 움직일 수 있다.
수동 조작 뒤에는 클램프를 다시 고정하여 구동 체계가 확실히 연결되게 한다.', '{}'::text[], array['클램프를 포스트 쪽으로 돌리면 축이 풀려 수동 조작이 가능하다.', '포스트 반대쪽으로 돌리면 축이 고정되어 모터 구동 준비가 된다.', '목표를 파인더에 넣을 때 가대를 수동으로 움직일 수 있다.', '수동 조작 뒤에는 클램프를 다시 고정하여 구동 체계가 확실히 연결되게 한다.'], '', '황윤환T · 행성우주과학 수정본', 17, null, null, 1305),
  ('hwang-exam-written-013', 'astronomy-hwang', 'written', '설치·안전·균형', null, '균형을 맞춰야 하는 이유와 실제 관측 상태로 준비해야 하는 이유를 설명하시오.', null, '균형이 맞지 않으면 클램프를 조금만 풀어도 급격히 회전하여 위험하다.
모터 구동 시 기어에 큰 부담이 걸려 가대 수명이 짧아질 수 있다.
실제 관측에 사용할 접안렌즈·촬영 장비 등을 먼저 부착한다.
장비를 나중에 더 달면 무게 분포가 달라져 기존 균형이 깨지므로 관측 준비 상태에서 균형을 맞춘다.
적경 클램프를 풀어 적위축이 수평인 T 모양 준비 자세를 만든 뒤 안전하게 한 축씩 확인한다.', '{}'::text[], array['균형이 맞지 않으면 클램프를 조금만 풀어도 급격히 회전하여 위험하다.', '모터 구동 시 기어에 큰 부담이 걸려 가대 수명이 짧아질 수 있다.', '실제 관측에 사용할 접안렌즈·촬영 장비 등을 먼저 부착한다.', '장비를 나중에 더 달면 무게 분포가 달라져 기존 균형이 깨지므로 관측 준비 상태에서 균형을 맞춘다.', '적경 클램프를 풀어 적위축이 수평인 T 모양 준비 자세를 만든 뒤 안전하게 한 축씩 확인한다.'], '', '황윤환T · 행성우주과학 수정본', 18, null, null, 1306),
  ('hwang-exam-written-014', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적위축 중심의 균형 맞추기를 조절 부품과 움직임을 포함하여 설명하시오.', null, '경통이 갑자기 움직이지 않도록 지지하면서 적위 클램프를 천천히 푼다.
적위축 주위의 앞뒤 균형을 확인한다.
불균형이면 경통 밴드를 풀고 경통을 전후로 이동한다.
균형이 가장 좋은 위치에서 밴드를 고정한다.
카메라 등 부착물이 있다면 그 무게도 고려한다.', '{}'::text[], array['경통이 갑자기 움직이지 않도록 지지하면서 적위 클램프를 천천히 푼다.', '적위축 주위의 앞뒤 균형을 확인한다.', '불균형이면 경통 밴드를 풀고 경통을 전후로 이동한다.', '균형이 가장 좋은 위치에서 밴드를 고정한다.', '카메라 등 부착물이 있다면 그 무게도 고려한다.'], '', '황윤환T · 행성우주과학 수정본', 19, null, null, 1307),
  ('hwang-exam-written-015', 'astronomy-hwang', 'written', '설치·안전·균형', null, '적경축 중심의 균형 맞추기를 적위축 균형과 비교하여 설명하시오.', null, '두 축을 동시에 풀지 않고 한 축씩 안전하게 균형을 맞춘다.
적경 클램프를 풀어 극축 주위의 경통과 균형추 균형을 확인한다.
균형추를 추봉을 따라 이동해 가장 균형이 좋은 위치에서 고정한다.
추봉 끝까지 이동해도 경통 쪽이 무거우면 다른 균형추를 추가한다.
적위축 균형은 경통 전후 이동, 적경축 균형은 균형추 이동으로 조절한다.', '{}'::text[], array['두 축을 동시에 풀지 않고 한 축씩 안전하게 균형을 맞춘다.', '적경 클램프를 풀어 극축 주위의 경통과 균형추 균형을 확인한다.', '균형추를 추봉을 따라 이동해 가장 균형이 좋은 위치에서 고정한다.', '추봉 끝까지 이동해도 경통 쪽이 무거우면 다른 균형추를 추가한다.', '적위축 균형은 경통 전후 이동, 적경축 균형은 균형추 이동으로 조절한다.'], '', '황윤환T · 행성우주과학 수정본', 20, null, null, 1308),
  ('hwang-exam-written-016', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, 'TSA120의 접안부 연결 순서를 드로우튜브부터 끝까지 설명하시오.', null, '드로우튜브 뒤에 굴절용 50.8 어댑터를 연결한다.
그 뒤에 50.8 연장통 L을 연결한다.
50.8 슬리브를 연결한다.
아이피스 어댑터 접속환(단)을 연결한다.
끝에 31.7 아이피스 어댑터를 연결하여 해당 규격 아이피스를 장착한다.', '{}'::text[], array['드로우튜브 뒤에 굴절용 50.8 어댑터를 연결한다.', '그 뒤에 50.8 연장통 L을 연결한다.', '50.8 슬리브를 연결한다.', '아이피스 어댑터 접속환(단)을 연결한다.', '끝에 31.7 아이피스 어댑터를 연결하여 해당 규격 아이피스를 장착한다.'], '', '황윤환T · 행성우주과학 수정본', 23, null, null, 1309),
  ('hwang-exam-written-017', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '31.7 mm와 50.8 mm 아이피스 장착 과정의 차이를 설명하시오.', null, '31.7 mm(1.25인치)는 31.7 아이피스 어댑터의 고정환을 푼다.
접안 캡을 벗기고 아이피스를 넣은 뒤 고정환을 조인다.
50.8 mm(2인치)는 50.8 연장통 L의 고정 나사를 푼다.
50.8 슬리브부터 그 앞부분을 분리한다.
50.8 mm 아이피스를 넣고 고정 나사를 조여 고정한다.', '{}'::text[], array['31.7 mm(1.25인치)는 31.7 아이피스 어댑터의 고정환을 푼다.', '접안 캡을 벗기고 아이피스를 넣은 뒤 고정환을 조인다.', '50.8 mm(2인치)는 50.8 연장통 L의 고정 나사를 푼다.', '50.8 슬리브부터 그 앞부분을 분리한다.', '50.8 mm 아이피스를 넣고 고정 나사를 조여 고정한다.'], '', '황윤환T · 행성우주과학 수정본', 24, null, null, 1310),
  ('hwang-exam-written-018', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '주망원경의 초점 조절 과정과 초점이 크게 어긋났을 때의 현상을 설명하시오.', null, '드로우튜브 클램프가 풀려 있는지 확인한다.
초점 핸들을 돌려 드로우튜브를 앞뒤로 이동시킨다.
그림의 화살표 방향은 바깥쪽 인출이고 반대 방향은 안쪽 이동이다.
초점이 크게 어긋나면 별을 시야 안에 넣었어도 아무것도 보이지 않을 수 있다.
정확한 초점 조절이 망원경 성능과 좋은 사진을 위해 중요하다.', '{}'::text[], array['드로우튜브 클램프가 풀려 있는지 확인한다.', '초점 핸들을 돌려 드로우튜브를 앞뒤로 이동시킨다.', '그림의 화살표 방향은 바깥쪽 인출이고 반대 방향은 안쪽 이동이다.', '초점이 크게 어긋나면 별을 시야 안에 넣었어도 아무것도 보이지 않을 수 있다.', '정확한 초점 조절이 망원경 성능과 좋은 사진을 위해 중요하다.'], '', '황윤환T · 행성우주과학 수정본', 25, null, null, 1311),
  ('hwang-exam-written-019', 'astronomy-hwang', 'written', 'TSA120·접안부·후드', null, '후드를 끌어내는 순서와 후드 캡을 먼저 벗겨야 하는 이유를 설명하시오.', null, '후드 캡을 먼저 벗긴다.
후드 로크 나사 두 개를 푼다.
후드를 끌어낸다.
로크 나사 두 개를 다시 조인다.
후드 캡을 붙인 채 움직이면 이동이 어렵거나 캡이 튕겨 떨어질 수 있다.
관측 시 후드는 미광을 막고 이동 시에는 반대 순서로 격납해 부피를 줄인다.', '{}'::text[], array['후드 캡을 먼저 벗긴다.', '후드 로크 나사 두 개를 푼다.', '후드를 끌어낸다.', '로크 나사 두 개를 다시 조인다.', '후드 캡을 붙인 채 움직이면 이동이 어렵거나 캡이 튕겨 떨어질 수 있다.', '관측 시 후드는 미광을 막고 이동 시에는 반대 순서로 격납해 부피를 줄인다.'], '', '황윤환T · 행성우주과학 수정본', 26, null, null, 1312),
  ('hwang-exam-written-020', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더 다리와 파인더를 부착하는 과정을 설명하고 다리 없이 캡 볼트를 조이면 안 되는 이유를 쓰시오.', null, '파인더 다리 전후를 확인하고 접안체에 캡 볼트와 와셔로 단단히 고정한다.
파인더 경통과 주망원경 경통을 가능한 한 평행하게 하도록 조정 나사를 균등하게 조인다.
다리 내부의 나사 끝이 튀어나오지 않도록 한 뒤 파인더를 삽입한다.
파인더가 다리 중앙에 오도록 세 개의 고정 비스를 균등하게 조인다.
다리 없이 캡 볼트를 조이면 끝이 드로우튜브에 닿아 흠집이나 움직임 장애를 일으킬 수 있다.', '{}'::text[], array['파인더 다리 전후를 확인하고 접안체에 캡 볼트와 와셔로 단단히 고정한다.', '파인더 경통과 주망원경 경통을 가능한 한 평행하게 하도록 조정 나사를 균등하게 조인다.', '다리 내부의 나사 끝이 튀어나오지 않도록 한 뒤 파인더를 삽입한다.', '파인더가 다리 중앙에 오도록 세 개의 고정 비스를 균등하게 조인다.', '다리 없이 캡 볼트를 조이면 끝이 드로우튜브에 닿아 흠집이나 움직임 장애를 일으킬 수 있다.'], '', '황윤환T · 행성우주과학 수정본', 27, null, null, 1313),
  ('hwang-exam-written-021', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더의 역할과 초점을 맞추는 3단계를 설명하시오.', null, '파인더는 저배율·넓은 시야의 소형 망원경이며 십자선이 있다.
주망원경의 고배율 시야는 좁으므로 파인더와 주망원경 광축을 평행하게 해 목표 도입을 쉽게 한다.
접안부 고정링을 푼다.
경치를 보며 접안부를 좌우로 돌려 초점이 맞는 위치를 찾는다.
초점이 맞으면 접안부 고정링을 다시 조인다.', '{}'::text[], array['파인더는 저배율·넓은 시야의 소형 망원경이며 십자선이 있다.', '주망원경의 고배율 시야는 좁으므로 파인더와 주망원경 광축을 평행하게 해 목표 도입을 쉽게 한다.', '접안부 고정링을 푼다.', '경치를 보며 접안부를 좌우로 돌려 초점이 맞는 위치를 찾는다.', '초점이 맞으면 접안부 고정링을 다시 조인다.'], '', '황윤환T · 행성우주과학 수정본', 29, null, null, 1314),
  ('hwang-exam-written-022', 'astronomy-hwang', 'written', '파인더·초점·광축', null, '파인더의 광축을 주망원경 광축과 맞추는 과정을 순서대로 자세히 설명하시오.', null, '주망원경을 안시용으로 세팅하고 저배율 아이피스를 끼운다.
가능한 한 먼 뚜렷한 목표를 주망원경 시야 중앙에 넣고 경통을 고정한다.
고배율 아이피스로 교체하고 목표를 다시 중앙에 넣어 고정한다.
파인더에서 같은 목표가 십자선 교점에 오도록 조정 나사를 조절한다.
록 너트는 조정 나사 머리 쪽에 바짝 붙인다.
그림의 큰 화살표 방향으로 접안부를 옮기려면 a·b를 풀면서 c를 조금씩 누른다. 앞부분은 접안부의 반대 방향으로 이동한다.', '{}'::text[], array['주망원경을 안시용으로 세팅하고 저배율 아이피스를 끼운다.', '가능한 한 먼 뚜렷한 목표를 주망원경 시야 중앙에 넣고 경통을 고정한다.', '고배율 아이피스로 교체하고 목표를 다시 중앙에 넣어 고정한다.', '파인더에서 같은 목표가 십자선 교점에 오도록 조정 나사를 조절한다.', '록 너트는 조정 나사 머리 쪽에 바짝 붙인다.', '그림의 큰 화살표 방향으로 접안부를 옮기려면 a·b를 풀면서 c를 조금씩 누른다. 앞부분은 접안부의 반대 방향으로 이동한다.'], '', '황윤환T · 행성우주과학 수정본', 30, null, null, 1315),
  ('hwang-exam-written-023', 'astronomy-hwang', 'written', '손질과 보관', null, '렌즈를 손질하는 순서와 청소 도구 선택, 이슬 자국에 대한 주의사항을 설명하시오.', null, '사용 때마다 블로어로 먼지와 티끌을 먼저 불어낸다.
이슬로 붙은 먼지나 자국은 오래 두면 지워지지 않으므로 조기에 청소한다.
직접 닦는 것은 권장하지 않지만 필요한 가벼운 오염은 무수 에탄올과 렌즈 청소용 클리닝 페이퍼를 사용한다.
닦기 전에 충분히 먼지를 제거하고 렌즈에 상처가 나지 않도록 가볍게 닦는다.', '{}'::text[], array['사용 때마다 블로어로 먼지와 티끌을 먼저 불어낸다.', '이슬로 붙은 먼지나 자국은 오래 두면 지워지지 않으므로 조기에 청소한다.', '직접 닦는 것은 권장하지 않지만 필요한 가벼운 오염은 무수 에탄올과 렌즈 청소용 클리닝 페이퍼를 사용한다.', '닦기 전에 충분히 먼지를 제거하고 렌즈에 상처가 나지 않도록 가볍게 닦는다.'], '', '황윤환T · 행성우주과학 수정본', 32, null, null, 1316),
  ('hwang-exam-written-024', 'astronomy-hwang', 'written', '손질과 보관', null, 'TSA120 사용·보관 시 주의사항 4가지와 각각의 이유를 설명하시오.', null, '급격한 온도 변화를 피한다. 렌즈가 흐려지거나 극단적 온도 차에서 깨질 수 있다.
이슬·습기를 충분히 말린 뒤 통풍되는 곳에 보관한다. 곰팡이·변색·부식을 막는다.
임의로 분해하지 않는다. 전용 치구 없이 분해하면 파손 위험이 있고 설정 장치 없이 재조립하면 상이 악화될 수 있다.
스프레이식 에어 클리너를 쓰지 않는다. 국부 냉각이 렌즈 파손을 유발하므로 상온으로 안정된 상태에서 블로어를 쓴다.', '{}'::text[], array['급격한 온도 변화를 피한다. 렌즈가 흐려지거나 극단적 온도 차에서 깨질 수 있다.', '이슬·습기를 충분히 말린 뒤 통풍되는 곳에 보관한다. 곰팡이·변색·부식을 막는다.', '임의로 분해하지 않는다. 전용 치구 없이 분해하면 파손 위험이 있고 설정 장치 없이 재조립하면 상이 악화될 수 있다.', '스프레이식 에어 클리너를 쓰지 않는다. 국부 냉각이 렌즈 파손을 유발하므로 상온으로 안정된 상태에서 블로어를 쓴다.'], '', '황윤환T · 행성우주과학 수정본', 33, null, null, 1317),
  ('hwang-exam-written-025', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북극성이 거의 고정된 별처럼 보이는 이유와 극축을 북극성 자체에 그대로 맞추면 안 되는 이유를 설명하시오.', null, '북극성은 작은곰자리 α UMi이며 천구 북극에서 약 0.7°밖에 떨어져 있지 않다.
북극성도 천구 북극을 중심으로 작은 원을 그리며 일주운동하므로 완전히 고정되어 있지 않다.
극축의 목표는 북극성이 아닌 천구 북극이며 지구 자전축과 평행해야 한다.
레티클의 날짜·시간과 연도별 도입 틀로 북극성의 북극에 대한 위치 차이를 고려한다.', '{}'::text[], array['북극성은 작은곰자리 α UMi이며 천구 북극에서 약 0.7°밖에 떨어져 있지 않다.', '북극성도 천구 북극을 중심으로 작은 원을 그리며 일주운동하므로 완전히 고정되어 있지 않다.', '극축의 목표는 북극성이 아닌 천구 북극이며 지구 자전축과 평행해야 한다.', '레티클의 날짜·시간과 연도별 도입 틀로 북극성의 북극에 대한 위치 차이를 고려한다.'], '', '황윤환T · 행성우주과학 수정본', 35, null, null, 1318),
  ('hwang-exam-written-026', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '북두칠성과 카시오페이아를 이용해 북극성을 찾는 두 방법과 두 별자리를 함께 활용하는 이유를 설명하시오.', null, '북두칠성 국자 머리 부분의 두 별 간격을 북극성 방향으로 약 5배 연장한다.
카시오페이아 W 양쪽 변 연장선의 교점에서 가운데 별까지의 간격을 북극성 방향으로 약 5배 연장한다.
두 별자리는 북극성을 중심으로 서로 반대편에 있어 둘 중 하나는 높은 고도에서 잘 보인다.
북극성은 정북 방향에 있고 고도는 관측자의 위도와 거의 같다.', '{}'::text[], array['북두칠성 국자 머리 부분의 두 별 간격을 북극성 방향으로 약 5배 연장한다.', '카시오페이아 W 양쪽 변 연장선의 교점에서 가운데 별까지의 간격을 북극성 방향으로 약 5배 연장한다.', '두 별자리는 북극성을 중심으로 서로 반대편에 있어 둘 중 하나는 높은 고도에서 잘 보인다.', '북극성은 정북 방향에 있고 고도는 관측자의 위도와 거의 같다.'], '', '황윤환T · 행성우주과학 수정본', 36, null, null, 1319),
  ('hwang-exam-written-027', 'astronomy-hwang', 'written', '북극성·극축 원리', null, '극축 정렬의 정의·준비 조건·필요성을 설명하시오. 표류법은 쓰지 마시오.', null, '극축 정렬은 적경축인 극축을 지구 자전축과 나란하게 만드는 과정이다.
극축과 지평면의 각을 관측지 위도와 같게 한다.
지평면에 투영된 극축이 정북을 향하게 한다.
정렬이 불충분하면 일주운동에 따른 대상 이동을 정확히 보상하지 못해 시야에서 이탈한다.
자료에서는 시야 이탈 속도가 배율에 비례하므로 고배율 관측과 어두운 천체의 장노출 촬영에서 중요하다.', '{}'::text[], array['극축 정렬은 적경축인 극축을 지구 자전축과 나란하게 만드는 과정이다.', '극축과 지평면의 각을 관측지 위도와 같게 한다.', '지평면에 투영된 극축이 정북을 향하게 한다.', '정렬이 불충분하면 일주운동에 따른 대상 이동을 정확히 보상하지 못해 시야에서 이탈한다.', '자료에서는 시야 이탈 속도가 배율에 비례하므로 고배율 관측과 어두운 천체의 장노출 촬영에서 중요하다.'], '', '황윤환T · 행성우주과학 수정본', 38, null, null, 1320),
  ('hwang-exam-written-028', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 극축 망원경의 레티클을 들여다볼 수 있도록 준비하는 과정을 설명하시오.', null, '극축 망원경 앞뒤 커버를 모두 연다.
적위 클램프를 푼다.
무게추 봉 앞에서 구멍을 들여다보며 적위축을 돌린다.
구멍을 통해 극축 망원경 전체가 보이도록 적위축의 위치를 맞춘다.', '{}'::text[], array['극축 망원경 앞뒤 커버를 모두 연다.', '적위 클램프를 푼다.', '무게추 봉 앞에서 구멍을 들여다보며 적위축을 돌린다.', '구멍을 통해 극축 망원경 전체가 보이도록 적위축의 위치를 맞춘다.'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1321),
  ('hwang-exam-written-029', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 레티클의 외측·내측 원, 내부 북반구·남반구 눈금과 정밀도·연도 보정을 설명하시오.', null, '외측 원은 날짜, 내측 원은 시간을 표시한다.
내부 α UMi 눈금은 북반구의 북극성 도입용이다.
내부 σ Oct 눈금은 남반구의 시그마 옥탄 도입용이다.
자료에서는 2030년까지 남북반구 극을 2′ 이내로 정렬할 수 있다.
세차에 따른 북극성 도입 위치 보정은 10년 단위 눈금으로 표시된다.', '{}'::text[], array['외측 원은 날짜, 내측 원은 시간을 표시한다.', '내부 α UMi 눈금은 북반구의 북극성 도입용이다.', '내부 σ Oct 눈금은 남반구의 시그마 옥탄 도입용이다.', '자료에서는 2030년까지 남북반구 극을 2′ 이내로 정렬할 수 있다.', '세차에 따른 북극성 도입 위치 보정은 10년 단위 눈금으로 표시된다.'], '', '황윤환T · 행성우주과학 수정본', 43, null, null, 1322),
  ('hwang-exam-written-030', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200의 극축 정렬 과정을 4단계로 자세히 설명하시오.', null, '① 극축 몸체 측면의 눈금으로 관측지 경도를 보정한다.
② 수평계를 이용해 수평을 맞추고 극축 고도와 방향의 기본 준비를 확인한다.
③ 극축 망원경을 들여다보며 접안부를 회전하여 외측 날짜와 내측 시간 눈금을 현재 날짜·시각에 맞춘다.
④ 방위각·고도 미동 나사를 조절하여 북극성을 해당 연도의 α UMi 도입 틀 위치에 넣는다.
북극성을 중앙 십자에 무조건 넣지 않고 세차를 고려한 연도별 위치에 도입한다.', '{}'::text[], array['① 극축 몸체 측면의 눈금으로 관측지 경도를 보정한다.', '② 수평계를 이용해 수평을 맞추고 극축 고도와 방향의 기본 준비를 확인한다.', '③ 극축 망원경을 들여다보며 접안부를 회전하여 외측 날짜와 내측 시간 눈금을 현재 날짜·시각에 맞춘다.', '④ 방위각·고도 미동 나사를 조절하여 북극성을 해당 연도의 α UMi 도입 틀 위치에 넣는다.', '북극성을 중앙 십자에 무조건 넣지 않고 세차를 고려한 연도별 위치에 도입한다.'], '', '황윤환T · 행성우주과학 수정본', 44, null, null, 1323),
  ('hwang-exam-written-031', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200에서 날짜·시각·연도가 각각 어느 눈금과 조작에 연결되는지 설명하시오.', null, '날짜는 레티클 외측 원, 시각은 내측 원 눈금에 해당한다.
접안부를 회전하여 두 스케일을 현재 날짜와 시각에 맞춘다.
연도는 세차에 따른 α UMi 도입 틀의 포인터 위치 선택에 쓰인다.
방위각·고도 미동 나사로 북극성을 그 위치에 옮긴다.
자료의 2021년 예시는 원리 설명용이며 실제 정렬에서는 현재 연도에 맞는 눈금을 고려한다.', '{}'::text[], array['날짜는 레티클 외측 원, 시각은 내측 원 눈금에 해당한다.', '접안부를 회전하여 두 스케일을 현재 날짜와 시각에 맞춘다.', '연도는 세차에 따른 α UMi 도입 틀의 포인터 위치 선택에 쓰인다.', '방위각·고도 미동 나사로 북극성을 그 위치에 옮긴다.', '자료의 2021년 예시는 원리 설명용이며 실제 정렬에서는 현재 연도에 맞는 눈금을 고려한다.'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1324),
  ('hwang-exam-written-032', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, '실제 레티클 시야를 해석하고 중앙 십자·두 겹 원 눈금·α UMi 도입 틀을 구분하시오.', null, '중앙 십자는 레티클의 중심 기준이다.
원 둘레의 바깥 눈금은 날짜, 안쪽 눈금은 시각이다.
α UMi 옆 작은 틀은 북극성 도입 위치를 표시하고 연도 눈금은 세차 보정용이다.
북극성은 중앙 십자가 아니라 날짜·시간·연도에 대응하는 도입 틀 위치에 둔다.
실제 사진은 보는 방향에 따라 틀이 돌아가 보일 수 있으므로 틀의 α UMi 표기와 눈금의 기능을 기준으로 구분한다.', '{}'::text[], array['중앙 십자는 레티클의 중심 기준이다.', '원 둘레의 바깥 눈금은 날짜, 안쪽 눈금은 시각이다.', 'α UMi 옆 작은 틀은 북극성 도입 위치를 표시하고 연도 눈금은 세차 보정용이다.', '북극성은 중앙 십자가 아니라 날짜·시간·연도에 대응하는 도입 틀 위치에 둔다.', '실제 사진은 보는 방향에 따라 틀이 돌아가 보일 수 있으므로 틀의 α UMi 표기와 눈금의 기능을 기준으로 구분한다.'], '', '황윤환T · 행성우주과학 수정본', 46, null, null, 1325),
  ('hwang-exam-written-033', 'astronomy-hwang', 'written', 'EM200 레티클과 정렬', null, 'EM200 정렬의 장점과 북극성 하나만으로 정렬 가능한 이유를 설명하시오.', null, '레티클에 날짜·시간과 세차를 고려한 북극성 위치가 정해져 있다.
현재 날짜·시간에 맞추고 해당 연도의 도입 위치를 사용하면 북극성의 천구 북극 주변 위치를 고려할 수 있다.
방위각과 고도 미동 나사로 북극성을 정해진 틀에 도입한다.
다른 별 없이 북극성만 시야에 있으면 충분하므로 하늘이 아주 어둡지 않아도 신속하고 정확하게 정렬할 수 있다.', '{}'::text[], array['레티클에 날짜·시간과 세차를 고려한 북극성 위치가 정해져 있다.', '현재 날짜·시간에 맞추고 해당 연도의 도입 위치를 사용하면 북극성의 천구 북극 주변 위치를 고려할 수 있다.', '방위각과 고도 미동 나사로 북극성을 정해진 틀에 도입한다.', '다른 별 없이 북극성만 시야에 있으면 충분하므로 하늘이 아주 어둡지 않아도 신속하고 정확하게 정렬할 수 있다.'], '', '황윤환T · 행성우주과학 수정본', 45, null, null, 1326)
on conflict (id) do nothing;
select count(*) as hwang_exam_rows from public.cards where id like 'hwang-exam-%';
commit;
