import { forwardRef, useImperativeHandle, useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react';

// 엘리스 편집기처럼: 줄 번호, 파이썬 색칠, 빈칸(____) 강조. 글자는 투명한 textarea에 쓰고 그 뒤에 색칠한 글을 겹친다.
const KEYWORDS = new Set(['def', 'return', 'if', 'elif', 'else', 'for', 'in', 'while', 'not', 'and', 'or', 'import', 'from', 'as', 'break', 'continue', 'pass', 'lambda', 'is', 'class', 'with', 'try', 'except', 'finally', 'global', 'nonlocal', 'yield', 'del', 'assert', 'raise']);
const CONSTANTS = new Set(['True', 'False', 'None']);
const BUILTINS = new Set(['print', 'input', 'int', 'list', 'map', 'set', 'range', 'len', 'max', 'min', 'sum', 'sorted', 'str', 'dict', 'tuple', 'enumerate', 'abs', 'deque', 'zip', 'reversed', 'any', 'all', 'float', 'round']);
const TOKEN = /(#[^\n]*)|([fF]?"(?:[^"\\\n]|\\.)*"?|[fF]?'(?:[^'\\\n]|\\.)*'?)|(____)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_#"']+)/g;

/** Python source → colored spans. Blanks (____) get their own mark, even inside strings. */
export function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let key = 0;
  const push = (text: string, cls?: string) => {
    if (!cls) { nodes.push(text); return; }
    // ____ inside a string or comment still shows as a blank
    const parts = text.split(/(____)/);
    for (const part of parts) {
      if (!part) continue;
      nodes.push(<span key={key++} className={part === '____' ? 'py-blank' : cls}>{part}</span>);
    }
  };
  let previous = '';
  for (const match of code.matchAll(TOKEN)) {
    const [text, comment, string, blank, number, word] = match;
    if (comment) push(text, 'py-comment');
    else if (string) push(text, 'py-string');
    else if (blank) nodes.push(<span key={key++} className="py-blank">{text}</span>);
    else if (number) push(text, 'py-number');
    else if (word) {
      if (KEYWORDS.has(word)) push(text, 'py-keyword');
      else if (CONSTANTS.has(word)) push(text, 'py-constant');
      else if (previous === 'def') push(text, 'py-function');
      else if (BUILTINS.has(word)) push(text, 'py-builtin');
      else push(text);
      previous = word;
      continue;
    } else push(text);
    if (!/^\s+$/.test(text)) previous = '';
  }
  return nodes;
}

export interface CodeEditorHandle { focus: () => void; nextBlank: () => boolean }

interface Props { value: string; onChange: (value: string) => void; label: string; onShortcut?: (kind: 'run' | 'submit') => void }

const INDENT = '    ';

const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor({ value, onChange, label, onShortcut }, ref) {
  const area = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\n').length;
  const painted = useMemo(() => highlight(value), [value]);

  // Replace a range and keep the caret where the user expects it (also keeps the browser's undo history).
  const replace = (start: number, end: number, text: string, caretStart: number, caretEnd = caretStart) => {
    const el = area.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(start, end);
    const done = typeof document.execCommand === 'function' && document.execCommand('insertText', false, text);
    if (!done) {
      el.setRangeText(text, start, end, 'end');
      onChange(el.value);
    }
    el.setSelectionRange(caretStart, caretEnd);
  };

  const nextBlank = () => {
    const el = area.current;
    if (!el) return false;
    const from = el.selectionEnd;
    let at = el.value.indexOf('____', from);
    if (at < 0) at = el.value.indexOf('____');
    if (at < 0) return false;
    el.focus();
    el.setSelectionRange(at, at + 4);
    // Scroll the blank into view inside the editor.
    const lineIndex = el.value.slice(0, at).split('\n').length - 1;
    const scroller = el.closest('.code-scroll');
    if (scroller) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
      const top = lineIndex * lineHeight;
      if (top < scroller.scrollTop || top > scroller.scrollTop + scroller.clientHeight - lineHeight * 2) scroller.scrollTop = Math.max(0, top - scroller.clientHeight / 3);
    }
    return true;
  };

  useImperativeHandle(ref, () => ({ focus: () => area.current?.focus(), nextBlank }));

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    const { selectionStart: start, selectionEnd: end, value: text } = el;
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onShortcut?.(event.shiftKey ? 'submit' : 'run');
      return;
    }
    if (event.key === 'Escape') { el.blur(); return; }
    if (event.key === 'Tab') {
      event.preventDefault();
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      if (event.shiftKey) {
        const head = text.slice(lineStart, lineStart + 4);
        const remove = head.length - head.trimStart().length;
        if (remove) replace(lineStart, lineStart + remove, '', Math.max(lineStart, start - remove), Math.max(lineStart, end - remove));
        return;
      }
      // Tab with a blank selected jumps to the next blank; otherwise it indents.
      if (text.slice(start, end) === '____') { el.setSelectionRange(end, end); nextBlank(); return; }
      replace(start, end, INDENT, start + INDENT.length);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const line = text.slice(lineStart, start);
      let indent = line.match(/^\s*/)?.[0] ?? '';
      if (/:\s*(#.*)?$/.test(line)) indent += INDENT;
      replace(start, end, '\n' + indent, start + 1 + indent.length);
      return;
    }
    if (event.key === 'Backspace' && start === end && start > 0) {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const before = text.slice(lineStart, start);
      if (before.length && /^ +$/.test(before) && before.length % 4 === 0) {
        event.preventDefault();
        replace(start - 4, start, '', start - 4);
      }
    }
  };

  return <div className="code-scroll">
    <div className="code-gutter" aria-hidden="true">{Array.from({ length: lines }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
    <div className="code-stack">
      <pre className="code-paint" aria-hidden="true">{painted}{'\n'}</pre>
      <textarea ref={area} className="code-input" value={value} aria-label={label} spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off" wrap="off"
        onChange={event => onChange(event.target.value)} onKeyDown={onKeyDown} />
    </div>
  </div>;
});

export default CodeEditor;
