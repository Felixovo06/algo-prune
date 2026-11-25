// 题库。type: choice 单选 | fill 填空（可自动判）| open 主观（自评）
// a: choice=下标；fill=每空可接受答案；open=参考答案 HTML
// err=原答案有误的更正；doubt=有争议或题干存疑；any=填空不计顺序
export const SETS = [
  { id: 's23', name: '2023–2024', sub: '第一学期期末', note: '填空 20 分、选择、简答 20 分、综合。附带答案有几处更正。' },
  { id: 's22', name: '2022–2023', sub: '第一学期期末', note: '四道大题，原卷没有答案，这里补全。' },
  { id: 's21', name: '2021–2022', sub: '第一学期期末', note: '填空 20、简答 30、综合 50。原答案错误较多，已逐题更正。' },
  { id: 'sa', name: 'A 卷', sub: '无年份', note: '含线性规划、概率算法、NP，像是另一套考纲。老师没讲可以跳过。' },
  { id: 'ex', name: '补充练习', sub: '本站自编', note: '按同样的题型补的练习，不是真题。' },
];

const tree22 = `<div class="tbl"><table><tr><th>结点</th><td>根</td><td>1</td><td>0</td><td>11</td><td>10</td><td>01</td><td>00</td></tr><tr><th>上界</th><td>24</td><td>24</td><td>22</td><td>24</td><td>18</td><td>22</td><td>12</td></tr></table></div><p>叶子：111 超重；110=16，101=18，100=6，011=<b>22</b>，010=10，001=12，000=0。</p>`;

const huffProof = `<p>设 T 是 C 的一棵最优前缀码树，a、b 是 T 中<mark>最深的一对兄弟叶子</mark>。不妨设 f(x)≤f(y)，f(a)≤f(b)。x、y 频率最小，所以 f(x)≤f(a)，f(y)≤f(b)。</p>
<p>① 交换 x 与 a 得到 T′：</p>
<pre><code>B(T) − B(T′)
= f(x)d(x) + f(a)d(a) − f(x)d(a) − f(a)d(x)
= [f(a) − f(x)] · [d(a) − d(x)]  ≥ 0</code></pre>
<p>其中 d 是在 T 中的深度，a 最深，所以 d(a)≥d(x)。</p>
<p>② 同理，在 T′ 中交换 y 与 b 得到 T″，B(T′)−B(T″)≥0。</p>
<p>③ 于是 B(T″)≤B(T)。T 已经最优，所以 B(T″)=B(T)，<mark>T″ 也是最优前缀码树</mark>。在 T″ 中 x、y 是最深层的兄弟，编码等长且仅最后一位不同。∎</p>`;

const bsCode = `<pre><code>int BinarySearch(Type a[], const Type&amp; x, int n)
{   // a[0..n-1] 已升序；找到返回下标，否则返回 -1
    int l = 0, r = n - 1;
    while (l &lt;= r) {
        int m = (l + r) / 2;
        if (x == a[m]) return m;
        if (x &lt; a[m]) r = m - 1;
        else          l = m + 1;
    }
    return -1;
}</code></pre>`;

const mergeSolve = `<pre><code>T(1) = 1
T(n) = 2T(n/2) + n        (n &gt; 1)

两边除以 n：
T(n)/n     = T(n/2)/(n/2) + 1
T(n/2)/(n/2) = T(n/4)/(n/4) + 1
……
T(2)/2     = T(1)/1 + 1

共 log n 个式子，累加消去中间项：
T(n)/n = T(1) + log n
T(n)   = n log n + n = O(n log n)</code></pre>`;

const vsBT = `<p><b>相同：</b>都在问题的<mark>解空间树</mark>上搜索，都用约束函数和限界函数剪枝。</p>
<div class="tbl"><table><tr><th></th><th>回溯法</th><th>分支限界法</th></tr>
<tr><th>求解目标</th><td>通常找出<b>所有</b>解</td><td>找<b>一个</b>解或<b>最优</b>解</td></tr>
<tr><th>搜索方式</th><td>深度优先</td><td>广度优先，或最小耗费（最大效益）优先</td></tr>
<tr><th>扩展方式</th><td>一个结点可<b>多次</b>成为活结点，逐个生成孩子</td><td>活结点只有<b>一次</b>机会成为扩展结点，一次生成全部孩子</td></tr>
<tr><th>存储空间</th><td>小，只存当前路径</td><td>大，要存活结点表</td></tr></table></div>`;

const dpSteps = `<ol><li>分析最优<b>解</b>的性质，刻画其结构特征（最优子结构）</li><li><mark>递归地定义最优值</mark></li><li>以<mark>自底向上</mark>的方式计算最优<b>值</b></li><li>根据计算时记录的信息，<mark>构造最优解</mark></li></ol>`;

