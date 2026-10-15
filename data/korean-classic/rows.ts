// 국어(고전 시가) 카드 한 줄: [질문, [정답, 오답, 오답, 오답], 해설, 학습지 쪽, 단원, 검토 메모?]
// 정답이 첫 칸이고, 게임이 네 방향을 매번 섞는다. 검토 메모: '★ …' = 필기를 사실에 맞게 고침, '☆ …' = 학습지 문구 그대로지만 확인 필요.
export type ClassicRow = [question: string, choices: [string, string, string, string], explanation: string, page: number, topic: string, review?: string];
