// Turns any picked colour into a natural coin palette.
// Only the hue (and a share of the saturation) is kept; lightness and chroma are set per tone in OKLCH,
// so a neon green still becomes a soft "green gold" coin with readable dark text.

export interface Palette { light: string; soft: string; base: string; deep: string; ink: string; glow: string }

/** The original 하민 gold, kept exactly as it was designed. */
export const HAMIN_PALETTE: Palette = { light: '#fff4c4', soft: '#f6d266', base: '#e8b931', deep: '#b67c14', ink: '#4a2b00', glow: '232 185 49' };

type Lch = { l: number; c: number; h: number };

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const s = m[1].length === 3 ? m[1].split('').map(ch => ch + ch).join('') : m[1];
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)) as [number, number, number];
}

export function hexToOklch(hex: string): Lch {
  const rgb = parseHex(hex) ?? [232, 185, 49];
  const [r, g, b] = rgb.map(v => toLinear(v / 255));
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function oklchToRgb({ l, c, h }: Lch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** OKLCH → sRGB, lowering chroma until the colour fits on screen (keeps hue and lightness). */
function toRgb255(color: Lch): [number, number, number] {
  let { c } = color;
  for (let i = 0; i < 30; i++) {
    const rgb = oklchToRgb({ ...color, c });
    if (rgb.every(v => v >= -0.0005 && v <= 1.0005)) return rgb.map(v => Math.round(Math.min(1, Math.max(0, toGamma(Math.max(0, v)))) * 255)) as [number, number, number];
    c *= 0.9;
  }
  const grey = Math.round(Math.min(1, Math.max(0, toGamma(color.l ** 3))) * 255);
  return [grey, grey, grey];
}

const hex = (rgb: [number, number, number]) => `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;

/** A coin palette in the picked colour's hue. Greys stay grey; loud colours are calmed to a metal-like tone. */
export function paletteFrom(picked: string): Palette {
  const { c, h } = hexToOklch(picked);
  // Keep a share of the picked saturation, within a range that reads as polished metal rather than plastic.
  const chroma = c < 0.025 ? c : Math.min(0.15, 0.035 + c * 0.6);
  const tone = (l: number, k: number) => hex(toRgb255({ l, c: chroma * k, h }));
  const glow = toRgb255({ l: 0.78, c: chroma, h });
  return {
    light: tone(0.96, 0.4),
    soft: tone(0.86, 0.85),
    base: tone(0.76, 1),
    deep: tone(0.55, 0.95),
    ink: tone(0.3, 0.6),
    glow: glow.join(' '),
  };
}

/** Palette for the plain blue screen shown when no blessing is received. */
export const PLAIN_PALETTE: Palette = paletteFrom('#6f9fd2');

/** Preset colours offered in the editor. */
export const PRESET_COLORS = ['#e8b931', '#e86a5a', '#f08ac0', '#9b7be0', '#4f8de0', '#3fb8b0', '#5cbf5a', '#9a9aa6'];
