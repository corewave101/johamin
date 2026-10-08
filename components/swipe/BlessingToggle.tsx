import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { bestStreak, onBestStreakChange } from '../../lib/best-streak';
import { deleteBlessing, exportBlessing, importBlessing, listBlessings, objectParticle, type BlessingRecord } from '../../lib/blessing-store';
import { HAMIN_PALETTE, paletteFrom, type Palette } from '../../lib/palette';
import { replayIntro, setThemeChoice, type ThemeChoice } from '../../lib/theme';
import BlessingEditor from './BlessingEditor';
import { coinTextScale, useTheme } from './useTheme';

type Panel = null | 'warn' | 'choose' | { edit: BlessingRecord | null };

const choiceOf = (r: BlessingRecord): ThemeChoice => ({ kind: 'custom', id: r.id, name: r.name, coinFront: r.coinFront, coinBack: r.coinBack, color: r.color });
const coinStyle = (p: Palette) => ({ '--c-light': p.light, '--c-soft': p.soft, '--c-base': p.base, '--c-deep': p.deep, '--c-ink': p.ink, '--c-glow': p.glow } as CSSProperties);

/** A small coin used in lists and the editor preview. */
export function MiniCoin({ palette, text, size = 40 }: { palette: Palette; text: string; size?: number }) {
  return <span className="mini-coin" style={{ ...coinStyle(palette), width: size, height: size, fontSize: size * coinTextScale(text, 'front') }} aria-hidden="true">{text}</span>;
}

/**
 * The blessing (가호) button. While blessed, pressing it asks before taking the blessing away;
 * without a blessing it opens a chooser: 하민의 가호, saved custom blessings, make a new one, or open a blessing file.
 * Also shows the device's best streak.
 */
export default function BlessingToggle() {
  const theme = useTheme();
  const [best, setBest] = useState(bestStreak);
  const [panel, setPanel] = useState<Panel>(null);
  const blessed = theme.choice.kind !== 'none';
  useEffect(() => onBestStreakChange(setBest), []);

  // Keys inside the panels must not answer cards behind them.
  useEffect(() => {
    if (!panel) return;
    const guard = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === 'Escape' && (panel === 'warn' || panel === 'choose')) setPanel(null);
    };
    window.addEventListener('keydown', guard, true);
    return () => window.removeEventListener('keydown', guard, true);
  }, [panel]);

  const receive = useCallback((choice: ThemeChoice) => {
    setThemeChoice(choice);
    setPanel(null);
    replayIntro();
  }, []);

  return <>
    <button type="button" className={`blessing-toggle glass ${blessed ? 'is-on' : 'is-off'}`} aria-pressed={blessed} aria-haspopup="dialog"
      onClick={() => setPanel(blessed ? 'warn' : 'choose')}>
      <strong>{blessed ? `✦ ${theme.name}` : '가호 없음'}</strong>
      {best && <span className="blessing-best"><b>{best.count}</b> {best.subject}</span>}
    </button>
    {panel === 'warn' && <Warning name={theme.name} onKeep={() => setPanel(null)} onTake={() => receive({ kind: 'none' })} />}
    {panel === 'choose' && <Chooser onClose={() => setPanel(null)} onReceive={receive} onEdit={record => setPanel({ edit: record })} />}
    {panel && typeof panel === 'object' && <BlessingEditor record={panel.edit} onCancel={() => setPanel('choose')} onSaved={record => receive(choiceOf(record))} />}
  </>;
}

function Warning({ name, onKeep, onTake }: { name: string; onKeep: () => void; onTake: () => void }) {
  const keep = useRef<HTMLButtonElement>(null);
  useEffect(() => { keep.current?.focus(); }, []);
  return <div className="blessing-warning" role="alertdialog" aria-modal="true" aria-labelledby="blessing-warning-title">
    <div className="blessing-warning-box glass">
      <h2 id="blessing-warning-title">경고</h2>
      <p>{name}{objectParticle(name)} 거두면 그대가 겪는 모든 불행은 온전히 그대의 몫입니다. 정말 거두시겠습니까?</p>
      <div className="blessing-warning-actions">
        <button type="button" ref={keep} className="blessing-keep" onClick={onKeep}>가호 유지</button>
        <button type="button" className="glass-button" onClick={onTake}>거둔다</button>
      </div>
    </div>
  </div>;
}

