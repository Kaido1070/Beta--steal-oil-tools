from pathlib import Path
import re

p = Path('js/pages/oil-visual-builder.js')
s = p.read_text(encoding='utf-8')
start = s.index('  function packVisual(plot){')
end = s.index('\n  function gridCells()', start)
new = r'''  function packVisual(plot){
    const pieces=[];let totalArea=0;
    plot.rows.forEach((row,rowIndex)=>{
      const drill=drills.find(d=>d.id===row.drill);if(!drill)return;
      const [baseW,baseH]=fpSize(drill.footprint),count=Math.max(0,Math.floor(Number(row.count)||0));
      totalArea+=baseW*baseH*count;
      for(let instance=0;instance<count;instance++)pieces.push({row,rowIndex,drill,instance,baseW,baseH});
    });
    if(totalArea>25)return null;
    pieces.sort((a,b)=>(b.baseW*b.baseH)-(a.baseW*a.baseH)||Math.max(b.baseW,b.baseH)-Math.max(a.baseW,a.baseH)||a.rowIndex-b.rowIndex);

    function solve(reserve){
      const grid=Array(25).fill(false),placed=[];
      if(reserve){
        for(let yy=reserve.y;yy<reserve.y+reserve.h;yy++)for(let xx=reserve.x;xx<reserve.x+reserve.w;xx++)grid[yy*5+xx]=true;
      }
      const fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true};
      const set=(w,h,x,y,value)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=value};
      const memo=new Set();
      function dfs(i){
        if(i===pieces.length)return true;
        const key=i+':'+grid.map(v=>v?'1':'0').join('');if(memo.has(key))return false;
        const piece=pieces[i],orients=piece.baseW===piece.baseH?[[piece.baseW,piece.baseH]]:[[piece.baseW,piece.baseH],[piece.baseH,piece.baseW]];
        for(const [w,h] of orients){
          for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){
            if(!fits(w,h,x,y))continue;
            set(w,h,x,y,true);placed[i]={...piece,x,y,w,h};
            if(dfs(i+1))return true;
            placed[i]=null;set(w,h,x,y,false);
          }
        }
        memo.add(key);return false;
      }
      return dfs(0)?placed.filter(Boolean):null;
    }

    if(25-totalArea>=4){
      const reserveOrder=[[3,3],[0,3],[3,0],[0,0],[2,3],[1,3],[3,2],[3,1],[0,2],[0,1],[2,0],[1,0],[2,2],[1,2],[2,1],[1,1]];
      for(const [x,y] of reserveOrder){
        const packed=solve({x,y,w:2,h:2});
        if(packed)return packed;
      }
    }
    return solve(null);
  }
'''
s = s[:start] + new + s[end:]
s = s.replace('/* STOT Oil visual plot builder — v5.75 */', '/* STOT Oil visual plot builder — v5.83 */', 1)
p.write_text(s, encoding='utf-8')

c = Path('css/pages/oil-visual-builder.css')
css = c.read_text(encoding='utf-8')
marker = '/* v5.83: neutral drill fill that works with every area color. */'
if marker not in css:
    css += '''\n\n/* v5.83: neutral drill fill that works with every area color. */\n.v572-drill-block{border-color:rgba(157,205,255,.88)!important;background:linear-gradient(145deg,#286596,#173e67)!important;box-shadow:0 0 0 1px rgba(4,12,22,.80),0 0 8px rgba(42,112,170,.22)!important;color:#f7fbff!important}\n.v572-drill-block small{color:#d9edff!important;opacity:.9!important}\n.v572-drill-block b{color:#fff!important}\n'''
c.write_text(css, encoding='utf-8')

i = Path('index.html')
html = i.read_text(encoding='utf-8')
html = re.sub(r'(css/pages/oil-visual-builder\.css\?v=)[0-9.]+', r'\g<1>5.83', html)
html = re.sub(r'(js/pages/oil-visual-builder\.js\?v=)[0-9.]+', r'\g<1>5.83', html)
i.write_text(html, encoding='utf-8')
