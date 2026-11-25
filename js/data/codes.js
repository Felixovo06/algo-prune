// 代码模板（C++）。tests/cpp.sh 会逐段编译运行。
export const CODE = {
mergeSort: `void Merge(int a[], int b[], int l, int m, int r)
{   // 合并 a[l..m] 和 a[m+1..r] 到 b[l..r]
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r)
        b[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= m) b[k++] = a[i++];
    while (j <= r) b[k++] = a[j++];
}
void MergeSort(int a[], int b[], int l, int r)
{
    if (l < r) {                    // 至少有 2 个元素
        int m = (l + r) / 2;
        MergeSort(a, b, l, m);
        MergeSort(a, b, m + 1, r);
        Merge(a, b, l, m, r);       // 合并到 b
        for (int i = l; i <= r; i++) a[i] = b[i];
    }
}`,
quickSort: `int Partition(int a[], int p, int r)
{   // 以 a[p] 为基准，返回基准的最终位置
    int i = p, j = r + 1, x = a[p];
    while (true) {
        while (a[++i] < x && i < r);
        while (a[--j] > x);
        if (i >= j) break;
        swap(a[i], a[j]);
    }
    a[p] = a[j];
    a[j] = x;
    return j;
}
void QuickSort(int a[], int p, int r)
{
    if (p < r) {
        int q = Partition(a, p, r);
        QuickSort(a, p, q - 1);
        QuickSort(a, q + 1, r);
    }
}`,
hanoi: `void Hanoi(int n, int a, int b, int c)
{   // 把 a 上的 n 个圆盘借助 c 移到 b
    if (n > 0) {
        Hanoi(n - 1, a, c, b);
        Move(a, b);
        Hanoi(n - 1, c, b, a);
    }
}`,
partitionNum: `int q(int n, int m)
{   // 正整数 n 的、最大加数不超过 m 的划分数
    if (n < 1 || m < 1) return 0;
    if (n == 1 || m == 1) return 1;
    if (n < m)  return q(n, n);
    if (n == m) return q(n, m - 1) + 1;
    return q(n, m - 1) + q(n - m, m);
}`,
chess: `int tile = 1, board[64][64];
void ChessBoard(int tr, int tc, int dr, int dc, int size)
{   // (tr,tc) 棋盘左上角，(dr,dc) 特殊方格
    if (size == 1) return;
    int t = tile++, s = size / 2;
    // 左上
    if (dr < tr + s && dc < tc + s) ChessBoard(tr, tc, dr, dc, s);
    else { board[tr+s-1][tc+s-1] = t; ChessBoard(tr, tc, tr+s-1, tc+s-1, s); }
    // 右上
    if (dr < tr + s && dc >= tc + s) ChessBoard(tr, tc+s, dr, dc, s);
    else { board[tr+s-1][tc+s] = t; ChessBoard(tr, tc+s, tr+s-1, tc+s, s); }
    // 左下
    if (dr >= tr + s && dc < tc + s) ChessBoard(tr+s, tc, dr, dc, s);
    else { board[tr+s][tc+s-1] = t; ChessBoard(tr+s, tc, tr+s, tc+s-1, s); }
    // 右下
    if (dr >= tr + s && dc >= tc + s) ChessBoard(tr+s, tc+s, dr, dc, s);
    else { board[tr+s][tc+s] = t; ChessBoard(tr+s, tc+s, tr+s, tc+s, s); }
}`,
randSelect: `int RandomizedSelect(int a[], int p, int r, int k)
{   // 返回 a[p..r] 中第 k 小的元素
    if (p == r) return a[p];
    int i = RandomizedPartition(a, p, r);
    int j = i - p + 1;              // 左半（含基准）的元素个数
    if (k <= j) return RandomizedSelect(a, p, i, k);
    return RandomizedSelect(a, i + 1, r, k - j);
}`,
gray: `vector<string> Gray(int n)
{
    if (n == 1) return {"0", "1"};
    vector<string> g = Gray(n - 1), res;
    for (int i = 0; i < (int)g.size(); i++)      // 前一半：正序，前面加 0
        res.push_back("0" + g[i]);
    for (int i = (int)g.size() - 1; i >= 0; i--) // 后一半：逆序，前面加 1
        res.push_back("1" + g[i]);
    return res;
}`,
lcs: `int LCSLength(string x, string y, vector<vector<int>>& b)
{   // x、y 下标从 1 开始用；b: 1 左上，2 上，3 左
    int m = x.size() - 1, n = y.size() - 1;
    vector<vector<int>> c(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (x[i] == y[j])                  { c[i][j] = c[i-1][j-1] + 1; b[i][j] = 1; }
            else if (c[i-1][j] >= c[i][j-1])   { c[i][j] = c[i-1][j];       b[i][j] = 2; }
            else                               { c[i][j] = c[i][j-1];       b[i][j] = 3; }
    return c[m][n];
}
void LCS(int i, int j, const string& x, vector<vector<int>>& b)
{
    if (i == 0 || j == 0) return;
    if (b[i][j] == 1)      { LCS(i-1, j-1, x, b); cout << x[i]; }
    else if (b[i][j] == 2) LCS(i-1, j, x, b);
    else                   LCS(i, j-1, x, b);
}`,
matrixChain: `void MatrixChain(int p[], int n, int m[][20], int s[][20])
{
    for (int i = 1; i <= n; i++) m[i][i] = 0;
    for (int r = 2; r <= n; r++)                // r 为链长
        for (int i = 1; i <= n - r + 1; i++) {
            int j = i + r - 1;
            m[i][j] = m[i+1][j] + p[i-1] * p[i] * p[j];
            s[i][j] = i;
            for (int k = i + 1; k < j; k++) {
                int t = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j];
                if (t < m[i][j]) { m[i][j] = t; s[i][j] = k; }
            }
        }
}`,
editDist: `int EditDistance(string a, string b)
{
    int m = a.size(), n = b.size();
    vector<vector<int>> d(m + 1, vector<int>(n + 1));
    for (int i = 0; i <= m; i++) d[i][0] = i;   // 全删
    for (int j = 0; j <= n; j++) d[0][j] = j;   // 全插
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            int cost = (a[i-1] == b[j-1]) ? 0 : 1;
            d[i][j] = min(d[i-1][j-1] + cost,          // 改（或不动）
                      min(d[i-1][j] + 1,               // 删
                          d[i][j-1] + 1));             // 插
        }
    return d[m][n];
}`,
lis: `int LIS(int a[], int n)
{   // a[1..n]
    int f[1001], best = 0;
    for (int i = 1; i <= n; i++) {
        f[i] = 1;
        for (int j = 1; j < i; j++)
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);
        best = max(best, f[i]);
    }
    return best;
}`,
maxSum: `int MaxSum(int n, int a[])
{   // a[1..n]
    int sum = 0, b = 0;
    for (int j = 1; j <= n; j++) {
        if (b > 0) b += a[j];
        else       b = a[j];
        if (b > sum) sum = b;
    }
    return sum;
}`,
knapDP: `int KnapsackDP(int n, int C, int w[], int v[])
{   // m[i][j]：物品 i..n、容量 j 的最优值
    vector<vector<int>> m(n + 2, vector<int>(C + 1, 0));
    for (int i = n; i >= 1; i--)
        for (int j = 0; j <= C; j++) {
            m[i][j] = m[i+1][j];
            if (j >= w[i]) m[i][j] = max(m[i][j], m[i+1][j-w[i]] + v[i]);
        }
    return m[1][C];
}`,
dijkstra: `void Dijkstra(int n, int v, int a[][20], int dist[], int prev[])
{   // INF 表示没有边
    bool s[20];
    for (int i = 1; i <= n; i++) {
        dist[i] = a[v][i];
        s[i] = false;
        prev[i] = (dist[i] == INF) ? 0 : v;
    }
    dist[v] = 0; s[v] = true;
    for (int i = 1; i < n; i++) {
        int temp = INF, u = v;
        for (int j = 1; j <= n; j++)            // 选 dist 最小的 u
            if (!s[j] && dist[j] < temp) { u = j; temp = dist[j]; }
        s[u] = true;
        for (int j = 1; j <= n; j++)            // 用 u 更新
            if (!s[j] && a[u][j] < INF && dist[u] + a[u][j] < dist[j]) {
                dist[j] = dist[u] + a[u][j];
                prev[j] = u;
            }
    }
}`,
floyd: `void Floyd(int n, int d[][20])
{
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                if (d[i][k] < INF && d[k][j] < INF)
                    d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
}`,
prim: `int Prim(int n, int c[][20])
{   // 返回最小生成树的权
    int lowcost[20], closest[20], total = 0;
    bool s[20];
    s[1] = true;
    for (int i = 2; i <= n; i++) { lowcost[i] = c[1][i]; closest[i] = 1; s[i] = false; }
    for (int i = 1; i < n; i++) {
        int mn = INF, j = 1;
        for (int k = 2; k <= n; k++)
            if (!s[k] && lowcost[k] < mn) { mn = lowcost[k]; j = k; }
        total += mn;                 // 加入边 (j, closest[j])
        s[j] = true;
        for (int k = 2; k <= n; k++)
            if (!s[k] && c[j][k] < lowcost[k]) { lowcost[k] = c[j][k]; closest[k] = j; }
    }
    return total;
}`,
kruskal: `struct Edge { int u, v, w; };
int fa[100];
int Find(int x) { return fa[x] == x ? x : fa[x] = Find(fa[x]); }
int Kruskal(int n, vector<Edge> e)
{
    sort(e.begin(), e.end(), [](const Edge& a, const Edge& b) { return a.w < b.w; });
    for (int i = 1; i <= n; i++) fa[i] = i;
    int total = 0, cnt = 0;
    for (auto& x : e) {
        int a = Find(x.u), b = Find(x.v);
        if (a != b) {                // 不成环才加入
            fa[a] = b; total += x.w;
            if (++cnt == n - 1) break;
        }
    }
    return total;
}`,
huffman: `struct Node { int f; char ch; Node *l, *r; };
struct Cmp { bool operator()(Node* a, Node* b) { return a->f > b->f; } };
Node* Huffman(vector<pair<char,int>> c)
{
    priority_queue<Node*, vector<Node*>, Cmp> H;     // 最小堆
    for (auto& x : c) H.push(new Node{x.second, x.first, nullptr, nullptr});
    int n = c.size();
    for (int i = 1; i < n; i++) {                    // 合并 n-1 次
        Node* x = H.top(); H.pop();
        Node* y = H.top(); H.pop();
        H.push(new Node{x->f + y->f, 0, x, y});
    }
    return H.top();
}`,
gasEmpty: `int MinStops(int s, int n, int m, int d[], int x[])
{   // 加油站 d[1..n]，d[1]=0，油箱为空出发；x 记录加油站，无解返回 -1
    d[n + 1] = s;                        // 终点当作第 n+1 站
    for (int i = 1; i <= n; i++)
        if (d[i+1] - d[i] > m) return -1;
    int k = 1, reach = m;                // 先在第 1 站加满
    x[1] = 1;
    for (int i = 2; i <= n; i++)
        if (d[i+1] > reach) {            // 到不了下一站
            x[++k] = i;
            reach = d[i] + m;
        }
    return k;
}`,
queen: `int n, x[20], sum = 0;
bool Place(int k)
{
    for (int j = 1; j < k; j++)
        if (abs(k - j) == abs(x[j] - x[k]) || x[j] == x[k]) return false;
    return true;
}
void Backtrack(int t)
{
    if (t > n) sum++;
    else
        for (int i = 1; i <= n; i++) {
            x[t] = i;
            if (Place(t)) Backtrack(t + 1);
        }
}`,
clique: `int n, cn = 0, bestn = 0, x[20], bestx[20], a[20][20];
void Backtrack(int i)
{
    if (i > n) {
        for (int j = 1; j <= n; j++) bestx[j] = x[j];
        bestn = cn;
        return;
    }
    bool ok = true;                     // i 与当前团的每个顶点都相连？
    for (int j = 1; j < i; j++)
        if (x[j] && a[i][j] == 0) { ok = false; break; }
    if (ok) {                           // 进入左子树
        x[i] = 1; cn++;
        Backtrack(i + 1);
        x[i] = 0; cn--;
    }
    if (cn + n - i > bestn) {           // 进入右子树
        x[i] = 0;
        Backtrack(i + 1);
    }
}`,
color: `int n, m, x[20], a[20][20], sum = 0;
bool OK(int k)
{
    for (int j = 1; j < k; j++)
        if (a[k][j] == 1 && x[j] == x[k]) return false;
    return true;
}
void Backtrack(int t)
{
    if (t > n) { sum++; return; }
    for (int i = 1; i <= m; i++) {
        x[t] = i;
        if (OK(t)) Backtrack(t + 1);
        x[t] = 0;
    }
}`,
loading: `int n, c, cw = 0, bestw = 0, r, w[20], x[20], bestx[20];
void Backtrack(int i)
{   // r：剩余集装箱的总重量，初值为全部重量之和
    if (i > n) {
        if (cw > bestw) {
            for (int j = 1; j <= n; j++) bestx[j] = x[j];
            bestw = cw;
        }
        return;
    }
    r -= w[i];
    if (cw + w[i] <= c) {               // 约束函数
        x[i] = 1; cw += w[i];
        Backtrack(i + 1);
        cw -= w[i];
    }
    if (cw + r > bestw) {               // 限界函数
        x[i] = 0;
        Backtrack(i + 1);
    }
    r += w[i];
}`,
tsp: `int n, x[20], a[20][20], cc = 0, bestc = INF;
void Backtrack(int i)
{   // 初始 x[i]=i，从 Backtrack(2) 开始
    if (i == n) {
        if (a[x[n-1]][x[n]] < INF && a[x[n]][1] < INF)
            bestc = min(bestc, cc + a[x[n-1]][x[n]] + a[x[n]][1]);
        return;
    }
    for (int j = i; j <= n; j++)
        if (a[x[i-1]][x[j]] < INF && cc + a[x[i-1]][x[j]] < bestc) {
            swap(x[i], x[j]);
            cc += a[x[i-1]][x[i]];
            Backtrack(i + 1);
            cc -= a[x[i-1]][x[i]];
            swap(x[i], x[j]);
        }
}`,
};
export const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const pre = s => `<pre><code>${esc(s)}</code></pre>`;
export const code = k => pre(CODE[k]);
