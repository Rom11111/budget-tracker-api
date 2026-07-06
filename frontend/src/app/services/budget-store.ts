import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'budget-tracker.monthly-limit';
const DEFAULT_LIMIT = 2000;

/**
 * Objectif de dépenses mensuel. Stocké en localStorage pour l'instant ;
 * passera côté backend quand il y aura des comptes utilisateurs.
 */
@Injectable({ providedIn: 'root' })
export class BudgetStore {
  readonly limit = signal<number>(this.load());

  private load(): number {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw === null ? NaN : Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
  }

  setLimit(value: number): void {
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    this.limit.set(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }
}
