// ==========================================
// 📄 todos.page.ts - LÓGICA RENOVADA CON MODAL
// ==========================================

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonSpinner, 
  IonBadge,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cartOutline,
  cart,
  eyeOutline,
  cubeOutline,
  ribbonOutline,
  closeOutline,
  addOutline,
  removeOutline,
  businessOutline,
  pricetagOutline,
  storefrontOutline,
  linkOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProductosService, Producto } from '../services/productos.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton,
    IonIcon,
    IonSpinner,
    IonBadge,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    CommonModule, 
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class TodosPage implements OnInit, AfterViewInit {
  products: Producto[] = [];
  loading = true;
  cartCount = 0;
  
  // Para el modal de detalles
  isModalOpen = false;
  selectedProduct: Producto | null = null;
  quantity = 1;
  saleType: 'mayoreo' | 'menudeo' = 'menudeo'; // Tipo de venta seleccionado
  
  // Selectores para tamaño, cantidad y tienda
  selectedTamano: string = '';
  selectedCantidad: number | string = '';
  selectedTienda: string = '';

  // ✅ Variables para modalidades
  selectedModalidad: string = ''; // ID o valor seleccionado en el <select>
  selectedModalidadObj: any = null; // Objeto completo de la modalidad elegida

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    // Registrar iconos
    addIcons({ 
      cartOutline,
      cart,
      eyeOutline,
      cubeOutline,
      ribbonOutline,
      closeOutline,
      addOutline,
      removeOutline,
      businessOutline,
      pricetagOutline,
      storefrontOutline,
      linkOutline
    });
  }

  ngOnInit() {
    console.log('✅ Página de productos inicializada');
    this.loadProducts();
    
    // Suscribirse al contador del carrito
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngAfterViewInit() {
    // setupScrollReveal se llama después de cargar los productos
  }

  loadProducts() {
    console.log('🔄 Iniciando carga de productos...');
    this.loading = true;
    
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos recibidos del servicio:', productos);
        this.products = productos;
        this.loading = false;
        console.log('📦 Total de productos:', productos.length);
        
        // Configurar animaciones después de un pequeño delay
        setTimeout(() => {
          console.log('🎬 Configurando animaciones de reveal...');
          this.setupScrollReveal();
        }, 150);
      },
      error: (error) => {
        console.error('❌ Error cargando productos:', error);
        this.loading = false;
        this.showToast('Error al cargar productos. Por favor, intenta de nuevo.', 'danger');
      }
    });
  }

  private setupScrollReveal() {
    const cards = document.querySelectorAll('.product-card.reveal');
    console.log('🎯 Cards encontradas para animación:', cards.length);
    
    if (cards.length === 0) {
      console.warn('⚠️ No se encontraron cards con clase .reveal');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in-view');
            console.log('✨ Card animada:', index);
          }, index * 100);
        }
      });
    }, observerOptions);

    cards.forEach((card) => {
      observer.observe(card);
    });
  }

  // Abrir modal con detalles del producto
  viewProduct(product: Producto) {
    console.log('👁️ Ver detalles del producto:', product.nombre, 'ID:', product.id);
    this.selectedProduct = product;
    this.quantity = 1;
    this.saleType = 'menudeo';
    this.selectedTamano = '';
    this.selectedCantidad = '';
    this.selectedTienda = '';
    this.selectedModalidad = '';
    this.selectedModalidadObj = null;
    this.isModalOpen = true;
  }

  // Cerrar modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
    this.quantity = 1;
    this.saleType = 'menudeo';
    this.selectedTamano = '';
    this.selectedCantidad = '';
    this.selectedTienda = '';
    this.selectedModalidad = '';
    this.selectedModalidadObj = null;
  }

  // ✅ Manejar cambio en la modalidad seleccionada
  onModalidadChange() {
    if (!this.selectedProduct || !this.selectedModalidad) {
      this.selectedModalidadObj = null;
      return;
    }

    // Buscar modalidad seleccionada en el producto actual
    this.selectedModalidadObj = this.selectedProduct.modalidades?.find(
      (m: any) => m.id === this.selectedModalidad
    ) || null;

    console.log('🛍️ Modalidad seleccionada:', this.selectedModalidadObj);
  }

  // Cambiar tipo de venta
  selectSaleType(type: 'mayoreo' | 'menudeo') {
    this.saleType = type;
    console.log('🏪 Tipo de venta seleccionado:', type);
  }

  // Obtener el precio según la modalidad o tipo de venta
  getCurrentPrice(): number {
    if (this.selectedModalidadObj) {
      return this.selectedModalidadObj.precio;
    }

    if (!this.selectedProduct) return 0;
    
    if (this.saleType === 'mayoreo') {
      return this.selectedProduct.precio * 0.85;
    }
    
    return this.selectedProduct.precio;
  }

  // Obtener el total
  getTotal(): number {
    return this.getCurrentPrice() * this.quantity;
  }

  // Incrementar cantidad
  incrementQuantity() {
    this.quantity++;
  }

  // Decrementar cantidad
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

