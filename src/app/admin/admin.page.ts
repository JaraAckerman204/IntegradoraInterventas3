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
  updateDoc,
  setDoc
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

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
  albumsOutline,
  leafOutline,
  radioOutline,
  snowOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HeaderComponent, FooterComponent],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  // ⭐ NUEVAS PROPIEDADES PARA UPLOAD
  storage = inject(Storage);
  archivoSeleccionado: File | null = null;
  subiendoImagen: boolean = false;
  progresoSubida: number = 0;
  tipoSeleccionImagen: 'url' | 'upload' = 'url'; // url o upload
  previsualizacionImagen: string | null = null;
  imagenAnterior: string = ''; // Para eliminar imagen anterior al actualizar

  // =============================
  // 🎯 TABS
  // =============================
  
  tabActiva: string = 'productos';

  // =============================
  // 🔦 MAPEO DE SUBCATEGORÍAS
  // =============================
  private subcategoriasMap: { [key: string]: string[] } = {
    'Desechables': ['Vasos', 'Platos', 'Charolas', 'Envases', 'Cubiertos', 'Tapas', 'Cono de Papel', 'Moldes', 'Popotes', 'Contenedores'],
    'Biodegradables': ['Vasos', 'Platos', 'Contenedores', 'Bolsa de Camiseta', 'Charolas', 'Popotes', 'Cubiertos', 'Bolsa', 'Servilletas'],
    'Bolsas': ['Bolsas de Camiseta', 'Biodegradables', 'Bolsas Tipo Celofán', 'Bolsas con Zipper', 'Bolsas de Papel','Bolsas para Basura', 'Bolsas Planas'],
    'Cocina y Repostería': ['Charolas', 'Capacillos', 'Empaques', 'Moldes', 'Palos de Madera','Emplayes','Envases', 'Aluminios', 'Tapas', 'Tripas para Embutidos', 'Contenedores'],
    'Alimentos': ['Colorantes', 'Conos de Nieve', 'Figuras para Freir', 'Saborizantes', 'Concentrados', 'Chile en Polvo', 'Salsas'],
    'Higiénicos y Servilletas': ['Cofia', 'Toallas Desechables', 'Papel Higiénico', 'Servilletas', 'Pañuelos']
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
  tiendas: [],
  modalidades: [],
  
  // ⭐ NUEVAS PROPIEDADES
  material: '',              // Material del producto
  color: '',                 // Color del producto
  medida: '',                // Medida/Capacidad (ej: 16oz, 500ml)
  cantidadPaquete: '',       // Cantidad por paquete (ej: Caja de 1000)
  biodegradable: false,      // Checkbox: Es biodegradable
  aptoMicroondas: false,     // Checkbox: Apto para microondas
  aptoCongelador: false,     // Checkbox: Apto para congelador
  usosRecomendados: ''       // Usos recomendados del producto
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
usuarioCreando: any = {
  nombre: '',
  email: '',
  rol: '',
  password: ''
};
usuarioEditando: any = {
  nombre: '',
  email: '',
  rol: '',
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
      albumsOutline,
      leafOutline,
      radioOutline,
      snowOutline,
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
  // 📸 MÉTODOS PARA MANEJO DE IMÁGENES
  // =============================

  /**
   * Cambiar entre URL y Upload
   */
  cambiarTipoImagen(tipo: 'url' | 'upload') {
    this.tipoSeleccionImagen = tipo;
    
    // Limpiar al cambiar de tipo
    if (tipo === 'upload') {
      this.producto.imagen = '';
    } else {
      this.archivoSeleccionado = null;
      this.previsualizacionImagen = null;
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Manejar la selección de archivo
   */
  onArchivoSeleccionado(event: any) {
    const archivo = event.target.files[0];
    
    if (!archivo) {
      return;
    }

    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      this.mostrarToast('⚠️ Solo se permiten imágenes (JPG, PNG, WEBP, GIF)', 'warning');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (archivo.size > maxSize) {
      this.mostrarToast('⚠️ La imagen no debe superar 5MB', 'warning');
      return;
    }

    this.archivoSeleccionado = archivo;

    // Crear previsualización
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previsualizacionImagen = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(archivo);
  }

  /**
   * Subir imagen a Firebase Storage
   */
  async subirImagenFirebase(): Promise<string> {
    if (!this.archivoSeleccionado) {
      throw new Error('No hay archivo seleccionado');
    }

    this.subiendoImagen = true;
    this.progresoSubida = 0;

    try {
      // Generar nombre único para la imagen
      const timestamp = Date.now();
      const nombreArchivo = `productos/${timestamp}_${this.archivoSeleccionado.name}`;
      
      // Crear referencia en Firebase Storage
      const storageRef = ref(this.storage, nombreArchivo);
      
      // Subir archivo
      const snapshot = await uploadBytes(storageRef, this.archivoSeleccionado);
      
      // Obtener URL de descarga
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

  /**
   * Eliminar imagen anterior de Firebase Storage
   */
  async eliminarImagenAnterior(imageUrl: string) {
    if (!imageUrl || !imageUrl.includes('firebase')) {
      return; // Solo eliminar si es de Firebase
    }

    try {
      // Extraer el path de la URL de Firebase
      const decodedUrl = decodeURIComponent(imageUrl);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');
      const filePath = decodedUrl.substring(startIndex, endIndex);
      
      // Crear referencia y eliminar
      const storageRef = ref(this.storage, filePath);
      await deleteObject(storageRef);
      
      console.log('Imagen anterior eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar imagen anterior:', error);
      // No lanzar error, solo registrar
    }
  }

  /**
   * Limpiar archivo seleccionado
   */
  limpiarArchivoSeleccionado() {
    this.archivoSeleccionado = null;
    this.previsualizacionImagen = null;
    this.progresoSubida = 0;
    
    // Limpiar el input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.cdr.detectChanges();
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
  // 💾 ACTUALIZAR MÉTODO guardarProducto()
  // =============================

  async guardarProducto() {
    try {
      // Validaciones básicas existentes...
      if (!this.producto.sku || !this.producto.sku.trim()) {
        await this.mostrarToast('⚠️ El SKU es requerido', 'warning');
        return;
      }

      if (!this.producto.nombre || !this.producto.nombre.trim()) {
        await this.mostrarToast('⚠️ El nombre del producto es requerido', 'warning');
        return;
      }

      if (!this.producto.categoria || !this.producto.categoria.trim()) {
        await this.mostrarToast('⚠️ La categoría es requerida', 'warning');
        return;
      }

      if (!this.producto.subcategoria || !this.producto.subcategoria.trim()) {
        await this.mostrarToast('⚠️ La subcategoría es requerida', 'warning');
        return;
      }

      if (!this.producto.marca || !this.producto.marca.trim()) {
        await this.mostrarToast('⚠️ La marca es requerida', 'warning');
        return;
      }

      if (!this.producto.descripcion || !this.producto.descripcion.trim()) {
        await this.mostrarToast('⚠️ La descripción es requerida', 'warning');
        return;
      }

      if (!this.tieneOpcionesValidas()) {
        await this.mostrarToast('⚠️ Debes agregar al menos una opción de Mayoreo o Menudeo', 'warning');
        return;
      }

      // ⭐ VALIDAR IMAGEN
      if (this.tipoSeleccionImagen === 'url') {
        // Validar URL
        if (!this.producto.imagen || !this.producto.imagen.trim()) {
          await this.mostrarToast('⚠️ La URL de la imagen es requerida', 'warning');
          return;
        }
      } else {
        // Validar archivo seleccionado
        if (!this.archivoSeleccionado && !this.producto.imagen) {
          await this.mostrarToast('⚠️ Debes seleccionar una imagen', 'warning');
          return;
        }
      }

      // ⭐ SUBIR IMAGEN SI ES NECESARIO
      let urlImagenFinal = this.producto.imagen;

      if (this.tipoSeleccionImagen === 'upload' && this.archivoSeleccionado) {
        try {
          // Si estamos editando y hay una imagen anterior, eliminarla
          if (this.modoEdicion && this.imagenAnterior) {
            await this.eliminarImagenAnterior(this.imagenAnterior);
          }

          // Subir nueva imagen
          urlImagenFinal = await this.subirImagenFirebase();
          await this.mostrarToast('📸 Imagen subida correctamente', 'success');
          
        } catch (error) {
          console.error('Error subiendo imagen:', error);
          await this.mostrarToast('❌ Error al subir la imagen', 'danger');
          return;
        }
      }

      // Preparar objeto completo
      const productoGuardar = {
        sku: this.producto.sku,
        nombre: this.producto.nombre,
        categoria: this.producto.categoria,
        subcategoria: this.producto.subcategoria,
        marca: this.producto.marca,
        descripcion: this.producto.descripcion,
        imagen: urlImagenFinal, // ⭐ Usar la URL final (subida o ingresada)
        tiendas: Array.isArray(this.producto.tiendas) ? this.producto.tiendas : [],
        modalidades: Array.isArray(this.producto.modalidades) ? this.producto.modalidades : [],
        material: this.producto.material || '',
        color: this.producto.color || '',
        medida: this.producto.medida || '',
        cantidadPaquete: this.producto.cantidadPaquete || '',
        biodegradable: this.producto.biodegradable || false,
        aptoMicroondas: this.producto.aptoMicroondas || false,
        aptoCongelador: this.producto.aptoCongelador || false,
        usosRecomendados: this.producto.usosRecomendados || ''
      };

      // MODO EDICIÓN
      if (this.modoEdicion && this.idEditando) {
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        await updateDoc(docRef, productoGuardar);
        await this.mostrarToast('✅ Producto actualizado correctamente');

      // MODO NUEVO (CREAR)
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

  // =============================
  // 📝 ACTUALIZAR editarProducto()
  // =============================

  editarProducto(producto: any) {
    this.mostrarModalProducto = false;
    
    // Guardar URL de imagen anterior para poder eliminarla si se cambia
    this.imagenAnterior = producto.imagen || '';
    
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      tiendas: [],
      modalidades: [],
      material: '',
      color: '',
      medida: '',
      cantidadPaquete: '',
      biodegradable: false,
      aptoMicroondas: false,
      aptoCongelador: false,
      usosRecomendados: ''
    };
    
    // Resetear estado de imagen
    this.tipoSeleccionImagen = 'url';
    this.archivoSeleccionado = null;
    this.previsualizacionImagen = null;
    this.subiendoImagen = false;
    this.progresoSubida = 0;
    
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
        tiendas: Array.isArray(producto.tiendas) ? [...producto.tiendas] : [],
        modalidades: Array.isArray(producto.modalidades) ? JSON.parse(JSON.stringify(producto.modalidades)) : [],
        material: producto.material || '',
        color: producto.color || '',
        medida: producto.medida || '',
        cantidadPaquete: producto.cantidadPaquete || '',
        biodegradable: producto.biodegradable || false,
        aptoMicroondas: producto.aptoMicroondas || false,
        aptoCongelador: producto.aptoCongelador || false,
        usosRecomendados: producto.usosRecomendados || ''
      };

      if (this.producto.categoria && this.subcategoriasMap[this.producto.categoria]) {
        this.subcategorias = this.subcategoriasMap[this.producto.categoria];
      }

      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  // =============================
  // 🆕 ACTUALIZAR abrirModalProducto()
  // =============================

  abrirModalProducto() {
    this.mostrarModalProducto = false;
    
    this.modoEdicion = false;
    this.idEditando = '';
    this.imagenAnterior = '';
    
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      tiendas: [],
      modalidades: [],
      material: '',
      color: '',
      medida: '',
      cantidadPaquete: '',
      biodegradable: false,
      aptoMicroondas: false,
      aptoCongelador: false,
      usosRecomendados: ''
    };

    // Resetear estado de imagen
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
    
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
    }, 150);
  }

  // =============================
  // 🧹 ACTUALIZAR cerrarModalProducto()
  // =============================

  cerrarModalProducto() {
    this.mostrarModalProducto = false;
    
    this.modoEdicion = false;
    this.idEditando = '';
    this.imagenAnterior = '';
    
    this.producto = {
      id: '',
      sku: '',
      nombre: '',
      categoria: '',
      subcategoria: '',
      marca: '',
      descripcion: '',
      imagen: '',
      tiendas: [],
      modalidades: [],
      material: '',
      color: '',
      medida: '',
      cantidadPaquete: '',
      biodegradable: false,
      aptoMicroondas: false,
      aptoCongelador: false,
      usosRecomendados: ''
    };

    // Limpiar estado de imagen
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
// 🎯 MÉTODOS PARA MODALIDADES (CORREGIDO - SIN DUPLICADOS)
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

  // ✅ Validar modalidad seleccionada
  if (!this.modalidadSeleccionada) {
    this.mostrarToast('⚠️ Selecciona una modalidad (Mayoreo o Menudeo)', 'warning');
    return;
  }

  // ✅ Validar precio (obligatorio)
  if (precio <= 0) {
    this.mostrarToast('⚠️ El precio debe ser mayor a 0', 'warning');
    return;
  }

  // ✅ Tamaño y contenido son OPCIONALES
  // Si están vacíos, se guardan como "N/A"

  const opcion = {
    id: Date.now().toString(),
    modalidad: this.modalidadSeleccionada,
    precio: precio,
    tamano: tamano || 'N/A',  // Si está vacío, muestra "N/A"
    contenido: contenido || 'N/A'  // Si está vacío, muestra "N/A"
  };

  if (!Array.isArray(this.producto.modalidades)) {
    this.producto.modalidades = [];
  }

  this.producto.modalidades.push(opcion);

  // Limpiar campos
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
  if (!Array.isArray(this.producto.modalidades)) {
    return [];
  }
  return this.producto.modalidades.filter((m: any) => m.modalidad === modalidad);
}

tieneOpcionesValidas(): boolean {
  return Array.isArray(this.producto.modalidades) && this.producto.modalidades.length > 0;
}

// =============================
// 🏪 MÉTODOS DE TIENDAS/SUCURSALES
// =============================

agregarTienda() {
  // ✅ Validar si hay opciones de modalidad antes de permitir agregar
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
      rol: this.usuarioEditando.rol || 'usuario', // Cambia 'usuario' por 'cliente'
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

// Exportar a CSV (usuarios)
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

// ⭐ EXPORTAR PRODUCTOS A CSV
exportarProductosCSV() {
  if (this.productosFiltrados.length === 0) {
    this.mostrarToast('⚠️ No hay productos para exportar', 'warning');
    return;
  }

  console.log('📊 Exportando productos a CSV...');

  // Definir headers del CSV
  const headers = [
    'ID',
    'SKU',
    'Nombre',
    'Descripción',
    'Categoría',
    'Subcategoría',
    'Marca',
    'Material',
    'Color',
    'Medida/Capacidad',
    'Cantidad por Paquete',
    'Biodegradable',
    'Apto Microondas',
    'Apto Congelador',
    'Usos Recomendados',
    'Tiendas',
    'Imagen'
  ];

  // Preparar las filas
  const rows = this.productosFiltrados.map(product => [
    product.id || '',
    product.sku || '',
    product.nombre || '',
    product.descripcion || '',
    product.categoria || '',
    product.subcategoria || '',
    product.marca || '',
    product.material || '',
    product.color || '',
    product.medida || '',
    product.cantidadPaquete || '',
    product.biodegradable ? 'Sí' : 'No',
    product.aptoMicroondas ? 'Sí' : 'No',
    product.aptoCongelador ? 'Sí' : 'No',
    product.usosRecomendados || '',
    product.tiendas?.join('; ') || '',
    product.imagen || ''
  ]);

  // Construir contenido CSV
  let csvContent = headers.join(',') + '\n';
  
  rows.forEach(row => {
    // Escapar comillas y comas dentro de los campos
    const escapedRow = row.map(cell => {
      const cellStr = String(cell);
      // Si contiene comas, saltos de línea o comillas, envolver en comillas
      if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    });
    csvContent += escapedRow.join(',') + '\n';
  });

  // ⭐ AGREGAR BOM (Byte Order Mark) PARA UTF-8
  const BOM = '\uFEFF';
  const csvContentWithBOM = BOM + csvContent;

  // Crear Blob con codificación UTF-8
  const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Generar nombre con fecha
  const fecha = new Date().toISOString().split('T')[0];
  const nombreArchivo = `Productos_${fecha}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('✅ Archivo CSV generado:', nombreArchivo);
  this.mostrarToast(`✅ ${this.productosFiltrados.length} productos exportados correctamente`, 'success');
}

// ==========================================
// 📥 IMPORTAR PRODUCTOS DESDE CSV
// ==========================================

// ⭐ PROPIEDAD PARA EL ARCHIVO
archivoCSV: File | null = null;

// ⭐ MÉTODO PARA SELECCIONAR ARCHIVO CSV Y AUTO-IMPORTAR
async onArchivoCSVSeleccionado(event: any) {
  const archivo = event.target.files[0];
  
  if (!archivo) {
    return;
  }

  // Validar que sea CSV
  if (!archivo.name.endsWith('.csv')) {
    this.mostrarToast('⚠️ Solo se permiten archivos CSV', 'warning');
    return;
  }

  // Validar tamaño (máximo 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (archivo.size > maxSize) {
    this.mostrarToast('⚠️ El archivo no debe superar 10MB', 'warning');
    return;
  }

  this.archivoCSV = archivo;
  
  // Auto-importar después de seleccionar
  await this.importarProductosCSV();
}

// ⭐ LIMPIAR ARCHIVO SELECCIONADO
limpiarArchivoCSV() {
  this.archivoCSV = null;
  const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

// ⭐ MÉTODO PRINCIPAL PARA IMPORTAR CSV
async importarProductosCSV() {
  if (!this.archivoCSV) {
    this.mostrarToast('⚠️ Selecciona un archivo CSV primero', 'warning');
    return;
  }

  try {
    // Leer el archivo
    const texto = await this.leerArchivoCSV(this.archivoCSV);
    
    // Parsear CSV
    const productos = this.parsearCSV(texto);
    
    if (productos.length === 0) {
      this.mostrarToast('⚠️ No se encontraron productos válidos en el CSV', 'warning');
      this.limpiarArchivoCSV();
      return;
    }

    // Confirmar importación
    const confirmacion = await this.confirmarImportacion(productos.length);
    
    if (!confirmacion) {
      this.limpiarArchivoCSV();
      return;
    }

    // Mostrar loading
    this.mostrarToast('⏳ Importando productos...', 'primary');

    // Importar productos a Firestore
    await this.guardarProductosFirestore(productos);
    
    // Limpiar archivo seleccionado
    this.limpiarArchivoCSV();

  } catch (error: any) {
    console.error('Error importando CSV:', error);
    this.mostrarToast(error.message || '❌ Error al importar el archivo CSV', 'danger');
    this.limpiarArchivoCSV();
  }
}

// ⭐ LEER ARCHIVO CSV
private leerArchivoCSV(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(archivo, 'UTF-8');
  });
}

// ⭐ PARSEAR CSV A OBJETOS
private parsearCSV(texto: string): any[] {
  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
  
  if (lineas.length < 2) {
    throw new Error('El archivo CSV está vacío o solo contiene headers');
  }

  // Obtener headers (primera línea)
  const headers = this.parsearLineaCSV(lineas[0]);
  
  // Validar headers requeridos (SKU ya no es obligatorio)
  const headersRequeridos = ['Nombre', 'Categoría', 'Subcategoría', 'Marca', 'Descripción'];
  const faltantes = headersRequeridos.filter(h => !headers.includes(h));
  
  if (faltantes.length > 0) {
    throw new Error(`Faltan columnas requeridas: ${faltantes.join(', ')}`);
  }

  // Parsear productos (resto de líneas)
  const productos: any[] = [];
  
  for (let i = 1; i < lineas.length; i++) {
    const valores = this.parsearLineaCSV(lineas[i]);
    
    if (valores.length !== headers.length) {
      console.warn(`Línea ${i + 1} ignorada: número incorrecto de columnas`);
      continue;
    }

    const producto: any = {
      modalidades: [], // Inicializar array vacío
      tiendas: []      // Inicializar array vacío
    };
    
    headers.forEach((header, index) => {
      const valor = valores[index].trim();
      
      switch (header) {
        case 'ID':
          // Ignorar ID del CSV, se generará nuevo o se usará el existente
          break;
        case 'SKU':
          producto.sku = valor;
          break;
        case 'Nombre':
          producto.nombre = valor;
          break;
        case 'Descripción':
          producto.descripcion = valor;
          break;
        case 'Categoría':
          producto.categoria = valor;
          break;
        case 'Subcategoría':
          producto.subcategoria = valor;
          break;
        case 'Marca':
          producto.marca = valor;
          break;
        case 'Material':
          producto.material = valor;
          break;
        case 'Color':
          producto.color = valor;
          break;
        case 'Medida/Capacidad':
          producto.medida = valor;
          break;
        case 'Cantidad por Paquete':
          producto.cantidadPaquete = valor;
          break;
        case 'Biodegradable':
          producto.biodegradable = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si';
          break;
        case 'Apto Microondas':
          producto.aptoMicroondas = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si';
          break;
        case 'Apto Congelador':
          producto.aptoCongelador = valor.toLowerCase() === 'sí' || valor.toLowerCase() === 'si';
          break;
        case 'Usos Recomendados':
          producto.usosRecomendados = valor;
          break;
        case 'Tiendas':
          // Manejar múltiples separadores: | o ;
          if (valor) {
            const separador = valor.includes('|') ? '|' : ';';
            producto.tiendas = valor.split(separador).map(t => t.trim()).filter(t => t);
          } else {
            producto.tiendas = [];
          }
          break;
        case 'Imagen':
          producto.imagen = valor;
          break;
      }
    });

    // Validar campos requeridos
    if (producto.nombre && producto.categoria && producto.subcategoria && producto.marca) {
      // Si no tiene SKU, generar uno automático
      if (!producto.sku || producto.sku.trim() === '') {
        producto.sku = `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.warn(`Línea ${i + 1}: SKU generado automáticamente: ${producto.sku}`);
      }
      productos.push(producto);
    } else {
      console.warn(`Línea ${i + 1} ignorada: faltan campos requeridos (Nombre, Categoría, Subcategoría o Marca)`);
    }
  }

  return productos;
}

// ⭐ PARSEAR LÍNEA CSV (MANEJA COMILLAS Y COMAS)
private parsearLineaCSV(linea: string): string[] {
  const resultado: string[] = [];
  let dentroComillas = false;
  let campoActual = '';

  for (let i = 0; i < linea.length; i++) {
    const char = linea[i];
    const siguienteChar = linea[i + 1];

    if (char === '"' && siguienteChar === '"') {
      // Comillas dobles escapadas
      campoActual += '"';
      i++; // Saltar siguiente comilla
    } else if (char === '"') {
      // Alternar estado de comillas
      dentroComillas = !dentroComillas;
    } else if (char === ',' && !dentroComillas) {
      // Fin de campo
      resultado.push(campoActual);
      campoActual = '';
    } else {
      campoActual += char;
    }
  }

  // Agregar último campo
  resultado.push(campoActual);

  return resultado;
}

// ⭐ CONFIRMAR IMPORTACIÓN
private async confirmarImportacion(cantidad: number): Promise<boolean> {
  const alert = await this.alertCtrl.create({
    header: '📥 Confirmar Importación',
    message: `¿Deseas importar ${cantidad} producto(s) desde el CSV?<br><br><small>Los productos con SKU existente se actualizarán.</small>`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Importar',
        role: 'confirm',
        cssClass: 'primary'
      }
    ]
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();
  
  return role === 'confirm';
}

// ⭐ GUARDAR PRODUCTOS EN FIRESTORE
private async guardarProductosFirestore(productos: any[]) {
  let exitosos = 0;
  let fallidos = 0;
  let actualizados = 0;

  for (const producto of productos) {
    try {
      const ref = collection(this.firestore, 'productos');
      
      // Obtener todos los productos para buscar por SKU o ID
      const querySnapshot = await getDocs(ref);
      let productoExistente: any = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Buscar por SKU (preferido) o por ID si existe en el CSV
        if (data['sku'] === producto.sku) {
          productoExistente = { id: doc.id, ...data };
        }
      });

      if (productoExistente) {
        // Actualizar producto existente
        const docRef = doc(this.firestore, `productos/${productoExistente.id}`);
        // Mantener el ID de Firestore, actualizar el resto
        const { id, ...productoSinId } = producto;
        await updateDoc(docRef, productoSinId);
        actualizados++;
      } else {
        // Crear nuevo producto
        const { id, ...productoSinId } = producto; // Remover ID del CSV si existe
        const docRef = await addDoc(ref, productoSinId);
        await updateDoc(docRef, { id: docRef.id });
        exitosos++;
      }

    } catch (error) {
      console.error('Error guardando producto:', producto.nombre, error);
      fallidos++;
    }
  }

  // Mostrar resultado
  let mensaje = '📊 Importación completada: ';
  const partes = [];
  
  if (exitosos > 0) partes.push(`✅ ${exitosos} creados`);
  if (actualizados > 0) partes.push(`🔄 ${actualizados} actualizados`);
  if (fallidos > 0) partes.push(`❌ ${fallidos} fallidos`);

  mensaje += partes.join(' | ');

  this.mostrarToast(mensaje, fallidos > 0 ? 'warning' : 'success');
}

// ⭐ DESCARGAR PLANTILLA CSV
descargarPlantillaCSV() {
  const headers = [
    'ID',
    'SKU',
    'Nombre',
    'Descripción',
    'Categoría',
    'Subcategoría',
    'Marca',
    'Material',
    'Color',
    'Medida/Capacidad',
    'Cantidad por Paquete',
    'Biodegradable',
    'Apto Microondas',
    'Apto Congelador',
    'Usos Recomendados',
    'Tiendas',
    'Imagen'
  ];

  // Ejemplo de producto
  const ejemplo = [
    '',
    'VASO-001',
    'Vaso Desechable 16oz',
    'Vaso transparente ideal para bebidas frías',
    'Desechables',
    'Vasos',
    'PlastiCup',
    'Polipropileno',
    'Transparente',
    '16oz',
    'Caja de 1000',
    'No',
    'No',
    'Sí',
    'Ideal para eventos, restaurantes y cafeterías',
    'Sucursal Centro; Sucursal Norte',
    'https://ejemplo.com/imagen.jpg'
  ];

  // Construir CSV
  const BOM = '\uFEFF';
  let csvContent = BOM + headers.join(',') + '\n';
  csvContent += ejemplo.map(cell => {
    if (cell.includes(',') || cell.includes(';')) {
      return `"${cell}"`;
    }
    return cell;
  }).join(',') + '\n';

  // Descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_productos.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  this.mostrarToast('📄 Plantilla CSV descargada', 'success');
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