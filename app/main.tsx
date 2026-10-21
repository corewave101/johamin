import '../components/swipe/observation.css';
import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import AppStatus from '../components/swipe/AppStatus';
import AuthGate, { LoadFailed, LoadingCard } from '../components/swipe/AuthGate';
import Backdrop from '../components/swipe/Backdrop';
import BlessingToggle from '../components/swipe/BlessingToggle';
import CardSizeControl from '../components/swipe/CardSizeControl';
import Intro from '../components/swipe/Intro';
import JumpscareLayer from '../components/swipe/JumpscareLayer';
import SoundToggle from '../components/swipe/SoundToggle';
import UpdateLog from '../components/swipe/UpdateLog';
import { trackPromise } from '../lib/boot';
import './globals.css';
import './scene.css';
import './swipe.css';
import './intro.css';
import './blessing.css';

// #demo (or the older #johamin/demo) opens the sample deck; every other address opens the subject menu.
const isDemo = ['#demo', '#johamin/demo'].includes(window.location.hash);
// The subject menu and every bundled card (about 2 MB) come in a separate file. It starts loading right away, in parallel
// with the intro and the login check, so the first screen no longer waits for all the cards. The intro waits for it.
const menuFile: Promise<{ default: ComponentType }> = trackPromise('menu',
  (isDemo ? import('../components/swipe/SwipeGame') : import('../components/swipe/SubjectPicker')) as Promise<{ default: ComponentType }>)
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
  <SoundToggle />
  <BlessingToggle />
  <CardSizeControl />
  <AuthGate><Suspense fallback={<LoadingCard />}><Menu /></Suspense></AuthGate>
  <AppStatus />
  <JumpscareLayer />
  <IntroHost />
  <UpdateLog version={__APP_VERSION__} changelog={__CHANGELOG__} />
</>);
