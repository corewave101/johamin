// Bottom-right version label. Clicking it opens the update log (CHANGELOG.md), newest first.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { setBeta } from '../../lib/beta';
import { parseChangelog } from '../../lib/changelog';
import { useBeta } from './useBeta';

/** 3.3.0-beta.1 → 3.3.0 베타.1 */
export const showVersion = (v: string) => v.replace(/-beta\.(\d+)$/, ' 베타.$1');

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
/** Plain text with [label](href) links. `#beta` is the 베타 테스트 switch; other links open in a new tab. */
function LogText({ text, beta }: { text: string; beta: boolean }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const [, label, href] = m;
    parts.push(href === '#beta'
      ? <button key={at} type="button" className={`update-log-beta ${beta ? 'is-on' : ''}`} aria-pressed={beta} onClick={() => setBeta(!beta)}>{beta ? '베타 테스트 해제' : label}</button>
      : <a key={at} href={href} target="_blank" rel="noreferrer">{label}</a>);
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function UpdateLog({ version, changelog }: { version: string; changelog: string }) {
  const [open, setOpen] = useState(false);
  const beta = useBeta();
  const versions = useMemo(() => parseChangelog(changelog), [changelog]);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    // While the log is open, keys must not answer cards or move menus behind it.
    const guard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') return;
      event.stopPropagation();
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    };
    window.addEventListener('keydown', guard, true);
    return () => window.removeEventListener('keydown', guard, true);
  }, [open]);
  return <>
    <button type="button" className="app-version" onClick={() => setOpen(true)} aria-haspopup="dialog" title="업데이트 기록 보기">v{showVersion(version)}{beta && <b className="app-version-beta"> β</b>}</button>
    {open && <div className="update-log" role="dialog" aria-modal="true" aria-labelledby="update-log-title" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="update-log-panel glass">
        <header><h2 id="update-log-title">업데이트 기록</h2><button type="button" ref={close} className="glass-button" onClick={() => setOpen(false)}>닫기</button></header>
        <div className="update-log-list">
          {versions.length === 0 && <p>기록이 없어요.</p>}
          {versions.map((v, i) => <details key={v.version} open={i === 0} className="update-log-version">
            <summary><strong>v{showVersion(v.version)}</strong>{v.date && <span>{v.date}</span>}{v.version === version && <em>지금 버전</em>}{v.version.includes('-') && beta && <em>켜짐</em>}</summary>
            <ul>{v.items.map((item, k) => <li key={k}><LogText text={item.text} beta={beta} />{item.children.length > 0 && <ul>{item.children.map((c, j) => <li key={j}><LogText text={c} beta={beta} /></li>)}</ul>}</li>)}</ul>
          </details>)}
        </div>
      </div>
    </div>}
  </>;
}
