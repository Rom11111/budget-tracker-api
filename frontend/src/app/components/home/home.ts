import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionStore } from '../../services/transaction-store';
import { TransactionForm, FormMode } from '../transaction-form/transaction-form';
import { iconFor, relativeDate } from '../../shared/transaction-display';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, TransactionForm],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly store = inject(TransactionStore);

  protected readonly formVisible = signal(false);
  protected readonly formMode = signal<FormMode>('expense');
  protected readonly editing = signal<Transaction | null>(null);

  protected readonly greeting = new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';

  // Helpers d'affichage utilisés dans le template
  protected readonly iconFor = iconFor;
  protected readonly relativeDate = relativeDate;

  openForm(mode: FormMode): void {
    this.formMode.set(mode);
    this.editing.set(null);
    this.formVisible.set(true);
  }

  edit(transaction: Transaction): void {
    this.formMode.set(Number(transaction.amount) < 0 ? 'expense' : 'income');
    this.editing.set(transaction);
    this.formVisible.set(true);
  }

  onSave(transaction: Transaction): void {
    this.store.save(transaction, this.editing()?.id ?? null);
    this.closeForm();
  }

  closeForm(): void {
    this.editing.set(null);
    this.formVisible.set(false);
  }
}
