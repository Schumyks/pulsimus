// Detect eyes/mouth by bbox (deep saturated orange), not by a single scanline.
import sharp from 'sharp';
const [,, INPUT] = process.argv;
const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info; const C = 4;
const at = (x,y)=>{const i=(y*W+x)*C;return [data[i],data[i+1],data[i+2],data[i+3]];};
const feat = new Uint8Array(W*H);
for (let y=0;y<H;y++)for(let x=0;x<W;x++){const [r,g,b,a]=at(x,y); if(a>128 && g<120 && (r-g)>55 && b<110) feat[y*W+x]=1;}
const lab=new Int32Array(W*H), st=new Int32Array(W*H); let c=0; const parts=[];
for(let s=0;s<W*H;s++){ if(!feat[s]||lab[s])continue; c++; let sp=0; st[sp++]=s; lab[s]=c; let ax=W,ay=H,bx=0,by=0,ar=0,sx=0,sy=0;
  while(sp){const p=st[--sp];const x=p%W,y=(p/W)|0;ar++;sx+=x;sy+=y;if(x<ax)ax=x;if(x>bx)bx=x;if(y<ay)ay=y;if(y>by)by=y;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const np=ny*W+nx;if(feat[np]&&!lab[np]){lab[np]=c;st[sp++]=np;}}}
  if(ar>2000) parts.push({ax,ay,bx,by,ar,cx:Math.round(sx/ar),cy:Math.round(sy/ar)}); }
parts.sort((a,b)=>a.cx-b.cx);
for(const p of parts) console.log(`center(${p.cx},${p.cy}) bbox[${p.ax}..${p.bx},${p.ay}..${p.by}] w=${p.bx-p.ax} h=${p.by-p.ay} area=${p.ar}`);
