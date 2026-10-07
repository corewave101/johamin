import { useCallback, useEffect, useRef, useState } from 'react';
import { loadState, onLoadChange, trackPromise } from '../../lib/boot';
import { playDesertWind } from '../../lib/intro-sound';
import { coinTextScale, useTheme } from './useTheme';

const MIN_MS = 1400;  // long enough to see the sand blow, even when everything is cached
const MAX_MS = 7000;  // slow connections get the button anyway; the rest keeps loading behind
const EXIT_MS = 900;

/**
 * First screen: blowing sand over the blurred backdrop while the video, pictures and cards load.
 * When ready, a "JO" button appears; pointing at it (or pressing it on a phone) shows "HAMIN!".
 * Pressing it starts the desert wind (browsers only allow sound after a press) and opens the app.
 */
export default function Intro() {
  const theme = useTheme();
  const [load, setLoad] = useState(loadState);
  const [minPassed, setMinPassed] = useState(false);
  const [maxPassed, setMaxPassed] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const ready = minPassed && (load.pending === 0 || maxPassed);

  useEffect(() => {
    trackPromise('fonts', document.fonts?.ready ?? Promise.resolve());
    setLoad(loadState());
    const stop = onLoadChange(() => setLoad(loadState()));
    const min = setTimeout(() => setMinPassed(true), MIN_MS);
    const max = setTimeout(() => setMaxPassed(true), MAX_MS);
    return () => { stop(); clearTimeout(min); clearTimeout(max); };
  }, []);

  const start = useCallback(() => {
    if (leaving) return;
    playDesertWind();
    setPressed(true);
    setLeaving(true);
    setTimeout(() => setGone(true), EXIT_MS);
  }, [leaving]);

  // Nothing behind the intro may react to keys or scroll. Enter or Space starts once ready.
  useEffect(() => {
    if (gone) return;
    const guard = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if ((event.target as Element | null)?.closest?.('.sound-toggle')) return; // muting stays possible
      event.preventDefault();
      if (ready) start();
    };
    const root = document.documentElement;
    root.classList.add('intro-open');
    window.addEventListener('keydown', guard, true);
    return () => { window.removeEventListener('keydown', guard, true); root.classList.remove('intro-open'); };
  }, [gone, ready, start]);

  if (gone) return null;
  const percent = ready ? 100 : load.total ? Math.min(99, Math.round(load.progress * 100)) : 0;
  return <div className={`intro${ready ? ' is-ready' : ''}${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="조하민레츠고 시작 화면">
    <SandCanvas rushing={leaving} color={theme.palette.light} />
    <div className="intro-haze" aria-hidden="true" />
    <p className="intro-title">조하민레츠고</p>
    <div className="intro-center">
      <div className="intro-loading" role="progressbar" aria-label="불러오는 중" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-hidden={ready}>
        <div className="intro-bar"><span style={{ transform: `scaleX(${percent / 100})` }} /></div>
        <p>{theme.choice.kind === 'hamin' ? '모래바람 불어오는 중' : theme.choice.kind === 'none' ? '바람 불어오는 중' : `${theme.name} 내려오는 중`} <b>{percent}%</b></p>
      </div>
      <button type="button" className={`intro-button${pressed ? ' is-pressed' : ''}`} aria-label="시작하기" tabIndex={ready ? 0 : -1}
        disabled={!ready} onClick={start}
        onPointerDown={event => { if (event.pointerType !== 'mouse') setPressed(true); }}
        onPointerCancel={() => { if (!leaving) setPressed(false); }}
        onPointerLeave={event => { if (event.pointerType !== 'mouse' && !leaving) setPressed(false); }}>
        <span className="intro-jo" aria-hidden="true" style={{ fontSize: `calc(var(--size) * ${coinTextScale(theme.coinFront, 'front')})` }}>{theme.coinFront}</span>
        <span className="intro-hamin" aria-hidden="true" style={{ fontSize: `calc(var(--size) * ${coinTextScale(theme.coinBack, 'back')})` }}>{theme.coinBack}</span>
      </button>
      <p className="intro-hint" aria-hidden="true">눌러서 출발</p>
    </div>
  </div>;
}

/** Sand grains streaking across the screen with the wind; they rush away when the intro closes. */
function SandCanvas({ rushing, color }: { rushing: boolean; color: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rush = useRef(rushing);
  rush.current = rushing;

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    type Grain = { x: number; y: number; speed: number; length: number; alpha: number; size: number };
    const [cr, cg, cb] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    let width = 0, height = 0, grains: Grain[] = [], frame = 0, last = performance.now(), boost = 1;
    const grain = (anywhere: boolean): Grain => ({
      x: anywhere ? Math.random() * width : -40 - Math.random() * 200,
      y: Math.random() * height,
      speed: 260 + Math.random() * 520,
      length: 8 + Math.random() * 30,
      alpha: 0.18 + Math.random() * 0.5,
      size: Math.random() < 0.85 ? 1 : 1.8,
    });
    const resize = () => {
      const ratio = Math.min(2, devicePixelRatio || 1);
      width = innerWidth; height = innerHeight;
      el.width = width * ratio; el.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.round(Math.min(220, Math.max(70, width * height / 6500)));
      grains = Array.from({ length: count }, () => grain(true));
    };
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      boost += ((rush.current ? 4.5 : 1) - boost) * 0.08;
      const gust = 0.75 + 0.35 * Math.sin(now / 900) + 0.15 * Math.sin(now / 270);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      for (const g of grains) {
        const vx = g.speed * gust * boost, vy = vx * 0.16 + Math.sin((g.x + now * 0.3) / 90) * 18;
        g.x += vx * dt; g.y += vy * dt;
        if (g.x - g.length > width || g.y > height + 20) Object.assign(g, grain(false));
        const tail = Math.min(90, g.length * gust * boost);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${g.alpha})`;
        ctx.lineWidth = g.size;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.lineTo(g.x - tail, g.y - tail * 0.16);
        ctx.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, [color]);

  return <canvas ref={canvas} className="intro-sand" aria-hidden="true" />;
}
