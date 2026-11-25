import { Q, CORE, SETS, GROUPS, sid } from './data/questions.js';
import { TOPICS, TIERS } from './data/topics.js';
import * as store from './store.js';
import { renderQ, h } from './question.js';
import { mountDemo } from './demos.js';
import { mountFeed } from './feed.js';
import { mount as visitors } from './visitors.js';
import { COLOR, glyph, icon, ring, burst } from './art.js';
import { watch } from './pretty.js';

const main = document.getElementById('main'), byId = Object.fromEntries(Q.map(q => [q.id, q])), grp = Object.fromEntries(SETS.map(s => [s.id, s.grp])), byGrp = g => SETS.filter(s => s.grp === g);
const ORDER = ['year', 'paper', 'bank', 'note', 'ex'], ofTopic = t => CORE.filter(q => q.t.includes(t)).sort((a, b) => ORDER.indexOf(grp[a.set]) - ORDER.indexOf(grp[b.set])), ofSet = s => Q.filter(q => q.set === s);
const pct = p => p.all ? Math.round(p.ok / p.all * 100) : 0;
const bar = p => `<span class="bar" title="已会 ${p.ok} / ${p.all}"><b style="width:${pct(p)}%"></b></span>`;
const tier = t => `<span class="tier t${t.tier}">${TIERS[t.tier]}</span>`;
const link = (href, text, cls = 'btn') => { const a = h('a', cls, text); a.href = href; return a; };
const head = (t, p) => h('div', 'head', `<h1>${t}</h1>${p ? `<p class="soft">${p}</p>` : ''}`);
const tone = id => `style="--tc:${COLOR[id] || COLOR.basics}"`, last = { get: () => { try { return localStorage.getItem('prune.last') || ''; } catch { return ''; } }, set: v => { try { localStorage.setItem('prune.last', v); } catch { /* 忽略 */ } } };
const cover = (t, href) => { const p = store.progress(ofTopic(t.id)); return `<a class="cover" href="${href}" ${tone(t.id)}><span class="cv-art">${glyph(t.id)}<em>${TIERS[t.tier]}</em></span><span class="cv-t"><b>${t.name}</b><small>${p.ok} / ${p.all}</small></span>${bar(p)}</a>`; };
let cleanup = null;

