/* 문제 탭 — 학습지 빈칸 문제를 시뮬과 따로 풀기 */
(function (g) {
  'use strict';
  const S = STAR, K = CORE, $ = K.$;
  const STAGE = { nebula: '탄생', protostar: '탄생', premain: '탄생', ms: '주계열', rgb: '거성', giant: '거성', agb: '거성', pn: '최후', rsg: '초거성', sn: '최후' };
  const load = () => { try { return JSON.parse(localStorage.getItem('johamin-stellar-wrong') || '[]'); } catch (e) { return []; } };
  const save = a => { try { localStorage.setItem('johamin-stellar-wrong', JSON.stringify(a)); } catch (e) { } };

  function start(uiEl, opts) {
    uiEl.innerHTML = `<main class="qp">
      <header class="qp-h"><button class="btn back" id="qback" aria-label="처음으로">←</button>
        <div><div class="hud-k">학습지 35~41쪽 · 별의 일생</div><h1>문제</h1></div></header>
      <div class="qp-modes" id="modes"></div>
      <section id="qbody"></section></main>`;
    $('#qback').onclick = () => opts.onHome();
    let list = [], i = 0, score = 0, wrongNow = [];
    function modes() {
      const wrong = load();
      $('#modes').innerHTML = `<button class="chip" data-m="order">순서대로 <small>${S.Q.length}</small></button><button class="chip" data-m="mix">섞어서</button><button class="chip" data-m="wrong" ${wrong.length ? '' : 'disabled'}>틀린 것만 <small>${wrong.length}</small></button>`;
      $('#modes').querySelectorAll('.chip').forEach(b => b.onclick = () => begin(b.dataset.m));
    }
    function begin(m) {
      const wrong = load();
      list = m === 'wrong' ? S.Q.filter(q => wrong.includes(q.id)) : S.Q.slice();
      if (m === 'mix') list.sort(() => Math.random() - 0.5);
      i = 0; score = 0; wrongNow = [];
      document.querySelectorAll('#modes .chip').forEach(b => b.classList.toggle('on', b.dataset.m === m));
      show();
    }
    function show() {
      if (i >= list.length) return end();
      const q = S.shuffledQuiz(list[i]);
      $('#qbody').innerHTML = `<div class="qp-prog"><div style="width:${i / list.length * 100}%"></div></div>
        <div class="quiz-card qp-card">
          <div class="quiz-eyebrow">${i + 1} / ${list.length} · ${STAGE[q.ph] || ''} · 학습지 ${q.p}쪽</div>
          <div class="quiz-q">${q.q}</div>
          <div class="quiz-opts">${q.shown.map((o, j) => `<button class="opt" data-j="${j}"><span class="opt-k">${'①②③④'[j]}</span>${o}</button>`).join('')}</div>
          <div class="quiz-why" hidden></div>
          <button class="btn primary quiz-next" hidden>${i + 1 < list.length ? '다음' : '결과 보기'}</button></div>`;
      const card = $('#qbody');
      card.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (card.dataset.done === String(i)) return; card.dataset.done = String(i);
        const j = +b.dataset.j, ok = j === q.answer;
        card.querySelectorAll('.opt').forEach((o, k) => { o.disabled = true; if (k === q.answer) o.classList.add('right'); else if (k === j) o.classList.add('wrong'); });
        const why = $('.quiz-why', card); why.hidden = false; why.innerHTML = `<b>${ok ? '정답!' : '아쉬워요.'}</b> ${q.why}`;
        const w = load().filter(id => id !== q.id); if (!ok) { w.push(q.id); wrongNow.push(q); } else score++; save(w);
        SFX(ok ? 'right' : 'wrong');
        const nx = $('.quiz-next', card); nx.hidden = false; nx.focus({ preventScroll: true }); nx.onclick = () => { i++; show(); };
        modes();
        document.querySelectorAll('#modes .chip').forEach(b => b.classList.remove('on'));
      });
    }
    function end() {
      $('#qbody').innerHTML = `<div class="quiz-card qp-card">
        <div class="quiz-eyebrow">결과</div><div class="quiz-q num" style="font-size:40px">${score} / ${list.length}</div>
        ${wrongNow.length ? `<p style="margin:0;color:var(--dim)">틀린 문제</p><ul class="qp-wrong">${wrongNow.map(q => `<li><b>${q.q}</b><br><span>${q.opts[0]} · 학습지 ${q.p}쪽</span></li>`).join('')}</ul>` : '<p style="margin:0">다 맞았어요!</p>'}
        <div class="row"><button class="btn" id="tosim">시뮬 보러 가기</button>${wrongNow.length ? '<button class="btn primary" id="rew">틀린 것만 다시</button>' : '<button class="btn primary" id="again">다시 풀기</button>'}</div></div>`;
      $('#tosim').onclick = () => opts.onSim();
      const rw = $('#rew'); if (rw) rw.onclick = () => begin('wrong');
      const ag = $('#again'); if (ag) ag.onclick = () => begin('order');
      modes();
    }
    modes(); begin('order');
    return { stop() { uiEl.innerHTML = ''; } };
  }
  g.QUIZPAGE = { start };
})(window);
