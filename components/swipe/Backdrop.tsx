import { useEffect, useRef, useState } from 'react';

const POSTER = '/videos/johamin-bg-poster.webp';
// Phones and data-saver connections get the lighter 720p loop.
const pickSource = () => {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return saveData || matchMedia('(max-width: 900px)').matches ? '/videos/johamin-bg-720.mp4' : '/videos/johamin-bg-1080.mp4';
};

/** Looping village video behind everything. It shifts slightly with the pointer (or phone tilt) for depth. */
export default function Backdrop() {
  const scene = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [still] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [source] = useState(pickSource);

  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    clip.muted = true;
    const play = () => { void clip.play().catch(() => { /* the poster stays visible if autoplay is blocked */ }); };
    const onVisibility = () => { if (document.hidden) clip.pause(); else play(); };
    play();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = scene.current;
    if (!el || still) return;
    let frame = 0, targetX = 0, targetY = 0, x = 0, y = 0;
    const step = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el.style.setProperty('--px', x.toFixed(4));
      el.style.setProperty('--py', y.toFixed(4));
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const aim = (nx: number, ny: number) => {
      targetX = Math.max(-1, Math.min(1, nx));
      targetY = Math.max(-1, Math.min(1, ny));
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onPointer = (event: PointerEvent) => aim(event.clientX / innerWidth * 2 - 1, event.clientY / innerHeight * 2 - 1);
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) aim(event.gamma / 25, (event.beta - 45) / 25);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onTilt);
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onTilt);
      cancelAnimationFrame(frame);
    };
  }, [still]);

  return <div className="scene" ref={scene} aria-hidden="true">
    {still ? <div className="scene-media scene-poster" style={{ backgroundImage: `url('${POSTER}')` }} />
      : <video ref={video} className="scene-media" src={source} poster={POSTER} autoPlay muted loop playsInline preload="auto" disablePictureInPicture />}
    <div className="scene-shade" />
  </div>;
}
