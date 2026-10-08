import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Direction } from '../../data/swipe-cards';
import type { SubjectDeck, SubjectGroup } from '../../data/swipe-subjects';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playTick } from '../../lib/sound';
import LaminatedCard from './LaminatedCard';
import SubjectStudy from './SubjectStudy';
import { findGroup, useLiveMenu } from './useLiveMenu';

export default function SubjectPicker() {
  const [path, setPath] = useState<SubjectGroup[]>([]);
  const [subject, setSubject] = useState<SubjectDeck | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const menu = useLiveMenu();
  const current = findGroup(menu, path.at(-1)?.id) ?? menu;
  const resetDrag = useCallback(() => { pointer.current = null; setDrag({ x: 0, y: 0 }); }, []);
  const back = useCallback(() => {
    if (subject) setSubject(null);
    else setPath(previous => previous.slice(0, -1));
    playTick();
    resetDrag();
    requestAnimationFrame(() => heading.current?.focus());
  }, [subject, resetDrag]);
  const choose = useCallback((direction: Direction) => {
    if (subject) return;
    if (direction === 'down' && path.length) { back(); return; }
    const next = current.children.find(item => item.direction === direction);
    if (!next) return;
    playTick();
    if (next.kind === 'group') setPath(previous => [...previous, next]);
    else setSubject(next);
    resetDrag();
  }, [subject, path.length, current, back, resetDrag]);
  useEffect(() => {
    const home = () => { setSubject(null); setPath([]); resetDrag(); };
    window.addEventListener('johamin:home', home);
    return () => window.removeEventListener('johamin:home', home);
  }, [resetDrag]);
  useEffect(() => {
    if (!subject) heading.current?.focus();
  }, [subject, current]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event)) return;
      if (event.key === 'Escape' && (subject || path.length)) { event.preventDefault(); if (!event.repeat) back(); return; }
      if (!keyDirections[event.key] || subject) return;
      event.preventDefault();
      if (!event.repeat) choose(keyDirections[event.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, back, subject, path.length]);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    setDrag({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y });
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const x = event.clientX - pointer.current.x, y = event.clientY - pointer.current.y;
    if (Math.hypot(x, y) >= SWIPE_DISTANCE) choose(directionOf(x, y));
    resetDrag();
  };
  const options = directions.map(direction => {
    const node = current.children.find(item => item.direction === direction);
    const isBack = direction === 'down' && path.length > 0;
    return { direction, node, enabled: Boolean(node || isBack), label: node?.name ?? (isBack ? '이전' : '') };
  });
  const distance = Math.hypot(drag.x, drag.y);
  const activeDirection = distance > 18 ? directionOf(drag.x, drag.y) : null;
  const highlighted = options.find(item => item.direction === activeDirection && item.enabled);
  if (subject) return <SubjectStudy key={subject.id} deck={subject} onBack={back} />;

  return <main className="swipe-app subject-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass" ref={heading} tabIndex={-1}>조하민<span>레츠고</span></h1></header>
      <section className="swipe-board" aria-label={`${current.name} 메뉴`}>
        {options.map(({ direction, node, enabled, label }) => <button type="button" key={direction} disabled={!enabled}
          className={`swipe-option swipe-option-${direction} ${enabled ? 'glass' : 'swipe-empty-option'} ${activeDirection === direction && enabled ? 'is-active' : ''}`}
          onClick={() => choose(direction)} aria-label={enabled ? `${arrows[direction]} ${label}` : '빈 선택지'}>
          <kbd>{arrows[direction]}</kbd>
          {enabled && <span>{label}{node?.kind === 'deck' && (node.cards.length > 0 ? <small>{node.cards.length}장</small> : !node.writtenQuestions?.length && <small>준비 중</small>)}</span>}
        </button>)}
        <div className="swipe-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard key={current.id} className={`is-current ${pointer.current ? 'is-dragging' : ''}`}
            style={{ '--tx': `calc(${drag.x}px / var(--card-zoom, 1))`, '--ty': `calc(${drag.y}px / var(--card-zoom, 1))`, '--rot': `${drag.x / 22}deg` } as CSSProperties}
            topic={path.length ? current.name : '과목 선택'} question={path.length ? '어느 파트?' : '어떤 과목?'}
            onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={move} onPointerUp={release} onPointerCancel={resetDrag} onLostPointerCapture={resetDrag}>
            {highlighted && <div className={`swipe-drag-label ${distance >= SWIPE_DISTANCE ? 'is-ready' : ''}`}>{arrows[highlighted.direction]} {highlighted.label}</div>}
          </LaminatedCard>
        </div>
      </section>
    </div>
  </main>;
}

