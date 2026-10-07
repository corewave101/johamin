import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { clamp, coinDefaults, LIMITS, newBlessingId, saveBlessing, type BlessingRecord, type CardCrop } from '../../lib/blessing-store';
import { CARD_ASPECT, cropBox, cropCard, resizeImage } from '../../lib/image-tools';
import { paletteFrom, PRESET_COLORS } from '../../lib/palette';
import { coinTextScale } from './useTheme';

type Props = { record: BlessingRecord | null; onCancel: () => void; onSaved: (record: BlessingRecord) => void };

/** Object URL for a blob, released when the blob changes or the editor closes. */
function useBlobUrl(blob: Blob | null) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

/**
 * Make or change a blessing: name, coin text, colour, background photo (pick the part that stays in view)
 * and card photo (move and zoom inside the card frame). Saved on this device only.
 */
export default function BlessingEditor({ record, onCancel, onSaved }: Props) {
  const [name, setName] = useState(record?.name ?? '');
  const [front, setFront] = useState(record?.coinFront ?? '');
  const [back, setBack] = useState(record?.coinBack ?? '');
  const [color, setColor] = useState(record?.color ?? PRESET_COLORS[3]);
  const [background, setBackground] = useState<Blob | null>(record?.background ?? null);
  const [focus, setFocus] = useState({ x: record?.focusX ?? 50, y: record?.focusY ?? 50 });
  const [cardSource, setCardSource] = useState<Blob | null>(record?.cardSource ?? null);
  const [crop, setCrop] = useState<CardCrop>(record?.crop ?? { x: 0, y: 0, scale: 1 });
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [flip, setFlip] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const palette = useMemo(() => paletteFrom(color), [color]);
  const defaults = coinDefaults(name);
  const coinFront = front.trim() || defaults.front, coinBack = back.trim() || defaults.back;
  useEffect(() => { title.current?.focus(); }, []);

  const pick = async (file: File | undefined, kind: 'background' | 'card') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('사진 파일을 골라 주세요.'); return; }
    setBusy('사진 준비 중…'); setError('');
    try {
      const resized = await resizeImage(file, kind === 'background' ? 1600 : 1400);
      if (kind === 'background') { setBackground(resized); setFocus({ x: 50, y: 50 }); }
      else { setCardSource(resized); setCrop({ x: 0, y: 0, scale: 1 }); }
    } catch {
      setError('이 사진은 열 수 없어요. 다른 사진을 골라 주세요.');
    }
    setBusy('');
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setError('가호 이름을 적어 주세요.');
    if (!background) return setError('배경 사진을 골라 주세요.');
    if (!cardSource) return setError('카드 사진을 골라 주세요.');
    setBusy('저장 중…'); setError('');
    try {
      const card = await cropCard(cardSource, crop);
      const saved: BlessingRecord = {
        id: record?.id ?? newBlessingId(), createdAt: record?.createdAt ?? Date.now(),
        name: trimmed, coinFront, coinBack, color,
        background, focusX: Math.round(focus.x), focusY: Math.round(focus.y), cardSource, crop, card,
      };
      await saveBlessing(saved);
      onSaved(saved);
    } catch {
      setError('저장하지 못했어요. 기기 저장 공간을 확인해 주세요.');
      setBusy('');
    }
  };

  return <div className="blessing-warning blessing-sheet" role="dialog" aria-modal="true" aria-labelledby="blessing-edit-title">
    <div className="blessing-panel blessing-editor glass">
      <header className="blessing-panel-head">
        <h2 id="blessing-edit-title" ref={title} tabIndex={-1}>{record ? '가호 고치기' : '다른 가호 만들기'}</h2>
        <button type="button" className="glass-button" onClick={onCancel}>취소</button>
      </header>

      <section className="editor-field">
        <label htmlFor="blessing-name"><b>1</b> 가호 이름</label>
        <input id="blessing-name" value={name} maxLength={LIMITS.name} placeholder="예: 철수의 가호" onChange={e => setName(e.target.value)} />
      </section>

      <section className="editor-field">
        <span className="editor-label"><b>2</b> 동전과 색</span>
        <div className="editor-coin-row">
          <button type="button" className="editor-coin" style={{ '--c-light': palette.light, '--c-soft': palette.soft, '--c-base': palette.base, '--c-deep': palette.deep, '--c-ink': palette.ink, '--c-glow': palette.glow } as CSSProperties}
            onClick={() => setFlip(!flip)} aria-label="동전 미리보기, 누르면 뒷면">
            <span style={{ fontSize: `calc(var(--size) * ${coinTextScale(flip ? coinBack : coinFront, flip ? 'back' : 'front')})` }}>{flip ? coinBack : coinFront}</span>
          </button>
          <div className="editor-coin-text">
            <label>앞면 <input value={front} maxLength={LIMITS.coinFront} placeholder={defaults.front} onChange={e => setFront(e.target.value)} onFocus={() => setFlip(false)} /></label>
            <label>뒷면 <input value={back} maxLength={LIMITS.coinBack} placeholder={defaults.back} onChange={e => setBack(e.target.value)} onFocus={() => setFlip(true)} /></label>
            <small>뒷면은 마우스를 올리거나 누를 때 보여요.</small>
          </div>
        </div>
        <div className="editor-swatches" role="radiogroup" aria-label="가호 색">
          {PRESET_COLORS.map(c => <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={c} className="editor-swatch" style={{ background: paletteFrom(c).base }} onClick={() => setColor(c)} />)}
          <label className="editor-swatch is-custom" title="직접 고르기" style={{ background: PRESET_COLORS.includes(color) ? undefined : palette.base }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} aria-label="색 직접 고르기" />
          </label>
        </div>
        <small className="editor-help">고른 색을 그대로 쓰지 않고, 같은 색조로 동전처럼 자연스러운 톤을 만들어요.</small>
      </section>

      <section className="editor-field">
        <span className="editor-label"><b>3</b> 배경 사진</span>
        <PhotoPicker label={background ? '다른 사진' : '사진 고르기'} onPick={file => void pick(file, 'background')} />
        {background && <BackgroundFocus blob={background} focus={focus} onChange={setFocus} />}
      </section>

      <section className="editor-field">
        <span className="editor-label"><b>4</b> 카드 사진</span>
        <PhotoPicker label={cardSource ? '다른 사진' : '사진 고르기'} onPick={file => void pick(file, 'card')} />
        {cardSource && <CardCropper blob={cardSource} crop={crop} onChange={setCrop} />}
      </section>

      {error && <p className="blessing-error" role="alert">{error}</p>}
      <div className="blessing-panel-actions">
        <button type="button" className="blessing-new" disabled={Boolean(busy)} onClick={() => void save()}>{busy || '저장하고 이 가호 받기'}</button>
      </div>
      <p className="blessing-note">사진은 이 기기에만 저장돼요. 다른 가호에는 갑툭튀가 없어요.</p>
    </div>
  </div>;
}

