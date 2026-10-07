// Jump scares follow the blessing: only 하민의 가호 has them. (The blessing itself lives in lib/theme.ts.)
import { getTheme, onThemeChange } from './theme';

export const isBlessed = () => getTheme().scares;

/** Calls back when scares turn on or off. */
export function onBlessedChange(listener: (on: boolean) => void) {
  let last = isBlessed();
  return onThemeChange(theme => {
    if (theme.scares !== last) { last = theme.scares; listener(last); }
  });
}
