import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import emailjs from '@emailjs/browser';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
  setDoc
} from '@angular/fire/firestore';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import {
  shieldCheckmarkOutline,
  cubeOutline,
  cashOutline,
  documentTextOutline,
  imageOutline,
  saveOutline,
  createOutline,
  trashOutline,
  logOutOutline,
  personOutline,
  pricetagOutline,
  constructOutline,
  mailOutline,
  checkmarkOutline,
  closeOutline,
  keyOutline,
  lockClosedOutline,
  peopleOutline,
  newspaperOutline,
  addCircleOutline,
  mailOpenOutline,
  informationCircleOutline,
  cloudUploadOutline,
  eyeOutline,
  searchOutline,
  filterOutline,
  refreshOutline,
  closeCircleOutline,
  folderOutline,
  ribbonOutline,
  closeCircle,
  sendOutline,
  listOutline,
  trashBinOutline,
  calendarOutline,
  textOutline,
  bulbOutline,
  checkmarkCircleOutline,
  warningOutline,
  resizeOutline,
  layersOutline,
  storefrontOutline,
  barcodeOutline,
  cartOutline,
  colorPaletteOutline,
  personAddOutline,
  downloadOutline,
  documentOutline,
  shieldOutline,
  personCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HeaderComponent, FooterComponent],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  // =============================
  // 🎯 TABS
  // =============================
  
  tabActiva: string = 'productos';

  // =============================
  // 🔦 MAPEO DE SUBCATEGORÍAS
  // =============================
  private subcategoriasMap: { [key: string]: string[] } = {
    'Desechables': ['Vasos', 'Platos', 'Charolas', 'Envases', 'Cubiertos', 'Tapas', 'Cono de Papel', 'Moldes', 'Popotes', 'Contenedores'],
    'Biodegradables': ['Vasos', 'Platos', 'Contenedores', 'Bandejas', 'Palillos', 'Servilletas'],
    'Bolsas': ['Bolsas Pequeñas', 'Bolsas Medianas', 'Bolsas Grandes', 'Bolsas con Asas', 'Bolsas Herméticas'],
    'Cocina y Repostería': ['Moldes', 'Cortadores', 'Papel Pergamino', 'Papel Aluminio', 'Decoraciones'],
    'Alimentos': ['Bebidas', 'Snacks', 'Postres', 'Salsas', 'Condimentos'],
    'Higiénicos y Servilletas': ['Servilletas', 'Pañuelos', 'Toallas de Papel', 'Papel Higiénico', 'Toallitas Desinfectantes']
  };

  // ========== PRODUCTOS ==========
  producto: any = {
    id: '',
    sku: '',
    nombre: '',
    categoria: '',
    subcategoria: '',
    marca: '',
    descripcion: '',
    imagen: '',
    colores: [],
    tiendas: [],
    modalidades: []
  };

  productos: any[] = [];
  productosFiltrados: any[] = [];
  filtroNombre: string = '';
  filtroSku: string = '';
  filtroMarca: string = '';
  filtroCategoria: string = '';
  filtroSubcategoria: string = '';
  subcategorias: string[] = [];
  subcategoriasFiltro: string[] = [];
  
  // Variables temporales para productos
  nuevoColor: string = '';
  nuevaTienda: string = '';
  
  // Variables para agregar modalidades
  modalidadSeleccionada: string = ''; // 'Mayoreo', 'Menudeo' o 'Ambas'
  precioActual: number = 0;
  tamanoActual: string = '';
  contenidoActual: string = '';

  modoEdicion: boolean = false;
  idEditando: string = '';
  mostrarModalProducto: boolean = false;
  mostrarModalBusqueda: boolean = false;

// =============================
// 👥 USUARIOS - NUEVAS PROPIEDADES
// =============================
usuarios: any[] = [];
usuariosFiltrados: any[] = [];
usuarioEditando: any = {
  nombre: '',
  email: '',
  rol: 'usuario',
  password: ''
};
usuarioEditandoId: string = '';
mostrarModalUsuario: boolean = false;
mostrarModalAgregarUsuario: boolean = false;
mostrarModalBusquedaUsuarios: boolean = false;

// Filtros de usuarios
filtroNombreUsuario: string = '';
filtroEmailUsuario: string = '';
filtroRolUsuario: string = '';

// Estadísticas
get totalUsuarios(): number {
  return this.usuarios.length;
}

