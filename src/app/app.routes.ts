import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // ✅ Importamos el guard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    // 👀 Página pública
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then((m) => m.ProductosPage),
    canActivate: [authGuard], // 🔒 Solo usuarios logeados y verificados
  },
  {
    path: 'informacion',
    loadComponent: () => import('./informacion/informacion.page').then((m) => m.InformacionPage),
    canActivate: [authGuard],
  },
  {
    path: 'sucursales',
    loadComponent: () => import('./sucursales/sucursales.page').then((m) => m.SucursalesPage),
    canActivate: [authGuard],
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.page').then((m) => m.NosotrosPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'verificar',
    loadComponent: () => import('./verificar/verificar.page').then((m) => m.VerificarPage),
    // ✅ Nueva página para mostrar mensaje o reenviar correo de verificación
  },
  {
    path: '**',
    redirectTo: 'home',
  },
  {
    path: 'sucursales',
    loadComponent: () => import('./sucursales/sucursales.page').then( m => m.SucursalesPage)
  },
];
