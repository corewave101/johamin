import { useEffect, useState } from 'react';

/** Check for a fresh worker without interrupting an answer being written. */
export default function AppStatus() {
 const [online,setOnline]=useState(navigator.onLine);
 const [message,setMessage]=useState('');const [checking,setChecking]=useState(false);
 const [updated,setUpdated]=useState(false);
 useEffect(()=>{
  const connection=()=>setOnline(navigator.onLine);
  let hadController=Boolean(navigator.serviceWorker?.controller);
  const fresh=()=>{if(!hadController){hadController=true;return;}setUpdated(true);setMessage('새 버전이 준비됐어요. 작성 중인 답안을 마친 뒤 적용하세요.');};
  window.addEventListener('online',connection);window.addEventListener('offline',connection);
  navigator.serviceWorker?.addEventListener('controllerchange',fresh);
  return ()=>{window.removeEventListener('online',connection);window.removeEventListener('offline',connection);navigator.serviceWorker?.removeEventListener('controllerchange',fresh);};
 },[]);
 const check=async()=>{
  setChecking(true);setMessage('새 버전을 확인하고 있어요.');
  try {
   const registration=await navigator.serviceWorker?.getRegistration();
   if(!registration){setMessage('오프라인 저장은 배포된 사이트에서 첫 접속 후 준비돼요.');return;}
   await registration.update();
   const worker=registration.installing ?? registration.waiting;
   if(worker){
    setMessage('새 버전 파일을 저장하고 있어요.');
    const observe=()=>{if(worker.state==='activated'){setUpdated(true);setMessage('새 버전이 준비됐어요.');worker.removeEventListener('statechange',observe);}else if(worker.state==='redundant'){setMessage('새 버전을 저장하지 못했어요. 다시 확인해 주세요.');worker.removeEventListener('statechange',observe);}};
    worker.addEventListener('statechange',observe);observe();
   }else setMessage('현재 버전으로 학습 중이에요.');
  }catch{setMessage('연결을 확인한 뒤 다시 시도해 주세요. 기존 학습 기록은 유지돼요.');}
  finally{setChecking(false);}
 };
 const apply=()=>{
  const writing=[...document.querySelectorAll<HTMLTextAreaElement>('textarea')].some(el=>el.value.trim());
  if(writing && !window.confirm('작성 중인 답안은 새로고침하면 사라질 수 있어요. 새 버전을 적용할까요?'))return;
  window.location.reload();
 };
 return <footer className="biology-actions glass" aria-label="앱 상태" style={{position:'relative',margin:'12px auto',padding:'12px',maxWidth:700}}>
  <span>{online?'온라인':'오프라인 · 저장된 자료로 학습'}</span>
  <button type="button" className="glass-button" onClick={updated?apply:check} disabled={checking || (!online && !updated)}>{updated?'새 버전 적용':checking?'확인 중…':'업데이트 확인'}</button>
  {message && <span role="status">{message}</span>}
 </footer>;
}
