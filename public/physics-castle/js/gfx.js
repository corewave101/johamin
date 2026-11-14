'use strict';
/* ═════════ 3D 공통 ═════════ */
const stage = $('stage'), canvas = $('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
const camera = new THREE.PerspectiveCamera(48, 1, .1, 400);
const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({color:c, roughness:.6, metalness:.08}, o));
const UPV = V(0, 1, 0);
function label(lines, {size = 24, color = '#e8ecf4', sub = '#8e98b0', bg = null, h = .02, bold = false} = {}){
  if (!Array.isArray(lines)) lines = [lines];
  const c = document.createElement('canvas'), x = c.getContext('2d'), k = 2;
  const fA = `${bold ? 700 : 500} ${size*k}px "IBM Plex Sans KR", sans-serif`, fB = `400 ${Math.round(size*.8)*k}px "JetBrains Mono", "IBM Plex Sans KR", monospace`;
  x.font = fA; let w = x.measureText(lines[0]).width;
  if (lines[1]){ x.font = fB; w = Math.max(w, x.measureText(lines[1]).width); }
  const pad = bg ? 14*k : 4*k, l1 = size*1.25*k, l2 = lines[1] ? size*1.05*k : 0;
  c.width = Math.ceil(w + pad*2); c.height = Math.ceil(l1 + l2 + (bg ? 10*k : 4*k));
  if (bg){ x.fillStyle = bg; const r = 10*k; x.beginPath(); x.moveTo(r, 0); x.arcTo(c.width, 0, c.width, c.height, r); x.arcTo(c.width, c.height, 0, c.height, r); x.arcTo(0, c.height, 0, 0, r); x.arcTo(0, 0, c.width, 0, r); x.fill(); }
  x.textAlign = 'center'; x.textBaseline = 'middle'; const top = bg ? 5*k : 2*k;
  x.font = fA; x.fillStyle = color; x.fillText(lines[0], c.width/2, top + l1/2);
  if (lines[1]){ x.font = fB; x.fillStyle = sub; x.fillText(lines[1], c.width/2, top + l1 + l2/2); }
  const tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false, fog:false}));
  s.scale.set(c.width/k*h, c.height/k*h, 1); s.renderOrder = 10; return s;
}
function dispose(o){ o.traverse(n => { if (n.geometry) n.geometry.dispose(); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); }); }
function clearGroup(g){ dispose(g); while (g.children.length) g.remove(g.children[0]); }
function beamMesh(color){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 10, 1, true), new THREE.MeshBasicMaterial({color, transparent:true, opacity:.7, blending:THREE.AdditiveBlending, depthWrite:false, fog:false}));
  m.visible = false; return m;
}
function setBeam(m, a, b, w, op){
  const len = a.distanceTo(b); if (len < .01){ m.visible = false; return; }
  m.visible = true; m.position.copy(a).add(b).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(UPV, b.clone().sub(a).normalize());
  m.scale.set(w, len, w); m.material.opacity = op;
}
let hintT;
function hint(t){ const h = $('hint'); h.textContent = t; h.classList.remove('off'); clearTimeout(hintT); hintT = setTimeout(() => h.classList.add('off'), 3800); }
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function setRay(ev){ const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left)/r.width)*2 - 1, -((ev.clientY - r.top)/r.height)*2 + 1); ray.setFromCamera(ndc, camera); }

