import { useEffect, useState } from 'react';
import { goHome, onScare, SCARE_IDS, type ScareEvent } from '../../lib/jumpscare';
import { isBlessed, onBlessedChange } from '../../lib/blessing';
import { playSound } from '../../lib/scare-sounds';
import { preloadImage, trackPromise } from '../../lib/boot';

const image = (id: string) => `${import.meta.env.BASE_URL}scares/${id}.webp`;

/** Fills the screen with a scare photo, then fades it out over one second. The idle scare stays until any input. */
export default function JumpscareLayer() {
  const [scare, setScare] = useState<ScareEvent | null>(null);

  // Preload the photos while the blessing is on, so a scare appears instantly.
  useEffect(() => {
    const preload = (on: boolean) => Promise.all(on ? SCARE_IDS.map(id => preloadImage(image(id))) : []);
    trackPromise('scares', preload(isBlessed())); // the intro waits for these
    return onBlessedChange(on => { void preload(on); });
  }, []);

  useEffect(() => onScare(event => { setScare(event); playSound(event.sound); }), []);

  // Clears a fading scare after its one-second fade (also when animations are turned off).
  useEffect(() => {
    if (!scare || scare.persistent) return;
    const timer = setTimeout(() => setScare(current => current === scare ? null : current), 1000);
    return () => clearTimeout(timer);
  }, [scare]);

  useEffect(() => {
    if (!scare?.persistent) return;
    const dismiss = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setScare(null);
      goHome();
    };
    window.addEventListener('keydown', dismiss, true);
    window.addEventListener('pointerdown', dismiss, true);
    return () => { window.removeEventListener('keydown', dismiss, true); window.removeEventListener('pointerdown', dismiss, true); };
  }, [scare]);

  if (!scare) return null;
  return <div key={scare.key} className={`jumpscare ${scare.persistent ? 'is-stuck' : 'is-fading'}`} aria-hidden="true"
    style={{ backgroundImage: `url("${/^(blob:|data:|https?:)/.test(scare.image) ? scare.image : image(scare.image.replace(/^scares\/|\.webp$/g, ''))}")` }} />;
}