get totalAdmins(): number {
  return this.usuarios.filter(u => u.rol === 'admin').length;
}

get totalUsuariosRegulares(): number {
  return this.usuarios.filter(u => u.rol === 'usuario').length;
}

  // =============================
  // 📧 MENSAJES DE CONTACTO
  // =============================
  mensajes: any[] = [];

  // =============================
  // 📰 NEWSLETTER
  // =============================
  suscriptores: any[] = [];
  suscriptoresFiltrados: any[] = [];
  mostrarModalEnviarNewsletter: boolean = false;
  mostrarModalEliminarSuscriptor: boolean = false;
  suscriptorAEliminarId: string = '';
  asuntoNewsletter: string = '';
  mensajeNewsletter: string = '';
  enviandoNewsletter: boolean = false;
  filtroEmailNewsletter: string = '';
  suscriptoresSeleccionados: Set<string> = new Set();
  seleccionarTodos: boolean = false;

  // =============================
  // 🔧 SERVICIOS
  // =============================
  firestore = inject(Firestore);
  authService = inject(AuthService);
  router = inject(Router);
  toastCtrl = inject(ToastController);
  alertCtrl = inject(AlertController);
  cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({
      shieldCheckmarkOutline,
      cubeOutline,
      cashOutline,
      documentTextOutline,
      imageOutline,
      saveOutline,
      createOutline,
      trashOutline,
      logOutOutline,
      personOutline,
      pricetagOutline,
      constructOutline,
      mailOutline,
      checkmarkOutline,
      closeOutline,
      keyOutline,
      lockClosedOutline,
      peopleOutline,
      newspaperOutline,
      addCircleOutline,
      mailOpenOutline,
      informationCircleOutline,
      cloudUploadOutline,
      eyeOutline,
      searchOutline,
      filterOutline,
      refreshOutline,
      closeCircleOutline,
      folderOutline,
      ribbonOutline,
      closeCircle,
      sendOutline,
      listOutline,
      trashBinOutline,
      calendarOutline,
      textOutline,
      bulbOutline,
      checkmarkCircleOutline,
      warningOutline,
      resizeOutline,
      layersOutline,
      storefrontOutline,
      barcodeOutline,
      cartOutline,
      colorPaletteOutline,
      personAddOutline,
      downloadOutline,
      documentOutline,
      shieldOutline,
      personCircleOutline,
    });

    emailjs.init({
      publicKey: 'eSh72EoK4k2SontZF',
    });

    this.obtenerProductos();
    this.obtenerUsuarios();
    this.obtenerMensajes();
    this.obtenerSuscriptores();
  }

  // =============================
  // 🎯 NAVEGACIÓN TABS
  // =============================
  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  // =============================
  // 💬 TOAST GENERAL
  // =============================
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  // =============================
  // 🧾 PRODUCTOS
  // =============================

  tieneModalidad(producto: any, modalidad: string): boolean {
    if (!producto.modalidades || !Array.isArray(producto.modalidades)) {
      return false;
    }
    return producto.modalidades.some((m: any) => m.modalidad === modalidad);
  }

  getModalidadesDisponibles(producto: any): string[] {
    if (!producto.modalidades || !Array.isArray(producto.modalidades)) {
      return [];
    }
    const modalidades: string[] = producto.modalidades.map((m: any) => m.modalidad);
    return Array.from(new Set(modalidades)); // Eliminar duplicados
}
  
  obtenerProductos() {
    const ref = collection(this.firestore, 'productos');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.productos = data;
      this.aplicarFiltrosInternos();
    });
  }


  onCategoriaChange() {
    const categoria = this.producto.categoria;
    if (categoria && this.subcategoriasMap[categoria]) {
      this.subcategorias = this.subcategoriasMap[categoria];
      this.producto.subcategoria = '';
    } else {
      this.subcategorias = [];
      this.producto.subcategoria = '';
    }
    this.cdr.detectChanges();
  }

  // =============================
  // 🎯 MÉTODOS PARA MODALIDADES
  // =============================

