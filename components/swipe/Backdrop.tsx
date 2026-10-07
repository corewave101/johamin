import { useEffect, useRef, useState } from 'react';
import { preloadImage, trackLoad, trackPromise } from '../../lib/boot';

const POSTER = `${import.meta.env.BASE_URL}videos/johamin-bg-poster.webp`;
// Phones and data-saver connections get the lighter 720p loop.
const pickSource = () => {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return saveData || matchMedia('(max-width: 900px)').matches ? `${import.meta.env.BASE_URL}videos/johamin-bg-720.mp4` : `${import.meta.env.BASE_URL}videos/johamin-bg-1080.mp4`;
};

/** Looping village video behind everything. It shifts slightly with the pointer (or phone tilt) for depth. */
export default function Backdrop() {
  const scene = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [still] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [source] = useState(pickSource);

  // The intro screen waits until the poster is in and the video can play through.
  useEffect(() => {
    trackPromise('poster', preloadImage(POSTER));
    const clip = video.current;
    if (!clip) return;
    const load = trackLoad('video');
    const onProgress = () => {
      if (clip.readyState >= 4) return load.done();
      if (clip.duration > 0 && clip.buffered.length) load.progress(clip.buffered.end(clip.buffered.length - 1) / clip.duration);
    };
    const events = ['progress', 'loadeddata', 'canplay'] as const;
    events.forEach(name => clip.addEventListener(name, onProgress));
    clip.addEventListener('canplaythrough', load.done);
    clip.addEventListener('error', load.done);
    onProgress();
    return () => {
      events.forEach(name => clip.removeEventListener(name, onProgress));
      clip.removeEventListener('canplaythrough', load.done);
      clip.removeEventListener('error', load.done);
    };
  }, []);

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
