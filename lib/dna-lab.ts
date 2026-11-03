// 박상영T 수행평가 「구강상피세포 DNA 추출 · NanoDrop 정량」 실습(5.0.0~)의 계산.
// 근거: 수행평가 설명서(마이크로피펫 · DNA 추출 4단계 · NanoDrop One · 보고서 공식). 화면은 components/swipe/DnaLab.tsx.

export type PipetteModel = 'P20' | 'P100' | 'P200' | 'P1000';
export type Digits = [number, number, number];

/** 표시창은 위에서 아래로 세 자리. places는 각 자리가 나타내는 값(µL). */
export const PIPETTES: Record<PipetteModel, { min: number; max: number; tip: '노란색' | '파란색'; places: [number, number, number]; read: string }> = {
  P20: { min: 2, max: 20, tip: '노란색', places: [10, 1, 0.1], read: '십의 자리 · 일의 자리 · 소수 첫째 자리' },
  P100: { min: 10, max: 100, tip: '노란색', places: [100, 10, 1], read: '백의 자리 · 십의 자리 · 일의 자리' },
  P200: { min: 20, max: 200, tip: '노란색', places: [100, 10, 1], read: '백의 자리 · 십의 자리 · 일의 자리' },
  P1000: { min: 100, max: 1000, tip: '파란색', places: [1000, 100, 10], read: '천의 자리 · 백의 자리 · 십의 자리' },
};
export const MODELS = Object.keys(PIPETTES) as PipetteModel[];

const round1 = (x: number) => Math.round(x * 10) / 10;
/** 표시창 숫자 세 개 → 설정 용량(µL). 예: P20 0·8·5 = 8.5, P200 0·7·5 = 75, P1000 0·2·5 = 250. */
export const displayValue = (model: PipetteModel, digits: Digits) => round1(digits.reduce((sum, d, i) => sum + d * PIPETTES[model].places[i], 0));
export const inRange = (model: PipetteModel, volume: number) => volume >= PIPETTES[model].min && volume <= PIPETTES[model].max;
/** 피펫 선택 2대 원칙: 범위 안에 들어가는 것 중 가장 작은 모델(최대 용량 근처가 상대 오차가 가장 작다). */
export const pickPipette = (volume: number): PipetteModel | null => MODELS.find(model => inRange(model, volume)) ?? null;

export const WATER_DENSITY = 0.998; // 20°C 증류수, mg/µL
/** 저울로 잰 물의 질량(mg) → 실제로 옮겨진 부피(µL). */
export const volumeFromMass = (mg: number) => mg / WATER_DENSITY;
/** 오차(%) = (평균 측정 부피 − 설정 용량) ÷ 설정 용량 × 100. 목표는 ±2% 이내. */
export const errorPercent = (measured: number, setting: number) => (measured - setting) / setting * 100;
/** dsDNA 농도(ng/µL) = A260 × 50 (10 mm 광경로 기준). */
export const dnaConcentration = (a260: number) => a260 * 50;
/** 총 DNA 수득량(µg) = 농도(ng/µL) × 용출 부피(µL) ÷ 1,000. */
export const totalYield = (concentration: number, volume: number) => concentration * volume / 1000;

export type Absorbance = { a260: number; a230: number; a280: number };
export type Contaminant = 'protein' | 'salt' | 'rna';
export const CONTAMINANTS: Record<Contaminant, { label: string; note: string; add: Absorbance }> = {
  // 오염 물질이 남으면 그 물질이 잘 흡수하는 파장의 흡광도가 커진다(설명을 위한 모형 값).
  protein: { label: '단백질이 남음', note: '용해 · 세척이 덜 됨', add: { a260: 0.006, a280: 0.04, a230: 0.012 } },
  salt: { label: '염 · 에탄올이 남음', note: '세척 · 건조 원심분리가 덜 됨', add: { a260: 0, a280: 0, a230: 0.11 } },
  rna: { label: 'RNA가 섞임', note: 'RNA도 260 nm를 흡수', add: { a260: 0.12, a280: 0.06, a230: 0.055 } },
};
/** 순수한 dsDNA 시료(모형): A260/A280 ≈ 1.8, A260/A230 ≈ 2.0. */
export const PURE: Absorbance = { a260: 0.3, a280: 0.165, a230: 0.15 };
export const measure = (contaminants: Contaminant[]): Absorbance => contaminants.reduce((sum, c) => ({
  a260: sum.a260 + CONTAMINANTS[c].add.a260, a280: sum.a280 + CONTAMINANTS[c].add.a280, a230: sum.a230 + CONTAMINANTS[c].add.a230,
}), { ...PURE });
export const ratios = ({ a260, a280, a230 }: Absorbance) => ({ r280: a260 / a280, r230: a260 / a230 });
/** 해석표: 오염 물질이 남으면 분모(A280 · A230)가 커져 비율이 기준보다 낮아진다. */
export const judge280 = (r: number) => r < 1.75 ? 'low' as const : r > 2.0 ? 'high' as const : 'ok' as const;
export const judge230 = (r: number) => r < 1.8 ? 'low' as const : 'ok' as const;
