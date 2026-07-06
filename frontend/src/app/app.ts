import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Transaction } from './models/transaction.model';
import { TransactionService } from './services/transaction.service';

type FormMode = 'expense' | 'income';
type Tab = 'home' | 'stats' | 'profile';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly editingId = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly formVisible = signal(false);
  protected readonly formMode = signal<FormMode>('expense');
  protected readonly activeTab = signal<Tab>('home');

  protected readonly balance = computed(() =>
    this.transactions().reduce((sum, t) => sum + Number(t.amount), 0)
  );

  protected readonly spent = computed(() =>
    this.transactions()
      .filter(t => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
  );

  protected readonly income = computed(() =>
    this.transactions()
      .filter(t => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  // Points du sparkline : évolution du solde cumulé, normalisée dans un viewBox 100x36
  protected readonly sparklinePoints = computed(() => {
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

  protected readonly greeting = new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';

  protected readonly topExpenses = computed(() =>
    [...this.transactions()]
      .filter(t => Number(t.amount) < 0)
      .sort((a, b) => Number(a.amount) - Number(b.amount))
      .slice(0, 3)
  );

  protected readonly transactionCount = computed(() => this.transactions().length);

  protected form: Transaction = this.emptyForm();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.refresh();
  }

  private emptyForm(): Transaction {
    return { label: '', amount: 0, date: new Date().toISOString().slice(0, 10) };
  }

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

  selectTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  openForm(mode: FormMode): void {
    this.formMode.set(mode);
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formVisible.set(true);
  }

  submit(): void {
    if (!this.form.label.trim() || !this.form.date) {
      return;
    }

    const signedAmount = this.formMode() === 'expense'
      ? -Math.abs(Number(this.form.amount))
      : Math.abs(Number(this.form.amount));
    const payload: Transaction = { ...this.form, amount: signedAmount };

    const id = this.editingId();
    const request = id
      ? this.transactionService.update(id, payload)
      : this.transactionService.create(payload);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.refresh();
      },
      error: () => this.error.set("L'enregistrement a échoué.")
    });
  }

  edit(transaction: Transaction): void {
    this.editingId.set(transaction.id ?? null);
    this.formMode.set(Number(transaction.amount) < 0 ? 'expense' : 'income');
    this.form = { ...transaction, amount: Math.abs(Number(transaction.amount)) };
    this.formVisible.set(true);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formVisible.set(false);
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

  relativeDate(date: string): string {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (date === today) return "Aujourd'hui";
    if (date === yesterday) return 'Hier';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  }

  iconFor(transaction: Transaction): string {
    const label = transaction.label.toLowerCase();
    if (label.includes('course') || label.includes('super')) return '🛒';
    if (label.includes('salaire') || label.includes('paie')) return '💰';
    if (label.includes('netflix') || label.includes('abonnement') || label.includes('spotify')) return '📺';
    if (label.includes('resto') || label.includes('restaurant') || label.includes('repas')) return '🍔';
    if (label.includes('transport') || label.includes('essence') || label.includes('train')) return '🚗';
    if (label.includes('loyer') || label.includes('maison')) return '🏠';
    return Number(transaction.amount) < 0 ? '💸' : '💵';
  }
}
