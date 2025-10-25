import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { menuOutline } from 'ionicons/icons';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // 🔽 Variables existentes
  showNosotrosDropdown = false;
  showSucursalesDropdown = false;
  showMobileMenu = false;
  dropdownPosition = { top: '0px', left: '0px' };
  menuOutline = menuOutline;

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
      this.router.navigate(['/login']);
    });
  }

  // 🟢 Menú hamburguesa
  toggleMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.closeDropdowns();
  }

  closeMenu() {
    this.showMobileMenu = false;
    this.closeDropdowns();
  }

  // 🟢 Dropdowns (Nosotros / Sucursales) - CORREGIDO
  toggleDropdown(menu: 'nosotros' | 'sucursales', event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    // USAR currentTarget en lugar de target
    const button = event.currentTarget as HTMLElement;
    
    if (!button) {
      console.error('No se pudo obtener el botón');
      return;
    }

    const rect = button.getBoundingClientRect();
    console.log('Button rect:', rect); // Debug
    
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

    console.log('Dropdown position:', this.dropdownPosition); // Debug

    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showSucursalesDropdown = false;
      console.log('showNosotrosDropdown:', this.showNosotrosDropdown); // Debug
    } else {
      this.showSucursalesDropdown = !this.showSucursalesDropdown;
      this.showNosotrosDropdown = false;
      console.log('showSucursalesDropdown:', this.showSucursalesDropdown); // Debug
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showSucursalesDropdown = false;
  }

  // 🧠 Cerrar menús si se hace click fuera - MEJORADO
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    // Solo cerrar en desktop
    if (window.innerWidth > 768) {
      const target = event.target as HTMLElement;
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