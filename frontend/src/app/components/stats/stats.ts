import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TransactionStore } from '../../services/transaction-store';
import { BudgetStore } from '../../services/budget-store';
import { aggregateSpendingByCategory } from '../../shared/transaction-display';

// Longueur de l'arc du demi-cercle (rayon 80) : π × r
const ARC_LENGTH = Math.PI * 80;

@Component({
  selector: 'app-stats',
  imports: [CurrencyPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats {
  protected readonly store = inject(TransactionStore);
  protected readonly budget = inject(BudgetStore);

  // Mois affiché, au format "2026-07"
  protected readonly selectedMonth = signal(new Date().toISOString().slice(0, 7));

  protected readonly editingLimit = signal(false);

  protected readonly monthLabel = computed(() => {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
      .format(new Date(year, month - 1, 1));
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  protected readonly monthTransactions = computed(() =>
    this.store.transactions().filter(t => t.date.startsWith(this.selectedMonth()))
  );

  protected readonly monthSpent = computed(() =>
    this.monthTransactions()
      .filter(t => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  );

  protected readonly remaining = computed(() => this.budget.limit() - this.monthSpent());

  protected readonly overBudget = computed(() => this.remaining() < 0);

  // Portion de l'arc à colorer : "longueur_visible longueur_totale"
  protected readonly gaugeDash = computed(() => {
    const ratio = Math.min(this.monthSpent() / this.budget.limit(), 1);
    return `${(ratio * ARC_LENGTH).toFixed(1)} ${ARC_LENGTH.toFixed(1)}`;
  });

  protected readonly spentByCategory = computed(() =>
    aggregateSpendingByCategory(this.monthTransactions())
  );

  // Largeur de la pilule d'une catégorie, proportionnelle à la plus grosse
  protected pillWidth(total: number): number {
    const max = this.spentByCategory()[0]?.total ?? 1;
    return 30 + (total / max) * 70;
  }

  changeMonth(offset: number): void {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const d = new Date(year, month - 1 + offset, 1);
    this.selectedMonth.set(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    );
  }

  saveLimit(value: string): void {
    this.budget.setLimit(Number(value));
    this.editingLimit.set(false);
  }
}
