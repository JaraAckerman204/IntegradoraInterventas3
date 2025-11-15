import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import emailjs from '@emailjs/browser';
import { getDocs } from '@angular/fire/firestore';

import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

import { IonicModule, ToastController } from '@ionic/angular';
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
  albumsOutline,
  leafOutline,
  radioOutline,
  snowOutline,
  starOutline,
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
  // 🔧 SERVICIOS INYECTADOS
  // =============================
  firestore = inject(Firestore);
  storage = inject(Storage);
  authService = inject(AuthService);
  router = inject(Router);
  toastCtrl = inject(ToastController);
  cdr = inject(ChangeDetectorRef);

  // =============================
  // 🎯 CONTROL DE TABS
  // =============================
  tabActiva: string = 'productos';

  // =============================
  // 📦 PRODUCTOS - PROPIEDADES
  // =============================
  productos: any[] = [];
  productosFiltrados: any[] = [];
  producto: any = this.inicializarProducto();
  
  modoEdicion: boolean = false;
  idEditando: string = '';
  mostrarModalProducto: boolean = false;
  mostrarModalBusqueda: boolean = false;
  
  // Filtros de productos
  filtroNombre: string = '';
  filtroSku: string = '';
  filtroMarca: string = '';
  filtroCategoria: string = '';
  filtroSubcategoria: string = '';
  subcategorias: string[] = [];
  subcategoriasFiltro: string[] = [];
  
  // Manejo de tiendas
  nuevaTienda: string = '';
  
  // Manejo de modalidades
  modalidadSeleccionada: string = '';
  precioActual: number = 0;
  tamanoActual: string = '';
  contenidoActual: string = '';
  
  // Manejo de imágenes
  archivoSeleccionado: File | null = null;
  subiendoImagen: boolean = false;
  progresoSubida: number = 0;
  tipoSeleccionImagen: 'url' | 'upload' = 'url';
  previsualizacionImagen: string | null = null;
  imagenAnterior: string = '';

  // =============================
  // 👥 USUARIOS - PROPIEDADES
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
  mostrarModalBusquedaUsuarios: boolean = false;
  
  // Filtros de usuarios
  filtroNombreUsuario: string = '';
  filtroEmailUsuario: string = '';
  filtroRolUsuario: string = '';

  // =============================
  // 📧 MENSAJES DE CONTACTO
  // =============================
  mensajes: any[] = [];

  // =============================
  // 📰 NEWSLETTER - PROPIEDADES
  // =============================
  suscriptores: any[] = [];
  suscriptoresFiltrados: any[] = [];
  mostrarModalEnviarNewsletter: boolean = false;
  asuntoNewsletter: string = '';
  mensajeNewsletter: string = '';
  enviandoNewsletter: boolean = false;
  filtroEmailNewsletter: string = '';
  suscriptoresSeleccionados: Set<string> = new Set();
  seleccionarTodos: boolean = false;

  // =============================
  // 🗑️ MODAL DE ELIMINACIÓN UNIFICADO
  // =============================
  mostrarModalEliminar: boolean = false;
  tipoEliminacion: 'producto' | 'usuario' | 'mensaje' | 'suscriptor' = 'producto';
  idAEliminar: string = '';
  nombreElementoEliminar: string = '';

  // =============================
  // 📥 IMPORTACIÓN CSV
  // =============================
  archivoCSV: File | null = null;
  mostrarModalImportacion: boolean = false;
  cantidadImportar: number = 0;
  productosImportar: any[] = [];

  // =============================
  // 📂 MAPEO DE SUBCATEGORÍAS
  // =============================
  private subcategoriasMap: { [key: string]: string[] } = {
    'Desechables': ['Vasos', 'Platos', 'Charolas', 'Envases', 'Cubiertos', 'Tapas', 'Cono de Papel', 'Moldes', 'Popotes', 'Contenedores'],
    'Biodegradables': ['Vasos', 'Platos', 'Contenedores', 'Bolsa de Camiseta', 'Charolas', 'Popotes', 'Cubiertos', 'Bolsa', 'Servilletas'],
    'Bolsas': ['Bolsas de Camiseta', 'Biodegradables', 'Bolsas Tipo Celofán', 'Bolsas con Zipper', 'Bolsas de Papel','Bolsas para Basura', 'Bolsas Planas'],
    'Cocina y Repostería': ['Charolas', 'Capacillos', 'Empaques', 'Moldes', 'Palos de Madera','Emplayes','Envases', 'Aluminios', 'Tapas', 'Tripas para Embutidos', 'Contenedores'],
    'Alimentos': ['Colorantes', 'Conos de Nieve', 'Figuras para Freir', 'Saborizantes', 'Concentrados', 'Chile en Polvo', 'Salsas'],
    'Higiénicos y Servilletas': ['Cofia', 'Toallas Desechables', 'Papel Higiénico', 'Servilletas', 'Pañuelos']
  };

  // =============================
  // 📊 ESTADÍSTICAS COMPUTADAS
  // =============================
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
  // 🎬 CONSTRUCTOR
  // =============================
  constructor() {
    this.registrarIconos();
    this.inicializarEmailJS();
    this.cargarDatos();
  }

  // =============================
  // 🔧 MÉTODOS DE INICIALIZACIÓN
  // =============================
  
  private registrarIconos() {
    addIcons({
      albumsOutline, leafOutline, radioOutline, snowOutline,
      shieldCheckmarkOutline, cubeOutline, cashOutline, documentTextOutline,
      imageOutline, saveOutline, createOutline, trashOutline,
      logOutOutline, personOutline, pricetagOutline, constructOutline,
      mailOutline, checkmarkOutline, closeOutline, keyOutline,
      lockClosedOutline, peopleOutline, newspaperOutline, addCircleOutline,
      mailOpenOutline, informationCircleOutline, cloudUploadOutline, eyeOutline,
      searchOutline, filterOutline, refreshOutline, closeCircleOutline,
      folderOutline, ribbonOutline, closeCircle, sendOutline,
      listOutline, trashBinOutline, calendarOutline, textOutline,
      bulbOutline, checkmarkCircleOutline, warningOutline, resizeOutline,
      layersOutline, storefrontOutline, barcodeOutline, cartOutline,
      colorPaletteOutline, personAddOutline, downloadOutline, documentOutline,
      shieldOutline, personCircleOutline, starOutline
    });
  }

  private inicializarEmailJS() {
    emailjs.init({ publicKey: 'eSh72EoK4k2SontZF' });
  }

  private cargarDatos() {
    this.obtenerProductos();
    this.obtenerUsuarios();
    this.obtenerMensajes();
    this.obtenerSuscriptores();
  }

  private inicializarProducto() {
    return {
      id: '', sku: '', nombre: '', categoria: '', subcategoria: '',
      marca: '', descripcion: '', imagen: '', tiendas: [], modalidades: [],
      material: '', color: '', medida: '', cantidadPaquete: '',
      biodegradable: false, aptoMicroondas: false, aptoCongelador: false,
      usosRecomendados: '',
      destacado: false
    };
  }

  // =============================
  // 🎯 NAVEGACIÓN DE TABS
  // =============================
  
  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  // =============================
  // 💬 UTILIDADES - TOAST
  // =============================
  
