// ==========================================
// 📄 biodegradables.page.ts - PÁGINA DE BIODEGRADABLES
// ==========================================

import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
  linkOutline,
  barcodeOutline,
  refreshOutline,
  chevronDownOutline,
  // Iconos para especificaciones
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
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProductosService, Producto } from '../services/productos.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-biodegradables',
  templateUrl: './biodegradables.page.html',
  styleUrls: ['./biodegradables.page.scss'],
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
export class BiodegradablesPage implements OnInit, AfterViewInit {
  products: Producto[] = [];
  loading = true;
  cartCount = 0;
  
  // Para el modal de detalles
  isModalOpen = false;
  selectedProduct: Producto | null = null;
  quantity = 1;
  saleType: 'mayoreo' | 'menudeo' = 'menudeo';
  
  // Selectores
  selectedTamano: string = '';
  selectedCantidad: number | string = '';
  selectedTienda: string = '';
  selectedModalidad: string = '';
  selectedModalidadObj: any = null;

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    // Registrar todos los iconos
    addIcons({ 
      documentTextOutline,
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
      linkOutline,
      barcodeOutline,
      refreshOutline,
      chevronDownOutline,
      informationCircleOutline,
      albumsOutline,
      colorPaletteOutline,
      resizeOutline,
      checkmarkCircleOutline,
      leafOutline,
      radioOutline,
      snowOutline,
      bulbOutline,
      layersOutline
    });
  }

  ngOnInit() {
    console.log('✅ Página de Biodegradables inicializada');
    this.loadProducts();
    
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((element) => {
      observer.observe(element);
    });
  }

  loadProducts() {
    console.log('📄 Iniciando carga de productos biodegradables...');
    this.loading = true;
    this.products = [];
    
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Timeout de carga alcanzado');
      this.loading = false;
      this.cdr.detectChanges();
      this.showToast('La carga está tardando más de lo esperado. Verifica tu conexión.', 'warning');
    }, 10000);
    
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        clearTimeout(timeoutId);
        console.log('✅ Productos recibidos del servicio:', productos.length);
        
        // ⭐ FILTRAR PRODUCTOS BIODEGRADABLES
        // Opción 1: Por categoría
        this.products = productos.filter(p => 
          p.categoria?.toLowerCase() === 'biodegradables' || 
          p.categoria?.toLowerCase() === 'biodegradable'
        );

        // Opción 2: Si no hay categoría, filtrar por el campo biodegradable
        if (this.products.length === 0) {
          this.products = productos.filter(p => p.biodegradable === true);
        }
        
        console.log('🌱 Productos biodegradables filtrados:', this.products.length);
        this.loading = false;
        this.cdr.detectChanges();
        
        if (this.products.length === 0) {
          this.showToast('No se encontraron productos biodegradables disponibles.', 'warning');
        }
      },
      error: (error) => {
        clearTimeout(timeoutId);
        console.error('❌ Error cargando productos:', error);
        this.loading = false;
        this.products = [];
        this.cdr.detectChanges();
        this.showToast('Error al cargar productos. Por favor, intenta de nuevo.', 'danger');
      },
      complete: () => {
        clearTimeout(timeoutId);
        console.log('🏁 Carga de productos biodegradables completada');
      }
    });
  }

  trackByProductId(index: number, product: Producto): number {
    return index;
  }

  viewProduct(product: Producto) {
    console.log('👁️ Ver detalles del producto:', product.nombre);
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

  selectSaleType(type: 'mayoreo' | 'menudeo') {
    this.saleType = type;
    console.log('🏪 Tipo de venta seleccionado:', type);
  }

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

  getTotal(): number {
    return this.getCurrentPrice() * this.quantity;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

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
      id: this.selectedProduct.id,
      nombre: this.selectedProduct.nombre,
      precio: this.selectedModalidadObj.precio,
      descripcion: this.selectedProduct.descripcion,
      imagen: this.selectedProduct.imagen,
      sku: this.selectedProduct.sku,
      categoria: this.selectedProduct.categoria,
      subcategoria: this.selectedProduct.subcategoria,
      marca: this.selectedProduct.marca,
      colores: this.selectedProduct.colores,
      tiendas: this.selectedProduct.tiendas,
      url: this.selectedProduct.url,
      material: this.selectedProduct.material,
      color: this.selectedProduct.color,
      medida: this.selectedProduct.medida,
      cantidadPaquete: this.selectedProduct.cantidadPaquete,
      biodegradable: this.selectedProduct.biodegradable,
      aptoMicroondas: this.selectedProduct.aptoMicroondas,
      aptoCongelador: this.selectedProduct.aptoCongelador,
      usosRecomendados: this.selectedProduct.usosRecomendados,
      modalidadSeleccionada
    };

    console.log('🛒 Agregando producto biodegradable al carrito:', {
      producto: productWithModalidad.nombre,
      marca: productWithModalidad.marca,
      biodegradable: productWithModalidad.biodegradable,
      modalidad: modalidadSeleccionada,
      cantidad: this.quantity
    });

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(productWithModalidad, options);
    }

    this.showToast(`${this.quantity} x ${this.selectedProduct.nombre} agregado(s) al carrito`, 'success');
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