import { Component, input, output } from '@angular/core';

export type Tab = 'home' | 'stats' | 'profile';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css'
})
export class BottomNav {
  readonly active = input.required<Tab>();
  readonly tabChange = output<Tab>();
}