export const Q = [
/* ───────── 2023–2024 ───────── */
{ id: 's23-1', set: 's23', no: '填空 1', t: ['basics'], type: 'fill', q: '算法是解决 ___ 的一种方法或过程，它具有输入、输出、确定性和 ___ 等性质。', a: [['问题'], ['有限性', '有穷性']], ex: '<p>算法四条性质：<mark>输入、输出、确定性、有限性</mark>。程序可以不满足有限性（例如操作系统）。</p>' },
{ id: 's23-2', set: 's23', no: '填空 2', t: ['complexity'], type: 'fill', q: '忽略常数因子，O、Ω、θ 三个记号中，___ 给出算法运行时间的一个上界。', a: [['O', '大O', 'O记号']], ex: '<p>O 上界，Ω 下界，θ 紧确界（同阶）。</p>' },
{ id: 's23-3', set: 's23', no: '填空 3', t: ['divide'], type: 'fill', q: '用分治法设计的程序一般是递归的，所以它的效率通常用 ___ 来分析。', a: [['递归方程', '递归式', '递推方程']], ex: '<p>例如合并排序 T(n)=2T(n/2)+O(n)。</p>' },
{ id: 's23-4', set: 's23', no: '填空 4', t: ['dp'], type: 'fill', any: true, q: '动态规划适用的问题要具备 ___ 和 ___ 两条性质。', a: [['最优子结构'], ['重叠子问题', '子问题重叠', '重复子问题']], ex: '<p>贪心则是<mark>贪心选择性质 + 最优子结构</mark>，两者共有最优子结构。</p>' },
{ id: 's23-5', set: 's23', no: '填空 5', t: ['greedy'], type: 'fill', q: '要证明贪心算法能得到最优解，归纳成立的基础是问题具有 ___ 性质。', a: [['贪心选择', '贪心选择性']], ex: '<p>贪心选择性质：整体最优解可以通过一系列局部最优的选择得到。</p>' },
{ id: 's23-6', set: 's23', no: '填空 6', t: ['greedy'], type: 'open', kind: '填空', q: '用贪心算法求解活动安排问题，每次安排怎样的活动？', a: '<p>与已选活动<mark>相容</mark>、且<mark>结束时间最早</mark>的活动。</p>', ex: '<p>这样留给后面活动的时间最多。先按结束时间升序排序，排序 O(n log n)，选择 O(n)。</p>' },
{ id: 's23-7', set: 's23', no: '填空 7', t: ['graph'], type: 'fill', q: 'Prim 算法用来求解 ___ 问题。', a: [['最小生成树', 'MST']], ex: '<p>Prim 选点、Kruskal 选边，都是求最小生成树的贪心算法；Dijkstra 求单源最短路径。</p>' },
{ id: 's23-8', set: 's23', no: '填空 8', t: ['backtrack'], type: 'fill', q: '回溯法按 ___ 策略搜索解空间。', a: [['深度优先', 'DFS', '深度优先搜索']], ex: '<p>回溯 = 深度优先 + 剪枝。</p>' },
{ id: 's23-9', set: 's23', no: '填空 9', t: ['bnb'], type: 'fill', any: true, q: '分支限界法按 ___ 或 ___ 的策略搜索解空间。', a: [['广度优先', 'BFS'], ['最小耗费优先', '最大效益优先', '最小耗费', '最大效益']], ex: '<p>对应队列式（FIFO）和优先队列式两种。</p>' },
{ id: 's23-10', set: 's23', no: '填空 10', t: ['backtrack'], type: 'fill', q: '旅行商问题的解空间可以组织成一棵 ___ 树。', a: [['排列', '排列树']], ex: '<p>选不选 → <b>子集树</b>（2<sup>n</sup> 个叶子，如 0-1 背包）；排顺序 → <b>排列树</b>（n! 个叶子，如旅行商）。</p>' },
{ id: 's23-c1', set: 's23', no: '选择 1', t: ['complexity'], type: 'choice', q: '下列函数中，渐近阶最高的是：', opts: ['2n', 'n log n', 'n·√n', 'n log(log n)'], a: 2, ex: '<p>都除以 n 再比：2、log n、√n、log log n。<mark>√n 比任何对数都快</mark>。</p>' },
{ id: 's23-c2', set: 's23', no: '选择 2', t: ['select'], type: 'choice', q: '线性时间选择算法的一次执行流程中，发生几次递归调用？', opts: ['1', '2', '3', '0'], a: 1, ex: '<p>一次用来求<b>中位数的中位数</b>，一次在<b>划分后的那一半</b>里继续找。</p>' },
{ id: 's23-c3', set: 's23', no: '选择 3', t: ['divide'], type: 'choice', q: '最坏情况下，下列排序算法中最快的是：', opts: ['冒泡排序', '快速排序', '插入排序', '合并排序'], a: 3, ex: '<p>合并排序最坏也是 O(n log n)；快速排序最坏 O(n²)。</p>' },
{ id: 's23-c4', set: 's23', no: '选择 4', t: ['knapsack'], type: 'choice', q: '0-1 背包问题的形式化描述中，优化目标是 max 下列哪一项？', opts: ['Σ vᵢxᵢ', 'Σ wᵢxᵢ', 'Σ xᵢ', 'Σ wᵢ'], a: 0, ex: '<p>目标 max Σvᵢxᵢ，约束 Σwᵢxᵢ ≤ C，xᵢ∈{0,1}。</p>', doubt: '原卷四个选项都多印了“≤ C”，这里去掉了。' },
{ id: 's23-c5', set: 's23', no: '选择 5', t: ['dp'], type: 'choice', q: '矩阵连乘问题，n=9，m[i,j] 表示计算 Aᵢ…Aⱼ 的最少乘法次数。动态规划填表时，下列哪一项最晚填出？', opts: ['m[9,9]', 'm[7,8]', 'm[4,6]', 'm[1,5]'], a: 3, ex: '<p>按<mark>链长</mark>从小到大（沿对角线）填。链长依次是 1、2、3、5，最长的最晚。</p>' },
{ id: 's23-c6', set: 's23', no: '选择 6', t: ['graph'], type: 'choice', q: 'Dijkstra 算法的时间复杂度是：', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], a: 2, ex: '<p>数组实现：n 轮，每轮 O(n) 选最小并松弛，共 <mark>O(n²)</mark>。用堆是 O((n+e) log n)，不在选项里。</p>', err: '原答案给 B，应为 C。' },
{ id: 's23-c7', set: 's23', no: '选择 7', t: ['huffman'], type: 'choice', q: '关于前缀码二叉树，下列说法错误的是：', opts: ['左右分支分别表示 0 和 1', '字符都位于叶子结点上', '中间结点的出度可能为 1 或 2', '代价是每个叶子的权重乘以深度再求和'], a: 2, ex: '<p>如果指<b>最优</b>前缀码树，每个中间结点都恰好有两个孩子，所以 C 错。</p>', doubt: '原答案给 A，有争议：一般（非最优）前缀码树的出度确实可以为 1，而 0/1 分配只是约定。本站按“最优前缀码树”判 C，建议问老师。' },
{ id: 's23-c8', set: 's23', no: '选择 8', t: ['knapsack', 'bnb'], type: 'choice', q: '0-1 背包，物品（价值, 重量）为 (10,2)、(8,2)、(9,3)、(6,3)、(5,5)，C=12。部分解 (0,1,1) 的上界是：', opts: ['17', '27', '28', '38'], a: 1, ex: '<p>已装：价值 8+9=17，重量 5，剩 7。装 (6,3) 剩 4，再装 (5,5) 的 4/5 得 4。<mark>17+6+4=27</mark>。</p>' },
{ id: 's23-c9', set: 's23', no: '选择 9', t: ['bnb', 'backtrack'], type: 'choice', q: '关于回溯法和分支限界法，下列描述错误的是：', opts: ['回溯法中解空间的结点可能多次成为扩展结点', '分支限界法中结点只有 1 次机会成为扩展结点', '回溯法消耗的时间比分支限界法多', '分支限界法消耗的空间比回溯法少'], a: 3, ex: '<p>分支限界要存活结点表，<mark>空间更大</mark>。C 说得也不严谨，但 D 是明确错误的。</p>' },
{ id: 's23-c10', set: 's23', no: '选择 10', t: ['backtrack'], type: 'choice', q: '排列树的回溯算法，空白处应填：<pre><code>void Backtrack(int t) {\n  if (t &gt; n) 输出 x;\n  else\n    for (i = t; i &lt;= n; i++) {\n      Swap(x[t], x[i]);\n      if (Constraint(t) &amp;&amp; Bound(t))\n        Backtrack(t + 1);\n      ( 空白处 )\n    }\n}</code></pre>', opts: ['Swap(x[t], x[i])', 'else return', 'else Backtrack(t-1)', '不填'], a: 0, ex: '<p>递归回来要<mark>恢复现场</mark>，把交换的元素换回去。</p>' },
{ id: 's23-j1', set: 's23', no: '简答 1', pts: 5, t: ['divide'], type: 'open', q: '简述分治法的基本思想。', a: '<ul><li><b>分</b>：把规模较大的问题分成 k 个规模更小、<mark>互相独立、与原问题形式相同</mark>的子问题；子问题仍不够小就继续分。</li><li><b>治</b>：子问题足够小时直接求解，否则递归求解。</li><li><b>合</b>：把子问题的解合并，自底向上得到原问题的解。</li></ul>', ex: '<p>和动态规划的区别：分治的子问题<b>互相独立</b>，动态规划的子问题<b>重叠</b>。</p>' },
{ id: 's23-j2', set: 's23', no: '简答 2', pts: 5, t: ['greedy', 'dp'], type: 'open', q: '简述动态规划和贪心算法的异同点。', a: '<p><b>相同：</b>都要求问题具有<mark>最优子结构</mark>，都用来求最优化问题。</p><div class="tbl"><table><tr><th></th><th>动态规划</th><th>贪心</th></tr><tr><th>另一条性质</th><td>重叠子问题</td><td>贪心选择性质</td></tr><tr><th>方向</th><td>自底向上</td><td>自顶向下</td></tr><tr><th>做选择</th><td>依赖子问题的解，先解子问题再选</td><td>先做当前最好的选择，再解剩下的子问题</td></tr><tr><th>结果</th><td>保证最优</td><td>要证明贪心选择性质才保证最优</td></tr></table></div>', ex: '' },
{ id: 's23-j3', set: 's23', no: '简答 3', pts: 5, t: ['bnb', 'backtrack'], type: 'open', q: '简述分支限界法和回溯法的异同点。', a: vsBT, ex: '', err: '原答案“结点遍历方式”一条的先后写反了：多次成为活结点的是回溯法，一次的是分支限界法。' },
{ id: 's23-j4', set: 's23', no: '简答 4', pts: 5, t: ['open'], type: 'open', q: '结合学过的算法理论和实践，阐述 1–2 个算法对你生活或学习的启示。', a: '<p>套路：<mark>算法思想 + 具体的事 + 局限或反思</mark>。两个可以改写的例子：</p><ul><li><b>分治</b>：把“期末复习”拆成按知识点的小块，各个击破，再用套卷合起来检验。</li><li><b>贪心的局限</b>：每天只做眼前最容易的事，局部最优不等于整体最优；需要先确认“贪心选择性质”成立，也就是眼前的选择不会毁掉长远目标。</li></ul>', ex: '<p>自由发挥题，写自己的例子，避免雷同。</p>' },
{ id: 's23-z1', set: 's23', no: '综合 1', t: ['divide'], type: 'open', q: '写出标准的二分搜索算法，给出时间复杂度的递归方程，并推导出具体的时间复杂度。', a: bsCode + `<pre><code>T(n) = 1               n ≤ 1
T(n) = T(n/2) + 1      n &gt; 1

T(n) = T(n/2) + 1
     = T(n/4) + 2
     = ……
     = T(n/2^k) + k
令 n/2^k = 1，k = log n
T(n) = T(1) + log n = log n + 1 = O(log n)</code></pre>`, ex: '<p>常见失分：循环条件写成 <code>l &lt; r</code>；更新时忘了 <code>±1</code>。</p>' },
{ id: 's23-z2', set: 's23', no: '综合 2(1)', pts: 7, t: ['huffman'], type: 'open', demo: 'huffman', q: '字符 u、v、w、x、y、z 的频率为 45、13、12、16、9、5。画出哈夫曼树的每一步构造过程，写出每个字符的编码。', a: '<p>合并顺序：5+9=14 → 12+13=25 → 14+16=30 → <b>25+30=55</b> → 45+55=100。</p><div class="tbl"><table><tr><th>字符</th><td>u</td><td>v</td><td>w</td><td>x</td><td>y</td><td>z</td></tr><tr><th>编码</th><td>0</td><td>101</td><td>100</td><td>111</td><td>1101</td><td>1100</td></tr></table></div><p>总代价 = 14+25+30+55+100 = <mark>224</mark>。</p>', ex: '<p>小的放左（0）、大的放右（1）。交换左右也正确，但编码要和自己画的树一致。</p>', err: '原答案的图漏了 25+30=55 这一步，题目要求画出每一步。' },
{ id: 's23-z2b', set: 's23', no: '综合 2(2)', pts: 8, t: ['huffman'], type: 'open', q: '证明哈夫曼算法的贪心选择性质：x、y 是字符集 C 中频率最小的两个字符，则存在 C 的一个最优前缀码，使 x 与 y 的编码等长且仅最后一位不同。', a: huffProof, ex: '', err: '原答案只有一步不等式，缺前提和第二次交换。' },
{ id: 's23-z3', set: 's23', no: '综合 3', pts: 20, t: ['knapsack', 'backtrack'], type: 'open', demo: 'knap23', q: '载重 5 吨的货轮要运三辆汽车，价值 10、12、6，重量 2、3、1，只运一次，使总价值最大。(1) 形式化描述和约束函数；(2) 可用哪些算法；(3) 回溯法的解空间树；(4) bound 函数的贪心计算方法；(5) 最优值和最优解。', a: '<p><b>(1)</b> 输入 {&lt;2,10&gt;,&lt;3,12&gt;,&lt;1,6&gt;}，C=5；输出 (x₁,x₂,x₃)，xᵢ∈{0,1}。</p><pre><code>max Σ vᵢxᵢ    约束：Σ wᵢxᵢ ≤ C，xᵢ ∈ {0,1}</code></pre><p><b>(2)</b> 动态规划、回溯法、分支限界法。（贪心不能保证最优。）</p><p><b>(3)</b> 深度为 3 的满二叉树，左分支 xᵢ=1，右分支 xᵢ=0，8 个叶子。</p><p><b>(4)</b> bound = p + q。p 是已装价值；q 是把剩余物品按<mark>单位价值从高到低、可分割</mark>地装满剩余容量得到的价值。</p><p><b>(5)</b> 最优解 <b>(1,1,0)</b>，最优值 <b>22</b>。</p>', ex: '<p>算 bound 前先按单位价值排序：汽车 3（6）、汽车 1（5）、汽车 2（4）。</p>', err: '原答案说 q 是剩余问题的“最优解”，不准确，应是可分割（部分背包）的贪心值。' },

