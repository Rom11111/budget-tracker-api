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
import { AuthStore } from '../../services/auth-store';

import * as THREE from 'three';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthStore);

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
    this.vantaEffect = TOPOLOGY({
      el: this.background.nativeElement,
      THREE,
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
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
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

    if (this.password.length < 4) {
      this.error.set('Le mot de passe doit faire au moins 4 caractères.');
      return;
    }

    if (this.mode() === 'register' && this.password !== this.confirm) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.auth.login(this.email);
  }
}
