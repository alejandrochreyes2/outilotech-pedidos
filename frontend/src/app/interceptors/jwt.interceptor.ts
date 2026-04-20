import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);
  const token       = authService.getToken();

  // Solo agregar JWT a peticiones del backend propio, no a Supabase ni otros servicios externos
  const isOwnApi = req.url.startsWith(environment.apiUrl);
  if (token && isOwnApi) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo hacer logout si la petición era al backend propio (no a Supabase)
      if (error.status === 401 && req.url.startsWith(environment.apiUrl)) {
        authService.logout();
      } else if (error.status === 403 && req.url.startsWith(environment.apiUrl)) {
        router.navigate(['/dashboard']);
      }
      return throwError(() => error);
    })
  );
};
