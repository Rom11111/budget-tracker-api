import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TransactionStore } from '../../services/transaction-store';
import { iconFor, relativeDate } from '../../shared/transaction-display';

@Component({
  selector: 'app-stats',
  imports: [CurrencyPipe],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats {
  protected readonly store = inject(TransactionStore);

  protected readonly iconFor = iconFor;
  protected readonly relativeDate = relativeDate;
}
