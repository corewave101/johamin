import { useEffect, useRef, useState } from 'react';
import { isBlessed, onBlessedChange, setBlessed } from '../../lib/blessing';
import { bestStreak, onBestStreakChange } from '../../lib/best-streak';

/** "하민의 가호" switch. Turning it off asks for confirmation. Also shows the device's best streak. */
export default function BlessingToggle() {
  const [on, setOn] = useState(isBlessed);
  const [best, setBest] = useState(bestStreak);
  const [asking, setAsking] = useState(false);
  const keep = useRef<HTMLButtonElement>(null);
  useEffect(() => onBlessedChange(setOn), []);
  useEffect(() => onBestStreakChange(setBest), []);

  useEffect(() => {
    if (!asking) return;
    keep.current?.focus();
    // Keys inside the warning must not answer cards behind it.
    const guard = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === 'Escape') setAsking(false);
    };
    window.addEventListener('keydown', guard, true);
    return () => window.removeEventListener('keydown', guard, true);
  }, [asking]);

  return <>
    <button type="button" className={`blessing-toggle glass ${on ? 'is-on' : 'is-off'}`} aria-pressed={on}
      onClick={() => on ? setAsking(true) : setBlessed(true)}>
      <strong>{on ? '✦ 하민의 가호' : '가호 없음'}</strong>
      {best && <span className="blessing-best"><b>{best.count}</b> {best.subject}</span>}
    </button>
    {asking && <div className="blessing-warning" role="alertdialog" aria-modal="true" aria-labelledby="blessing-warning-title">
      <div className="blessing-warning-box glass">
        <h2 id="blessing-warning-title">경고</h2>
        <p>하민의 가호를 거두면 그대가 겪는 모든 불행은 온전히 그대의 몫입니다. 정말 거두시겠습니까?</p>
        <div className="blessing-warning-actions">
          <button type="button" ref={keep} className="blessing-keep" onClick={() => setAsking(false)}>가호 유지</button>
          <button type="button" className="glass-button" onClick={() => { setBlessed(false); setAsking(false); }}>거둔다</button>
        </div>
      </div>
    </div>}
  </>;
}
