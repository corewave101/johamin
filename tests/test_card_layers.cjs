// Long sessions: the cards on the deck (current, flying, back, thrown back) must never share a React key.
// In 3.4.1 the flight and the back card both used the answer's timestamp, so finished cards with blur
// animations piled up in the DOM (+3 GPU layers per answer) until tablets started dropping tiles.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const src = fs.readFileSync('components/swipe/SwipeGame.tsx', 'utf8');
const keys = [...src.matchAll(/\{(flight|back|thrown) &&[^\n]*?key=\{`([a-z]+)-\$\{\1\.id\}`\}/g)].map(m => m[2]);
assert.deepEqual(keys.sort(), ['back', 'flight', 'thrown'], 'flight, back and thrown cards use their own key prefixes');
assert.equal(new Set(keys).size, 3);
assert.ok(!/key=\{(flight|back|thrown)\.id\}/.test(src), 'no bare timestamp keys');
console.log('PASS: flying, back and thrown cards have distinct keys, so finished cards leave the DOM.');
