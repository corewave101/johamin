// 롯데 페이지에서 문제를 풀 때마다 화면 위쪽에 켜지는 빨강 · 파랑 네온사인(4.8.0~).
// 문제 화면(SwipeGame)이 보내는 'johamin:answer' 신호를 듣는다. 위 줄은 빨강, 아래 줄은 파랑 네온.
// 4.8.1~: 부산 사투리 문구, 틀리면 30%는 원중이가 아래에서 튀어나와 "뭐라노".
import { useEffect, useRef, useState } from 'react';
import { neonFor, type AnswerSignal, type NeonCue } from '../../lib/lotte-neon';
import { playScare } from '../../lib/scare-sounds';

const SHOW_MS = 1700;
const WONJUNG_MS = 1500;
const PLAYER = `${import.meta.env.BASE_URL}lotte/player.webp`;

export default function LotteNeon() {
  const [cue, setCue] = useState<(NeonCue & { id: number }) | null>(null);
  const turn = useRef({ good: Math.floor(Math.random() * 8), bad: 0 });
  const timer = useRef(0);
  useEffect(() => {
    const onAnswer = (event: Event) => {
      const signal = (event as CustomEvent<AnswerSignal>).detail;
      const tone = signal.correct && !signal.unknown ? 'good' : 'bad';
      const next = neonFor(signal, turn.current[tone]);
      turn.current[tone] += 1;
      if (next.kind === 'wonjung') playScare('huh');
      clearTimeout(timer.current);
      setCue({ ...next, id: performance.now() });
      timer.current = window.setTimeout(() => setCue(null), next.kind === 'wonjung' ? WONJUNG_MS : SHOW_MS);
    };
    window.addEventListener('johamin:answer', onAnswer);
    return () => { window.removeEventListener('johamin:answer', onAnswer); clearTimeout(timer.current); };
  }, []);
  if (!cue) return null;
  if (cue.kind === 'wonjung') return <div key={cue.id} className="lotte-wonjung" role="status" aria-live="polite">
    <p className="lotte-neon-line is-red lotte-wonjung-text">{cue.text}</p>
    <img src={PLAYER} alt="원중이" draggable={false} />
  </div>;
  const long = Math.max(cue.top.length, cue.bottom.length) > 7;
  return <div key={cue.id} className={`lotte-neon is-${cue.tone}${long ? ' is-long' : ''}`} role="status" aria-live="polite">
    <p className="lotte-neon-line is-red">{cue.top}</p>
    <p className="lotte-neon-line is-blue">{cue.bottom}</p>
  </div>;
}
