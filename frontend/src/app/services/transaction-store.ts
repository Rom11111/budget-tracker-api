import { Injectable, computed, inject, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { categoryById } from '../models/category.model';
import { TransactionService } from './transaction.service';

/**
 * État partagé de l'application : la liste des transactions et tout ce
 * qui s'en déduit (solde, dépenses, répartition par catégorie...).
 * Les composants lisent les signaux et appellent les méthodes ;
 * les appels HTTP restent dans TransactionService.
 */
@Injectable({ providedIn: 'root' })
export class TransactionStore {
  private readonly transactionService = inject(TransactionService);

  readonly transactions = signal<Transaction[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly balance = computed(() =>
    this.transactions().reduce((sum, t) => sum + Number(t.amount), 0)
  );

  readonly spent = computed(() =>
    this.transactions()
      .filter(t => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  );

  readonly income = computed(() =>
    this.transactions()
      .filter(t => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  readonly count = computed(() => this.transactions().length);

  // Points du sparkline : évolution du solde cumulé, normalisée dans un viewBox 100x36
  readonly sparklinePoints = computed(() => {
    const sorted = [...this.transactions()].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) {
      return '0,18 100,18';
    }
    let cumulative = 0;
    const values = sorted.map(t => (cumulative += Number(t.amount)));
    if (values.length === 1) {
      values.unshift(0);
    }
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    const range = max - min || 1;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * 100;
        const y = 34 - ((v - min) / range) * 32;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  // Dépenses agrégées par catégorie, triées de la plus grosse à la plus petite
  readonly spentByCategory = computed(() => {
    const totals = new Map<string, number>();
    for (const t of this.transactions()) {
      const amount = Number(t.amount);
      if (amount < 0) {
        const key = t.category ?? 'autre';
        totals.set(key, (totals.get(key) ?? 0) + Math.abs(amount));
      }
    }
    const totalSpent = this.spent() || 1;
    return [...totals.entries()]
      .map(([id, total]) => ({
        category: categoryById(id) ?? { id, label: id, icon: 'tag' },
        total,
        percent: Math.round((total / totalSpent) * 100)
      }))
      .sort((a, b) => b.total - a.total);
  });

  readonly topExpenses = computed(() =>
    [...this.transactions()]
      .filter(t => Number(t.amount) < 0)
      .sort((a, b) => Number(a.amount) - Number(b.amount))
      .slice(0, 3)
  );

  refresh(): void {
    this.loading.set(true);
    this.error.set(null);
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactions.set(
          [...data].sort((a, b) => b.date.localeCompare(a.date))
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de contacter l'API. Vérifie que le backend tourne sur le port 8080.");
        this.loading.set(false);
      }
    });
  }

  // Crée la transaction, ou la met à jour si editingId est fourni
  save(transaction: Transaction, editingId: number | null): void {
    const request = editingId
      ? this.transactionService.update(editingId, transaction)
      : this.transactionService.create(transaction);

    request.subscribe({
      next: () => this.refresh(),
      error: () => this.error.set("L'enregistrement a échoué.")
    });
  }

  remove(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    this.transactionService.delete(id).subscribe({
      next: () => this.refresh(),
      error: () => this.error.set('La suppression a échoué.')
    });
  }
}
