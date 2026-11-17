'use strict';
/* ═════════ 랭킹 (6.1.0~) ═════════
   로그인은 조하민 앱이 한다(학교 구글 계정). 같은 주소(/johamin/) 아래라서 앱이 저장한 로그인 정보
   localStorage 'johamin-auth-v1'을 그대로 읽는다. 게임은 공개 키(publishable key)와 그 계정 토큰만 쓴다.
   DB: public.castle_scores + castle_submit / castle_board / castle_me / castle_forget (db/castle-ranking-6.1.0.sql).
   순위표에는 학생이 정한 별명과 기록만 나온다(이메일 · 이름은 보내지도 저장하지도 않는다). */
const RK_URL = 'https://vlmwrkalgjaduagxavhb.supabase.co';
const RK_KEY = 'sb_publishable_meyBUXtfAzfIeU0Q5gF-aw_OL6TOy9V';
const RK_AUTH = 'johamin-auth-v1';           // 조하민 앱(lib/auth.ts)과 같은 키
const RK_RETURN = 'johamin-after-login-v1';  // 로그인 뒤 돌아올 주소(lib/auth.ts)
const RK_NICK = 'johamin-castle-nick';
const RK_SENT = 'johamin-castle-rank-sent';
const RK_METRICS = [['wave', '방어 밤'], ['dps', '초당 데미지'], ['sortie', '토벌 수확']];
const RK_OFF = !/\/johamin\//.test(location.pathname);   // 조하민 밖(시안 등)에서는 서버에 안 붙는다
const RK = {state:'checking', nick:'', metric:'wave', board:{}, loading:false, msg:'', confirmForget:false, editNick:false, sending:false};

function rkGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function rkSet(k, v){ try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch(e){} }
function rkSession(){ try { const s = JSON.parse(rkGet(RK_AUTH) || 'null'); return s && s.access_token && s.refresh_token ? s : null; } catch(e){ return null; } }
const rkEsc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[c]);

// 앱(auth-js)과 같은 이름의 잠금을 잡고 토큰을 새로 받는다. 받은 토큰은 같은 키에 다시 써서 앱도 이어 쓴다.
function rkWithLock(fn){
  try { if (navigator.locks && navigator.locks.request) return navigator.locks.request('lock:' + RK_AUTH, fn); } catch(e){}
  return fn();
}
async function rkToken(){
  let s = rkSession(); if (!s) return null;
  if ((s.expires_at || 0)*1000 - Date.now() > 60e3) return s.access_token;
  return rkWithLock(async () => {
    s = rkSession(); if (!s) return null;                       // 잠금을 기다리는 동안 앱이 이미 새로 받았을 수 있다
    if ((s.expires_at || 0)*1000 - Date.now() > 60e3) return s.access_token;
    const r = await fetch(`${RK_URL}/auth/v1/token?grant_type=refresh_token`, {method:'POST', headers:{apikey:RK_KEY, 'Content-Type':'application/json'}, body:JSON.stringify({refresh_token:s.refresh_token})});
    if (!r.ok){ if (r.status === 400 || r.status === 401) RK.state = 'out'; return null; }
    const n = await r.json();
    if (!n.expires_at && n.expires_in) n.expires_at = Math.floor(Date.now()/1000) + n.expires_in;
    rkSet(RK_AUTH, JSON.stringify(Object.assign({}, s, n)));
    return n.access_token;
  });
}
async function rkRpc(name, body){
  const t = await rkToken(); if (!t) throw new Error('signed-out');
  const r = await fetch(`${RK_URL}/rest/v1/rpc/${name}`, {method:'POST', headers:{apikey:RK_KEY, Authorization:`Bearer ${t}`, 'Content-Type':'application/json'}, body:JSON.stringify(body || {})});
  if (!r.ok) throw new Error(`${name} ${r.status}`);
  const txt = await r.text(); return txt ? JSON.parse(txt) : null;
}

