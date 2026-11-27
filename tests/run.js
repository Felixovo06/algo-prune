import { Q, CORE, SETS } from '../js/data/questions.js';
import { TOPICS } from '../js/data/topics.js';
import * as A from '../js/algos.js';
import { plan, today } from '../js/visitors.js';
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
// 数据完整性
const ids = new Set(), tids = new Set(TOPICS.map(t => t.id)), sids = new Set(SETS.map(s => s.id));
for (const q of Q) {
  ok(!q.err && !q.doubt, 'err ' + q.id); ok(!q.same || Q.some(x => x.id === q.same && !x.same), 'same ' + q.id); ok(!/原答案|更正|存疑|原卷|有争议|参考解答/.test(JSON.stringify(q)), 'wording ' + q.id); ok(!ids.has(q.id), 'dup ' + q.id); ids.add(q.id); ok(sids.has(q.set), 'set ' + q.id); ok(q.t.length && q.t.every(t => tids.has(t)), 'topic ' + q.id);
  if (q.type === 'choice') ok(q.opts.length === 4 && q.a >= 0 && q.a < 4, 'choice ' + q.id);
  if (q.type === 'fill') ok((q.q.match(/___/g) || []).length === q.a.length, 'blank ' + q.id);
  if (q.type === 'open') ok(typeof q.a === 'string', 'open ' + q.id);
  for (const h of [q.q, q.type === 'open' ? q.a : '', q.ex || '']) for (const tag of ['p', 'b', 'mark', 'pre', 'code', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'div'])
    ok((h.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length === (h.match(new RegExp(`</${tag}>`, 'g')) || []).length, `tag ${tag} ${q.id}`);
}
for (const t of TOPICS) { ok(t.eg.every(e => ids.has(e) && CORE.some(q => q.id === e)), 'eg ' + t.id); ok(Q.some(q => q.t.includes(t.id)), 'empty ' + t.id);
  for (const [, h] of t.steps) for (const tag of ['p', 'b', 'mark', 'pre', 'code', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'div']) ok((h.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length === (h.match(new RegExp(`</${tag}>`, 'g')) || []).length, `tag ${tag} ${t.id}`); }
// 背包：与暴力对比
const brute = (w, v, C) => { let m = 0; for (let k = 0; k < 1 << w.length; k++) { let a = 0, b = 0; w.forEach((x, i) => { if (k >> i & 1) { a += x; b += v[i]; } }); if (a <= C) m = Math.max(m, b); } return m; };
const R = k => 1 + Math.floor(Math.random() * k);
for (let z = 0; z < 500; z++) { const k = R(6), w = Array.from({ length: k }, () => R(12)), v = Array.from({ length: k }, () => R(20)), C = R(30); const s = A.sortItems(w, v), B = brute(w, v, C); eq(A.backtrackTrace(s.w, s.v, C).best, B, 'bt'); eq(A.bnbTrace(s.w, s.v, C).best, B, 'bnb'); }
const b = (x, w, v, C) => { const r = A.bound(x, w, v, C); return r === null ? null : Math.round(r * 100) / 100; };
eq(['', '1', '0', '11', '10', '01', '00'].map(x => b(x, [1, 2, 3], [6, 10, 12], 5)), [24, 24, 22, 24, 18, 22, 12], 's22');
eq(['111', '110', '101', '100', '011', '010', '001', '000'].map(x => b(x, [1, 2, 3], [6, 10, 12], 5)), [null, 16, 18, 6, 22, 10, 12, 0], 's22 leaf');
eq(['', '1', '0', '11', '10', '01', '00', '101', '100', '011'].map(x => b(x, [16, 15, 15], [45, 25, 25], 30)), [68.33, 68.33, 50, null, 68.33, 50, 25, null, 45, 50], 's21');
eq(A.bnbTrace([1, 2, 3], [6, 10, 12], 5).steps.map(s => s.x + ':' + s.queue.map(q => `${q.x}(${q.b})`).join(',')), [':1(24),0(22)', '1:11(24),0(22),10(18)', '11:0(22),10(18),110(16)', '0:01(22),10(18),110(16)', '01:011(22),10(18),110(16)', '011:10(18),110(16)'], 'live table');
eq(A.backtrackTrace([1, 2, 3], [6, 10, 12], 5).steps.filter(s => s.type === 'expand').map(s => s.x), ['', '1', '11', '10', '0', '01'], 'bt order');
eq(b('011', [2, 2, 3, 3, 5], [10, 8, 9, 6, 5], 12), 27, 's23-c8'); eq(b('10', [3, 5, 4, 3], [12, 15, 8, 3], 10), 23, 'ex-21');
eq([b('', [2, 3, 4, 5], [6, 8, 9, 10], 8), brute([2, 3, 4, 5], [6, 8, 9, 10], 8)], [20.75, 18], 'ex-20');
eq(brute([2, 3, 1], [10, 12, 6], 5), 22, 's23-z3'); eq(brute([35, 30, 60, 50, 40, 10, 25], [10, 40, 30, 50, 35, 40, 30], 150), 170, 'sa-z1');
const sa = A.sortItems([35, 30, 60, 50, 40, 10, 25], [10, 40, 30, 50, 35, 40, 30]); eq(A.bound('', sa.w, sa.v, 150), 190.625, 'sa bound');
// 其他
const h = A.huffman([['A', 45], ['B', 13], ['C', 12], ['D', 16], ['E', 9], ['F', 5]]); eq(h.codes, { A: '0', C: '100', B: '101', F: '1100', E: '1101', D: '111' }, 'huff'); eq(h.cost, 224, 'huff cost');
const h2 = A.huffman([['A', 8], ['B', 3], ['C', 5], ['D', 20], ['E', 14]]); eq([h2.cost, ...'ABCDE'].map((c, i) => i ? h2.codes[c].length : c), [104, 3, 4, 4, 1, 2], 'huff2');
eq(A.lcs('ABCDA', 'BDCA').c.slice(1).map(r => r.slice(1)), [[0, 0, 0, 1], [1, 1, 1, 1], [1, 1, 2, 2], [1, 2, 2, 2], [1, 2, 2, 3]], 'lcs table'); eq(A.lcs('ABCBDAB', 'BDCABA').len, 4, 'ex-10'); eq(A.lcs('BCADBCD', 'ACBABDCD').len, 5, 's21-6');
const sub = (s, X) => { let i = 0; for (const c of X) if (c === s[i]) i++; return i === s.length; };
for (const s of Q.find(q => q.id === 's21-6').a[0]) ok(s.length === 5 && sub(s, 'BCADBCD') && sub(s, 'ACBABDCD'), 'lcs ans ' + s);
eq(A.medianOfMedians([8, 33, 17, 51, 57, 49, 35, 11, 25, 37, 14, 3, 2, 13, 52, 12, 6, 28, 32, 54, 5, 16, 22, 23, 7]).pivot, 28, 'mom'); eq(A.medianOfMedians([12, 3, 45, 7, 28, 19, 33, 5, 41, 8, 26, 14, 50, 2, 37]).pivot, 19, 'mom2');
eq(A.gridMax([[1, 3, 1], [1, 5, 1], [4, 2, 1]]).d, [[1, 4, 5], [2, 9, 10], [6, 11, 12]], 'grid'); eq(A.gas(7, [0, 1, 2, 3, 4, 5, 1, 6, 6]), 4, 'gas'); eq(A.gas(3, [0, 1, 4]), -1, 'gas none');
const mc = A.matrixChain([10, 100, 5, 50]); eq([mc.best, mc.s[1][3]], [7500, 2], 'chain');
eq(A.activities([[1, 4], [3, 5], [0, 6], [5, 7], [3, 8], [5, 9], [6, 10], [8, 11], [8, 12], [2, 13], [12, 14]]), [[1, 4], [5, 7], [8, 11], [12, 14]], 'act');
eq(A.dijkstra(5, [[1, 2, 10], [1, 4, 30], [1, 5, 100], [2, 3, 50], [3, 5, 10], [4, 3, 20], [4, 5, 60]], 1), { d: [null, 0, 10, 50, 30, 60], order: [1, 2, 4, 3, 5] }, 'dij');
// 单纯形终表：检查各行是原方程组的推论（代入随机非基变量）
for (let z = 0; z < 50; z++) { const x1 = Math.random(), x4 = Math.random(), x5 = Math.random(); const x2 = 4 - .4 * x1 - .1 * x4 - .8 * x5, x3 = 5 - .2 * x1 - .3 * x4 - .4 * x5, x6 = 11 - x1 + .5 * x4 - 10 * x5; const z0 = 11 - .2 * x1 - .8 * x4 - 2.4 * x5;
  for (const [l, r] of [[x1 + 3 * x2 - x3 + 2 * x5, 7], [x4 - 2 * x2 + 4 * x3, 12], [x6 - 4 * x2 + 3 * x3 + 8 * x5, 10], [-x2 + 3 * x3 - 2 * x5, z0]]) ok(Math.abs(l - r) < 1e-9, 'simplex'); }
// 访客计数规则
const V = { host: 'felixovo06.github.io', webdriver: false, nocount: '', lastDay: null, seen: null, day: '2026-11-25' };
eq(plan(V), { visit: true, person: true }, 'first visit'); eq(plan({ ...V, lastDay: '2026-11-25', seen: '1' }), { visit: false, person: false }, 'same day'); eq(plan({ ...V, lastDay: '2026-11-24', seen: '1' }), { visit: true, person: false }, 'next day');
for (const x of [{ host: 'localhost' }, { webdriver: true }, { nocount: '1' }]) eq(plan({ ...V, ...x }), { visit: false, person: false }, 'skip');
eq(today(new Date(2026, 0, 5)), '2026-01-05', 'today');
// 解析与验收卷
const plain = h => h.replace(/<[^>]+>/g, '').trim();
for (const q of Q) { ok(plain(q.ex || '').length >= 6, 'no ex ' + q.id); ok(!/原答案|原题|更正|存疑|纠错/.test(q.ex || ''), 'ex wording ' + q.id); }
const { EXAMS, EXAM_Q } = await import('../js/data/exams.js');
for (const e of EXAMS) {
  const qs = Q.filter(q => q.set === e.id), sum = k => qs.filter(q => q.no.startsWith(k)).reduce((a, q) => a + q.pts, 0);
  eq([sum('填空'), sum('选择'), sum('简答'), sum('综合'), qs.reduce((a, q) => a + q.pts, 0)], [20, 20, 15, 45, 100], 'exam pts ' + e.id);
  ok(qs.every(q => q.pts > 0 && !CORE.includes(q)), 'exam pool ' + e.id);
  ok(qs.filter(q => q.no.startsWith('综合')).some(q => q.t.includes('knapsack')), 'exam knapsack ' + e.id);
}
eq(EXAM_Q.length, Q.filter(q => q.set.startsWith('v')).length, 'exam q');
const bnd = (x, w, v, C) => { const r = A.bound(x, w, v, C); return r === null ? null : Math.round(r * 100) / 100; };
const pick = id => { const q = Q.find(x => x.id === id); return q.type === 'choice' ? q.opts[q.a] : q.a; };
eq(pick('v1-c5'), String(bnd('1', [4, 5, 3], [12, 10, 6], 10)), 'v1-c5');
eq(pick('v2-c7'), String(bnd('10', [3, 5, 4, 3], [18, 20, 14, 9], 12)), 'v2-c7');
eq(pick('v2-c4'), '11', 'v2-c4'); eq(pick('v3-c4'), String((a => { let s = 0, b = 0; for (const x of a) { b = b > 0 ? b + x : x; s = Math.max(s, b); } return s; })([-2, 11, -4, 13, -5, -2])), 'v3-c4');
for (const s of ['BDA', 'BCA']) ok(s.length === A.lcs('BADCBA', 'ABCDA').len && sub(s, 'BADCBA') && sub(s, 'ABCDA'), 'v2 lcs ' + s);
for (const [w, v, C] of [[[2, 3, 4], [6, 12, 10], 6], [[5, 3, 4], [20, 9, 14], 8], [[4, 2, 3], [16, 10, 9], 6]]) { const s2 = A.sortItems(w, v); eq(A.backtrackTrace(s2.w, s2.v, C).best, brute(w, v, C), 'exam knap'); eq(A.bnbTrace(s2.w, s2.v, C).best, brute(w, v, C), 'exam bnb'); }
eq(A.huffman([['a', 32], ['b', 9], ['c', 7], ['d', 21], ['e', 13], ['f', 18]]).cost, 16 + 29 + 39 + 61 + 100, 'v1 huff');
{ const p = [10, 20, 5, 15, 30], f = (a, b) => a === b ? 0 : Math.min(...Array.from({ length: b - a }, (_, t) => f(a, a + t) + f(a + t + 1, b) + p[a - 1] * p[a + t] * p[b])); eq(A.matrixChain(p).best, f(1, 4), 'v3 chain'); }
eq(A.dijkstra(5, [[1, 2, 4], [1, 3, 9], [1, 5, 15], [2, 3, 3], [2, 4, 8], [3, 4, 2], [3, 5, 10], [4, 5, 3]], 1).d.slice(2), [4, 7, 9, 12], 'v3 dij');
console.log(`${n} checks, ${bad} failed; 题 ${Q.length}（去重 ${CORE.length}），知识点 ${TOPICS.length}`);
console.log(`验收卷 ${EXAMS.length} 套 ${EXAM_Q.length} 题`);
process.exit(bad ? 1 : 0);
