import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { 
  menuOutline, 
  personCircleOutline, 
  logOutOutline, 
  logInOutline,
  cartOutline,
  chevronDownOutline,
  searchOutline,
  closeOutline,
  homeOutline,
  peopleOutline,
  cubeOutline,
  locationOutline,
  mailOutline,
  informationCircleOutline,
  gridOutline,
  cafeOutline,
  leafOutline,
  bagOutline,
  restaurantOutline,
  pizzaOutline,
  waterOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // Estados de menús
  showNosotrosDropdown = false;
  showProductosDropdown = false;
  showMobileMenu = false;
  showProfileMenu = false;
  dropdownPosition = { top: '0px', left: '0px' };
  
  // Iconos
  menuOutline = menuOutline;
  personCircleOutline = personCircleOutline;
  logOutOutline = logOutOutline;
  logInOutline = logInOutline;
  cartOutline = cartOutline;

  // Usuario de Firebase
  user: User | null = null;

  // Carrito
  cartItemCount = 0;

  constructor(private elRef: ElementRef, private router: Router) {
    // Registrar iconos
    addIcons({ 
      'menu-outline': menuOutline,
      'person-circle-outline': personCircleOutline,
      'log-out-outline': logOutOutline,
      'log-in-outline': logInOutline,
      'cart-outline': cartOutline,
      'chevron-down-outline': chevronDownOutline,
      'search-outline': searchOutline,
      'close-outline': closeOutline,
      'home-outline': homeOutline,
      'people-outline': peopleOutline,
      'cube-outline': cubeOutline,
      'location-outline': locationOutline,
      'mail-outline': mailOutline,
      'information-circle-outline': informationCircleOutline,
      'grid-outline': gridOutline,
      'cafe-outline': cafeOutline,
      'leaf-outline': leafOutline,
      'bag-outline': bagOutline,
      'restaurant-outline': restaurantOutline,
      'pizza-outline': pizzaOutline,
      'water-outline': waterOutline
    });
  }

  ngOnInit() {
    // Escuchar cambios de autenticación
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });

    // Aquí puedes suscribirte a tu servicio de carrito
    // Ejemplo:
    // this.cartService.getCartItemCount().subscribe(count => {
    //   this.cartItemCount = count;
    // });
  }

  // ====================================
  // MÉTODOS DE DETECCIÓN DE RUTA ACTIVA
  // ====================================

  isHomeActive(): boolean {
    return this.router.url === '/home' || this.router.url === '/';
  }

  isNosotrosActive(): boolean {
    return this.router.url.startsWith('/nosotros');
  }

  isProductosActive(): boolean {
    return this.router.url.startsWith('/productos');
  }

  isSucursalesActive(): boolean {
    return this.router.url.startsWith('/sucursales');
  }

  // ====================================
  // MÉTODOS DE MENÚ DE PERFIL
  // ====================================

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

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.user = null;
      this.closeProfileMenu();
      this.closeMenu();
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  // ====================================
  // MÉTODOS DE MENÚ MÓVIL
  // ====================================

  toggleMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showMobileMenu) {
      this.closeProfileMenu();
      // No cerramos dropdowns aquí para permitir navegación en móvil
      document.body.style.overflow = 'hidden';
    } else {
      this.closeDropdowns();
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.showMobileMenu = false;
    this.closeDropdowns();
    document.body.style.overflow = '';
  }

  // ====================================
  // MÉTODOS DE DROPDOWNS
  // ====================================

  toggleDropdown(menu: 'nosotros' | 'productos', event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget as HTMLElement;
    
    if (!button) {
      console.error('No se pudo obtener el botón');
      return;
    }

    // Solo calcular posición en desktop
    if (window.innerWidth > 1024) {
      const rect = button.getBoundingClientRect();
      
      const menuWidth = 320; // Ambos menús ahora tienen el mismo ancho
      const padding = 20;
      const viewportWidth = window.innerWidth;

      let left = rect.left;
      
      // Ajustar si el menú se sale de la pantalla
      if (left + menuWidth + padding > viewportWidth) {
        left = viewportWidth - menuWidth - padding;
      }

      // Asegurar que no se salga por la izquierda
      if (left < padding) {
        left = padding;
      }

      this.dropdownPosition = {
        top: `${rect.bottom + 12}px`,
        left: `${left}px`,
      };
    }

    // Toggle del menú correspondiente
    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showProductosDropdown = false;
    } else if (menu === 'productos') {
      this.showProductosDropdown = !this.showProductosDropdown;
      this.showNosotrosDropdown = false;
    }

    // En móvil, no cerrar el menú principal
    if (window.innerWidth <= 1024) {
      // Los dropdowns se manejan dentro del sidebar
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showProductosDropdown = false;
  }

  // ====================================
  // HOST LISTENERS
  // ====================================

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Cerrar menú de perfil si se hace click fuera
    const insideProfile =
      target.closest('.profile-dropdown') ||
      target.closest('.profile-btn');
    
    if (!insideProfile) {
      this.closeProfileMenu();
    }
    
    // Solo cerrar dropdowns en desktop
    if (window.innerWidth > 1024) {
      const inside =
        target.closest('.desktop-nav') ||
        target.closest('.modern-dropdown') ||
        target.closest('.nav-link');
      
      if (!inside) {
        this.closeDropdowns();
      }
    }

    // Cerrar sidebar móvil si se hace click en el overlay
    if (target.classList.contains('sidebar-overlay')) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Cerrar dropdowns al hacer scroll (solo en desktop)
    if (window.innerWidth > 1024) {
      this.closeDropdowns();
      this.closeProfileMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Cerrar menú móvil si la ventana se agranda
    if (window.innerWidth > 1024) {
      this.closeMenu();
      document.body.style.overflow = '';
    } else {
      // Cerrar dropdowns desktop si la ventana se achica
      this.closeDropdowns();
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    // Cerrar menús con tecla ESC
    if (this.showMobileMenu) {
      this.closeMenu();
    }
    if (this.showProfileMenu) {
      this.closeProfileMenu();
    }
    if (this.showNosotrosDropdown || this.showProductosDropdown) {
      this.closeDropdowns();
    }
  }
}