function rkRefresh(){ if (typeof renderAll === 'function' && G) renderAll(); }
async function rankInit(){
  if (RK_OFF){ RK.state = 'off'; rkRefresh(); return; }
  RK.nick = rkGet(RK_NICK) || '';
  if (!rkSession()){ RK.state = 'out'; rkRefresh(); return; }
  try {
    const ok = await rkRpc('is_member');
    if (ok !== true){ RK.state = 'denied'; rkRefresh(); return; }
    RK.state = 'ok';
    const me = await rkRpc('castle_me');
    if (me){
      // 다른 기기에서 올린 기록이 더 높으면 이 기기 기록도 올려 둔다(내려가지는 않음).
      if (!RK.nick && me.nickname){ RK.nick = me.nickname; rkSet(RK_NICK, RK.nick); }
      const b = G.best, up = {wave:Math.max(b.wave, me.wave|0), dps:Math.max(b.dps, +me.dps || 0), sortie:Math.max(b.sortie, me.sortie|0)};
      if (up.wave !== b.wave || up.dps !== b.dps || up.sortie !== b.sortie){ Object.assign(G.best, up); saveBest(); }
    }
    await rkSend(); rkLoadBoard();
  } catch(e){ if (RK.state !== 'out') RK.state = !rkSession() ? 'out' : navigator.onLine === false ? 'offline' : 'error'; }
  rkRefresh();
}
const rkBestKey = () => JSON.stringify([RK.nick, G.best.wave, Math.round(G.best.dps*10)/10, G.best.sortie]);
// 기록이 바뀌었을 때만 올린다(별명이 있고 로그인했을 때). DB는 더 좋은 값만 남긴다.
async function rkSend(force){
  if (RK.state !== 'ok' || !RK.nick || RK.sending) return;
  const key = rkBestKey(); if (!force && rkGet(RK_SENT) === key) return;
  if (!G.best.wave && !G.best.dps && !G.best.sortie && !force) return;
  RK.sending = true;
  try {
    const r = await rkRpc('castle_submit', {p_nickname:RK.nick, p_wave:G.best.wave|0, p_dps:Math.round(G.best.dps*10)/10, p_sortie:G.best.sortie|0});
    if (r && r.ok){ rkSet(RK_SENT, key); RK.board = {}; }
  } catch(e){}
  RK.sending = false;
  if (!RK.board[RK.metric] && document.getElementById('rankBox')) rkLoadBoard();
}
async function rkLoadBoard(){
  if (RK.state !== 'ok' || RK.loading) return;
  const m = RK.metric; RK.loading = true; rkPaint();
  try { RK.board[m] = {rows:await rkRpc('castle_board', {p_metric:m, p_limit:20}) || [], at:Date.now()}; RK.msg = ''; }
  catch(e){ RK.msg = '순위를 불러오지 못했어요 · 인터넷을 확인해 주세요'; }
  RK.loading = false; rkPaint();
}
// 순위표 칸만 다시 그린다(패널 전체를 다시 그리면 별명 입력이 끊긴다).
function rkPaint(){ const el = document.getElementById('rankBox'); if (el) el.innerHTML = rankInner(); }

const rkFmt = (m, v) => m === 'dps' ? (+v).toFixed(1) : m === 'sortie' ? `${Math.round(v)}G` : `밤 ${Math.round(v)}`;
function rankInner(){
  if (RK.state === 'off') return '<p class="muted">랭킹은 조하민(학교 계정 로그인)에서 열려요. 이 시안에서는 기록만 보여요.</p>';
  if (RK.state === 'checking') return '<p class="muted">로그인 확인 중…</p>';
  if (RK.state === 'out') return `<p class="muted">학교 계정으로 로그인하면 기록을 올리고 친구들과 순위를 겨뤄요. 게임 진행은 그대로 이어져요.</p>
    <button class="btn primary" type="button" data-act="rkLogin">학교 계정으로 로그인</button>`;
  if (RK.state === 'denied') return '<p class="muted">이 계정은 아직 조하민레츠고 명단에 없어요. 랭킹은 열린 반 계정만 쓸 수 있어요.</p>';
  if (RK.state === 'offline' || RK.state === 'error') return `<p class="muted">${RK.state === 'offline' ? '인터넷이 끊겨 있어요.' : '랭킹 서버에 연결하지 못했어요.'} 기록은 이 기기에 남아 있어요.</p><button class="btn" type="button" data-act="rkRetry">다시 연결</button>`;
  if (!RK.nick || RK.editNick) return `<p class="muted">순위표에 나올 별명을 정해요 (1–10자). 이름 · 학번 대신 별명만 보여요.</p>
    <div class="rk-nick"><input id="rkNick" type="text" maxlength="10" autocomplete="off" placeholder="별명" value="${rkEsc(RK.nick)}"><button class="btn primary" type="button" data-act="rkNickSave">저장</button></div>
    ${RK.nick ? '<button class="btn" type="button" data-act="rkNickCancel">취소</button>' : ''}${RK.msg ? `<p class="muted" style="color:var(--bad)">${rkEsc(RK.msg)}</p>` : ''}`;
  const m = RK.metric, b = RK.board[m];
  const tabs = `<div class="seg">${RK_METRICS.map(([k, t]) => `<button type="button" data-rk="${k}" aria-pressed="${k === m}">${t}</button>`).join('')}</div>`;
  let list;
  if (!b) list = `<p class="muted">${RK.loading ? '불러오는 중…' : RK.msg || ''}</p>`;
  else if (!b.rows.length) list = '<p class="muted">아직 아무도 기록이 없어요. 첫 번째가 돼 봐요!</p>';
  else list = `<ol class="rk-list">${b.rows.map(r => `<li class="${r.mine ? 'me' : ''}"><i>${r.rank}</i><span>${rkEsc(r.nickname)}${r.mine ? ' (나)' : ''}</span><b>${rkFmt(m, r.score)}</b></li>`).join('')}</ol>`;
  return `${tabs}${list}
    <div class="rk-foot"><span class="muted">별명 <b style="color:var(--ink)">${rkEsc(RK.nick)}</b></span>
      <button class="rm" type="button" data-act="rkNickEdit">별명 바꾸기</button><button class="rm" type="button" data-act="rkReload">새로고침</button>
      <button class="rm" type="button" data-act="${RK.confirmForget ? 'rkForgetYes' : 'rkForgetAsk'}" style="color:var(--bad)">${RK.confirmForget ? '정말 지울까요? 한 번 더' : '내 랭킹 기록 지우기'}</button></div>
    <p class="muted">더 좋은 기록이 나오면 저절로 올라가요. 서버에는 별명과 기록 3개만 저장돼요.</p>`;
}
function rankHtml(){ return `<div class="sec"><h2>랭킹</h2><div id="rankBox">${rankInner()}</div></div>`; }

