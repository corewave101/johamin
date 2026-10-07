import type { Direction } from '../data/swipe-cards';

export const directions: Direction[] = ['up', 'left', 'right', 'down'];
export const arrows: Record<Direction, string> = { up: '↑', left: '←', right: '→', down: '↓' };
export const keyDirections: Record<string, Direction> = { ArrowUp: 'up', ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down' };

/** Distance in px a card must travel before releasing it counts as a choice. */
export const SWIPE_DISTANCE = 65;
export const directionOf = (x: number, y: number): Direction => Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');

/** True when a key press should be left to a form field instead of the game. */
export const isTyping = (event: KeyboardEvent) => event.altKey || event.ctrlKey || event.metaKey
  || (event.target instanceof HTMLElement && Boolean(event.target.closest('input, textarea, select, [contenteditable="true"]')));