/* 首页 */
function home() {
  const p = store.progress(CORE), bad = CORE.filter(q => ['no', 'mid'].includes(store.status(sid(q)))).length;
  const [lr, li] = last.get().split('/'), lt = TOPICS.find(t => t.id === li), ls = SETS.find(x => x.id === li), next = TOPICS.find(t => store.progress(ofTopic(t.id)).done < ofTopic(t.id).length) || TOPICS[0];
  const go = (lr === 'learn' || lr === 'topic') && lt ? [`#/${lr}/${li}`, `接着学：${lt.name}`] : lr === 'set' && ls ? [`#/set/${li}`, `接着刷：${ls.name}`] : [`#/learn/${next.id}`, `开始学：${next.name}`];
  const hero = h('section', 'hero'), left = h('div', 'hero-l', `<h1>算法考试速成</h1><p class="soft">${CORE.length} 道题，${TOPICS.length} 个知识点，从必考的开始。</p><div class="hero-p">${ring(p, 116, '已会')}<dl><div><dt>做过</dt><dd>${p.done}</dd></div><div><dt>会了</dt><dd>${p.ok}</dd></div><div><dt>不会</dt><dd>${bad}</dd></div></dl></div>`);
  const acts = h('div', 'row'); acts.append(link(go[0], go[1], 'btn pri big')); if (bad) acts.append(link('#/wrong', `复习 ${bad} 道错题`, 'btn big')); left.append(acts);
  const deck = h('div', 'deck'), cards = TOPICS.flatMap(t => t.memo.map(m => ({ m, t }))).map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]); let k = 0;
  const mk = x => { const d = h('div', 'dk', `<span class="dk-g">${glyph(x.t.id)}</span><small>${x.t.name}</small><p></p>`); d.style.setProperty('--tc', COLOR[x.t.id]); d.querySelector('p').textContent = x.m; return d; };
  const pile = h('div', 'pile'); for (let i = 0; i < 3; i++) pile.prepend(mk(cards[k++ % cards.length]));
  const flip = () => { const top = pile.lastElementChild; if (top.classList.contains('out')) return; top.classList.add('out'); setTimeout(() => { top.remove(); pile.prepend(mk(cards[k++ % cards.length])); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320); };
  const db = h('div', 'dk-b'); const fb = h('button', 'btn ghost', '换一张'); fb.type = 'button'; fb.onclick = flip; db.append(fb, link('#/feed', icon('feed') + '<span>进抖题</span>', 'btn hot'));
  pile.onclick = flip; deck.append(pile, db); hero.append(left, deck); main.append(hero);
  main.append(h('section', 'sec', `<div class="sec-h"><h2>知识点</h2><a href="#/learn">全部课程${icon('right')}</a></div><div class="covers rail">${TOPICS.map(t => cover(t, `#/learn/${t.id}`)).join('')}</div>`));
  main.append(h('section', 'sec', `<div class="sec-h"><h2>套卷</h2><a href="#/sets">全部套卷${icon('right')}</a></div><div class="papers">${SETS.filter(x => x.id !== 'ex').map(paper).join('')}</div>`));
  const COLS = [...byGrp('year').map(s => [s.name, q => q.set === s.id]), ['综合卷', q => grp[q.set] === 'paper'], ['题库', q => grp[q.set] === 'bank']];
  const rows = TOPICS.map(t => COLS.map(c => Q.filter(q => q.t.includes(t.id) && c[1](q)).length)), mx = COLS.map((_, j) => Math.max(...rows.map(r => r[j])));
  main.append(h('section', 'sec', `<div class="sec-h"><h2>考频</h2></div><p class="soft small">颜色越深，这一列里考得越多。一题可能考多个知识点；往年规律，不保证今年照考。</p><div class="scroll"><table class="heat"><thead><tr><th>知识点</th>${COLS.map(c => `<th>${c[0]}</th>`).join('')}<th>已会</th></tr></thead><tbody>${TOPICS.map((t, i) => `<tr><th><a href="#/learn/${t.id}"><i ${tone(t.id)}></i>${t.name}</a>${tier(t)}</th>${rows[i].map((n, j) => `<td><span class="hc" style="--a:${n ? Math.round(14 + 66 * n / mx[j]) : 0}%"${n / mx[j] > .5 ? ' data-hi' : ''}>${n || ''}</span></td>`).join('')}<td>${bar(store.progress(ofTopic(t.id)))}</td></tr>`).join('')}</tbody></table></div>`));
}

const paper = s => { const p = store.progress(ofSet(s.id)); return `<a class="paper" href="#/set/${s.id}"><span class="pp-r">${ring(p, 64)}</span><span><b>${s.name}</b><small>${s.sub}</small><small>${p.done} / ${p.all} 题</small></span></a>`; };

/* 教学 */
function learn(id) {
  if (!id) {
    main.append(head('逐个知识点学', '按复习优先级从上往下学。每课：讲解、演示、速记、例题。'));
    for (const [k, n] of Object.entries(TIERS)) { const l = TOPICS.filter(t => t.tier === +k); if (l.length) main.append(h('section', 'sec', `<div class="sec-h"><h2>${n}</h2></div><div class="covers">${l.map(t => cover(t, `#/learn/${t.id}`)).join('')}</div>`)); } return;
  }
  const i = TOPICS.findIndex(t => t.id === id); if (i < 0) return notFound(); const t = TOPICS[i];
  const g = h('div', 'lesson'); g.append(h('aside', '', TOPICS.map(x => `<a href="#/learn/${x.id}"${x === t ? ' aria-current="page"' : ''}><i ${tone(x.id)}></i>${x.name}</a>`).join('')));
  const a = h('article'); a.append(h('header', 'lh', `<div><span class="tag">${TIERS[t.tier]}</span><h1>${t.name}</h1><p>${t.one}</p></div>${glyph(t.id)}`)); a.firstChild.style.setProperty('--tc', COLOR[t.id]);
  const st = h('div', 'steps'); t.steps.forEach(([n, html]) => st.append(h('section', 'step', `<h2>${n}</h2><div class="rich">${html}</div>`))); a.append(st);
  if (t.demo) { const s = h('section', 'step', '<h2>动手走一遍</h2><p class="soft small">数据可以改成题目里的，再点“用这组数据”。</p>'); s.append(mountDemo(t.demo)); a.append(s); }
  a.append(h('div', 'memos', `<h3>速记</h3><ul>${t.memo.map(m => `<li>${m.replace(/</g, '&lt;')}</li>`).join('')}</ul>`));
  const ex = h('section', 'stack', '<h2>例题</h2>'); t.eg.forEach((e, k) => ex.append(renderQ(byId[e], { index: k + 1 }))); a.append(ex);
  const rest = ofTopic(t.id).length; const pg = h('div', 'pager');
  pg.append(i ? link(`#/learn/${TOPICS[i - 1].id}`, '上一课：' + TOPICS[i - 1].name) : h('span'), link(`#/topic/${t.id}`, `刷完这个知识点的 ${rest} 题`, 'btn pri'), i < TOPICS.length - 1 ? link(`#/learn/${TOPICS[i + 1].id}`, '下一课：' + TOPICS[i + 1].name) : h('span'));
  a.append(pg); g.append(a); main.append(g);
}

/* 一题一页 + 答题卡 */
function runner(qs, { exam = false, fresh = false } = {}) {
  const g = h('div', 'run'), stage = h('div', 'run-stage'), prog = h('div', 'run-prog', '<b></b>'), side = h('aside', 'run-side'), sheet = h('div', 'card-grid'), bar = h('div', 'run-bar'), clock = h('span', 'num'), score = h('p', 'score');
  const mkb = (t, f, c = '') => { const b = h('button', 'btn ' + c, t); b.type = 'button'; b.onclick = f; return b; };
  let i = 0, submitted = false, t0 = Date.now(), timer = 0; const els = [], touched = new Set();
  const mark = k => { const b = sheet.children[k], e = els[k]; if (!b) return; const r = exam && !submitted ? (touched.has(k) ? 'sel' : '') : exam ? (e?.result() || '') : store.status(sid(qs[k])); b.className = r + (k === i ? ' cur' : ''); b.ariaLabel = `第 ${k + 1} 题${{ ok: '，已会', mid: '，模糊', no: '，不会', sel: '，已作答' }[r] || ''}`; };
  const get = k => els[k] ||= (() => { const e = renderQ(qs[k], { mode: exam ? 'exam' : 'instant', index: k + 1, onDone: () => { mark(k); meter(); } }); const t = () => { if (exam && !submitted) { touched.add(k); mark(k); meter(); } }; e.addEventListener('input', t); e.addEventListener('click', ev => { if (ev.target.closest('.opt')) t(); }); return e; })();
  const meter = () => { const n = exam && !submitted ? touched.size : qs.filter((_, k) => els[k]?.result() || (!exam && store.status(sid(qs[k])))).length; prog.firstChild.style.width = n / qs.length * 100 + '%'; };
  const show = k => { if (k < 0) return; if (k >= qs.length) return finish(); const o = i; i = k; const e = get(k); stage.replaceChildren(e); e.classList.remove('in-l', 'in-r'); void e.offsetWidth; e.classList.add(k < o ? 'in-l' : 'in-r'); mark(o); mark(i); prev.disabled = !i; next.textContent = i === qs.length - 1 ? '完成' : '下一题'; next.disabled = exam && !submitted && i === qs.length - 1; pos.textContent = `${i + 1} / ${qs.length}`; meter(); if (main.contains(g) && g.getBoundingClientRect().top < 0) g.scrollIntoView(); };
  const finish = () => {
    const st = qs.map((_, k) => exam ? els[k]?.result() || '' : store.status(sid(qs[k]))), n = x => st.filter(v => v === x).length, p = { ok: n('ok'), done: st.filter(Boolean).length, all: qs.length };
    const d = h('div', 'done', `${ring(p, 150, '已会')}<h2>${p.ok === p.all ? '全会了' : p.done === p.all ? '这一轮刷完了' : `还有 ${p.all - p.done} 题没做`}</h2><p><span class="st-ok">会 ${n('ok')}</span><span class="st-mid">模糊 ${n('mid')}</span><span class="st-no">不会 ${n('no')}</span></p>`), r = h('div', 'row');
    const bad = qs.filter((_, k) => ['no', 'mid'].includes(st[k])); if (bad.length) r.append(mkb(`只刷不会的 ${bad.length} 题`, () => swap(bad), 'pri')); const todo = qs.filter((_, k) => !st[k]); if (todo.length) r.append(mkb(`补做 ${todo.length} 题`, () => swap(todo))); r.append(mkb('从头再来', () => swap(qs))); d.append(r); stage.replaceChildren(d); pos.textContent = '完成'; next.disabled = true; i = qs.length; prev.disabled = false; qs.forEach((_, k) => mark(k)); if (p.ok === p.all) { const b = d.getBoundingClientRect(); burst(b.left + b.width / 2, b.top + 110); }
  };
  const swap = list => { stop(); const n = runner(list, { fresh: true }); g.replaceWith(n.el); self.el = n.el; self.stop = n.stop; };
  const prev = mkb('上一题', () => show(i - 1)), next = mkb('下一题', () => show(i + 1), 'pri'), pos = h('span', 'num soft'), tog = mkb('答题卡', () => { const on = side.classList.toggle('on'); tog.setAttribute('aria-expanded', on); }, 'tog'); tog.setAttribute('aria-expanded', 'false');
  qs.forEach((_, k) => { const b = h('button', '', k + 1); b.type = 'button'; b.onclick = () => { show(k); side.classList.remove('on'); tog.setAttribute('aria-expanded', 'false'); }; sheet.append(b); });
  side.append(h('h3', '', '答题卡'), sheet, h('p', 'legend small soft', exam ? '<i class="sel"></i>已作答 <i></i>未作答' : '<i class="ok"></i>会 <i class="mid"></i>模糊 <i class="no"></i>不会 <i></i>没做'));
  if (exam) {
    const tick = () => { const x = Math.floor((Date.now() - t0) / 1000); clock.textContent = `用时 ${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; }; tick(); timer = setInterval(tick, 1000);
    let armed = false; const sub = mkb('交卷', () => {
      const left = qs.length - touched.size; if (left && !armed) { armed = true; sub.textContent = `还有 ${left} 题没写，再点交卷`; setTimeout(() => { armed = false; if (!submitted) sub.textContent = '交卷'; }, 4000); return; }
      submitted = true; clearInterval(timer); tick(); qs.forEach((_, k) => { get(k).reveal(); }); qs.forEach((_, k) => mark(k));
      const ob = els.filter(e => e.q.type !== 'open'), ok = ob.filter(e => e.result() === 'ok').length; meter(); score.innerHTML = ob.length ? `客观题 ${ok} / ${ob.length}<small class="soft">解答题对照答案自评</small>` : '已交卷<small class="soft">对照答案自评</small>'; sub.remove(); side.querySelector('.legend').innerHTML = '<i class="ok"></i>会 <i class="mid"></i>模糊 <i class="no"></i>不会 <i></i>未自评'; side.classList.add('on'); tog.setAttribute('aria-expanded', 'true'); show(0);
    }, 'pri'); side.append(clock, score, sub);
  }
  const key = e => { if (e.target.matches?.('input,textarea') || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1); else { const c = e.key.toLowerCase(), j = 'abcd'.indexOf(c) >= 0 ? 'abcd'.indexOf(c) : '1234'.indexOf(c); if (j >= 0 && c.length === 1) stage.querySelectorAll('.opt')[j]?.click(); } };
  addEventListener('keydown', key);
  bar.append(prev, pos, next, tog); const left = h('div', 'run-main'); left.append(prog, stage, bar, h('p', 'keys small soft', '键盘：1–4 选择，← → 换题')); g.append(left, side);
  qs.forEach((_, k) => mark(k)); const f = exam || fresh ? 0 : qs.findIndex(q => !store.status(sid(q))); show(f < 0 ? 0 : f);
  const stop = () => { clearInterval(timer); removeEventListener('keydown', key); }, self = { el: g, stop }; return self;
}
function listing(qs, empty) {
  const F = { all: ['全部', () => true], todo: ['没做过', q => !store.status(sid(q))], bad: ['不会或模糊', q => ['no', 'mid'].includes(store.status(sid(q)))], choice: ['选择', q => q.type === 'choice'], fill: ['填空', q => q.type === 'fill' || q.kind === '填空'], open: ['解答', q => q.type === 'open' && !q.kind] };
  if (!qs.length) { main.append(h('p', 'soft', empty)); return; }
  const chips = h('div', 'chips'), box = h('div'); box.style.marginTop = '20px'; let cur = null, list = qs, key = 'all';
  const draw = (k, sh) => { key = k; cur?.stop(); cur = null; list = qs.filter(F[k][1]); if (sh) list = list.map(q => [Math.random(), q]).sort((a, b) => a[0] - b[0]).map(x => x[1]); if (!list.length) { box.replaceChildren(h('p', 'soft', '这个筛选下没有题了。')); return; } cur = runner(list); box.replaceChildren(cur.el); };
  Object.entries(F).forEach(([k, [n, f]]) => { const c = qs.filter(f).length; if (!c && k !== 'all') return; const b = h('button', 'chip', `${n} ${c}`); b.type = 'button'; b.setAttribute('aria-pressed', k === 'all'); b.onclick = () => { [...chips.querySelectorAll('[aria-pressed]')].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  const sh = h('button', 'chip', '打乱'); sh.type = 'button'; sh.onclick = () => draw(key, true); chips.append(sh);
  main.append(chips, box); draw('all'); cleanup = () => cur?.stop();
}
function topics() {
  main.append(head('按知识点刷', '选一个知识点，往年卷在前。'));
  main.append(h('div', 'covers', TOPICS.map(t => cover(t, `#/topic/${t.id}`)).join('')));
}
function topic(id) { const t = TOPICS.find(x => x.id === id); if (!t) return notFound(); const hd = h('header', 'lh slim', `<div><h1>${t.name}</h1><p>${t.one}</p></div>${glyph(id)}`); hd.style.setProperty('--tc', COLOR[id]); hd.firstChild.append(link(`#/learn/${id}`, '先看讲解', 'btn ghost')); main.append(hd); listing(ofTopic(id)); }

/* 套卷 */
function sets() {
  main.append(head('按套刷', '练习边做边看答案；模拟考试计时，交卷后统一对答案。'));
  for (const [g, name] of Object.entries(GROUPS)) main.append(h('section', 'sec', `<div class="sec-h"><h2>${name}</h2></div><div class="papers">${byGrp(g).map(paper).join('')}</div>`));
}
function set(id) {
  const s = SETS.find(x => x.id === id); if (!s) return notFound(); const qs = ofSet(id);
  const top = h('div', 'set-top', `<h1>${s.name}<small class="soft">${s.sub}，${qs.length} 题</small></h1>`), chips = h('div', 'chips'), box = h('div'); top.append(chips); main.append(top, box); let cur = null;
  const draw = exam => { cur?.stop(); cur = runner(qs, { exam }); box.replaceChildren(cur.el); };
  [[false, '练习'], [true, '模拟考试']].forEach(([k, n]) => { const b = h('button', 'chip', n); b.type = 'button'; b.setAttribute('aria-pressed', !k); b.onclick = () => { if (b.getAttribute('aria-pressed') === 'true') return; [...chips.children].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  draw(false); cleanup = () => cur?.stop();
}

function feed() { cleanup = mountFeed(main); }

/* 错题 */
function wrong() {
  main.append(head('错题和收藏', '标记为“不会”“模糊”或收藏过的题。做对或自评“会了”之后会自动移出。'));
  listing(CORE.filter(q => ['no', 'mid'].includes(store.status(sid(q))) || store.starred(sid(q))), '还没有错题。去刷几道，答错的会自动进来。');
  if (store.progress(CORE).done) {
    const r = h('div', 'row'); r.style.marginTop = '32px'; const b = h('button', 'btn', '清空做题记录'); b.type = 'button'; let armed = false;
    b.onclick = () => { if (!armed) { armed = true; b.textContent = '再点一次确认清空，无法恢复'; setTimeout(() => { armed = false; b.textContent = '清空做题记录'; }, 4000); return; } store.reset(); route(); };
    r.append(b); main.append(r);
  }
}
function notFound() { main.append(head('没有这个页面', '链接可能写错了。')); main.append(link('#/', '回首页')); }

const R = { '': home, learn, topics, topic, sets, set, feed, wrong };
function route() {
  if (location.hash && !location.hash.startsWith('#/')) return; // 跳转正文等普通锚点
  cleanup?.(); cleanup = null; const [p = '', id] = location.hash.replace(/^#\//, '').split('/'); main.replaceChildren(); (Object.hasOwn(R, p) ? R[p] : notFound)(id);
  if (['learn', 'topic', 'set'].includes(p) && id) last.set(`${p}/${id}`); main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter');
  const nav = { topic: 'topics', set: 'sets' }[p] || p; document.querySelectorAll('[data-nav]').forEach(a => a.dataset.nav === nav ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const t = main.querySelector('h1')?.firstChild.textContent || '抖题'; document.title = p ? `${t} · 算法考试速成` : '算法考试速成'; scrollTo(0, 0);
}
addEventListener('hashchange', route);
document.getElementById('theme').onclick = () => { const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('prune.theme', r.dataset.theme); } catch { /* 忽略 */ } };
watch(); route(); visitors(document.getElementById('visits'));
