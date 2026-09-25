import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { initial, resolve, next, apply } from '../fixtures/helpers';
import { journey } from '../fixtures/reference';
import type { Game } from '../../src/domain/engine';
async function importGame(page: Page, state: Game) {
  await page.goto('/'); await page.getByRole('button', { name: 'Backups e dados', exact: true }).click();
  await page.getByLabel('Importar backup JSON').setInputFiles({ name: 'partida.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(state)) });
  await page.getByRole('button', { name: 'Restaurar partida', exact: true }).click();
}
async function choose(page: Page, name: string) {
  await page.getByRole('button', { name: 'Estou com o celular', exact: true }).click();
  await page.getByRole('button', { name: new RegExp(name) }).first().click();
  await page.getByRole('button', { name: 'Escolher esta ação', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar papel', exact: true }).click();
}
test('nova partida, tutorial isolado, revisão e ajuda preservam recursos', async ({ page }) => {
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/'); await page.getByRole('button',{name:'Nova partida',exact:true}).click(); await page.getByRole('button',{name:'Começar a primeira safra'}).click();
  await choose(page,'Cobertura do solo');await choose(page,'Mutirão de colheita');await choose(page,'Assistência técnica');
  await expect(page.getByText('3/3 papéis confirmados')).toBeVisible();
  await page.getByRole('button',{name:'Ajuda',exact:true}).click(); await page.goBack(); await expect(page.getByText('3/3 papéis confirmados')).toBeVisible();
  await page.getByRole('button',{name:'Revisar Lia'}).click();await page.getByRole('button',{name:'Estou com o celular'}).click();await page.getByRole('button',{name:'Confirmar papel'}).click();
  await page.reload();await page.getByRole('button',{name:'Continuar partida'}).click();await expect(page.getByText('3/3 papéis confirmados')).toBeVisible();
  const before=await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'));
  await page.getByRole('button',{name:'Entre Safras',exact:true}).click();await page.getByRole('button',{name:'Aprender a jogar'}).click();
  await choose(page,'Cobertura do solo');await choose(page,'Mutirão de colheita');await choose(page,'Assistência técnica');
  await page.getByRole('button',{name:'Revelar evento'}).click();await expect(page.getByRole('heading',{name:'Seca',exact:true})).toBeVisible();await page.getByRole('button',{name:'Ver balanço'}).click();
  await expect(page.getByText('Lia: 9 moedas',{exact:true})).toBeVisible();await expect(page.getByText('Bento: 12 moedas',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Concluir tutorial'}).click();expect(await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'))).toBe(before);expect(errors).toEqual([]);
});
test('trajeto de cinco safras por toque, retomada e vitória',async({page})=>{
  await importGame(page,initial(journey.map(j=>j.event)));
  const names:Record<string,string>={A1:'Cobertura do solo',A2:'Diversificação',A3:'Mutirão de colheita',A4:'Cooperativa',G1:'Assistência técnica',G2:'Seguro da safra',G4:'Cooperativa',reserve:'Reservar'};
  for(const [i,j] of journey.entries()){
    const order=[0,1,2].map(n=>(n+i)%3);
    for(const role of order)await choose(page,names[j.actions[role]]);
    await page.getByRole('button',{name:'Revelar evento'}).click();
    await page.reload();await page.getByRole('button',{name:'Continuar partida'}).click();await page.getByRole('button',{name:'Ver balanço'}).click();
    for(const [r,name] of ['Lia','Bento','Rosa'].entries())await expect(page.getByText(`${name}: ${j.cash[r]} moedas`,{exact:true})).toBeVisible();
    await page.getByRole('button',{name:i===4?'Ver resultado':'Próxima safra',exact:true}).click();
  }
  await expect(page.getByRole('heading',{name:'Vitória coletiva!'})).toBeVisible();await page.reload();await page.getByRole('button',{name:'Continuar partida'}).click();await expect(page.getByRole('heading',{name:'Vitória coletiva!'})).toBeVisible();
  await page.getByRole('button',{name:'Repetir sequência'}).click();await page.getByRole('button',{name:'Começar a primeira safra'}).click();await expect(page.getByRole('heading',{name:'Agora é a vez de Lia'})).toBeVisible();
});
test('cooperativa incompleta bloqueia e compras pedem destinatário',async({page})=>{
  await importGame(page,initial());await choose(page,'Cooperativa');await choose(page,'Reservar');
  await page.getByRole('button',{name:'Estou com o celular'}).click();await page.getByRole('button',{name:/Compras públicas/}).click();await page.getByRole('button',{name:'Escolher esta ação'}).click();await expect(page.getByText('Escolha Lia ou Bento como destinatário.')).toBeVisible();
  await page.getByRole('button',{name:/Compras públicas/}).click();await page.getByLabel('Família que receberá').selectOption('lia');await page.getByRole('button',{name:'Escolher esta ação'}).click();await page.getByRole('button',{name:'Confirmar papel'}).click();await expect(page.getByRole('button',{name:'Revelar evento'})).toBeDisabled();await expect(page.getByText(/Cooperativa incompleta:/)).toBeVisible();
});
test('importação inválida preserva partida e outra aba bloqueia',async({page,context})=>{
  await importGame(page,initial());const before=await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'));
  await page.getByRole('button',{name:'Backup',exact:true}).click();await page.getByLabel('Importar backup JSON').setInputFiles({name:'erro.json',mimeType:'application/json',buffer:Buffer.from('{"schemaVersion":9}')});await expect(page.getByText(/Backup inválido ou versão incompatível/)).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('entre-safras:game:v1'))).toBe(before);
  const other=await context.newPage();await other.goto('/');await other.evaluate(()=>localStorage.removeItem('entre-safras:game:v1'));await expect(page.getByRole('button',{name:'Recarregar versão salva'})).toBeVisible();
});
test('derrota ambiental e financeira apresentam motivo exato',async({page})=>{
  let s=resolve(initial(['drought-1','pests-1']),['reserve','reserve','reserve']);s=resolve(next(s),['reserve','reserve','reserve']);
  await importGame(page,s);await page.getByRole('button',{name:'Ver balanço'}).click();await page.getByRole('button',{name:'Ver resultado'}).click();await expect(page.getByText('Resiliência chegou a zero.')).toBeVisible();
  const cashFixture = JSON.parse(readFileSync('tests/fixtures/cash-defeat.json','utf8')) as Game;
  await importGame(page,cashFixture);await page.getByRole('button',{name:'Ver balanço'}).click();await page.getByRole('button',{name:'Ver resultado'}).click();await expect(page.getByText('Lia ficou sem as 3 moedas necessárias ao próximo plantio.')).toBeVisible();
});
test('cache pronto permite fechar, reabrir e jogar offline',async({page,context,browserName})=>{
  test.fixme(browserName === 'webkit', 'Reabertura offline falhou com erro interno do WebKit 26.6 no Windows; pendente em Safari real.');
  await page.goto('/');await expect(page.getByText('Disponível offline',{exact:true})).toBeVisible();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto('/');await offline.getByRole('button',{name:'Nova partida',exact:true}).click();await offline.getByRole('button',{name:'Começar a primeira safra'}).click();
  await choose(offline,'Cobertura do solo');await choose(offline,'Mutirão de colheita');await choose(offline,'Assistência técnica');await offline.getByRole('button',{name:'Revelar evento'}).click();await offline.getByRole('button',{name:'Ver balanço'}).click();await expect(offline.getByRole('heading',{name:'Balanço da safra 1'})).toBeVisible();await offline.reload();await offline.getByRole('button',{name:'Continuar partida'}).click();await expect(offline.getByRole('heading',{name:'Balanço da safra 1'})).toBeVisible();
  await importGame(offline,initial(journey.map(j=>j.event)));
  const actionNames:Record<string,string>={A1:'Cobertura do solo',A2:'Diversificação',A3:'Mutirão de colheita',A4:'Cooperativa',G1:'Assistência técnica',G2:'Seguro da safra',G4:'Cooperativa',reserve:'Reservar'};
  for(const [i,j] of journey.entries()){for(const r of [0,1,2].map(n=>(n+i)%3))await choose(offline,actionNames[j.actions[r]]);await offline.getByRole('button',{name:'Revelar evento'}).click();await offline.getByRole('button',{name:'Ver balanço'}).click();await offline.getByRole('button',{name:i===4?'Ver resultado':'Próxima safra'}).click();}
  await expect(offline.getByRole('heading',{name:'Vitória coletiva!'})).toBeVisible();
});
for(const [width,height] of [[320,568],[360,640],[390,844],[412,915]])test(`layout ${width}x${height}, foco e controles`,async({page},info)=>{
  await page.setViewportSize({width,height});await page.goto('/');await expect(page.getByRole('heading',{name:'Entre Safras',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`docs/capturas/${info.project.name}-${width}-inicio.png`,fullPage:true});
  await page.getByRole('button',{name:'Nova partida',exact:true}).click();await page.getByRole('button',{name:'Começar a primeira safra'}).click();await page.getByRole('button',{name:'Estou com o celular'}).click();await page.getByRole('button',{name:/Cobertura do solo/}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(page.getByRole('button',{name:/Cobertura do solo/})).toBeFocused();
  const sizes=await page.locator('button').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect()).map(r=>({w:r.width,h:r.height})));expect(sizes.every(s=>s.w>=48&&s.h>=48)).toBe(true);
  await page.screenshot({path:`docs/capturas/${info.project.name}-${width}-acoes.png`,fullPage:true});await page.evaluate(()=>document.documentElement.style.fontSize='32px');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('retomada de balanço não duplica resolução',async({page})=>{const s=apply(resolve(initial(),['A1','A3','G1']),{type:'showSummary'});await importGame(page,s);await page.reload();await page.getByRole('button',{name:'Continuar partida'}).click();await expect(page.getByText('Lia: 9 moedas',{exact:true})).toBeVisible();});
test('rotação, teclado, Voltar no diálogo e toque duplicado',async({page})=>{
 await importGame(page,initial());await page.getByRole('button',{name:'Estou com o celular'}).click();await page.getByRole('button',{name:/Cobertura do solo/}).click();await page.goBack();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Lia escolhe'})).toBeVisible();
 await page.setViewportSize({width:844,height:390});await expect(page.getByText(/Caixa disponível: 9 moedas/)).toBeVisible();await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:/Cobertura do solo/}).focus();await page.keyboard.press('Enter');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:/Cobertura do solo/})).toBeFocused();
 await page.getByRole('button',{name:/Cobertura do solo/}).click();await page.getByRole('button',{name:'Escolher esta ação'}).click();await page.getByRole('button',{name:'Confirmar papel'}).evaluate((node:HTMLButtonElement)=>{node.click();node.click();});
 const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('entre-safras:game:v1')!));expect(s.confirmed).toEqual({lia:true,bento:false,rosa:false});expect(s.cash).toEqual({lia:9,bento:9,rosa:9});
});
test('corrupção recupera cópia anterior e falha de escrita mantém sessão',async({page})=>{
 await importGame(page,initial());await page.getByRole('button',{name:'Estou com o celular'}).click();await page.getByRole('button',{name:/Cobertura do solo/}).click();await page.getByRole('button',{name:'Escolher esta ação'}).click();
 await page.evaluate(()=>localStorage.setItem('entre-safras:game:v1','{quebrado'));await page.reload();await expect(page.getByText(/A cópia anterior válida foi recuperada/)).toBeVisible();await page.getByRole('button',{name:'Continuar partida'}).click();await page.getByRole('button',{name:'Estou com o celular'}).click();
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('quota');};});await page.getByRole('button',{name:/Cobertura do solo/}).click();await page.getByRole('button',{name:'Escolher esta ação'}).click();await expect(page.getByText(/Sem salvamento: não foi possível gravar/)).toBeVisible();await page.getByRole('button',{name:'Confirmar papel'}).click();await expect(page.getByRole('heading',{name:'Agora é a vez de Bento'})).toBeVisible();
});