limpiarModalidadSeleccionada() {
  this.modalidadSeleccionada = '';
  this.precioActual = 0;
  this.tamanoActual = '';
  this.contenidoActual = '';
  this.cdr.detectChanges();
}

  agregarOpcionModalidad() {
    const precio = this.precioActual;
    const tamano = this.tamanoActual.trim();
    const contenido = this.contenidoActual.trim();

    if (!this.modalidadSeleccionada) {
      this.mostrarToast('⚠️ Selecciona una modalidad (Mayoreo o Menudeo)', 'warning');
      return;
    }

    if (precio <= 0) {
      this.mostrarToast('⚠️ El precio debe ser mayor a 0', 'warning');
      return;
    }

    if (!tamano) {
      this.mostrarToast('⚠️ Ingresa un tamaño válido', 'warning');
      return;
    }

    if (!contenido) {
      this.mostrarToast('⚠️ Ingresa un contenido válido', 'warning');
      return;
    }

    const opcion = {
      id: Date.now().toString(),
      modalidad: this.modalidadSeleccionada,
      precio: precio,
      tamano: tamano,
      contenido: contenido
    };

    if (!Array.isArray(this.producto.modalidades)) {
      this.producto.modalidades = [];
    }

    this.producto.modalidades.push(opcion);

    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';

    this.mostrarToast('✅ Opción de ' + this.modalidadSeleccionada + ' agregada', 'success');
    this.cdr.detectChanges();
  }

  eliminarOpcionModalidad(id: string) {
    this.producto.modalidades = this.producto.modalidades.filter((m: any) => m.id !== id);
    this.mostrarToast('🗑️ Opción eliminada', 'danger');
    this.cdr.detectChanges();
  }

  obtenerOpcionesModalidad(modalidad: string): any[] {
    if (!Array.isArray(this.producto.modalidades)) {
      return [];
    }
    return this.producto.modalidades.filter((m: any) => m.modalidad === modalidad);
  }

  tieneOpcionesValidas(): boolean {
    return Array.isArray(this.producto.modalidades) && this.producto.modalidades.length > 0;
  }

  async guardarProducto() {
    try {
      if (!this.producto.nombre || !this.producto.nombre.trim()) {
        await this.mostrarToast('⚠️ El nombre del producto es requerido', 'warning');
        return;
      }

      if (!this.tieneOpcionesValidas()) {
        await this.mostrarToast('⚠️ Debes agregar al menos una opción de Mayoreo o Menudeo', 'warning');
        return;
      }

      const productoAGuardar = {
        ...this.producto,
        colores: Array.isArray(this.producto.colores) ? this.producto.colores : [],
        tiendas: Array.isArray(this.producto.tiendas) ? this.producto.tiendas : [],
        modalidades: Array.isArray(this.producto.modalidades) ? this.producto.modalidades : []
      };

      if (this.modoEdicion && this.idEditando) {
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        const { id, ...productoSinId } = productoAGuardar;
        await updateDoc(docRef, productoSinId);
        await this.mostrarToast('✅ Producto actualizado correctamente');
      } else {
        const ref = collection(this.firestore, 'productos');
        await addDoc(ref, productoAGuardar);
        await this.mostrarToast('✅ Producto agregado correctamente');
      }
      
      this.cerrarModalProducto();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      await this.mostrarToast('❌ Error al guardar el producto', 'danger');
    }
  }

  editarProducto(producto: any) {
    this.mostrarModalProducto = false;
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      colores: [],
      tiendas: [],
      modalidades: []
    };
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.modoEdicion = true;
      this.idEditando = producto.id;
      
      this.producto = {
        id: producto.id || '',
        sku: producto.sku || '',
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        subcategoria: producto.subcategoria || '',
        marca: producto.marca || '',
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || '',
        colores: Array.isArray(producto.colores) ? [...producto.colores] : [],
        tiendas: Array.isArray(producto.tiendas) ? [...producto.tiendas] : [],
        modalidades: Array.isArray(producto.modalidades) ? JSON.parse(JSON.stringify(producto.modalidades)) : []
      };

      if (this.producto.categoria && this.subcategoriasMap[this.producto.categoria]) {
        this.subcategorias = this.subcategoriasMap[this.producto.categoria];
      }

      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  abrirModalProducto() {
    this.mostrarModalProducto = false;
    
    this.modoEdicion = false;
    this.idEditando = '';
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      colores: [],
      tiendas: [],
      modalidades: []
    };

    this.subcategorias = [];
    this.nuevoColor = '';
    this.nuevaTienda = '';
    this.modalidadSeleccionada = '';
    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  cerrarModalProducto() {
    this.mostrarModalProducto = false;
    
    this.modoEdicion = false;
    this.idEditando = '';
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      colores: [],
      tiendas: [],
      modalidades: []
    };

    this.subcategorias = [];
    this.nuevoColor = '';
    this.nuevaTienda = '';
    this.modalidadSeleccionada = '';
    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';
    
    this.cdr.detectChanges();
  }

  async eliminarProducto(id: string) {
    try {
      const docRef = doc(this.firestore, `productos/${id}`);
      await deleteDoc(docRef);
      await this.mostrarToast('🗑️ Producto eliminado correctamente', 'danger');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      await this.mostrarToast('❌ Error al eliminar el producto', 'danger');
    }
  }

  actualizarPreview() {}

  onImageError() {
    console.error('Error cargando imagen');
  }

  // =============================
  // 🎨 MÉTODOS PARA COLORES
  // =============================
  
  getColorValue(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'Rojo': '#dc3545',
      'Azul': '#0d6efd',
      'Verde': '#198754',
      'Amarillo': '#ffc107',
      'Negro': '#212529',
      'Blanco': '#ffffff',
      'Gris': '#6c757d',
      'Rosa': '#ed1370',
      'Naranja': '#fd7e14',
      'Morado': '#6f42c1',
      'Marrón': '#8b5a3c',
      'Turquesa': '#20c997',
      'Cian': '#0dcaf0',
      'Indigo': '#4610f2',
      'Plateado': '#c0c0c0',
      'Dorado': '#ffd700'
    };
    return colorMap[colorName] || '#cccccc';
  }

  agregarColor() {
    const color = this.nuevoColor.trim();
    if (!color) {
      this.mostrarToast('⚠️ Ingresa un color válido', 'warning');
      return;
    }
    if (this.producto.colores.includes(color)) {
      this.mostrarToast('⚠️ Este color ya existe', 'warning');
      return;
    }
    if (!Array.isArray(this.producto.colores)) {
      this.producto.colores = [];
    }
    this.producto.colores.push(color);
    this.nuevoColor = '';
  }

  eliminarColor(index: number) {
    if (Array.isArray(this.producto.colores) && index >= 0 && index < this.producto.colores.length) {
      this.producto.colores.splice(index, 1);
    }
  }

  agregarTienda() {
    const tienda = this.nuevaTienda.trim();
    if (!tienda) {
      this.mostrarToast('⚠️ Ingresa un nombre de tienda válido', 'warning');
      return;
    }
    if (this.producto.tiendas.includes(tienda)) {
      this.mostrarToast('⚠️ Esta tienda ya existe', 'warning');
      return;
    }
    if (!Array.isArray(this.producto.tiendas)) {
      this.producto.tiendas = [];
    }
    this.producto.tiendas.push(tienda);
    this.nuevaTienda = '';
  }

  eliminarTienda(index: number) {
    if (Array.isArray(this.producto.tiendas) && index >= 0 && index < this.producto.tiendas.length) {
      this.producto.tiendas.splice(index, 1);
    }
  }

  // =============================
