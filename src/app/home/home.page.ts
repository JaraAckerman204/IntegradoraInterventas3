// ==========================================
// 📄 home.page.ts - CON PRODUCTOS DESTACADOS
// ==========================================

import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';
import { ProductosService, Producto } from '../services/productos.service';
import { CartService } from '../services/cart.service';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';

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
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';

import { 
  menuOutline, 
  logOutOutline, 
  logInOutline, 
  chevronBackOutline, 
  chevronForwardOutline,
  mailOutline,
  personOutline,
  sendOutline,
  cartOutline,
  callOutline,
  shieldCheckmarkOutline,
  rocketOutline,
  headsetOutline,
  ribbonOutline,
  pricetagOutline,
  cubeOutline,
  timeOutline,
  arrowForwardOutline,
  calendarOutline,
  paperPlaneOutline,
  star,
  starOutline,
  eyeOutline,
  closeOutline,
  addOutline,
  removeOutline,
  storefrontOutline,
  barcodeOutline,
  informationCircleOutline,
  albumsOutline,
  colorPaletteOutline,
  resizeOutline,
  checkmarkCircleOutline,
  leafOutline,
  radioOutline,
  snowOutline,
  bulbOutline,
  layersOutline,
  documentTextOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
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
export class HomePage implements OnInit, OnDestroy {
  // 🧭 Navegación y menú
  showNosotrosDropdown = false;
  showSucursalesDropdown = false;
  showMobileMenu = false;
  dropdownPosition = { top: '0px', left: '0px' };
  menuOutline = menuOutline;
  logOutOutline = logOutOutline;
  logInOutline = logInOutline;
  chevronBackOutline = chevronBackOutline;
  chevronForwardOutline = chevronForwardOutline;

  // 🎠 Carrusel de flyers
  currentSlide = 0;
  totalSlides = 3;
  carouselInterval: any;
  autoPlayDelay = 6000;

  // 👤 Control de sesión
  user: any = null;

  // 📧 Newsletter
  subscriberName = '';
  subscriberEmail = '';
  isSubscribing = false;

  // ⭐ PRODUCTOS DESTACADOS
  productosDestacados: Producto[] = [];
  currentFeaturedIndex = 0;
  featuredTransform = 0;
  featuredPages: number[] = [];
  maxFeaturedIndex = 0;
  productsPerPage = 4;
  isMobile = false;

  // 🛒 Modal de producto
  isModalOpen = false;
  selectedProduct: Producto | null = null;
  quantity = 1;
  selectedTienda: string = '';
  selectedModalidad: string = '';
  selectedModalidadObj: any = null;

  // 🔥 Firestore
  firestore = inject(Firestore);

  constructor(
    private elRef: ElementRef,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private push: PushService,
    private toastController: ToastController,
    private productosService: ProductosService,
    private cartService: CartService
  ) {
    // 🎨 Registrar TODOS los iconos
    addIcons({
      'menu-outline': menuOutline,
      'log-out-outline': logOutOutline,
      'log-in-outline': logInOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'mail-outline': mailOutline,
      'person-outline': personOutline,
      'send-outline': sendOutline,
      'cart-outline': cartOutline,
      'call-outline': callOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'shield-checkmark': shieldCheckmarkOutline,
      'rocket-outline': rocketOutline,
      'headset-outline': headsetOutline,
      'ribbon-outline': ribbonOutline,
      'pricetag-outline': pricetagOutline,
      'pricetag': pricetagOutline,
      'calendar-outline': calendarOutline,
      'paper-plane-outline': paperPlaneOutline,
      'star': star,
      'star-outline': starOutline,
      'eye-outline': eyeOutline,
      'close-outline': closeOutline,
      'add-outline': addOutline,
      'remove-outline': removeOutline,
      'storefront-outline': storefrontOutline,
      'barcode-outline': barcodeOutline,
      'cube-outline': cubeOutline,
      'information-circle-outline': informationCircleOutline,
      'albums-outline': albumsOutline,
      'color-palette-outline': colorPaletteOutline,
      'resize-outline': resizeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'leaf-outline': leafOutline,
      'radio-outline': radioOutline,
      'snow-outline': snowOutline,
      'bulb-outline': bulbOutline,
      'layers-outline': layersOutline,
      'document-text-outline': documentTextOutline
    });

    // 🔧 Inicializar EmailJS
    emailjs.init('eSh72EoK4k2SontZF');
  }

  ngOnInit() {
  // 📱 Detectar si es móvil
  this.checkScreenSize();
  
  // 🔔 Notificaciones push
  this.push.requestPermission();
  this.push.listenMessages();

  // 🎠 Iniciar carrusel automático
  this.startCarousel();

  // 👤 Escuchar sesión activa
  this.authService.currentUser$.subscribe((user) => {
    this.user = user;
    console.log('👤 Usuario activo:', user);
  });

  // ⭐ Cargar productos destacados
  this.loadFeaturedProducts();
}

  ngOnDestroy() {
    // 🛑 Limpiar interval del carrusel
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // 📱 DETECTAR TAMAÑO DE PANTALLA
checkScreenSize() {
  this.isMobile = window.innerWidth <= 768;
  this.productsPerPage = this.isMobile ? 1 : 4;
  if (this.productosDestacados.length > 0) {
    this.calculateFeaturedPages();
  }
}

// 🔄 ESCUCHAR CAMBIOS DE TAMAÑO
@HostListener('window:resize', ['$event'])
onResize() {
  const wasMobile = this.isMobile;
  this.checkScreenSize();
  
  // Si cambió de mobile a desktop o viceversa, recalcular
  if (wasMobile !== this.isMobile && this.productosDestacados.length > 0) {
    this.currentFeaturedIndex = 0;
    this.calculateFeaturedPages();
    this.updateFeaturedTransform();
  }
}

  // ⭐ CARGAR PRODUCTOS DESTACADOS
  loadFeaturedProducts() {
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        // Filtrar solo productos destacados y limitar a 8
        this.productosDestacados = productos
          .filter(p => p.destacado === true)
          .slice(0, 8);

        console.log('⭐ Productos destacados cargados:', this.productosDestacados.length);

        // Calcular páginas del carrusel
        this.calculateFeaturedPages();
      },
      error: (error) => {
        console.error('❌ Error cargando productos destacados:', error);
      }
    });
  }

 // 🎠 CALCULAR PÁGINAS DEL CARRUSEL
