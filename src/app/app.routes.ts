import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
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
  },
  {
    path: 'correo-enviado',
    loadComponent: () => import('./correo-enviado/correo-enviado.page').then((m) => m.CorreoEnviadoPage),
  },

  // 🌱 SECCIÓN ADMIN
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then(m => m.AdminPage),
    canActivate: [adminGuard],
  },

  // 🌱 SECCIÓN PRODUCTOS (protegida por login)
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then((m) => m.ProductosPage),
    canActivate: [authGuard],
  },

  // 🌱 RUTA 404
  {
    path: '**',
    redirectTo: 'home',
  },
];
