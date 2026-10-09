import { useEffect, useState } from 'react';

/** Check for a fresh worker without interrupting an answer being written. */
export default function AppStatus() {
 const [online,setOnline]=useState(navigator.onLine);
 const [message,setMessage]=useState('');const [checking,setChecking]=useState(false);
 const [updated,setUpdated]=useState(false);
 useEffect(()=>{
  const connection=()=>setOnline(navigator.onLine);
  let hadController=Boolean(navigator.serviceWorker?.controller);
  const fresh=()=>{if(!hadController){hadController=true;return;}setUpdated(true);setMessage('새 버전 준비됨 · 답안 쓰던 건 마치고 적용');};
  window.addEventListener('online',connection);window.addEventListener('offline',connection);
  navigator.serviceWorker?.addEventListener('controllerchange',fresh);
  return ()=>{window.removeEventListener('online',connection);window.removeEventListener('offline',connection);navigator.serviceWorker?.removeEventListener('controllerchange',fresh);};
 },[]);
 const check=async()=>{
  setChecking(true);setMessage('확인하고 있어요');
  try {
   const registration=await navigator.serviceWorker?.getRegistration();
   if(!registration){setMessage('배포된 사이트에서만 확인돼요');return;}
   await registration.update();
   const worker=registration.installing ?? registration.waiting;
   if(worker){
    setMessage('새 버전 저장 중');
    const observe=()=>{if(worker.state==='activated'){setUpdated(true);setMessage('새 버전 준비됨');worker.removeEventListener('statechange',observe);}else if(worker.state==='redundant'){setMessage('저장 실패 · 다시 확인');worker.removeEventListener('statechange',observe);}};
    worker.addEventListener('statechange',observe);observe();
   }else setMessage('최신 버전이에요');
  }catch{setMessage('연결 확인 후 다시 · 기록은 그대로');}
  finally{setChecking(false);}
 };
 const apply=()=>{
  const writing=[...document.querySelectorAll<HTMLTextAreaElement>('textarea')].some(el=>el.value.trim());
  if(writing && !window.confirm('작성 중인 답안은 새로고침하면 사라질 수 있어요. 새 버전을 적용할까요?'))return;
  window.location.reload();
 };
 // A small pill at the bottom so it never pushes the page into scrolling.
 return <footer className={`app-status glass ${online ? 'is-online' : 'is-offline'} ${updated ? 'is-updated' : ''}`} aria-label="앱 상태">
  <i aria-hidden="true" /><span>{online?'온라인':'오프라인'}</span>
  <button type="button" onClick={updated?apply:check} disabled={checking || (!online && !updated)}>{updated?'새 버전 적용':checking?'확인 중…':'업데이트 확인'}</button>
  {message && <span className="app-status-message" role="status">{message}</span>}
 </footer>;
}
