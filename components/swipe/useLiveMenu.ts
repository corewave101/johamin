import { useEffect, useState } from 'react';
import { finalMenu } from '../../data/final-subjects';
import { subjectMenu, type SubjectGroup, type SubjectNode } from '../../data/swipe-subjects';
import { accessToken } from '../../lib/auth';
import { trackPromise } from '../../lib/boot';
import { cachedRows, cacheRows, fetchCardRows, groupRows, withLiveCards } from '../../lib/card-store';
import { isMidterm } from '../../lib/exam';

// /midterm/ shows the 중간고사 decks; the first screen shows this exam's (기말고사) decks.
const baseMenu = isMidterm ? subjectMenu : finalMenu;

/**
 * The subject menu with cards from the Supabase database.
 * Starts from the last copy saved on this device (or the bundled cards), then swaps in fresh database cards.
 * If the database cannot be reached, the bundled cards keep working.
 */
export function useLiveMenu(): SubjectGroup {
  const [menu, setMenu] = useState<SubjectGroup>(() => {
    const cached = cachedRows();
    return cached?.length ? withLiveCards(baseMenu, groupRows(cached)) : baseMenu;
  });
  useEffect(() => {
    const controller = new AbortController();
    // An empty answer (e.g. this account is not allowed) never replaces the copy saved on this device.
    trackPromise('cards', accessToken().then(token => fetchCardRows(controller.signal, token))).then(rows => {
      if (!rows.length) return;
      cacheRows(rows);
      setMenu(withLiveCards(baseMenu, groupRows(rows)));
    }).catch(() => { /* offline or database paused: keep what we have */ });
    return () => controller.abort();
  }, []);
  return menu;
}

export function findGroup(node: SubjectNode, id: string | undefined): SubjectGroup | undefined {
  if (node.kind !== 'group' || !id) return undefined;
  if (node.id === id) return node;
  for (const child of node.children) { const found = findGroup(child, id); if (found) return found; }
  return undefined;
}
