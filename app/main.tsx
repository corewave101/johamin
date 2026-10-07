import { createRoot } from 'react-dom/client';
import Backdrop from '../components/swipe/Backdrop';
import BlessingToggle from '../components/swipe/BlessingToggle';
import Intro from '../components/swipe/Intro';
import JumpscareLayer from '../components/swipe/JumpscareLayer';
import SoundToggle from '../components/swipe/SoundToggle';
import SubjectPicker from '../components/swipe/SubjectPicker';
import SwipeGame from '../components/swipe/SwipeGame';
import './globals.css';
import './scene.css';
import './swipe.css';
import './intro.css';

// #demo (or the older #johamin/demo) opens the sample deck; every other address opens the subject menu.
const isDemo = ['#demo', '#johamin/demo'].includes(window.location.hash);
// Offline support: the service worker keeps the app on this device after the first visit (only in the built site).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* the site still works online */ }); });
}

createRoot(document.getElementById('root')!).render(<>
  <Backdrop />
  <SoundToggle />
  <BlessingToggle />
  {isDemo ? <SwipeGame /> : <SubjectPicker />}
  <JumpscareLayer />
  <Intro />
  <span className="app-version">v{__APP_VERSION__}</span>
</>);
