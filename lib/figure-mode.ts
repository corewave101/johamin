import { useEffect, useState } from 'react';

/**
 * 그림 카드 need the figure panel beside the card, so they only appear on a wide or landscape screen.
 * A phone held upright (or any narrow upright window) is "portrait": the deck asks to rotate,
 * and if the person keeps going upright, figure cards are left out of the game.
 */
export const PORTRAIT_QUERY = '(orientation: portrait) and (max-width: 900px)';

export function isPortrait(): boolean {
  try { return typeof matchMedia === 'function' && matchMedia(PORTRAIT_QUERY).matches; } catch { return false; }
}

export function usePortrait(): boolean {
  const [portrait, setPortrait] = useState(isPortrait);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia(PORTRAIT_QUERY);
    const update = () => setPortrait(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return portrait;
}
