import { Q, SETS } from './data/questions.js';
import { TOPICS, TIERS } from './data/topics.js';
import * as store from './store.js';
import { renderQ, h } from './question.js';
import { mountDemo, heroTree } from './demos.js';
import { mount as visitors } from './visitors.js';

const main = document.getElementById('main'), byId = Object.fromEntries(Q.map(q => [q.id, q])), real = SETS.filter(s => s.id !== 'ex');
const ofTopic = t => Q.filter(q => q.t.includes(t)), ofSet = s => Q.filter(q => q.set === s);
const pct = p => p.all ? Math.round(p.ok / p.all * 100) : 0;
const bar = p => `<span class="bar" title="已会 ${p.ok} / ${p.all}"><b style="width:${pct(p)}%"></b></span>`;
const tier = t => `<span class="tier t${t.tier}">${TIERS[t.tier]}</span>`;
const link = (href, text, cls = 'btn') => { const a = h('a', cls, text); a.href = href; return a; };
const head = (t, p) => h('div', 'head', `<h1>${t}</h1>${p ? `<p class="soft">${p}</p>` : ''}`);
let cleanup = null;

/* 首页 */
function home() {
  const hero = h('div', 'hero'), txt = h('div', 'hero-txt', `<h1>算法考试速成</h1><p class="soft">算法设计与分析期末，不会考的先剪掉。${real.length} 套往年卷 ${Q.length - ofSet('ex').length} 题，加 ${ofSet('ex').length} 道补充练习，按考频排好先后。答案重新核对过，原答案里发现的错误用红色标出。</p>`);
  const r = h('div', 'row'); r.append(link('#/learn/knapsack', '从必考点学起', 'btn pri'), link('#/feed', '直接随机刷')); txt.append(r);
  const demo = h('div', 'demo'), box = h('div', 'scroll'), cap = h('div', 'say'); demo.append(h('p', 'small soft', '2022–2023 第三题：重量 1、2、3，价值 6、10、12，容量 5'), box, cap); hero.append(txt, demo); main.append(hero); heroTree(box, cap);
  const p = store.progress(Q), errs = Q.filter(q => q.err).length;
  main.append(h('section', 'sec', `<h2>四种刷法</h2><div class="ways">
    <a href="#/learn"><h3>逐个知识点学</h3><p class="soft small">讲解、可以单步的演示、速记，最后配例题</p></a>
    <a href="#/topics"><h3>按知识点刷</h3><p class="soft small">${TOPICS.length} 个知识点，哪里弱刷哪里</p></a>
    <a href="#/sets"><h3>按套刷</h3><p class="soft small">边做边看答案，或做完再交卷</p></a>
    <a href="#/feed"><h3>随机流</h3><p class="soft small">往下滑就有题，没做过和做错的先出现</p></a></div>`));
  const cnt = (t, s) => Q.filter(q => q.set === s && q.t.includes(t)).length;
  const dots = n => n ? `<span class="dots" title="${n} 题">${'<i></i>'.repeat(Math.min(n, 5))}</span>${n > 5 ? `<small class="soft"> ${n}</small>` : ''}` : '';
  main.append(h('section', 'sec', `<h2>考点热度</h2><p class="soft small">一个点是一道题（一题可能考多个知识点）。往年规律，不保证今年照考。</p><div class="scroll"><table class="heat"><thead><tr><th>知识点</th><th></th>${real.map(s => `<th>${s.name}</th>`).join('')}<th>已会</th></tr></thead><tbody>${TOPICS.map(t => `<tr><th><a href="#/learn/${t.id}">${t.name}</a></th><td>${tier(t)}</td>${real.map(s => `<td>${dots(cnt(t.id, s.id))}</td>`).join('')}<td>${bar(store.progress(ofTopic(t.id)))}</td></tr>`).join('')}</tbody></table></div>`));
  const s = h('section', 'sec', `<h2>你的进度</h2><p>做过 <b class="num">${p.done}</b> 题，会了 <b class="num">${p.ok}</b> 题，共 <span class="num">${p.all}</span> 题。</p>`); const rr = h('div', 'row'); rr.append(link('#/wrong', '看错题和收藏'), link('#/errata', `原答案更正 ${errs} 处`)); s.append(rr); main.append(s);
}

