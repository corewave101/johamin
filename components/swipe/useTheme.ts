import { useSyncExternalStore } from 'react';
import { getTheme, onThemeChange, type Theme } from '../../lib/theme';

/** The current blessing's look (name, coin text, palette, pictures). Re-renders when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(onThemeChange, getTheme, getTheme);
}

/** Coin text size as a share of the coin's diameter, so long or Korean text still fits. */
export function coinTextScale(text: string, side: 'front' | 'back') {
  const width = [...text].reduce((sum, ch) => sum + (/[ㄱ-힝]/.test(ch) ? 1.3 : /[A-Z0-9]/.test(ch) ? 1 : 0.8), 0) || 1;
  return side === 'front' ? Math.min(0.42, 0.84 / width) : Math.min(0.26, 1.45 / width);
}
