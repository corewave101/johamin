/** Teaching model: 25°C, ideal activities, additive volumes, strong monoprotic acid/base. */
export function strongTitration(acidM: number, acidMl: number, baseM: number, baseMl: number) {
  if (![acidM, acidMl, baseM, baseMl].every(Number.isFinite) || acidM <= 0 || acidMl <= 0 || baseM <= 0 || baseMl < 0) throw new RangeError('invalid titration input');
  const volumeL = (acidMl + baseMl) / 1000;
  const excess = (acidM * acidMl - baseM * baseMl) / 1000 / volumeL;
  // h − Kw/h = excess; stable expression on the base side avoids cancellation.
  const root = Math.sqrt(excess * excess + 4e-14);
  const h = excess >= 0 ? (excess + root) / 2 : 2e-14 / (root - excess);
  return { ph: -Math.log10(h), endpointMl: acidM * acidMl / baseM, excessM: excess };
}
export function bufferAddition(haMmol: number, aMmol: number, addedMmol: number, kind: 'acid' | 'base') {
  if (![haMmol,aMmol,addedMmol].every(Number.isFinite) || Math.min(haMmol,aMmol,addedMmol) < 0) throw new RangeError('invalid buffer input');
  const used = Math.min(addedMmol, kind === 'acid' ? aMmol : haMmol);
  const ha = haMmol + (kind === 'acid' ? used : -used), a = aMmol + (kind === 'base' ? used : -used);
  return { ha, a, excess: addedMmol-used, buffering: ha > 0 && a > 0 };
}
export function approximationPercent(initialM: number, ionizedM: number) {
  if (![initialM,ionizedM].every(Number.isFinite) || initialM <= 0 || ionizedM < 0 || ionizedM > initialM) return null;
  const percent=100*ionizedM/initialM;
  return { percent, acceptable: percent <= 5 };
}
