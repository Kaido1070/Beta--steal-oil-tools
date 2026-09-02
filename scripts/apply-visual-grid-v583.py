from pathlib import Path
import re

# 1) Make the visual packer honor the actual refinery reserve selected in Quick Fill.
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
      for(let instance=0;instance<count;instance++)pieces.push({row,rowIndex,drill,instance,baseW,baseH,reserve:false});
    });

    const reserveMeta=window.STOT_REFINERY_RESERVE;
    if(reserveMeta?.plotId===plot.id&&Array.isArray(reserveMeta.pieces)){
      reserveMeta.pieces.forEach((dims,index)=>{
        const baseW=Math.max(1,Number(dims?.[0])||1),baseH=Math.max(1,Number(dims?.[1])||1);
        totalArea+=baseW*baseH;
        pieces.push({reserve:true,reserveIndex:index,rowIndex:-1,baseW,baseH});
      });
    }

    if(totalArea>25)return null;
    pieces.sort((a,b)=>(b.baseW*b.baseH)-(a.baseW*a.baseH)||Number(b.reserve)-Number(a.reserve)||Math.max(b.baseW,b.baseH)-Math.max(a.baseW,a.baseH)||a.rowIndex-b.rowIndex);
    const grid=Array(25).fill(false),placed=[];
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
    if(!dfs(0))return null;
    // Reserved refinery pieces participate in packing but are intentionally not
    // rendered. Their cells therefore stay visibly empty and contiguous.
    return placed.filter(item=>item&&!item.reserve);
  }
'''
s = s[:start] + new + s[end:]
s = s.replace('/* STOT Oil visual plot builder — v5.75 */', '/* STOT Oil visual plot builder — v5.83 */', 1)
p.write_text(s, encoding='utf-8')

# 2) Expose the exact reserve footprint from Quick Fill to the visual builder.
needle = 'lastReserve=reserveOn?{plotId:forestPlot1.id,cells:reserved.reservedCells,qty:reserved.qty,name:reserved.ref.name,removed:reserved.removed}:null;if(typeof renderLayout==="function")renderLayout();'
replacement = 'lastReserve=reserveOn?{plotId:forestPlot1.id,cells:reserved.reservedCells,qty:reserved.qty,name:reserved.ref.name,removed:reserved.removed}:null;window.STOT_REFINERY_RESERVE=reserveOn?{plotId:forestPlot1.id,pieces:refineryPieces(reserved.ref,reserved.qty),qty:reserved.qty,name:reserved.ref.name}:null;if(typeof renderLayout==="function")renderLayout();'
for file_name in ('js/v539-09.js', 'js/beta-patches.bundle.js'):
    f = Path(file_name)
    text = f.read_text(encoding='utf-8')
    if 'window.STOT_REFINERY_RESERVE=reserveOn?' not in text:
        if needle not in text:
            raise SystemExit(f'Quick Fill reserve anchor missing in {file_name}')
        text = text.replace(needle, replacement, 1)
    f.write_text(text, encoding='utf-8')

# 3) Replace purple drill fill with one neutral steel-blue that works against
# every existing area identity color.
c = Path('css/pages/oil-visual-builder.css')
css = c.read_text(encoding='utf-8')
marker = '/* v5.83: neutral drill fill that works with every area color. */'
if marker not in css:
    css += '''\n\n/* v5.83: neutral drill fill that works with every area color. */\n.v572-drill-block{border-color:rgba(157,205,255,.88)!important;background:linear-gradient(145deg,#286596,#173e67)!important;box-shadow:0 0 0 1px rgba(4,12,22,.80),0 0 8px rgba(42,112,170,.22)!important;color:#f7fbff!important}\n.v572-drill-block small{color:#d9edff!important;opacity:.9!important}\n.v572-drill-block b{color:#fff!important}\n'''
c.write_text(css, encoding='utf-8')

# 4) Bust caches for all runtime files touched by this change.
i = Path('index.html')
html = i.read_text(encoding='utf-8')
html = re.sub(r'(css/pages/oil-visual-builder\.css\?v=)[0-9.]+', r'\g<1>5.83', html)
html = re.sub(r'(js/pages/oil-visual-builder\.js\?v=)[0-9.]+', r'\g<1>5.83', html)
html = re.sub(r'(js/beta-patches\.bundle\.js\?v=)[0-9.]+', r'\g<1>5.83', html)
i.write_text(html, encoding='utf-8')