/* ───────── 2022–2023 ───────── */
{ id: 's22-1', set: 's22', no: '第一题', t: ['complexity'], type: 'open', q: '说明符号 Ω 的含义。', a: '<p>Ω 表示渐近<mark>下界</mark>。</p><p>若存在正常数 c 和 n₀，使得当 n≥n₀ 时有 <b>0 ≤ c·g(n) ≤ f(n)</b>，则记 f(n)=Ω(g(n))。即忽略常数因子，f(n) 的阶不低于 g(n) 的阶。</p>', ex: '<p>O 的定义把不等号换成 f(n) ≤ c·g(n)；θ 是两边都成立。</p>' },
{ id: 's22-2', set: 's22', no: '第二题', t: ['divide'], type: 'open', q: '给出合并排序的时间复杂度递归式，并详细推导。', a: mergeSolve, ex: '<p>除以 n 再累加是最稳的写法，每一步都能拿分。</p>' },
{ id: 's22-3a', set: 's22', no: '第三题 (1)(2)(3)', t: ['knapsack', 'backtrack'], type: 'open', demo: 'knap22', q: '三个珠宝价值 6、10、12，重量 1、2、3，背包容量 5。(1) 形式化描述及约束函数；(2) 解空间树；(3) bound 的计算方法，并给出每个结点的上界。', a: '<p><b>(1)</b> max Σvᵢxᵢ，约束 Σwᵢxᵢ ≤ 5，xᵢ∈{0,1}。</p><p><b>(2)</b> 深度为 3 的满二叉树，左 1 右 0。</p><p><b>(3)</b> bound = 已装价值 + 剩余容量按单位价值从高到低装剩余物品的价值，最后一件装不下就按比例取。单位价值 6、5、4，已经有序。例如根：6+10+12×(2/3)=24。</p>' + tree22, ex: '' },
{ id: 's22-3b', set: 's22', no: '第三题 (4)', t: ['knapsack', 'backtrack'], type: 'open', demo: 'knap22', q: '接上题，写出用回溯法求解的扩展结点表。', a: '<div class="tbl"><table><tr><th>扩展结点</th><th>情况</th><th>当前最优</th></tr><tr><td>根</td><td>进入左子树</td><td>0</td></tr><tr><td>1</td><td>进入左子树</td><td>0</td></tr><tr><td>11</td><td>111 超重；到 110</td><td>16</td></tr><tr><td>10</td><td>上界 18&gt;16；到 101；100 上界 6 剪</td><td>18</td></tr><tr><td>0</td><td>上界 22&gt;18</td><td>18</td></tr><tr><td>01</td><td>到 011；010 上界 10 剪</td><td><b>22</b></td></tr><tr><td>—</td><td>00 上界 12 剪，结束</td><td><b>22</b></td></tr></table></div>', ex: '<p>左孩子看<b>约束函数</b>（超不超重），右孩子看<b>限界函数</b>（上界是否大于当前最优）。</p>' },
{ id: 's22-3c', set: 's22', no: '第三题 (5)', t: ['knapsack', 'bnb'], type: 'open', demo: 'knap22', q: '接上题，给出用优先队列式分支限界法求解的活结点表。', a: '<div class="tbl"><table><tr><th>扩展结点</th><th>扩展后的活结点表（括号内为上界）</th></tr><tr><td>根</td><td>1(24), 0(22)</td></tr><tr><td>1</td><td>11(24), 0(22), 10(18)</td></tr><tr><td>11</td><td>0(22), 10(18), 110(16)</td></tr><tr><td>0</td><td>01(22), 10(18), 110(16)；00(12) 剪</td></tr><tr><td>01</td><td>011(22), 10(18), 110(16)；010(10) 剪</td></tr><tr><td>011</td><td>是叶子，结束：<b>(0,1,1)，价值 22</b></td></tr></table></div>', ex: '<p>这里用了当前最优值剪枝。若老师的写法只剪超重结点，00 和 010 要留在表里，最后答案不变。</p>' },
{ id: 's22-4', set: 's22', no: '第四题', t: ['dp'], type: 'open', q: 'n×n 的表格，每格一个正整数 reward[i][j]。从左上角出发只能向下或向右走到右下角，路径数字之和为收益，求最大收益。(1) 最优值递归式；(2) 动态规划算法；(3) 时间和空间复杂度。', a: `<p><b>(1)</b> 设 d[i][j] 为走到 (i,j) 的最大收益（下标从 0 开始）：</p><pre><code>d[0][0] = reward[0][0]
d[0][j] = d[0][j-1] + reward[0][j]              首行只能从左来
d[i][0] = d[i-1][0] + reward[i][0]              首列只能从上来
d[i][j] = max(d[i-1][j], d[i][j-1]) + reward[i][j]</code></pre><p><b>(2)</b></p><pre><code>int MaxBonus(int reward[N][N], int n)
{
    int d[N][N];
    d[0][0] = reward[0][0];
    for (int k = 1; k &lt; n; k++) {
        d[0][k] = d[0][k-1] + reward[0][k];
        d[k][0] = d[k-1][0] + reward[k][0];
    }
    for (int i = 1; i &lt; n; i++)
        for (int j = 1; j &lt; n; j++)
            d[i][j] = max(d[i-1][j], d[i][j-1]) + reward[i][j];
    return d[n-1][n-1];
}</code></pre><p><b>(3)</b> 时间 <mark>O(n²)</mark>，空间 <mark>O(n²)</mark>；用滚动数组空间可降到 O(n)。</p>`, ex: '<p>别漏边界，首行首列单独处理。</p>' },

