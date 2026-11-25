import { Q, SETS } from './data/questions.js';
import { TOPICS, TIERS } from './data/topics.js';
import * as store from './store.js';
import { renderQ, h } from './question.js';
import { mountDemo } from './demos.js';
import { mountFeed } from './feed.js';
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
  const p = store.progress(Q), bad = Q.filter(q => ['no', 'mid'].includes(store.status(q.id))).length;
  const hd = h('div', 'home-h', `<div><h1>算法考试速成</h1><p class="soft">算法设计与分析期末复习，${real.length} 套往年卷 ${Q.length - ofSet('ex').length} 题，补充练习 ${ofSet('ex').length} 题。</p></div><div class="home-p"><div class="row"><span>会了 <b class="num">${p.ok}</b></span><span>做过 <b class="num">${p.done}</b></span><span>共 <b class="num">${p.all}</b></span></div><span class="bar wide"><b style="width:${pct(p)}%"></b></span></div>`);
  main.append(hd);
  main.append(h('section', 'modes', `
    <a class="m-feed" href="#/feed"><h2>随机刷</h2><p>一屏一题，上下滑</p></a>
    <a href="#/learn"><h2>学知识点</h2><p>${TOPICS.length} 课，讲解加例题</p></a>
    <a href="#/topics"><h2>按知识点刷</h2><p>哪里不会刷哪里</p></a>
    <a href="#/sets"><h2>按套刷</h2><p>练习或模拟考试</p></a>
    <a href="#/wrong"><h2>错题收藏</h2><p>${bad ? `还有 ${bad} 题不会` : '答错的会自动进来'}</p></a>
    <a href="#/errata"><h2>答案更正</h2><p>原答案有 ${Q.filter(q => q.err).length} 处改动</p></a>`));
  const cnt = (t, s) => Q.filter(q => q.set === s && q.t.includes(t)).length;
  main.append(h('section', 'sec', `<h2>考点和考频</h2><p class="soft small">数字是每套卷里的题数，一题可能考多个知识点。往年规律，不保证今年照考。</p><div class="scroll"><table class="heat"><thead><tr><th>知识点</th><th>重要性</th>${real.map(s => `<th>${s.name}</th>`).join('')}<th>已会</th></tr></thead><tbody>${TOPICS.map(t => `<tr><th><a href="#/learn/${t.id}">${t.name}</a></th><td>${tier(t)}</td>${real.map(s => `<td class="num">${cnt(t.id, s.id) || '<span class="soft">–</span>'}</td>`).join('')}<td>${bar(store.progress(ofTopic(t.id)))}</td></tr>`).join('')}</tbody></table></div>`));
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

