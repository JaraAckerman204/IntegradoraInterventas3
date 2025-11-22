// ==========================================
// 📄 desechables.page.ts - PÁGINA DE DESECHABLES CON FILTROS Y TOAST SERVICE
// ==========================================

import { Component, OnInit, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
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
  documentTextOutline,
  chevronBackOutline,
  chevronForwardOutline,
  appsOutline,
  closeCircleOutline,
  chevronUpOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProductosService, Producto } from '../services/productos.service';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service'; // ✅ IMPORTAR TOAST SERVICE
import { Router } from '@angular/router';

@Component({
  selector: 'app-desechables',
  templateUrl: './desechables.page.html',
  styleUrls: ['./desechables.page.scss'],
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
export class DesechablesPage implements OnInit, AfterViewInit {
  // =============================
  // 🔧 SERVICIOS INYECTADOS
  // =============================
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService); // ✅ INYECTAR TOAST SERVICE
  private router = inject(Router);
  private modalController = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  // =============================
  // 📦 PRODUCTOS
  // =============================
  products: Producto[] = [];
  filteredProducts: Producto[] = [];
  paginatedProducts: Producto[] = [];
  loading = true;
  cartCount = 0;
  
  // =============================
  // 📄 PAGINACIÓN
  // =============================
  currentPage = 1;
  itemsPerPage = 18;
  totalPages = 1;
  Math = Math;
  
  // =============================
  // 🔍 FILTROS DISPONIBLES
  // =============================
  subcategorias: string[] = [];
  marcas: string[] = [];
  materiales: string[] = [];
  colores: string[] = [];
  
  // =============================
  // ✅ FILTROS SELECCIONADOS
  // =============================
  selectedFilters = {
    subcategorias: [] as string[],
    marcas: [] as string[],
    materiales: [] as string[],
    colores: [] as string[],
    caracteristicas: [] as string[]
  };

  // =============================
  // 🎯 CONTROL DE SECCIONES
  // =============================
  filterSectionsOpen = {
    subcategorias: true,
    marcas: false,
    materiales: false,
    colores: false,
    caracteristicas: false
  };
  
  // =============================
  // 🛍️ MODAL DE PRODUCTO
  // =============================
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

  constructor() {
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
      layersOutline,
      chevronBackOutline,
      chevronForwardOutline,
      appsOutline,
      closeCircleOutline,
      chevronUpOutline
    });
  }

  ngOnInit() {
    console.log('✅ Página de Desechables inicializada');
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

  // =============================
  // 💬 UTILIDAD - TOAST
  // =============================
  async mostrarToast(mensaje: string) {
    await this.toastService.show(mensaje);
  }

  // =============================
  // 📦 CARGA DE PRODUCTOS
  // =============================
  loadProducts() {
    console.log('🔄 Iniciando carga de productos desechables...');
    this.loading = true;
    this.products = [];

    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Timeout de carga alcanzado');
      this.loading = false;
      this.cdr.detectChanges();
      this.mostrarToast('⚠️ La carga está tardando más de lo esperado');
    }, 10000);

    this.productosService.getProductos().subscribe({
      next: (productos) => {
        clearTimeout(timeoutId);
        console.log('✅ Productos recibidos del servicio:', productos.length);
        
        // ⭐ FILTRAR SOLO PRODUCTOS DE LA CATEGORÍA "DESECHABLES"
        this.products = productos.filter(p => 
          p.categoria?.toLowerCase() === 'desechables' || 
          p.categoria?.toLowerCase() === 'desechable'
        );
        
        console.log('🥤 Productos desechables filtrados:', this.products.length);
        
        this.extractFilters();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
        
        if (this.products.length === 0) {
          this.mostrarToast('ℹ️ No se encontraron productos desechables disponibles');
        }
      },
      error: (error) => {
        clearTimeout(timeoutId);
        console.error('❌ Error cargando productos:', error);
        this.loading = false;
        this.products = [];
        this.cdr.detectChanges();
        this.mostrarToast('❌ Error al cargar productos. Por favor recarga la página');
      },
      complete: () => {
        clearTimeout(timeoutId);
        console.log('🏁 Carga de productos desechables completada');
      }
    });
  }

  // ==========================================
  // 🔍 MÉTODOS DE FILTROS
  // ==========================================
  toggleFilter(filterType: string, value: string) {
    console.log('🔄 Toggle filter:', filterType, value);
    
    switch(filterType) {
      case 'subcategoria':
        this.toggleArrayValue(this.selectedFilters.subcategorias, value);
        break;
      case 'marca':
        this.toggleArrayValue(this.selectedFilters.marcas, value);
        break;
      case 'material':
        this.toggleArrayValue(this.selectedFilters.materiales, value);
        break;
      case 'color':
        this.toggleArrayValue(this.selectedFilters.colores, value);
        break;
      case 'caracteristica':
        this.toggleArrayValue(this.selectedFilters.caracteristicas, value);
        break;
    }
    
    this.currentPage = 1; // Resetear a página 1
    this.applyFilters();
  }

  extractFilters() {
    // Extraer subcategorías únicas de productos desechables
    this.subcategorias = [...new Set(
      this.products
        .map(p => p.subcategoria)
        .filter((s): s is string => s !== undefined && s !== null && s.trim() !== '')
    )].sort();

    // Extraer marcas únicas
    this.marcas = [...new Set(
      this.products
        .map(p => p.marca)
        .filter((m): m is string => m !== undefined && m !== null && m.trim() !== '')
    )].sort();

    // Extraer materiales únicos
    this.materiales = [...new Set(
      this.products
        .map(p => p.material)
        .filter((m): m is string => m !== undefined && m !== null && m.trim() !== '')
    )].sort();

    // Extraer colores únicos
    this.colores = [...new Set(
      this.products
        .map(p => p.color)
        .filter((c): c is string => c !== undefined && c !== null && c.trim() !== '')
    )].sort();

    console.log('🎨 Filtros extraídos para desechables:', {
      subcategorias: this.subcategorias,
      marcas: this.marcas,
      materiales: this.materiales,
      colores: this.colores
    });
  }

  toggleFilterSection(section: string) {
    this.filterSectionsOpen[section as keyof typeof this.filterSectionsOpen] = 
      !this.filterSectionsOpen[section as keyof typeof this.filterSectionsOpen];
  }

  toggleArrayValue(array: string[], value: string) {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
  }

  applyFilters() {
    console.log('🔍 Aplicando filtros...', this.selectedFilters);
    
    this.filteredProducts = this.products.filter(product => {
      // Filtro por subcategoría
      if (this.selectedFilters.subcategorias.length > 0) {
        if (!product.subcategoria || !this.selectedFilters.subcategorias.includes(product.subcategoria)) {
          return false;
        }
      }
      
      // Filtro por marca
      if (this.selectedFilters.marcas.length > 0) {
        if (!product.marca || !this.selectedFilters.marcas.includes(product.marca)) {
          return false;
        }
      }
      
      // Filtro por material
      if (this.selectedFilters.materiales.length > 0) {
        if (!product.material || !this.selectedFilters.materiales.includes(product.material)) {
          return false;
        }
      }
      
      // Filtro por color
      if (this.selectedFilters.colores.length > 0) {
        if (!product.color || !this.selectedFilters.colores.includes(product.color)) {
          return false;
        }
      }
      
      // Filtro por características especiales
      if (this.selectedFilters.caracteristicas.length > 0) {
        for (const caracteristica of this.selectedFilters.caracteristicas) {
          if (caracteristica === 'biodegradable' && !product.biodegradable) return false;
          if (caracteristica === 'aptoMicroondas' && !product.aptoMicroondas) return false;
          if (caracteristica === 'aptoCongelador' && !product.aptoCongelador) return false;
        }
      }
      
      return true;
    });
    
    console.log('📊 Productos desechables filtrados:', this.filteredProducts.length);
    
    this.calculatePagination();
    this.updatePaginatedProducts();
  }

  clearFilters() {
    console.log('🧹 Limpiando filtros...');
    this.selectedFilters = {
      subcategorias: [],
      marcas: [],
      materiales: [],
      colores: [],
      caracteristicas: []
    };
    this.currentPage = 1;
    this.applyFilters();
    this.mostrarToast('🧹 Filtros eliminados');
  }

  hasActiveFilters(): boolean {
    return this.selectedFilters.subcategorias.length > 0 ||
           this.selectedFilters.marcas.length > 0 ||
           this.selectedFilters.materiales.length > 0 ||
           this.selectedFilters.colores.length > 0 ||
           this.selectedFilters.caracteristicas.length > 0;
  }

  // ==========================================
  // 📄 MÉTODOS DE PAGINACIÓN
  // ==========================================

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    console.log('📄 Total de páginas:', this.totalPages);
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    
    console.log('📄 Productos paginados:', {
      page: this.currentPage,
      startIndex,
      endIndex,
      count: this.paginatedProducts.length
    });
    
    // ⭐ Scroll hacia el inicio de la sección de productos
    setTimeout(() => {
      const productsContent = document.querySelector('.products-content');
      if (productsContent) {
        productsContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 200);
  }

  goToPage(page: number | string) {
    if (typeof page === 'string') return;
    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Máximo de números visibles
    
    if (this.totalPages <= maxVisible + 2) {
      // Mostrar todos los números
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar con puntos suspensivos
      pages.push(1);
      
      if (this.currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  // ==========================================
  // 🛒 MÉTODOS DE PRODUCTO Y CARRITO
  // ==========================================

  trackByProductId(index: number, product: Producto): string | number {
    return product.id ?? index;
  }

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
      this.mostrarToast('⚠️ Por favor selecciona una modalidad');
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

    console.log('🛒 Agregando desechable al carrito:', {
      producto: productWithModalidad.nombre,
      marca: productWithModalidad.marca,
      sku: productWithModalidad.sku,
      modalidad: modalidadSeleccionada,
      cantidad: this.quantity
    });

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(productWithModalidad, options);
    }

    const mensaje = this.quantity > 1 
      ? `✅ ${this.quantity} productos agregados al carrito` 
      : '✅ Producto agregado al carrito';
    
    this.mostrarToast(mensaje);
    this.closeModal();
  }

  addToCart(product: Producto) {
    console.log('🛒 Agregando al carrito:', product.nombre);
    this.cartService.addToCart(product);
    this.mostrarToast(`✅ ${product.nombre} agregado al carrito`);
  }

  goToCart() {
    console.log('🛒 Navegando al carrito...');
    this.router.navigate(['/carrito']);
  }
}