// 🔍 BÚSQUEDA Y FILTROS
// =============================

onFiltroCategoriaChange() {
  const categoria = this.filtroCategoria;
  if (categoria && this.subcategoriasMap[categoria]) {
    this.subcategoriasFiltro = this.subcategoriasMap[categoria];
    this.filtroSubcategoria = '';
  } else {
    this.subcategoriasFiltro = [];
    this.filtroSubcategoria = '';
  }
  this.cdr.detectChanges();
}

abrirModalBusqueda() {
  setTimeout(() => {
    this.mostrarModalBusqueda = true;
    this.cdr.detectChanges();
  }, 0);
}

cerrarModalBusqueda() {
  this.mostrarModalBusqueda = false;
  this.cdr.detectChanges();
}

aplicarFiltros() {
  const filtroNombre = (this.filtroNombre || '').trim().toLowerCase();
  const filtroSku = (this.filtroSku || '').trim().toLowerCase();
  const filtroMarca = (this.filtroMarca || '').trim().toLowerCase();
  const filtroCategoria = (this.filtroCategoria || '').trim().toLowerCase();
  const filtroSubcategoria = (this.filtroSubcategoria || '').trim().toLowerCase();

  this.productosFiltrados = this.productos.filter((producto) => {
    const nombre = (producto.nombre || '').toLowerCase();
    const sku = (producto.sku || '').toLowerCase();
    const marca = (producto.marca || '').toLowerCase();
    const categoria = (producto.categoria || '').toLowerCase();
    const subcategoria = (producto.subcategoria || '').toLowerCase();

    const coincideNombre = filtroNombre ? nombre.includes(filtroNombre) : true;
    const coincideSku = filtroSku ? sku.includes(filtroSku) : true;
    const coincideMarca = filtroMarca ? marca.includes(filtroMarca) : true;
    const coincideCategoria = filtroCategoria ? categoria.includes(filtroCategoria) : true;
    const coincideSubcategoria = filtroSubcategoria ? subcategoria.includes(filtroSubcategoria) : true;

    return coincideNombre && coincideSku && coincideMarca && coincideCategoria && coincideSubcategoria;
  });

  this.cerrarModalBusqueda();
}

