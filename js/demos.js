import * as A from './algos.js';
const PRE = {
  knap22: ['knap', { w: '1,2,3', v: '6,10,12', C: '5' }], knap23: ['knap', { w: '2,3,1', v: '10,12,6', C: '5' }], knap21: ['knap', { w: '16,15,15', v: '45,25,25', C: '30' }], knapx: ['knap', { w: '2,3,4,5', v: '6,8,9,10', C: '8' }],
  huffman: ['huff', { f: 'A45 B13 C12 D16 E9 F5' }], huff2: ['huff', { f: 'A8 B3 C5 D20 E14' }],
  lcs21: ['lcs', { X: 'ABCDA', Y: 'BDCA' }], lcs21a: ['lcs', { X: 'BCADBCD', Y: 'ACBABDCD' }], lcsx: ['lcs', { X: 'ABCBDAB', Y: 'BDCABA' }],
  mom: ['mom', { a: '8,33,17,51,57,49,35,11,25,37,14,3,2,13,52,12,6,28,32,54,5,16,22,23,7' }], mom2: ['mom', { a: '12,3,45,7,28,19,33,5,41,8,26,14,50,2,37' }],
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = x => Number.isInteger(x) ? String(x) : x.toFixed(2).replace(/0$/, '');
const el = (t, c, html) => { const e = document.createElement(t); if (c) e.className = c; if (html !== undefined) e.innerHTML = html; return e; };
const btn = (t, f, c = '') => { const b = el('button', 'btn ' + c, t); b.type = 'button'; b.onclick = f; return b; };
const nums = s => { const a = s.split(/[,，\s]+/).filter(Boolean).map(Number); if (!a.length || a.some(x => !Number.isFinite(x) || x <= 0)) throw Error('请输入用逗号分隔的正数'); return a; };
let uid = 0;

/** 通用步进器：build(values) → {count, draw(i, stage, say)} */
function stepper(fields, init, build, note) {
  const root = el('div', 'demo'), form = el('div', 'in'), stage = el('div', 'scroll'), say = el('div', 'say'), fail = el('p', 'fail'), ctl = el('div', 'ctl'); fail.hidden = true; say.setAttribute('aria-live', 'polite');
  const inp = {}; let cur = 0, model, timer = 0, extra = {};
  for (const [k, label, wide] of fields) { const l = el('label', '', label), x = el('input'); x.id = `d${++uid}-${k}`; x.value = init[k]; if (wide) x.style.width = '24em'; l.append(x); form.append(l); inp[k] = x; x.onkeydown = e => { if (e.key === 'Enter') run(); }; }
  const stop = () => { clearInterval(timer); timer = 0; play.textContent = '自动'; };
  const show = () => { model.draw(cur, stage, say); prev.disabled = cur === 0; next.disabled = cur >= model.count - 1; pos.textContent = `${cur + 1} / ${model.count}`; };
  const run = () => { stop(); try { model = build(Object.fromEntries(Object.entries(inp).map(([k, x]) => [k, x.value])), extra); fail.hidden = true; cur = 0; show(); } catch (e) { fail.textContent = e.message; fail.hidden = false; } };
  const prev = btn('上一步', () => { stop(); cur--; show(); }), next = btn('下一步', () => { stop(); cur++; show(); }, 'pri');
  const play = btn('自动', () => { if (timer) return stop(); if (cur >= model.count - 1) cur = -1; play.textContent = '停'; timer = setInterval(() => { if (!root.isConnected || cur >= model.count - 1) return stop(); cur++; show(); }, 1100); });
  const pos = el('span', 'small soft num');
  form.append(btn('用这组数据', run)); ctl.append(prev, next, play, pos);
  root.append(form, fail, stage, say, ctl); if (note) root.append(el('p', 'small soft', note));
  root.rerun = x => { extra = x; run(); }; root.form = form;
  return root;
}

/* ── 背包树 ── */
export function treeSVG(w, v, C, marks, big) {
  const n = w.length, H = 74, top = 26, leafW = 50, W = leafW * (1 << n);
  const xy = x => { const d = x.length, span = W / (1 << d); let i = 0; for (const c of x) i = i * 2 + (c === '1' ? 0 : 1); return [span * (i + .5), top + d * H]; };
  let e = '', g = '';
  const rec = x => {
    const [a, b] = xy(x), m = marks[x] || 'idle', bd = A.bound(x, w, v, C), r = 20, tx = bd === null ? '×' : fmt(Math.round(bd * 100) / 100);
    if (x.length < n) for (const c of '10') {
      const y = x + c, [p, q] = xy(y), my = marks[y] || 'idle';
      e += `<line class="e ${my === 'idle' ? '' : my === 'cut' ? 'cut' : 'on'}" x1="${a}" y1="${b}" x2="${p}" y2="${q}"/><text class="lab" x="${(a + p) / 2 + (c === '1' ? -9 : 9)}" y="${(b + q) / 2 - 3}">${c}</text>`; rec(y);
    }
    g += `<g class="${m}"><circle cx="${a}" cy="${b}" r="${r}"/><text x="${a}" y="${b}"${tx.length > 4 ? ' style="font-size:11px"' : ''}>${tx}</text></g>`;
  };
  rec('');
  return `<svg class="tree${big ? ' big' : ''}" style="max-width:${Math.min(W * 1.5, 900)}px" viewBox="0 0 ${W} ${top * 2 + n * H}" role="img" aria-label="0-1 背包解空间树，结点内为价值上界">${e}${g}</svg>`;
}
const nm = x => x === '' ? '根' : x;
function knapModel(val, { algo = 'bt' }) {
  const w0 = nums(val.w), v0 = nums(val.v), C = Number(val.C);
  if (w0.length !== v0.length) throw Error('重量和价值的个数要一样');
  if (w0.length > 4) throw Error('演示最多 4 个物品，树再大就看不清了');
  if (!(C > 0)) throw Error('容量要是正数');
  const { w, v, idx } = A.sortItems(w0, v0), big = w.length > 3;
  const reordered = idx.some((x, i) => x !== i);
  const sol = x => { const r = Array(w.length).fill(0); [...x].forEach((c, i) => { r[idx[i]] = +c; }); return `(${r.join(',')})`; };
  const pre = reordered ? `已按单位价值重排，树的第 1…${w.length} 层依次是物品 ${idx.map(i => i + 1).join('、')}。` : '';
  const T = algo === 'bt' ? A.backtrackTrace(w, v, C) : A.bnbTrace(w, v, C);
  return { count: T.steps.length + 1, draw(i, stage, say) {
    const m = {}; let text = pre + (algo === 'bt' ? '回溯：深度优先，左孩子查超重，右孩子查上界。' : '分支限界：每次扩展上界最大的活结点。') + '结点里的数字是上界，× 表示超重。';
    T.steps.slice(0, i).forEach((s, k) => {
      const last = k === i - 1;
      if (algo === 'bt') {
        if (s.type === 'infeasible' || s.type === 'prune') m[s.x] = 'cut'; else { if (last) m[s.x] = 'cur'; else m[s.x] = 'on'; }
        if (s.type === 'leaf' && s.better) { for (const y in m) if (m[y] === 'best') m[y] = 'on'; m[s.x] = 'best'; }
        if (last) text = { expand: `扩展结点 ${nm(s.x)}。`, infeasible: `${s.x} 超重，约束函数剪掉。`, prune: `${s.x} 的上界 ${fmt(s.b ?? 0)} ≤ 当前最优 ${s.best}，限界函数剪掉。`, leaf: `到达叶子 ${s.x}，价值 ${s.cv}${s.better ? '，更新当前最优。' : '，没有更好。'}` }[s.type] + ` 当前最优 ${s.best}。` + (k === T.steps.length - 1 ? ` <b>结束：最优值 ${T.best}，最优解 ${sol(T.bestx)}。</b>` : '');
      } else {
        m[s.x] = s.type === 'done' ? 'best' : last ? 'cur' : 'on';
        for (const c of s.made) m[c.x] = c.ok ? 'on' : 'cut';
        if (last) text = s.type === 'done' ? `取出的 ${s.x} 是叶子，<b>结束：最优值 ${s.best}，最优解 ${sol(s.x)}。</b>` : `扩展 ${nm(s.x)}：${s.made.map(c => c.ok ? `${c.x}(${fmt(Math.round(c.b * 100) / 100)}) 入表` : `${c.x} ${c.why}，剪掉`).join('；')}。<br>活结点表：<span class="num">${s.queue.map(q => `${q.x}(${fmt(Math.round(q.b * 100) / 100)})`).join('，') || '空'}</span>`;
      }
    });
    stage.innerHTML = treeSVG(w, v, C, m, big); say.innerHTML = text;
  } };
}
function knap(init) {
  const root = stepper([['w', '重量'], ['v', '价值'], ['C', '容量']], init, knapModel, '左分支装（1），右分支不装（0）。');
  const sw = el('div', 'chips'); const opts = [['bt', '回溯法'], ['bnb', '优先队列式分支限界']];
  opts.forEach(([k, t], i) => { const b = el('button', 'chip', t); b.type = 'button'; b.setAttribute('aria-pressed', i === 0); b.onclick = () => { [...sw.children].forEach(x => x.setAttribute('aria-pressed', x === b)); root.rerun({ algo: k }); }; sw.append(b); });
  root.prepend(sw); root.rerun({ algo: 'bt' }); return root;
}

/* ── 哈夫曼 ── */
function huff(init) {
  const root = stepper([['f', '字符和频率，如 A45 B13', 1]], init, val => {
    const items = val.f.trim().split(/[\s,，]+/).map(s => { const m = s.match(/^(\D)[:：=]?(\d+(?:\.\d+)?)$/); if (!m || +m[2] <= 0) throw Error(`看不懂“${s}”，格式是一个字符加频率，如 A45`); return [m[1], +m[2]]; });
    if (items.length < 2 || items.length > 10) throw Error('请输入 2–10 个字符'); if (new Set(items.map(x => x[0])).size < items.length) throw Error('字符不能重复');
    const H = A.huffman(items);
    return { count: H.steps.length, draw(i, stage, say) {
      const s = H.steps[i], GAP = 54, LV = 62; let x = 0, e = '', g = '', deep = 0;
      const place = (t, d) => { deep = Math.max(deep, d); let cx; const y = 26 + d * LV;
        if (t.ch !== undefined) { cx = x + GAP / 2; x += GAP; } else { const a = place(t.l, d + 1), b = place(t.r, d + 1); cx = (a + b) / 2; for (const [p, c] of [[a, 0], [b, 1]]) e += `<line class="e on" x1="${cx}" y1="${y}" x2="${p}" y2="${y + LV}"/><text class="lab" x="${(cx + p) / 2 + (c ? 9 : -9)}" y="${y + LV / 2 - 4}">${c}</text>`; }
        g += t.ch !== undefined ? `<g><rect class="n" x="${cx - 22}" y="${y - 18}" width="44" height="36" rx="3"/><text x="${cx}" y="${y}">${esc(t.ch)} ${fmt(t.f)}</text></g>` : `<g class="${t === s.merged ? 'cur' : 'on'}"><circle cx="${cx}" cy="${y}" r="20"/><text x="${cx}" y="${y}">${fmt(t.f)}</text></g>`;
        return cx; };
      s.forest.forEach(t => { place(t, 0); x += 8; });
      stage.innerHTML = `<svg class="tree" style="max-width:${Math.max(460, x)}px" viewBox="0 0 ${Math.max(x, 300)} ${52 + deep * LV}" role="img" aria-label="哈夫曼森林">${e}${g}</svg>`;
      say.innerHTML = s.note + '。' + (i === H.steps.length - 1 ? `<br>编码：<span class="num">${Object.entries(H.codes).map(([c, k]) => `${esc(c)}=${k}`).join('，')}</span>。总代价 <b>${fmt(H.cost)}</b>。` : '');
    } };
  }, '小的放左（0），大的放右（1）。');
  root.rerun({}); return root;
}

/* ── LCS ── */
function lcs(init) {
  const root = stepper([['X', '序列 X'], ['Y', '序列 Y']], init, val => {
    const X = val.X.replace(/[\s,，]/g, ''), Y = val.Y.replace(/[\s,，]/g, ''); if (!X || !Y || X.length > 10 || Y.length > 10) throw Error('每个序列 1–10 个字符');
    const R = A.lcs(X, Y), m = X.length, n = Y.length, AR = { D: '↖', U: '↑', L: '←' };
    return { count: m * n + 2, draw(k, stage, say) {
      const done = k > m * n, ci = Math.ceil(k / n), cj = k ? (k - 1) % n + 1 : 0; const P = new Set(done ? R.path.map(String) : []);
      let t = `<table class="cells"><tr><th></th><th></th>${[...Y].map(c => `<th>${esc(c)}</th>`).join('')}</tr>`;
      for (let i = 0; i <= m; i++) { t += `<tr><th>${i ? esc(X[i - 1]) : ''}</th>`; for (let j = 0; j <= n; j++) { const on = !i || !j || (i - 1) * n + j <= k; t += `<td class="${!done && i === ci && j === cj ? 'cur' : P.has(i + ',' + j) ? 'path' : ''}">${on ? `<small>${AR[R.b[i][j]] || ''}</small>${R.c[i][j]}` : ''}</td>`; } t += '</tr>'; }
      stage.innerHTML = t + '</table>';
      say.innerHTML = !k ? '第 0 行和第 0 列都是 0，这是边界。' : done ? `从右下角沿箭头往回走，遇到 ↖ 记下字符。<b>LCS = ${esc(R.s) || '空'}，长度 ${R.len}。</b>` : X[ci - 1] === Y[cj - 1] ? `${esc(X[ci - 1])} = ${esc(Y[cj - 1])}：左上 ${R.c[ci - 1][cj - 1]} + 1 = ${R.c[ci][cj]}，画 ↖。` : `${esc(X[ci - 1])} ≠ ${esc(Y[cj - 1])}：上 ${R.c[ci - 1][cj]}，左 ${R.c[ci][cj - 1]}，取 ${R.c[ci][cj]}，画 ${AR[R.b[ci][cj]]}。`;
    } };
  }, '上、左相等时这里统一取上；取左也对，全表一致即可。');
  root.rerun({}); return root;
}

/* ── 中位数的中位数 ── */
function mom(init) {
  const root = stepper([['a', '数据（5 的倍数个）', 1]], init, val => {
    const a = nums(val.a); if (a.length % 5 || a.length > 50) throw Error(`现在是 ${a.length} 个，请输入 5 的倍数个（最多 50）`);
    const R = A.medianOfMedians(a), raw = R.groups.map((_, i) => a.slice(i * 5, i * 5 + 5));
    return { count: 4, draw(i, stage, say) {
      const G = i ? R.groups : raw; let t = '<table class="cells">';
      for (let r = 0; r < 5; r++) t += `<tr><th>${i > 1 && r === 2 ? '中' : ''}</th>` + G.map(g => `<td class="${i === 3 && r === 2 && g[2] === R.pivot ? 'cur' : i > 1 && r === 2 ? 'path' : ''}">${g[r]}</td>`).join('') + '</tr>';
      stage.innerHTML = t + '</table>';
      say.innerHTML = ['每 5 个一组，一列是一组。', '每组内部从小到大排序。', `取出各组中位数：<span class="num">${R.groups.map(g => g[2]).join('，')}</span>。`, `把中位数排序：<span class="num">${R.meds.join('，')}</span>，取中间的 <b>${R.pivot}</b> 作划分基准。`][i];
    } };
  });
  root.rerun({}); return root;
}
const KIND = { knap, huff, lcs, mom };
export const mountDemo = id => { const [k, init] = PRE[id]; return KIND[k](init); };

