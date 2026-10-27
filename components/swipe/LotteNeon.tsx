// 롯데 페이지에서 문제를 맞힐 때마다 화면 위쪽에 켜지는 빨강 · 파랑 네온사인(4.8.0~).
// 문제 화면(SwipeGame)이 보내는 'johamin:answer' 신호를 듣는다. 위 줄은 빨강, 아래 줄은 파랑 네온.
import { useEffect, useRef, useState } from 'react';
import { NEON_LINES, neonFor, type AnswerSignal } from '../../lib/lotte-neon';

type Sign = { id: number; top: string; bottom: string };

const SHOW_MS = 1700;

export default function LotteNeon() {
  const [sign, setSign] = useState<Sign | null>(null);
  const turn = useRef(Math.floor(Math.random() * NEON_LINES.length));
  const timer = useRef(0);
  useEffect(() => {
    const onAnswer = (event: Event) => {
      const lines = neonFor((event as CustomEvent<AnswerSignal>).detail, turn.current);
      if (!lines) return;
      if (lines === NEON_LINES[turn.current % NEON_LINES.length]) turn.current += 1;
      clearTimeout(timer.current);
      setSign({ id: performance.now(), top: lines[0], bottom: lines[1] });
      timer.current = window.setTimeout(() => setSign(null), SHOW_MS);
    };
    window.addEventListener('johamin:answer', onAnswer);
    return () => { window.removeEventListener('johamin:answer', onAnswer); clearTimeout(timer.current); };
  }, []);
  if (!sign) return null;
  return <div key={sign.id} className="lotte-neon" role="status" aria-live="polite">
    <p className="lotte-neon-line is-red">{sign.top}</p>
    <p className="lotte-neon-line is-blue">{sign.bottom}</p>
  </div>;
}