aplicarFiltrosInternos() {
  const filtroNombre = (this.filtroNombre || '').trim().toLowerCase();
  const filtroSku = (this.filtroSku || '').trim().toLowerCase();
  const filtroMarca = (this.filtroMarca || '').trim().toLowerCase();
  const filtroCategoria = (this.filtroCategoria || '').trim().toLowerCase();
  const filtroSubcategoria = (this.filtroSubcategoria || '').trim().toLowerCase();

  if (!filtroNombre && !filtroSku && !filtroMarca && !filtroCategoria && !filtroSubcategoria) {
    this.productosFiltrados = [...this.productos];
    return;
  }

  this.productosFiltrados = this.productos.filter((producto) => {
    const nombre = (producto.nombre || '').toLowerCase();
    const sku = (producto.sku || '').toLowerCase();
    const marca = (producto.marca || '').toLowerCase();
    const categoria = (producto.categoria || '').toLowerCase();
    const subcategoria = (producto.subcategoria || '').toLowerCase();

    const coincideNombre = filtroNombre ? nombre.includes(filtroNombre) : true;
    const coincideSku = filtroSku ? sku.includes(filtroSku) : true;
    const coincideMarca = filtroMarca ? marca.includes(filtroMarca) : true;
    const coincideCategoria = filtroCategoria ? categoria.includes(filtroCategoria) : true;
    const coincideSubcategoria = filtroSubcategoria ? subcategoria.includes(filtroSubcategoria) : true;

    return coincideNombre && coincideSku && coincideMarca && coincideCategoria && coincideSubcategoria;
  });
}

limpiarFiltroNombre() {
  this.filtroNombre = '';
  this.aplicarFiltrosInternos();
}

limpiarFiltroSku() {
  this.filtroSku = '';
  this.aplicarFiltrosInternos();
}

limpiarFiltroMarca() {
  this.filtroMarca = '';
  this.aplicarFiltrosInternos();
}

limpiarFiltroCategoria() {
  this.filtroCategoria = '';
  this.filtroSubcategoria = '';
  this.subcategoriasFiltro = [];
  this.aplicarFiltrosInternos();
}

limpiarFiltroSubcategoria() {
  this.filtroSubcategoria = '';
  this.aplicarFiltrosInternos();
}

limpiarTodosFiltros() {
  this.filtroNombre = '';
  this.filtroSku = '';
  this.filtroMarca = '';
  this.filtroCategoria = '';
  this.filtroSubcategoria = '';
  this.subcategoriasFiltro = [];
  this.aplicarFiltrosInternos();
}

// =============================
// 👥 MÉTODOS DE USUARIOS
// =============================

obtenerUsuarios() {
  const ref = collection(this.firestore, 'usuarios');
  collectionData(ref, { idField: 'id' }).subscribe((data) => {
    this.usuarios = data;
    this.aplicarFiltrosUsuarios();
  });
}

aplicarFiltrosUsuarios() {
  const filtroNombre = (this.filtroNombreUsuario || '').trim().toLowerCase();
  const filtroEmail = (this.filtroEmailUsuario || '').trim().toLowerCase();
  const filtroRol = (this.filtroRolUsuario || '').trim().toLowerCase();

  if (!filtroNombre && !filtroEmail && !filtroRol) {
    this.usuariosFiltrados = [...this.usuarios];
    return;
  }

  this.usuariosFiltrados = this.usuarios.filter((usuario) => {
    const nombre = (usuario.nombre || '').toLowerCase();
    const email = (usuario.email || '').toLowerCase();
    const rol = (usuario.rol || 'usuario').toLowerCase();

    const coincideNombre = filtroNombre ? nombre.includes(filtroNombre) : true;
    const coincideEmail = filtroEmail ? email.includes(filtroEmail) : true;
    const coincideRol = filtroRol ? rol === filtroRol : true;

    return coincideNombre && coincideEmail && coincideRol;
  });
}

