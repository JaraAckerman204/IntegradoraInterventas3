import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
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
  chevronForwardOutline,
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
  waterOutline,
  shieldCheckmarkOutline,
  documentTextOutline,
  helpCircleOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

interface TooltipLetter {
  char: string;
  move: string;
  rotate: string;
  part: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Estados de menús
  showNosotrosDropdown = false;
  showProductosDropdown = false;
  showMobileMenu = false;
  showProfileMenu = false;
  dropdownPosition = { top: '0px', left: '0px' };
  currentTab: 'menu' | 'account' = 'menu'; // AÑADIR ESTA LÍNEA
  
  // Iconos
  menuOutline = menuOutline;
  personCircleOutline = personCircleOutline;
  logOutOutline = logOutOutline;
  logInOutline = logInOutline;
  cartOutline = cartOutline;
  shieldCheckmarkOutline = shieldCheckmarkOutline;

  // Usuario de Firebase
  user: User | null = null;
  
  // Rol del usuario
  isAdmin = false;

  // Carrito
  cartItemCount = 0;
  private cartSubscription?: Subscription;

  // WhatsApp
  whatsappUrl = 'https://wa.me/5218711146742';
  tooltipText = '¡Estamos para servirte!';
  tooltipLetters: TooltipLetter[] = [];
  showWhatsappTooltip = false;
  tooltipAnimateIn = false;
  tooltipAnimateOut = false;
  buttonAnimateIn = false;
  buttonAnimateOut = false;

  constructor(
    private elRef: ElementRef, 
    private router: Router,
    private cartService: CartService
  ) {
addIcons({ 
  'menu-outline': menuOutline,
  'person-circle-outline': personCircleOutline,
  'log-out-outline': logOutOutline,
  'log-in-outline': logInOutline,
  'cart-outline': cartOutline,
  'chevron-down-outline': chevronDownOutline,
  'chevron-forward-outline': chevronForwardOutline,
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
  'water-outline': waterOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'document-text-outline': documentTextOutline,
  'help-circle-outline': helpCircleOutline
});
  }

  async ngOnInit() {
    // Escuchar cambios de autenticación
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      this.user = user;
      
      if (user) {
        await this.checkUserRole(user.uid);
      } else {
        this.isAdmin = false;
      }
    });

    // Suscribirse al contador del carrito
    this.cartSubscription = this.cartService.getCartCount().subscribe((count: number) => {
      this.cartItemCount = count;
      console.log('🛒 Contador del carrito actualizado:', count);
    });

    // Inicializar letras del tooltip de WhatsApp
    this.initTooltipLetters();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  /**
   * Obtener el texto del perfil según la ruta actual
   */
  getProfileText(): string {
    if (this.router.url.startsWith('/admin')) {
      return 'Administración';
    }
    return 'Perfil';
  }

  /**
   * Inicializar las letras del tooltip con sus propiedades de animación
   */
  initTooltipLetters() {
    const letters = this.tooltipText.split('');
    this.tooltipLetters = letters.map((letter, index) => {
      const part = (index >= letters.length / 2) ? -1 : 1;
      const position = (index >= letters.length / 2) 
        ? letters.length / 2 - index + (letters.length / 2 - 1) 
        : index;
      const move = position / (letters.length / 2);
      const rotate = 1 - move;
      
      return {
        char: !letter.trim() ? '&nbsp;' : letter,
        move: move.toString(),
        rotate: rotate.toString(),
        part: part.toString()
      };
    });
  }

  /**
   * Obtener solo el primer nombre del usuario
   */
  getUserName(): string {
    if (!this.user) {
      return 'Perfil';
    }
    
    // Si tiene displayName, tomar solo el primer nombre
    if (this.user.displayName) {
      const firstName = this.user.displayName.split(' ')[0];
      return firstName;
    }
    
    // Si no tiene displayName, extraer del email
    if (this.user.email) {
      const emailName = this.user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Perfil';
  }

  /**
   * Manejar hover del botón de WhatsApp
   */
  onWhatsappHover(isEnter: boolean) {
    if (isEnter) {
      if (!this.tooltipAnimateOut && !this.tooltipAnimateIn) {
        this.tooltipAnimateIn = true;
        this.buttonAnimateIn = true;
      }
    } else {
      if (this.tooltipAnimateIn) {
        this.tooltipAnimateOut = true;
        this.buttonAnimateOut = true;
        setTimeout(() => {
          this.tooltipAnimateIn = false;
          this.tooltipAnimateOut = false;
          this.buttonAnimateIn = false;
          this.buttonAnimateOut = false;
        }, 950);
      }
    }
  }

  /**
   * Verificar el rol del usuario en Firestore
   */
  async checkUserRole(uid: string) {
    try {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'usuarios', uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.isAdmin = userData['rol'] === 'admin';
      } else {
        this.isAdmin = false;
      }
    } catch (error) {
      console.error('Error al verificar rol del usuario:', error);
      this.isAdmin = false;
    }
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

  isAdminActive(): boolean {
    return this.router.url.startsWith('/admin');
  }

  isCartActive(): boolean {
    return this.router.url.startsWith('/carrito');
  }

  isPerfilActive(): boolean {
    return this.router.url.startsWith('/perfil');
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
      this.isAdmin = false;
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

    if (window.innerWidth > 1024) {
      const rect = button.getBoundingClientRect();
      const menuWidth = 320;
      const padding = 20;
      const viewportWidth = window.innerWidth;

      let left = rect.left;
      
      if (left + menuWidth + padding > viewportWidth) {
        left = viewportWidth - menuWidth - padding;
      }

      if (left < padding) {
        left = padding;
      }

      this.dropdownPosition = {
        top: `${rect.bottom + 12}px`,
        left: `${left}px`,
      };
    }

    if (menu === 'nosotros') {
      this.showNosotrosDropdown = !this.showNosotrosDropdown;
      this.showProductosDropdown = false;
    } else if (menu === 'productos') {
      this.showProductosDropdown = !this.showProductosDropdown;
      this.showNosotrosDropdown = false;
    }
  }

  closeDropdowns() {
    this.showNosotrosDropdown = false;
    this.showProductosDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Verificar si el click está fuera del perfil
    const insideProfile =
      target.closest('.ultra-profile-menu') ||
      target.closest('.ultra-profile-btn');
    
    if (!insideProfile) {
      this.closeProfileMenu();
    }
    
    // Verificar si el click está fuera de los dropdowns
    if (window.innerWidth > 1024) {
      const inside =
        target.closest('.ultra-nav-desktop') ||
        target.closest('.ultra-dropdown');
      
      if (!inside) {
        this.closeDropdowns();
      }
    }

    if (target.classList.contains('sidebar-ultra-overlay')) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (window.innerWidth > 1024) {
      this.closeDropdowns();
      this.closeProfileMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 1024) {
      this.closeMenu();
      document.body.style.overflow = '';
    } else {
      this.closeDropdowns();
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
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