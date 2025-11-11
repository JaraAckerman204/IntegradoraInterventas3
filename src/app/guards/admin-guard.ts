import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastController = inject(ToastController);
  
  const user = auth.getCurrentUser();
  
  // Si no hay usuario → mostrar mensaje y redirigir a home
  if (!user) {
    const toast = await toastController.create({
      message: 'No puedes entrar a tu carrito sin antes iniciar sesión',
      duration: 3000,
      color: 'warning',
      position: 'bottom'
    });
    await toast.present();
    
    router.navigate(['/home']);
    return false;
  }
  
  // Si hay usuario, verificamos su rol
  const rol = await auth.getUserRole(user.uid);
  
  if (rol === 'admin') {
    return true; // ✅ Acceso permitido
  }
  
  // Si no es admin → redirigir a home
  router.navigate(['/home']);
  return false;
};