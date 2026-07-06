import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'budget-tracker.token';
const EMAIL_KEY = 'budget-tracker.session-email';

/**
 * Session utilisateur : le token JWT renvoyé par le backend et l'email.
 * Le token est joint à chaque requête par l'interceptor HTTP.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly userEmail = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  login(token: string, email: string): void {
    this.token.set(token);
    this.userEmail.set(email);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, email);
  }

  logout(): void {
    this.token.set(null);
    this.userEmail.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  }
}
