import { Component, OnInit, inject, signal } from '@angular/core';
import { TransactionStore } from './services/transaction-store';
import { Home } from './components/home/home';
import { Stats } from './components/stats/stats';
import { Profile } from './components/profile/profile';
import { BottomNav, Tab } from './components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  imports: [Home, Stats, Profile, BottomNav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly store = inject(TransactionStore);

  protected readonly activeTab = signal<Tab>('home');

  ngOnInit(): void {
    this.store.refresh();
  }
}