async function rkSaveNick(){
  const el = document.getElementById('rkNick'); const v = (el ? el.value : '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (v.length < 1 || v.length > 10){ RK.msg = '별명은 1–10자로 써 주세요'; rkPaint(); return; }
  RK.nick = v; RK.editNick = false; RK.msg = ''; rkSet(RK_NICK, v); rkPaint();
  await rkSend(true);
}
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.rk){ RK.metric = b.dataset.rk; RK.confirmForget = false; rkPaint(); if (!RK.board[RK.metric]) rkLoadBoard(); return; }
  const a = b.dataset.act; if (!a || !a.startsWith('rk')) return;
  if (a !== 'rkForgetYes' && a !== 'rkForgetAsk') RK.confirmForget = false;
  switch (a){
    case 'rkLogin': {
      // 조하민 첫 화면에서 로그인 → 앱이 이 주소로 돌려보낸다(lib/auth.ts RETURN_URLS).
      try { sessionStorage.setItem(RK_RETURN, new URL('./', location.href).pathname); } catch(e){}
      try { saveBest(); saveGame(); } catch(e){}
      location.href = '../'; break;
    }
    case 'rkGo': { const el = document.getElementById('rankBox'); if (el) (el.closest('.sec') || el).scrollIntoView({behavior:'smooth', block:'start'}); if (RK.state === 'ok' && !RK.board[RK.metric]) rkLoadBoard(); break; }
    case 'rkRetry': RK.state = 'checking'; rkPaint(); rankInit(); break;
    case 'rkNickSave': rkSaveNick(); break;
    case 'rkNickEdit': RK.editNick = true; rkPaint(); { const el = document.getElementById('rkNick'); if (el) el.focus(); } break;
    case 'rkNickCancel': RK.editNick = false; RK.msg = ''; rkPaint(); break;
    case 'rkReload': RK.board = {}; rkLoadBoard(); break;
    case 'rkForgetAsk': RK.confirmForget = true; rkPaint(); break;
    case 'rkForgetYes':
      RK.confirmForget = false;
      rkRpc('castle_forget').then(() => { rkSet(RK_SENT, null); rkSet(RK_NICK, null); RK.nick = ''; RK.board = {}; RK.msg = ''; rkPaint(); hint('랭킹에서 내 기록과 별명을 지웠어요 · 이 기기 기록은 그대로예요'); }, () => { RK.msg = '지우지 못했어요 · 인터넷을 확인해 주세요'; rkPaint(); });
      break;
  }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Enter' && ev.target && ev.target.id === 'rkNick'){ ev.preventDefault(); rkSaveNick(); } });
// 기록이 바뀌면(낮 · 토벌 끝 · 대장간 시험) 잠시 뒤 올린다. 밤 도중에는 안 보낸다.
setInterval(() => { if (G && RK.state === 'ok' && G.mode !== 'wave' && G.mode !== 'sortie') rkSend(); }, 15e3);
window.addEventListener('load', () => { rankInit(); });
