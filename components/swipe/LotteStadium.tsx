// 롯데의 가호 배경: 밤 야구장. 남색 하늘에서 빨강으로 물드는 응원석, 조명탑, 관중석의 반짝이는 플래시, 오른쪽 위의 물결선.
// 그림 파일 없이 캔버스로 그린다(관중은 한 번만 그려 두고, 반짝임만 움직인다). 움직임 줄이기면 멈춘 그림 한 장.
import { useEffect, useRef } from 'react';

type Flash = { x: number; y: number; life: number; size: number; hue: 'w' | 'b' | 'r' };

/** 0..1 seeded random so the crowd does not jump around when the window resizes. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function paintStadium(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const rand = seeded(1982);
  // 하늘 → 응원석: 남색에서 자주, 빨강으로.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#06153f');
  sky.addColorStop(0.38, '#13205a');
  sky.addColorStop(0.68, '#3c1352');
  sky.addColorStop(1, '#8e0f35');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2, fieldY = h * 0.64;
  const outerRx = Math.max(w * 0.78, h * 0.7), outerRy = h * 0.5;
  const fieldRx = Math.min(w * 0.36, h * 0.6), fieldRy = h * 0.12;

  // 위쪽 관중석 지붕 그늘
  ctx.fillStyle = 'rgba(6, 12, 40, .55)';
  ctx.beginPath(); ctx.ellipse(cx, fieldY, outerRx * 1.05, outerRy * 1.02, 0, Math.PI, 2 * Math.PI); ctx.fill();

  // 관중: 바깥 타원과 운동장 타원 사이, 원근감 있게(위쪽은 작게).
  const top = fieldY - outerRy * 0.92;
  const count = Math.round(Math.min(5200, Math.max(1800, w * h / 220)));
  const colours = ['255,255,255', '226,232,255', '60,90,170', '210,40,70', '245,205,180', '30,40,90', '255,120,150', '120,170,255'];
  for (let i = 0; i < count; i++) {
    const x = rand() * w, y = top + rand() * (h - top);
    const inOuter = ((x - cx) / outerRx) ** 2 + ((y - fieldY) / outerRy) ** 2 < 1.15;
    const inField = ((x - cx) / fieldRx) ** 2 + ((y - fieldY) / fieldRy) ** 2 < 1;
    if (!inOuter || inField) continue;
    const depth = (y - top) / (h - top); // 0 far, 1 near
    const r = 0.5 + depth * 2.1 + rand() * 0.6;
    ctx.fillStyle = `rgba(${colours[Math.floor(rand() * colours.length)]},${(0.18 + rand() * 0.35 + depth * 0.15).toFixed(2)})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  // 관중석 난간(층)
  ctx.lineWidth = 1;
  for (let k = 0; k < 5; k++) {
    const f = 0.42 + k * 0.14;
    ctx.strokeStyle = `rgba(180, 200, 255, ${0.07 + k * 0.02})`;
    ctx.beginPath(); ctx.ellipse(cx, fieldY, fieldRx + (outerRx - fieldRx) * f, fieldRy + (outerRy - fieldRy) * f, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
  }
  // 그라운드: 어두운 잔디와 흙 내야
  const grass = ctx.createRadialGradient(cx, fieldY, 0, cx, fieldY, fieldRx);
  grass.addColorStop(0, 'rgba(70, 100, 120, .32)');
  grass.addColorStop(1, 'rgba(24, 36, 70, .42)');
  ctx.fillStyle = grass;
  ctx.beginPath(); ctx.ellipse(cx, fieldY, fieldRx, fieldRy, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, .12)';
  ctx.beginPath(); ctx.moveTo(cx, fieldY + fieldRy * 0.9); ctx.lineTo(cx - fieldRx * 0.55, fieldY - fieldRy * 0.2); ctx.moveTo(cx, fieldY + fieldRy * 0.9); ctx.lineTo(cx + fieldRx * 0.55, fieldY - fieldRy * 0.2); ctx.stroke();

  // 전광판(왼쪽 위)과 조명탑
  ctx.fillStyle = 'rgba(160, 190, 255, .1)';
  ctx.fillRect(w * 0.3, top - h * 0.08, w * 0.13, h * 0.06);
  const towers = [[0.16, 0.1], [0.86, 0.08], [0.62, 0.05]];
  for (const [tx, ty] of towers) {
    const x = w * tx, y = h * ty, s = Math.min(w, h) * 0.022;
    ctx.strokeStyle = 'rgba(150, 170, 220, .25)'; ctx.lineWidth = Math.max(1, s * 0.12);
    ctx.beginPath(); ctx.moveTo(x, y + s); ctx.lineTo(x, top + h * 0.05); ctx.stroke();
    const bloom = ctx.createRadialGradient(x, y, 0, x, y, s * 9);
    bloom.addColorStop(0, 'rgba(235, 242, 255, .55)'); bloom.addColorStop(0.25, 'rgba(170, 200, 255, .18)'); bloom.addColorStop(1, 'rgba(120, 150, 255, 0)');
    ctx.fillStyle = bloom; ctx.beginPath(); ctx.arc(x, y, s * 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, .95)';
    for (let gx = -2; gx <= 2; gx++) for (let gy = -1; gy <= 1; gy++) { ctx.beginPath(); ctx.arc(x + gx * s * 0.42, y + gy * s * 0.42, s * 0.16, 0, Math.PI * 2); ctx.fill(); }
  }

  // 물결선: 오른쪽 위(파랑), 왼쪽 아래(빨강)
  const waves = (ox: number, oy: number, colour: string, from: number, to: number) => {
    ctx.lineWidth = 1;
    for (let r = from; r < to; r += 7) {
      ctx.strokeStyle = `rgba(${colour}, ${(0.16 * (1 - (r - from) / (to - from))).toFixed(3)})`;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.08) {
        const wobble = 1 + 0.035 * Math.sin(a * 5 + r / 40);
        const px = ox + Math.cos(a) * r * wobble, py = oy + Math.sin(a) * r * 0.75 * wobble;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  };
  const m = Math.min(w, h);
  waves(w * 1.02, h * 0.02, '120, 160, 255', m * 0.12, m * 0.6);
  waves(-w * 0.02, h * 1.0, '255, 80, 120', m * 0.1, m * 0.45);

  // 전체를 남색 → 빨강으로 물들인다.
  const tint = ctx.createLinearGradient(0, 0, 0, h);
  tint.addColorStop(0, 'rgba(8, 24, 80, .42)');
  tint.addColorStop(0.55, 'rgba(40, 20, 90, .28)');
  tint.addColorStop(1, 'rgba(170, 14, 54, .45)');
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, w, h);
  return { top, cx, fieldY, outerRx, outerRy, fieldRx, fieldRy };
}

export default function LotteStadium() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, frame = 0, last = 0, base: HTMLCanvasElement | null = null;
    let geo = { top: 0, cx: 0, fieldY: 0, outerRx: 1, outerRy: 1, fieldRx: 1, fieldRy: 1 };
    const flashes: Flash[] = [];
    const ratio = Math.min(2, devicePixelRatio || 1);
    const resize = () => {
      w = innerWidth; h = innerHeight;
      el.width = Math.round(w * ratio); el.height = Math.round(h * ratio);
      base = document.createElement('canvas');
      base.width = el.width; base.height = el.height;
      const b = base.getContext('2d');
      if (!b) return;
      b.setTransform(ratio, 0, 0, ratio, 0, 0);
      geo = paintStadium(b, w, h);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
    };
    const spawn = () => {
      for (let tries = 0; tries < 8; tries++) {
        const x = Math.random() * w, y = geo.top + Math.random() * (h - geo.top);
        const inOuter = ((x - geo.cx) / geo.outerRx) ** 2 + ((y - geo.fieldY) / geo.outerRy) ** 2 < 1.1;
        const inField = ((x - geo.cx) / geo.fieldRx) ** 2 + ((y - geo.fieldY) / geo.fieldRy) ** 2 < 1.1;
        if (inOuter && !inField) {
          const depth = (y - geo.top) / (h - geo.top);
          flashes.push({ x, y, life: 1, size: 1.5 + depth * 4, hue: Math.random() < 0.7 ? 'w' : Math.random() < 0.5 ? 'b' : 'r' });
          return;
        }
      }
    };
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < 33 || !base) return; // ~30fps is plenty for twinkles
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (Math.random() < 0.55) spawn();
      if (Math.random() < 0.12) spawn();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt * 1.6;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }
        const a = Math.sin(f.life * Math.PI); // fade in and out
        const colour = f.hue === 'w' ? '255,255,255' : f.hue === 'b' ? '140,190,255' : '255,110,150';
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4);
        g.addColorStop(0, `rgba(${colour},${(0.9 * a).toFixed(3)})`);
        g.addColorStop(1, `rgba(${colour},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${colour},${(0.7 * a).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(f.x - f.size * 3, f.y); ctx.lineTo(f.x + f.size * 3, f.y); ctx.moveTo(f.x, f.y - f.size * 3); ctx.lineTo(f.x, f.y + f.size * 3); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    resize();
    if (!still) frame = requestAnimationFrame(draw);
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !still) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return <canvas ref={canvas} className="scene-media scene-lotte" />;
}