function PhotoPicker({ label, onPick }: { label: string; onPick: (file: File | undefined) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <>
    <button type="button" className="glass-button" onClick={() => input.current?.click()}>{label}</button>
    <input ref={input} type="file" accept="image/*" hidden onChange={e => { onPick(e.target.files?.[0]); e.target.value = ''; }} />
  </>;
}

/** Drag on the photo (or either screen preview) to choose the part that stays in view on phones and computers. */
function BackgroundFocus({ blob, focus, onChange }: { blob: Blob; focus: { x: number; y: number }; onChange: (focus: { x: number; y: number }) => void }) {
  const url = useBlobUrl(blob);
  const drag = useRef<{ id: number; x: number; y: number; start: { x: number; y: number }; w: number; h: number } | null>(null);
  const setFromPhoto = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onChange({ x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100), y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100) });
  };
  const startPreview = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: focus, w: rect.width, h: rect.height };
  };
  const movePreview = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    // Dragging the picture right shows more of its left side, like moving a photo under a frame.
    onChange({ x: clamp(d.start.x - ((event.clientX - d.x) / d.w) * 100, 0, 100), y: clamp(d.start.y - ((event.clientY - d.y) / d.h) * 100, 0, 100) });
  };
  if (!url) return null;
  const view = { backgroundImage: `url("${url}")`, backgroundPosition: `${focus.x}% ${focus.y}%` };
  return <div className="editor-focus">
    <p className="editor-help">사진에서 꼭 보여야 할 곳을 누르거나 끌어 주세요. 오른쪽 화면들도 끌 수 있어요.</p>
    <div className="editor-focus-row">
      <div className="editor-focus-photo" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setFromPhoto(e); }} onPointerMove={e => { if (e.buttons) setFromPhoto(e); }}>
        <img src={url} alt="배경 사진 전체" draggable={false} />
        <span className="editor-focus-dot" style={{ left: `${focus.x}%`, top: `${focus.y}%` }} />
      </div>
      <div className="editor-screens">
        <figure><div className="editor-screen is-phone" style={view} onPointerDown={startPreview} onPointerMove={movePreview} onPointerUp={() => { drag.current = null; }} /><figcaption>폰</figcaption></figure>
        <figure><div className="editor-screen is-pc" style={view} onPointerDown={startPreview} onPointerMove={movePreview} onPointerUp={() => { drag.current = null; }} /><figcaption>PC</figcaption></figure>
      </div>
    </div>
  </div>;
}

