import { useEffect, useState, type ReactNode } from 'react';
import { auth, checkAccess, signIn, signOut, type Access } from '../../lib/auth';
import { trackPromise } from '../../lib/boot';
import { shortEmail } from '../../lib/member';
import LaminatedCard from './LaminatedCard';

/** 로그인한 학교 계정 중 DB가 허용한 사람만 과목 메뉴로 들어간다. */
export default function AuthGate({ children }: { children: ReactNode }) {
  const [access, setAccess] = useState<Access>({ state: 'checking' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let alive = true;
    // The intro waits for this check, so the login card never flashes before the menu.
    const run = () => { trackPromise('login', checkAccess()).then(next => { if (alive) setAccess(next); }, () => { if (alive) setAccess({ state: 'signed-out' }); }); };
    run();
    window.addEventListener('johamin:auth', run);
    return () => { alive = false; window.removeEventListener('johamin:auth', run); };
  }, []);

  if (access.state === 'ok') return <>{children}</>;

  const login = async (switchAccount = false) => {
    setBusy(true); setMessage('');
    try {
      if (switchAccount) await signOut();
      await signIn(); // leaves the page for Google
    } catch {
      setMessage('구글 로그인 화면을 열지 못했어요. 인터넷을 확인해 주세요.');
      setBusy(false);
    }
  };
  const retry = () => { setAccess({ state: 'checking' }); window.dispatchEvent(new Event('johamin:auth')); };

  const view = {
    checking: { question: '확인하고 있어요…', note: '' },
    'signed-out': { question: '학교 계정으로 들어와요', note: '학교 구글 계정(@bsis.hs.kr)으로 로그인해요' },
    denied: { question: '아직 열리지 않은 계정이에요', note: '지금은 일부 반이 먼저 써 보고 있어요. 곧 열릴 거예요' },
    error: { question: '연결을 확인해 주세요', note: '로그인은 됐는데 확인을 못 했어요' },
  }[access.state];
  const email = 'email' in access ? shortEmail(access.email) : '';
  const shown = message || (access.state === 'signed-out' ? access.message ?? '' : '');

  return <main className="swipe-app login-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass">조하민<span>레츠고</span></h1></header>
      <section className="login-board" aria-live="polite">
        <div className="swipe-stack login-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard className="is-current" topic="로그인" subject={email || undefined} question={view.question} />
        </div>
        {access.state !== 'checking' && <div className="login-actions">
          {access.state === 'signed-out' && <button type="button" className="glass-button is-primary login-main" autoFocus disabled={busy} onClick={() => login()}>{busy ? '구글로 가는 중…' : '구글로 로그인'}</button>}
          {access.state === 'denied' && <button type="button" className="glass-button is-primary login-main" autoFocus disabled={busy} onClick={() => login(true)}>다른 계정으로 로그인</button>}
          {access.state === 'error' && <button type="button" className="glass-button is-primary login-main" autoFocus onClick={retry}>다시 확인</button>}
          {(access.state === 'denied' || access.state === 'error') && <button type="button" className="glass-button" disabled={busy} onClick={() => void signOut()}>로그아웃</button>}
          {view.note && <p className="login-note glass">{view.note}</p>}
          {shown && <p className="login-message glass" role="alert">{shown}</p>}
        </div>}
      </section>
    </div>
  </main>;
}

/** 업데이트 기록 창 맨 위: 지금 로그인한 계정과 로그아웃. */
export function AccountRow({ onSignOut }: { onSignOut?: () => void }) {
  const [email, setEmail] = useState('');
  useEffect(() => {
    let alive = true;
    auth.getSession().then(({ data }) => { if (alive) setEmail(data.session?.user.email ?? ''); }, () => {});
    return () => { alive = false; };
  }, []);
  if (!email) return null;
  return <div className="account-row"><span>{shortEmail(email)} 로그인 중</span><button type="button" className="glass-button" onClick={() => { onSignOut?.(); void signOut(); }}>로그아웃</button></div>;
}

/** While the card file is still coming (only on a very slow first visit). */
export function LoadingCard() {
  return <main className="swipe-app login-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass">조하민<span>레츠고</span></h1></header>
      <section className="login-board" aria-live="polite">
        <div className="swipe-stack login-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard className="is-current" topic="준비" question="카드 불러오는 중…" />
        </div>
      </section>
    </div>
  </main>;
}

/** The card file could not be loaded (connection dropped on the first visit). */
export function LoadFailed() {
  return <main className="swipe-app login-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass">조하민<span>레츠고</span></h1></header>
      <section className="login-board" aria-live="polite">
        <div className="swipe-stack login-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard className="is-current" topic="연결" question="카드를 불러오지 못했어요" />
        </div>
        <div className="login-actions">
          <button type="button" className="glass-button is-primary login-main" autoFocus onClick={() => window.location.reload()}>다시 불러오기</button>
        </div>
      </section>
    </div>
  </main>;
}