/* 教学 */
function learn(id) {
  if (!id) {
    main.append(head('逐个知识点学', '按复习优先级从上往下学。每课：讲解、演示、速记、例题。'));
    main.append(h('div', 'list', TOPICS.map(t => { const p = store.progress(ofTopic(t.id)); return `<a href="#/learn/${t.id}"><div><h3>${t.name}${tier(t)}</h3><p class="soft small">${t.one}</p></div><div class="r">${bar(p)}<span class="num">${p.ok}/${p.all}</span></div></a>`; }).join(''))); return;
  }
  const i = TOPICS.findIndex(t => t.id === id); if (i < 0) return notFound(); const t = TOPICS[i];
  const g = h('div', 'lesson'); g.append(h('aside', '', TOPICS.map(x => `<a href="#/learn/${x.id}"${x === t ? ' aria-current="page"' : ''}>${x.name}</a>`).join('')));
  const a = h('article'); a.append(h('div', 'stack', `<div class="row"><h1>${t.name}</h1>${tier(t)}</div><p class="soft">${t.one}</p>`));
  t.steps.forEach(([n, html]) => a.append(h('section', 'step', `<h2>${n}</h2><div class="rich">${html}</div>`)));
  if (t.demo) { const s = h('section', 'step', '<h2>动手走一遍</h2><p class="soft small">数据可以改成题目里的，再点“用这组数据”。</p>'); s.append(mountDemo(t.demo)); a.append(s); }
  a.append(h('div', 'memos', `<h3>速记</h3><ul>${t.memo.map(m => `<li>${m.replace(/</g, '&lt;')}</li>`).join('')}</ul>`));
  const ex = h('section', 'stack', '<h2>例题</h2>'); t.eg.forEach((e, k) => ex.append(renderQ(byId[e], { index: k + 1 }))); a.append(ex);
  const rest = ofTopic(t.id).length; const pg = h('div', 'pager');
  pg.append(i ? link(`#/learn/${TOPICS[i - 1].id}`, '上一课：' + TOPICS[i - 1].name) : h('span'), link(`#/topic/${t.id}`, `刷完这个知识点的 ${rest} 题`, 'btn pri'), i < TOPICS.length - 1 ? link(`#/learn/${TOPICS[i + 1].id}`, '下一课：' + TOPICS[i + 1].name) : h('span'));
  a.append(pg); g.append(a); main.append(g);
}

