import type { CSSProperties } from 'react';

export default function StreakFlame({ streak }: { streak: number }) {
  const heat = Math.min(streak, 20) / 20;
  const style = { '--flame-scale': 0.7 + heat * 0.6, '--flame-color': streak ? `hsl(${30 - heat * 24} 96% 52%)` : '#9297a1', '--flame-glow': `${heat * 10}px`, '--core-color': streak ? `hsl(48 100% ${65 + heat * 30}%)` : '#c2c5cb' } as CSSProperties;
  return <div className={`streak-flame glass ${streak ? 'is-lit' : 'is-cool'}`} style={style} role="status" aria-label={`연속 정답 ${streak}회`}>
    <svg viewBox="0 0 32 40" aria-hidden="true"><path className="flame-body" d="M17 1C20 11 29 14 29 25C29 34 23 39 16 39C8 39 3 33 3 25C3 19 7 13 11 10C10 17 12 19 14 20C20 14 12 8 17 1Z"/><path className="flame-core" d="M17 20C19 25 23 27 23 31C23 35 20 37 16 37C12 37 9 34 10 30C11 26 15 26 17 20Z"/></svg>
    <strong>{streak}</strong>
  </div>;
}
