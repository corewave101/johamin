// 화면 구석에서 롯데 자이언츠 로고가 삐쭉. 누르면 시작 화면 동전처럼 가운데로 날아와 반짝 · 펑펑 하고 롯데 페이지(/lotte/)로 간다.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { LOTTE_URL } from '../../lib/exam';
import { playResult } from '../../lib/sound';
import { isOn, onToggle } from '../../lib/settings';

const LOGO = `${import.meta.env.BASE_URL}lotte/logo.svg`;
const FLIGHT_MS = 2100;
const COLORS = ['#d01031', '#ffffff', '#62b1e3', '#ffd34d', '#ff5a6e'];

/** 펑펑: 화면 가운데 둘레에서 불꽃 몇 개가 차례로 터진다. */
function Fireworks() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    el.width = w * dpr; el.height = h * dpr;
    ctx.scale(dpr, dpr);
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };
    const sparks: Spark[] = [];
    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const n = 46;
      for (let i = 0; i < n; i += 1) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.2, speed = 2.2 + Math.random() * 3.4;
        sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1, color: Math.random() < 0.25 ? '#ffffff' : color, size: 1.6 + Math.random() * 2 });
      }
    };
    const short = Math.min(w, h);
    const plan = [[0.62, -0.28, -0.22], [0.9, 0.3, -0.18], [1.15, -0.05, 0.26], [1.35, -0.34, 0.2], [1.5, 0.32, 0.12]];
    const timers = plan.map(([t, dx, dy]) => window.setTimeout(() => burst(w / 2 + dx * short, h / 2 + dy * short), t * 1000));
    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of sparks) {
        s.x += s.vx; s.y += s.vy; s.vy += 0.045; s.vx *= 0.985; s.vy *= 0.985; s.life -= 0.012;
        if (s.life <= 0) continue;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); timers.forEach(clearTimeout); };
  }, []);
  return <canvas ref={canvas} className="lotte-fireworks" aria-hidden="true" />;
}

export default function LottePeek() {
  const peek = useRef<HTMLButtonElement>(null);
  const [launch, setLaunch] = useState<{ x: number; y: number } | null>(null);
  // 설정(≡)에서 롯데 로고를 끌 수 있다(4.11.0~).
  const [shown, setShown] = useState(() => isOn('lottePeek'));
  useEffect(() => onToggle((key, on) => { if (key === 'lottePeek') setShown(on); }), []);
  const go = () => {
    if (launch) return;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { window.location.assign(LOTTE_URL); return; }
    const r = peek.current?.getBoundingClientRect();
    // 동전이 로고 자리에서 출발한다(가운데 기준 거리).
    setLaunch({ x: r ? r.left + r.width / 2 - window.innerWidth / 2 : window.innerWidth / 2, y: r ? r.top + r.height / 2 - window.innerHeight / 2 : window.innerHeight / 2 });
    playResult(true);
    window.setTimeout(() => window.location.assign(LOTTE_URL), FLIGHT_MS);
  };
  if (!shown && !launch) return null;
  return <>
    <button ref={peek} type="button" className={`lotte-peek${launch ? ' is-gone' : ''}`} onClick={go} aria-label="롯데로 레츠고" title="롯데로 레츠고!">
      <img src={LOGO} alt="" draggable={false} />
    </button>
    {launch && <div className="lotte-launch" role="status" aria-label="롯데로 가는 중" style={{ '--fx': `${launch.x}px`, '--fy': `${launch.y}px` } as CSSProperties}>
      <Fireworks />
      <div className="lotte-coin">
        <span className="lotte-rays" aria-hidden="true" />
        {Array.from({ length: 8 }, (_, i) => <i key={i} className="lotte-twinkle" style={{ '--i': i } as CSSProperties} aria-hidden="true" />)}
        <img src={LOGO} alt="롯데 자이언츠" draggable={false} />
      </div>
      <p className="lotte-shout">롯데로 레츠고!</p>
    </div>}
  </>;
}