/* 带筛选的题目列表 */
function listing(qs, empty) {
  const F = { all: ['全部', () => true], todo: ['没做过', q => !store.status(q.id)], bad: ['不会或模糊', q => ['no', 'mid'].includes(store.status(q.id))], choice: ['选择', q => q.type === 'choice'], fill: ['填空', q => q.type === 'fill' || q.kind === '填空'], open: ['解答', q => q.type === 'open' && !q.kind] };
  const chips = h('div', 'chips'), box = h('div', 'stack'); box.style.marginTop = '20px';
  const draw = k => { box.replaceChildren(); const l = qs.filter(F[k][1]); if (!l.length) box.append(h('p', 'soft', empty || '这个筛选下没有题，换一个试试。')); l.forEach((q, i) => box.append(renderQ(q, { index: i + 1 }))); };
  Object.entries(F).forEach(([k, [n, f]]) => { const c = qs.filter(f).length; if (!c && k !== 'all') return; const b = h('button', 'chip', `${n} ${c}`); b.type = 'button'; b.setAttribute('aria-pressed', k === 'all'); b.onclick = () => { [...chips.children].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  if (qs.length) main.append(chips); main.append(box); draw('all');
}
function topics() {
  main.append(head('按知识点刷', '选一个知识点，真题在前，补充练习在后。'));
  main.append(h('div', 'list', TOPICS.map(t => { const p = store.progress(ofTopic(t.id)), n = ofTopic(t.id).filter(q => q.set !== 'ex').length; return `<a href="#/topic/${t.id}"><div><h3>${t.name}${tier(t)}</h3><p class="soft small">真题 ${n}，补充 ${p.all - n}</p></div><div class="r">${bar(p)}<span class="num">做过 ${p.done}/${p.all}</span></div></a>`; }).join('')));
}
function topic(id) { const t = TOPICS.find(x => x.id === id); if (!t) return notFound(); main.append(head(t.name, t.one)); const r = h('div', 'row'); r.style.marginBottom = '16px'; r.append(link(`#/learn/${id}`, '先看讲解')); main.append(r); listing(ofTopic(id)); }

/* 套卷 */
function sets() {
  main.append(head('按套刷', '想找手感选“做完再对”，想过知识点选“边做边看”。'));
  main.append(h('div', 'list', SETS.map(s => { const p = store.progress(ofSet(s.id)); return `<a href="#/set/${s.id}"><div><h3>${s.name}<small class="soft">${s.sub}</small></h3><p class="soft small">${s.note}</p></div><div class="r">${bar(p)}<span class="num">做过 ${p.done}/${p.all}</span></div></a>`; }).join('')));
}
function set(id) {
  const s = SETS.find(x => x.id === id); if (!s) return notFound(); const qs = ofSet(id);
  const bar = h('div', 'exam-bar'), chips = h('div', 'chips'), right = h('div', 'row'), paper = h('div', 'exam'), title = h('div', 'exam-title', `<h1>${s.name}</h1><p class="soft">${s.sub}，共 ${qs.length} 题</p>`), box = h('div', 'stack');
  right.style.marginLeft = 'auto'; paper.append(title, box); bar.append(chips, right); main.append(bar, paper);
  const draw = mode => {
    box.replaceChildren(); right.replaceChildren(); let timer;
    const els = qs.map((q, i) => renderQ(q, { mode, index: i + 1 })); box.append(...els); cleanup?.(); cleanup = null;
    if (mode !== 'exam') return;
    const t0 = Date.now(), clock = h('span', 'num soft', '00:00'), sub = h('button', 'btn pri', '交卷'); sub.type = 'button';
    const tick = () => { const x = Math.floor((Date.now() - t0) / 1000); clock.textContent = `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
    timer = setInterval(tick, 1000); cleanup = () => clearInterval(timer);
    sub.onclick = () => { clearInterval(timer); tick(); els.forEach(e => e.reveal()); const ob = els.filter(e => e.q.type !== 'open'), ok = ob.filter(e => e.result() === 'ok').length; sub.remove(); right.append(h('span', 'score', ob.length ? `客观题 ${ok}/${ob.length}` : '已交卷'), h('span', 'small soft', '解答题请对照答案自评')); scrollTo({ top: 0 }); };
    right.append(clock, sub);
  };
  [['instant', '边做边看'], ['exam', '做完再对']].forEach(([k, n]) => { const b = h('button', 'chip', n); b.type = 'button'; b.setAttribute('aria-pressed', k === 'instant'); b.onclick = () => { if (b.getAttribute('aria-pressed') === 'true') return; [...chips.children].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  draw('instant');
}

/* 随机流：没做过、做错的权重高 */
const weight = q => ({ '': 3, no: 4, mid: 3, ok: .6 }[store.status(q.id)] * (q.t.some(t => TOPICS.find(x => x.id === t).tier === 1) ? 1.4 : q.t.every(t => TOPICS.find(x => x.id === t).tier === 4) ? .4 : 1));
const shuffle = (a, w = () => 1) => a.map(x => [Math.random() ** (1 / w(x)), x]).sort((p, q) => q[0] - p[0]).map(p => p[1]);
function feed() {
  main.append(head('随机流', '往下滑，题目和速记卡会一直来。没做过的和做错的先出现。'));
  const memos = TOPICS.flatMap(t => t.memo.map(m => ({ memo: m, t })));
  const F = { all: '全部', real: '只刷真题', obj: '只刷选择填空', bad: '只刷不会的', memo: '只看速记' };
  const chips = h('div', 'chips'); chips.style.marginBottom = '20px'; const grid = h('div', 'masonry'), end = h('div', 'sentinel'); main.append(chips, grid, end);
  let pool = [], mode = 'all', round = 0, cols = [], cards = [], dead = false;
  const base = () => Q.filter(q => mode === 'real' ? q.set !== 'ex' : mode === 'obj' ? q.type !== 'open' : mode === 'bad' ? ['no', 'mid'].includes(store.status(q.id)) : true);
  const fill = () => {
    round++; const qs = mode === 'memo' ? [] : shuffle(base(), weight), ms = mode === 'bad' || mode === 'obj' ? [] : shuffle(memos);
    if (mode === 'memo') pool = ms; else { pool = []; qs.forEach((q, i) => { pool.push(q); if (ms.length && i % 5 === 3) pool.push(ms.pop()); }); }
  };
  const card = x => { if (!x.memo) return renderQ(x, { compact: true }); const c = h('div', 'memo'); const p = h('p'); p.textContent = x.memo; const a = link(`#/learn/${x.t.id}`, '去看讲解', ''); c.append(h('span', '', '速记 · ' + x.t.name), p, a); return c; };
  const put = c => cols.reduce((m, x) => x.offsetHeight < m.offsetHeight ? x : m).append(c);
  const layout = () => { const n = innerWidth < 720 ? 1 : innerWidth < 1060 ? 2 : 3; if (n === cols.length) return; grid.style.gridTemplateColumns = `repeat(${n},minmax(0,1fr))`; cols = Array.from({ length: n }, () => h('div', 'col')); grid.replaceChildren(...cols); cards.forEach(put); };
  const more = () => {
    if (dead) return;
    for (let i = 0; i < 9; i++) {
      if (!pool.length) { if (mode === 'bad' && round) { end.textContent = cards.length ? '不会的都过了一遍。' : '还没有标记为“不会”或“模糊”的题，先去别的分类刷几道。'; dead = true; return; } fill(); if (!pool.length) { end.textContent = '还没有标记为“不会”或“模糊”的题，先去别的分类刷几道。'; dead = true; return; } }
      const c = card(pool.shift()); cards.push(c); put(c);
    }
    end.textContent = `第 ${round} 轮 · 继续往下滑`;
  };
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { more(); if (!dead) { io.unobserve(end); requestAnimationFrame(() => io.observe(end)); } } }, { rootMargin: '600px' });
  const start = () => { pool = []; round = 0; cards = []; cols = []; dead = false; layout(); end.textContent = ''; more(); io.unobserve(end); io.observe(end); };
  Object.entries(F).forEach(([k, n]) => { const b = h('button', 'chip', n); b.type = 'button'; b.setAttribute('aria-pressed', k === mode); b.onclick = () => { mode = k; [...chips.children].forEach(x => x.setAttribute('aria-pressed', x === b)); start(); }; chips.append(b); });
  addEventListener('resize', layout); cleanup = () => { io.disconnect(); removeEventListener('resize', layout); }; start();
}

/* 错题与更正 */
function wrong() {
  main.append(head('错题和收藏', '标记为“不会”“模糊”或收藏过的题。做对或自评“会了”之后会自动移出。'));
  listing(Q.filter(q => ['no', 'mid'].includes(store.status(q.id)) || store.starred(q.id)), '还没有错题。去刷几道，答错的会自动进来。');
  if (store.progress(Q).done) {
    const r = h('div', 'row'); r.style.marginTop = '32px'; const b = h('button', 'btn', '清空做题记录'); b.type = 'button'; let armed = false;
    b.onclick = () => { if (!armed) { armed = true; b.textContent = '再点一次确认清空，无法恢复'; setTimeout(() => { armed = false; b.textContent = '清空做题记录'; }, 4000); return; } store.reset(); route(); };
    r.append(b); main.append(r);
  }
}
function errata() { main.append(head('原答案更正', '流传的答案里有错、不全或有争议的地方。点开题目看正确答案。')); const l = h('div', 'stack'); Q.filter(q => q.err || q.doubt).forEach(q => { const d = h('div', 'stack'); d.style.gap = '8px'; if (q.err) d.append(h('p', 'note err', q.err)); if (q.doubt) d.append(h('p', 'note doubt', '存疑：' + q.doubt)); d.append(renderQ(q)); l.append(d); }); main.append(l); }
function notFound() { main.append(head('没有这个页面', '链接可能写错了。')); main.append(link('#/', '回首页')); }

const R = { '': home, learn, topics, topic, sets, set, feed, wrong, errata };
function route() {
  if (location.hash && !location.hash.startsWith('#/')) return; // 跳转正文等普通锚点
  cleanup?.(); cleanup = null; const [p = '', id] = location.hash.replace(/^#\//, '').split('/'); main.replaceChildren(); (Object.hasOwn(R, p) ? R[p] : notFound)(id);
  const nav = { topic: 'topics', set: 'sets', errata: 'wrong' }[p] || p; document.querySelectorAll('[data-nav]').forEach(a => a.dataset.nav === nav ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const t = main.querySelector('h1')?.textContent; document.title = p ? `${t} · 算法考试速成` : '算法考试速成'; scrollTo(0, 0);
}
addEventListener('hashchange', route);
document.getElementById('theme').onclick = () => { const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('prune.theme', r.dataset.theme); } catch { /* 忽略 */ } };
route(); visitors(document.getElementById('visits'));
