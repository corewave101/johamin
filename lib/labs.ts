// 덱에 붙는 실습 화면(학습 메뉴 맨 앞에 나온다). 4.10.0~: 양동비T 덱처럼 실습이 둘 이상이면 배열로 쓴다.
// 카드 묶음(data/)을 불러오지 않도록 여기에 둔다.
export type LabKind = 'optics' | 'polarization' | 'structure';
export const labsOf = (deck: { lab?: LabKind | LabKind[] }): LabKind[] => deck.lab === undefined ? [] : Array.isArray(deck.lab) ? deck.lab : [deck.lab];
