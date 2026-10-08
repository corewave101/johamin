import type { HTMLAttributes, PointerEvent, ReactNode } from 'react';
import { portraitFor } from '../../data/card-portraits';

type Props = HTMLAttributes<HTMLElement> & { topic: string; subject?: string; question: string; portraitKey?: string; children?: ReactNode };

const lengthClass = (text: string) => text.length > 38 ? 'long' : text.length > 22 ? 'medium' : 'short';
// The big line above the question can hold a whole example sentence, so it shrinks as it grows.
const subjectLength = (text: string) => text.length > 36 ? 'long' : text.length > 16 ? 'medium' : 'short';

function tilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1) - 0.5;
  const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1) - 0.5;
  el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
  el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty('--sx', `${(42 + x * 50).toFixed(1)}%`);
}

function untilt(el: HTMLElement) {
  for (const name of ['--rx', '--ry', '--gx', '--gy', '--sx']) el.style.removeProperty(name);
}

/** A photo card sealed in clear laminate: printed art, a frosted caption and a moving glare. */
export default function LaminatedCard({ topic, subject, question, portraitKey, className = '', children, onPointerMove, onPointerLeave, onPointerUp, onPointerCancel, ...rest }: Props) {
  const portrait = portraitFor(portraitKey, topic);
  return <article {...rest} className={`swipe-card ${className}`}
    onPointerMove={event => { if (event.pointerType === 'mouse' || event.buttons) tilt(event); onPointerMove?.(event); }}
    onPointerLeave={event => { untilt(event.currentTarget); onPointerLeave?.(event); }}
    onPointerUp={event => { if (event.pointerType !== 'mouse') untilt(event.currentTarget); onPointerUp?.(event); }}
    onPointerCancel={event => { untilt(event.currentTarget); onPointerCancel?.(event); }}>
    <div className="card-art"><img src={portrait.image} alt={`${portrait.name} 인물 초상`} draggable={false} referrerPolicy="no-referrer" onError={e => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = 'true'; img.src = portrait.remoteImage; } else img.hidden = true; }} /><span className="portrait-name">{portrait.field}</span></div>
    <div className="card-caption">
      <span className="card-topic">{topic}</span>
      <div className="swipe-question">
        {subject && <p className="card-subject" data-length={subjectLength(subject)}>{subject}</p>}
        <h2 data-length={lengthClass(question)}>{question}</h2>
      </div>
    </div>
    <a className="portrait-credit" href={portrait.source} target="_blank" rel="noreferrer" onPointerDown={e => e.stopPropagation()}>인물 이미지 · Commons / PD ↗</a>
    <div className="card-gloss" aria-hidden="true" />
    {children}
  </article>;
}
