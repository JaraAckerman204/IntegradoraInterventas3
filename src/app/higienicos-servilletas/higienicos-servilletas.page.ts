// ==========================================
// 📄 higienicos-servilletas.page.ts
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
  // Iconos de especificaciones
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
  selector: 'app-higienicos-servilletas',
  templateUrl: './higienicos-servilletas.page.html',
  styleUrls: ['./higienicos-servilletas.page.scss'],
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
export class HigienicosServilletasPage implements OnInit, AfterViewInit {

  products: Producto[] = [];
  loading = true;
  cartCount = 0;

  // Modal
  isModalOpen = false;
  selectedProduct: Producto | null = null;
  quantity = 1;
  saleType: 'mayoreo' | 'menudeo' = 'menudeo';

  // Selectores
  selectedTamano = '';
  selectedCantidad: number | string = '';
  selectedTienda = '';
  selectedModalidad = '';
  selectedModalidadObj: any = null;


  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {

    // Registrar iconos
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
    console.log('🧻 Página de Higiénicos & Servilletas cargando...');
    this.loadProducts();

    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }


  // ==========================================================
  // 🚀 CARGAR PRODUCTOS SOLO DE HIGIÉNICOS & SERVILLETAS
  // ==========================================================

  loadProducts() {
    this.loading = true;
    this.products = [];

    const timeoutId = setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
      this.showToast('La carga está tardando demasiado, revisa tu conexión.', 'warning');
    }, 10000);

    this.productosService.getProductos().subscribe({
      next: (productos) => {
        clearTimeout(timeoutId);

        // ⭐ FILTRAR SOLO CATEGORÍAS RELACIONADAS
        this.products = productos.filter(p => {
  const cat = (p.categoria || '').toLowerCase().replace('í', 'i').trim();

  return cat.includes('higienico') || cat.includes('servilleta');
});


        console.log('🧻 Productos cargados (Higiénicos/Servilletas):', this.products.length);

        this.loading = false;
        this.cdr.detectChanges();

        if (this.products.length === 0) {
          this.showToast('No hay productos disponibles en esta categoría.', 'warning');
        }
      },

      error: (error) => {
        clearTimeout(timeoutId);
        console.error('❌ Error cargando productos:', error);
        this.loading = false;
        this.products = [];
        this.cdr.detectChanges();
        this.showToast('Error al cargar productos. Intenta de nuevo.', 'danger');
      },

      complete: () => {
        clearTimeout(timeoutId);
        console.log('🏁 Carga completada Higiénicos & Servilletas');
      }
    });
  }


  // ==========================================================
  // 🧼 MODAL — IGUAL AL DE DESECHABLES
  // ==========================================================

  trackByProductId(index: number, p: Producto) {
    return p.id ?? index;
  }

  viewProduct(product: Producto) {
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
  }

  selectSaleType(type: 'mayoreo' | 'menudeo') {
    this.saleType = type;
  }

  getCurrentPrice(): number {
    if (this.selectedModalidadObj) {
      return this.selectedModalidadObj.precio;
    }

    if (!this.selectedProduct) return 0;

    return this.saleType === 'mayoreo'
      ? this.selectedProduct.precio * 0.85
      : this.selectedProduct.precio;
  }

  getTotal(): number {
    return this.getCurrentPrice() * this.quantity;
  }

  incrementQuantity() { this.quantity++; }
  decrementQuantity() { if (this.quantity > 1) this.quantity--; }


  // ==========================================================
  // 🛒 AGREGAR AL CARRITO
  // ==========================================================

  addToCartFromModal() {
    if (!this.selectedProduct) return;

    if (!this.selectedModalidadObj) {
      this.showToast('Selecciona una modalidad.', 'warning');
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

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(productWithModalidad, options);
    }

    this.showToast(`${this.quantity} × ${this.selectedProduct.nombre} agregado al carrito`, 'success');
    this.closeModal();
  }

  addToCart(product: Producto) {
    this.cartService.addToCart(product);
    this.showToast(`${product.nombre} agregado al carrito`, 'success');
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }


  // ==========================================================
  // 🔔 TOAST
  // ==========================================================

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color
    });

    await toast.present();
  }
}