function Chooser({ onClose, onReceive, onEdit }: { onClose: () => void; onReceive: (choice: ThemeChoice) => void; onEdit: (record: BlessingRecord | null) => void }) {
  const [items, setItems] = useState<BlessingRecord[] | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const file = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const refresh = useCallback(() => listBlessings().then(setItems).catch(() => { setItems([]); setMessage('이 브라우저에서는 다른 가호를 저장할 수 없어요.'); }), []);
  useEffect(() => { void refresh(); title.current?.focus(); }, [refresh]);

  const download = async (record: BlessingRecord) => {
    const url = URL.createObjectURL(await exportBlessing(record));
    const link = document.createElement('a');
    link.href = url;
    // Korean file names can come out as just "download" (no extension) in some Chrome builds, so keep it ASCII.
    link.download = `johamin-blessing-${new Date().toISOString().slice(0, 10)}-${record.id.slice(-5)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setMessage(`${record.name} 파일을 저장했어요. 다른 기기에서 "가호 파일 불러오기"로 열 수 있어요.`);
  };
  const open = async (picked: File | undefined) => {
    if (!picked) return;
    try {
      const record = await importBlessing(picked);
      setMessage(`${record.name}${objectParticle(record.name)} 불러왔어요.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '불러오지 못했어요.');
    }
    if (file.current) file.current.value = '';
  };

  return <div className="blessing-warning blessing-sheet" role="dialog" aria-modal="true" aria-labelledby="blessing-choose-title" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="blessing-panel glass">
      <header className="blessing-panel-head">
        <h2 id="blessing-choose-title" ref={title} tabIndex={-1}>가호 받기</h2>
        <button type="button" className="glass-button" onClick={onClose}>닫기</button>
      </header>
      <button type="button" className="blessing-choice is-hamin" onClick={() => onReceive({ kind: 'hamin' })}>
        <MiniCoin palette={HAMIN_PALETTE} text="JO" size={46} />
        <span><strong>하민의 가호</strong><small>조하민 영상 · 카드 · 갑툭튀</small></span>
      </button>
      <h3>다른 가호</h3>
      {items === null ? <p className="blessing-note">불러오는 중…</p>
        : items.length === 0 ? <p className="blessing-note">아직 없어요. 배경과 카드 사진을 골라 나만의 가호를 만들어 보세요.</p>
        : <ul className="blessing-list">
          {items.map(item => <li key={item.id}>
            <button type="button" className="blessing-choice" onClick={() => onReceive(choiceOf(item))}>
              <MiniCoin palette={paletteFrom(item.color)} text={item.coinFront} size={46} />
              <span><strong>{item.name}</strong><small>받기{item.scares?.length ? ` · 갑툭튀 ${item.scares.length}개` : ''}{item.layout ? ' · 카드 위치' : ''}</small></span>
            </button>
            <div className="blessing-row-actions">
              <button type="button" className="glass-button" onClick={() => onEdit(item)}>고치기</button>
              <button type="button" className="glass-button" onClick={() => void download(item)}>파일로 저장</button>
              {confirmDelete === item.id
                ? <button type="button" className="glass-button is-danger" onClick={() => { void deleteBlessing(item.id).then(refresh); setConfirmDelete(null); }}>정말 지우기</button>
                : <button type="button" className="glass-button" onClick={() => setConfirmDelete(item.id)}>지우기</button>}
            </div>
          </li>)}
        </ul>}
      <div className="blessing-panel-actions">
        <button type="button" className="blessing-new" onClick={() => onEdit(null)}>+ 다른 가호 만들기</button>
        <button type="button" className="glass-button" onClick={() => file.current?.click()}>가호 파일 불러오기</button>
        <input ref={file} type="file" accept=".json,application/json" hidden onChange={event => void open(event.target.files?.[0])} />
      </div>
      {message && <p className="blessing-note" role="status">{message}</p>}
      <p className="blessing-note">다른 가호의 사진은 이 기기에만 저장돼요. 서버로 보내지 않아요.</p>
    </div>
  </div>;
}