/* 一题一页 + 答题卡 */
function runner(qs, { exam = false, from = 'undone' } = {}) {
  const g = h('div', 'run'), stage = h('div', 'run-stage'), side = h('aside', 'run-side'), sheet = h('div', 'card-grid'), bar = h('div', 'run-bar'), clock = h('span', 'num'), score = h('p', 'score');
  const mkb = (t, f, c = '') => { const b = h('button', 'btn ' + c, t); b.type = 'button'; b.onclick = f; return b; };
  let i = 0, submitted = false, t0 = Date.now(), timer = 0; const els = [], touched = new Set();
  const mark = k => { const b = sheet.children[k], e = els[k]; const r = exam && !submitted ? (touched.has(k) ? 'sel' : '') : exam ? (e?.result() || '') : store.status(qs[k].id); b.className = r + (k === i ? ' cur' : ''); b.ariaLabel = `第 ${k + 1} 题${{ ok: '，已会', mid: '，模糊', no: '，不会', sel: '，已作答' }[r] || ''}`; };
  const get = k => els[k] ||= (() => { const e = renderQ(qs[k], { mode: exam ? 'exam' : 'instant', index: k + 1, onDone: () => mark(k) }); const t = () => { if (exam && !submitted) { touched.add(k); mark(k); } }; e.addEventListener('input', t); e.addEventListener('click', ev => { if (ev.target.closest('.opt')) t(); }); return e; })();
  const show = k => { if (k < 0 || k >= qs.length) return; const o = i; i = k; stage.replaceChildren(get(k)); mark(o); mark(i); prev.disabled = !i; next.disabled = i === qs.length - 1; pos.textContent = `${i + 1} / ${qs.length}`; scrollTo(0, 0); };
  const prev = mkb('上一题', () => show(i - 1)), next = mkb('下一题', () => show(i + 1), 'pri'), pos = h('span', 'num soft'), tog = mkb('答题卡', () => { const on = side.classList.toggle('on'); tog.setAttribute('aria-expanded', on); }, 'tog'); tog.setAttribute('aria-expanded', 'false');
  qs.forEach((_, k) => { const b = h('button', '', k + 1); b.type = 'button'; b.onclick = () => { show(k); side.classList.remove('on'); tog.setAttribute('aria-expanded', 'false'); }; sheet.append(b); });
  side.append(h('h3', '', '答题卡'), sheet, h('p', 'legend small soft', exam ? '<i class="sel"></i>已作答 <i></i>未作答' : '<i class="ok"></i>会 <i class="mid"></i>模糊 <i class="no"></i>不会 <i></i>没做'));
  if (exam) {
    const tick = () => { const x = Math.floor((Date.now() - t0) / 1000); clock.textContent = `用时 ${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; }; tick(); timer = setInterval(tick, 1000);
    let armed = false; const sub = mkb('交卷', () => {
      const left = qs.length - touched.size; if (left && !armed) { armed = true; sub.textContent = `还有 ${left} 题没写，再点交卷`; setTimeout(() => { armed = false; if (!submitted) sub.textContent = '交卷'; }, 4000); return; }
      submitted = true; clearInterval(timer); tick(); qs.forEach((_, k) => { get(k).reveal(); }); qs.forEach((_, k) => mark(k));
      const ob = els.filter(e => e.q.type !== 'open'), ok = ob.filter(e => e.result() === 'ok').length; score.innerHTML = ob.length ? `客观题 ${ok} / ${ob.length}<small class="soft">解答题对照答案自评</small>` : '已交卷<small class="soft">对照答案自评</small>'; sub.remove(); side.querySelector('.legend').innerHTML = '<i class="ok"></i>会 <i class="mid"></i>模糊 <i class="no"></i>不会 <i></i>未自评'; side.classList.add('on'); tog.setAttribute('aria-expanded', 'true'); show(0);
    }, 'pri'); side.append(clock, score, sub);
  }
  const key = e => { if (e.target.matches?.('input,textarea') || e.metaKey || e.ctrlKey || e.altKey) return; if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1); };
  addEventListener('keydown', key);
  bar.append(prev, pos, next, tog); const left = h('div', 'run-main'); left.append(stage, bar); g.append(left, side);
  qs.forEach((_, k) => mark(k)); const f = exam ? 0 : qs.findIndex(q => !store.status(q.id)); show(f < 0 ? 0 : f);
  return { el: g, stop: () => { clearInterval(timer); removeEventListener('keydown', key); } };
}
function listing(qs, empty) {
  const F = { all: ['全部', () => true], todo: ['没做过', q => !store.status(q.id)], bad: ['不会或模糊', q => ['no', 'mid'].includes(store.status(q.id))], choice: ['选择', q => q.type === 'choice'], fill: ['填空', q => q.type === 'fill' || q.kind === '填空'], open: ['解答', q => q.type === 'open' && !q.kind] };
  if (!qs.length) { main.append(h('p', 'soft', empty)); return; }
  const chips = h('div', 'chips'), box = h('div'); box.style.marginTop = '20px'; let cur = null, list = qs, key = 'all';
  const draw = (k, sh) => { key = k; cur?.stop(); cur = null; list = qs.filter(F[k][1]); if (sh) list = list.map(q => [Math.random(), q]).sort((a, b) => a[0] - b[0]).map(x => x[1]); if (!list.length) { box.replaceChildren(h('p', 'soft', '这个筛选下没有题了。')); return; } cur = runner(list); box.replaceChildren(cur.el); };
  Object.entries(F).forEach(([k, [n, f]]) => { const c = qs.filter(f).length; if (!c && k !== 'all') return; const b = h('button', 'chip', `${n} ${c}`); b.type = 'button'; b.setAttribute('aria-pressed', k === 'all'); b.onclick = () => { [...chips.querySelectorAll('[aria-pressed]')].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  const sh = h('button', 'chip', '打乱'); sh.type = 'button'; sh.onclick = () => draw(key, true); chips.append(sh);
  main.append(chips, box); draw('all'); cleanup = () => cur?.stop();
}
function topics() {
  main.append(head('按知识点刷', '选一个知识点，真题在前，补充练习在后。'));
  main.append(h('div', 'list', TOPICS.map(t => { const p = store.progress(ofTopic(t.id)), n = ofTopic(t.id).filter(q => q.set !== 'ex').length; return `<a href="#/topic/${t.id}"><div><h3>${t.name}${tier(t)}</h3><p class="soft small">真题 ${n}，补充 ${p.all - n}</p></div><div class="r">${bar(p)}<span class="num">做过 ${p.done}/${p.all}</span></div></a>`; }).join('')));
}
function topic(id) { const t = TOPICS.find(x => x.id === id); if (!t) return notFound(); main.append(head(t.name, t.one)); const r = h('div', 'row'); r.style.marginBottom = '16px'; r.append(link(`#/learn/${id}`, '先看讲解')); main.append(r); listing(ofTopic(id)); }

/* 套卷 */
function sets() {
  main.append(head('按套刷', '练习边做边看答案；模拟考试计时，交卷后统一对答案。'));
  main.append(h('div', 'list', SETS.map(s => { const p = store.progress(ofSet(s.id)); return `<a href="#/set/${s.id}"><div><h3>${s.name}<small class="soft">${s.sub}</small></h3><p class="soft small">${s.note}</p></div><div class="r">${bar(p)}<span class="num">做过 ${p.done}/${p.all}</span></div></a>`; }).join('')));
}
function set(id) {
  const s = SETS.find(x => x.id === id); if (!s) return notFound(); const qs = ofSet(id);
  const top = h('div', 'set-top', `<h1>${s.name}<small class="soft">${s.sub}，${qs.length} 题</small></h1>`), chips = h('div', 'chips'), box = h('div'); top.append(chips); main.append(top, box); let cur = null;
  const draw = exam => { cur?.stop(); cur = runner(qs, { exam }); box.replaceChildren(cur.el); };
  [[false, '练习'], [true, '模拟考试']].forEach(([k, n]) => { const b = h('button', 'chip', n); b.type = 'button'; b.setAttribute('aria-pressed', !k); b.onclick = () => { if (b.getAttribute('aria-pressed') === 'true') return; [...chips.children].forEach(x => x.setAttribute('aria-pressed', x === b)); draw(k); }; chips.append(b); });
  draw(false); cleanup = () => cur?.stop();
}

function feed() { cleanup = mountFeed(main); }

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
  const t = main.querySelector('h1')?.firstChild.textContent || '随机刷'; document.title = p ? `${t} · 算法考试速成` : '算法考试速成'; scrollTo(0, 0);
}
addEventListener('hashchange', route);
document.getElementById('theme').onclick = () => { const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('prune.theme', r.dataset.theme); } catch { /* 忽略 */ } };
route(); visitors(document.getElementById('visits'));
