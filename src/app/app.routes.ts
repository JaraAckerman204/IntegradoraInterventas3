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
  {
    path: 'productos/reyma',
    loadComponent: () => import('./reyma/reyma.page').then( m => m.ReymaPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/chiligrin',
    loadComponent: () => import('./chiligrin/chiligrin.page').then( m => m.ChiligrinPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/dart',
    loadComponent: () => import('./dart/dart.page').then( m => m.DartPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/monark',
    loadComponent: () => import('./monark/monark.page').then( m => m.MonarkPage),
    canActivate: [authGuard],
  },
  {
    path: 'productos/anguiplast',
    loadComponent: () => import('./anguiplast/anguiplast.page').then( m => m.AnguiplastPage),
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

  // 🌱 PERFIL (protegida por login) ✅ AGREGADO authGuard
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [authGuard], // ✅ AGREGADO
  },

  // 🌱 CARRITO (protegida por login)
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito.page').then((m) => m.CarritoPage),
    canActivate: [authGuard],
  },

  // 🌱 ADMIN (protegida por adminGuard)
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
    canActivate: [adminGuard],
  },

  // ==========================================
  // RUTA 404 (debe ir al final)
  // ==========================================
  {
    path: '**',
    redirectTo: 'home'
  }
];