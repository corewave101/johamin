import { useEffect, useState } from 'react';
import { isMuted, onMutedChange, setMuted } from '../../lib/sound';

export default function SoundToggle() {
  const [muted, setState] = useState(isMuted);
  useEffect(() => onMutedChange(setState), []);
  return <button type="button" className="sound-toggle glass" onClick={() => setMuted(!muted)} aria-pressed={muted} aria-label={muted ? '소리 켜기' : '소리 끄기'}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {muted ? <path d="M16 9.5l5 5m0-5l-5 5" /> : <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.7 7.7 0 0 1 0 11" />}
    </svg>
  </button>;
}
