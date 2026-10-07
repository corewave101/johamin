import type { ScareId } from './jumpscare';
import { audio, isMuted, noiseBuffer } from './sound';

/**
 * Real sound files win over the synthesized placeholders.
 * To use one: put e.g. `ya.mp3` in public/sounds/ and add `ya: 'sounds/ya.mp3'` here.
 */
export const SCARE_SOUND_FILES: Partial<Record<ScareId, string>> = {};

type Ctx = AudioContext;
const out = (ctx: Ctx, peak: number, start: number, attack: number, hold: number, release: number) => {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.setValueAtTime(peak, start + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + hold + release);
  gain.connect(ctx.destination);
  return gain;
};
const osc = (ctx: Ctx, type: OscillatorType, freq: number, start: number, stop: number) => {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, start); o.start(start); o.stop(stop); return o;
};
const filter = (ctx: Ctx, type: BiquadFilterType, freq: number, q = 1) => {
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f;
};
const noise = (ctx: Ctx, start: number, length: number) => {
  const n = ctx.createBufferSource(); n.buffer = noiseBuffer(ctx); n.loop = true; n.start(start); n.stop(start + length); return n;
};
const vibrato = (ctx: Ctx, target: AudioParam, rate: number, depth: number, start: number, stop: number) => {
  const lfo = osc(ctx, 'sine', rate, start, stop); const amount = ctx.createGain(); amount.gain.value = depth; lfo.connect(amount).connect(target);
};
/** A sung or spoken vowel: a buzzy source through two formant filters. */
function vowel(ctx: Ctx, start: number, length: number, pitch: [number, number][], formants: [number, number], peak: number) {
  const source = osc(ctx, 'sawtooth', pitch[0][1], start, start + length + 0.1);
  for (const [at, f] of pitch) source.frequency.linearRampToValueAtTime(f, start + at);
  const gain = out(ctx, peak, start, 0.06, Math.max(0, length - 0.3), 0.24);
  for (const f of formants) source.connect(filter(ctx, 'bandpass', f, 6)).connect(gain);
  return source;
}

const synth: Record<ScareId, (ctx: Ctx, t: number) => void> = {
  // 1 성악가의 "아~": a bright vowel with operatic vibrato and a small choir an octave below.
  aria(ctx, t) {
    for (const [base, peak] of [[523, 0.5], [262, 0.3]] as const) {
      const v = vowel(ctx, t, 1.9, [[0, base * 0.97], [0.25, base], [1.9, base]], [800, 1200], peak);
      vibrato(ctx, v.frequency, 5.6, base * 0.025, t, t + 2);
    }
  },
  // 2 방구: a low wobbling buzz that sags in pitch.
  fart(ctx, t) {
    const body = osc(ctx, 'sawtooth', 120, t, t + 0.9);
    body.frequency.exponentialRampToValueAtTime(62, t + 0.85);
    vibrato(ctx, body.frequency, 23, 18, t, t + 0.9);
    const gain = out(ctx, 0.6, t, 0.02, 0.55, 0.25);
    body.connect(filter(ctx, 'lowpass', 520, 3)).connect(gain);
    noise(ctx, t, 0.85).connect(filter(ctx, 'bandpass', 180, 2)).connect(out(ctx, 0.25, t, 0.02, 0.5, 0.3));
  },
  // 3 임포스터 (placeholder until the real file arrives): two heavy hits and a dissonant swell.
  impostor(ctx, t) {
    for (const at of [0, 0.35]) {
      const hit = osc(ctx, 'sine', 90, t + at, t + at + 0.6); hit.frequency.exponentialRampToValueAtTime(42, t + at + 0.5);
      hit.connect(out(ctx, 0.8, t + at, 0.005, 0.05, 0.45));
    }
    for (const f of [110, 116.5, 164.8]) osc(ctx, 'sawtooth', f, t + 0.7, t + 2).connect(filter(ctx, 'lowpass', 700)).connect(out(ctx, 0.12, t + 0.7, 0.4, 0.4, 0.5));
  },
  // 4 쨍그랑: glass shards — bright noise bursts and ringing inharmonic partials.
  crash(ctx, t) {
    noise(ctx, t, 0.12).connect(filter(ctx, 'highpass', 2500)).connect(out(ctx, 0.7, t, 0.002, 0.02, 0.1));
    for (let i = 0; i < 7; i++) {
      const at = t + 0.05 + i * 0.06 + Math.random() * 0.05;
      noise(ctx, at, 0.07).connect(filter(ctx, 'bandpass', 3500 + Math.random() * 4500, 8)).connect(out(ctx, 0.35, at, 0.002, 0.01, 0.06));
    }
    for (const f of [2120, 3410, 4870, 6230]) osc(ctx, 'sine', f, t, t + 1).connect(out(ctx, 0.07, t, 0.002, 0, 0.8));
  },
  // 5 "야" (placeholder): a short, sharp shouted vowel.
  ya(ctx, t) { vowel(ctx, t, 0.32, [[0, 300], [0.08, 330], [0.32, 210]], [850, 1350], 0.9); },
  // 6 뱃고동: a long, low ship horn.
  horn(ctx, t) {
    const gain = out(ctx, 0.5, t, 0.18, 1.6, 0.5);
    for (const f of [73, 110]) osc(ctx, 'sawtooth', f, t, t + 2.4).connect(filter(ctx, 'lowpass', 480, 2)).connect(gain);
  },
  // 7 긁적긁적: quick scratchy strokes.
  scratch(ctx, t) {
    for (let i = 0; i < 6; i++) {
      const at = t + i * 0.12;
      noise(ctx, at, 0.08).connect(filter(ctx, 'bandpass', i % 2 ? 2600 : 3800, 3)).connect(out(ctx, 0.45, at, 0.01, 0.03, 0.04));
    }
  },
  // 8 "BALL" (placeholder): a dull thud and a bouncy boing.
  ball(ctx, t) {
    const thud = osc(ctx, 'sine', 140, t, t + 0.3); thud.frequency.exponentialRampToValueAtTime(50, t + 0.25); thud.connect(out(ctx, 0.8, t, 0.003, 0.02, 0.22));
    const boing = osc(ctx, 'triangle', 420, t + 0.12, t + 1); boing.frequency.exponentialRampToValueAtTime(110, t + 0.95);
    vibrato(ctx, boing.frequency, 11, 30, t + 0.12, t + 1); boing.connect(out(ctx, 0.4, t + 0.12, 0.01, 0.4, 0.4));
  },
  // 9 (idle): silent.
  idle() {},
  // 10 애교 (placeholder): a cute rising "뿌잉".
  leave(ctx, t) {
    for (const at of [0, 0.32]) {
      const v = osc(ctx, 'triangle', 650, t + at, t + at + 0.3); v.frequency.exponentialRampToValueAtTime(1250, t + at + 0.25);
      v.connect(out(ctx, 0.35, t + at, 0.02, 0.12, 0.12));
    }
  },
  // 11 "으으응??" (placeholder): a hummed "u" that bends up into a question.
  huh(ctx, t) { vowel(ctx, t, 1.1, [[0, 190], [0.35, 175], [0.6, 180], [1.05, 340]], [350, 800], 0.8); },
};

export function playScare(id: ScareId) {
  if (isMuted()) return;
  const file = SCARE_SOUND_FILES[id];
  if (file) {
    const sound = new Audio(`${import.meta.env.BASE_URL}${file}`);
    void sound.play().catch(() => synthScare(id));
    return;
  }
  synthScare(id);
}
function synthScare(id: ScareId) {
  const ctx = audio();
  if (ctx) synth[id](ctx, ctx.currentTime + 0.01);
}
