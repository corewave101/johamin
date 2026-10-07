import type { Direction } from '../data/swipe-cards';

// All sounds are synthesized with the Web Audio API, so there are no audio files to load.
const STORAGE_KEY = 'johamin-muted';
let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let muted = (() => { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; } })();
const listeners = new Set<(muted: boolean) => void>();

export const isMuted = () => muted;
export function setMuted(value: boolean) {
  muted = value;
  try { localStorage.setItem(STORAGE_KEY, value ? '1' : '0'); } catch { /* storage may be unavailable */ }
  listeners.forEach(listener => listener(value));
}
export function onMutedChange(listener: (muted: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function audio() {
  if (muted) return null;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

export function noiseBuffer(ctx: AudioContext) {
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

export function envelope(ctx: AudioContext, start: number, peak: number, attack: number, release: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);
  return gain;
}

function panner(ctx: AudioContext, direction: Direction) {
  const pan = ctx.createStereoPanner();
  pan.pan.value = direction === 'left' ? -0.55 : direction === 'right' ? 0.55 : 0;
  return pan;
}

/** A short paper flick followed by an air whoosh, panned toward the swipe direction. */
export function playSwipe(direction: Direction) {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime;
  const pan = panner(ctx, direction);
  pan.connect(ctx.destination);

  const flick = ctx.createBufferSource();
  flick.buffer = noiseBuffer(ctx);
  const crisp = ctx.createBiquadFilter();
  crisp.type = 'highpass';
  crisp.frequency.value = 3200;
  flick.connect(crisp).connect(envelope(ctx, t, 0.22, 0.003, 0.03)).connect(pan);
  flick.start(t, 0.1, 0.05);

  const whoosh = ctx.createBufferSource();
  whoosh.buffer = noiseBuffer(ctx);
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(2600, t);
  band.frequency.exponentialRampToValueAtTime(420, t + 0.3);
  whoosh.connect(band).connect(envelope(ctx, t + 0.01, 0.3, 0.04, 0.26)).connect(pan);
  whoosh.start(t + 0.01, 0, 0.34);
}

function tone(ctx: AudioContext, type: OscillatorType, from: number, to: number, start: number, length: number, peak: number) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + length);
  osc.connect(envelope(ctx, start, peak, 0.01, length)).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

/** A soft rising chime for a correct answer, a low dull tone for a wrong one. */
export function playResult(correct: boolean) {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime + 0.12;
  if (correct) {
    tone(ctx, 'sine', 784, 784, t, 0.16, 0.09);
    tone(ctx, 'sine', 1175, 1175, t + 0.07, 0.22, 0.07);
  } else {
    tone(ctx, 'triangle', 220, 150, t, 0.22, 0.1);
  }
}

/** A light tick for menu navigation. */
export function playTick() {
  const ctx = audio();
  if (!ctx) return;
  tone(ctx, 'sine', 1400, 900, ctx.currentTime, 0.05, 0.05);
}