/* ───────── 2021–2022 ───────── */
{ id: 's21-1', set: 's21', no: '填空 1', t: ['basics'], type: 'fill', any: true, q: '算法的四个基本要素包括：输入、输出、___、___。', a: [['确定性'], ['有限性', '有穷性']], ex: '<p>和 2023 年填空 1 是同一个考点。</p>', err: '原答案此题空缺，本站补全。' },
{ id: 's21-2', set: 's21', no: '填空 2', t: ['complexity'], type: 'fill', q: '算法时间复杂性分析一般分析 ___ 情况下的时间复杂性。', a: [['最坏']], ex: '<p>最坏情况给出上界保证，而且容易分析。</p>' },
{ id: 's21-3', set: 's21', no: '填空 3', t: ['complexity'], type: 'open', kind: '填空', q: '把 96n⁵、2018、6ⁿ、865n+720、nⁿ、19 log n、7n!+40n² 按渐近阶从低到高排列。', a: '<p>2018 &lt; 19 log n &lt; 865n+720 &lt; 96n⁵ &lt; 6ⁿ &lt; 7n!+40n² &lt; nⁿ</p>', ex: '<p><mark>常数 &lt; 对数 &lt; 多项式 &lt; 指数 &lt; 阶乘 &lt; nⁿ</mark></p>' },
{ id: 's21-4', set: 's21', no: '填空 4', t: ['select'], type: 'fill', demo: 'mom', q: '数据 {8,33,17,51,57, 49,35,11,25,37, 14,3,2,13,52, 12,6,28,32,54, 5,16,22,23,7}，n=25，线性时间选择（不考虑边界条件）最外层取出的划分基准是 ___。', a: [['28']], ex: '<p>5 个一组，各组中位数 33、35、13、28、16；排序 13、16、<mark>28</mark>、33、35，取中间。</p>', err: '原答案给 8，应为 28。' },
{ id: 's21-5', set: 's21', no: '填空 5', t: ['divide'], type: 'open', kind: '填空', q: '快速排序的时间复杂度是多少？（分别写平均和最坏）', a: '<p>平均 <b>O(n log n)</b>，最坏 <b>O(n²)</b>。</p>', ex: '<p>最坏发生在每次划分极不平衡，例如取首元素为基准而输入已有序：T(n)=T(n−1)+O(n)。</p>', doubt: '原卷题干被水印遮住，看不出问的是平均还是最坏；原答案写 O(n log n)。' },
{ id: 's21-6', set: 's21', no: '填空 6', t: ['lcs'], type: 'fill', demo: 'lcs21a', q: 'X={B,C,A,D,B,C,D}，Y={A,C,B,A,B,D,C,D}，给出一个最长公共子序列 ___。', a: [['CABCD', 'BABCD', 'BADCD', 'CADCD']], ex: '<p>长度为 5，共四个：CABCD、BABCD、BADCD、CADCD，写任意一个即可。</p>' },
{ id: 's21-7', set: 's21', no: '填空 7', t: ['greedy'], type: 'fill', q: '问题具备最优子结构和 ___ 性质时，可以用贪心算法求解。', a: [['贪心选择', '贪心选择性']], ex: '' },
{ id: 's21-8', set: 's21', no: '填空 8', t: ['backtrack'], type: 'fill', any: true, q: '回溯法搜索解空间时，一般用 ___ 函数和 ___ 函数剪枝。', a: [['约束', '约束函数'], ['限界', '限界函数', '界限']], ex: '<p>约束函数剪去<b>不可行</b>的子树，限界函数剪去<b>得不到最优解</b>的子树。</p>' },
{ id: 's21-j1', set: 's21', no: '简答 1', pts: 5, t: ['divide'], type: 'open', q: '写出合并排序的时间复杂性递归方程，并求解。', a: mergeSolve, ex: '' },
{ id: 's21-j2', set: 's21', no: '简答 2', pts: 5, t: ['bnb', 'backtrack'], type: 'open', q: '简述分支限界法与回溯法的异同点。', a: vsBT, ex: '<p>只写“求解目标不同”这样的标题不够，要写出各自是什么。</p>' },
{ id: 's21-j3', set: 's21', no: '简答 3', pts: 5, t: ['divide'], type: 'open', q: '用算法的标准书写规则写出二分搜索算法。', a: bsCode, ex: '' },
{ id: 's21-j4', set: 's21', no: '简答 4', pts: 5, t: ['dp'], type: 'open', q: '写出设计动态规划算法的主要步骤。', a: dpSteps, ex: '<p>前三步的用词要分清：(2)(3) 是最优<b>值</b>，(4) 才是最优<b>解</b>。</p>', err: '原答案 (2)(3) 写成“最优解”，应为“最优值”。' },
{ id: 's21-j5', set: 's21', no: '简答 5', pts: 10, t: ['open'], type: 'open', q: '结合具体例子，阐述中国共产党领导人民实现民族复兴的奋斗过程中，体现了哪些算法设计与分析的思想。', a: '<p>每条写 <mark>算法思想 → 史实 → 对应关系</mark>，写两三条即可：</p><ul><li><b>分治</b>：解放战争“集中优势兵力，各个歼灭敌人”，把大问题拆成可以单独解决的小问题。</li><li><b>动态规划</b>：连续制定五年规划，后一阶段以前一阶段的成果为基础，逐步逼近长远目标。</li><li><b>回溯</b>：遵义会议纠正错误路线，走不通就退回，重新选择方向。</li></ul>', ex: '<p>开放题，用自己的话写，避免雷同。</p>' },
{ id: 's21-z1a', set: 's21', no: '综合 1(1)', pts: 5, t: ['lcs', 'dp'], type: 'open', q: '分析最长公共子序列问题的最优子结构性质，并给出最优值的递归表达式。', a: `<p><b>最优子结构</b>：设 Z={z₁,…,z_k} 是 X={x₁,…,x_m}、Y={y₁,…,y_n} 的 LCS。</p><ul><li>若 x_m = y_n，则 z_k = x_m = y_n，且 Z<sub>k−1</sub> 是 X<sub>m−1</sub> 和 Y<sub>n−1</sub> 的 LCS。</li><li>若 x_m ≠ y_n 且 z_k ≠ x_m，则 Z 是 X<sub>m−1</sub> 和 Y 的 LCS。</li><li>若 x_m ≠ y_n 且 z_k ≠ y_n，则 Z 是 X 和 Y<sub>n−1</sub> 的 LCS。</li></ul><pre><code>c[i][j] = 0                              i=0 或 j=0
c[i][j] = c[i-1][j-1] + 1                i,j&gt;0 且 xᵢ = yⱼ
c[i][j] = max(c[i-1][j], c[i][j-1])      i,j&gt;0 且 xᵢ ≠ yⱼ</code></pre>`, ex: '', err: '原答案只有后两行，漏了边界和最优子结构的分析。' },
{ id: 's21-z1b', set: 's21', no: '综合 1(2)', pts: 5, t: ['lcs'], type: 'open', demo: 'lcs21', q: '对 X={A,B,C,D,A}、Y={B,D,C,A} 填写最优值表（用箭头标出计算次序），并分析时间复杂性。', a: '<div class="tbl"><table class="grid"><tr><th></th><th>B</th><th>D</th><th>C</th><th>A</th></tr><tr><th>A</th><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><th>B</th><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><th>C</th><td>1</td><td>1</td><td>2</td><td>2</td></tr><tr><th>D</th><td>1</td><td>2</td><td>2</td><td>2</td></tr><tr><th>A</th><td>1</td><td>2</td><td>2</td><td>3</td></tr></table></div><p>LCS 长度 3：<b>BDA</b> 或 <b>BCA</b>。时间 <mark>O(mn)</mark>，m、n 为两序列长度。</p>', ex: '<p>相等画 ↖；不等时指向较大的那个。上、左相等时两个方向都对，只要全表统一。</p>' },
{ id: 's21-z2', set: 's21', no: '综合 2', pts: 10, t: ['greedy'], type: 'open', q: '汽车加满油可行驶 n 公里，途中有 k 个加油站，dist[i] 是第 i−1 站到第 i 站的距离，第 0 站是出发地（已加满），第 k 站是目的地。设计贪心算法使加油次数最少，并分析时间复杂性。', a: `<p><b>贪心策略</b>：<mark>能不加就不加</mark>，直到剩余的油到不了下一站，才在当前站加满。若存在<b>相邻</b>两站距离大于 n，则无解。</p><pre><code>int Greedy(int n, int dist[], int k)
{   // 返回最少加油次数，无解返回 -1
    int rest = n, count = 0;
    for (int i = 1; i &lt;= k; i++) {
        if (dist[i] &gt; n) return -1;
        if (rest &lt; dist[i]) {   // 到不了第 i 站，在第 i-1 站加满
            count++;
            rest = n;
        }
        rest -= dist[i];
    }
    return count;
}</code></pre><p>一次循环，时间 <mark>O(k)</mark>。</p>`, ex: '' },
{ id: 's21-z3a', set: 's21', no: '综合 3(1)', pts: 5, t: ['huffman'], type: 'open', demo: 'huffman', q: '电文由 A–F 组成，频率 45、13、12、16、9、5。画出哈夫曼树并给出编码。', a: '<div class="tbl"><table><tr><th>字符</th><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td></tr><tr><th>编码</th><td>0</td><td>101</td><td>100</td><td>111</td><td>1101</td><td>1100</td></tr></table></div>', ex: '<p>和 2023 年综合 2 数据完全一样，<mark>考过两次</mark>。</p>', err: '原答案 E、F 的编码写反，与它自己画的树矛盾。' },
{ id: 's21-z3b', set: 's21', no: '综合 3(2)', pts: 5, t: ['huffman'], type: 'open', q: '证明哈夫曼编码算法的贪心选择性质。', a: huffProof, ex: '', err: '原答案写成 d(x)≥d(a)，推出 B(T)−B(T′)≤0，方向反了，证不出结论。' },
{ id: 's21-z4a', set: 's21', no: '综合 4(1)(2)', pts: 9, t: ['knapsack', 'backtrack'], type: 'open', q: '(1) 形式化描述 0-1 背包问题；(2) 画出 3 个物品的解空间树。', a: '<p><b>(1)</b> 给定 C>0，wᵢ>0，vᵢ>0，1≤i≤n，求 n 元 0-1 向量 (x₁,…,xₙ)：</p><pre><code>max Σ vᵢxᵢ\n约束：Σ wᵢxᵢ ≤ C\n      xᵢ ∈ {0,1}, 1 ≤ i ≤ n</code></pre><p><b>(2)</b> 深度为 3 的满二叉树，共 15 个结点、8 个叶子，左分支 1、右分支 0。</p>', ex: '', err: '原答案 (1) 只有文字描述，不算形式化。' },
{ id: 's21-z4b', set: 's21', no: '综合 4(3)(4)', pts: 7, t: ['knapsack', 'backtrack', 'bnb'], type: 'open', q: '(3) 写出用递归回溯法解 0-1 背包的算法；(4) 优先队列式分支限界法中，优先级函数 bound(V) 怎样定义？', a: `<p><b>(3)</b> 物品先按 v/w 降序排列：</p><pre><code>void Backtrack(int t)          // cw、cv：当前重量、价值
{
    if (t &gt; n) { if (cv &gt; bestv) bestv = cv; return; }
    if (cw + w[t] &lt;= C) {        // 约束函数：装入
        cw += w[t]; cv += v[t];
        Backtrack(t + 1);
        cw -= w[t]; cv -= v[t];  // 恢复现场
    }
    if (Bound(t + 1) &gt; bestv)    // 限界函数：不装
        Backtrack(t + 1);
}</code></pre><p><b>(4)</b> bound(V) = 当前价值 cv + 剩余容量按单位价值从高到低装剩余物品的价值，最后一件装不下则<mark>按比例取一部分</mark>：</p><pre><code>double Bound(int i)
{
    double left = C - cw, b = cv;
    while (i &lt;= n &amp;&amp; w[i] &lt;= left) { left -= w[i]; b += v[i]; i++; }
    if (i &lt;= n) b += left * v[i] / w[i];
    return b;
}</code></pre>`, ex: '', err: '原答案这两问空缺，本站补全。' },
{ id: 's21-z4c', set: 's21', no: '综合 4(5)', pts: 4, t: ['knapsack', 'bnb'], type: 'open', demo: 'knap21', q: '背包容量 30，3 个物品重量 16、15、15，价值 45、25、25。在解空间树中标出待搜索结点的 bound 值。', a: '<div class="tbl"><table><tr><th>结点</th><td>根</td><td>1</td><td>0</td><td>11</td><td>10</td><td>01</td><td>00</td></tr><tr><th>bound</th><td>68.33</td><td>68.33</td><td>50</td><td>超重</td><td>68.33</td><td>50</td><td>25</td></tr></table></div><p>根：45 + 25×14/15 ≈ 68.33。叶子 101 超重，100=45，011=<b>50</b>。最优解 <b>(0,1,1)</b>，价值 <b>50</b>。</p>', ex: '<p>检查技巧：<mark>孩子的上界不可能大于父亲</mark>。原答案根 50、左孩子 70，一看就不对。</p>', err: '原答案的 bound 值全部有误。' },