async mostrarToast(mensaje: string, color: string = 'success') {
  const toast = await this.toastCtrl.create({
    message: mensaje,
    duration: 3000,
    position: 'bottom',
    color,
    cssClass: `toast-${color}`,
    animated: true
  });
  await toast.present();
}

  // =============================
  // 🗑️ MODAL DE ELIMINACIÓN UNIFICADO
  // =============================

  obtenerTipoTexto(): string {
    const textos = {
      'producto': 'producto',
      'usuario': 'usuario',
      'mensaje': 'mensaje',
      'suscriptor': 'suscriptor'
    };
    return textos[this.tipoEliminacion];
  }

  obtenerMensajeConfirmacion(): string {
    const mensajes = {
      'producto': 'El producto será eliminado permanentemente del sistema. Esta acción es irreversible.',
      'usuario': 'El usuario será eliminado permanentemente del sistema. Perderá acceso a su cuenta.',
      'mensaje': 'El mensaje será eliminado permanentemente y no podrás recuperarlo.',
      'suscriptor': 'El suscriptor será eliminado permanentemente del sistema y no recibirá más newsletters.'
    };
    return mensajes[this.tipoEliminacion];
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.idAEliminar = '';
    this.nombreElementoEliminar = '';
    this.cdr.detectChanges();
  }

  async confirmarEliminacion() {
    if (!this.idAEliminar) return;

    try {
      let docRef;
      let mensaje = '';

      switch (this.tipoEliminacion) {
        case 'producto':
          docRef = doc(this.firestore, `productos/${this.idAEliminar}`);
          await deleteDoc(docRef);
          mensaje = '🗑️ Producto eliminado correctamente';
          break;

        case 'usuario':
          docRef = doc(this.firestore, `usuarios/${this.idAEliminar}`);
          await deleteDoc(docRef);
          mensaje = '🗑️ Usuario eliminado correctamente';
          break;

        case 'mensaje':
          docRef = doc(this.firestore, `contactMessages/${this.idAEliminar}`);
          await deleteDoc(docRef);
          mensaje = '🗑️ Mensaje eliminado correctamente';
          break;

        case 'suscriptor':
          docRef = doc(this.firestore, `newsletter/${this.idAEliminar}`);
          await deleteDoc(docRef);
          this.suscriptoresSeleccionados.delete(this.idAEliminar);
          mensaje = '🗑️ Suscriptor eliminado correctamente';
          break;
      }

      await this.mostrarToast(mensaje, 'danger');
      this.cerrarModalEliminar();

    } catch (error) {
      console.error(`Error eliminando ${this.tipoEliminacion}:`, error);
      await this.mostrarToast(`❌ Error al eliminar el ${this.tipoEliminacion}`, 'danger');
      this.cerrarModalEliminar();
    }
  }

  // =============================
  // 📦 PRODUCTOS - CRUD
  // =============================

  obtenerProductos() {
    const ref = collection(this.firestore, 'productos');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.productos = data;
      this.aplicarFiltrosInternos();
    });
  }

  abrirModalProducto() {
    this.mostrarModalProducto = false;
    this.resetearFormularioProducto();
    
    setTimeout(() => {
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  editarProducto(producto: any) {
    this.mostrarModalProducto = false;
    this.imagenAnterior = producto.imagen || '';
    this.resetearFormularioProducto();
    
    setTimeout(() => {
      this.modoEdicion = true;
      this.idEditando = producto.id;
      this.cargarDatosProducto(producto);
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  cerrarModalProducto() {
    this.mostrarModalProducto = false;
    this.resetearFormularioProducto();
    this.cdr.detectChanges();
  }

  async guardarProducto() {
    if (!this.validarProducto()) return;

    try {
      let urlImagenFinal = await this.procesarImagen();
      const productoGuardar = this.construirObjetoProducto(urlImagenFinal);

      if (this.modoEdicion && this.idEditando) {
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        await updateDoc(docRef, productoGuardar);
        await this.mostrarToast('✅ Producto actualizado correctamente');
      } else {
        const ref = collection(this.firestore, 'productos');
        const docRef = await addDoc(ref, productoGuardar);
        await updateDoc(docRef, { id: docRef.id });
        await this.mostrarToast('✅ Producto agregado correctamente');
      }

      this.cerrarModalProducto();

    } catch (error) {
      console.error('Error al guardar producto:', error);
      await this.mostrarToast('❌ Error al guardar el producto', 'danger');
    }
  }

  eliminarProducto(id: string) {
    const producto = this.productos.find(p => p.id === id);
    this.idAEliminar = id;
    this.tipoEliminacion = 'producto';
    this.nombreElementoEliminar = producto?.nombre || 'este producto';
    this.mostrarModalEliminar = true;
    this.cdr.detectChanges();
  }

  // =============================
  // 📦 PRODUCTOS - MÉTODOS AUXILIARES
  // =============================

  private resetearFormularioProducto() {
    this.modoEdicion = false;
    this.idEditando = '';
    this.imagenAnterior = '';
    this.producto = this.inicializarProducto();
    this.tipoSeleccionImagen = 'url';
    this.archivoSeleccionado = null;
    this.previsualizacionImagen = null;
    this.subiendoImagen = false;
    this.progresoSubida = 0;
    this.subcategorias = [];
    this.nuevaTienda = '';
    this.modalidadSeleccionada = '';
    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';
  }

  private cargarDatosProducto(producto: any) {
    this.producto = {
      id: producto.id || '',
      sku: producto.sku || '',
      nombre: producto.nombre || '',
      categoria: producto.categoria || '',
      subcategoria: producto.subcategoria || '',
      marca: producto.marca || '',
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || '',
      tiendas: Array.isArray(producto.tiendas) ? [...producto.tiendas] : [],
      modalidades: Array.isArray(producto.modalidades) ? JSON.parse(JSON.stringify(producto.modalidades)) : [],
      material: producto.material || '',
      color: producto.color || '',
      medida: producto.medida || '',
      cantidadPaquete: producto.cantidadPaquete || '',
      biodegradable: producto.biodegradable || false,
      aptoMicroondas: producto.aptoMicroondas || false,
      aptoCongelador: producto.aptoCongelador || false,
      usosRecomendados: producto.usosRecomendados || '',
      destacado: producto.destacado || false
    };

    if (this.producto.categoria && this.subcategoriasMap[this.producto.categoria]) {
      this.subcategorias = this.subcategoriasMap[this.producto.categoria];
    }
  }

  private validarProducto(): boolean {
    const validaciones = [
      { condicion: !this.producto.sku?.trim(), mensaje: '⚠️ El SKU es requerido' },
      { condicion: !this.producto.nombre?.trim(), mensaje: '⚠️ El nombre del producto es requerido' },
      { condicion: !this.producto.categoria?.trim(), mensaje: '⚠️ La categoría es requerida' },
      { condicion: !this.producto.subcategoria?.trim(), mensaje: '⚠️ La subcategoría es requerida' },
      { condicion: !this.producto.marca?.trim(), mensaje: '⚠️ La marca es requerida' },
      { condicion: !this.producto.descripcion?.trim(), mensaje: '⚠️ La descripción es requerida' },
      { condicion: !this.tieneOpcionesValidas(), mensaje: '⚠️ Debes agregar al menos una opción de Mayoreo o Menudeo' }
    ];

    for (const { condicion, mensaje } of validaciones) {
      if (condicion) {
        this.mostrarToast(mensaje, 'warning');
        return false;
      }
    }

    if (this.tipoSeleccionImagen === 'url') {
      if (!this.producto.imagen?.trim()) {
        this.mostrarToast('⚠️ La URL de la imagen es requerida', 'warning');
        return false;
      }
    } else {
      if (!this.archivoSeleccionado && !this.producto.imagen) {
        this.mostrarToast('⚠️ Debes seleccionar una imagen', 'warning');
        return false;
      }
    }

    return true;
  }

  private async procesarImagen(): Promise<string> {
    let urlImagenFinal = this.producto.imagen;

    if (this.tipoSeleccionImagen === 'upload' && this.archivoSeleccionado) {
      try {
        if (this.modoEdicion && this.imagenAnterior) {
          await this.eliminarImagenAnterior(this.imagenAnterior);
        }
        urlImagenFinal = await this.subirImagenFirebase();
        await this.mostrarToast('📸 Imagen subida correctamente', 'success');
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        await this.mostrarToast('❌ Error al subir la imagen', 'danger');
        throw error;
      }
    }

    return urlImagenFinal;
  }

  private construirObjetoProducto(urlImagen: string) {
    return {
      sku: this.producto.sku,
      nombre: this.producto.nombre,
      categoria: this.producto.categoria,
      subcategoria: this.producto.subcategoria,
      marca: this.producto.marca,
      descripcion: this.producto.descripcion,
      imagen: urlImagen,
      tiendas: Array.isArray(this.producto.tiendas) ? this.producto.tiendas : [],
      modalidades: Array.isArray(this.producto.modalidades) ? this.producto.modalidades : [],
      material: this.producto.material || '',
      color: this.producto.color || '',
      medida: this.producto.medida || '',
      cantidadPaquete: this.producto.cantidadPaquete || '',
      biodegradable: this.producto.biodegradable || false,
      aptoMicroondas: this.producto.aptoMicroondas || false,
      aptoCongelador: this.producto.aptoCongelador || false,
      usosRecomendados: this.producto.usosRecomendados || '',
      destacado: this.producto.destacado || false
    };
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

  tieneModalidad(producto: any, modalidad: string): boolean {
    if (!producto.modalidades || !Array.isArray(producto.modalidades)) return false;
    return producto.modalidades.some((m: any) => m.modalidad === modalidad);
  }

  getModalidadesDisponibles(producto: any): string[] {
    if (!producto.modalidades || !Array.isArray(producto.modalidades)) return [];
    const modalidades: string[] = producto.modalidades.map((m: any) => m.modalidad);
    return Array.from(new Set(modalidades));
  }

  // =============================
  // 📸 MANEJO DE IMÁGENES
  // =============================

  cambiarTipoImagen(tipo: 'url' | 'upload') {
    this.tipoSeleccionImagen = tipo;
    if (tipo === 'upload') {
      this.producto.imagen = '';
    } else {
      this.archivoSeleccionado = null;
      this.previsualizacionImagen = null;
    }
    this.cdr.detectChanges();
  }

  onArchivoSeleccionado(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      this.mostrarToast('⚠️ Solo se permiten imágenes (JPG, PNG, WEBP, GIF)', 'warning');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (archivo.size > maxSize) {
      this.mostrarToast('⚠️ La imagen no debe superar 5MB', 'warning');
      return;
    }

    this.archivoSeleccionado = archivo;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previsualizacionImagen = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(archivo);
  }

  async subirImagenFirebase(): Promise<string> {
    if (!this.archivoSeleccionado) {
      throw new Error('No hay archivo seleccionado');
    }

    this.subiendoImagen = true;
    this.progresoSubida = 0;

    try {
      const timestamp = Date.now();
      const nombreArchivo = `productos/${timestamp}_${this.archivoSeleccionado.name}`;
      const storageRef = ref(this.storage, nombreArchivo);
      const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      this.subiendoImagen = false;
      this.progresoSubida = 100;
      
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      this.subiendoImagen = false;
      throw error;
    }
  }

  async eliminarImagenAnterior(imageUrl: string) {
    if (!imageUrl || !imageUrl.includes('firebase')) return;

    try {
      const decodedUrl = decodeURIComponent(imageUrl);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');
      const filePath = decodedUrl.substring(startIndex, endIndex);
      const storageRef = ref(this.storage, filePath);
      await deleteObject(storageRef);
      console.log('Imagen anterior eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar imagen anterior:', error);
    }
  }

  limpiarArchivoSeleccionado() {
    this.archivoSeleccionado = null;
    this.previsualizacionImagen = null;
    this.progresoSubida = 0;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.cdr.detectChanges();
  }

  // =============================
  // 🎯 MODALIDADES - GESTIÓN
  // =============================

  limpiarModalidadSeleccionada() {
    this.modalidadSeleccionada = '';
    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';
    this.cdr.detectChanges();
  }

  agregarOpcionModalidad() {
    if (!this.modalidadSeleccionada) {
      this.mostrarToast('⚠️ Selecciona una modalidad (Mayoreo o Menudeo)', 'warning');
      return;
    }

    if (this.precioActual <= 0) {
      this.mostrarToast('⚠️ El precio debe ser mayor a 0', 'warning');
      return;
    }

    const opcion = {
      id: Date.now().toString(),
      modalidad: this.modalidadSeleccionada,
      precio: this.precioActual,
      tamano: this.tamanoActual.trim() || 'N/A',
      contenido: this.contenidoActual.trim() || 'N/A'
    };

    if (!Array.isArray(this.producto.modalidades)) {
      this.producto.modalidades = [];
    }

    this.producto.modalidades.push(opcion);
    this.precioActual = 0;
    this.tamanoActual = '';
    this.contenidoActual = '';
    this.mostrarToast('✅ Opción de ' + this.modalidadSeleccionada + ' agregada', 'success');
    this.limpiarModalidadSeleccionada();
    this.cdr.detectChanges();
  }

  eliminarOpcionModalidad(id: string) {
    this.producto.modalidades = this.producto.modalidades.filter((m: any) => m.id !== id);
    this.mostrarToast('🗑️ Opción eliminada', 'danger');
    this.cdr.detectChanges();
  }

  obtenerOpcionesModalidad(modalidad: string): any[] {
    if (!Array.isArray(this.producto.modalidades)) return [];
    return this.producto.modalidades.filter((m: any) => m.modalidad === modalidad);
  }

  tieneOpcionesValidas(): boolean {
    return Array.isArray(this.producto.modalidades) && this.producto.modalidades.length > 0;
  }

  // =============================
  // 🏪 TIENDAS/SUCURSALES - GESTIÓN
  // =============================

  agregarTienda() {
    if (!this.tieneOpcionesValidas()) {
      this.mostrarToast('⚠️ Agrega al menos una opción de Mayoreo o Menudeo primero', 'warning');
      return;
    }

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
    this.mostrarToast('✅ Sucursal agregada correctamente', 'success');
  }

  eliminarTienda(index: number) {
    if (Array.isArray(this.producto.tiendas) && index >= 0 && index < this.producto.tiendas.length) {
      this.producto.tiendas.splice(index, 1);
      this.mostrarToast('🗑️ Sucursal eliminada', 'danger');
    }
  }

  // =============================
  // 🔍 PRODUCTOS - BÚSQUEDA Y FILTROS
  // =============================

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

  aplicarFiltros() {
    this.aplicarFiltrosInternos();
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

      return (
        (filtroNombre ? nombre.includes(filtroNombre) : true) &&
        (filtroSku ? sku.includes(filtroSku) : true) &&
        (filtroMarca ? marca.includes(filtroMarca) : true) &&
        (filtroCategoria ? categoria.includes(filtroCategoria) : true) &&
        (filtroSubcategoria ? subcategoria.includes(filtroSubcategoria) : true)
      );
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
  // 📤 PRODUCTOS - EXPORTAR CSV
  // =============================

  exportarProductosCSV() {
    if (this.productosFiltrados.length === 0) {
      this.mostrarToast('⚠️ No hay productos para exportar', 'warning');
      return;
    }

    const headers = [
      'ID', 'SKU', 'Nombre', 'Descripción', 'Categoría', 'Subcategoría',
      'Marca', 'Material', 'Color', 'Medida/Capacidad', 'Cantidad por Paquete',
      'Biodegradable', 'Apto Microondas', 'Apto Congelador', 'Usos Recomendados',
      'Tiendas', 'Modalidades', 'Imagen'
    ];

    const rows = this.productosFiltrados.map(product => {
      let modalidadesTexto = '';
      if (product.modalidades && Array.isArray(product.modalidades) && product.modalidades.length > 0) {
        modalidadesTexto = product.modalidades.map((m: any) => {
          const tamano = m.tamano && m.tamano !== 'N/A' ? m.tamano : '';
          const contenido = m.contenido && m.contenido !== 'N/A' ? m.contenido : '';
          const precio = m.precio ? `${m.precio}` : '';
          
          let partes = [m.modalidad];
          if (tamano) partes.push(tamano);
          if (contenido) partes.push(contenido);
          if (precio) partes.push(precio);
          
          return partes.join(' | ');
        }).join('; ');
      }

      return [
        product.id || '', product.sku || '', product.nombre || '',
        product.descripcion || '', product.categoria || '', product.subcategoria || '',
        product.marca || '', product.material || '', product.color || '',
        product.medida || '', product.cantidadPaquete || '',
        product.biodegradable ? 'Sí' : 'No',
        product.aptoMicroondas ? 'Sí' : 'No',
        product.aptoCongelador ? 'Sí' : 'No',
        product.usosRecomendados || '',
        product.tiendas?.join('; ') || '',
        modalidadesTexto,
        product.imagen || ''
      ];
    });

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    const BOM = '\uFEFF';
    const csvContentWithBOM = BOM + csvContent;
    const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Productos_${fecha}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.mostrarToast(`✅ ${this.productosFiltrados.length} productos exportados correctamente`, 'success');
  }

  // =============================
  // 📥 PRODUCTOS - IMPORTAR CSV
  // =============================

  async onArchivoCSVSeleccionado(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (!archivo.name.endsWith('.csv')) {
      this.mostrarToast('⚠️ Solo se permiten archivos CSV', 'warning');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (archivo.size > maxSize) {
      this.mostrarToast('⚠️ El archivo no debe superar 10MB', 'warning');
      return;
    }

    this.archivoCSV = archivo;
    await this.importarProductosCSV();
  }

  limpiarArchivoCSV() {
    this.archivoCSV = null;
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  async importarProductosCSV() {
    if (!this.archivoCSV) {
      this.mostrarToast('⚠️ Selecciona un archivo CSV primero', 'warning');
      return;
    }

    try {
      const texto = await this.leerArchivoCSV(this.archivoCSV);
      const productos = this.parsearCSV(texto);
      
      if (productos.length === 0) {
        this.mostrarToast('⚠️ No se encontraron productos válidos en el CSV', 'warning');
        this.limpiarArchivoCSV();
        return;
      }

      this.productosImportar = productos;
      this.cantidadImportar = productos.length;
      this.mostrarModalImportacion = true;
      this.cdr.detectChanges();

    } catch (error: any) {
      console.error('Error importando CSV:', error);
      this.mostrarToast(error.message || '❌ Error al importar el archivo CSV', 'danger');
      this.limpiarArchivoCSV();
    }
  }

  cancelarImportacion() {
    this.mostrarModalImportacion = false;
    this.cantidadImportar = 0;
    this.productosImportar = [];
    this.limpiarArchivoCSV();
    this.cdr.detectChanges();
  }

  async ejecutarImportacion() {
    if (this.productosImportar.length === 0) {
      this.mostrarToast('⚠️ No hay productos para importar', 'warning');
      this.cancelarImportacion();
      return;
    }

    try {
      this.mostrarModalImportacion = false;
      this.cdr.detectChanges();
      this.mostrarToast('⏳ Importando productos...', 'primary');
      await this.guardarProductosFirestore(this.productosImportar);
      this.cantidadImportar = 0;
      this.productosImportar = [];
      this.limpiarArchivoCSV();
    } catch (error) {
      console.error('Error en importación:', error);
      this.mostrarToast('❌ Error al importar productos', 'danger');
    }
  }

  private leerArchivoCSV(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(archivo, 'UTF-8');
    });
  }

  private parsearCSV(texto: string): any[] {
    const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length < 2) {
      throw new Error('El archivo CSV está vacío o solo contiene headers');
    }

    const headers = this.parsearLineaCSV(lineas[0]).map(h => h.trim());
    const headersRequeridos = ['Nombre', 'Categoría', 'Subcategoría', 'Marca', 'Descripción'];
    const faltantes = headersRequeridos.filter(h => !headers.includes(h));
    
    if (faltantes.length > 0) {
      throw new Error(`Faltan columnas requeridas: ${faltantes.join(', ')}`);
    }

    const productos: any[] = [];
    
    for (let i = 1; i < lineas.length; i++) {
      const valores = this.parsearLineaCSV(lineas[i]);
      
      if (valores.length !== headers.length) {
        console.warn(`Línea ${i + 1} ignorada: número incorrecto de columnas`);
        continue;
      }

      const producto: any = { modalidades: [], tiendas: [] };
      
      headers.forEach((header, index) => {
        const valor = valores[index].trim();
        
        switch (header) {
          case 'SKU': producto.sku = valor; break;
          case 'Nombre': producto.nombre = valor; break;
          case 'Descripción': producto.descripcion = valor; break;
          case 'Categoría': producto.categoria = valor; break;
          case 'Subcategoría': producto.subcategoria = valor; break;
          case 'Marca': producto.marca = valor; break;
          case 'Material': producto.material = valor; break;
          case 'Color': producto.color = valor; break;
          case 'Medida/Capacidad': producto.medida = valor; break;
          case 'Cantidad por Paquete': producto.cantidadPaquete = valor; break;
          case 'Biodegradable': 
            producto.biodegradable = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si'; 
            break;
          case 'Apto Microondas': 
            producto.aptoMicroondas = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si'; 
            break;
          case 'Apto Congelador': 
            producto.aptoCongelador = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si'; 
            break;
          case 'Usos Recomendados': producto.usosRecomendados = valor; break;
          case 'Tiendas':
            if (valor) {
              const separador = valor.includes('|') ? '|' : ';';
              producto.tiendas = valor.split(separador).map(t => t.trim()).filter(t => t);
            }
            break;
          case 'Modalidades':
            if (valor) producto.modalidades = this.parsearModalidades(valor);
            break;
          case 'Imagen':
            producto.imagen = valor && valor.trim() ? valor.trim() : '';
            break;
        }
      });

      if (producto.nombre && producto.categoria && producto.subcategoria && producto.marca) {
        if (!producto.sku || producto.sku.trim() === '') {
          producto.sku = `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        productos.push(producto);
      }
    }

    return productos;
  }

  private parsearModalidades(textoModalidades: string): any[] {
    const modalidades: any[] = [];
    if (!textoModalidades || textoModalidades.trim() === '') return modalidades;

    const opciones = textoModalidades.split(';').map(o => o.trim()).filter(o => o);

    for (const opcion of opciones) {
      const partes = opcion.split('|').map(p => p.trim());

      if (partes.length >= 2) {
        const modalidad = partes[0];
        let tamano = 'N/A';
        let contenido = 'N/A';
        let precio = 0;

        if (partes.length === 2) {
          precio = this.parsearPrecio(partes[1]);
        } else if (partes.length === 3) {
          tamano = partes[1];
          precio = this.parsearPrecio(partes[2]);
        } else if (partes.length >= 4) {
          tamano = partes[1];
          contenido = partes[2];
          precio = this.parsearPrecio(partes[3]);
        }

        if ((modalidad === 'Mayoreo' || modalidad === 'Menudeo') && precio > 0) {
          modalidades.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            modalidad, tamano, contenido, precio
          });
        }
      }
    }

    return modalidades;
  }

  private parsearPrecio(textoPrecio: string): number {
    const limpio = textoPrecio.replace(/[$,\s]/g, '').trim();
    const precio = parseFloat(limpio);
    return isNaN(precio) ? 0 : precio;
  }

  private parsearLineaCSV(linea: string): string[] {
    const resultado: string[] = [];
    let dentroComillas = false;
    let campoActual = '';

    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];
      const siguienteChar = linea[i + 1];

      if (char === '"' && siguienteChar === '"') {
        campoActual += '"';
        i++;
      } else if (char === '"') {
        dentroComillas = !dentroComillas;
      } else if (char === ',' && !dentroComillas) {
        resultado.push(campoActual);
        campoActual = '';
      } else {
        campoActual += char;
      }
    }

    resultado.push(campoActual);
    return resultado;
  }

  private async guardarProductosFirestore(productos: any[]) {
    let exitosos = 0;
    let fallidos = 0;
    let actualizados = 0;

    for (const producto of productos) {
      try {
        const ref = collection(this.firestore, 'productos');
        const querySnapshot = await getDocs(ref);
        let productoExistente: any = null;
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data['sku'] === producto.sku) {
            productoExistente = { id: docSnap.id, ...data };
          }
        });

        if (productoExistente) {
          const docRef = doc(this.firestore, `productos/${productoExistente.id}`);
          const { id, ...productoSinId } = producto;
          await updateDoc(docRef, productoSinId);
          actualizados++;
        } else {
          const { id, ...productoSinId } = producto;
          const docRef = await addDoc(ref, productoSinId);
          await updateDoc(docRef, { id: docRef.id });
          exitosos++;
        }
      } catch (error) {
        console.error('Error guardando producto:', error);
        fallidos++;
      }
    }

    let mensaje = '📊 Importación completada: ';
    const partes = [];
    
    if (exitosos > 0) partes.push(`✅ ${exitosos} creados`);
    if (actualizados > 0) partes.push(`🔄 ${actualizados} actualizados`);
    if (fallidos > 0) partes.push(`❌ ${fallidos} fallidos`);

    mensaje += partes.join(' | ');
    this.mostrarToast(mensaje, fallidos > 0 ? 'warning' : 'success');
  }

  // =============================
  // 👥 USUARIOS - CRUD
  // =============================

  obtenerUsuarios() {
    const ref = collection(this.firestore, 'usuarios');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.usuarios = data;
      this.aplicarFiltrosUsuarios();
    });
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

  editarUsuario(usuario: any) {
    this.mostrarModalUsuario = false;
    this.usuarioEditandoId = '';
    this.usuarioEditando = { nombre: '', email: '', rol: 'usuario' };
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
      this.usuarioEditando = { nombre: '', email: '', rol: 'usuario' };
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

  eliminarUsuario(id: string) {
    const usuario = this.usuarios.find(u => u.id === id);
    this.idAEliminar = id;
    this.tipoEliminacion = 'usuario';
    this.nombreElementoEliminar = usuario?.nombre || usuario?.email || 'este usuario';
    this.mostrarModalEliminar = true;
    this.cdr.detectChanges();
  }

  // =============================
  // 👥 USUARIOS - FILTROS
  // =============================

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

      return (
        (filtroNombre ? nombre.includes(filtroNombre) : true) &&
        (filtroEmail ? email.includes(filtroEmail) : true) &&
        (filtroRol ? rol === filtroRol : true)
      );
    });
  }

  limpiarFiltrosUsuarios() {
    this.filtroNombreUsuario = '';
    this.filtroEmailUsuario = '';
    this.filtroRolUsuario = '';
    this.aplicarFiltrosUsuarios();
  }

  aplicarFiltrosUsuariosDesdeModal() {
    this.aplicarFiltrosUsuarios();
    this.cerrarModalBusquedaUsuarios();
  }

  // =============================
  // 👥 USUARIOS - EXPORTAR CSV
  // =============================

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
        if (b.date && a.date) return b.date.localeCompare(a.date);
        return 0;
      });
    });
  }

  eliminarMensaje(id: string) {
    const mensaje = this.mensajes.find(m => m.id === id);
    this.idAEliminar = id;
    this.tipoEliminacion = 'mensaje';
    this.nombreElementoEliminar = mensaje?.name || 'este mensaje';
    this.mostrarModalEliminar = true;
    this.cdr.detectChanges();
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
  // 📰 NEWSLETTER - CRUD
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
    const suscriptor = this.suscriptores.find(s => s.id === id);
    this.idAEliminar = id;
    this.tipoEliminacion = 'suscriptor';
    this.nombreElementoEliminar = suscriptor?.nombre || suscriptor?.email || 'este suscriptor';
    this.mostrarModalEliminar = true;
    this.cdr.detectChanges();
  }

  // =============================
  // 📰 NEWSLETTER - ENVÍO
  // =============================

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
  // 🚪 CERRAR SESIÓN
  // =============================
  
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}