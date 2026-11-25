// 纯算法：页面演示与 tests/ 共用，不碰 DOM。

/** 把物品按单位价值降序排好，返回排好后的数组和原编号 */
export function sortItems(w, v) {
  const idx = w.map((_, i) => i).sort((a, b) => v[b] / w[b] - v[a] / w[a] || a - b);
  return { w: idx.map(i => w[i]), v: idx.map(i => v[i]), idx };
}

export const state = (x, w, v) => {
  let cw = 0, cv = 0;
  for (let i = 0; i < x.length; i++) if (x[i] === '1') { cw += w[i]; cv += v[i]; }
  return { cw, cv };
};

/** 结点 x（形如 "10"）的价值上界；超重返回 null。要求 w、v 已按单位价值降序 */
export function bound(x, w, v, C) {
  let { cw, cv } = state(x, w, v);
  if (cw > C) return null;
  let left = C - cw, b = cv, i = x.length;
  while (i < w.length && w[i] <= left) { left -= w[i]; b += v[i]; i++; }
  if (i < w.length) b += v[i] * left / w[i];
  return b;
}

/** 回溯法搜索轨迹 */
export function backtrackTrace(w, v, C) {
  const n = w.length, steps = [];
  let best = 0, bestx = '0'.repeat(n);
  const go = x => {
    if (x.length === n) {
      const { cv } = state(x, w, v);
      const better = cv > best;
      if (better) { best = cv; bestx = x; }
      steps.push({ type: 'leaf', x, better, cv, best });
      return;
    }
    steps.push({ type: 'expand', x, best });
    const L = x + '1', R = x + '0';
    if (state(L, w, v).cw <= C) go(L); else steps.push({ type: 'infeasible', x: L, best });
    const b = bound(R, w, v, C);
    if (b > best) go(R); else steps.push({ type: 'prune', x: R, b, best });
  };
  go('');
  return { steps, best, bestx };
}

/** 优先队列式分支限界轨迹：装入时即更新 best；上界 < best 的右孩子剪掉；取出叶子即结束 */
export function bnbTrace(w, v, C) {
  const n = w.length, steps = [];
  let best = 0, seq = 0;
  const q = [{ x: '', b: bound('', w, v, C), seq: seq++ }];
  const sorted = () => [...q].sort((a, b) => b.b - a.b || a.seq - b.seq);
  while (q.length) {
    const cur = sorted()[0];
    q.splice(q.indexOf(cur), 1);
    if (cur.x.length === n) {
      best = state(cur.x, w, v).cv;
      steps.push({ type: 'done', x: cur.x, best, queue: sorted(), made: [] });
      return { steps, best, bestx: cur.x };
    }
    const made = [];
    const L = cur.x + '1', R = cur.x + '0';
    const s = state(L, w, v);
    if (s.cw <= C) {
      best = Math.max(best, s.cv);
      const b = bound(L, w, v, C);
      q.push({ x: L, b, seq: seq++ }); made.push({ x: L, b, ok: true });
    } else made.push({ x: L, b: null, ok: false, why: '超重' });
    const b = bound(R, w, v, C);
    if (b >= best) { q.push({ x: R, b, seq: seq++ }); made.push({ x: R, b, ok: true }); }
    else made.push({ x: R, b, ok: false, why: '上界不够' });
    steps.push({ type: 'expand', x: cur.x, best, queue: sorted(), made });
  }
  return { steps, best, bestx: '' };
}

