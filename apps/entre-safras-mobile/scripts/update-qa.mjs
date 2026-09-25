import { build } from 'vite';
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=process.cwd();
for(const id of ['qa-a','qa-b']){process.env.VITE_BUILD_ID=id;await build({build:{outDir:`work/${id}`,emptyOutDir:true}});}
let current='qa-a';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.json':'application/json'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const base=resolve(root,'work',current);let file=resolve(base,'.'+pathname);if(!file.startsWith(base))throw Error('path');if((await stat(file)).isDirectory())file=resolve(file,'index.html');res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(4175,'127.0.0.1',r));
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:360,height:640},hasTouch:true});const page=await context.newPage();
try{
 await page.goto('http://127.0.0.1:4175');await page.getByText('Disponível offline',{exact:true}).waitFor();await page.reload();
 await page.getByRole('button',{name:'Nova partida',exact:true}).click();await page.getByRole('button',{name:'Começar a primeira safra'}).click();
 const saved=await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'));
 current='qa-b';await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;await r.update();});await page.getByRole('button',{name:'Aplicar atualização disponível'}).waitFor();
 if(await page.locator('#app').getAttribute('data-build')!=='qa-a')throw Error('Reload automático indevido');
 await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('quota');};});
 await page.getByRole('button',{name:'Aplicar atualização disponível'}).click();await page.getByText(/A atualização foi bloqueada/).waitFor();
 if(await page.locator('dialog[open]').count())throw Error('Atualização aceita sem salvar');
 await page.evaluate(()=>Storage.prototype.setItem=window.originalSet);
 await page.getByRole('button',{name:'Aplicar atualização disponível'}).click();await page.getByRole('button',{name:'Atualizar agora'}).click();
 await page.waitForFunction(()=>document.querySelector('#app')?.dataset.build==='qa-b');
 const restored=await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'));if(restored!==saved)throw Error('Save mudou na atualização');
 await page.getByRole('button',{name:'Continuar partida'}).click();await page.getByRole('heading',{name:'Agora é a vez de Lia'}).waitFor();
 await writeFile('docs/update-qa.json',JSON.stringify({date:new Date().toISOString(),browser:browser.version(),from:'qa-a',to:'qa-b',automaticReload:false,quotaBlocksUpdate:true,savePreserved:true,result:'passed'},null,2));
 console.log('PASS: dois builds reais; quota bloqueia; ativação explícita; save preservado.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
