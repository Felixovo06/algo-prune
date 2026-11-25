import * as store from './store.js';
import { SETS } from './data/questions.js';
import { TOPICS } from './data/topics.js';
import { mountDemo } from './demos.js';

export const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
const setName = Object.fromEntries(SETS.map(s => [s.id, s.name]));
const topicName = Object.fromEntries(TOPICS.map(t => [t.id, t.name]));
const KIND = { choice: '选择', fill: '填空', open: '解答' };
const ST = { ok: '已会', mid: '模糊', no: '不会' };
let uid = 0;

const norm = s => s.normalize('NFKC').toLowerCase().replace(/[\s,，、。.;；:：()（）"'“”·]/g, '').replace(/的$/, '');
export function checkFill(q, vals) {
  const acc = q.a.map(list => list.map(norm)), v = vals.map(norm);
  if (!q.any) return v.map((x, i) => acc[i].includes(x));
  const used = new Set();
  return v.map(x => { const i = acc.findIndex((l, k) => !used.has(k) && l.includes(x)); if (i < 0) return false; used.add(i); return true; });
}

/** mode: instant 即时反馈 | exam 交卷后统一显示。返回元素，带 reveal()/result() */
export function renderQ(q, { mode = 'instant', compact = false, index = 0, onDone } = {}) {
  const el = h('section', 'q' + (compact ? ' compact' : '')); const id = 'q' + (++uid);
  let picked = -1, inputs = [], revealed = false, result = null;
  const head = h('div', 'q-h');
  head.append(h('span', '', `${index ? `<b class="num">${index}</b>　` : ''}${setName[q.set]}${q.no === '补充' ? '' : ' ' + q.no}`), ...(q.no.includes(q.kind || KIND[q.type]) ? [] : [h('span', 'kind', q.kind || KIND[q.type])]));
  if (q.pts) head.append(h('span', '', `${q.pts} 分`));
  for (const t of q.t) { const a = h('a', '', topicName[t]); a.href = `#/learn/${t}`; head.append(a); }
  const st = h('span'); const paint = () => { const s = store.status(q.id); st.className = s ? 'st-' + s : ''; st.textContent = s ? ST[s] : ''; };
  paint(); head.append(st);
  const star = h('button', 'star'); star.type = 'button';
  const ps = () => { const on = store.starred(q.id); star.setAttribute('aria-pressed', on); star.textContent = on ? '★ 已收藏' : '☆ 收藏'; };
  star.onclick = () => { store.toggleStar(q.id); ps(); }; ps(); head.append(star);
  const body = h('div', 'q-b rich'); let k = 0;
  body.innerHTML = q.type === 'fill' ? q.q.replace(/___/g, () => `<input class="blank" id="${id}-${k}" autocomplete="off" autocapitalize="off" aria-label="第 ${++k} 空">`) : q.q;
  el.append(head, body);

  const mark = s => { store.setStatus(q.id, s); paint(); result = s; onDone?.(s); };
  const go = h('button', 'btn pri', q.type === 'open' ? '看答案' : '核对'); go.type = 'button';

  if (q.type === 'choice') {
    const box = h('div', 'opts');
    q.opts.forEach((o, i) => {
      const b = h('button', 'opt', `<span class="k">${'ABCD'[i]}</span><span></span>`); b.type = 'button'; b.children[1].textContent = o;
      b.onclick = () => { if (revealed) return; picked = i; [...box.children].forEach((x, j) => x.classList.toggle('sel', j === i)); if (mode === 'instant') reveal(); };
      box.append(b);
    });
    el.append(box);
  } else if (q.type === 'fill') {
    inputs = [...body.querySelectorAll('input')];
    inputs.forEach((x, i) => x.addEventListener('keydown', e => { if (e.key !== 'Enter' || e.isComposing) return; if (inputs[i + 1]) inputs[i + 1].focus(); else if (mode === 'instant') reveal(); }));
    if (mode === 'instant') { const r = h('div', 'row'); r.append(go); el.append(r); }
  } else {
    if (!compact) { const t = h('textarea', 'scratch'); t.id = id + '-s'; t.placeholder = '先自己写要点，再看答案（不会保存）'; t.setAttribute('aria-label', '草稿'); el.append(t); }
    if (mode === 'instant') { const r = h('div', 'row'); r.append(go); el.append(r); }
  }
  go.onclick = () => reveal();

  function reveal() {
    if (revealed) return; revealed = true; go.parentElement?.remove();
    const ans = h('div', 'ans'); let objective = null;
    if (q.type === 'choice') {
      objective = picked === q.a;
      [...el.querySelectorAll('.opt')].forEach((b, i) => { b.disabled = true; b.classList.remove('sel');
        if (i === q.a) { b.classList.add('ok'); b.append(h('span', 'tag', '正确答案')); } else if (i === picked) { b.classList.add('no'); b.append(h('span', 'tag', '你选的')); } });
      ans.append(h('p', 'ver ' + (objective ? 'ok' : 'no'), objective ? '√ 答对了' : picked < 0 ? `× 未作答，答案 ${'ABCD'[q.a]}` : `× 答案是 ${'ABCD'[q.a]}`));
    } else if (q.type === 'fill') {
      const r = checkFill(q, inputs.map(x => x.value)); objective = r.every(Boolean);
      inputs.forEach((x, i) => { x.readOnly = true; x.classList.add(r[i] ? 'ok' : 'no'); });
      ans.append(h('p', 'ver ' + (objective ? 'ok' : 'no'), (objective ? '√ 答对了' : '× 答案：' + q.a.map(a => a[0]).join('；'))));
    } else ans.append(h('div', 'rich', q.a));
    if (q.err) ans.append(h('p', 'note err', '更正：' + q.err));
    if (q.doubt) ans.append(h('p', 'note doubt', '存疑：' + q.doubt));
    if (q.ex) ans.append(h('div', 'ex rich', q.ex));
    if (q.demo) { const b = h('button', 'btn', '一步步演示'); b.type = 'button'; const r = h('div', 'row'); r.append(b); b.onclick = () => { r.replaceWith(mountDemo(q.demo)); }; ans.append(r); }
    if (objective !== null) mark(objective ? 'ok' : 'no');
    if (q.type === 'open' || (q.type === 'fill' && !objective)) {
      const s = h('div', 'self'); s.append(h('span', 'small soft', q.type === 'fill' ? '意思对也算对：' : '自评：'));
      for (const [v, c, t] of [['ok', 'g', '会了'], ['mid', 'm', '模糊'], ['no', 'b', '不会']]) {
        const b = h('button', 'btn ' + c, t); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.onclick = () => { [...s.querySelectorAll('button')].forEach(x => x.setAttribute('aria-pressed', x === b)); mark(v); };
        s.append(b);
      }
      ans.append(s);
    }
    el.append(ans);
  }
  el.reveal = reveal; el.q = q; el.result = () => result;
  return el;
}
