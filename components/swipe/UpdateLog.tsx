// Bottom-right version label. Clicking it opens the update log (CHANGELOG.md), newest first.
import { useEffect, useMemo, useRef, useState } from 'react';
import { parseChangelog } from '../../lib/changelog';

export default function UpdateLog({ version, changelog }: { version: string; changelog: string }) {
  const [open, setOpen] = useState(false);
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
    <button type="button" className="app-version" onClick={() => setOpen(true)} aria-haspopup="dialog" title="업데이트 기록 보기">v{version}</button>
    {open && <div className="update-log" role="dialog" aria-modal="true" aria-labelledby="update-log-title" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="update-log-panel glass">
        <header><h2 id="update-log-title">업데이트 기록</h2><button type="button" ref={close} className="glass-button" onClick={() => setOpen(false)}>닫기</button></header>
        <div className="update-log-list">
          {versions.length === 0 && <p>기록이 없어요.</p>}
          {versions.map((v, i) => <details key={v.version} open={i === 0} className="update-log-version">
            <summary><strong>v{v.version}</strong>{v.date && <span>{v.date}</span>}{v.version === version && <em>지금 버전</em>}</summary>
            <ul>{v.items.map((item, k) => <li key={k}>{item.text}{item.children.length > 0 && <ul>{item.children.map((c, j) => <li key={j}>{c}</li>)}</ul>}</li>)}</ul>
          </details>)}
        </div>
      </div>
    </div>}
  </>;
}
