// Reads CHANGELOG.md (injected at build time) into versions for the in-app update log.
export interface LogItem { text: string; children: string[] }
export interface LogVersion { version: string; date: string; items: LogItem[] }

/** "## 3.2.0 — 2026-10-08" sections with "- " bullets and "  - " sub-bullets. Anything else is ignored. */
export function parseChangelog(text: string): LogVersion[] {
  const versions: LogVersion[] = [];
  for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
    const head = raw.match(/^##\s+(\S+)(?:\s*[—–-]+\s*(.*))?$/);
    if (head) { versions.push({ version: head[1], date: (head[2] ?? '').trim(), items: [] }); continue; }
    const current = versions.at(-1);
    if (!current) continue;
    const sub = raw.match(/^\s{2,}[-*]\s+(.*)$/);
    if (sub && current.items.length) { current.items[current.items.length - 1].children.push(clean(sub[1])); continue; }
    const item = raw.match(/^[-*]\s+(.*)$/);
    if (item) current.items.push({ text: clean(item[1]), children: [] });
  }
  return versions.filter(v => v.items.length);
}
// Markdown leftovers that would show as symbols: `code` and **bold** markers.
const clean = (text: string) => text.replace(/`([^`]*)`/g, '$1').replace(/\*\*([^*]*)\*\*/g, '$1').trim();
