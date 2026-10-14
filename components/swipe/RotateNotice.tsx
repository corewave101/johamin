import { useEffect, useRef } from 'react';

/**
 * 가로 화면 안내: fills the screen like 갑툭튀, but calm and black with only the guidance.
 * Rotating the phone closes it by itself; any key or the button keeps going upright (figure cards left out).
 */
export default function RotateNotice({ onContinue }: { onContinue: () => void }) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { button.current?.focus(); }, []);
  useEffect(() => {
    // The menu underneath listens to arrow keys on window; while the notice is up, a key only dismisses it.
    const onKey = (event: KeyboardEvent) => { event.preventDefault(); event.stopImmediatePropagation(); onContinue(); };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onContinue]);
  return <div className="rotate-notice" role="dialog" aria-modal="true" aria-labelledby="rotate-notice-title">
    <div className="rotate-notice-phone" aria-hidden="true"><i /></div>
    <h2 id="rotate-notice-title">화면을 가로로 돌려 주세요</h2>
    <p>뭉탱이에는 그림 문제가 있어요.<br />그림 카드는 가로 화면에서만 나와요.</p>
    <button type="button" ref={button} onClick={onContinue}>세로로 그냥 풀기 <small>그림 문제는 빼고</small></button>
  </div>;
}