/** Move the photo inside the card frame and zoom with the slider, the wheel or two fingers. */
function CardCropper({ blob, crop, onChange }: { blob: Blob; crop: CardCrop; onChange: (crop: CardCrop) => void }) {
  const url = useBlobUrl(blob);
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const latest = useRef(crop);
  latest.current = crop;

  const fit = (next: CardCrop) => {
    if (!size) return next;
    const scale = clamp(next.scale, 1, 4);
    const box = cropBox(size.w, size.h, { ...next, scale });
    return { x: box.x, y: box.y, scale };
  };
  const set = (next: CardCrop) => onChange(fit(next));

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => { event.preventDefault(); set({ ...latest.current, scale: latest.current.scale * (event.deltaY < 0 ? 1.08 : 1 / 1.08) }); };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  });

  const down = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: latest.current.scale };
    }
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const height = event.currentTarget.getBoundingClientRect().height;
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      set({ ...latest.current, scale: pinch.current.scale * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance) });
    } else if (pointers.current.size === 1) {
      set({ ...latest.current, x: latest.current.x + (event.clientX - previous.x) / height, y: latest.current.y + (event.clientY - previous.y) / height });
    }
  };
  const up = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  if (!url) return null;
  const box = size ? cropBox(size.w, size.h, crop) : null;
  const imageStyle: CSSProperties = box
    ? { width: `${(box.w / CARD_ASPECT) * 100}%`, height: `${box.h * 100}%`, left: `${(((CARD_ASPECT - box.w) / 2 + box.x) / CARD_ASPECT) * 100}%`, top: `${((1 - box.h) / 2 + box.y) * 100}%` }
    : { visibility: 'hidden' };
  return <div className="editor-crop">
    <p className="editor-help">사진을 끌어서 옮기고, 아래 막대(또는 두 손가락·휠)로 확대해 주세요. 아래쪽 어두운 부분에 문제가 표시돼요.</p>
    <div className="editor-crop-frame" ref={frame} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <img src={url} alt="카드 사진" draggable={false} style={imageStyle} onLoad={e => setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })} />
      <span className="editor-crop-caption">문제가 여기 표시돼요</span>
    </div>
    <label className="editor-zoom">확대 <input type="range" min={1} max={4} step={0.01} value={crop.scale} onChange={e => set({ ...crop, scale: Number(e.target.value) })} /></label>
  </div>;
}