/* ───────── A 卷 ───────── */
{ id: 'sa-1', set: 'sa', no: '填空 1', t: ['complexity', 'basics'], type: 'fill', any: true, q: '一个算法的优劣可以用 ___ 与 ___ 来衡量。', a: [['时间复杂度', '时间复杂性'], ['空间复杂度', '空间复杂性']], ex: '' },
{ id: 'sa-2', set: 'sa', no: '填空 2', t: ['backtrack'], type: 'fill', q: '不断回头寻找目标的方法称为 ___。', a: [['回溯法', '回溯']], ex: '' },
{ id: 'sa-3', set: 'sa', no: '填空 3', t: ['divide'], type: 'fill', q: '直接或间接调用自身的算法称为 ___。', a: [['递归算法', '递归']], ex: '' },
{ id: 'sa-4', set: 'sa', no: '填空 4', t: ['complexity'], type: 'fill', q: 'θ 记号在复杂性表示法中表示 ___。', a: [['紧致界', '紧确界', '同阶']], ex: '' },
{ id: 'sa-5', set: 'sa', no: '填空 5', t: ['divide'], type: 'open', kind: '填空', q: '分治法产生的子问题往往是原问题的什么？这为使用什么技术提供了方便？', a: '<p>子问题是<b>原问题的较小模式</b>，为使用<b>递归技术</b>提供了方便。</p>', ex: '' },
{ id: 'sa-6', set: 'sa', no: '填空 6', t: ['basics'], type: 'open', kind: '填空', q: '建立计算模型的目的是什么？', a: '<p>使问题的计算复杂性分析有一个<mark>共同的客观尺度</mark>。</p>', ex: '' },
{ id: 'sa-7', set: 'sa', no: '填空 7', t: ['basics'], type: 'choice', q: '①调试程序 ②分析问题 ③设计算法 ④编写程序，正确的先后顺序是：', opts: ['②③④①', '③②④①', '②④③①', '②③①④'], a: 0, ex: '' },
{ id: 'sa-8', set: 'sa', no: '填空 8', t: ['dp'], type: 'open', kind: '填空', q: '最优子结构性质的含义是什么？', a: '<p>问题的最优解<mark>包含其子问题的最优解</mark>。</p>', ex: '' },
{ id: 'sa-9', set: 'sa', no: '填空 9', t: ['greedy'], type: 'fill', q: '贪心算法每个阶段总是作一个使 ___ 的贪心选择。', a: [['局部最优']], ex: '' },
{ id: 'sa-10', set: 'sa', no: '填空 10', t: ['randnp'], type: 'fill', q: '拉斯维加斯算法找到的解一定是 ___ 的。', a: [['正确', '正确的']], ex: '<p>拉斯维加斯：<b>找到的一定对</b>，但可能找不到。蒙特卡罗：总给答案，<b>但不一定对</b>。</p>' },
{ id: 'sa-c1', set: 'sa', no: '选择 1', t: ['huffman'], type: 'choice', q: '哈夫曼编码可用哪种算法实现？', opts: ['分治策略', '动态规划法', '贪心法', '回溯法'], a: 2, ex: '' },
{ id: 'sa-c2', set: 'sa', no: '选择 2', t: ['basics'], type: 'choice', q: '下列不是基本计算模型的是：', opts: ['RAM', 'ROM', 'RASP', 'TM'], a: 1, ex: '<p>三种模型：RAM 随机存取机、RASP 随机存取存储程序机、TM 图灵机。</p>' },
{ id: 'sa-c3', set: 'sa', no: '选择 3', t: ['greedy'], type: 'choice', q: '通常以自顶向下的方式求最优解的是：', opts: ['分治法', '动态规划法', '贪心法', '回溯法'], a: 2, ex: '' },
{ id: 'sa-c4', set: 'sa', no: '选择 4', t: ['backtrack', 'bnb'], type: 'choice', q: '搜索解空间树时，一个结点有多次机会成为活结点的是：', opts: ['回溯法', '分支限界法', '回溯法和分支限界法', '动态规划'], a: 0, ex: '' },
{ id: 'sa-c5', set: 'sa', no: '选择 5', t: ['divide'], type: 'choice', q: '秦灭六国“远交近攻、逐个击破”，体现哪种算法思想？', opts: ['递归', '分治', '迭代', '模拟'], a: 1, ex: '' },
{ id: 'sa-c6', set: 'sa', no: '选择 6', t: ['bnb'], type: 'choice', q: 'FIFO 是哪种方法的一种搜索方式？', opts: ['分支限界法', '动态规划法', '贪心法', '回溯法'], a: 0, ex: '' },
{ id: 'sa-c7', set: 'sa', no: '选择 7', t: ['randnp'], type: 'choice', q: '投点法是哪种算法的一种？', opts: ['分支限界算法', '概率算法', '贪心算法', '回溯算法'], a: 1, ex: '<p>随机投点估计 π，属于数值概率算法。</p>' },
{ id: 'sa-c8', set: 'sa', no: '选择 8', t: ['lp'], type: 'choice', q: '若线性规划问题存在最优解，它一定不在：', opts: ['可行域的某个顶点上', '可行域的某条边上', '可行域内部', '以上都不对'], a: 2, ex: '<p>最优解在边界上达到（目标函数非常数时）。</p>' },
{ id: 'sa-c9', set: 'sa', no: '选择 9', t: ['randnp'], type: 'choice', q: '输入会影响算法的计算复杂度，为消除这种影响，可用哪种算法对输入预处理？', opts: ['蒙特卡罗算法', '拉斯维加斯算法', '舍伍德算法', '数值概率算法'], a: 2, ex: '<p>舍伍德算法消除最坏情况与特定输入之间的关联，例如随机选取划分基准、随机洗牌。</p>', err: '原答案给 B，应为 C。' },
{ id: 'sa-c10', set: 'sa', no: '选择 10', t: ['randnp'], type: 'choice', q: 'L 是 NP 完全问题，L 经多项式时间变换得到问题 l，则 l 是：', opts: ['P 类问题', 'NP 难问题', 'NP 完全问题', 'P 类语言'], a: 1, ex: '<p>由 L ≤ₚ l 只能推出 l 是 NP 难；<mark>再加上 l∈NP</mark> 才是 NP 完全。</p>', err: '原答案给 A，站不住（除非 P=NP）。', doubt: '若题目默认 l∈NP，则应选 C。' },
{ id: 'sa-j1', set: 'sa', no: '简答 1', pts: 5, t: ['basics'], type: 'open', q: '用高级程序设计语言表达算法，主要好处是什么？', a: '<ul><li>接近算法语言，易学易掌握</li><li>支持结构化，可读、可维护、可靠</li><li>不依赖具体机器，<mark>可移植、可重用</mark></li><li>琐碎事务交给编译器，开发周期短</li></ul>', ex: '' },
{ id: 'sa-j2', set: 'sa', no: '简答 2', pts: 5, t: ['greedy'], type: 'open', q: '贪心算法只顾眼前、难顾全局，它通常有哪些特点？', a: '<ol><li>不能保证结果最优，多半是近似解</li><li>策略容易发现，运用简单，应用广</li><li>策略多样，结果也多样</li><li>实现时常用到辅助算法：<mark>排序</mark></li></ol>', ex: '' },
{ id: 'sa-j3', set: 'sa', no: '简答 3', pts: 5, t: ['complexity'], type: 'open', q: '求渐近表达式：① n²+10n−1；② 14+5/n+1/n²。', a: '<p>① <b>n²</b>，因为 lim [(n²+10n−1)−n²]/(n²+10n−1) = 0。</p><p>② <b>14</b>，因为 lim [(14+5/n+1/n²)−14]/(14+5/n+1/n²) = 0。</p>', ex: '<p>定义：lim (T(n)−t(n))/T(n) = 0，则 t(n) 是 T(n) 的渐近表达式。</p>' },
{ id: 'sa-j4', set: 'sa', no: '简答 4', pts: 5, t: ['dp'], type: 'open', q: '简述动态规划算法的基本步骤。', a: dpSteps, ex: '', err: '原卷未附答案，本站补全。' },
{ id: 'sa-z1', set: 'sa', no: '设计 1', pts: 15, t: ['knapsack', 'backtrack'], type: 'open', q: '7 个物品 A–G，重量 35、30、60、50、40、10、25，价值 10、40、30、50、35、40、30，容量 150，物品不可分割。用回溯法求解，给出装载方案、重量和价值。', a: '<p>单位价值降序：F(4)、B(1.33)、G(1.2)、D(1)、E(0.875)、C(0.5)、A(0.29)。</p><p>根的上界：F+B+G+D 重 115、价值 160，剩 35 装 E 的 35/40 → 160+30.625 = <b>190.625</b>。</p><p>最优方案：<mark>A、B、D、F、G</mark>，重量 35+30+50+10+25 = <b>150</b>，价值 10+40+50+40+30 = <b>170</b>。</p>', ex: '<p>装完 F、B、G、D 剩 35，正好放得下 A。</p>', doubt: '原答案的搜索树扫描不清，最后一条分支像是 x₇=0（不装 A），那样只有 160。' },
{ id: 'sa-z2', set: 'sa', no: '设计 2', pts: 15, t: ['lp'], type: 'open', q: '用单纯形法求解：<pre><code>max z = −x₂ + 3x₃ − 2x₅\nx₁ + 3x₂ − x₃ + 2x₅ = 7\nx₄ − 2x₂ + 4x₃ = 12\nx₆ − 4x₂ + 3x₃ + 8x₅ = 10\nxᵢ ≥ 0</code></pre>', a: '<p><b>初始表</b>（基 x₁、x₄、x₆）：</p><div class="tbl"><table class="grid"><tr><th></th><th>b</th><th>x₂</th><th>x₃</th><th>x₅</th></tr><tr><th>z</th><td>0</td><td>−1</td><td>3</td><td>−2</td></tr><tr><th>x₁</th><td>7</td><td>3</td><td>−1</td><td>2</td></tr><tr><th>x₄</th><td>12</td><td>−2</td><td><b>4</b></td><td>0</td></tr><tr><th>x₆</th><td>10</td><td>−4</td><td>3</td><td>8</td></tr></table></div><p>x₃ 入基（系数 3 最大）；比值 12/4=3 &lt; 10/3，x₄ 离基。</p><div class="tbl"><table class="grid"><tr><th></th><th>b</th><th>x₂</th><th>x₄</th><th>x₅</th></tr><tr><th>z</th><td>9</td><td>1/2</td><td>−3/4</td><td>−2</td></tr><tr><th>x₁</th><td>10</td><td><b>5/2</b></td><td>1/4</td><td>2</td></tr><tr><th>x₃</th><td>3</td><td>−1/2</td><td>1/4</td><td>0</td></tr><tr><th>x₆</th><td>1</td><td>−5/2</td><td>−3/4</td><td>8</td></tr></table></div><p>x₂ 入基，x₁ 离基（10 ÷ 5/2 = 4）。</p><div class="tbl"><table class="grid"><tr><th></th><th>b</th><th>x₁</th><th>x₄</th><th>x₅</th></tr><tr><th>z</th><td>11</td><td>−1/5</td><td>−4/5</td><td>−12/5</td></tr><tr><th>x₂</th><td>4</td><td>2/5</td><td>1/10</td><td>4/5</td></tr><tr><th>x₃</th><td>5</td><td>1/5</td><td>3/10</td><td>2/5</td></tr><tr><th>x₆</th><td>11</td><td>1</td><td>−1/2</td><td>10</td></tr></table></div><p>检验数全为负，最优：<mark>z = 11</mark>，x = (0, 4, 5, 0, 0, 11)。</p>', ex: '<p>z 行第一列写的是当前目标值；有的教材写 −z，跟老师的格式走。</p>' },

