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

  // 🌱 SECCIÓN NOSOTROS
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.page').then((m) => m.NosotrosPage),
  },
  {
    path: 'nosotros/contacto',
    loadComponent: () => import('./contacto/contacto.page').then((m) => m.ContactoPage),
  },
  {
    path: 'nosotros/informacion',
    loadComponent: () => import('./informacion/informacion.page').then((m) => m.InformacionPage),
  },

  // 🌱 SECCIÓN PRODUCTOS (protegida por login)
  {
    path: 'productos/todos',
    loadComponent: () => import('./todos/todos.page').then((m) => m.TodosPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/desechables',
    loadComponent: () => import('./desechables/desechables.page').then((m) => m.DesechablesPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/biodegradables',
    loadComponent: () => import('./biodegradables/biodegradables.page').then((m) => m.BiodegradablesPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/bolsas',
    loadComponent: () => import('./bolsas/bolsas.page').then((m) => m.BolsasPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/cocina-reposteria',
    loadComponent: () => import('./cocina-reposteria/cocina-reposteria.page').then((m) => m.CocinaReposteriaPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/alimentos',
    loadComponent: () => import('./alimentos/alimentos.page').then((m) => m.AlimentosPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/higienicos-servilletas',
    loadComponent: () => import('./higienicos-servilletas/higienicos-servilletas.page').then((m) => m.HigienicosServilletasPage),
    canActivate: [authGuard],
  },

  // 🌱 OTRAS SECCIONES
  {
    path: 'sucursales',
    loadComponent: () => import('./sucursales/sucursales.page').then((m) => m.SucursalesPage),
  },
  {
    path: 'preguntas',
    loadComponent: () => import('./preguntas/preguntas.page').then((m) => m.PreguntasPage),
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./privacidad/privacidad.page').then((m) => m.PrivacidadPage),
  },

  // 🌱 ADMIN
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
    canActivate: [adminGuard],
  },

  // ==========================================
  // RUTA 404
  // ==========================================
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito.page').then((m) => m.CarritoPage),
    canActivate: [authGuard],
  },  {
    path: 'reyma',
    loadComponent: () => import('./reyma/reyma.page').then( m => m.ReymaPage)
  },
  {
    path: 'chiligrin',
    loadComponent: () => import('./chiligrin/chiligrin.page').then( m => m.ChiligrinPage)
  },
  {
    path: 'aunguiplast',
    loadComponent: () => import('./aunguiplast/aunguiplast.page').then( m => m.AunguiplastPage)
  },
  {
    path: 'dart',
    loadComponent: () => import('./dart/dart.page').then( m => m.DartPage)
  },
  {
    path: 'monark',
    loadComponent: () => import('./monark/monark.page').then( m => m.MonarkPage)
  },





];
