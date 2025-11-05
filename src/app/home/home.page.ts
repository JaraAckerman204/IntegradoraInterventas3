// ==========================================
// 📄 home.page.ts - CÓDIGO COMPLETO CON ICONOS
// ==========================================

import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';

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
  ribbonOutline, 
  chevronBackOutline, 
  chevronForwardOutline,
  starOutline,
  albumsOutline,
  mailOutline,
  personOutline,
  sendOutline,
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
  closeOutline,
  cubeOutline,
  cartOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

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
export class HomePage implements OnInit {
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

  // 🎠 Carrusel
  currentSlide = 0;
  totalSlides = 3;
  carouselInterval: any;
  autoPlayDelay = 6000;

  // 📦 Productos desde Firebase
  productos: any[] = [];
  cargando = true;

  // 👤 Control de sesión
  user: any = null;

  // 🛒 Modal de Producto
  showProductModal = false;
  selectedProduct: any = null;
  quantity = 1;

  // 📧 Newsletter
  subscriberName = '';
  subscriberEmail = '';
  isSubscribing = false;

  // 🌟 Productos Destacados
  ribbonOutline = ribbonOutline;
  productosDestacados = [
    {
      id: 1,
      nombre: 'Charola Grande C-10',
      descripcion: 'Charola resistente ideal para pastelerías, carnicerías y servicios de catering. Fabricada con material de alta calidad que garantiza la seguridad alimentaria. Perfecta para presentar y transportar diversos productos de manera profesional.',
      precio: 'Desde $37.00',
      marca: 'Dart',
      piezas: '500 piezas',
      imagen: '../../assets/img/products/charolagrande.png'
    },
    {
      id: 2,
      nombre: 'Vaso Térmico No.10',
      descripcion: 'Vaso térmico con excelente aislamiento que mantiene la temperatura de tus bebidas. Ideal para bebidas frías y calientes. Diseño ergonómico con doble pared que evita quemaduras. Perfecto para cafeterías, restaurantes y eventos.',
      precio: '$26.00 (Paquete)',
      marca: 'Monarch',
      piezas: '1000 piezas',
      imagen: '../../assets/img/products/vasotermico.png'
    },
    {
      id: 3,
      nombre: 'Cuchara Plástica Mediana',
      descripcion: 'Cuchara de plástico resistente y económica, perfecta para eventos, restaurantes y negocios de comida rápida. Material de alta calidad que no se dobla ni se rompe fácilmente. Disponible en cajas con excelente precio mayorista.',
      precio: 'Desde $14.00 (Caja)',
      marca: 'Reyma',
      piezas: '1000 piezas',
      imagen: '../../assets/img/products/cucharamediana.png'
    },
    {
      id: 4,
      nombre: 'Plato Biodegradable 9"',
      descripcion: 'Plato fabricado con materiales biodegradables y amigables con el medio ambiente. Resistente y elegante, perfecto para cualquier tipo de evento. Contribuye a reducir el impacto ambiental sin sacrificar calidad ni presentación.',
      precio: '$52.00 (Paquete 50)',
      marca: 'Chiligrin',
      piezas: '50 piezas',
      imagen: '../../assets/img/products/platobiodegradable.png'
    }
  ];

  constructor(
    private elRef: ElementRef,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private push: PushService,
    private toastController: ToastController
  ) {
    // 🎨 Registrar TODOS los iconos
    addIcons({
      'menu-outline': menuOutline,
      'log-out-outline': logOutOutline,
      'log-in-outline': logInOutline,
      'ribbon-outline': ribbonOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'star-outline': starOutline,
      'albums-outline': albumsOutline,
      'mail-outline': mailOutline,
      'person-outline': personOutline,
      'send-outline': sendOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'close-outline': closeOutline,
      'cube-outline': cubeOutline,
      'cart-outline': cartOutline
    });
  }

  ngOnInit() {
    // 🔔 Notificaciones push
    this.push.requestPermission();
    this.push.listenMessages();

    // 🎠 Iniciar carrusel automático
    this.startCarousel();

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

  ngOnDestroy() {
    // 🛑 Limpiar interval del carrusel
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // 📧 FUNCIÓN DE SUSCRIPCIÓN AL NEWSLETTER
  async subscribeNewsletter(event: Event) {
    event.preventDefault();
    
    // Validación básica
    if (!this.subscriberName.trim() || !this.subscriberEmail.trim()) {
      await this.showToast('Por favor completa todos los campos', 'warning');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.subscriberEmail)) {
      await this.showToast('Por favor ingresa un correo válido', 'warning');
      return;
    }
    
    this.isSubscribing = true;
    
    // Simular proceso de suscripción
    setTimeout(async () => {
      // Mostrar mensaje de éxito
      await this.showToast('¡Suscripción exitosa! Recibirás nuestras mejores ofertas', 'success');
      
      // Log para desarrollo
      console.log('✅ Suscripción registrada:', {
        nombre: this.subscriberName.trim(),
        email: this.subscriberEmail.trim(),
        fecha: new Date().toISOString()
      });
      
      // Limpiar formulario
      this.subscriberName = '';
      this.subscriberEmail = '';
      this.isSubscribing = false;
    }, 1500);
  }

  // 🍞 Toast Helper
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  // 🛒 FUNCIONES DEL MODAL DE PRODUCTO
  openProductModal(product: any) {
    console.log('🔍 Abriendo modal para:', product);
    this.selectedProduct = product;
    this.quantity = 1;
    this.showProductModal = true;
    document.body.style.overflow = 'hidden';
    console.log('✅ showProductModal:', this.showProductModal);
  }

  closeProductModal() {
    console.log('❌ Cerrando modal');
    this.showProductModal = false;
    this.selectedProduct = null;
    this.quantity = 1;
    document.body.style.overflow = '';
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCart() {
    console.log('Agregando al carrito:', {
      producto: this.selectedProduct,
      cantidad: this.quantity
    });
    
    await this.showToast(`✅ ${this.quantity} ${this.selectedProduct.nombre} agregado(s) al carrito`, 'success');
    this.closeProductModal();
  }

  // 🚪 Cerrar sesión
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // 🎠 FUNCIONES DEL CARRUSEL MEJORADO
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

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.showProductModal) {
      this.closeProductModal();
    }
  }
  
}