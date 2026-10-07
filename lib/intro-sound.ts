import { audio, isMuted, onMutedChange } from './sound';

/**
 * A real recording wins over the synthesized wind.
 * To use one: put e.g. `desert-wind.mp3` in public/sounds/ and set this to 'sounds/desert-wind.mp3'.
 */
export const INTRO_SOUND_FILE: string | null = null;

const LENGTH = 9; // seconds: a gust on the press, then the wind dies down on the main screen
let windNoise: AudioBuffer | null = null;

// Longer than the effects' noise so the loop is not heard as a repeat.
function longNoise(ctx: AudioContext) {
  if (!windNoise) {
    windNoise = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = windNoise.getChannelData(c);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
  }
  return windNoise;
}

/** Desert wind for the start button: a whoosh, a low roar, a wandering whistle and sand hiss. Respects mute. */
export function playDesertWind() {
  if (isMuted()) return;
  if (INTRO_SOUND_FILE) {
    const sound = new Audio(`${import.meta.env.BASE_URL}${INTRO_SOUND_FILE}`);
    const stop = onMutedChange(muted => { if (muted) sound.pause(); });
    sound.addEventListener('ended', stop);
    void sound.play().catch(() => { stop(); synthWind(); });
    return;
  }
  synthWind();
}

function synthWind() {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime + 0.02, end = t + LENGTH;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(0.55, t + 0.45);
  master.gain.exponentialRampToValueAtTime(0.3, t + 2.6);
  master.gain.exponentialRampToValueAtTime(0.0001, end);
  master.connect(ctx.destination);
  const stopMute = onMutedChange(muted => {
    if (!muted) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
  });
  setTimeout(stopMute, LENGTH * 1000 + 500);

  const source = (offset: number) => {
    const node = ctx.createBufferSource();
    node.buffer = longNoise(ctx);
    node.loop = true;
    node.start(t, offset);
    node.stop(end + 0.1);
    return node;
  };
  const filter = (type: BiquadFilterType, frequency: number, q: number) => {
    const node = ctx.createBiquadFilter();
    node.type = type; node.frequency.value = frequency; node.Q.value = q;
    return node;
  };
  const level = (value: number) => { const node = ctx.createGain(); node.gain.value = value; return node; };
  const lfo = (target: AudioParam, rate: number, depth: number) => {
    const wave = ctx.createOscillator(); wave.frequency.value = rate;
    wave.connect(level(depth)).connect(target);
    wave.start(t); wave.stop(end + 0.1);
  };
  // A smooth random walk, for the wind's pitch and gusts.
  const wander = (low: number, high: number, points = 24) => {
    const curve = new Float32Array(points);
    let value = (low + high) / 2;
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.5) * (high - low) * 0.45;
      value = Math.min(high, Math.max(low, value));
      curve[i] = value;
    }
    return curve;
  };

  // Gust on the press: a band of noise sweeping up and back down.
  const gust = filter('bandpass', 300, 1.2);
  gust.frequency.setValueAtTime(260, t);
  gust.frequency.exponentialRampToValueAtTime(2200, t + 0.5);
  gust.frequency.exponentialRampToValueAtTime(500, t + 1.6);
  const gustLevel = level(0);
  gustLevel.gain.setValueAtTime(0.0001, t);
  gustLevel.gain.exponentialRampToValueAtTime(0.9, t + 0.35);
  gustLevel.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
  source(0).connect(gust).connect(gustLevel).connect(master);

  // Low roar that breathes slowly.
  const roar = filter('lowpass', 420, 0.7);
  lfo(roar.frequency, 0.17, 220);
  const roarLevel = level(0.75);
  lfo(roarLevel.gain, 0.23, 0.25);
  source(1.3).connect(roar).connect(roarLevel).connect(master);

  // Whistle over the dunes: a narrow band whose pitch wanders.
  const whistle = filter('bandpass', 700, 14);
  whistle.frequency.setValueCurveAtTime(wander(420, 1150), t, LENGTH);
  const whistleLevel = level(0);
  whistleLevel.gain.setValueCurveAtTime(wander(0.15, 0.9), t, LENGTH);
  const pan = ctx.createStereoPanner();
  pan.pan.setValueCurveAtTime(wander(-0.7, 0.7, 12), t, LENGTH);
  source(2.1).connect(whistle).connect(whistleLevel).connect(pan).connect(master);

  // Sand hissing across the ground, coming in gusts.
  const hiss = filter('highpass', 4800, 0.7);
  const hissLevel = level(0);
  hissLevel.gain.setValueCurveAtTime(wander(0.02, 0.16), t, LENGTH);
  source(2.9).connect(hiss).connect(hissLevel).connect(master);
}
