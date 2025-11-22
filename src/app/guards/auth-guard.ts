import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { map, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  // Obtener la ruta actual
  const path = route.routeConfig?.path || '';
  
  return authService.currentUser$.pipe(
    filter(user => user !== undefined),
    take(1),
    map((user) => {
      if (user && user.emailVerified) {
        return true;
      } else if (user && !user.emailVerified) {
        toastService.show('⚠️ Por favor, verifica tu correo electrónico antes de continuar');
        router.navigate(['/verificar']);
        return false;
      } else {
        // ✅ Mostrar mensaje específico según la ruta
        if (path === 'carrito') {
          toastService.show('🛒 Necesitas iniciar sesión para acceder al carrito');
        } else if (path.startsWith('productos')) {
          toastService.show('📦 Necesitas iniciar sesión para ver los productos');
        } else if (path === 'perfil') {
          toastService.show('👤 Necesitas iniciar sesión para ver tu perfil');
        } else {
          toastService.show('🔐 Necesitas iniciar sesión para acceder a esta sección');
        }
        
        router.navigate(['/login']);
        return false;
      }
    })
  );
};