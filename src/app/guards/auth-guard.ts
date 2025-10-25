import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from, map, of, switchMap, take } from 'rxjs';
import { reload } from '@angular/fire/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        // 🔄 Recargar datos del usuario para asegurar que emailVerified esté actualizado
        return from(reload(user)).pipe(
          map(() => {
            if (user.emailVerified) {
              // ✅ Usuario logueado y correo verificado
              return true;
            } else {
              // ⚠️ Usuario logueado pero no verificado
              alert('Por favor, verifica tu correo electrónico antes de continuar.');
              router.navigate(['/verificar']); // Puedes crear una página "verificar"
              return false;
            }
          })
        );
      } else {
        // ❌ Sin sesión, redirigir al login
        router.navigate(['/login']);
        return of(false);
      }
    })
  );
};
