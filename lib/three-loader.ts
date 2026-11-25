// 3D 실습이 쓰는 Three.js(r128). 피직스 캐슬이 저장소에 둔 파일(public/physics-castle/three.min.js)을 같이 쓴다:
// 새 라이브러리를 더하지 않고, 앱 첫 화면 · 미리 받기 목록에도 안 들어가며, 게임을 연 기기는 이미 받아 둔 사본을 쓴다.
// 실습을 처음 열 때만 <script>로 불러온다(인터넷 먼저 · 사본은 나중, sw.js의 castle).
// 전역 스크립트라 타입이 없다. 쓰는 쪽(OrbitalScene)에서만 다룬다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Three = any;
let loading: Promise<Three> | null = null;

export function loadThree(): Promise<Three> {
  const existing = (window as unknown as { THREE?: Three }).THREE;
  if (existing) return Promise.resolve(existing);
  loading ??= new Promise<Three>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('physics-castle/three.min.js', document.baseURI).href;
    script.async = true;
    script.onload = () => {
      const three = (window as unknown as { THREE?: Three }).THREE;
      if (three) resolve(three); else { loading = null; reject(new Error('THREE missing')); }
    };
    script.onerror = () => { loading = null; script.remove(); reject(new Error('three.min.js failed')); };
    document.head.appendChild(script);
  });
  return loading;
}
