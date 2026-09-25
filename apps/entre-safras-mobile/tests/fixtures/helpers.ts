import { catalog, roles, type ActionId } from '../../src/domain/catalog';
import { dispatch, setupGame, type Game, type Operation } from '../../src/domain/engine';
export function apply(s: Game, op: Operation): Game { const result = dispatch(s, { ...op, id: `test-${s.revision}`, expectedRevision: s.revision }); if (!result.ok) throw new Error(`${result.code}: ${result.message}`); return result.state; }
export function initial(first: string[] = ['drought-1']) { return apply(setupGame('test-game', 42, [...first, ...catalog.eventCopies.map(e => e.id).filter(e => !first.includes(e))]), { type: 'createGame' }); }
export function plan(s: Game, actions: ActionId[], target?: 'lia' | 'bento') { for (const [i, role] of roles.entries()) { s = apply(s, { type: 'selectAction', role, choice: { action: actions[i], ...(actions[i] === 'G3' && target ? { target } : {}) } }); s = apply(s, { type: 'confirmRole', role }); } return s; }
export function resolve(s: Game, actions: ActionId[], target?: 'lia' | 'bento') { return apply(plan(s, actions, target), { type: 'resolveRound' }); }
export function next(s: Game) { return apply(apply(s, { type: 'showSummary' }), { type: 'startNextRound' }); }