/** 哈夫曼：返回每一步的森林和最终编码。小的放左边（0） */
export function huffman(items) {
  let seq = 0;
  let forest = items.map(([ch, f]) => ({ ch, f, seq: seq++ }));
  const steps = [{ forest: [...forest], note: '初始：每个字符是一棵单结点树' }];
  while (forest.length > 1) {
    forest.sort((a, b) => a.f - b.f || a.seq - b.seq);
    const [l, r] = forest;
    const p = { f: l.f + r.f, l, r, seq: seq++ };
    forest = [p, ...forest.slice(2)];
    steps.push({ forest: [...forest].sort((a, b) => a.f - b.f || a.seq - b.seq), merged: p, note: `取最小的 ${l.f} 和 ${r.f}，合并成 ${p.f}` });
  }
  const codes = {};
  const walk = (t, c) => { if (!t) return; if (t.ch !== undefined) codes[t.ch] = c || '0'; else { walk(t.l, c + '0'); walk(t.r, c + '1'); } };
  walk(forest[0], '');
  const cost = items.reduce((s, [ch, f]) => s + f * codes[ch].length, 0);
  return { steps, codes, root: forest[0], cost };
}

/** LCS：c 为长度表，b 为方向（D=左上 U=上 L=左），平局取上 */
export function lcs(X, Y) {
  const m = X.length, n = Y.length;
  const c = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const b = Array.from({ length: m + 1 }, () => Array(n + 1).fill(''));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (X[i - 1] === Y[j - 1]) { c[i][j] = c[i - 1][j - 1] + 1; b[i][j] = 'D'; }
    else if (c[i - 1][j] >= c[i][j - 1]) { c[i][j] = c[i - 1][j]; b[i][j] = 'U'; }
    else { c[i][j] = c[i][j - 1]; b[i][j] = 'L'; }
  }
  const path = []; let i = m, j = n, s = '';
  while (i && j) {
    path.push([i, j]);
    if (b[i][j] === 'D') { s = X[i - 1] + s; i--; j--; } else if (b[i][j] === 'U') i--; else j--;
  }
  return { c, b, path, s, len: c[m][n] };
}

/** 线性时间选择的划分基准：5 个一组取中位数，再取中位数的中位数 */
export function medianOfMedians(a) {
  const groups = [];
  for (let i = 0; i + 5 <= a.length; i += 5) groups.push(a.slice(i, i + 5).sort((x, y) => x - y));
  const meds = groups.map(g => g[2]).sort((x, y) => x - y);
  return { groups, meds, pivot: meds[Math.floor((meds.length - 1) / 2)] };
}

export function gridMax(g) {
  const n = g.length, m = g[0].length, d = g.map(r => r.slice());
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (!i && !j) continue;
    d[i][j] += Math.max(i ? d[i - 1][j] : -Infinity, j ? d[i][j - 1] : -Infinity);
  }
  return { d, best: d[n - 1][m - 1] };
}

/** dist[i] 为第 i-1 站到第 i 站距离（dist[0] 占位）；无解返回 -1 */
export function gas(n, dist) {
  let rest = n, cnt = 0;
  for (let i = 1; i < dist.length; i++) {
    if (dist[i] > n) return -1;
    if (rest < dist[i]) { cnt++; rest = n; }
    rest -= dist[i];
  }
  return cnt;
}

export function matrixChain(p) {
  const n = p.length - 1;
  const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let r = 2; r <= n; r++) for (let i = 1; i + r - 1 <= n; i++) {
    const j = i + r - 1; m[i][j] = Infinity;
    for (let k = i; k < j; k++) {
      const t = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
      if (t < m[i][j]) { m[i][j] = t; s[i][j] = k; }
    }
  }
  return { m, s, best: m[1][n] };
}

export function activities(list) {
  const a = [...list].sort((x, y) => x[1] - y[1]); const out = []; let end = -Infinity;
  for (const t of a) if (t[0] >= end) { out.push(t); end = t[1]; }
  return out;
}

export function dijkstra(n, edges, src) {
  const d = Array(n + 1).fill(Infinity), done = Array(n + 1).fill(false), order = []; d[src] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1; for (let i = 1; i <= n; i++) if (!done[i] && (u < 0 || d[i] < d[u])) u = i;
    if (d[u] === Infinity) break;
    done[u] = true; order.push(u);
    for (const [a, b, w] of edges) if (a === u && d[u] + w < d[b]) d[b] = d[u] + w;
  }
  return { d, order };
}
