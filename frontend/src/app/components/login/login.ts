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

    this.keepAnimationAlive();
  }

  // Par défaut, TOPOLOGY ne s'efface jamais : les particules finissent par
  // repasser sur leurs propres traits et l'image semble figée. On enveloppe
  // le draw() de p5 pour poser à chaque image un voile semi-transparent
  // couleur du fond : les anciens traits s'estompent, le mouvement reste visible.
  // Attention : vantaEffect.p5 vaut `true` (drapeau interne) tant que p5 n'a
  // pas fini son setup asynchrone — on attend la vraie instance avant d'agir.
  private keepAnimationAlive(attempt = 0): void {
    const p = this.vantaEffect?.p5;
    if (typeof p !== 'object' || typeof p.draw !== 'function') {
      if (attempt < 50) {
        setTimeout(() => this.keepAnimationAlive(attempt + 1), 100);
      }
      return;
    }
    const originalDraw = p.draw;
    p.draw = () => {
      p.push();
      p.noStroke();
      p.fill(5, 8, 5, 10); // #050805 avec un alpha très léger (10/255)
      p.rect(0, 0, p.width, p.height);
      p.pop();
      originalDraw();
    };
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
