import { z } from 'zod';
import raw from '../data/catalog.json' with { type: 'json' };
export const roleSchema = z.enum(['lia', 'bento', 'rosa']);
export const actionSchema = z.enum(['reserve', 'A1', 'A2', 'A3', 'A4', 'G1', 'G2', 'G3', 'G4']);
export const eventSchema = z.enum(['drought', 'flood', 'pests', 'favorable', 'fair', 'regular']);
const stable = (v: unknown): string => Array.isArray(v) ? JSON.stringify(v.map(stable)) : v !== null && typeof v === 'object' ? JSON.stringify(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, value]) => [k, stable(value)])) : JSON.stringify(v);
const integer = z.number().int().nonnegative();
const catalogSchema = z.object({
  schemaVersion: z.literal(1), rulesVersion: z.literal('0.1'),
  roles: z.array(z.object({ id: roleSchema, initialCash: integer }).passthrough()).length(3),
  parameters: z.object({ initialResilience: integer, minimumResilience: z.literal(0), maximumResilience: integer, plantingCostPerFarmer: integer, baseHarvestPerFarmer: integer, governmentGrantPerRound: integer }).passthrough(),
  actions: z.array(z.object({ id: actionSchema, name: z.string(), cost: integer, role: z.enum(['farmer', 'government']), duration: z.string(), description: z.string() }).passthrough()).length(8),
  eventTypes: z.array(z.object({ id: eventSchema, copies: integer.positive(), grossLossPerFarmer: integer, harvestBonusPerFarmer: integer, resilienceDelta: z.number().int() }).passthrough()).length(6),
  eventCopies: z.array(z.object({ id: z.string(), type: eventSchema })).length(10),
}).passthrough().superRefine((c, ctx) => {
  if (new Set(c.eventCopies.map(e => e.id)).size !== 10 || c.eventTypes.some(e => c.eventCopies.filter(x => x.type === e.id).length !== e.copies)) ctx.addIssue({ code: 'custom', message: 'Composição inválida do baralho.' });
  if (new Set(c.roles.map(r => r.id)).size !== 3 || new Set(c.actions.map(a => a.id)).size !== 8) ctx.addIssue({ code: 'custom', message: 'IDs repetidos.' });
  // v0.1 is immutable: every numeric/semantic parameter is verified against the source.
  if (stable(c) !== stable(raw)) ctx.addIssue({ code: 'custom', message: 'Catálogo alterado: requer nova versão de regras.' });
});
export function validateCatalog(value: unknown) { return catalogSchema.parse(value); }
validateCatalog(raw);
export const catalog = raw;
export const roles = ['lia', 'bento', 'rosa'] as const;
export type Role = z.infer<typeof roleSchema>;
export type ActionId = z.infer<typeof actionSchema>;
export type EventType = z.infer<typeof eventSchema>;
export const p = catalog.parameters;
export const action = (id: ActionId) => id === 'reserve' ? { id, name: 'Reservar', cost: 0, description: 'Não gasta moedas e não evita desgaste.', duration: 'current_round', role: 'any' } : catalog.actions.find(a => a.id === id)!;
export const event = (id: string) => catalog.eventTypes.find(e => e.id === catalog.eventCopies.find(c => c.id === id)?.type)!;


