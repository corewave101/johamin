import { createRoot } from 'react-dom/client';
import Backdrop from '../components/swipe/Backdrop';
import BlessingToggle from '../components/swipe/BlessingToggle';
import JumpscareLayer from '../components/swipe/JumpscareLayer';
import SoundToggle from '../components/swipe/SoundToggle';
import SubjectPicker from '../components/swipe/SubjectPicker';
import SwipeGame from '../components/swipe/SwipeGame';
import './globals.css';
import './scene.css';
import './swipe.css';

// #demo (or the older #johamin/demo) opens the sample deck; every other address opens the subject menu.
const isDemo = ['#demo', '#johamin/demo'].includes(window.location.hash);
createRoot(document.getElementById('root')!).render(<>
  <Backdrop />
  <SoundToggle />
  <BlessingToggle />
  {isDemo ? <SwipeGame /> : <SubjectPicker />}
  <JumpscareLayer />
</>);
