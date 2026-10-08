// 3.1 (beta) parts of the blessing editor: where the card set sits, and the blessing's own jump scares.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { clamp, type CardLayout, type ScareSound } from '../../lib/blessing-store';
import { describeRule, MAX_RULES, normalizeRule, TRIGGER_ORDER, TRIGGERS, type ScareRuleSpec, type ScareTrigger } from '../../lib/custom-scares';
import { resizeImage } from '../../lib/image-tools';
import type { ScareId } from '../../lib/jumpscare';
import { triggerCustomScare } from '../../lib/jumpscare';
import { playSound } from '../../lib/scare-sounds';

// Size of the card set relative to each screen shape (measured on a 1440×900 PC and a 390×844 phone).
const SET = { pc: { w: 0.46, h: 0.7 }, phone: { w: 0.94, h: 0.74 } };

/** Drag the card set on a PC and a phone preview. x/y are 0–100 within the free space; null = the usual place. */
export function LayoutPicker({ value, onChange, background }: { value: CardLayout | null; onChange: (layout: CardLayout | null) => void; background: { url: string; x: number; y: number } | null }) {
  const at = value ?? { x: 50, y: 0 };
  const move = (event: ReactPointerEvent<HTMLDivElement>, shape: 'pc' | 'phone') => {
    const rect = event.currentTarget.getBoundingClientRect(), set = SET[shape];
    const px = (event.clientX - rect.left) / rect.width, py = (event.clientY - rect.top) / rect.height;
    const x = set.w < 0.98 ? clamp(((px - set.w / 2) / (1 - set.w)) * 100, 0, 100) : at.x;
    const y = clamp(((py - set.h / 2) / (1 - set.h)) * 100, 0, 100);
    // On a phone there is almost no room left and right, so dragging there only moves the set up and down.
    onChange({ x: Math.round(shape === 'phone' ? at.x : x), y: Math.round(y) });
  };
  const frame = (shape: 'pc' | 'phone') => {
    const set = SET[shape];
    const style: CSSProperties = background ? { backgroundImage: `url("${background.url}")`, backgroundPosition: `${background.x}% ${background.y}%` } : {};
    return <figure>
      <div className={`layout-frame is-${shape}`} style={style}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move(e, shape); }} onPointerMove={e => { if (e.buttons) move(e, shape); }}>
        <span className="layout-set" style={{ width: `${set.w * 100}%`, height: `${set.h * 100}%`, left: `${(1 - set.w) * at.x}%`, top: `${(1 - set.h) * at.y}%` }}><i /><i /></span>
      </div>
      <figcaption>{shape === 'pc' ? 'PC' : '폰'}</figcaption>
    </figure>;
  };
  return <div className="editor-focus">
    <p className="editor-help">제목·카드·방향 버튼 묶음을 끌어서 놓을 곳을 정해요. 폰은 화면이 좁아서 위아래로만 움직여요.</p>
    <div className="layout-frames">{frame('pc')}{frame('phone')}</div>
    {value && <button type="button" className="glass-button" onClick={() => onChange(null)}>원래 자리로</button>}
  </div>;
}