calculateFeaturedPages() {
  const totalProducts = this.productosDestacados.length;
  const totalPages = Math.ceil(totalProducts / this.productsPerPage);
  this.featuredPages = Array(totalPages).fill(0).map((_, i) => i);
  this.maxFeaturedIndex = totalPages - 1;
  
  // Ajustar índice actual si está fuera de rango
  if (this.currentFeaturedIndex > this.maxFeaturedIndex) {
    this.currentFeaturedIndex = this.maxFeaturedIndex;
    this.updateFeaturedTransform();
  }
  
  console.log(`🎠 Carrusel configurado: ${totalPages} páginas, ${this.productsPerPage} productos por página`);
}

// ⬅️ CARRUSEL: Anterior
prevFeatured() {
  if (this.currentFeaturedIndex > 0) {
    this.currentFeaturedIndex--;
    this.updateFeaturedTransform();
    console.log(`⬅️ Anterior - Índice: ${this.currentFeaturedIndex}`);
  }
}

// ➡️ CARRUSEL: Siguiente
nextFeatured() {
  if (this.currentFeaturedIndex < this.maxFeaturedIndex) {
    this.currentFeaturedIndex++;
    this.updateFeaturedTransform();
    console.log(`➡️ Siguiente - Índice: ${this.currentFeaturedIndex}`);
  }
}

// 🎯 CARRUSEL: Ir a página específica
goToFeaturedPage(index: number) {
  this.currentFeaturedIndex = index;
  this.updateFeaturedTransform();
  console.log(`🎯 Ir a página: ${index}`);
}

