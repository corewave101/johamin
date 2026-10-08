// Bundle verified public-domain archival images with the Pages build and offline cache.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { portraits } = require('../data/card-portraits.ts');
async function download(p) {
  const file = path.join(__dirname, '..', 'public', p.image);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const data = execFileSync('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '25', '--user-agent', 'JohaminStudy/3.0 (https://github.com/corewave101/johamin)', p.remoteImage], { maxBuffer: 10000000 });
      if (!((data[0] === 0xff && data[1] === 0xd8) || (data[0] === 0x89 && data[1] === 0x50))) throw new Error('Response is not a JPEG or PNG');
      if (data.length < 1000) throw new Error('Image is incomplete');
      fs.writeFileSync(file, data); console.log(`Portrait: ${p.name} (${data.length} bytes)`); return;
    } catch (error) { if (attempt === 3) throw error; }
  }
}
(async () => { for (const p of Object.values(portraits)) await download(p); })().catch(error => { console.error(error); process.exitCode = 1; });
