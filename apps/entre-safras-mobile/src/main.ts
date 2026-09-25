import { action, catalog, event, roles, type ActionId, type Role } from './domain/catalog';
import { planError, publicState, revenueRange, roleOrder, selectedBalance, setupGame, choiceError, type Game, type Settlement } from './domain/engine';
import { Store } from './app/store';
import { clear, keys, parseSnapshot, type StorageAdapter } from './persistence/snapshot';
import { art, button, detail, dialog, download, el, paragraph, section } from './ui/components';
import './ui/styles/main.css';
const storage: StorageAdapter = { getItem: key => localStorage.getItem(key), setItem: (key, v) => localStorage.setItem(key, v), removeItem: key => localStorage.removeItem(key) };
const normal = new Store(storage, keys.normal), tutorial = new Store(storage, keys.tutorial);
let store = normal;
type View = 'home' | 'team' | 'game' | 'help' | 'history' | 'backup';
let view: View = 'home', activeRole: Role | null = null, holding = false;
const root = document.querySelector<HTMLDivElement>('#app')!;
root.dataset.build = import.meta.env.VITE_BUILD_ID ?? '0.1.0';
const names = { lia: 'Lia', bento: 'Bento', rosa: 'Rosa' };
const duration: Record<string, string> = { permanent: 'Permanente', current_round: 'Nesta safra', project: 'Projeto único', instant: 'Na resolução' };
let returnFocus = '';
function go(next: View, push = true) { const origin = document.activeElement; returnFocus = origin?.textContent ?? ''; view = next; if (push) history.pushState({ view }, '', `#${view}`); render(); window.scrollTo(0, 0); }
history.replaceState({ view }, '', '#home');
window.addEventListener('popstate', e => { const d = document.querySelector('dialog'); if (d) { d.dispatchEvent(new Event('cancel', { cancelable: true })); history.pushState({ view }, '', '#' + view); return; } view = e.state?.view ?? 'home'; render(); });
window.addEventListener('storage', e => { for (const s of [normal, tutorial]) if (e.key === s.key || e.key === null) s.externalChange(); });
function back() { if (history.state?.view === view && history.length > 1) history.back(); else go(store.state ? 'game' : 'home', false); }
function start(replay?: Game) {
  const create = () => { const seed = crypto.getRandomValues(new Uint32Array(1))[0]; store = normal; if (!normal.replace(setupGame(crypto.randomUUID(), replay?.seed ?? seed, replay?.deck))) return; activeRole = null; holding = false; go('team'); };
  if (normal.state && normal.state.phase !== 'finished') dialog('Substituir a partida?', [paragraph('A partida atual será substituída. Exporte um backup para guardá-la.')], 'Substituir e começar', create); else create();
}
function startTutorial() {
  store = tutorial;
  const first = ['drought-1', 'pests-1', 'regular-1', 'flood-1', 'favorable-1'];
  tutorial.replace(setupGame(crypto.randomUUID(), 1, [...first, ...catalog.eventCopies.map(e => e.id).filter(e => !first.includes(e))]));
  tutorial.dispatch({ type: 'createGame' }); activeRole = null; holding = false; go('game');
}
function home(main: HTMLElement) {
  main.append(el('span', 'UM JOGO SOBRE CUIDAR DO AMANHÃ', 'eyebrow'), el('h1', 'Entre Safras'), paragraph('Três papéis. Cinco safras. Um futuro em comum.'), art('vila', 'village'), section('Bem-vindos à Vila das Águas', paragraph('Cultivem, previnam perdas e construam uma cooperativa. O desafio é chegar à quinta safra com toda a comunidade de pé.'), paragraph('Joguem juntos no mesmo celular. Três pessoas são recomendadas; também funciona em dupla, em grupos ou como ensaio solo.')));
  if (normal.state) main.append(button('Continuar partida', () => { store = normal; activeRole = null; holding = false; go(normal.state?.phase === 'setup' ? 'team' : 'game'); }, 'primary'));
  main.append(button('Nova partida', () => start(), normal.state ? 'secondary' : 'primary'), button('Aprender a jogar', startTutorial, 'secondary'), button('Ajuda e regras', () => go('help'), 'text-button'), button('Backups e dados', () => go('backup'), 'text-button'), paragraph('20–30 minutos é a duração pretendida, ainda em avaliação com jogadores.'));
}
function team(main: HTMLElement) {
  main.append(el('h1', 'Quem cuida da vila?'), paragraph('Combinem quem assume cada papel. Com duas pessoas, uma pode cuidar das duas famílias. Em quatro ou cinco, formem duplas. Os planos são públicos.'));
  for (const r of catalog.roles) main.append(section(r.name, art(r.id, 'portrait'), paragraph(r.theme), paragraph(r.role === 'farmer' ? 'Agricultor · começa com 12 moedas' : 'Governo · começa com 6 moedas')));
  main.append(button('Começar a primeira safra', () => { if (store.dispatch({ type: 'createGame' })) { activeRole = null; holding = false; go('game'); } }, 'primary'));
}
function header(main: HTMLElement, s: Game) {
  const labels = { setup: 'Equipe', planning: 'Planejamento', event: 'Evento', summary: 'Balanço', finished: 'Resultado' };
  main.append(el('p', `SAFRA ${s.round}/5 · ${labels[s.phase]}`, 'eyebrow'), el('p', `Resiliência ${s.resilience}/6 · ${s.resilience >= 3 ? 'Comunidade com reserva ambiental' : 'Comunidade vulnerável'}`, 'resilience'));
  if (store === tutorial) main.append(section('Tutorial · uma safra guiada', paragraph('O exemplo usa Seca. Escolha Cobertura para Lia, Mutirão para Bento e Assistência para Rosa. Observe a proteção ambiental e as contas.'), button('Sair do tutorial', () => { store = normal; activeRole = null; holding = false; go('home'); }, 'text-button')));
}
function choiceDetail(s: Game, role: Role, id: ActionId) {
  const a = action(id), content: Node[] = [paragraph(a.description), paragraph(`${a.cost} moedas · ${duration[a.duration]}`)];
  let target: 'lia' | 'bento' | undefined = s.choices[role]?.target;
  if (id === 'G3') {
    const label = el('label', 'Família que receberá o apoio'); const select = el('select'); select.append(new Option('Escolha a família', ''), new Option('Lia', 'lia'), new Option('Bento', 'bento')); select.value = target ?? ''; select.onchange = () => { target = select.value === 'lia' || select.value === 'bento' ? select.value : undefined; }; label.append(select); content.push(label);
  }
  const blocked = id === 'G3' ? (s.cash[role] < a.cost ? 'Saldo insuficiente.' : null) : choiceError(s, role, { action: id });
  if (blocked) content.push(paragraph(blocked));
  const modal = dialog(a.name, content, 'Escolher esta ação', () => { if (store.dispatch({ type: 'selectAction', role, choice: { action: id, ...(target ? { target } : {}) } }, s.revision)) render(); });
  if (blocked) modal.node.querySelector<HTMLButtonElement>('.primary')!.disabled = true;
}
function planning(main: HTMLElement, s: Game) {
  const order = roleOrder(s);
  if (!activeRole && !holding) activeRole = order.find(r => !s.confirmed[r]) ?? null;
  if (activeRole && !holding) {
    main.append(art(activeRole, 'portrait hero-portrait'), el('h1', `Agora é a vez de ${names[activeRole]}`), paragraph('Passe o celular. Conversem antes de confirmar: as escolhas serão resolvidas juntas.'), button('Estou com o celular', () => { holding = true; render(); }, 'primary'), button('Ver plano conjunto', () => { activeRole = null; holding = true; renderPlan(main, s, true); }, 'secondary')); return;
  }
  if (activeRole) {
    const r = activeRole;
    main.append(el('h1', `${names[r]} escolhe`), el('p', `${r === 'rosa' ? 'GOVERNO' : 'AGRICULTOR'} · Caixa disponível: ${s.cash[r]} moedas`, 'cash'), paragraph(r === 'rosa' ? 'A dotação desta safra já foi recebida.' : 'O plantio desta safra já foi pago.'));
    if (r !== 'rosa') { main.append(paragraph(`Instalações: ${s.installations[r].map(i => i === 'soil_cover' ? 'Cobertura' : 'Diversificação').join(', ') || 'nenhuma'}`)); for (const i of s.installations[r]) main.append(art(i, 'marker')); }
    if (s.cooperativeRound) main.append(art('cooperative', 'marker'));
    for (const a of [...catalog.actions.filter(a => a.role === (r === 'rosa' ? 'government' : 'farmer')), action('reserve')]) {
      const chosen = s.choices[r]?.action === a.id;
      const node = button('', () => choiceDetail(s, r, a.id as ActionId), `action-card${chosen ? ' selected' : ''}`);
      if (a.id !== 'reserve') node.append(art(a.id, 'symbol'));
      node.append(el('strong', `${chosen ? '✓ ' : ''}${a.name}`), el('span', `${a.cost} moedas · ${duration[a.duration]}`), el('span', a.description));
      const error = choiceError(s, r, { action: a.id as ActionId, ...(a.id === 'G3' ? { target: 'lia' as const } : {}) });
      if (error) node.append(el('span', error, 'error-text'));
      main.append(node);
    }
    const choice = s.choices[r];
    if (choice) main.append(section('Sua escolha', paragraph(`${action(choice.action).name}${choice.target ? ` → ${names[choice.target]}` : ''}. Saldo após custo: ${selectedBalance(s, r)} moedas. A receita depende do evento.`)));
    const confirm = button('Confirmar papel', () => { if (store.dispatch({ type: 'confirmRole', role: r }, s.revision)) { activeRole = order.find(role => !store.state!.confirmed[role]) ?? null; holding = !activeRole; render(); window.scrollTo(0, 0); } }, 'primary'); confirm.disabled = !choice;
    main.append(confirm, button('Ver plano conjunto', () => { activeRole = null; holding = true; renderPlan(main, s, true); }, 'secondary'));
  } else renderPlan(main, s);
}
function renderPlan(main: HTMLElement, s: Game, replace = false) {
  if (replace) { main.replaceChildren(); header(main, s); }
  main.append(el('h1', 'Plano conjunto'), paragraph(`${roles.filter(r => s.confirmed[r]).length}/3 papéis confirmados`));
  for (const r of roles) {
    const c = s.choices[r]; const panel = section(names[r], paragraph(`${c ? action(c.action).name : 'Sem escolha'}${c?.target ? ` → ${names[c.target]}` : ''} · ${s.confirmed[r] ? 'Confirmado' : 'Pendente'}`), paragraph(`Caixa ${s.cash[r]} · Após custo ${selectedBalance(s, r)}`), button(`Revisar ${names[r]}`, () => { if (store.dispatch({ type: 'unconfirmRole', role: r }, s.revision)) { activeRole = r; holding = false; render(); } }, 'secondary'));
    if (r !== 'rosa') { const range = revenueRange(s, r); if (range) panel.append(paragraph(`Receita possível: ${range[0]} a ${range[1]} moedas, conforme o evento.`)); }
    main.append(panel);
  }
  const coop = roles.filter(r => ['A4', 'G4'].includes(s.choices[r]?.action ?? '')).length;
  main.append(paragraph(s.cooperativeRound ? `Cooperativa construída na safra ${s.cooperativeRound}.` : `Cooperativa: ${coop}/3 contribuições. Precisa dos três papéis; o bônus começa na safra seguinte.`));
  const error = planError(s); if (error) main.append(paragraph(error));
  const reveal = button('Revelar evento', () => { if (store.dispatch({ type: 'resolveRound' }, s.revision)) { activeRole = null; holding = false; render(); window.scrollTo(0, 0); } }, 'primary'); reveal.disabled = !!error; main.append(reveal);
  main.append(detail('Eventos restantes', ...publicState(s).remaining.map(e => paragraph(`${e.name}: ${e.count}`))));
}
function accounts(h: Settlement): HTMLElement {
  const group = el('div');
  for (const r of roles) { const a = h.accounts[r]; group.append(detail(`${names[r]} · ${a.after} moedas`, paragraph(`Caixa anterior ${a.before}; ${r === 'rosa' ? 'dotação' : 'plantio'} ${a.preparation > 0 ? '+' : ''}${a.preparation}; ação −${a.cost}; apoio recebido +${a.transfer}.`), ...(r === 'rosa' ? [] : [paragraph(`Colheita bruta ${a.gross}. Perda bruta ${a.grossLoss}; proteção coletiva ${a.community}, individual ${a.individual}, seguro ${a.insurance}. Perda efetiva ${a.loss}; receita ${a.revenue}.`)]), paragraph(`Caixa final: ${a.after}.`))); }
  const r = h.resilience; group.append(detail('Como mudou a resiliência', paragraph(`Inicial ${r.before} + instalações ${r.installations} + assistência ${r.assistance} + cooperativa ${r.cooperative} + evento (${r.event}) − desgaste ${r.wear} = ${r.after}, limitado entre 0 e 6.`))); return group;
}
function game(main: HTMLElement, s: Game) {
  header(main, s);
  if (s.phase === 'setup') { team(main); return; }
  if (s.phase === 'planning') { planning(main, s); return; }
  const h = s.history.at(-1)!;
  if (s.phase === 'event') { const e = event(h.eventId); main.append(art(e.id, 'event-art'), el('h1', e.name), paragraph(`Perda bruta por família: ${e.grossLossPerFarmer}. Bônus de colheita: ${e.harvestBonusPerFarmer}. Variação ambiental: ${e.resilienceDelta}.`), paragraph('O resultado já foi calculado. Veja como as escolhas protegeram a comunidade.'), button('Ver balanço', () => store.dispatch({ type: 'showSummary' }, s.revision), 'primary')); }
  else if (s.phase === 'summary') {
    main.append(el('h1', `Balanço da safra ${s.round}`), section('A comunidade depois da colheita', ...roles.map(r => paragraph(`${names[r]}: ${s.cash[r]} moedas`)), paragraph(`Resiliência: ${s.resilience}/6`)), accounts(h));
    if (store === tutorial) main.append(section('O que aprendemos?', paragraph('Lia termina com 9, Bento com 12 e Rosa com 5 moedas quando seguimos o exemplo. A resiliência fica em 4. A cobertura protege já nesta safra; a cooperativa só paga bônus na seguinte.'), button('Concluir tutorial', () => { store = normal; activeRole = null; holding = false; go('home'); }, 'primary')));
    else { const ended = s.round === 5 || h.outcome.length > 0; main.append(button(ended ? 'Ver resultado' : 'Próxima safra', () => { activeRole = null; holding = false; store.dispatch({ type: ended ? 'finishGame' : 'startNextRound' }, s.revision); window.scrollTo(0, 0); }, 'primary')); }
  } else {
    main.append(art('vila', 'village'), el('h1', h.victory ? 'Vitória coletiva!' : 'Objetivo coletivo não alcançado'), ...h.outcome.map(paragraph), section('Condições da comunidade', paragraph(`${s.cash.lia >= 3 ? '✓' : '✗'} Lia: ${s.cash.lia}/3 moedas`), paragraph(`${s.cash.bento >= 3 ? '✓' : '✗'} Bento: ${s.cash.bento}/3 moedas`), paragraph(`${s.resilience >= 3 ? '✓' : '✗'} Resiliência: ${s.resilience}/3`), paragraph(`${s.cooperativeRound ? '✓' : '✗'} Cooperativa ${s.cooperativeRound ? 'construída' : 'ausente'}`)), section('Conversem sobre a partida', paragraph('Quem ficou com menos recursos e por quê? Quando a prevenção fez diferença? O apoio público chegou a quem precisava? O que fariam diferente com os mesmos eventos?')), button('Repetir sequência', () => start(s), 'primary'), button('Exportar relatório', () => download('entre-safras-relatorio.json', publicState(s)), 'secondary'), button('Nova partida', () => start(), 'secondary'));
  }
}
function help(main: HTMLElement) {
  main.append(el('h1', 'Como cuidar da vila'), paragraph('Uma safra tem preparação, escolhas, evento e balanço. O aplicativo paga 3 de plantio por família e dá 3 ao governo. Cada papel escolhe uma ação; ninguém gasta até revelar.'), paragraph('Resiliência (R) vai de 0 a 6. Cada 3 pontos no início da safra protegem 1 contra seca ou enchente. Prevenção evita o desgaste de 1. Novas instalações e Assistência contam como prevenção; a cooperativa não.'), paragraph('Para vencer: concluir cinco safras, manter pelo menos 3 moedas para cada família, R de pelo menos 3 e uma cooperativa. R zero ou família abaixo de 3 encerra o jogo após o balanço.'), paragraph('A cooperativa custa 2 de cada papel na mesma safra, aumenta R em 1 e rende 1 por família a partir da safra seguinte. Compras públicas não podem financiar a ação atual do destinatário.'));
  for (const a of catalog.actions) main.append(detail(`${a.name} · ${a.role === 'farmer' ? 'Agricultor' : 'Governo'} · ${a.cost} moedas`, paragraph(a.description), paragraph(duration[a.duration])));
  main.append(section('Usar no navegador', paragraph('Entre Safras funciona diretamente nesta página, em computadores e telas pequenas. O salvamento fica neste navegador e endereço; exporte um backup antes de limpar os dados do site ou trocar de dispositivo.')));
}
function backup(main: HTMLElement) {
  main.append(el('h1', 'Backups e dados'), paragraph('Backup completo permite retomar e inclui a sequência futura. Relatório mostra somente o que já aconteceu. Os arquivos ficam com você.'));
  if (store.state) main.append(button('Exportar backup completo', () => download('entre-safras-backup.json', store.state), 'primary'), button('Exportar relatório', () => download('entre-safras-relatorio.json', publicState(store.state!)), 'secondary'));
  const label = el('label', 'Importar backup JSON (até 1 MB)'); const input = el('input'); input.type = 'file'; input.accept = 'application/json,.json';
  input.onchange = async () => { const file = input.files?.[0]; if (!file) return; try { if (file.size > 1048576) throw new Error('Arquivo excede 1 MB.'); const s = parseSnapshot(await file.text()); dialog('Restaurar este backup?', [paragraph(`Safra ${s.round}, ${s.phase}. Substituirá a partida normal neste navegador.`)], 'Restaurar partida', () => { store = normal; if (normal.replace(s)) { activeRole = null; holding = false; go(s.phase === 'setup' ? 'team' : 'game'); } }); } catch (e) { store.message = e instanceof Error ? e.message : 'Arquivo inválido.'; render(); } };
  label.append(input); main.append(label, button('Apagar dados do jogo', () => dialog('Apagar partidas locais?', [paragraph('Partida normal, tutorial e cópias anteriores serão removidos deste navegador. Exporte um backup antes.')], 'Apagar partidas', () => { try { clear(storage); normal.reload(); tutorial.reload(); store = normal; go('home'); } catch { store.message = 'Não foi possível apagar os dados.'; render(); } }), 'secondary'));
}
function render() {
  if (document.querySelector('dialog[open]')) return;
  const previousFocus = document.activeElement?.textContent;
  root.replaceChildren(); const top = el('header', '', 'topbar'); top.append(button('Entre Safras', () => go('home'), 'brand'), el('span', navigator.onLine ? 'Vila das Águas' : 'Sem conexão', 'connection')); root.append(top);
  const main = el('main'); main.id = 'main'; main.tabIndex = -1;
  if (view === 'home') home(main); else if (view === 'team') team(main); else if (view === 'game' && store.state) game(main, store.state); else if (view === 'help') help(main); else if (view === 'backup') backup(main); else if (view === 'history') { main.append(el('h1', 'Histórico da comunidade')); if (!store.state?.history.length) main.append(paragraph('Nenhuma safra resolvida ainda.')); for (const h of store.state?.history ?? []) main.append(section(`Safra ${h.round} · ${event(h.eventId).name}`, ...roles.map(r => paragraph(`${names[r]}: ${action(h.choices[r]!.action).name}`)), accounts(h))); } else home(main);
  if (view === 'help' || view === 'history' || view === 'backup') main.append(button('Voltar', back, 'primary'));
  const status = el('div', '', 'status'); status.setAttribute('aria-live', 'polite');
  if (store.message) status.append(el('p', store.message, store.saved ? 'saved' : 'warning'));
  if (store.state && !store.saved) status.append(paragraph('A sessão atual não está confirmada como salva. Exporte um backup.'));
  if (store.stale) { status.setAttribute('role', 'alert'); status.append(button('Recarregar versão salva', () => { store.reload(); activeRole = null; holding = false; render(); }, 'primary')); main.querySelectorAll('button').forEach(b => { if (!b.textContent?.includes('Exportar')) b.disabled = true; }); }
  main.append(status); root.append(main);
  if (view === 'game') { const nav = el('nav', '', 'bottom-nav'); nav.setAttribute('aria-label', 'Apoio à partida'); nav.append(button('Ajuda', () => go('help')), button('Histórico', () => go('history')), button('Backup', () => go('backup'))); root.append(nav); }
  const focusText = previousFocus || returnFocus; const focus = [...root.querySelectorAll('button')].find(b => b.textContent === focusText); if (focus) focus.focus({ preventScroll: true }); else main.focus({ preventScroll: true });
}
normal.subscribe(render); tutorial.subscribe(render); render();


