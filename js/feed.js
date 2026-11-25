// 抖题：一屏一题，上下滑切换。解析从底部抽屉弹出（像评论区）。
import { CORE as Q, SETS } from './data/questions.js';
import { TOPICS } from './data/topics.js';
import * as store from './store.js';
import { h, checkFill } from './question.js';
import { mountDemo } from './demos.js';
import { COLOR, glyph, icon, burst } from './art.js';

const topic = Object.fromEntries(TOPICS.map(t => [t.id, t])), setName = Object.fromEntries(SETS.map(s => [s.id, s.name]));
const GRP = Object.fromEntries(SETS.map(s => [s.id, s.grp]));
const TABS = { all: '推荐', real: '真题', obj: '选择填空', open: '大题', bad: '不会的', memo: '速记' };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const weight = q => ({ '': 3, no: 4, mid: 3, ok: .6 })[store.status(q.id)] * (q.t.some(t => topic[t].tier === 1) ? 1.4 : q.t.every(t => topic[t].tier === 4) ? .4 : 1);
const weighted = a => a.map(x => [Math.random() ** (1 / weight(x)), x]).sort((p, q) => q[0] - p[0]).map(p => p[1]);
const MEMOS = TOPICS.flatMap(t => t.memo.map(m => ({ memo: m, t })));

