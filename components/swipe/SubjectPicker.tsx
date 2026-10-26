import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Direction } from '../../data/swipe-cards';
import type { SubjectDeck, SubjectGroup } from '../../data/swipe-subjects';
import { examPage, isMidterm, navTargets, BRAND } from '../../lib/exam';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playTick } from '../../lib/sound';
import LaminatedCard from './LaminatedCard';
import ObservationLab from './ObservationLab';
import SubjectStudy from './SubjectStudy';
import { useBeta } from './useBeta';
import { findGroup, useLiveMenu } from './useLiveMenu';

export default function SubjectPicker() {
  const [path, setPath] = useState<SubjectGroup[]>([]);
  const [subject, setSubject] = useState<SubjectDeck | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const menu = useLiveMenu();
  // 베타 · 실습: 중간고사 보관함 첫 화면의 ↓가 황윤환T 관측 실습을 바로 연다(↑는 이동 메뉴 자리).
  const beta = useBeta();
  const [lab, setLab] = useState(false);
  // 이동 메뉴: 세 페이지 모두 첫 화면 ↑. 그 안에서 ↑ 기말고사 · ← 중간고사 · → 정보(지금 페이지 자리는 비움), ↓ 뒤로.
  const [nav, setNav] = useState(false);
  const practiceSlot = beta && path.length === 0 && !nav && isMidterm && !menu.children.some(item => item.direction === 'down');
  const current = findGroup(menu, path.at(-1)?.id) ?? menu;
  const atRoot = !path.length && !subject && !lab;
  const targets = navTargets(examPage);
  const resetDrag = useCallback(() => { pointer.current = null; setDrag({ x: 0, y: 0 }); }, []);
  const back = useCallback(() => {
    if (nav) setNav(false);
    else if (lab) setLab(false);
    else if (subject) setSubject(null);
    else setPath(previous => previous.slice(0, -1));
    playTick();
    resetDrag();
    requestAnimationFrame(() => heading.current?.focus());
  }, [subject, lab, nav, resetDrag]);
  const choose = useCallback((direction: Direction) => {
    if (subject || lab) return;
    if (nav) {
      if (direction === 'down') { back(); return; }
      const target = targets.find(item => item.direction === direction);
      if (target) { playTick(); window.location.assign(target.href); }
      return;
    }
    if (direction === 'down' && path.length) { back(); return; }
    if (direction === 'up' && atRoot) { playTick(); setNav(true); resetDrag(); return; }
    if (direction === 'down' && practiceSlot) { playTick(); setLab(true); resetDrag(); return; }
    const next = current.children.find(item => item.direction === direction);
    if (!next) return;
    playTick();
    if (next.kind === 'group') setPath(previous => [...previous, next]);
    else setSubject(next);
    resetDrag();
  }, [subject, lab, nav, targets, atRoot, practiceSlot, path.length, current, back, resetDrag]);
  useEffect(() => {
    const home = () => { setSubject(null); setPath([]); setNav(false); resetDrag(); };
    window.addEventListener('johamin:home', home);
    return () => window.removeEventListener('johamin:home', home);
  }, [resetDrag]);
  useEffect(() => {
    if (!subject) heading.current?.focus();
  }, [subject, current]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event)) return;
      if (event.key === 'Escape' && (subject || path.length || nav)) { event.preventDefault(); if (!event.repeat) back(); return; }
      if (!keyDirections[event.key] || subject || lab) return;
      event.preventDefault();
      if (!event.repeat) choose(keyDirections[event.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, back, subject, lab, nav, path.length]);
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
  const options = nav
    ? directions.map(direction => {
      const target = targets.find(item => item.direction === direction);
      const isBack = direction === 'down';
      return { direction, node: undefined, enabled: Boolean(target) || isBack, label: target?.label ?? (isBack ? '이전' : ''), practice: false, note: target?.note ?? '' };
    })
    : directions.map(direction => {
      const node = current.children.find(item => item.direction === direction);
      const isBack = direction === 'down' && path.length > 0;
      const isPractice = direction === 'down' && practiceSlot;
      const isNav = direction === 'up' && atRoot;
      return { direction, node: isNav ? undefined : node, enabled: Boolean(node || isBack || isPractice || isNav), label: isNav ? '이동' : node?.name ?? (isBack ? '이전' : isPractice ? '실습' : ''), practice: isPractice, note: isNav ? targets.map(item => item.label).join(' · ') : '' };
    });
  const distance = Math.hypot(drag.x, drag.y);
  const activeDirection = distance > 18 ? directionOf(drag.x, drag.y) : null;
  const highlighted = options.find(item => item.direction === activeDirection && item.enabled);
  if (lab) return <ObservationLab onBack={back} />;
  if (subject) return <SubjectStudy key={subject.id} deck={subject} onBack={back} />;

  return <main className="swipe-app subject-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass" ref={heading} tabIndex={-1}>{BRAND.first}<span>{BRAND.rest}</span></h1></header>
      <section className="swipe-board" aria-label={nav ? '이동 메뉴' : `${current.name} 메뉴`}>
        {options.map(({ direction, node, enabled, label, practice, note }) => <button type="button" key={direction} disabled={!enabled}
          className={`swipe-option swipe-option-${direction} ${enabled ? 'glass' : 'swipe-empty-option'} ${activeDirection === direction && enabled ? 'is-active' : ''}`}
          onClick={() => choose(direction)} aria-label={enabled ? `${arrows[direction]} ${label}` : '빈 선택지'}>
          <kbd>{arrows[direction]}</kbd>
          {enabled && <span>{label}{practice && <small>황윤환T 관측 · 베타</small>}{note && <small>{note}</small>}{node?.kind === 'deck' && (node.cards.length > 0 ? <small>{node.cards.length}장</small> : !node.writtenQuestions?.length && <small>준비 중</small>)}</span>}
        </button>)}
        <div className="swipe-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard key={nav ? 'nav' : current.id} className={`is-current ${pointer.current ? 'is-dragging' : ''}`}
            style={{ '--tx': `calc(${drag.x}px / var(--card-zoom, 1))`, '--ty': `calc(${drag.y}px / var(--card-zoom, 1))`, '--rot': `${drag.x / 22}deg` } as CSSProperties}
            topic={nav ? '이동' : path.length ? current.name : examPage === 'midterm' ? '중간고사 · 과목 선택' : examPage === 'elice' ? '정보 · 엘리스 수행' : examPage === 'lotte' ? '롯데 자이언츠' : '과목 선택'} question={nav ? '어디로 갈까요?' : path.length ? '어느 파트?' : '어떤 과목?'}
            onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={move} onPointerUp={release} onPointerCancel={resetDrag} onLostPointerCapture={resetDrag}>
            {highlighted && <div className={`swipe-drag-label ${distance >= SWIPE_DISTANCE ? 'is-ready' : ''}`}>{arrows[highlighted.direction]} {highlighted.label}</div>}
          </LaminatedCard>
        </div>
      </section>
    </div>
  </main>;
}

