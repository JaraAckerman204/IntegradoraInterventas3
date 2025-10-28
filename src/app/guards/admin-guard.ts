import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const rol = await auth.getUserRole(user.uid);
  if (rol === 'admin') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
