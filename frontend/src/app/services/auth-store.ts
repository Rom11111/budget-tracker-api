import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'budget-tracker.session-email';

/**
 * Session utilisateur — VERSION DÉMO, visuelle uniquement.
 * Aucune vérification côté serveur : la vraie authentification
 * (Spring Security + JWT) arrivera avec la phase 2 du backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly userEmail = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  login(email: string): void {
    this.userEmail.set(email);
    localStorage.setItem(STORAGE_KEY, email);
  }

  logout(): void {
    this.userEmail.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
