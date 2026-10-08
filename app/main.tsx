import '../components/swipe/observation.css';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AppStatus from '../components/swipe/AppStatus';
import Backdrop from '../components/swipe/Backdrop';
import BlessingToggle from '../components/swipe/BlessingToggle';
import CardSizeControl from '../components/swipe/CardSizeControl';
import Intro from '../components/swipe/Intro';
import JumpscareLayer from '../components/swipe/JumpscareLayer';
import SoundToggle from '../components/swipe/SoundToggle';
import SubjectPicker from '../components/swipe/SubjectPicker';
import SwipeGame from '../components/swipe/SwipeGame';
import UpdateLog from '../components/swipe/UpdateLog';
import './globals.css';
import './scene.css';
import './swipe.css';
import './intro.css';
import './blessing.css';

// #demo (or the older #johamin/demo) opens the sample deck; every other address opens the subject menu.
const isDemo = ['#demo', '#johamin/demo'].includes(window.location.hash);
// Offline support: the service worker keeps the app on this device after the first visit (only in the built site).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Start without waiting for every external font or video to finish loading.
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* the site still works online */ });
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
  {isDemo ? <SwipeGame /> : <SubjectPicker />}
  <AppStatus />
  <JumpscareLayer />
  <IntroHost />
  <UpdateLog version={__APP_VERSION__} changelog={__CHANGELOG__} />
</>);
