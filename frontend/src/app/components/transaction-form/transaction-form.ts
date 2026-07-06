import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { CATEGORIES } from '../../models/category.model';

export type FormMode = 'expense' | 'income';

@Component({
  selector: 'app-transaction-form',
  imports: [FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})
export class TransactionForm {
  // Dépense ou revenu : détermine le signe appliqué au montant
  readonly mode = input<FormMode>('expense');
  // Transaction en cours d'édition, ou null pour une création
  readonly transaction = input<Transaction | null>(null);

  readonly save = output<Transaction>();
  readonly cancelled = output<void>();

  protected readonly categories = CATEGORIES;
  protected form: Transaction = this.emptyForm();

  constructor() {
    // Recopie la transaction éditée dans le formulaire quand l'input change
    effect(() => {
      const editing = this.transaction();
      this.form = editing
        ? { ...editing, amount: Math.abs(Number(editing.amount)) }
        : this.emptyForm();
    });
  }

  private emptyForm(): Transaction {
    return { label: '', amount: 0, date: new Date().toISOString().slice(0, 10), category: 'autre' };
  }

  protected get isEditing(): boolean {
    return this.transaction() !== null;
  }

  selectCategory(id: string): void {
    this.form.category = id;
  }

  submit(): void {
    if (!this.form.label.trim() || !this.form.date) {
      return;
    }
    const signedAmount = this.mode() === 'expense'
      ? -Math.abs(Number(this.form.amount))
      : Math.abs(Number(this.form.amount));

    this.save.emit({ ...this.form, amount: signedAmount });
  }
}
