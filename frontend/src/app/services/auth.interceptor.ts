import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from './auth-store';

// Joint le token JWT à chaque requête sortante : "Authorization: Bearer <token>".
// Si le serveur répond 401 (token expiré ou invalide), on déconnecte l'utilisateur.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const token = auth.token();

  // Les routes d'authentification sont publiques : pas de token à joindre
  const isAuthRoute = req.url.includes('/api/auth/');

  const request = token && !isAuthRoute
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRoute) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
