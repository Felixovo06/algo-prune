// 知识点的颜色和图形、通用图标。图形画的是算法本身的结构。
export const COLOR = { knapsack: '#1f4fd8', huffman: '#0f766e', divide: '#b4402a', bnb: '#4338a8', backtrack: '#9a2f5f', dp: '#0b6b8f', lcs: '#2f6b2f', dpcase: '#155e75', divcase: '#a34a12', search: '#7a2e8a', greedy: '#1b7a4b', complexity: '#2a6f97', select: '#8a5a00', graph: '#0e5aa7', basics: '#5b6b1f', open: '#a8323e', randnp: '#5b3fa0', lp: '#3f6212' };
const L = (x1, y1, x2, y2, c = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${c}/>`, C = (x, y, r = 4, f = 1) => `<circle cx="${x}" cy="${y}" r="${r}" ${f ? 'fill="currentColor" stroke="none"' : ''}/>`, B = (x, y, w, h, f = 0, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" ${f ? `fill="currentColor" stroke="none" opacity="${o}"` : ''}/>`;
const dim = 'opacity=".45"', dash = 'stroke-dasharray="3 4" opacity=".55"';
const tree = (cut = []) => { let s = ''; const xy = { r: [60, 10], a: [32, 34], b: [88, 34], c: [18, 62], d: [46, 62], e: [74, 62], f: [102, 62] }; for (const [p, q] of ['ra', 'rb', 'ac', 'ad', 'be', 'bf'].map(x => [...x])) s += L(...xy[p], ...xy[q], cut.includes(q) ? dash : ''); for (const k in xy) s += cut.includes(k) ? `<g opacity=".55">${L(xy[k][0] - 4, xy[k][1] - 4, xy[k][0] + 4, xy[k][1] + 4)}${L(xy[k][0] + 4, xy[k][1] - 4, xy[k][0] - 4, xy[k][1] + 4)}</g>` : C(...xy[k], 5); return s; };
const G = {
  knapsack: () => `<path d="M34 14v54h52V14"/>` + B(39, 50, 42, 14, 1) + B(39, 34, 24, 12, 1, .75) + B(66, 34, 15, 12, 1, .5) + `<rect x="46" y="6" width="28" height="14" rx="1.5" stroke-dasharray="3 3"/>`,
  huffman: () => L(60, 10, 34, 28) + L(60, 10, 86, 28) + L(86, 28, 70, 48) + L(86, 28, 102, 48) + L(70, 48, 58, 68) + L(70, 48, 82, 68) + B(27, 23, 14, 11, 1) + C(60, 10, 5) + C(86, 28, 5) + C(70, 48, 5) + B(95, 43, 14, 11, 1) + B(51, 63, 14, 11, 1) + B(75, 63, 14, 11, 1),
  divide: () => B(20, 8, 80, 14) + B(20, 33, 36, 14) + B(64, 33, 36, 14) + [20, 42, 64, 86].map(x => B(x, 58, 14, 14, 1, .8)).join('') + L(60, 22, 38, 33, dim) + L(60, 22, 82, 33, dim) + L(38, 47, 27, 58, dim) + L(38, 47, 49, 58, dim) + L(82, 47, 71, 58, dim) + L(82, 47, 93, 58, dim),
  bnb: () => tree(['d', 'f']), backtrack: () => L(60, 10, 32, 34) + L(32, 34, 18, 62) + L(32, 34, 46, 62, dash) + L(60, 10, 88, 34, dash) + C(60, 10, 5) + C(32, 34, 5) + C(18, 62, 5) + `<path d="M30 66c18 6 34-8 22-28" /><path d="m46 42 6-5 4 7"/>` + C(88, 34, 4, 0),
  dp: () => { let s = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) s += i + j < 6 ? B(19 + j * 14, 11 + i * 15, 12, 13, 1, .35 + (i + j) * .11) : B(19 + j * 14, 11 + i * 15, 12, 13); return s; },
  lcs: () => [0, 1, 2, 3, 4].map(i => C(20 + i * 20, 22, 5) + C(20 + i * 20, 58, 5)).join('') + L(20, 22, 40, 58) + L(60, 22, 60, 58) + L(80, 22, 100, 58),
  dpcase: () => [14, 22, 18, 34, 46, 40, 58].map((h, i) => B(16 + i * 13, 70 - h, 10, h, 1, .4 + i * .08)).join('') + `<path d="M21 52 47 46 60 32 73 20 99 8"/>`,
  divcase: () => { let s = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += B(30 + j * 15, 10 + i * 15, 14, 14); return s + B(45, 25, 14, 14, 1) + B(60, 25, 14, 14, 1) + B(60, 40, 14, 14, 1) + B(30, 10, 14, 14, 1, .5); },
  search: () => { let s = ''; const q = [1, 3, 0, 2]; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += B(30 + j * 15, 10 + i * 15, 14, 14, (i + j) % 2, .2) + (q[i] === j ? C(37 + j * 15, 17 + i * 15, 4.5) : ''); return s + B(30, 10, 59, 59); },
  greedy: () => [[14, 34, 1], [26, 60, 0], [40, 62, 1], [52, 90, 0], [68, 88, 1], [92, 108, 1]].map(([a, b, on], i) => B(a, 8 + i * 11, b - a, 7, 1, on ? 1 : .3)).join(''),
  complexity: () => `<path d="M18 6v64h90"/><path d="M18 66c30-2 60-4 88-6" opacity=".5"/><path d="M18 68 104 34" opacity=".75"/><path d="M18 68c34-4 54-20 64-60"/>`,
  select: () => [0, 1, 2, 3, 4].map(c => [0, 1, 2, 3, 4].map(r => C(24 + c * 18, 10 + r * 15, r === 2 ? 5 : 3.2)).join('')).join('') + B(14, 32, 92, 16),
  graph: () => { const n = [[22, 40], [50, 14], [54, 66], [84, 26], [100, 60]]; return [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]].map(([a, b], i) => L(...n[a], ...n[b], [1, 3, 5].includes(i) ? 'stroke-width="3.4"' : dim)).join('') + n.map(p => C(...p, 6)).join(''); },
  basics: () => B(10, 28, 24, 24) + B(48, 28, 24, 24, 1) + B(86, 28, 24, 24) + L(34, 40, 47, 40) + L(72, 40, 85, 40) + `<path d="m43 36 5 4-5 4M81 36l5 4-5 4"/>`,
  open: () => `<path d="M16 12h88v42H56L42 68V54H16z"/>` + L(28, 26, 92, 26) + L(28, 38, 72, 38),
  randnp: () => `<path d="M30 8h60v62H30z"/><path d="M30 8a60 62 0 0 1 60 62" />` + [[40, 60], [52, 48], [44, 30], [66, 60], [58, 34], [76, 52], [82, 18], [72, 22]].map(([x, y], i) => C(x, y, 2.8, i < 6)).join(''),
  lp: () => `<path d="M18 6v64h90"/><path d="M18 24 52 18 84 40 90 70H18z" fill="currentColor" fill-opacity=".28"/>` + L(54, 6, 112, 46, dash) + C(84, 40, 5),
};
export const glyph = (id, cls = 'glyph') => `<svg class="${cls}" viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(G[id] || G.basics)()}</svg>`;