/* ═════════ 부품 모양 ═════════ */
const BEAM_Y = 1.0;
function post(){ const m = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, BEAM_Y - .12, 10), std(0x8a99ad, {metalness:.7, roughness:.3})); m.position.y = -(BEAM_Y - .12)/2; return m; }
function lensGeo(type, f){
  const R = .9, t0 = clamp(5/f, .08, .5), N = 12, pts = [];
  const h = r => type === 'convex' ? .03 + t0*(1 - (r/R)**2) : .05 + t0*(r/R)**2;
  for (let i = 0; i <= N; i++){ const r = R*i/N; pts.push(new THREE.Vector2(r, -h(r))); }
  for (let i = N; i >= 0; i--){ const r = R*i/N; pts.push(new THREE.Vector2(r, h(r))); }
  return new THREE.LatheGeometry(pts, 36);
}
function foeBody(type, armor, mat){
  const g = new THREE.Group(); let body;
  if (type === 'ag'){ body = new THREE.Mesh(new THREE.SphereGeometry(.45, 16, 12), mat); body.scale.set(1, .6, 1); }
  else if (type === 'cs'){ body = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 14), mat); body.scale.set(1, .72, 1); }
  else if (type === 'na'){ body = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.15, 16), mat); }
  else if (type === 'ca'){ body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), mat); }
  else { body = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 14), mat);
    const sh = new THREE.Group(); sh.position.z = .58; sh.rotation.z = rad(armor == null ? 90 : armor);
    sh.add(new THREE.Mesh(new THREE.BoxGeometry(.42, 1.1, .1), std(0x1b2438))); g.add(sh); }
  g.add(body); g.userData.body = body; return g;
}
function lampModel(src, scale = 1){
  const g = new THREE.Group(), S = SOURCES[src];
  if (src === 'bulb'){
    const glass = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 14), std(0xfff1d6, {emissive:0xffb35c, emissiveIntensity:1.1, transparent:true, opacity:.92})); g.add(glass);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.28, .3, .45, 14), std(0x9aa3b2, {metalness:.7})); base.rotation.z = Math.PI/2; base.position.x = -.6; g.add(base);
  } else if (src === 'fluo'){
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, 1.6, 14), std(0xf4fbff, {emissive:0xdff1ff, emissiveIntensity:1.0})); g.add(tube);
    for (const s of [-1, 1]){ const cap = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .15, 14), std(0x9aa3b2, {metalness:.7})); cap.position.y = s*.85; g.add(cap); }
  } else {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(.25, .7, .7), std(0x2b3346, {metalness:.5})); chip.position.x = -.2; g.add(chip);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 10, 0, Math.PI*2, 0, Math.PI/2), std(0xf2f5ff, {emissive:0xc8dcff, emissiveIntensity:1.2, transparent:true, opacity:.95})); dome.rotation.z = -Math.PI/2; g.add(dome);
  }
  g.scale.setScalar(scale); g.userData.color = S.color; return g;
}
function part(type, o = {}){
  const g = new THREE.Group();
  if (type === 'medium'){
    const m = MEDIA[o.value];
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 2, 24), std(m.color, {emissive:m.color, emissiveIntensity:.35, transparent:true, opacity:.88, roughness:.15}));
    rod.rotation.z = Math.PI/2; g.add(rod); g.userData.rod = rod;
    for (const s of [-1, 1]){ const cap = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .1, 24), std(0xc8d2e0, {metalness:.8, roughness:.25})); cap.rotation.z = Math.PI/2; cap.position.x = s*1.02; g.add(cap); }
  } else if (type === 'pump'){
    for (let i = 0; i < o.value; i++){ const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.9, 12), std(0xfff3d6, {emissive:0xffe2a8, emissiveIntensity:.7 + o.value*.2})); lamp.rotation.z = Math.PI/2; lamp.position.y = (i - (o.value - 1)/2)*.2; g.add(lamp); }
  } else if (type === 'mirror' || type === 'rearMirror'){
    const rear = type === 'rearMirror';
    g.add(new THREE.Mesh(new THREE.BoxGeometry(.14, 1.4, 1.4), std(rear ? 0xd6dee8 : 0xb9d8f2, {metalness:.85, roughness:.12, transparent:!rear, opacity:rear ? 1 : .35 + (o.R || .9)*.5})));
    if (o.post !== false) g.add(post());
  } else if (type === 'convex' || type === 'concave'){
    const lens = new THREE.Mesh(lensGeo(type, o.f || 40), std(0xa8e6ff, {transparent:true, opacity:.55, roughness:.05, emissive:0x2a90c8, emissiveIntensity:.3, side:THREE.DoubleSide}));
    lens.rotation.z = Math.PI/2; g.add(lens);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.92, .05, 8, 40), std(0x8a99ad, {metalness:.7})); rim.rotation.y = Math.PI/2; g.add(rim);
    if (o.post !== false) g.add(post());
  } else if (type === 'pol'){
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, .06, 40), std(0x27324a, {transparent:true, opacity:.65})); disc.rotation.z = Math.PI/2; g.add(disc);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.82, .05, 8, 40), std(0x8a99ad, {metalness:.7})); rim.rotation.y = Math.PI/2; g.add(rim);
    const axis = new THREE.Group(); axis.rotation.x = rad(o.theta ?? 45);
    axis.add(new THREE.Mesh(new THREE.BoxGeometry(.1, 1.5, .1), std(0xffd166, {emissive:0xffb020, emissiveIntensity:.5}))); g.add(axis);
    if (o.post !== false) g.add(post());
  } else if (type === 'source'){
    g.add(lampModel(o.value, .9)); if (o.post !== false) g.add(post());
  } else if (type === 'laserkit'){
    const box = new THREE.Mesh(new THREE.BoxGeometry(2, .7, .7), std(0x2b3346, {metalness:.6})); g.add(box);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 2.1, 16), std(0x3fd0ff, {emissive:0x3fd0ff, emissiveIntensity:.6})); rod.rotation.z = Math.PI/2; rod.position.y = .4; g.add(rod);
  } else if (type === 'dummy'){
    const f = FOES[o.foe];
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(.55, .65, .3, 24), std(0x47566b, {metalness:.5})); ped.position.y = -BEAM_Y + .15; g.add(ped);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, BEAM_Y - .3, 8), std(0x8a99ad)); pole.position.y = -(BEAM_Y - .3)/2 - .3; g.add(pole);
    const body = foeBody(o.foe, o.armor, std(f.color, {emissive:f.color, emissiveIntensity:.1}));
    body.rotation.y = -Math.PI/2; g.add(body); g.userData.body = body.userData.body;
  }
  return g;
}
