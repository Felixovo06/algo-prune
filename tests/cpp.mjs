// 逐段编译运行 js/data/codes.js 里的 C++ 模板
import { CODE as K } from '../js/data/codes.js';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir = mkdtempSync(join(tmpdir(), 'algo-')), INF = 'const int INF=1000000000;';
const T = {
 mergeSort: 'for(int t=0;t<300;t++){int n=1+rand()%12,a[20],b[20];vector<int>v;for(int i=0;i<n;i++){a[i]=rand()%20;v.push_back(a[i]);}MergeSort(a,b,0,n-1);sort(v.begin(),v.end());for(int i=0;i<n;i++)CHECK(a[i]==v[i]);}',
 quickSort: 'for(int t=0;t<500;t++){int n=1+rand()%12,a[20];vector<int>v;for(int i=0;i<n;i++){a[i]=rand()%20;v.push_back(a[i]);}QuickSort(a,0,n-1);sort(v.begin(),v.end());for(int i=0;i<n;i++)CHECK(a[i]==v[i]);}int z[]={65,70,75,80,85,55,50,2};int q=Partition(z,0,7);int e[]={55,2,50,65,85,80,75,70};CHECK(q==3);for(int i=0;i<8;i++)CHECK(z[i]==e[i]);',
 hanoi: 'for(int n=1;n<12;n++){cnt=0;Hanoi(n,1,2,3);CHECK(cnt==(1<<n)-1);}',
 partitionNum: 'int e[]={0,1,2,3,5,7,11,15,22};for(int n=1;n<9;n++)CHECK(q(n,n)==e[n]);',
 chess: 'for(int k=1;k<=4;k++){int s=1<<k;for(int r=0;r<s;r++)for(int c=0;c<s;c++){tile=1;memset(board,0,sizeof board);ChessBoard(0,0,r,c,s);map<int,vector<pair<int,int>>>m;for(int i=0;i<s;i++)for(int j=0;j<s;j++)m[board[i][j]].push_back({i,j});CHECK(m[0].size()==1&&m[0][0]==make_pair(r,c));for(auto&x:m)if(x.first){CHECK(x.second.size()==3);int a=99,b=-1,d=99,e=-1;for(auto&y:x.second){a=min(a,y.first);b=max(b,y.first);d=min(d,y.second);e=max(e,y.second);}CHECK(b-a==1&&e-d==1);}}}',
 randSelect: 'for(int t=0;t<500;t++){int n=1+rand()%12,a[20],k=1+rand()%n;vector<int>v;for(int i=0;i<n;i++){a[i]=rand()%20;v.push_back(a[i]);}sort(v.begin(),v.end());CHECK(RandomizedSelect(a,0,n-1,k)==v[k-1]);}',
 gray: 'for(int n=1;n<8;n++){auto g=Gray(n);CHECK((int)g.size()==1<<n);CHECK(set<string>(g.begin(),g.end()).size()==g.size());for(size_t i=1;i<g.size();i++){int d=0;for(int j=0;j<n;j++)d+=g[i][j]!=g[i-1][j];CHECK(d==1);}}',
 lcs: 'string x=" ABCBDAB",y=" BDCABA";vector<vector<int>>b(10,vector<int>(10,0));CHECK(LCSLength(x,y,b)==4);stringstream ss;auto o=cout.rdbuf(ss.rdbuf());LCS(7,6,x,b);cout.rdbuf(o);CHECK(ss.str()=="BCBA");',
 matrixChain: 'int m[20][20],s[20][20];int p[]={50,10,40,30,5};MatrixChain(p,4,m,s);CHECK(m[1][4]==10500&&s[1][4]==1&&m[2][4]==8000&&s[2][4]==2&&m[1][3]==27000&&m[3][4]==6000&&m[1][2]==20000);int q[]={30,35,15,5,10,20,25};MatrixChain(q,6,m,s);CHECK(m[1][6]==15125);',
 editDist: 'CHECK(EditDistance("kitten","sitting")==3);CHECK(EditDistance("","abc")==3);CHECK(EditDistance("fxpimu","xwrs")==5);',
 lis: 'int a[]={0,4,2,6,3,1,5,2};CHECK(LIS(a,7)==3);int b[]={0,1,7,3,5,9,4,8};CHECK(LIS(b,7)==4);',
 maxSum: 'int a[]={0,-2,11,-4,13,-5,-2};CHECK(MaxSum(6,a)==20);',
 knapDP: 'int w[]={0,1,2,3},v[]={0,6,10,12};CHECK(KnapsackDP(3,5,w,v)==22);int W[]={0,5,3,2,10,4,8},V[]={0,4,8,15,1,6,3};CHECK(KnapsackDP(6,20,W,V)==33);',
 dijkstra: 'int a[20][20];for(auto&r:a)for(int&x:r)x=INF;a[1][2]=10;a[1][4]=30;a[1][5]=100;a[2][3]=50;a[3][5]=10;a[4][3]=20;a[4][5]=60;int d[20],p[20];Dijkstra(5,1,a,d,p);CHECK(d[2]==10&&d[3]==50&&d[4]==30&&d[5]==60&&p[5]==3&&p[3]==4);',
 floyd: 'int d[20][20];int s[3][3]={{0,INF,2},{3,0,6},{10,5,0}},e[3][3]={{0,7,2},{3,0,5},{8,5,0}};for(int i=0;i<3;i++)for(int j=0;j<3;j++)d[i+1][j+1]=s[i][j];Floyd(3,d);for(int i=0;i<3;i++)for(int j=0;j<3;j++)CHECK(d[i+1][j+1]==e[i][j]);',
 prim: 'int c[20][20];for(auto&r:c)for(int&x:r)x=INF;int E[][3]={{1,2,18},{1,6,21},{1,5,11},{2,6,19},{2,4,9},{2,3,7},{3,4,6},{4,6,15},{4,5,17},{5,6,26}};for(auto&e:E)c[e[0]][e[1]]=c[e[1]][e[0]]=e[2];CHECK(Prim(6,c)==56);',
 kruskal: 'CHECK(Kruskal(6,{{1,2,18},{1,6,21},{1,5,11},{2,6,19},{2,4,9},{2,3,7},{3,4,6},{4,6,15},{4,5,17},{5,6,26}})==56);',
 huffman: 'Node*t=Huffman({{65,45},{66,13},{67,12},{68,16},{69,9},{70,5}});function<int(Node*,int)>go=[&](Node*p,int d)->int{return p->l?go(p->l,d+1)+go(p->r,d+1):p->f*d;};CHECK(go(t,0)==224);',
 gasEmpty: 'for(int t=0;t<2000;t++){int n=1+rand()%7,m=3+rand()%10,d[20],x[20],s;d[1]=0;for(int i=2;i<=n;i++)d[i]=d[i-1]+1+rand()%9;s=d[n]+rand()%9;int D[20];copy(d,d+20,D);int r=MinStops(s,n,m,d,x);int best=-1;for(int k=1;k<1<<n;k+=2){int reach=0,c=0;bool ok=true;for(int i=1;i<=n;i++){if(D[i]>reach){ok=false;break;}if(k>>(i-1)&1){reach=D[i]+m;c++;}}if(ok&&reach>=s&&(best<0||c<best))best=c;}CHECK(r==best||(s==0));if(r!=best&&s!=0){printf("n%d m%d s%d r%d b%d\\n",n,m,s,r,best);}}',
 queen: 'int e[]={0,1,0,0,2,10,4,40,92};for(n=1;n<=8;n++){sum=0;Backtrack(1);CHECK(sum==e[n]);}',
 clique: 'for(int t=0;t<200;t++){n=1+rand()%8;cn=bestn=0;memset(x,0,sizeof x);for(int i=1;i<=n;i++)for(int j=1;j<i;j++)a[i][j]=a[j][i]=rand()%2;Backtrack(1);int b=0;for(int k=0;k<1<<n;k++){bool ok=true;for(int i=1;i<=n;i++)for(int j=1;j<i;j++)if((k>>(i-1)&1)&&(k>>(j-1)&1)&&!a[i][j])ok=false;if(ok)b=max(b,__builtin_popcount(k));}CHECK(bestn==b);}',
 color: 'n=3;m=3;for(int i=1;i<=3;i++)for(int j=1;j<=3;j++)a[i][j]=i!=j;Backtrack(1);CHECK(sum==6);',
 loading: 'for(int t=0;t<300;t++){n=1+rand()%8;c=5+rand()%30;cw=bestw=r=0;for(int i=1;i<=n;i++){w[i]=1+rand()%15;r+=w[i];}Backtrack(1);int b=0;for(int k=0;k<1<<n;k++){int s=0;for(int i=1;i<=n;i++)if(k>>(i-1)&1)s+=w[i];if(s<=c)b=max(b,s);}CHECK(bestw==b);}',
 tsp: 'for(int t=0;t<100;t++){n=3+rand()%4;cc=0;bestc=INF;for(int i=1;i<=n;i++){x[i]=i;for(int j=1;j<=n;j++)a[i][j]=1+rand()%20;}Backtrack(2);vector<int>p;for(int i=2;i<=n;i++)p.push_back(i);int b=INF;do{int s=a[1][p[0]];for(size_t i=1;i<p.size();i++)s+=a[p[i-1]][p[i]];s+=a[p.back()][1];b=min(b,s);}while(next_permutation(p.begin(),p.end()));CHECK(bestc==b);}',
};
const PRE = { hanoi: 'int cnt=0;void Move(int,int){cnt++;}', randSelect: 'int RandomizedPartition(int a[],int p,int r){int k=p+rand()%(r-p+1);swap(a[k],a[p]);int x=a[p],i=p;for(int j=p+1;j<=r;j++)if(a[j]<x)swap(a[++i],a[j]);swap(a[p],a[i]);return i;}' };
let bad = 0; const miss = Object.keys(K).filter(k => !T[k]); if (miss.length) { console.log('NO TEST', miss); bad++; }
for (const k of Object.keys(T)) {
  const f = join(dir, k); writeFileSync(f + '.cpp', `#include <bits/stdc++.h>\nusing namespace std;int BAD=0;\n#define CHECK(c) do{if(!(c)){BAD++;}}while(0)\n${INF}${PRE[k] || ''}\n${K[k]}\nint main(){srand(7);${T[k]}\nreturn BAD?1:0;}`.replace('#include <bits/stdc++.h>', ['iostream', 'sstream', 'vector', 'string', 'map', 'set', 'queue', 'algorithm', 'functional', 'cstring', 'cstdlib', 'cstdio', 'cmath'].map(x => `#include <${x}>`).join('\n')));
  try { execFileSync('clang++', ['-std=c++17', '-fsanitize=address,undefined', '-O1', '-w', f + '.cpp', '-o', f], { stdio: 'pipe' }); execFileSync(f, { stdio: 'pipe' }); } catch (e) { bad++; console.log('FAIL', k, String(e.stderr || e.message).slice(0, 500), String(e.stdout || '').slice(0, 300)); }
}
console.log(`cpp: ${Object.keys(T).length} 段，失败 ${bad}`); process.exit(bad ? 1 : 0);
