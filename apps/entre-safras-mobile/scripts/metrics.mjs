import { readdir, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const files=await walk('dist');let total=0,jsGzip=0;
for(const p of files){const b=await readFile(p);total+=b.length;if(p.endsWith('.js')&&p.includes('assets'))jsGzip+=gzipSync(b).length;}
const luminance=c=>{const v=c.match(/[a-f0-9]{2}/gi).map(x=>parseInt(x,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05);};
const pairs=[['texto/papel','20372d','f5f1e6'],['secundário/papel','4e6254','f5f1e6'],['botão primário','ffffff','245943'],['erro/superfície','a84732','fffcf5'],['foco/superfície','24566a','fffcf5']];
const result={method:'Soma gzip dos bundles JS; soma conservadora de todos os arquivos dist; contraste WCAG sRGB calculado. Não mede latência em aparelho físico.',jsGzipBytes:jsGzip,jsBudgetBytes:250000,distBytes:total,precacheBudgetBytes:5000000,contrast:pairs.map(([label,a,b])=>({label,ratio:Number(contrast(a,b).toFixed(2))})),passed:jsGzip<250000&&total<5000000};
await writeFile('docs/metricas.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
