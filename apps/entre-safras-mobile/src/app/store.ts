import { dispatch, type Game, type Operation } from '../domain/engine';
import { load, save, type StorageAdapter } from '../persistence/snapshot';
export class Store {
  state: Game | null = null;
  message = '';
  saved = false;
  stale = false;
  private listeners = new Set<() => void>();
  constructor(public storage: StorageAdapter, public key: string) { this.reload(); }
  subscribe(listener: () => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  emit() { this.listeners.forEach(fn => fn()); }
  reload() { const result = load(this.storage, this.key); this.state = result.state; this.message = result.message; this.saved = !!result.state && !result.recovered; this.stale = false; this.emit(); }
  persist() { if (!this.state || this.stale) return false; const result = save(this.storage, this.key, this.state); this.saved = result.ok; this.message = result.message; return result.ok; }
  replace(state: Game) { if (this.stale) return false; this.state = structuredClone(state); this.persist(); this.emit(); return true; }
  dispatch(op: Operation, revision = this.state?.revision, id = crypto.randomUUID()): boolean {
    if (this.stale) { this.message = 'Outra aba atualizou esta partida. Recarregue a versão salva.'; this.emit(); return false; }
    if (!this.state || revision === undefined) return false;
    const result = dispatch(this.state, { ...op, expectedRevision: revision, id });
    if (!result.ok) { this.message = result.message; this.emit(); return false; }
    this.state = result.state; this.persist(); this.emit(); return true;
  }
  externalChange() { this.stale = true; this.saved = false; this.message = 'Outra aba alterou os dados. Esta sessão foi bloqueada para evitar sobrescrita.'; this.emit(); }
}
