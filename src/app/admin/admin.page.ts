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
  warningOutline
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
  // 🧾 PRODUCTOS
  // =============================
  producto: any = {
    id: '',
    nombre: '',
    categoria: '',
    marca: '',
    precio: 0,
    descripcion: '',
    imagen: ''
  };
  productos: any[] = [];
  productosFiltrados: any[] = [];
  filtroNombre: string = '';
  filtroMarca: string = '';
  filtroCategoria: string = '';
  modoEdicion: boolean = false;
  idEditando: string = '';
  mostrarModalProducto: boolean = false;
  mostrarModalBusqueda: boolean = false;

  // =============================
  // 👥 USUARIOS
  // =============================
  usuarios: any[] = [];
  usuarioEditando: any = {
    nombre: '',
    email: '',
    rol: 'usuario'
  };
  usuarioEditandoId: string = '';
  mostrarModalUsuario: boolean = false;

  // =============================
  // 📩 MENSAJES DE CONTACTO
  // =============================
  mensajes: any[] = [];

  // =============================
  // 📧 NEWSLETTER - NUEVA SECCIÓN
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
      warningOutline
    });

    // 🔐 Inicializar EmailJS con tu Public Key
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
  // 📢 TOAST GENERAL
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
  obtenerProductos() {
    const ref = collection(this.firestore, 'productos');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.productos = data;
      this.aplicarFiltrosInternos();
    });
  }

  async guardarProducto() {
    try {
      if (!this.producto.nombre || !this.producto.nombre.trim()) {
        await this.mostrarToast('⚠️ El nombre del producto es requerido', 'warning');
        return;
      }

      if (!this.producto.precio || this.producto.precio <= 0) {
        await this.mostrarToast('⚠️ El precio debe ser mayor a 0', 'warning');
        return;
      }

      if (this.modoEdicion && this.idEditando) {
        // MODO EDICIÓN
        console.log('💾 Actualizando producto existente:', this.idEditando);
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        const { id, ...productoSinId } = this.producto;
        await updateDoc(docRef, productoSinId);
        await this.mostrarToast('✅ Producto actualizado correctamente');
      } else {
        // MODO AGREGAR
        console.log('➕ Agregando nuevo producto');
        if (this.producto.id && this.producto.id.trim() !== '') {
          const docRef = doc(this.firestore, `productos/${this.producto.id}`);
          const { id, ...productoSinId } = this.producto;
          await setDoc(docRef, productoSinId);
          await this.mostrarToast('✅ Producto agregado con ID: ' + this.producto.id);
        } else {
          const ref = collection(this.firestore, 'productos');
          await addDoc(ref, this.producto);
          await this.mostrarToast('✅ Producto agregado correctamente');
        }
      }
      
      this.cerrarModalProducto();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      await this.mostrarToast('❌ Error al guardar el producto', 'danger');
    }
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

  editarProducto(producto: any) {
    console.log('✏️ Editando producto:', producto);
    
    // Primero cerrar cualquier modal abierto
    this.mostrarModalProducto = false;
    
    // Limpiar el producto actual
    this.producto = {
      id: '',
      nombre: '',
      categoria: '',
      marca: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    };
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Esperar un momento antes de abrir el modal de edición
    setTimeout(() => {
      this.modoEdicion = true;
      this.idEditando = producto.id;
      
      // Crear copia profunda del producto
      this.producto = {
        id: producto.id || '',
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        marca: producto.marca || '',
        precio: producto.precio || 0,
        descripcion: producto.descripcion || '',
        imagen: producto.imagen || ''
      };
      
      console.log('📋 Estado antes de abrir modal:', {
        modoEdicion: this.modoEdicion,
        idEditando: this.idEditando,
        producto: this.producto
      });
      
      // Abrir el modal
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
      
      console.log('✅ Modal de edición abierto');
    }, 150);
  }

  abrirModalProducto() {
    console.log('➕ Abriendo modal para nuevo producto...');
    
    // Cerrar modal si está abierto
    this.mostrarModalProducto = false;
    
    // Limpiar completamente el estado
    this.modoEdicion = false;
    this.idEditando = '';
    this.producto = {
      id: '',
      nombre: '',
      categoria: '',
      marca: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    };
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Esperar antes de abrir
    setTimeout(() => {
      console.log('📋 Estado antes de abrir modal nuevo:', {
        modoEdicion: this.modoEdicion,
        producto: this.producto
      });
      
      this.mostrarModalProducto = true;
      this.cdr.detectChanges();
      
      console.log('✅ Modal de nuevo producto abierto');
    }, 150);
  }

  cerrarModalProducto() {
    console.log('❌ Cerrando modal de producto...');
    this.mostrarModalProducto = false;
    
    // Limpiar inmediatamente
    this.modoEdicion = false;
    this.idEditando = '';
    this.producto = {
      id: '',
      nombre: '',
      categoria: '',
      marca: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    };
    
    this.cdr.detectChanges();
    console.log('✅ Modal cerrado y estado limpiado');
  }

  actualizarPreview() {
    // placeholder si quieres reaccionar a cambios en la URL de imagen
  }

  onImageError() {
    console.error('Error cargando imagen');
  }

  // =============================
  // 🔍 MODAL DE BÚSQUEDA Y FILTROS
  // =============================
  abrirModalBusqueda() {
    console.log('🔍 Abriendo modal de búsqueda...');
    setTimeout(() => {
      this.mostrarModalBusqueda = true;
      this.cdr.detectChanges();
      console.log('✅ Modal de búsqueda abierto:', this.mostrarModalBusqueda);
    }, 0);
  }

  cerrarModalBusqueda() {
    console.log('❌ Cerrando modal de búsqueda...');
    this.mostrarModalBusqueda = false;
    this.cdr.detectChanges();
    console.log('✅ Modal de búsqueda cerrado:', this.mostrarModalBusqueda);
  }

  aplicarFiltros() {
    const filtroNombre = (this.filtroNombre || '').trim().toLowerCase();
    const filtroMarca = (this.filtroMarca || '').trim().toLowerCase();
    const filtroCategoria = (this.filtroCategoria || '').trim().toLowerCase();

    this.productosFiltrados = this.productos.filter((producto) => {
      const nombre = (producto.nombre || '').toLowerCase();
      const marca = (producto.marca || '').toLowerCase();
      const categoria = (producto.categoria || '').toLowerCase();

      const coincideNombre = filtroNombre ? nombre.includes(filtroNombre) : true;
      const coincideMarca = filtroMarca ? marca.includes(filtroMarca) : true;
      const coincideCategoria = filtroCategoria ? categoria.includes(filtroCategoria) : true;

      return coincideNombre && coincideMarca && coincideCategoria;
    });

    this.cerrarModalBusqueda();
  }

  aplicarFiltrosInternos() {
    const filtroNombre = (this.filtroNombre || '').trim().toLowerCase();
    const filtroMarca = (this.filtroMarca || '').trim().toLowerCase();
    const filtroCategoria = (this.filtroCategoria || '').trim().toLowerCase();

    if (!filtroNombre && !filtroMarca && !filtroCategoria) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter((producto) => {
      const nombre = (producto.nombre || '').toLowerCase();
      const marca = (producto.marca || '').toLowerCase();
      const categoria = (producto.categoria || '').toLowerCase();

      const coincideNombre = filtroNombre ? nombre.includes(filtroNombre) : true;
      const coincideMarca = filtroMarca ? marca.includes(filtroMarca) : true;
      const coincideCategoria = filtroCategoria ? categoria.includes(filtroCategoria) : true;

      return coincideNombre && coincideMarca && coincideCategoria;
    });
  }

  limpiarFiltroNombre() {
    this.filtroNombre = '';
    this.aplicarFiltrosInternos();
  }

  limpiarFiltroMarca() {
    this.filtroMarca = '';
    this.aplicarFiltrosInternos();
  }

  limpiarFiltroCategoria() {
    this.filtroCategoria = '';
    this.aplicarFiltrosInternos();
  }

  limpiarTodosFiltros() {
    this.filtroNombre = '';
    this.filtroMarca = '';
    this.filtroCategoria = '';
    this.aplicarFiltrosInternos();
  }

  // =============================
  // 👥 USUARIOS
  // =============================
  obtenerUsuarios() {
    const ref = collection(this.firestore, 'usuarios');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.usuarios = data;
    });
  }

  editarUsuario(usuario: any) {
    console.log('✏️ Editando usuario:', usuario);
    
    // Cerrar el modal si está abierto
    this.mostrarModalUsuario = false;
    
    // Limpiar estado previo
    this.usuarioEditandoId = '';
    this.usuarioEditando = {
      nombre: '',
      email: '',
      rol: 'usuario'
    };
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
    
    // Esperar un momento antes de abrir el modal con los nuevos datos
    setTimeout(() => {
      this.usuarioEditandoId = usuario.id;
      
      // Crear una copia profunda del usuario
      this.usuarioEditando = { 
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        rol: usuario.rol || 'usuario'
      };
      
      console.log('📋 Datos cargados:', {
        id: this.usuarioEditandoId,
        usuario: this.usuarioEditando
      });
      
      // Abrir el modal
      this.mostrarModalUsuario = true;
      this.cdr.detectChanges();
      
      console.log('✅ Modal de edición de usuario abierto');
    }, 150);
  }

  abrirModalUsuario(usuario: any) {
    this.editarUsuario(usuario);
  }

  cerrarModalUsuario() {
    console.log('❌ Cerrando modal de usuario...');
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
      console.log('✅ Modal de usuario cerrado y estado limpiado');
    }, 100);
  }

  cancelarEdicion() {
    this.cerrarModalUsuario();
  }

  async guardarUsuarioEditado(id: string) {
    try {
      console.log('💾 Guardando usuario. ID:', id, 'Datos:', this.usuarioEditando);
      
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

      console.log('🔄 Actualizando en Firestore...', datosActualizar);

      await updateDoc(docRef, datosActualizar);
      
      await this.mostrarToast('✅ Usuario actualizado correctamente');
      this.cerrarModalUsuario();
      
      console.log('✅ Usuario guardado exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      await this.mostrarToast('❌ Error al actualizar el usuario', 'danger');
    }
  }

  async eliminarUsuario(id: string) {
    try {
      const docRef = doc(this.firestore, `usuarios/${id}`);
      await deleteDoc(docRef);
      await this.mostrarToast('🧹 Usuario eliminado correctamente', 'danger');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      await this.mostrarToast('❌ Error al eliminar el usuario', 'danger');
    }
  }

  // =============================
  // 📩 MENSAJES DE CONTACTO
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
  // 📧 NEWSLETTER - FUNCIONES
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
      console.log('✅ Suscriptores cargados:', this.suscriptores.length);
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

  // =============================
  // 🗑️ ELIMINAR SUSCRIPTOR - CON MODAL
  // =============================
  
  /**
   * Abre el modal de confirmación para eliminar un suscriptor
   */
  eliminarSuscriptor(id: string) {
    console.log('🗑️ Solicitando eliminar suscriptor:', id);
    this.suscriptorAEliminarId = id;
    this.mostrarModalEliminarSuscriptor = true;
    this.cdr.detectChanges();
  }

  /**
   * Cierra el modal de confirmación sin eliminar
   */
  cerrarModalEliminarSuscriptor() {
    console.log('❌ Cancelando eliminación de suscriptor');
    this.mostrarModalEliminarSuscriptor = false;
    this.suscriptorAEliminarId = '';
    this.cdr.detectChanges();
  }

  /**
   * Ejecuta la eliminación del suscriptor después de confirmar
   */
  async confirmarEliminacionSuscriptor() {
    if (!this.suscriptorAEliminarId) {
      console.error('❌ No hay ID de suscriptor para eliminar');
      return;
    }

    try {
      console.log('🗑️ Eliminando suscriptor con ID:', this.suscriptorAEliminarId);
      
      const docRef = doc(this.firestore, `newsletter/${this.suscriptorAEliminarId}`);
      await deleteDoc(docRef);
      
      // Remover de seleccionados si estaba seleccionado
      this.suscriptoresSeleccionados.delete(this.suscriptorAEliminarId);
      
      await this.mostrarToast('🗑️ Suscriptor eliminado correctamente', 'danger');
      console.log('✅ Suscriptor eliminado exitosamente');
      
      // Cerrar el modal
      this.cerrarModalEliminarSuscriptor();
      
    } catch (error) {
      console.error('❌ Error eliminando suscriptor:', error);
      await this.mostrarToast('❌ Error al eliminar el suscriptor', 'danger');
      this.cerrarModalEliminarSuscriptor();
    }
  }

  // =============================
  // 📧 ENVIAR NEWSLETTER
  // =============================

  abrirModalEnviarNewsletter() {
    console.log('📧 Abriendo modal de newsletter...');
    
    if (this.suscriptores.length === 0) {
      this.mostrarToast('⚠️ No hay suscriptores registrados', 'warning');
      return;
    }

    if (this.suscriptoresSeleccionados.size === 0) {
      this.mostrarToast('⚠️ Selecciona al menos un suscriptor antes de continuar', 'warning');
      return;
    }

    // Solo limpiar los campos del formulario, NO la selección de suscriptores
    this.asuntoNewsletter = '';
    this.mensajeNewsletter = '';
    this.mostrarModalEnviarNewsletter = true;
    this.cdr.detectChanges();
    
    console.log('✅ Modal de newsletter abierto. Estado:', {
      suscriptoresSeleccionados: this.suscriptoresSeleccionados.size,
      mostrarModal: this.mostrarModalEnviarNewsletter
    });
  }

  cerrarModalEnviarNewsletter() {
    console.log('❌ Cerrando modal de newsletter...');
    this.mostrarModalEnviarNewsletter = false;
    
    // Solo limpiar los campos del formulario
    this.asuntoNewsletter = '';
    this.mensajeNewsletter = '';
    
    // NO limpiar la selección aquí - solo cuando se envíe exitosamente
    this.cdr.detectChanges();
    console.log('✅ Modal de newsletter cerrado');
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

      console.log(`📧 Enviando newsletter a ${suscriptoresAEnviar.length} suscriptores...`);

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
          console.log(`✅ Correo enviado a ${suscriptor.email}`);
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`❌ Error enviando a ${suscriptor.email}:`, error);
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