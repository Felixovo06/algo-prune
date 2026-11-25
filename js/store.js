// 做题记录，只存浏览器本地；读写失败时退化为内存
const KEY = 'prune.v1';
let d = { p: {}, star: {} };
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.p && s.star) d = s; } catch { /* 无痕模式等 */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* 忽略 */ } };
export const status = id => d.p[id]?.s || '';
export const setStatus = (id, s) => { d.p[id] = { s, n: (d.p[id]?.n || 0) + 1, t: Date.now() }; save(); };
export const starred = id => !!d.star[id];
export const toggleStar = id => { if (d.star[id]) delete d.star[id]; else d.star[id] = 1; save(); return starred(id); };
export const progress = qs => ({ done: qs.filter(q => status(q.id)).length, ok: qs.filter(q => status(q.id) === 'ok').length, all: qs.length });
export const reset = () => { d = { p: {}, star: {} }; save(); };
