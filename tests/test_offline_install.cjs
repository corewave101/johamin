const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
const listeners={},saved=[];let claimed=false;
const cache={addAll:async reqs=>saved.push(...reqs.map(r=>r.url)),put:async url=>saved.push(url)};
const self={location:{origin:'https://example.test'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{claimed=true}};
const sw=fs.readFileSync('public/sw.js','utf8').replace('const PRECACHE = [];',"const PRECACHE = ['./assets/app.js','./assets/app.css','./images/missing.webp','./video.mp4'];");
vm.runInNewContext(sw,{self,caches:{open:async()=>cache},Request:class{constructor(url){this.url=url}},AbortController,setTimeout,clearTimeout,fetch:async request=>{if(request.url.includes('missing'))throw Error('missing image');return {ok:true}},console});
let install;listeners.install({waitUntil:p=>install=p});await install;
assert.ok(claimed);assert.ok(saved.includes('./'));assert.ok(saved.includes('./assets/app.js'));assert.ok(saved.includes('./assets/app.css'));assert.ok(saved.includes('./video.mp4'));
assert.ok(fs.readFileSync('vite.config.ts','utf8').includes('hash.update(readFileSync(swPath))'));
console.log('PASS: unavailable optional media does not block offline code/shell; worker changes invalidate cache.');
})().catch(e=>{console.error(e);process.exitCode=1});
