import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { menuOutline, personCircleOutline, logOutOutline, logInOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // 📽 Variables existentes
  showNosotrosDropdown = false;
  showProductosDropdown = false;
  showSucursalesDropdown = false;
  showMobileMenu = false;
  showProfileMenu = false; // ⭐ Nuevo menú de perfil
  dropdownPosition = { top: '0px', left: '0px' };
  menuOutline = menuOutline;
  personCircleOutline = personCircleOutline; // ⭐ Nuevo icono
  logOutOutline = logOutOutline; // ⭐ Nuevo icono
  logInOutline = logInOutline; // ⭐ Nuevo icono

  // 🔥 Firebase
  user: User | null = null;

  constructor(private elRef: ElementRef, private router: Router) {}

  // ✅ Detecta si hay usuario logueado
  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }

  // 🔥 Cierra sesión
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.user = null;
      this.closeProfileMenu();
      this.router.navigate(['/login']);
    });
  }

  // 🟢 Menú de perfil
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      this.closeMenu();
      this.closeDropdowns();
    }
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  // ✅ Detecta si estamos en la ruta Home
  isHomeActive(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  // ✅ Detecta si estamos en una ruta de Nosotros
  isNosotrosActive(): boolean {
    return this.router.url.startsWith('/nosotros');
  }

  // ✅ Detecta si estamos en una ruta de Productos
  isProductosActive(): boolean {
    return this.router.url.startsWith('/productos');
  }

  // ✅ Detecta si estamos en la ruta Sucursales
  isSucursalesActive(): boolean {
    return this.router.url.startsWith('/sucursales');
  }

  // 🟢 Menú hamburguesa
  toggleMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showMobileMenu) {
      this.closeDropdowns();
      this.closeProfileMenu();
    }
  }

  closeMenu() {
    this.showMobileMenu = false;
    this.closeDropdowns();
  }

  // 🟢 Dropdowns (Nosotros / Productos / Sucursales)
  toggleDropdown(menu: 'nosotros' | 'productos' | 'sucursales', event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    // USAR currentTarget en lugar de target
    const button = event.currentTarget as HTMLElement;
    
    if (!button) {
      console.error('No se pudo obtener el botón');
      return;
    }

    const rect = button.getBoundingClientRect();
    
    const menuWidth = 220;
    const padding = 10;
    const viewportWidth = window.innerWidth;

    let left = rect.left;
    if (left + menuWidth + padding > viewportWidth) {
      left = viewportWidth - menuWidth - padding;
    }

    this.dropdownPosition = {
      top: `${rect.bottom + 8}px`,
      left: `${left}px`,
    };

    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showProductosDropdown = false;
      this.showSucursalesDropdown = false;
    } else if (menu === 'productos') {
      this.showProductosDropdown = !this.showProductosDropdown;
      this.showNosotrosDropdown = false;
      this.showSucursalesDropdown = false;
    } else {
      this.showSucursalesDropdown = !this.showSucursalesDropdown;
      this.showNosotrosDropdown = false;
      this.showProductosDropdown = false;
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showProductosDropdown = false;
    this.showSucursalesDropdown = false;
  }

  // 🧠 Cerrar menús si se hace click fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Cerrar menú de perfil si se hace click fuera
    const insideProfile =
      target.closest('.profile-menu') ||
      target.closest('.profile-menu-btn');
    
    if (!insideProfile) {
      this.closeProfileMenu();
    }
    
    // Solo cerrar dropdowns en desktop
    if (window.innerWidth > 768) {
      const inside =
        target.closest('.center-section') ||
        target.closest('.desktop-dropdown') ||
        target.closest('.navboton');
      
      if (!inside) {
        this.closeDropdowns();
      }
    }
  }

  // Cerrar dropdowns al hacer scroll
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (window.innerWidth > 768) {
      this.closeDropdowns();
    }
  }

  // Cerrar menú móvil al cambiar tamaño de ventana
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 768) {
      this.showMobileMenu = false;
      this.closeDropdowns();
    }
  }
}