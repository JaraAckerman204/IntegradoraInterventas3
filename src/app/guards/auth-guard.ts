import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { map, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  return authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    map((user) => {
      if (user && user.emailVerified) {
        return true;
      } else if (user && !user.emailVerified) {
        toastService.show('Por favor, verifica tu correo electrónico antes de continuar');
        router.navigate(['/verificar']);
        return false;
      } else {
        toastService.show('No puedes entrar a tu carrito sin antes iniciar sesión');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};