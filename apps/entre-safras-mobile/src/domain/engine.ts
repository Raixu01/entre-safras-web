import { action, catalog, event, p, roles, type ActionId, type Role } from './catalog';
export type Choice = { action: ActionId; target?: 'lia' | 'bento' };
export type Plan = Record<Role, Choice | null>;
export type Cash = Record<Role, number>;
export type Installations = Record<'lia' | 'bento', ('soil_cover' | 'diversification')[]>;
export type Accounts = { before: number; preparation: number; cost: number; transfer: number; gross: number; grossLoss: number; community: number; individual: number; insurance: number; loss: number; revenue: number; after: number };
export type Settlement = { round: number; eventId: string; choices: Plan; accounts: Record<Role, Accounts>; resilience: { before: number; installations: number; assistance: number; cooperative: number; event: number; wear: number; after: number }; cash: Cash; outcome: string[]; victory: boolean };
export type Body = { schemaVersion: 1; rulesVersion: '0.1'; appVersion: '0.1.0'; gameId: string; revision: number; seed: number; shuffleVersion: 'mulberry32-fy-v1'; deck: string[]; cursor: number; round: number; cash: Cash; resilience: number; startResilience: number; installations: Installations; cooperativeRound: number | null; choices: Plan; confirmed: Record<Role, boolean>; history: Settlement[]; commandIds: string[] };
export type Game = Body & ({ phase: 'setup' } | { phase: 'planning' } | { phase: 'event' } | { phase: 'summary' } | { phase: 'finished' });
export type Operation = { type: 'createGame' } | { type: 'selectAction'; role: Role; choice: Choice } | { type: 'confirmRole' | 'unconfirmRole'; role: Role } | { type: 'resolveRound' | 'showSummary' | 'startNextRound' | 'finishGame' };
export type Command = Operation & { id: string; expectedRevision: number };
export type Result = { ok: true; state: Game } | { ok: false; code: string; message: string };
const emptyPlan = (): Plan => ({ lia: null, bento: null, rosa: null });
const confirmations = () => ({ lia: false, bento: false, rosa: false });
export function shuffled(seed: number) {
  let n = seed >>> 0;
  const random = () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, 1 | n); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const deck = catalog.eventCopies.map(e => e.id);
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}
export function setupGame(gameId: string, seed: number, deck = shuffled(seed)): Game {
  if (!gameId || !Number.isInteger(seed) || seed < 0 || seed > 4294967295 || deck.length !== 10 || new Set(deck).size !== 10 || deck.some(id => !catalog.eventCopies.some(e => e.id === id))) throw new Error('Identificação, seed ou sequência inválida.');
  return { schemaVersion: 1, rulesVersion: '0.1', appVersion: '0.1.0', gameId, seed, shuffleVersion: 'mulberry32-fy-v1', deck: [...deck], revision: 0, phase: 'setup', cursor: 0, round: 0, cash: Object.fromEntries(catalog.roles.map(r => [r.id, r.initialCash])) as Cash, resilience: p.initialResilience, startResilience: p.initialResilience, installations: { lia: [], bento: [] }, cooperativeRound: null, choices: emptyPlan(), confirmed: confirmations(), history: [], commandIds: [] };
}
function prepare(s: Game) {
  s.round++; s.startResilience = s.resilience;
  s.cash.lia -= p.plantingCostPerFarmer; s.cash.bento -= p.plantingCostPerFarmer; s.cash.rosa += p.governmentGrantPerRound;
  s.choices = emptyPlan(); s.confirmed = confirmations(); s.phase = 'planning';
}
export function choiceError(s: Game, role: Role, choice: Choice): string | null {
  const a = action(choice.action);
  if (!a || (a.role !== 'any' && a.role !== (role === 'rosa' ? 'government' : 'farmer'))) return 'Esta ação não pertence a este papel.';
  if (s.cash[role] < a.cost) return `Faltam ${a.cost - s.cash[role]} moedas.`;
  if (choice.action === 'G3' && !['lia', 'bento'].includes(choice.target ?? '')) return 'Escolha Lia ou Bento como destinatário.';
  if (choice.action !== 'G3' && choice.target) return 'Esta ação não recebe destinatário.';
  if ((choice.action === 'A4' || choice.action === 'G4') && s.cooperativeRound !== null) return 'Cooperativa já construída.';
  if (role !== 'rosa' && ((choice.action === 'A1' && s.installations[role].includes('soil_cover')) || (choice.action === 'A2' && s.installations[role].includes('diversification')))) return 'Esta instalação já existe.';
  return null;
}
export function planError(s: Game): string | null {
  for (const role of roles) { const c = s.choices[role]; if (!c || !s.confirmed[role]) return 'Os três papéis precisam confirmar suas escolhas.'; const error = choiceError(s, role, c); if (error) return `${role}: ${error}`; }
  const coop = roles.filter(r => ['A4', 'G4'].includes(s.choices[r]!.action)).length;
  return coop > 0 && coop < 3 ? 'Cooperativa incompleta: Lia, Bento e Rosa precisam contribuir na mesma safra.' : null;
}
function settle(s: Game) {
  const e = event(s.deck[s.cursor]);
  const previous = s.history.at(-1)?.cash ?? { lia: 12, bento: 12, rosa: 6 };
  const accounts = {} as Record<Role, Accounts>;
  let installations = 0;
  for (const r of roles) {
    const c = s.choices[r]!;
    const cost = action(c.action).cost;
    accounts[r] = { before: previous[r], preparation: r === 'rosa' ? p.governmentGrantPerRound : -p.plantingCostPerFarmer, cost, transfer: 0, gross: 0, grossLoss: 0, community: 0, individual: 0, insurance: 0, loss: 0, revenue: 0, after: 0 };
    s.cash[r] -= cost;
    if (r !== 'rosa' && (c.action === 'A1' || c.action === 'A2')) { s.installations[r].push(c.action === 'A1' ? 'soil_cover' : 'diversification'); installations += catalog.actions.find(a => a.id === c.action)!.resilienceGainOnInstall!; }
  }
  const gov = s.choices.rosa!;
  if (gov.action === 'G3') { const transfer = catalog.actions.find(a => a.id === 'G3')!.transferAmount!; s.cash[gov.target!] += transfer; accounts[gov.target!].transfer = transfer; }
  const cooperative = gov.action === 'G4' ? p.cooperativeResilienceGainAtConstruction : 0;
  if (cooperative) s.cooperativeRound = s.round;
  const assistance = gov.action === 'G1' ? catalog.actions.find(a => a.id === 'G1')!.resilienceGain! : 0;
  for (const r of ['lia', 'bento'] as const) {
    const a = accounts[r];
    a.gross = p.baseHarvestPerFarmer + (s.choices[r]!.action === 'A3' ? catalog.actions.find(x => x.id === 'A3')!.grossHarvestBonus! : 0) + (s.cooperativeRound !== null && s.cooperativeRound < s.round ? p.cooperativeHarvestBonusPerFarmer : 0) + e.harvestBonusPerFarmer;
    a.grossLoss = e.grossLossPerFarmer;
    const climate = p.communityProtectionAppliesTo.includes(e.id);
    a.community = climate ? Math.floor(s.startResilience / p.communityProtectionDivisor) : 0;
    a.individual = e.id === 'drought' && s.installations[r].includes('soil_cover') ? catalog.actions[0].lossProtection!.drought! : e.id === 'pests' && s.installations[r].includes('diversification') ? catalog.actions[1].lossProtection!.pests! : 0;
    a.insurance = climate && gov.action === 'G2' ? catalog.actions.find(x => x.id === 'G2')!.lossProtectionPerFarmer!.drought : 0;
    a.loss = Math.max(0, a.grossLoss - a.community - a.individual - a.insurance);
    a.revenue = Math.max(0, a.gross - a.loss); s.cash[r] += a.revenue;
  }
  for (const r of roles) accounts[r].after = s.cash[r];
  const wear = installations || assistance ? 0 : p.noPreventionWear;
  s.resilience = Math.min(p.maximumResilience, Math.max(p.minimumResilience, s.startResilience + installations + assistance + cooperative + e.resilienceDelta - wear));
  const outcome: string[] = [];
  if (s.resilience === p.earlyDefeatIfResilienceEquals) outcome.push('Resiliência chegou a zero.');
  for (const r of ['lia', 'bento'] as const) if (s.cash[r] < p.earlyDefeatIfAnyFarmerCashBelow) outcome.push(`${r === 'lia' ? 'Lia' : 'Bento'} ficou sem as 3 moedas necessárias ao próximo plantio.`);
  if (s.round === catalog.scope.rounds) { if (s.resilience > 0 && s.resilience < p.finalMinimumResilience) outcome.push('Resiliência final abaixo de 3.'); if (s.cooperativeRound === null) outcome.push('A cooperativa não foi construída.'); }
  s.history.push({ round: s.round, eventId: s.deck[s.cursor], choices: structuredClone(s.choices), accounts, resilience: { before: s.startResilience, installations, assistance, cooperative, event: e.resilienceDelta, wear, after: s.resilience }, cash: { ...s.cash }, outcome, victory: s.round === catalog.scope.rounds && outcome.length === 0 });
  s.cursor++; s.phase = 'event';
}
export function dispatch(state: Game, command: Command): Result {
  const fail = (code: string, message: string): Result => ({ ok: false, code, message });
  if (state.commandIds.includes(command.id)) return fail('DUPLICATE', 'Este comando já foi aplicado.');
  if (command.expectedRevision !== state.revision) return fail('STALE', 'A partida mudou. Reabra a escolha atual.');
  const s = structuredClone(state);
  const op = command.type;
  if (op === 'createGame') { if (s.phase !== 'setup') return fail('PHASE', 'A partida já começou.'); prepare(s); }
  else if (op === 'selectAction' || op === 'confirmRole' || op === 'unconfirmRole' || op === 'resolveRound') {
    if (s.phase !== 'planning') return fail('PHASE', 'As escolhas só podem mudar durante o planejamento.');
    if (op === 'selectAction') { const error = choiceError(s, command.role, command.choice); if (error) return fail('CHOICE', error); s.choices[command.role] = { ...command.choice }; s.confirmed[command.role] = false; }
    else if (op === 'confirmRole') { const c = s.choices[command.role]; if (!c) return fail('CHOICE', 'Escolha uma ação primeiro.'); const error = choiceError(s, command.role, c); if (error) return fail('CHOICE', error); s.confirmed[command.role] = true; }
    else if (op === 'unconfirmRole') s.confirmed[command.role] = false;
    else { const error = planError(s); if (error) return fail('PLAN', error); settle(s); }
  } else if (op === 'showSummary') { if (s.phase !== 'event') return fail('PHASE', 'Não há evento para apresentar.'); Object.assign(s, { phase: 'summary' }); }
  else {
    if (s.phase !== 'summary') return fail('PHASE', 'Leia o balanço antes de avançar.');
    const ended = s.round === catalog.scope.rounds || s.history.at(-1)!.outcome.length > 0;
    if (op === 'finishGame' && ended) Object.assign(s, { phase: 'finished' });
    else if (op === 'startNextRound' && !ended) prepare(s);
    else return fail('PHASE', ended ? 'A partida terminou.' : 'Ainda há safras para jogar.');
  }
  s.revision++; s.commandIds.push(command.id);
  return { ok: true, state: s };
}
export function publicState(s: Game) {
  const { seed: _seed, deck: _deck, shuffleVersion: _shuffle, commandIds: _ids, ...visible } = s;
  void _seed; void _deck; void _shuffle; void _ids;
  return { ...structuredClone(visible), remaining: catalog.eventTypes.map(e => ({ type: e.id, name: e.name, count: e.copies - s.history.filter(h => event(h.eventId).id === e.id).length })) };
}
export function roleOrder(s: Pick<Game, 'round'>): Role[] { const start = (s.round - 1) % 3; return [...roles.slice(start), ...roles.slice(0, start)]; }
export function selectedBalance(s: Game, r: Role) { return s.cash[r] - (s.choices[r] ? action(s.choices[r]!.action).cost : 0); }
export function revenueRange(s: Game, r: 'lia' | 'bento'): [number, number] | null {
  if (planError(s)) return null;
  const values = catalog.eventCopies.filter(e => !s.history.some(h => h.eventId === e.id)).map(e => { const copy = structuredClone(s); copy.deck[copy.cursor] = e.id; settle(copy); return copy.history.at(-1)!.accounts[r].revenue; });
  return [Math.min(...values), Math.max(...values)];
}

