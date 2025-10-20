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
    // 👀 sin guard, todos pueden entrar
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then((m) => m.ProductosPage),
    canActivate: [authGuard], // 🔒 solo usuarios logeados
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
    path: 'informacion',
    loadComponent: () => import('./informacion/informacion.page').then( m => m.InformacionPage)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.page').then( m => m.NosotrosPage)
  },
  {
    path: 'sucursales',
    loadComponent: () => import('./sucursales/sucursales.page').then( m => m.SucursalesPage)
  },
];
