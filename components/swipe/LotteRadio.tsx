// 롯데 페이지 플레이리스트: 오른쪽 위 레코드 버튼. 이 기기에 넣어 둔 곡을 끝없이 이어서 튼다.
// 곡 파일은 IndexedDB(lib/lotte-music.ts)에만 있고 서버로 가지 않는다. 소리 끄기(스피커 버튼)를 따르고,
// 브라우저가 첫 누름 전에는 소리를 막으니 시작 화면을 누르는 순간 이어서 튼다.
import { useCallback, useEffect, useRef, useState } from 'react';
import { addTracks, deleteTrack, importPlaylist, listTracks, loadRadio, nextIndex, playlistToJson, saveRadio, type LotteTrack, type RadioState } from '../../lib/lotte-music';
import { isMuted, onMutedChange, setMuted } from '../../lib/sound';

const LOGO = `${import.meta.env.BASE_URL}lotte/logo.svg`;
const VOLUME = 0.55;

export default function LotteRadio() {
  const [tracks, setTracks] = useState<LotteTrack[] | null>(null);
  const [radio, setRadio] = useState<RadioState>(loadRadio);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const url = useRef<string | null>(null);
  const radioRef = useRef(radio);
  radioRef.current = radio;
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const file = useRef<HTMLInputElement>(null);
  const playlistFile = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<null | 'save' | 'open'>(null);
  const title = useRef<HTMLHeadingElement>(null);

  const update = useCallback((patch: Partial<RadioState>) => {
    setRadio(previous => { const next = { ...previous, ...patch }; saveRadio(next); return next; });
  }, []);

  const refresh = useCallback(async () => {
    try { setTracks(await listTracks()); } catch { setTracks([]); setMessage('이 브라우저에서는 곡을 저장할 수 없어요.'); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const list = tracks ?? [];
  const index = list.length ? Math.min(Math.max(0, radio.index), list.length - 1) : 0;
  const current = list[index];

  /** Tries to play; browsers refuse until the first press, which is fine (the press listener below retries). */
  const tryPlay = useCallback(() => {
    const el = audio.current;
    if (!el || !el.src || radioRef.current.paused || isMuted()) return;
    void el.play().catch(() => { /* waits for a press */ });
  }, []);

  // One <audio> for the whole page.
  useEffect(() => {
    const el = new Audio();
    el.preload = 'auto';
    el.volume = VOLUME;
    audio.current = el;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      const length = tracksRef.current?.length ?? 0;
      setRadio(previous => { const next = { ...previous, index: nextIndex(previous.index, length, previous.shuffle) }; saveRadio(next); return next; });
    };
    const onError = () => {
      if (!el.src) return;
      setMessage('이 곡은 재생할 수 없어서 다음 곡으로 넘어가요.');
      onEnded();
    };
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);
    return () => {
      el.pause();
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
      if (url.current) URL.revokeObjectURL(url.current);
      audio.current = null;
    };
  }, []);

  // Load the current song whenever it changes (also when it is the only song and loops).
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (!current) { el.pause(); el.removeAttribute('src'); el.load(); if (url.current) { URL.revokeObjectURL(url.current); url.current = null; } return; }
    const next = URL.createObjectURL(current.blob);
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = next;
    el.src = next;
    tryPlay();
  }, [current, tryPlay]);
  // A single song: "ended" keeps the same index, so start it again by hand.
  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const again = () => { if ((tracksRef.current?.length ?? 0) === 1) { el.currentTime = 0; tryPlay(); } };
    el.addEventListener('ended', again);
    return () => el.removeEventListener('ended', again);
  }, [tryPlay]);

  // Browsers only allow sound after a press: the first press anywhere (the intro button too) starts the music.
  useEffect(() => {
    const kick = () => tryPlay();
    window.addEventListener('pointerdown', kick, true);
    window.addEventListener('keydown', kick, true);
    return () => { window.removeEventListener('pointerdown', kick, true); window.removeEventListener('keydown', kick, true); };
  }, [tryPlay]);

  // The speaker button mutes the music too.
  useEffect(() => onMutedChange(muted => { if (muted) audio.current?.pause(); else tryPlay(); }), [tryPlay]);

  // Lock screen / headphone buttons.
  useEffect(() => {
    const session = navigator.mediaSession;
    if (!session || !current) return;
    try {
      session.metadata = new MediaMetadata({ title: current.name, artist: '원중이레츠고', album: '롯데 플레이리스트', artwork: [{ src: new URL(LOGO, location.href).href, sizes: '512x512', type: 'image/svg+xml' }] });
      session.setActionHandler('play', () => { update({ paused: false }); setMuted(false); void audio.current?.play().catch(() => {}); });
      session.setActionHandler('pause', () => { update({ paused: true }); audio.current?.pause(); });
      session.setActionHandler('nexttrack', () => update({ index: nextIndex(radioRef.current.index, tracksRef.current?.length ?? 0, radioRef.current.shuffle), paused: false }));
      session.setActionHandler('previoustrack', () => { const n = tracksRef.current?.length ?? 0; if (n) update({ index: (radioRef.current.index - 1 + n) % n, paused: false }); });
    } catch { /* not supported */ }
  }, [current, update]);

  const toggle = () => {
    const el = audio.current;
    if (!el || !current) { file.current?.click(); return; }
    if (playing) { update({ paused: true }); el.pause(); return; }
    update({ paused: false });
    radioRef.current = { ...radioRef.current, paused: false };
    if (isMuted()) setMuted(false);
    void el.play().catch(() => setMessage('재생하지 못했어요. 한 번 더 눌러 주세요.'));
  };
  const skip = (step: 1 | -1) => {
    const n = list.length;
    if (!n) return;
    radioRef.current = { ...radioRef.current, paused: false };
    update({ index: step === 1 ? nextIndex(index, n, radio.shuffle) : (index - 1 + n) % n, paused: false });
    if (n === 1 && audio.current) { audio.current.currentTime = 0; tryPlay(); }
  };
  const pick = (i: number) => {
    radioRef.current = { ...radioRef.current, paused: false };
    if (i === index && audio.current) { audio.current.currentTime = 0; tryPlay(); }
    update({ index: i, paused: false });
  };
  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const { added, skipped } = await addTracks([...files], list);
      await refresh();
      setMessage(added ? `${added}곡을 넣었어요.${skipped.length ? ` ${skipped.length}개는 음악 파일이 아니거나 이미 있어서 뺐어요.` : ''}` : '넣을 수 있는 음악 파일이 없었어요.');
      if (added && !list.length) { radioRef.current = { ...radioRef.current, paused: false }; update({ index: 0, paused: false }); }
    } catch {
      setMessage('저장하지 못했어요. 기기 저장 공간을 확인해 주세요.');
    }
    if (file.current) file.current.value = '';
  };
  // 플리 파일: 가호 파일처럼 곡을 통째로 .json 하나에 묶어 저장하고, 다른 기기에서 불러온다.
  const savePlaylist = async () => {
    if (!list.length || busy) return;
    setBusy('save');
    setMessage('플리를 파일로 묶는 중…');
    try {
      const url = URL.createObjectURL(new Blob([await playlistToJson(list)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      // 한글 파일 이름은 일부 크롬에서 "download"로 바뀌어서 영어로.
      link.download = `johamin-lotte-playlist-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setMessage(`${list.length}곡을 플리 파일로 저장했어요. 다른 기기에서 "플리 파일 불러오기"로 열 수 있어요.`);
    } catch {
      setMessage('플리 파일을 만들지 못했어요. 곡이 많으면 몇 곡씩 나눠서 해 보세요.');
    }
    setBusy(null);
  };
  const openPlaylist = async (picked: File | undefined) => {
    if (!picked) return;
    setBusy('open');
    setMessage('플리 파일을 여는 중…');
    try {
      const { added, skipped } = await importPlaylist(picked, list);
      await refresh();
      setMessage(added ? `플리에서 ${added}곡을 넣었어요.${skipped.length ? ` ${skipped.length}곡은 이미 있어서 뺐어요.` : ''}` : '플리의 곡이 이미 다 있어요.');
      if (added && !list.length) { radioRef.current = { ...radioRef.current, paused: false }; update({ index: 0, paused: false }); }
    } catch (error) {
      setMessage(error instanceof Error && error.message ? error.message : '플리 파일을 열지 못했어요.');
    }
    setBusy(null);
    if (playlistFile.current) playlistFile.current.value = '';
  };
  const remove = async (track: LotteTrack, i: number) => {
    await deleteTrack(track.id).catch(() => undefined);
    setConfirm(null);
    if (i < index) update({ index: index - 1 });
    await refresh();
  };

  // Keys inside the panel must not move the cards behind it.
  useEffect(() => {
    if (!open) return;
    title.current?.focus();
    const guard = (event: KeyboardEvent) => {
      if ((event.target as Element | null)?.closest?.('.intro')) return;
      event.stopPropagation();
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', guard, true);
    return () => window.removeEventListener('keydown', guard, true);
  }, [open]);

  return <>
    <div className={`lotte-radio${playing ? ' is-playing' : ''}`}>
      <button type="button" className="lotte-radio-disc" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={current ? `롯데 플레이리스트 · ${playing ? '재생 중' : '멈춤'}: ${current.name}` : '롯데 플레이리스트 · 곡 넣기'}>
        <img src={LOGO} alt="" draggable={false} />
        <span className="lotte-radio-eq" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
      {current && <span className="lotte-radio-now" aria-hidden="true"><b>{playing ? 'NOW PLAYING' : 'PAUSED'}</b>{current.name}</span>}
    </div>
    {open && <div className="lotte-radio-sheet" role="dialog" aria-modal="true" aria-labelledby="lotte-radio-title" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="lotte-radio-panel">
        <header>
          <p className="lotte-kicker">LOTTE GIANTS · PLAYLIST</p>
          <h2 id="lotte-radio-title" ref={title} tabIndex={-1}>롯데 플레이리스트</h2>
          <button type="button" className="lotte-radio-close" onClick={() => setOpen(false)} aria-label="닫기">✕</button>
        </header>
        <div className="lotte-radio-player">
          <div className={`lotte-radio-record${playing ? ' is-spinning' : ''}`} aria-hidden="true"><img src={LOGO} alt="" /></div>
          <div className="lotte-radio-info">
            <small>{current ? (playing ? '지금 나오는 곡' : '멈춤') : '곡이 없어요'}</small>
            <strong>{current?.name ?? '곡을 넣어 주세요'}</strong>
            <div className="lotte-radio-controls">
              <button type="button" onClick={() => skip(-1)} disabled={!list.length} aria-label="이전 곡">⏮</button>
              <button type="button" className="is-main" onClick={toggle} aria-label={playing ? '멈추기' : '재생'}>{playing ? '❚❚' : '▶'}</button>
              <button type="button" onClick={() => skip(1)} disabled={!list.length} aria-label="다음 곡">⏭</button>
              <button type="button" className={radio.shuffle ? 'is-on' : ''} aria-pressed={radio.shuffle} onClick={() => update({ shuffle: !radio.shuffle })}>섞기</button>
            </div>
          </div>
        </div>
        {tracks === null ? <p className="lotte-radio-note">불러오는 중…</p>
          : !list.length ? <p className="lotte-radio-note">아직 곡이 없어요. 아래에서 음악 파일(mp3 등)을 고르면 이 기기에 저장되고, 롯데 페이지에 있는 동안 끝없이 이어서 틀어 줘요.</p>
          : <ol className="lotte-radio-list">
            {list.map((track, i) => <li key={track.id} className={i === index ? 'is-current' : ''}>
              <button type="button" className="lotte-radio-track" onClick={() => pick(i)} aria-current={i === index ? 'true' : undefined}>
                <span className="lotte-radio-no">{i === index && playing ? '♪' : String(i + 1).padStart(2, '0')}</span>{track.name}
              </button>
              {confirm === track.id
                ? <button type="button" className="lotte-radio-del is-sure" onClick={() => void remove(track, i)}>정말 빼기</button>
                : <button type="button" className="lotte-radio-del" onClick={() => setConfirm(track.id)} aria-label={`${track.name} 빼기`}>빼기</button>}
            </li>)}
          </ol>}
        <div className="lotte-radio-actions">
          <button type="button" className="lotte-radio-add" onClick={() => file.current?.click()}>+ 곡 넣기</button>
          <input ref={file} type="file" accept="audio/*,.mp3,.m4a" multiple hidden onChange={event => void add(event.target.files)} />
          <div className="lotte-radio-files">
            <button type="button" onClick={() => void savePlaylist()} disabled={!list.length || busy !== null}>{busy === 'save' ? '묶는 중…' : '플리 파일로 저장'}</button>
            <button type="button" onClick={() => playlistFile.current?.click()} disabled={busy !== null}>{busy === 'open' ? '여는 중…' : '플리 파일 불러오기'}</button>
            <input ref={playlistFile} type="file" accept=".json,application/json" hidden onChange={event => void openPlaylist(event.target.files?.[0])} />
          </div>
        </div>
        {message && <p className="lotte-radio-note" role="status">{message}</p>}
        <p className="lotte-radio-note is-small">곡 파일은 이 기기에만 저장돼요. 서버로 보내지 않아요. 플리 파일에는 곡이 통째로 들어가서 크기가 커요.</p>
      </div>
    </div>}
  </>;
}
