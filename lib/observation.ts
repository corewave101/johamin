const rad = Math.PI / 180;
export function horizontalCoordinates(latitude: number, declination: number, hourAngle: number) {
  const p = latitude * rad, d = declination * rad, h = hourAngle * rad;
  const east = -Math.cos(d) * Math.sin(h);
  const north = Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.cos(h) * Math.sin(p);
  const up = Math.sin(d) * Math.sin(p) + Math.cos(d) * Math.cos(h) * Math.cos(p);
  return { altitude: Math.asin(Math.max(-1, Math.min(1, up))) / rad,
    azimuth: Math.hypot(east, north) < 1e-10 ? null : (Math.atan2(east, north) / rad + 360) % 360 };
}
// Small-angle educational approximation, not a calibrated mount measurement.
export const polarError = (latitude: number, altitude: number, azimuthError: number) => Math.hypot(altitude - latitude, azimuthError * Math.cos(latitude * rad));
export interface ObservationRecord { time: string; activity: string; result: string }
export const OBSERVATION_KEY = 'johamin-observation-v1';
export function readObservations(): ObservationRecord[] {
  try { const v: unknown = JSON.parse(localStorage.getItem(OBSERVATION_KEY) ?? '[]'); return Array.isArray(v) ? v.filter(r => r && typeof r.time === 'string' && typeof r.activity === 'string' && typeof r.result === 'string') : []; } catch { return []; }
}
export function observationsCsv(records: ObservationRecord[]) {
  const cell = (v: string) => '"' + v.replace(/"/g, '""') + '"';
  return '\uFEFF' + [['시간', '연습', '결과'], ...records.map(r => [r.time, r.activity, r.result])].map(row => row.map(cell).join(',')).join('\r\n');
}
