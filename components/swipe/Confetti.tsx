import { useEffect, useRef } from 'react';

/**
 * 폭죽: silent confetti bursting up from the two bottom corners of the screen, then falling away (~2.4 s).
 * Drawn on one canvas over everything, ignoring clicks. Skipped when the system asks for less motion.
 */
export default function Confetti({ onDone }: { onDone?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || !ctx || reduce) { done.current?.(); return; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    el.width = w * dpr; el.height = h * dpr;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const themed = ['--theme-base', '--theme-soft', '--theme-deep'].map(v => css.getPropertyValue(v).trim()).filter(Boolean);
    const colors = [...themed, '#e04f5f', '#2f9e6b', '#3a7bd5', '#f2a33a', '#9b5de5', '#ffffff'];
    const scale = Math.max(.75, Math.min(1.4, h / 800));
    type Bit = { x: number; y: number; vx: number; vy: number; size: number; rot: number; spin: number; flip: number; color: string; round: boolean };
    const bits: Bit[] = [];
    for (const side of [0, 1]) {
      for (let i = 0; i < 80; i++) {
        const angle = (-82 + Math.random() * 42) * Math.PI / 180; // up and toward the middle
        const speed = (11 + Math.random() * 10) * scale;
        bits.push({
          x: side ? w + 4 : -4, y: h + 4,
          vx: Math.cos(angle) * speed * (side ? -1 : 1), vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 6, rot: Math.random() * Math.PI, spin: (Math.random() - .5) * .3, flip: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)], round: Math.random() < .25,
        });
      }
    }
    const LIFE = 2400, FADE = 600;
    const start = performance.now();
    let frame = 0, last = start;
    const tick = (now: number) => {
      const t = now - start;
      // Motion is measured in 60 fps steps, so 120 Hz phones and slow screens see the same burst.
      const k = Math.min((now - last) / (1000 / 60), 3);
      last = now;
      const drag = Math.pow(.985, k);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = t > LIFE - FADE ? Math.max(0, (LIFE - t) / FADE) : 1;
      for (const b of bits) {
        b.vy += .34 * scale * k; b.vx *= drag; b.vy *= drag;
        b.x += b.vx * k; b.y += b.vy * k; b.rot += b.spin * k; b.flip += .18 * k;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.size / 2.4, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.scale(1, Math.cos(b.flip)); ctx.fillRect(-b.size / 2, -b.size / 3.2, b.size, b.size / 1.6); }
        ctx.restore();
      }
      if (t < LIFE) frame = requestAnimationFrame(tick);
      else done.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvas} className="confetti" aria-hidden="true" />;
}
