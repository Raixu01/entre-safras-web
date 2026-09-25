import { z } from 'zod';
import { actionSchema, roleSchema } from '../domain/catalog';
import { dispatch, setupGame, type Game, type Operation, type Settlement } from '../domain/engine';
const int = z.number().int().nonnegative();
const choice = z.object({ action: actionSchema, target: z.enum(['lia', 'bento']).optional() }).strict();
const plan = z.object({ lia: choice.nullable(), bento: choice.nullable(), rosa: choice.nullable() }).strict();
const cash = z.object({ lia: int, bento: int, rosa: int }).strict();
const snapshot = z.object({ schemaVersion: z.literal(1), rulesVersion: z.literal('0.1'), appVersion: z.literal('0.1.0'), gameId: z.string().min(1).max(100), revision: int, seed: int.max(4294967295), shuffleVersion: z.literal('mulberry32-fy-v1'), deck: z.array(z.string()).length(10), cursor: int.max(5), round: int.max(5), phase: z.enum(['setup', 'planning', 'event', 'summary', 'finished']), cash, resilience: int.max(6), startResilience: int.max(6), installations: z.object({ lia: z.array(z.enum(['soil_cover', 'diversification'])).max(2), bento: z.array(z.enum(['soil_cover', 'diversification'])).max(2) }).strict(), cooperativeRound: int.min(1).max(5).nullable(), choices: plan, confirmed: z.object({ lia: z.boolean(), bento: z.boolean(), rosa: z.boolean() }).strict(), history: z.array(z.unknown()).max(5), commandIds: z.array(z.string().min(1).max(100)).max(10000) }).strict();
export function canonical(v: unknown): string { if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`; if (v && typeof v === 'object') return `{${Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => `${JSON.stringify(k)}:${canonical(x)}`).join(',')}}`; return JSON.stringify(v); }
export function parseSnapshot(text: string): Game {
  if (new TextEncoder().encode(text).length > 1048576) throw new Error('Arquivo excede o limite de 1 MB.');
  let s: z.infer<typeof snapshot>;
  try { s = snapshot.parse(JSON.parse(text)); } catch { throw new Error('Backup inválido ou versão incompatível. Use um backup do Entre Safras 0.1.0 / regras 0.1 / schema 1.'); }
  let replay = setupGame(s.gameId, s.seed, s.deck);
  let id = 0;
  const apply = (op: Operation) => { const result = dispatch(replay, { ...op, id: `replay-${id++}`, expectedRevision: replay.revision }); if (!result.ok) throw new Error(`Histórico incompatível: ${result.message}`); replay = result.state; };
  if (s.phase !== 'setup') apply({ type: 'createGame' });
  for (let i = 0; i < s.history.length; i++) {
    const h = s.history[i] as Settlement;
    const choices = plan.parse(h.choices);
    for (const r of roleSchema.options) { if (!choices[r]) throw new Error('Histórico sem escolha.'); apply({ type: 'selectAction', role: r, choice: choices[r]! }); apply({ type: 'confirmRole', role: r }); }
    apply({ type: 'resolveRound' });
    if (canonical(replay.history.at(-1)) !== canonical(h)) throw new Error('Contas do histórico incompatíveis com as regras.');
    const last = i === s.history.length - 1;
    if (!last || s.phase !== 'event') apply({ type: 'showSummary' });
    if (!last || s.phase === 'planning') apply({ type: 'startNextRound' });
    else if (s.phase === 'finished') apply({ type: 'finishGame' });
  }
  if (s.phase === 'planning') for (const r of roleSchema.options) {
    if (s.choices[r]) apply({ type: 'selectAction', role: r, choice: s.choices[r]! });
    if (s.confirmed[r]) apply({ type: 'confirmRole', role: r });
  }
  if (s.revision !== s.commandIds.length || new Set(s.commandIds).size !== s.commandIds.length || s.revision < replay.revision) throw new Error('Revisão de comandos incoerente.');
  const compare = (value: object) => { const copy = { ...value } as Record<string, unknown>; delete copy.revision; delete copy.commandIds; return canonical(copy); };
  if (compare(s) !== compare(replay)) throw new Error('Estado, fase ou cursor não corresponde ao histórico.');
  return s as Game;
}
export const keys = { normal: 'entre-safras:game:v1', tutorial: 'entre-safras:tutorial:v1' };
export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export function save(storage: StorageAdapter, key: string, state: Game): { ok: boolean; message: string } {
  try {
    const serialized = JSON.stringify(state); parseSnapshot(serialized);
    const previous = storage.getItem(key);
    if (previous) { try { parseSnapshot(previous); storage.setItem(`${key}:previous`, previous); } catch { /* Keep the last valid backup if the current data is corrupt. */ } }
    storage.setItem(key, serialized);
    if (storage.getItem(key) !== serialized) throw new Error('A gravação não foi confirmada.');
    return { ok: true, message: 'Partida salva neste navegador.' };
  } catch { return { ok: false, message: 'Sem salvamento: não foi possível gravar. Continue nesta sessão e exporte um backup antes de sair.' }; }
}
export function load(storage: StorageAdapter, key: string): { state: Game | null; message: string; recovered: boolean } {
  try {
    const current = storage.getItem(key);
    if (current) { try { return { state: parseSnapshot(current), message: 'Partida recuperada.', recovered: false }; } catch { /* Attempt the previous valid snapshot. */ } }
    const previous = storage.getItem(`${key}:previous`);
    if (previous) { try { return { state: parseSnapshot(previous), message: 'A cópia anterior válida foi recuperada; a última alteração pode ter sido perdida.', recovered: true }; } catch { /* Report corruption without replacing the data. */ } }
    return { state: null, message: current || previous ? 'Salvamento incompatível ou corrompido. Importe um backup válido ou inicie outra partida.' : '', recovered: false };
  } catch { return { state: null, message: 'Armazenamento indisponível. Você pode jogar e exportar um backup.', recovered: false }; }
}
export function clear(storage: StorageAdapter) { for (const key of Object.values(keys)) { storage.removeItem(key); storage.removeItem(`${key}:previous`); } }
