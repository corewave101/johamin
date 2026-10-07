import type { SwipeCard } from '../data/swipe-cards';
import type { WrittenQuestion } from '../data/biology-written';
import type { SubjectGroup, SubjectNode } from '../data/swipe-subjects';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase-config';

/** One row of the `cards` table (see db/schema.sql). */
export interface CardRow {
  id: string; deck_id: string; kind: 'choice' | 'written'; topic: string; badge: string | null;
  question: string; passage: string | null; answer: string; wrong: string[]; criteria: string[];
  explanation: string; source_label: string; source_page: number | null; source_slide: number | null; source_url: string | null; sort: number;
}
export interface LiveDeck { cards: SwipeCard[]; written: WrittenQuestion[] }
export type LiveDecks = Record<string, LiveDeck>;

const COLUMNS = 'id,deck_id,kind,topic,badge,question,passage,answer,wrong,criteria,explanation,source_label,source_page,source_slide,source_url,sort';
const CACHE_KEY = 'johamin-cards-cache-v1';
const PAGE = 1000;

const noteOf = (row: CardRow) => row.source_page ? `${row.source_label} · ${row.source_page}쪽` : row.source_label;

export function rowToCard(row: CardRow): SwipeCard {
  const card: SwipeCard = {
    id: row.id, topic: row.topic, question: row.question,
    answers: { up: row.answer, left: row.wrong[0], right: row.wrong[1], down: row.wrong[2] },
    correct: 'up', explanation: row.explanation,
  };
  if (row.badge) card.subject = row.badge;
  if (row.passage) card.passage = row.passage;
  if (row.source_url) card.source = { title: row.source_label, label: row.source_label, url: row.source_url, page: row.source_page ?? 1 };
  else if (row.source_slide) card.sourceSlide = row.source_slide;
  else card.sourceNote = noteOf(row);
  return card;
}

export const rowToWritten = (row: CardRow): WrittenQuestion =>
  ({ id: row.id, topic: row.topic, question: row.question, modelAnswer: row.answer, criteria: row.criteria, sourceNote: noteOf(row) });

export function groupRows(rows: CardRow[]): LiveDecks {
  const decks: LiveDecks = {};
  for (const row of [...rows].sort((a, b) => a.sort - b.sort)) {
    const deck = decks[row.deck_id] ??= { cards: [], written: [] };
    if (row.kind === 'written') deck.written.push(rowToWritten(row));
    else deck.cards.push(rowToCard(row));
  }
  return decks;
}

/** Returns a copy of the menu where every deck found in the database uses the database cards. */
export function withLiveCards(menu: SubjectGroup, live: LiveDecks): SubjectGroup {
  const swap = (node: SubjectNode): SubjectNode => node.kind === 'group'
    ? { ...node, children: node.children.map(swap) }
    : live[node.id] ? { ...node, cards: live[node.id].cards, writtenQuestions: live[node.id].written.length ? live[node.id].written : node.writtenQuestions } : node;
  return swap(menu) as SubjectGroup;
}

export async function fetchCardRows(signal?: AbortSignal): Promise<CardRow[]> {
  const rows: CardRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cards?select=${COLUMNS}&order=deck_id,sort,id&offset=${from}&limit=${PAGE}`,
      { headers: { apikey: SUPABASE_PUBLISHABLE_KEY }, signal });
    if (!response.ok) throw new Error(`cards ${response.status}`);
    const page = await response.json() as CardRow[];
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

export function cachedRows(): CardRow[] | null {
  try { const raw = localStorage.getItem(CACHE_KEY); return raw ? JSON.parse(raw) as CardRow[] : null; } catch { return null; }
}
export function cacheRows(rows: CardRow[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(rows)); } catch { /* storage may be full or blocked */ }
}
