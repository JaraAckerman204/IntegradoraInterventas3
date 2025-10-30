import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, map, of, switchMap, filter, take } from 'rxjs';
import { reload } from '@angular/fire/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    // 👇 Espera hasta que Firebase haya emitido un valor real (no undefined)
    filter(user => user !== undefined),
    take(1),
    switchMap((user) => {
      if (user) {
        // 🔄 Recargar datos del usuario
        return from(reload(user)).pipe(
          map(() => {
            if (user.emailVerified) {
              return true; // ✅ Acceso permitido
            } else {
              alert('Por favor, verifica tu correo electrónico antes de continuar.');
              router.navigate(['/verificar']);
              return false;
            }
          })
        );
      } else {
        // ❌ Sin sesión activa
        router.navigate(['/login']);
        return of(false);
      }
    })
  );
};