/* ───────── 补充练习（自编） ───────── */
{ id: 'ex-1', set: 'ex', no: '补充', t: ['complexity'], type: 'choice', q: '3n² + 10n log n 的紧确界是：', opts: ['θ(n log n)', 'θ(n²)', 'θ(n² log n)', 'θ(n³)'], a: 1, ex: '<p>只看最高阶，去掉系数。</p>' },
{ id: 'ex-2', set: 'ex', no: '补充', t: ['complexity'], type: 'choice', q: '下面程序段的时间复杂度是：<pre><code>for (i = 1; i &lt;= n; i *= 2)\n  for (j = 1; j &lt;= n; j++)\n    s++;</code></pre>', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], a: 1, ex: '<p>外层翻倍，log n 次；内层 n 次。</p>' },
{ id: 'ex-3', set: 'ex', no: '补充', t: ['divide'], type: 'choice', q: 'T(n) = 4T(n/2) + n，则 T(n) =', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n² log n)'], a: 2, ex: '<p>主定理：log₂4=2，n² 的阶高于 n，所以是 O(n²)。</p>' },
{ id: 'ex-4', set: 'ex', no: '补充', t: ['divide'], type: 'fill', q: '在 1000 个元素的有序数组中二分搜索，最多比较（查看中点）___ 次。', a: [['10']], ex: '<p>⌊log₂1000⌋+1 = 9+1 = 10。</p>' },
{ id: 'ex-5', set: 'ex', no: '补充', t: ['divide'], type: 'open', q: '写出快速排序最坏情况的递归式并求解。', a: '<pre><code>T(n) = T(n-1) + n\n     = T(n-2) + (n-1) + n\n     = ……\n     = 1 + 2 + … + n\n     = n(n+1)/2 = O(n²)</code></pre>', ex: '<p>出现在每次划分一侧为空时。随机选基准可以避免特定输入触发最坏情况。</p>' },
{ id: 'ex-6', set: 'ex', no: '补充', t: ['select'], type: 'fill', demo: 'mom2', q: '数据 {12,3,45,7,28, 19,33,5,41,8, 26,14,50,2,37}，5 个一组，中位数的中位数是 ___。', a: [['19']], ex: '<p>三组中位数 12、19、26，取 19。</p>' },
{ id: 'ex-7', set: 'ex', no: '补充', t: ['select'], type: 'open', q: '为什么线性时间选择算法最坏情况也是 O(n)？', a: '<p>5 个一组取中位数的中位数作基准，n≥75 时划分后每一侧至多 3n/4 个元素，因此：</p><pre><code>T(n) ≤ c₁                          n &lt; 75\nT(n) ≤ c₂n + T(n/5) + T(3n/4)      n ≥ 75</code></pre><p>1/5 + 3/4 = <mark>19/20 &lt; 1</mark>，所以 T(n)=O(n)。</p>', ex: '<p>T(n/5) 是求中位数的中位数，T(3n/4) 是在一侧继续找。</p>' },
{ id: 'ex-8', set: 'ex', no: '补充', t: ['dp'], type: 'open', q: 'A₁:10×100，A₂:100×5，A₃:5×50，求矩阵连乘的最少乘法次数和加括号方式。', a: '<p>(A₁A₂)A₃ = 10·100·5 + 10·5·50 = 5000 + 2500 = <b>7500</b></p><p>A₁(A₂A₃) = 100·5·50 + 10·100·50 = 25000 + 50000 = 75000</p><p>最优：<mark>(A₁A₂)A₃，7500 次</mark>。</p>', ex: '<pre><code>m[i][j] = 0                                             i = j\nm[i][j] = min { m[i][k] + m[k+1][j] + p[i-1]p[k]p[j] }  i ≤ k &lt; j</code></pre>' },
{ id: 'ex-9', set: 'ex', no: '补充', t: ['dp'], type: 'open', q: '表格 [[1,3,1],[1,5,1],[4,2,1]]，只能向下或向右，从左上到右下的最大收益是多少？写出 d 表。', a: '<div class="tbl"><table class="grid"><tr><td>1</td><td>4</td><td>5</td></tr><tr><td>2</td><td>9</td><td>10</td></tr><tr><td>6</td><td>11</td><td><b>12</b></td></tr></table></div><p>最大收益 12，路径 1→3→5→2→1。</p>', ex: '' },
{ id: 'ex-10', set: 'ex', no: '补充', t: ['lcs'], type: 'fill', demo: 'lcsx', q: 'X=ABCBDAB，Y=BDCABA，最长公共子序列的长度是 ___。', a: [['4']], ex: '<p>例如 BCBA。</p>' },
{ id: 'ex-11', set: 'ex', no: '补充', t: ['knapsack', 'dp'], type: 'choice', q: '动态规划解 0-1 背包（n 个物品、容量 C）的时间复杂度是：', opts: ['O(n log n)', 'O(nC)', 'O(n²)', 'O(2ⁿ)'], a: 1, ex: '<p>O(nC) 是<b>伪多项式</b>，C 很大时不实用。</p>' },
{ id: 'ex-12', set: 'ex', no: '补充', t: ['greedy'], type: 'choice', q: '下列问题不能用贪心保证最优的是：', opts: ['部分背包', '0-1 背包', '活动安排', '哈夫曼编码'], a: 1, ex: '<p>0-1 背包不满足贪心选择性质：剩余容量可能被浪费。</p>' },
{ id: 'ex-13', set: 'ex', no: '补充', t: ['greedy'], type: 'open', q: '活动（开始, 结束）：(1,4)(3,5)(0,6)(5,7)(3,8)(5,9)(6,10)(8,11)(8,12)(2,13)(12,14)，选出最多的相容活动。', a: '<p>按结束时间依次选：<mark>(1,4)、(5,7)、(8,11)、(12,14)</mark>，共 4 个。</p>', ex: '' },
{ id: 'ex-14', set: 'ex', no: '补充', t: ['greedy'], type: 'fill', q: '汽车加油：n=7，相邻站距离依次为 1、2、3、4、5、1、6、6，最少加油 ___ 次。', a: [['4']], ex: '<p>1+2+3=6 后到不了 4，加一次；4 后到不了 5，加一次；5+1=6 后到不了 6，加一次；6 后到不了 6，加一次。共 4 次。</p>' },
{ id: 'ex-15', set: 'ex', no: '补充', t: ['huffman'], type: 'open', demo: 'huff2', q: '字符 A–E 频率 8、3、5、20、14，构造哈夫曼树，求总代价。', a: '<p>3+5=8 → 8+8=16 → 14+16=30 → 20+30=50。</p><p>总代价 8+16+30+50 = <mark>104</mark>。码长：D 1 位，E 2 位，A 3 位，B、C 4 位。</p>', ex: '<p>快速验算：总代价 = 所有<b>内部结点</b>权值之和。</p>' },
{ id: 'ex-16', set: 'ex', no: '补充', t: ['huffman'], type: 'choice', q: '有 n 个叶子的哈夫曼树共有多少个结点？', opts: ['2n', '2n−1', 'n+1', '2ⁿ−1'], a: 1, ex: '<p>合并 n−1 次，多出 n−1 个内部结点。</p>' },
{ id: 'ex-17', set: 'ex', no: '补充', t: ['graph'], type: 'choice', q: 'Dijkstra 算法要求图满足：', opts: ['无环', '边权非负', '连通', '无向'], a: 1, ex: '<p>有负权时，已确定的点可能被更短路更新，贪心选择不成立。</p>' },
{ id: 'ex-18', set: 'ex', no: '补充', t: ['graph'], type: 'choice', q: '边数为 e 时，Kruskal 算法的时间复杂度是：', opts: ['O(e)', 'O(e log e)', 'O(n²)', 'O(n³)'], a: 1, ex: '<p>主要花在给边排序。Prim 用邻接矩阵是 O(n²)，适合稠密图。</p>' },
{ id: 'ex-19', set: 'ex', no: '补充', t: ['graph'], type: 'open', q: '有向图边：1→2(10)、1→4(30)、1→5(100)、2→3(50)、3→5(10)、4→3(20)、4→5(60)。用 Dijkstra 求点 1 到各点的最短路，写出过程表。', a: '<div class="tbl"><table class="grid"><tr><th>轮</th><th>加入 S</th><th>d[2]</th><th>d[3]</th><th>d[4]</th><th>d[5]</th></tr><tr><td>初始</td><td>1</td><td>10</td><td>∞</td><td>30</td><td>100</td></tr><tr><td>1</td><td>2</td><td>10</td><td>60</td><td>30</td><td>100</td></tr><tr><td>2</td><td>4</td><td>10</td><td>50</td><td>30</td><td>90</td></tr><tr><td>3</td><td>3</td><td>10</td><td>50</td><td>30</td><td>60</td></tr><tr><td>4</td><td>5</td><td>10</td><td>50</td><td>30</td><td>60</td></tr></table></div>', ex: '' },
{ id: 'ex-20', set: 'ex', no: '补充', t: ['knapsack', 'bnb'], type: 'open', demo: 'knapx', q: 'C=8，4 个物品重量 2、3、4、5，价值 6、8、9、10。求根结点上界和最优解。', a: '<p>单位价值 3、2.67、2.25、2，已有序。根的上界 = 6+8+9×3/4 = <b>20.75</b>。</p><p>最优解 <mark>(0,1,0,1)，价值 18</mark>，正好装满。</p>', ex: '' },
{ id: 'ex-21', set: 'ex', no: '补充', t: ['knapsack', 'bnb'], type: 'choice', q: 'C=10，物品（价值, 重量）(12,3)、(15,5)、(8,4)、(3,3)，已按单位价值排序。部分解 (1,0) 的上界是：', opts: ['20', '23', '27', '35'], a: 1, ex: '<p>已装 12，剩 7；装 (8,4) 剩 3；装 (3,3) 剩 0。12+8+3 = 23。</p>' },
{ id: 'ex-22', set: 'ex', no: '补充', t: ['backtrack'], type: 'choice', q: 'n 个物品的 0-1 背包，子集树的叶子数和结点总数分别是：', opts: ['n!，2n!', '2ⁿ，2ⁿ⁺¹−1', '2ⁿ，2ⁿ', 'n²，2n²'], a: 1, ex: '<p>深度为 n 的满二叉树。</p>' },
{ id: 'ex-23', set: 'ex', no: '补充', t: ['backtrack'], type: 'choice', q: '解空间树从根到叶的最长路径长度为 h(n)，回溯法需要的存储空间通常是：', opts: ['O(h(n))', 'O(2^h(n))', 'O(h(n)!)', 'O(1)'], a: 0, ex: '<p>只存当前路径，这是回溯法省空间的原因。</p>' },
{ id: 'ex-24', set: 'ex', no: '补充', t: ['bnb'], type: 'fill', any: true, q: '按活结点表的组织方式，分支限界法分为 ___ 式和 ___ 式两种。', a: [['队列', 'FIFO', '先进先出队列'], ['优先队列']], ex: '' },
{ id: 'ex-25', set: 'ex', no: '补充', t: ['bnb'], type: 'choice', q: '用优先队列式分支限界法解 0-1 背包（求最大值），活结点表用什么组织？优先级取什么？', opts: ['最小堆，当前重量', '最大堆，价值上界', '栈，当前价值', '普通队列，层数'], a: 1, ex: '<p>求最大 → 最大堆，上界大的先扩展。第一次取出叶子时就是最优解。</p>' },
];
