// 访客统计：hits.sh 图片计数，无脚本、无 Cookie。PV 每次打开计一次；UV 每个浏览器只计一次。
const BASE = 'https://hits.sh/felixovo06.github.io/algo-prune';
export function mount(el) {
  if (!/\.github\.io$/.test(location.hostname)) { el.textContent = '访客统计只在线上启用'; return; }
  const a = document.createElement('a');
  a.href = `${BASE}/pv/`; a.target = '_blank'; a.rel = 'noopener'; a.title = '查看周、月、累计访问';
  const img = new Image(); img.alt = '今日访问 / 累计访问';
  img.onerror = () => { a.textContent = '访问统计'; };
  img.src = `${BASE}/pv.svg?view=today-total&style=flat-square&label=${encodeURIComponent('今日 / 累计访问')}&color=1d4ed8`;
  a.append(img);
  const u = document.createElement('a'); u.href = `${BASE}/uv/`; u.target = '_blank'; u.rel = 'noopener'; u.textContent = '独立访客';
  el.append(a, u);
  try { if (!localStorage.getItem('prune.uv')) { new Image().src = `${BASE}/uv.svg`; localStorage.setItem('prune.uv', '1'); } } catch { /* 忽略 */ }
}
