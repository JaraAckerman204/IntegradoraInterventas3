import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser();

  // Si no hay usuario → home
  if (!user) {
    router.navigate(['/home']);
    return false;
  }

  // Si hay usuario, verificamos su rol
  const rol = await auth.getUserRole(user.uid);
  if (rol === 'admin') {
    return true; // ✅ Acceso permitido
  }

  // Si no es admin → home
  router.navigate(['/home']);
  return false;
};