export const BUILTIN_SOUNDS: [ScareId, string][] = [
  ['aria', '아~ (성악)'], ['fart', '방구'], ['impostor', '임포스터'], ['crash', '쨍그랑'], ['ya', '야!'],
  ['horn', '뱃고동'], ['scratch', '긁적긁적'], ['ball', 'BALL'], ['huh', '으으응??'], ['leave', '뿌잉'],
];
export type ScareDraft = ScareRuleSpec & { image: Blob | null; sound: ScareSound };
export const newScareDraft = (): ScareDraft => ({ id: `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, trigger: 'wrong', n: 0, chance: 30, image: null, sound: { kind: 'none' } });

function useBlobUrl(blob: Blob | null) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

/** The blessing's own scares: photo, condition and its number, chance and sound. Higher in the list wins. */
export function ScareListEditor({ value, onChange, onError }: { value: ScareDraft[]; onChange: (scares: ScareDraft[]) => void; onError: (message: string) => void }) {
  const update = (i: number, change: Partial<ScareDraft>) => onChange(value.map((s, k) => (k === i ? { ...s, ...change } : s)));
  const moveRule = (i: number, d: number) => { const next = [...value]; const [s] = next.splice(i, 1); next.splice(i + d, 0, s); onChange(next); };
  return <div className="editor-focus">
    <p className="editor-help">사진과 나올 조건을 정해요. 위에 있는 갑툭튀가 먼저이고, 한 번에 하나만 나와요. ‘모름’으로 넘기면 확률이 절반이에요.</p>
    {value.length > 0 && <ol className="scare-rules">
      {value.map((s, i) => <ScareRow key={s.id} draft={s} index={i} count={value.length} onChange={change => update(i, change)}
        onMove={d => moveRule(i, d)} onRemove={() => onChange(value.filter((_, k) => k !== i))} onError={onError} />)}
    </ol>}
    {value.length < MAX_RULES && <button type="button" className="glass-button" onClick={() => onChange([...value, newScareDraft()])}>+ 갑툭튀 추가</button>}
  </div>;
}

function ScareRow({ draft, index, count, onChange, onMove, onRemove, onError }: { draft: ScareDraft; index: number; count: number; onChange: (change: Partial<ScareDraft>) => void; onMove: (d: number) => void; onRemove: () => void; onError: (m: string) => void }) {
  const photo = useRef<HTMLInputElement>(null), audioFile = useRef<HTMLInputElement>(null);
  const imageUrl = useBlobUrl(draft.image);
  const soundUrl = useBlobUrl(draft.sound.kind === 'file' ? draft.sound.blob : null);
  const [busy, setBusy] = useState(false);
  const spec = TRIGGERS[draft.trigger];

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return onError('갑툭튀에는 사진 파일을 골라 주세요.');
    setBusy(true);
    try { onChange({ image: await resizeImage(file, 1400) }); } catch { onError('이 사진은 열 수 없어요.'); }
    setBusy(false);
  };
  const pickAudio = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) return onError('소리 파일(mp3, m4a, wav 등)을 골라 주세요.');
    if (file.size > 2 * 1024 * 1024) return onError('소리 파일은 2MB까지 넣을 수 있어요.');
    onChange({ sound: { kind: 'file', blob: file } });
  };
  const soundValue = draft.sound.kind === 'builtin' ? draft.sound.id : draft.sound.kind;
  const preview = () => {
    if (!imageUrl) return onError('먼저 사진을 넣어 주세요.');
    const sound = draft.sound.kind === 'file' && soundUrl ? { kind: 'url' as const, url: soundUrl } : draft.sound.kind === 'builtin' ? draft.sound : { kind: 'none' as const };
    triggerCustomScare({ ...draft, image: imageUrl, sound });
  };

  return <li className="scare-rule">
    <button type="button" className="scare-thumb" style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined} onClick={() => photo.current?.click()} aria-label={`${index + 1}번 갑툭튀 사진 고르기`}>
      {imageUrl ? '' : busy ? '준비 중…' : '사진 고르기'}
    </button>
    <input ref={photo} type="file" accept="image/*" hidden onChange={e => { void pickPhoto(e.target.files?.[0]); e.target.value = ''; }} />
    <div className="scare-fields">
      <label>조건
        <select value={draft.trigger} onChange={e => { const trigger = e.target.value as ScareTrigger; onChange(normalizeRule({ ...draft, trigger, n: TRIGGERS[trigger].n?.initial ?? 0, chance: trigger === 'wrong' ? 30 : 100 })); }}>
          {TRIGGER_ORDER.map(t => <option key={t} value={t}>{TRIGGERS[t].label}</option>)}
        </select>
      </label>
      {spec.n && <label>N = <input type="number" min={spec.n.min} max={spec.n.max} value={draft.n} onChange={e => onChange({ n: Number(e.target.value) })} onBlur={() => onChange(normalizeRule(draft))} /> {spec.n.unit}</label>}
      <label>확률 <input type="number" min={1} max={100} value={draft.chance} onChange={e => onChange({ chance: Number(e.target.value) })} onBlur={() => onChange(normalizeRule(draft))} /> %</label>
      <label>소리
        <select value={soundValue} onChange={e => {
          const v = e.target.value;
          if (v === 'none') onChange({ sound: { kind: 'none' } });
          else if (v === 'file') audioFile.current?.click();
          else { onChange({ sound: { kind: 'builtin', id: v as ScareId } }); playSound({ kind: 'builtin', id: v as ScareId }); }
        }}>
          <option value="none">없음</option>
          {BUILTIN_SOUNDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          <option value="file">{draft.sound.kind === 'file' ? '내 소리 파일 (넣음)' : '내 소리 파일 넣기…'}</option>
        </select>
      </label>
      <input ref={audioFile} type="file" accept="audio/*" hidden onChange={e => { pickAudio(e.target.files?.[0]); e.target.value = ''; }} />
      <small className="editor-help">{describeRule(normalizeRule(draft))}</small>
    </div>
    <div className="scare-rule-actions">
      <button type="button" className="glass-button" onClick={preview}>미리 보기</button>
      <button type="button" className="glass-button" disabled={index === 0} onClick={() => onMove(-1)}>위로</button>
      <button type="button" className="glass-button" disabled={index === count - 1} onClick={() => onMove(1)}>아래로</button>
      <button type="button" className="glass-button" onClick={onRemove}>빼기</button>
    </div>
  </li>;
}