addToCartFromModal() {
  if (!this.selectedProduct) return;

  // ✅ Validar que haya una modalidad seleccionada
  if (!this.selectedModalidadObj) {
    this.showToast('Por favor selecciona una modalidad.', 'warning');
    return;
  }

  // ✅ Crear un objeto con la modalidad seleccionada
  const modalidadSeleccionada = {
    tipo: this.selectedModalidadObj.modalidad, // "Mayoreo" o "Menudeo"
    tamano: this.selectedModalidadObj.tamano,
    contenido: this.selectedModalidadObj.contenido,
    precio: this.selectedModalidadObj.precio
  };

  // ✅ Crear el objeto con las opciones
  const options = {
    modalidad: this.selectedModalidadObj.modalidad,
    tamano: this.selectedModalidadObj.tamano,
    contenido: this.selectedModalidadObj.contenido,
    sucursal: this.selectedTienda || ''
  };

  // ✅ Crear copia del producto con TODA LA INFORMACIÓN
  const productWithModalidad = {
    id: this.selectedProduct.id,
    nombre: this.selectedProduct.nombre,
    precio: this.selectedModalidadObj.precio,
    descripcion: this.selectedProduct.descripcion,
    imagen: this.selectedProduct.imagen,
    
    // ✅ CAMPOS COMPLETOS
    sku: this.selectedProduct.sku,
    categoria: this.selectedProduct.categoria,
    subcategoria: this.selectedProduct.subcategoria,
    marca: this.selectedProduct.marca,
    colores: this.selectedProduct.colores,
    tiendas: this.selectedProduct.tiendas,
    url: this.selectedProduct.url,
    
    // Modalidad seleccionada
    modalidadSeleccionada
  };

  console.log('🛒 Agregando al carrito:', {
    producto: productWithModalidad.nombre,
    marca: productWithModalidad.marca,
    sku: productWithModalidad.sku,
    categoria: productWithModalidad.categoria,
    modalidad: modalidadSeleccionada,
    opciones: options,
    cantidad: this.quantity
  });

  // ✅ Agregar el producto al carrito (solo una vez con la cantidad especificada)
  for (let i = 0; i < this.quantity; i++) {
    this.cartService.addToCart(productWithModalidad, options);
  }

  // Mensaje de confirmación
  this.showToast(`${this.quantity} x ${this.selectedProduct.nombre} agregado(s) al carrito`, 'success');

  // Cerrar modal
  this.closeModal();
}


  addToCart(product: Producto) {
    console.log('🛒 Agregando al carrito:', product.nombre);
    this.cartService.addToCart(product);
    this.showToast(`✅ ${product.nombre} agregado al carrito`, 'success');
  }

  goToCart() {
    console.log('🛒 Navegando al carrito...');
    this.router.navigate(['/carrito']);
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}
