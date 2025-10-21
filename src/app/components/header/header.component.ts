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
  }

  // 🟢 Dropdowns (Nosotros / Sucursales)
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
      left: `${left}px`,
    };

    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showSucursalesDropdown = false;
    } else {
      this.showSucursalesDropdown = !this.showSucursalesDropdown;
      this.showNosotrosDropdown = false;
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showSucursalesDropdown = false;
  }

  // 🧠 Cerrar menús si se hace click fuera
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
