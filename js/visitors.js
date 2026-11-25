// 访客统计。计数用 hits.sh，读数用 shields.io（读数不会增加计数）。
// 规则：有真实操作才计；每个浏览器每天最多计 1 次访问，一共只计 1 个访客；自动化浏览器不计。
// 打开一次 ?nocount=1 后，这个浏览器永久不计（?nocount=0 恢复）。
const HOST = 'felixovo06.github.io', ROOT = `${HOST}/algo-prune`;
const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
const put = (k, v) => { try { localStorage.setItem(k, v); return localStorage.getItem(k) === v; } catch { return false; } };
export const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function plan({ host, webdriver, nocount, lastDay, seen, day }) {
  if (host !== HOST || webdriver || nocount) return { visit: false, person: false };
  return { visit: lastDay !== day, person: !seen };
}
export function mount(el, { host = location.hostname, webdriver = navigator.webdriver, tag = 'v2' } = {}) {
  const K = n => `prune.${tag}.${n}`, slug = n => `${ROOT}/${tag}-${n}`;
  const p = new URLSearchParams(location.search).get('nocount'); if (p !== null) put(K('nocount'), p === '0' ? '' : '1');
  if (host !== HOST) { el.textContent = '访客统计只在线上启用'; return; }
  const link = n => `https://hits.sh/${slug(n)}/`;
  const draw = () => {
    el.replaceChildren();
    for (const [n, text] of [['people', '累计访客'], ['visits', '累计访问']]) {
      const a = document.createElement('a'); a.href = link(n); a.target = '_blank'; a.rel = 'noopener'; a.textContent = text;
      // 计过数的浏览器才读数，避免还没有人访问时显示读取失败
      if (get(K('seen'))) { const img = new Image(); img.alt = text; img.onload = () => a.replaceChildren(img); img.src = `https://img.shields.io/badge/dynamic/json?url=${encodeURIComponent(`https://hits.sh/api/urns/${slug(n)}`)}&query=%24.total&label=${encodeURIComponent(text)}&color=1d4ed8&cacheSeconds=300`; }
      el.append(a);
    }
    if (get(K('nocount'))) el.append('（本浏览器不计入）');
  };
  draw();
  const hit = n => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = `https://hits.sh/${slug(n)}.svg?d=${today()}`; });
  const todo = () => plan({ host, webdriver, nocount: get(K('nocount')), lastDay: get(K('day')), seen: get(K('seen')), day: today() });
  const EV = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  const on = async e => {
    if (!e.isTrusted || document.visibilityState !== 'visible') return;
    EV.forEach(n => removeEventListener(n, on));
    await count();
  };
  // 先写标记再计数：写不进本地存储（如无痕限制）就不计，免得每次刷新都加
  const count = async () => { const t = todo(), jobs = []; if (t.visit && put(K('day'), today())) jobs.push(hit('visits')); if (t.person && put(K('seen'), '1')) jobs.push(hit('people')); if (jobs.length) { await Promise.all(jobs); draw(); } return jobs.length; };
  const t = todo(); if (t.visit || t.person) EV.forEach(n => addEventListener(n, on, { passive: true }));
  return { count };
}
