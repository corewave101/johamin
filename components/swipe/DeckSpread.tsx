// 베타 · 카드 펼쳐 고르기: every part laid out on the table as cards, grouped by subject. Pick one to open it directly.
// Keys: ← → move between cards, ↑ ↓ jump between subjects, Enter/Space opens. Tap or click works the same.
import { useEffect, useMemo, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import type { SubjectDeck, SubjectGroup, SubjectNode } from '../../data/swipe-subjects';

type Spread = { group: SubjectGroup; decks: { deck: SubjectDeck; path: string }[] };

/** Top-level subjects with every part inside them, nested groups flattened ("국어 · 문법"). */
export function spreadOf(menu: SubjectGroup): Spread[] {
  const walk = (node: SubjectNode, path: string[]): { deck: SubjectDeck; path: string }[] =>
    node.kind === 'deck' ? [{ deck: node, path: path.join(' · ') }] : node.children.flatMap(child => walk(child, [...path, ...(child.kind === 'group' ? [child.name] : [])]));
  return menu.children.map(node => node.kind === 'group' ? { group: node, decks: walk(node, []) } : { group: { ...menu, children: [node] }, decks: [{ deck: node, path: '' }] });
}

const countOf = (deck: SubjectDeck) => {
  const written = deck.writtenQuestions?.length ?? 0;
  if (!deck.cards.length && !written) return '준비 중';
  return [deck.cards.length ? `${deck.cards.length}장` : '', written ? `서술형 ${written}` : ''].filter(Boolean).join(' · ');
};

export default function DeckSpread({ menu, onPick, onClassic }: { menu: SubjectGroup; onPick: (deck: SubjectDeck) => void; onClassic: () => void }) {
  const spread = useMemo(() => spreadOf(menu), [menu]);
  const buttons = useRef<(HTMLButtonElement | null)[][]>([]);
  useEffect(() => { buttons.current[0]?.[0]?.focus({ preventScroll: true }); }, []);

  const move = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
    const rows = buttons.current;
    let r = row, c = col;
    if (event.key === 'ArrowRight') { c++; if (c >= rows[r].length) { r = (r + 1) % rows.length; c = 0; } }
    else if (event.key === 'ArrowLeft') { c--; if (c < 0) { r = (r - 1 + rows.length) % rows.length; c = rows[r].length - 1; } }
    else if (event.key === 'ArrowDown') { r = (r + 1) % rows.length; c = Math.min(c, rows[r].length - 1); }
    else if (event.key === 'ArrowUp') { r = (r - 1 + rows.length) % rows.length; c = Math.min(c, rows[r].length - 1); }
    else return;
    event.preventDefault();
    event.stopPropagation();
    rows[r][c]?.focus();
  };

  return <main className="swipe-app spread-app">
    <div className="spread">
      <header className="swipe-heading"><h1 className="glass">조하민<span>레츠고</span></h1></header>
      <p className="spread-lead glass">어디부터 할까요? 카드를 골라요 <span className="spread-beta">베타</span></p>
      {spread.map(({ group, decks }, row) => <section key={group.id} className="spread-group" aria-label={group.name}>
        <h2>{group.name}</h2>
        <div className="spread-row" style={{ '--count': decks.length } as CSSProperties}>
          {decks.map(({ deck, path }, col) => {
            const pending = !deck.cards.length && !deck.writtenQuestions?.length;
            return <button type="button" key={deck.id} ref={el => { (buttons.current[row] ??= [])[col] = el; }}
              className={`spread-card ${pending ? 'is-pending' : ''}`} style={{ '--i': col - (decks.length - 1) / 2 } as CSSProperties}
              onClick={() => onPick(deck)} onKeyDown={event => move(event, row, col)} aria-label={`${group.name} ${path} ${deck.fullName ?? deck.name} · ${countOf(deck)}`}>
              <span className="card-art" aria-hidden="true" />
              <span className="spread-caption">
                <small>{path || group.name}</small>
                <strong>{deck.name}</strong>
                <em>{countOf(deck)}</em>
              </span>
              <span className="card-gloss" aria-hidden="true" />
            </button>;
          })}
        </div>
      </section>)}
      <button type="button" className="glass-button spread-classic" onClick={onClassic}>한 장씩 넘겨서 고르기</button>
    </div>
  </main>;
}