const I = {
  learn: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 21H20v-3"/>',
  topics: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z"/><circle cx="16.5" cy="16.5" r="3.5"/>',
  sets: '<path d="M7 3h10l3 3v15H4V3z"/><path d="M8 10h8M8 14h8M8 18h5"/>',
  feed: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  wrong: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8z"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M8.5 15a6 6 0 1 1 7 0c-.6.5-.9 1.2-1 2h-5c-.1-.8-.4-1.5-1-2z"/>',
  shuffle: '<path d="M3 7h3c5 0 6 10 11 10h4M3 17h3c1.700 0 2.900-1.200 4-2.800M14 9.800C15 8.200 16 7 18 7h3"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  auto: '<path d="M5 5v14l8-7zM17 5v14"/>', up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>', right: '<path d="m9 6 6 6-6 6"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>', cross: '<path d="M6 6l12 12M18 6 6 18"/>', theme: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>', copy: '<path d="M9 9h11v11H9z"/><path d="M5 15H4V4h11v1"/>',
};
export const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
export const ring = (p, size = 120, label = '') => { const r = 52, c = 2 * Math.PI * r, a = p.all ? p.ok / p.all : 0, d = p.all ? p.done / p.all : 0; return `<svg class="ring" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="已会 ${p.ok} 题，做过 ${p.done} 题，共 ${p.all} 题"><circle cx="60" cy="60" r="${r}" class="r0"/><circle cx="60" cy="60" r="${r}" class="r1" stroke-dasharray="${c * d} ${c}"/><circle cx="60" cy="60" r="${r}" class="r2" stroke-dasharray="${c * a} ${c}"/><text x="60" y="${label ? 58 : 62}" class="rt">${Math.round(a * 100)}%</text>${label ? `<text x="60" y="80" class="rl">${label}</text>` : ''}</svg>`; };
/** 小范围的庆祝效果 */
export function burst(x, y) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'burst'; box.style.left = x + 'px'; box.style.top = y + 'px';
  const cs = ['#ffcf40', '#5fe0a2', '#86aeff', '#ff8f85', '#fff'];
  for (let i = 0; i < 16; i++) { const s = document.createElement('i'), a = Math.PI * 2 * i / 16 + Math.random() * .4, d = 40 + Math.random() * 56; s.style.cssText = `--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px;background:${cs[i % 5]};--r:${Math.random() * 540}deg`; box.append(s); }
  document.body.append(box); setTimeout(() => box.remove(), 900);
}
