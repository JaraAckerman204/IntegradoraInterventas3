import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.currentUser$.pipe(
    // 👇 Espera hasta que Firebase haya emitido un valor real (no undefined)
    filter(user => user !== undefined),
    take(1),
    map((user) => {
      if (user && user.emailVerified) {
        return true; // ✅ Acceso permitido
      } else if (user && !user.emailVerified) {
        alert('Por favor, verifica tu correo electrónico antes de continuar.');
        router.navigate(['/verificar']);
        return false;
      } else {
        // ❌ Sin sesión activa
        router.navigate(['/login']);
        return false;
      }
    })
  );
};