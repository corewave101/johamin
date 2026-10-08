export interface CardPortrait { name: string; field: string; image: string; remoteImage: string; source: string }
// Public-domain archival portraits. These are related scholars/authors, not teacher photos.
const archival = {
  biology: { name: 'Gregor Mendel', field: '유전학 · 그레고어 멘델', image: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Gregor_Mendel_portrait.jpg', source: 'https://commons.wikimedia.org/wiki/File:Gregor_Mendel_portrait.jpg' },
  astronomy: { name: 'Galileo Galilei', field: '천문학 · 갈릴레오 갈릴레이', image: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Portrait_of_Galileo_Galilei.jpg', source: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Galileo_Galilei.jpg' },
  english: { name: 'Herman Melville', field: 'Bartleby 작가 · 허먼 멜빌', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Herman_Melville_1885.jpg', source: 'https://commons.wikimedia.org/wiki/File:Herman_Melville_1885.jpg' },
  social: { name: 'Immanuel Kant', field: '평화·윤리 · 임마누엘 칸트', image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Immanuel_Kant_%28painted_portrait%29.jpg', source: 'https://commons.wikimedia.org/wiki/File:Immanuel_Kant_(painted_portrait).jpg' },
  korean: { name: 'Ju Si-gyeong', field: '국어학 · 주시경', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Ju_si_gyeong_in_Hangul_vol_1_no_3.png', source: 'https://commons.wikimedia.org/wiki/File:Ju_si_gyeong_in_Hangul_vol_1_no_3.png' },
  kepler: { name: 'Johannes Kepler', field: '행성 운동 · 요하네스 케플러', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Johannes_Kepler.jpg', source: 'https://commons.wikimedia.org/wiki/File:Johannes_Kepler.jpg' },
};
export const portraits: Record<string, CardPortrait> = Object.fromEntries(Object.entries(archival).map(([key, p]) => [key, { ...p, remoteImage: p.image, image: `./portraits/${key}.${key === 'korean' ? 'png' : 'jpg'}` }]));
export const portraitFor = (id = '', topic = ''): CardPortrait => {
  if (id.startsWith('english')) return portraits.english;
  if (id.startsWith('biology')) return portraits.biology;
  if (id.startsWith('social')) return portraits.social;
  if (id.startsWith('astronomy')) return /케플러|행성 운동/.test(topic) ? portraits.kepler : portraits.astronomy;
  if (/korean/.test(id) || /국어|문법|표기|맞춤법|띄어쓰기|시가|제과점/.test(topic)) return portraits.korean;
  if (/케플러|행성 운동/.test(topic)) return portraits.kepler;
  if (/biology|park|jo$/.test(id) || /유전|RNA|전사|번역|돌연변|형질|오페론|DNA|생물/.test(topic)) return portraits.biology;
  if (/astronomy/.test(id) || /천문|우주|행성|망원경|관측|천구|케플러|달|별|황|\(전\)/.test(topic)) return portraits.astronomy;
  if (/social/.test(id) || /사회|평화|정의|불평등|국제|세계화/.test(topic)) return portraits.social;
  return portraits.english;
};