limpiarFiltrosUsuarios() {
  this.filtroNombreUsuario = '';
  this.filtroEmailUsuario = '';
  this.filtroRolUsuario = '';
  this.aplicarFiltrosUsuarios();
}

abrirModalBusquedaUsuarios() {
  setTimeout(() => {
    this.mostrarModalBusquedaUsuarios = true;
    this.cdr.detectChanges();
  }, 0);
}

cerrarModalBusquedaUsuarios() {
  this.mostrarModalBusquedaUsuarios = false;
  this.cdr.detectChanges();
}

aplicarFiltrosUsuariosDesdeModal() {
  this.aplicarFiltrosUsuarios();
  this.cerrarModalBusquedaUsuarios();
}

// Modal Agregar Usuario
abrirModalAgregarUsuario() {
  // Limpiar completamente el objeto
  this.usuarioEditando = {
    nombre: '',
    email: '',
    rol: 'usuario',
    password: ''
  };
  
  // Forzar detección de cambios antes de abrir
  this.cdr.detectChanges();
  
  // Abrir modal después de un pequeño delay
  setTimeout(() => {
    this.mostrarModalAgregarUsuario = true;
    this.cdr.detectChanges();
  }, 50);
}

cerrarModalAgregarUsuario() {
  this.mostrarModalAgregarUsuario = false;
  this.usuarioEditando = {
    nombre: '',
    email: '',
    rol: 'usuario',
    password: ''
  };
  this.cdr.detectChanges();
}

