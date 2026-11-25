// 发布前运行：npm run stamp。给 CSS/JS 打内容版本号，避免浏览器新旧文件混用。
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const mods = ['store', 'question', 'demos', 'algos', 'visitors', 'data/questions', 'data/topics'].map(m => `js/${m}.js`);
const v = createHash('sha256').update([...mods, 'js/app.js', 'css/style.css'].map(f => readFileSync(f)).join('')).digest('hex').slice(0, 8);
const map = JSON.stringify({ imports: Object.fromEntries(mods.map(m => [`./${m}`, `./${m}?v=${v}`])) });
let s = readFileSync('index.html', 'utf8');
s = s.replace(/<script type="importmap">.*?<\/script>\n/s, '');
s = s.replace(/<link rel="stylesheet" href="css\/style\.css[^"]*">/, `<link rel="stylesheet" href="css/style.css?v=${v}">`);
s = s.replace(/<script type="module" src="js\/app\.js[^"]*">/, `<script type="importmap">${map}</script>\n<script type="module" src="js/app.js?v=${v}">`);
writeFileSync('index.html', s);
console.log('version', v);
