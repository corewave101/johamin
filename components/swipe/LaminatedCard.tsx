import type { HTMLAttributes, PointerEvent, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLElement> & { topic: string; subject?: string; question: string; children?: ReactNode };

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
export default function LaminatedCard({ topic, subject, question, className = '', children, onPointerMove, onPointerLeave, onPointerUp, onPointerCancel, ...rest }: Props) {
  return <article {...rest} className={`swipe-card ${className}`}
    onPointerMove={event => { if (event.pointerType === 'mouse' || event.buttons) tilt(event); onPointerMove?.(event); }}
    onPointerLeave={event => { untilt(event.currentTarget); onPointerLeave?.(event); }}
    onPointerUp={event => { if (event.pointerType !== 'mouse') untilt(event.currentTarget); onPointerUp?.(event); }}
    onPointerCancel={event => { untilt(event.currentTarget); onPointerCancel?.(event); }}>
    <div className="card-art" aria-hidden="true" />
    <div className="card-caption">
      <span className="card-topic">{topic}</span>
      <div className="swipe-question">
        {subject && <p className="card-subject" data-length={subjectLength(subject)}>{subject}</p>}
        <h2 data-length={lengthClass(question)}>{question}</h2>
      </div>
    </div>
    <div className="card-gloss" aria-hidden="true" />
    {children}
  </article>;
}