async agregarUsuario() {
  try {
    if (!this.usuarioEditando.nombre || !this.usuarioEditando.nombre.trim()) {
      await this.mostrarToast('⚠️ El nombre es requerido', 'warning');
      return;
    }

    if (!this.usuarioEditando.email || !this.usuarioEditando.email.includes('@')) {
      await this.mostrarToast('⚠️ Email inválido', 'warning');
      return;
    }

    if (!this.usuarioEditando.password || this.usuarioEditando.password.length < 6) {
      await this.mostrarToast('⚠️ La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    // Verificar si el email ya existe
    const emailExiste = this.usuarios.some(u => u.email === this.usuarioEditando.email);
    if (emailExiste) {
      await this.mostrarToast('⚠️ Este email ya está registrado', 'warning');
      return;
    }

    const nuevoUsuario = {
      nombre: this.usuarioEditando.nombre,
      email: this.usuarioEditando.email,
      rol: this.usuarioEditando.rol || 'usuario',
      password: this.usuarioEditando.password,
      fechaCreacion: new Date().toISOString()
    };

    const ref = collection(this.firestore, 'usuarios');
    await addDoc(ref, nuevoUsuario);
    
    await this.mostrarToast('✅ Usuario agregado correctamente');
    this.cerrarModalAgregarUsuario();
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    await this.mostrarToast('❌ Error al agregar el usuario', 'danger');
  }
}

// Modal Editar Usuario
editarUsuario(usuario: any) {
  this.mostrarModalUsuario = false;
  
  this.usuarioEditandoId = '';
  this.usuarioEditando = {
    nombre: '',
    email: '',
    rol: 'usuario'
  };
  
  this.cdr.detectChanges();
  
  setTimeout(() => {
    this.usuarioEditandoId = usuario.id;
    
    this.usuarioEditando = { 
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      rol: usuario.rol || 'usuario'
    };
    
    this.mostrarModalUsuario = true;
    this.cdr.detectChanges();
  }, 150);
}

cerrarModalUsuario() {
  this.mostrarModalUsuario = false;
  this.cdr.detectChanges();
  
  setTimeout(() => {
    this.usuarioEditandoId = '';
    this.usuarioEditando = {
      nombre: '',
      email: '',
      rol: 'usuario'
    };
    this.cdr.detectChanges();
  }, 100);
}

async guardarUsuarioEditado(id: string) {
  try {
    if (!this.usuarioEditando || !this.usuarioEditando.email) {
      await this.mostrarToast('❌ No hay datos para guardar', 'danger');
      return;
    }

    if (!this.usuarioEditando.email.includes('@')) {
      await this.mostrarToast('⚠️ Por favor ingresa un email válido', 'warning');
      return;
    }

    const docRef = doc(this.firestore, `usuarios/${id}`);
    const datosActualizar = {
      nombre: this.usuarioEditando.nombre || '',
      email: this.usuarioEditando.email || '',
      rol: this.usuarioEditando.rol || 'usuario',
    };

    await updateDoc(docRef, datosActualizar);
    
    await this.mostrarToast('✅ Usuario actualizado correctamente');
    this.cerrarModalUsuario();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    await this.mostrarToast('❌ Error al actualizar el usuario', 'danger');
  }
}

// Cambiar rol directamente
async cambiarRolUsuario(usuarioId: string, nuevoRol: string) {
  try {
    const docRef = doc(this.firestore, `usuarios/${usuarioId}`);
    await updateDoc(docRef, { rol: nuevoRol });
    await this.mostrarToast(`✅ Rol actualizado a ${nuevoRol}`, 'success');
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    await this.mostrarToast('❌ Error al cambiar el rol', 'danger');
  }
}

async eliminarUsuario(id: string) {
  try {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    await deleteDoc(docRef);
    await this.mostrarToast('🗑️ Usuario eliminado correctamente', 'danger');
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    await this.mostrarToast('❌ Error al eliminar el usuario', 'danger');
  }
}

// Exportar a CSV
exportarUsuariosCSV() {
  if (this.usuariosFiltrados.length === 0) {
    this.mostrarToast('⚠️ No hay usuarios para exportar', 'warning');
    return;
  }

  const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Fecha Creación'];
  const rows = this.usuariosFiltrados.map(u => [
    u.id,
    u.nombre || 'Sin nombre',
    u.email,
    u.rol || 'usuario',
    u.fechaCreacion || 'N/A'
  ]);

  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `usuarios_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  this.mostrarToast('✅ Usuarios exportados correctamente', 'success');
}




  // =============================
  // 📧 MENSAJES DE CONTACTO
  // =============================

  obtenerMensajes() {
    const ref = collection(this.firestore, 'contactMessages');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.mensajes = data.sort((a: any, b: any) => {
        if (b.date && a.date) {
          return b.date.localeCompare(a.date);
        }
        return 0;
      });
    });
  }

  async eliminarMensaje(id: string) {
    try {
      const docRef = doc(this.firestore, `contactMessages/${id}`);
      await deleteDoc(docRef);
      await this.mostrarToast('🗑️ Mensaje eliminado correctamente', 'danger');
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
      await this.mostrarToast('❌ Error al eliminar el mensaje', 'danger');
    }
  }

  responderMensaje(email: string, mensajeOriginal: string) {
    if (!email || !email.includes('@')) {
      this.mostrarToast('❌ Correo inválido', 'danger');
      return;
    }

    const subject = encodeURIComponent('Respuesta a tu mensaje en Interventas');
    const body = encodeURIComponent(
      `Hola,\n\nGracias por contactarte con nosotros. A continuación te respondemos:\n\n\n---\nMensaje original:\n${mensajeOriginal}\n---`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    if (typeof window !== 'undefined') {
      window.open(gmailUrl, '_blank');
    }
  }

  // =============================
  // 📰 NEWSLETTER
  // =============================
  
  obtenerSuscriptores() {
    const ref = collection(this.firestore, 'newsletter');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.suscriptores = data.sort((a: any, b: any) => {
        if (b.fechaSuscripcion && a.fechaSuscripcion) {
          return b.fechaSuscripcion.localeCompare(a.fechaSuscripcion);
        }
        return 0;
      });
      this.aplicarFiltroNewsletter();
    });
  }

  aplicarFiltroNewsletter() {
    const filtro = this.filtroEmailNewsletter.toLowerCase().trim();
    
    if (!filtro) {
      this.suscriptoresFiltrados = [...this.suscriptores];
    } else {
      this.suscriptoresFiltrados = this.suscriptores.filter(s => 
        s.email.toLowerCase().includes(filtro) || 
        s.nombre.toLowerCase().includes(filtro)
      );
    }
  }

  limpiarFiltroNewsletter() {
    this.filtroEmailNewsletter = '';
    this.aplicarFiltroNewsletter();
  }

  toggleSuscriptorSeleccion(suscriptorId: string) {
    if (this.suscriptoresSeleccionados.has(suscriptorId)) {
      this.suscriptoresSeleccionados.delete(suscriptorId);
    } else {
      this.suscriptoresSeleccionados.add(suscriptorId);
    }
    
    this.seleccionarTodos = this.suscriptoresSeleccionados.size === this.suscriptoresFiltrados.length;
  }

  toggleSeleccionarTodos() {
    this.seleccionarTodos = !this.seleccionarTodos;
    
    if (this.seleccionarTodos) {
      this.suscriptoresSeleccionados.clear();
      this.suscriptoresFiltrados.forEach(s => this.suscriptoresSeleccionados.add(s.id));
    } else {
      this.suscriptoresSeleccionados.clear();
    }
  }

  eliminarSuscriptor(id: string) {
    this.suscriptorAEliminarId = id;
    this.mostrarModalEliminarSuscriptor = true;
    this.cdr.detectChanges();
  }

  cerrarModalEliminarSuscriptor() {
    this.mostrarModalEliminarSuscriptor = false;
    this.suscriptorAEliminarId = '';
    this.cdr.detectChanges();
  }

  async confirmarEliminacionSuscriptor() {
    if (!this.suscriptorAEliminarId) {
      return;
    }

    try {
      const docRef = doc(this.firestore, `newsletter/${this.suscriptorAEliminarId}`);
      await deleteDoc(docRef);
      
      this.suscriptoresSeleccionados.delete(this.suscriptorAEliminarId);
      
      await this.mostrarToast('🗑️ Suscriptor eliminado correctamente', 'danger');
      this.cerrarModalEliminarSuscriptor();
      
    } catch (error) {
      console.error('Error eliminando suscriptor:', error);
      await this.mostrarToast('❌ Error al eliminar el suscriptor', 'danger');
      this.cerrarModalEliminarSuscriptor();
    }
  }

  abrirModalEnviarNewsletter() {
    if (this.suscriptores.length === 0) {
      this.mostrarToast('⚠️ No hay suscriptores registrados', 'warning');
      return;
    }

    if (this.suscriptoresSeleccionados.size === 0) {
      this.mostrarToast('⚠️ Selecciona al menos un suscriptor antes de continuar', 'warning');
      return;
    }

    this.asuntoNewsletter = '';
    this.mensajeNewsletter = '';
    this.mostrarModalEnviarNewsletter = true;
    this.cdr.detectChanges();
  }

  cerrarModalEnviarNewsletter() {
    this.mostrarModalEnviarNewsletter = false;
    
    this.asuntoNewsletter = '';
    this.mensajeNewsletter = '';
    
    this.cdr.detectChanges();
  }

  async enviarNewsletter() {
    if (!this.asuntoNewsletter.trim()) {
      await this.mostrarToast('⚠️ El asunto es requerido', 'warning');
      return;
    }

    if (!this.mensajeNewsletter.trim()) {
      await this.mostrarToast('⚠️ El mensaje es requerido', 'warning');
      return;
    }

    if (this.suscriptoresSeleccionados.size === 0) {
      await this.mostrarToast('⚠️ Selecciona al menos un suscriptor', 'warning');
      return;
    }

    await this.procesarEnvioNewsletter();
  }

  async procesarEnvioNewsletter() {
    this.enviandoNewsletter = true;

    try {
      let exitosos = 0;
      let fallidos = 0;

      const suscriptoresAEnviar = this.suscriptores.filter(s => 
        this.suscriptoresSeleccionados.has(s.id)
      );

      for (const suscriptor of suscriptoresAEnviar) {
        try {
          const templateParams = {
            to_name: suscriptor.nombre,
            to_email: suscriptor.email,
            from_name: 'Interventas',
            subject: this.asuntoNewsletter,
            message: this.mensajeNewsletter,
            unsubscribe_link: `https://tudominio.com/unsubscribe?id=${suscriptor.id}`
          };

          await emailjs.send(
            'service_i4xbqss',
            'template_vplptng',
            templateParams
          );

          exitosos++;
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Error enviando a ${suscriptor.email}:`, error);
          fallidos++;
        }
      }

      if (fallidos === 0) {
        await this.mostrarToast(`✅ Newsletter enviado a ${exitosos} suscriptor(es)`, 'success');
      } else {
        await this.mostrarToast(`⚠️ Enviados: ${exitosos} | Fallidos: ${fallidos}`, 'warning');
      }

      this.cerrarModalEnviarNewsletter();
      
    } catch (error) {
      console.error('Error en envío masivo:', error);
      await this.mostrarToast('❌ Error al enviar newsletter', 'danger');
    } finally {
      this.enviandoNewsletter = false;
    }
  }

  // =============================
  // 🚪 SESIÓN
  // =============================
  
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}