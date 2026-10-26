// 정보 코딩 연습장: 브라우저 안 파이썬(Pyodide)을 화면과 따로 돌리는 워커.
// 무한 루프가 나도 화면은 멈추지 않고, 시간이 넘으면 페이지가 이 워커를 끝내고 새로 띄운다(lib/py-runner.ts).
let booting = null;
let runMain = null;

async function boot(url) {
  importScripts(url + 'pyodide.js');
  const pyodide = await loadPyodide({ indexURL: url });
  const helper = await (await fetch('py-runner.py')).text();
  pyodide.runPython(helper);
  runMain = pyodide.globals.get('run_main');
}

self.onmessage = async event => {
  const message = event.data;
  if (!message || typeof message !== 'object') return;
  if (message.type === 'init') {
    booting ??= boot(message.url);
    try { await booting; self.postMessage({ type: 'ready' }); }
    catch (error) { booting = null; self.postMessage({ type: 'fail', message: String(error && error.message || error) }); }
    return;
  }
  if (message.type === 'run') {
    try {
      await booting;
      const result = runMain(message.code, message.input);
      const [out, err, seconds] = result.toJs();
      result.destroy();
      self.postMessage({ type: 'result', id: message.id, out, err: err ?? null, seconds });
    } catch (error) {
      self.postMessage({ type: 'result', id: message.id, out: '', err: String(error && error.message || error), seconds: 0 });
    }
  }
};
