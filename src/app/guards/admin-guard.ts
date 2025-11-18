import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { map, filter, take, switchMap } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  return authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    switchMap(async (user) => {
      if (!user) {
        await toastService.show('Debes iniciar sesión para acceder al panel de administración');
        router.navigate(['/login']);
        return false;
      }
      
      if (!user.emailVerified) {
        await toastService.show('Por favor, verifica tu correo electrónico antes de continuar');
        router.navigate(['/verificar']);
        return false;
      }
      
      try {
        const rol = await authService.getUserRole(user.uid);
        
        if (rol === 'admin') {
          return true;
        } else {
          await toastService.show('No tienes permisos de administrador');
          router.navigate(['/home']);
          return false;
        }
      } catch (error) {
        await toastService.show('Error al verificar permisos');
        router.navigate(['/home']);
        return false;
      }
    }),
    map(result => result)
  );
};