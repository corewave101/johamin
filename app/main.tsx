import '../components/swipe/observation.css';
import '../components/swipe/optics.css';
import '../components/swipe/structure.css';
import '../components/swipe/elice.css';
import '../components/swipe/lotte.css';
import '../components/swipe/lotte-theme.css';
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import AppStatus from '../components/swipe/AppStatus';
import AuthGate, { LoadFailed, LoadingCard } from '../components/swipe/AuthGate';
import Backdrop from '../components/swipe/Backdrop';
import BlessingToggle from '../components/swipe/BlessingToggle';
import CardSizeControl from '../components/swipe/CardSizeControl';
import Intro from '../components/swipe/Intro';
import JumpscareLayer from '../components/swipe/JumpscareLayer';
import LottePeek from '../components/swipe/LottePeek';
import LotteRadio from '../components/swipe/LotteRadio';
import SoundToggle from '../components/swipe/SoundToggle';
import UpdateLog from '../components/swipe/UpdateLog';
import { trackPromise } from '../lib/boot';
import { isElice, isLotte } from '../lib/exam';
import './globals.css';
import './scene.css';
import './swipe.css';
import './intro.css';
import './blessing.css';

// #demo (or the older #johamin/demo) opens the sample deck; /elice/ opens the 정보 코딩 연습장; every other address opens the subject menu.
const isDemo = ['#demo', '#johamin/demo'].includes(window.location.hash);
// The subject menu and every bundled card (about 2 MB) come in a separate file. It starts loading right away, in parallel
// with the intro and the login check, so the first screen no longer waits for all the cards. The intro waits for it.
const menuFile: Promise<{ default: ComponentType }> = trackPromise('menu',
  (isElice ? import('../components/swipe/EliceStudio') : isDemo ? import('../components/swipe/SwipeGame') : import('../components/swipe/SubjectPicker')) as Promise<{ default: ComponentType }>)
  .catch(() => ({ default: LoadFailed }));
const Menu = lazy(() => menuFile);
// Offline support: the service worker keeps the app on this device after the first visit (only in the built site).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // A few seconds in, so saving the offline copy never competes with the first screen (it does not wait for the video).
  setTimeout(() => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* the site still works online */ });
  }, 4000);
}

/** The JO intro; shown again whenever the blessing changes. */
function IntroHost() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const again = () => setRun(n => n + 1);
    window.addEventListener('johamin:intro', again);
    return () => window.removeEventListener('johamin:intro', again);
  }, []);
  return <Intro key={run} />;
}

createRoot(document.getElementById('root')!).render(<>
  <Backdrop />
  {!isElice && <><SoundToggle /><BlessingToggle /><CardSizeControl /></>}
  <AuthGate><Suspense fallback={<LoadingCard />}><Menu /></Suspense></AuthGate>
  {!isElice && <AppStatus />}
  {/* 정보 코딩 연습장: 가호 · 업데이트 확인 · 소리 · 버전을 위쪽 막대 오른쪽에 작게 모은다(components/swipe/elice.css). */}
  {isElice && <div className="elice-dock"><BlessingToggle /><AppStatus /><SoundToggle /><UpdateLog version={__APP_VERSION__} changelog={__CHANGELOG__} /></div>}
  {!isLotte && <LottePeek />}
  {isLotte && <LotteRadio />}
  <JumpscareLayer />
  <IntroHost />
  {!isElice && <UpdateLog version={__APP_VERSION__} changelog={__CHANGELOG__} />}
</>);
