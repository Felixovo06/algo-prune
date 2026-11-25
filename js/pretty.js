// 代码块：语法高亮 + 复制。含输入框的代码填空不动。
import { icon } from './art.js';
const KW = /^(int|void|bool|float|double|char|string|const|return|if|else|for|while|break|new|struct|true|false|auto|vector|pair|template|class|then|to|do|not|and|or|min|max|while|output)$/;
const RE = /(\/\/[^\n]*)|("[^"\n]*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const highlight = t => { let o = '', i = 0; for (const m of t.matchAll(RE)) { o += esc(t.slice(i, m.index)); const x = esc(m[0]); o += m[1] ? `<i class="c">${x}</i>` : m[2] ? `<i class="s">${x}</i>` : m[3] ? `<i class="n">${x}</i>` : KW.test(m[0]) ? `<i class="k">${x}</i>` : t[m.index + m[0].length] === '(' ? `<i class="f">${x}</i>` : x; i = m.index + m[0].length; } return o + esc(t.slice(i)); };
function deco(pre) {
  if (pre.dataset.done || pre.querySelector('input')) return; pre.dataset.done = 1;
  const code = pre.querySelector('code') || pre, t = code.textContent, isCode = /[;{}]|\bfor\b|\bif\b/.test(t) && t.includes('\n');
  if (!isCode) return; code.innerHTML = highlight(t);
  const w = document.createElement('div'); w.className = 'codebox'; pre.replaceWith(w); w.append(pre);
  if (t.split('\n').length < 6) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.innerHTML = icon('copy') + '<span>复制</span>';
  b.onclick = async () => { let ok = true; try { await navigator.clipboard.writeText(t); } catch { ok = false; const s = getSelection(), r = document.createRange(); r.selectNodeContents(code); s.removeAllRanges(); s.addRange(r); } b.lastChild.textContent = ok ? '已复制' : '已选中'; setTimeout(() => { b.lastChild.textContent = '复制'; }, 1500); };
  w.append(b);
}
export const pretty = root => root.querySelectorAll('pre').forEach(deco);
export const watch = () => new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) { if (n.matches('pre')) deco(n); else pretty(n); } }).observe(document.body, { childList: true, subtree: true });
