import { Component, inject } from '@angular/core';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  protected readonly auth = inject(AuthStore);

  // Initiale affichée dans l'avatar, à partir de l'email
  protected get initial(): string {
    return (this.auth.userEmail() ?? '?').charAt(0).toUpperCase();
  }
}
