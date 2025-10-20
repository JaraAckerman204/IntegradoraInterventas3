import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFooter,
  IonImg,
  IonPopover,
  IonList,
  IonMenuButton,
  IonMenu,
  IonSpinner
} from '@ionic/angular/standalone';

import { menuOutline, logOutOutline, logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonImg,
    IonPopover,
    IonList,
    IonMenuButton,
    IonMenu,
    IonSpinner
  ]
})
export class HomePage {
  // 🧭 Navegación y menú
  showNosotrosDropdown = false;
  showSucursalesDropdown = false;
  showMobileMenu = false;
  dropdownPosition = { top: '0px', left: '0px' };
  menuOutline = menuOutline;
  logOutOutline = logOutOutline;
  logInOutline = logInOutline;

  // 📦 Productos desde Firebase
  productos: any[] = [];
  cargando = true;

  // 👤 Control de sesión
  user: any = null;

  constructor(
    private elRef: ElementRef,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔥 Obtener productos
    this.firebaseService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        console.log('✅ Productos cargados en Home:', this.productos);
      },
      error: (err) => {
        console.error('❌ Error al obtener productos:', err);
        this.cargando = false;
      }
    });

    // 👤 Escuchar sesión activa
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('👤 Usuario activo:', user);
    });
  }

  // 🚪 Cerrar sesión
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // 🧩 Agregar producto de prueba (opcional)
  async agregarProducto() {
    await this.firebaseService.addProduct({
      nombre: 'Vaso desechable 12 oz',
      precio: 45,
      descripcion: 'Paquete de 50 vasos desechables de alta calidad.',
      imagen: 'https://example.com/vaso.png'
    });
  }

  // 🧭 Control de menú y dropdowns
  toggleMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.closeDropdowns();
  }

  closeMenu() {
    this.showMobileMenu = false;
  }

  toggleDropdown(menu: 'nosotros' | 'sucursales', event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const menuWidth = 220;
    const padding = 10;
    const viewportWidth = window.innerWidth;

    let left = rect.left;
    if (left + menuWidth + padding > viewportWidth) {
      left = viewportWidth - menuWidth - padding;
    }

    this.dropdownPosition = {
      top: `${rect.bottom + 5}px`,
      left: `${left}px`
    };

    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showSucursalesDropdown = false;
    } else if (menu === 'sucursales') {
      this.showSucursalesDropdown = !this.showSucursalesDropdown;
      this.showNosotrosDropdown = false;
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showSucursalesDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const inside =
      target.closest('.nav-links-container') ||
      target.closest('.dropdown-menu') ||
      target.closest('.menu-toggle') ||
      target.closest('.mobile-menu');
    if (!inside) {
      this.closeDropdowns();
      this.showMobileMenu = false;
    }
  }
}
