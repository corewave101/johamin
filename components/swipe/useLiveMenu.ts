import { useEffect, useState } from 'react';
import { subjectMenu, type SubjectGroup, type SubjectNode } from '../../data/swipe-subjects';
import { trackPromise } from '../../lib/boot';
import { cachedRows, cacheRows, fetchCardRows, groupRows, withLiveCards } from '../../lib/card-store';

/**
 * The subject menu with cards from the Supabase database.
 * Starts from the last copy saved on this device (or the bundled cards), then swaps in fresh database cards.
 * If the database cannot be reached, the bundled cards keep working.
 */
export function useLiveMenu(): SubjectGroup {
  const [menu, setMenu] = useState<SubjectGroup>(() => {
    const cached = cachedRows();
    return cached?.length ? withLiveCards(subjectMenu, groupRows(cached)) : subjectMenu;
  });
  useEffect(() => {
    const controller = new AbortController();
    trackPromise('cards', fetchCardRows(controller.signal)).then(rows => {
      if (!rows.length) return;
      cacheRows(rows);
      setMenu(withLiveCards(subjectMenu, groupRows(rows)));
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