// 🔄 ACTUALIZAR TRANSFORM DEL CARRUSEL
updateFeaturedTransform() {
  if (this.isMobile) {
    // En móvil: 1 producto por página, sin gap
    this.featuredTransform = -(this.currentFeaturedIndex * 100);
  } else {
    const gapPercentage = 1.5; // Ajuste fino del gap (aproximadamente 20px / ancho contenedor)
    this.featuredTransform = -(this.currentFeaturedIndex * (100 + gapPercentage));
  }
  
  console.log(`🔄 Transform: ${this.featuredTransform}%, Página: ${this.currentFeaturedIndex + 1}, Mobile: ${this.isMobile}`);
}

  // 👁️ VER PRODUCTO DESTACADO
  viewFeaturedProduct(product: Producto) {
    console.log('👁️ Ver producto destacado:', product.nombre);
    this.selectedProduct = product;
    this.quantity = 1;
    this.selectedTienda = '';
    this.selectedModalidad = '';
    this.selectedModalidadObj = null;
    this.isModalOpen = true;
  }

  // ❌ CERRAR MODAL
  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
    this.quantity = 1;
    this.selectedTienda = '';
    this.selectedModalidad = '';
    this.selectedModalidadObj = null;
  }

  // 🔄 CAMBIO DE MODALIDAD
  onModalidadChange() {
    if (!this.selectedProduct || !this.selectedModalidad) {
      this.selectedModalidadObj = null;
      return;
    }

    this.selectedModalidadObj = this.selectedProduct.modalidades?.find(
      (m: any) => m.id === this.selectedModalidad
    ) || null;

    console.log('🛒 Modalidad seleccionada:', this.selectedModalidadObj);
  }

  // 💰 OBTENER PRECIO ACTUAL
  getCurrentPrice(): number {
    if (this.selectedModalidadObj) {
      return this.selectedModalidadObj.precio;
    }
    return 0;
  }

  // 💵 CALCULAR TOTAL
  getTotal(): number {
    return this.getCurrentPrice() * this.quantity;
  }

  // ➕ INCREMENTAR CANTIDAD
  incrementQuantity() {
    this.quantity++;
  }

  // ➖ DECREMENTAR CANTIDAD
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // 🛒 AGREGAR AL CARRITO DESDE MODAL
  addToCartFromModal() {
    if (!this.selectedProduct) return;

    if (!this.selectedModalidadObj) {
      this.showToast('Por favor selecciona una modalidad.', 'warning');
      return;
    }

    const modalidadSeleccionada = {
      tipo: this.selectedModalidadObj.modalidad,
      tamano: this.selectedModalidadObj.tamano,
      contenido: this.selectedModalidadObj.contenido,
      precio: this.selectedModalidadObj.precio
    };

    const options = {
      modalidad: this.selectedModalidadObj.modalidad,
      tamano: this.selectedModalidadObj.tamano,
      contenido: this.selectedModalidadObj.contenido,
      sucursal: this.selectedTienda || ''
    };

    const productWithModalidad = {
      ...this.selectedProduct,
      precio: this.selectedModalidadObj.precio,
      modalidadSeleccionada
    };

    console.log('🛒 Agregando al carrito:', {
      producto: productWithModalidad.nombre,
      modalidad: modalidadSeleccionada,
      opciones: options,
      cantidad: this.quantity
    });

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(productWithModalidad, options);
    }

    this.showToast(`${this.quantity} x ${this.selectedProduct.nombre} agregado(s) al carrito`, 'success');
    this.closeModal();
  }

  // 📧 SUSCRIPCIÓN AL NEWSLETTER
  async subscribeNewsletter(event: Event) {
    event.preventDefault();
    
    if (!this.subscriberName.trim() || !this.subscriberEmail.trim()) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.subscriberEmail)) {
      await this.showToast('Por favor ingresa un correo válido', 'warning');
      return;
    }
    
    this.isSubscribing = true;
    
    try {
      const suscriptoresRef = collection(this.firestore, 'newsletter');
      const q = query(suscriptoresRef, where('email', '==', this.subscriberEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        await this.showToast('⚠️ Este correo ya está suscrito', 'warning');
        this.isSubscribing = false;
        return;
      }

      const nuevoSuscriptor = {
        nombre: this.subscriberName.trim(),
        email: this.subscriberEmail.trim().toLowerCase(),
        fechaSuscripcion: new Date().toISOString(),
        activo: true
      };

      await addDoc(collection(this.firestore, 'newsletter'), nuevoSuscriptor);

      const templateParams = {
        to_name: this.subscriberName.trim(),
        to_email: this.subscriberEmail.trim(),
        from_name: 'Interventas',
        message: `¡Bienvenido a nuestro newsletter! Ahora recibirás las mejores ofertas y promociones exclusivas.`
      };

      await emailjs.send(
        'service_i4xbqss',
        'template_vplptng',
        templateParams
      );

      console.log('✅ Suscripción registrada:', nuevoSuscriptor);
      
      await this.showToast('¡Suscripción exitosa! Revisa tu correo de bienvenida 📧', 'success');
      
      this.subscriberName = '';
      this.subscriberEmail = '';
      this.isSubscribing = false;
      
      const form = event.target as HTMLFormElement;
      form.reset();
      
    } catch (error) {
      console.error('❌ Error en suscripción:', error);
      await this.showToast('Error al suscribirse. Intenta nuevamente', 'danger');
      this.isSubscribing = false;
    }
  }

  // 🍞 Toast Helper
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: `toast-${color}`
    });
    await toast.present();
  }

  // 🚪 Cerrar sesión
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // 🎠 FUNCIONES DEL CARRUSEL DE FLYERS
  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.resetCarousel();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetCarousel();
  }

  resetCarousel() {
    this.stopCarousel();
    this.startCarousel();
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