export function mountFeed(root) {
  document.body.classList.add('immersive');
  const wrap = h('div', 'tk'), tabs = h('div', 'tk-tabs'), list = h('div', 'tk-list'), toast = h('div', 'tk-toast'), sheet = h('div', 'tk-sheet'), mask = h('div', 'tk-mask');
  list.tabIndex = 0; list.setAttribute('aria-label', '题目流，上下滑动切换'); toast.setAttribute('role', 'status'); sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', '答案解析'); mask.hidden = true; sheet.inert = true;
  const nav = h('div', 'tk-nav'), up = h('button', '', icon('up')), down = h('button', '', icon('down')); up.type = down.type = 'button'; up.ariaLabel = '上一题'; down.ariaLabel = '下一题'; nav.append(up, down);
  wrap.append(list, tabs, nav, mask, sheet, toast); root.append(wrap);
  let mode = 'all', round = 0, slides = [], cur = 0, streak = 0, tt = 0, auto = (() => { try { return localStorage.getItem('prune.auto') === '1'; } catch { return false; } })(), opener = null;
  const say = m => { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 1400); };

  const pool = () => {
    const f = { all: () => true, real: q => ['year', 'paper'].includes(GRP[q.set]), obj: q => q.type !== 'open', open: q => q.type === 'open' && !q.kind, bad: q => ['no', 'mid'].includes(store.status(q.id)) }[mode];
    if (mode === 'memo') return shuffle(MEMOS);
    const qs = weighted(Q.filter(f)); if (mode !== 'all') return qs;
    const ms = shuffle(MEMOS), out = []; qs.forEach((q, i) => { out.push(q); if (i % 6 === 4 && ms.length) out.push(ms.pop()); }); return out;
  };
  const more = () => {
    const items = pool(); round++;
    if (!items.length) { const e = h('section', 'tk-item'); e.style.setProperty('--tc', COLOR.basics); e.append(h('div', 'tk-body', '<p class="tk-q">还没有不会的题</p><p>去“推荐”刷几道，答错或标成“模糊”“不会”的会出现在这里。</p>')); list.append(e); slides.push(e); return; }
    items.forEach((x, i) => { const e = x.memo ? memoSlide(x) : qSlide(x, i + 1, items.length); e.style.setProperty('--tc', COLOR[x.memo ? x.t.id : x.t[0]]); e.prepend(h('div', 'tk-art', glyph(x.memo ? x.t.id : x.t[0]))); list.append(e); slides.push(e); });
  };
  const start = () => { close(); list.replaceChildren(); slides = []; cur = 0; round = 0; more(); list.scrollTop = 0; };
  let gt = 0; const go = d => { const k = Math.max(0, Math.min(slides.length - 1, cur + d)), top = k * list.clientHeight, from = list.scrollTop; list.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); clearTimeout(gt); gt = setTimeout(() => { if (list.scrollTop === from && from !== top) list.scrollTop = top; }, 400); };

  /* 底部抽屉 */
  function open(node, title, from) { opener = from || null; const hd = h('div', 'tk-sh'), x = h('button', '', '收起'); x.type = 'button'; x.onclick = close; hd.append(h('b', '', title), x); const bd = h('div', 'tk-sb rich'); bd.append(node); sheet.replaceChildren(hd, bd); sheet.inert = false; mask.hidden = false; sheet.classList.add('on'); x.focus({ preventScroll: true }); }
  function close() { if (!sheet.classList.contains('on')) return; sheet.classList.remove('on'); sheet.inert = true; mask.hidden = true; (opener?.isConnected ? opener : list).focus({ preventScroll: true }); }
  mask.onclick = close;

  function memoSlide({ memo, t }) {
    const e = h('section', 'tk-item memo-s'), b = h('div', 'tk-body'), p = h('p', 'tk-big'); p.textContent = memo;
    const a = h('a', 'tk-btn', '看这一课'); a.href = `#/learn/${t.id}`; b.append(h('p', 'tk-meta', `速记　${t.name}`), p, a); e.append(b, rail(null, t.id)); return e;
  }
  function rail(q, tid) {
    const r = h('div', 'tk-rail'); const add = (ico, txt, fn, tag = 'button') => { const b = h(tag, '', `<i>${ico}</i><span>${txt}</span>`); if (tag === 'button') b.type = 'button'; if (fn) b.onclick = fn; r.append(b); return b; };
    if (q) {
      const s = add(icon('star'), '收藏', () => { e(store.toggleStar(q.id)); }); const e = on => { s.setAttribute('aria-pressed', on); s.lastChild.textContent = on ? '已收藏' : '收藏'; }; e(store.starred(q.id)); r.star = () => { if (!store.starred(q.id)) store.toggleStar(q.id); e(true); };
      r.ans = add(icon('bulb'), '解析');
    }
    const l = add(icon('learn'), '讲解', null, 'a'); l.href = `#/learn/${tid}`;
    const au = add(icon('auto'), '连播', () => { auto = !auto; try { localStorage.setItem('prune.auto', auto ? '1' : '0'); } catch { /* 忽略 */ } list.querySelectorAll('.au').forEach(x => x.setAttribute('aria-pressed', auto)); say(auto ? '连播开：答对自动下一题' : '连播关'); }); au.classList.add('au'); au.setAttribute('aria-pressed', auto);
    add(icon('shuffle'), '打乱', () => { wrap.classList.add('mix'); setTimeout(() => wrap.classList.remove('mix'), 420); start(); say('已重新打乱'); });
    return r;
  }
  function qSlide(q, i, n) {
    const e = h('section', 'tk-item'), b = h('div', 'tk-body'), r = rail(q, q.t[0]); let done = false;
    b.append(h('p', 'tk-meta', `${setName[q.set]}${q.no === '补充' ? '' : ' ' + q.no}　${q.t.map(t => topic[t].name).join('、')}　<span class="num">${i}/${n}</span>`));
    let k = 0; const qt = h('div', 'tk-q rich', q.type === 'fill' ? q.q.replace(/___/g, () => `<input class="tk-in" autocomplete="off" autocapitalize="off" aria-label="第 ${++k} 空">`) : q.q); b.append(qt);
    if (q.q.replace(/<[^>]+>/g, '').length > 70 || q.q.includes('<pre')) qt.classList.add('long');
    const foot = h('div', 'tk-foot');
    const verdict = (ok, txt) => { store.setStatus(q.id, ok ? 'ok' : 'no'); streak = ok ? streak + 1 : 0; const v = h('p', 'tk-ver ' + (ok ? 'ok' : 'no'), txt); foot.replaceChildren(v); if (!ok) { b.classList.add('shake'); } else { const r = (b.querySelector('.tk-opts .ok') || foot).getBoundingClientRect(); burst(r.left + Math.min(r.width - 30, 260), r.top + r.height / 2); if (streak >= 3) say(`连对 ${streak} 题`); if (auto) setTimeout(() => { if (slides[cur] === e && !sheet.classList.contains('on')) go(1); }, 1100); } const row = h('div', 'tk-row'); row.append(mk('看解析', () => show(row.firstChild)), mk('下一题', () => go(1), 'pri')); foot.append(row); };
    const mk = (t, f, c = '') => { const x = h('button', 'tk-btn ' + c, t); x.type = 'button'; x.onclick = f; return x; };
    const self = () => { const row = h('div', 'tk-row'); for (const [s, t] of [['ok', '会了'], ['mid', '模糊'], ['no', '不会']]) { const x = mk(t, () => { store.setStatus(q.id, s); close(); say({ ok: '已记为会了', mid: '已记为模糊，会再出现', no: '已记为不会，会再出现' }[s]); setTimeout(() => go(1), 350); }, s); row.append(x); } return row; };
    const show = from => {
      const d = h('div', 'tk-ans rich');
      if (q.type === 'choice') d.append(h('p', '', `<b>答案：${'ABCD'[q.a]}</b>`)); else if (q.type === 'fill') d.append(h('p', '', `<b>答案：${q.a.map(a => a[0]).join('；')}</b>`)); else d.append(h('div', 'rich', q.a));
      if (q.ex) d.append(h('div', 'rich', q.ex));
      if (q.demo) { const x = h('button', 'btn', '一步步演示'); x.type = 'button'; x.onclick = () => x.replaceWith(mountDemo(q.demo)); d.append(x); }
      if (q.type === 'open') { d.append(h('p', 'small soft', '对照答案，自评一下：'), self()); }
      else if (!done) { done = true; lock(); }
      open(d, '答案解析', from);
    };
    let lock = () => {};
    if (q.type === 'choice') {
      const box = h('div', 'tk-opts'); q.opts.forEach((o, j) => { const x = h('button', '', `<b>${'ABCD'[j]}</b><span></span>`); x.type = 'button'; x.lastChild.textContent = o; x.onclick = () => { if (done) return; done = true; lock(j); verdict(j === q.a, j === q.a ? '答对了' : `答案是 ${'ABCD'[q.a]}`); }; box.append(x); });
      lock = j => [...box.children].forEach((x, m) => { x.disabled = true; if (m === q.a) x.classList.add('ok'); else if (m === j) x.classList.add('no'); }); b.append(box);
    } else if (q.type === 'fill') {
      const ins = [...qt.querySelectorAll('input')]; const check = () => { if (done) return; const res = checkFill(q, ins.map(x => x.value)), ok = res.every(Boolean); done = true; ins.forEach((x, j) => { x.readOnly = true; x.blur(); x.classList.add(res[j] ? 'ok' : 'no'); }); verdict(ok, ok ? '答对了' : '答案：' + q.a.map(a => a[0]).join('；')); };
      lock = () => { ins.forEach(x => { x.readOnly = true; }); foot.replaceChildren(mk('下一题', () => go(1), 'pri')); }; ins.forEach((x, j) => { x.onkeydown = ev => { if (ev.key === 'Enter' && !ev.isComposing) { ev.preventDefault(); ins[j + 1] ? ins[j + 1].focus() : check(); } }; }); foot.append(mk('核对', check, 'pri'));
    } else { const x = mk('想好了，看答案', () => show(x), 'pri'); foot.append(x); }
    b.append(foot); e.append(b, r); r.ans.onclick = () => show(r.ans); e.pick = j => b.querySelectorAll('.tk-opts button')[j]?.click();
    let last = 0; e.addEventListener('pointerup', ev => { if (ev.target.closest('button,a,input,.tk-rail')) return; const now = Date.now(); if (now - last < 300) { r.star(); const s = h('span', 'tk-heart', icon('star')); s.style.left = ev.clientX + 'px'; s.style.top = ev.clientY + 'px'; wrap.append(s); setTimeout(() => s.remove(), 700); last = 0; } else last = now; });
    return e;
  }

  list.addEventListener('scroll', () => { const H = list.clientHeight; if (!H) return; const c = Math.round(list.scrollTop / H); if (c !== cur) { cur = c; if (document.activeElement?.matches?.('.tk-in')) document.activeElement.blur(); } if (cur >= slides.length - 3 && !(mode === 'bad' && slides.length < 4)) more(); }, { passive: true });
  up.onclick = () => go(-1); down.onclick = () => go(1);
  const key = ev => {
    if (ev.target.matches?.('input,textarea') || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === 'Escape') return close(); if (sheet.classList.contains('on')) return;
    if (['ArrowDown', 'PageDown', 'j'].includes(ev.key)) { ev.preventDefault(); go(1); } else if (['ArrowUp', 'PageUp', 'k'].includes(ev.key)) { ev.preventDefault(); go(-1); } else { const j = 'abcd'.indexOf(ev.key.toLowerCase()); const m = j >= 0 ? j : '1234'.indexOf(ev.key); if (m >= 0 && ev.key.length === 1) slides[cur]?.pick?.(m); }
  };
  addEventListener('keydown', key);
  const fix = () => { const H = list.clientHeight; if (H) list.scrollTop = cur * H; }; addEventListener('resize', fix);
  Object.entries(TABS).forEach(([k, n]) => { const b = h('button', '', n); b.type = 'button'; b.setAttribute('aria-pressed', k === mode); b.onclick = () => { mode = k; [...tabs.children].forEach(x => x.setAttribute('aria-pressed', x === b)); start(); }; tabs.append(b); });
  start(); list.focus({ preventScroll: true });
  return () => { document.body.classList.remove('immersive'); removeEventListener('keydown', key); removeEventListener('resize', fix); clearTimeout(tt); };
}
