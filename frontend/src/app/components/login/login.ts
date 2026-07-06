import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStore } from '../../services/auth-store';
import { AuthService } from '../../services/auth.service';

import p5 from 'p5';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthStore);
  private readonly authService = inject(AuthService);

  @ViewChild('vantaBackground')
  private background!: ElementRef<HTMLDivElement>;

  private vantaEffect: any;

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly showPassword = signal(false);
  protected readonly error = signal<string | null>(null);

  protected email = '';
  protected password = '';
  protected confirm = '';

  ngAfterViewInit(): void {
    // L'effet TOPOLOGY de Vanta est basé sur p5.js (pas three.js)
    this.vantaEffect = TOPOLOGY({
      el: this.background.nativeElement,
      p5,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x34d867,
      backgroundColor: 0x050805,
    });
  }

  ngOnDestroy(): void {
    // try/catch : si l'effet a mal démarré, destroy() peut lever une
    // exception qui casserait la bascule login -> app
    try {
      this.vantaEffect?.destroy();
    } catch {
      // rien à faire : le composant disparaît de toute façon
    }
  }

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

    if (this.password.length < 8) {
      this.error.set('Le mot de passe doit faire au moins 8 caractères.');
      return;
    }

    if (this.mode() === 'register' && this.password !== this.confirm) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    // Appel réel au backend : inscription ou connexion selon le mode
    const request = this.mode() === 'register'
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    request.subscribe({
      next: (response) => this.auth.login(response.token, response.email),
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.error.set('Email ou mot de passe incorrect.');
        } else if (err.status === 409) {
          this.error.set('Un compte existe déjà avec cet email.');
        } else if (err.status === 0) {
          this.error.set('Impossible de contacter le serveur. Le backend tourne ?');
        } else {
          this.error.set(err.error?.message ?? 'Une erreur est survenue.');
        }
      }
    });
  }
}
