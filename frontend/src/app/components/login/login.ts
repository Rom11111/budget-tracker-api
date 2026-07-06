import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly auth = inject(AuthStore);

  // 'login' = se connecter, 'register' = créer un compte
  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly showPassword = signal(false);
  protected readonly error = signal<string | null>(null);

  protected email = '';
  protected password = '';
  protected confirm = '';

  toggleMode(): void {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set(null);
  }

  submit(): void {
    this.error.set(null);

    if (!this.email.includes('@')) {
      this.error.set('Adresse email invalide.');
      return;
    }
    if (this.password.length < 4) {
      this.error.set('Le mot de passe doit faire au moins 4 caractères.');
      return;
    }
    if (this.mode() === 'register' && this.password !== this.confirm) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    // Démo visuelle : on "connecte" sans vérification serveur
    this.auth.login(this.email);
  }
}
