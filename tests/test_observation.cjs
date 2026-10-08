const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m,f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {horizontalCoordinates:sky, polarError, observationsCsv, readObservations, OBSERVATION_KEY} = require('../lib/observation.ts');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
close(sky(37.5,0,0).altitude,52.5);close(sky(37.5,0,0).azimuth,180);
close(sky(37.5,0,-90).altitude,0);close(sky(37.5,0,-90).azimuth,90);
close(sky(37.5,0,90).azimuth,270);
close(sky(37.5,90,0).altitude,37.5);close(sky(37.5,90,90).azimuth,0);
close(sky(37.5,37.5,0).altitude,90);assert.equal(sky(37.5,37.5,0).azimuth,null);
close(polarError(37.5,37.5,0),0);close(polarError(60,60,2),1);
for(let h=-180;h<=180;h+=15) { const a=sky(37.5,20,h),b=sky(37.5,20,-h);close(a.altitude,b.altitude);assert.ok(a.altitude>=-90&&a.altitude<=90); }
const csv=observationsCsv([{time:'2026-10-09',activity:'a,"b"',result:'line\n2'}]);
assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"a,""b"""'));assert.ok(csv.includes('"line\n2"'));
global.localStorage={getItem:k=>{assert.equal(k,OBSERVATION_KEY);return '{bad';}};assert.deepEqual(readObservations(),[]);
global.localStorage.getItem=()=>JSON.stringify([null,{time:'t',activity:'a',result:'r'},{time:4}]);assert.equal(readObservations().length,1);
console.log('PASS: celestial cardinal directions, transit, pole, zenith, symmetry, polar approximation, CSV escaping and damaged local records.');
