import { useEffect, useState } from 'react';
import MenuCard from './MenuCard';
import { horizontalCoordinates, polarError, readObservations, observationsCsv, OBSERVATION_KEY, type ObservationRecord } from '../../lib/observation';
type Mode = 'menu' | 'finder' | 'polar' | 'sky';
export default function ObservationLab({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('menu');
  const [x, setX] = useState(5), [y, setY] = useState(-4);
  const [latitude, setLatitude] = useState(37.5), [axis, setAxis] = useState(32), [azError, setAzError] = useState(6);
  const [declination, setDeclination] = useState(0), [hourAngle, setHourAngle] = useState(-60);
  const [records, setRecords] = useState<ObservationRecord[]>(readObservations);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // Capture Escape before the enclosing subject picker handles it.
    const key = (e: KeyboardEvent) => { if (e.key !== 'Escape') return; e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) { if (mode === 'menu') onBack(); else setMode('menu'); } };
    window.addEventListener('keydown', key, true); return () => window.removeEventListener('keydown', key, true);
  }, [mode, onBack]);
  const save = (activity: string, result: string) => {
    const next = [...records, { time: new Date().toISOString(), activity, result }];
    try { localStorage.setItem(OBSERVATION_KEY, JSON.stringify(next)); setRecords(next); setMessage('연습 기록을 이 기기에 저장했어요.'); } catch { setMessage('기기 저장 공간을 확인해 주세요. 기록을 저장하지 못했어요.'); }
  };
  const download = () => { const url = URL.createObjectURL(new Blob([observationsCsv(records)], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'observation-practice.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  if (mode === 'menu') return <MenuCard topic="황윤환T · 관측 실습" question="어떤 연습을 할까요?" up={{ label: '파인더 정렬', onChoose: () => { setMessage(''); setMode('finder'); } }} left={{ label: '극축 정렬 원리', onChoose: () => { setMessage(''); setMode('polar'); } }} right={{ label: '천구 좌표·계획', onChoose: () => { setMessage(''); setMode('sky'); } }} onBack={onBack} backLabel="학습 메뉴">
    <div className="observation-note glass"><p>모형을 조작하고 원리를 확인해요. 연습 기록은 실제 수행평가의 관측 기록과 구분해 주세요.</p><a href="https://celestial-sidekick-public-beta-v1.netlify.app/student" target="_blank" rel="noreferrer">참고 관측 훈련 사이트 열기 ↗</a><p>저장한 연습 {records.length}회</p>{records.length > 0 && <button className="glass-button" onClick={download}>연습 기록 CSV 내려받기</button>}</div>
  </MenuCard>;
  const error = Math.hypot(x, y), polar = polarError(latitude, axis, azError);
  const sky = horizontalCoordinates(latitude, declination, hourAngle);
  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number, step = .5) => <label className="observation-control">{label} <output>{value}°</output><input type="range" aria-label={label} value={value} min={min} max={max} step={step} onChange={e => set(Number(e.target.value))} /></label>;
  return <main className="swipe-app biology-app"><div className="biology-study">
    <header className="biology-header glass"><button className="glass-button" onClick={() => setMode('menu')}>← 실습 선택</button><h1>황윤환T · {mode === 'finder' ? '파인더 정렬' : mode === 'polar' ? '극축 정렬 원리' : '천구 좌표·관측 계획'}</h1></header>
    <section className="biology-menu glass observation-panel">
      {mode === 'finder' ? <>
        <h2>주망원경과 파인더의 중심을 맞춰요</h2><p>주망원경 중심에 고정한 별(●)과 파인더 십자선의 중심을 일치시켜요. 실제 장비에서는 먼 고정 표적을 주망원경 중앙에 둔 후 파인더 조절 나사를 조작해요.</p>
        <svg viewBox="0 0 240 180" role="img" aria-label={`파인더 중심 오차 ${error.toFixed(1)} 모형 단위`}><circle cx="120" cy="90" r="75" fill="none"/><circle cx="120" cy="90" r="3"/><path d={`M${120+x*5-15},${90-y*5}h30 M${120+x*5},${90-y*5-15}v30`} fill="none"/></svg>
        <label className="observation-control">좌우 위치 {x}<input type="range" aria-label="파인더 좌우" min="-10" max="10" step=".5" value={x} onChange={e => setX(Number(e.target.value))}/></label>
        <label className="observation-control">상하 위치 {y}<input type="range" aria-label="파인더 상하" min="-10" max="10" step=".5" value={y} onChange={e => setY(Number(e.target.value))}/></label>
        <p role="status">중심 오차 {error.toFixed(1)} 모형 단위 · {error <= .5 ? '정렬 성공이에요!' : '십자선을 별 쪽으로 옮겨 주세요.'}</p>
        <button className="glass-button" onClick={() => save('파인더 정렬', `모형 오차 ${error.toFixed(1)} · ${error <= .5 ? '성공' : '연습 중'}`)}>현재 결과 저장</button> <button className="glass-button" onClick={() => { setX(5); setY(-4); }}>다시 연습</button><p className="biology-note">화면 간격은 모형 단위이며 실제 장비의 각도·나사 회전량을 뜻하지 않아요.</p>
      </> : mode === 'polar' ? <>
        <h2>적경축을 지구 자전축과 평행하게</h2><p>북반구에서는 적경축을 북천구극으로 향하게 해요. 북천구극의 고도는 관측지의 위도와 같아요. 북극성과 북천구극은 같은 위치가 아니에요.</p>
        {slider('관측지 위도', latitude, setLatitude, 10, 70)}{slider('적경축 고도', axis, setAxis, 0, 90)}{slider('북쪽에서 벗어난 방위', azError, setAzError, -10, 10)}
        <svg viewBox="0 0 240 180" role="img" aria-label="위도에 해당하는 이상적인 축과 조절 중인 적경축"><path d="M20 150H220" fill="none"/><path d={`M30 150L${30+160*Math.cos(latitude*Math.PI/180)} ${150-160*Math.sin(latitude*Math.PI/180)}`} strokeDasharray="4 4" fill="none"/><path d={`M30 150L${30+160*Math.cos(axis*Math.PI/180)} ${150-160*Math.sin(axis*Math.PI/180)}`} fill="none"/><text x="20" y="175">점선: 북천구극 / 실선: 적경축 고도</text></svg>
        <p role="status">고도 차 {(axis-latitude).toFixed(1)}° · 근사 축 오차 {polar.toFixed(1)}° · {polar <= .5 ? '모형 정렬 성공이에요!' : '고도와 방위 모두 조절해 주세요.'}</p>
        <button className="glass-button" onClick={() => save('극축 정렬 원리', `위도 ${latitude}° / 축 고도 ${axis}° / 방위차 ${azError}° / 근사 오차 ${polar.toFixed(1)}°`)}>현재 결과 저장</button><p className="biology-note">작은 오차의 원리를 보는 근사 모형이에요. EM-200의 실제 극축망원경 눈금·날짜 설정·표류 정렬 절차를 대신하지 않아요. 실제 조작 순서는 개념 파트와 수업 자료에서 확인해 주세요.</p>
      </> : <>
        <h2>관측 위치와 시각이 달라지면?</h2><p>시간각 H=(지방 항성시−적경)×15°예요. 여기서는 시간각을 직접 바꿔 천체의 일주운동을 비교해요. H=0°는 자오선 통과, 음수는 통과 전, 양수는 통과 후예요.</p>
        {slider('관측지 위도', latitude, setLatitude, 10, 70)}{slider('천체 적위', declination, setDeclination, -90, 90)}{slider('시간각', hourAngle, setHourAngle, -180, 180, 1)}
        <svg viewBox="0 0 240 180" role="img" aria-label={`천체 고도 ${sky.altitude.toFixed(1)}도`}><path d="M20 100H220 M120 20V170" fill="none" strokeDasharray="3 3"/><circle cx="120" cy="100" r="65" fill="none"/><circle cx={sky.azimuth === null ? 120 : 120+65*Math.sin(sky.azimuth*Math.PI/180)*Math.cos(sky.altitude*Math.PI/180)} cy={sky.azimuth === null ? 100 : 100-65*Math.cos(sky.azimuth*Math.PI/180)*Math.cos(sky.altitude*Math.PI/180)} r="5"/><text x="113" y="22">북</text><text x="203" y="104">동</text><text x="113" y="179">남</text><text x="5" y="104">서</text></svg>
        <p role="status">고도 {sky.altitude.toFixed(1)}° · 방위각 {sky.azimuth === null ? '천정·천저에서 정의되지 않음' : `${sky.azimuth.toFixed(1)}°`} · {sky.altitude > 0 ? '기하학적으로 지평선 위' : sky.altitude < 0 ? '지평선 아래' : '지평선 위 경계'}</p>
        <p>위 원은 천구를 위에서 본 모형이에요. 방위각은 북쪽 0°에서 동쪽 90° 방향으로 증가해요. 굴절·지형·날씨·광해는 계산에 포함되지 않아요.</p>
        <p>sin h=sin φ sin δ+cos φ cos δ cos H. 관측 계획에서는 대상의 적경·적위와 관측 시각을 확인한 뒤 충분한 고도인지 비교해요.</p>
        <button className="glass-button" onClick={() => save('천구 좌표·계획', `위도 ${latitude}° / 적위 ${declination}° / 시간각 ${hourAngle}° / 고도 ${sky.altitude.toFixed(1)}° / 방위 ${sky.azimuth === null ? '미정' : sky.azimuth.toFixed(1)+'°'}`)}>현재 계획 저장</button>
      </>}
      <p role="status">{message}</p>
    </section>
    <section className="biology-menu glass"><h2>최근 연습 기록</h2>{records.length ? <><ol>{records.slice(-5).reverse().map((r,i) => <li key={r.time+i}>{new Date(r.time).toLocaleString('ko-KR')} · {r.activity}<br/>{r.result}</li>)}</ol><button className="glass-button" onClick={download}>전체 기록 CSV 내려받기</button></> : <p>결과를 저장하면 이 기기에서 다시 볼 수 있어요.</p>}</section>
  </div></main>;
}
