import { Component, inject } from '@angular/core';
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
  checkmarkCircleOutline
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
  producto: any = {};
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
  usuarioEditando: any = null;
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
      checkmarkCircleOutline
    });

    // 🔑 Inicializar EmailJS con tu Public Key
    emailjs.init({
      publicKey: 'eSh72EoK4k2SontZF',
    });
 // 👈 REEMPLAZA ESTO

    this.obtenerProductos();
    this.obtenerUsuarios();
    this.obtenerMensajes();
    this.obtenerSuscriptores(); // 📧 Nueva función
  }

  // =============================
  // 🎯 NAVEGACIÓN TABS
  // =============================
  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  // =============================
  // 🔔 TOAST GENERAL
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

      if (this.modoEdicion) {
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        const { id, ...productoSinId } = this.producto;
        await updateDoc(docRef, productoSinId);
        await this.mostrarToast('✅ Producto actualizado correctamente');
        this.cerrarModalProducto();
      } else {
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
        this.cerrarModalProducto();
      }
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
    this.modoEdicion = true;
    this.idEditando = producto.id;
    this.producto = { ...producto };
    this.mostrarModalProducto = true;
    console.log('Editando producto:', this.producto);
  }

  abrirModalProducto() {
    this.mostrarModalProducto = true;
    this.modoEdicion = false;
    this.producto = {};
    this.idEditando = '';
  }

  cerrarModalProducto() {
    this.mostrarModalProducto = false;
    this.modoEdicion = false;
    this.producto = {};
    this.idEditando = '';
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
    this.mostrarModalBusqueda = true;
  }

  cerrarModalBusqueda() {
    this.mostrarModalBusqueda = false;
  }

  aplicarFiltros() {
    // Normalizar entradas (elimina espacios y vuelve minúsculas)
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

    // Si no hay ningún filtro, mostrar todos los productos
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
    this.usuarioEditandoId = usuario.id;
    this.usuarioEditando = { 
      id: usuario.id,
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      rol: usuario.rol || 'usuario'
    };
    this.mostrarModalUsuario = true;
    console.log('Editando usuario:', this.usuarioEditando);
  }

  abrirModalUsuario(usuario: any) {
    this.editarUsuario(usuario);
  }

  cerrarModalUsuario() {
    this.mostrarModalUsuario = false;
    this.usuarioEditandoId = '';
    this.usuarioEditando = null;
  }

  cancelarEdicion() {
    this.cerrarModalUsuario();
  }

  async guardarUsuarioEditado(id: string) {
    try {
      if (!this.usuarioEditando) {
        await this.mostrarToast('❌ No hay datos para guardar', 'danger');
        return;
      }

      if (!this.usuarioEditando.email || !this.usuarioEditando.email.includes('@')) {
        await this.mostrarToast('⚠️ Por favor ingresa un email válido', 'warning');
        return;
      }

      console.log('Guardando usuario:', id, this.usuarioEditando);

      const docRef = doc(this.firestore, `usuarios/${id}`);
      const datosActualizar = {
        nombre: this.usuarioEditando.nombre || '',
        email: this.usuarioEditando.email || '',
        rol: this.usuarioEditando.rol || 'usuario',
      };

      console.log('Datos a actualizar:', datosActualizar);

      await updateDoc(docRef, datosActualizar);
      
      await this.mostrarToast('✅ Usuario actualizado correctamente');
      this.usuarioEditandoId = '';
      this.usuarioEditando = null;
      this.cerrarModalUsuario();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
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
  // 📧 NEWSLETTER - FUNCIONES NUEVAS
  // =============================
  
  /**
   * 📊 Obtener suscriptores desde Firebase
   */
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

  /**
   * 🔍 Aplicar filtro de búsqueda en newsletter
   */
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

  /**
   * 🧹 Limpiar filtro de newsletter
   */
  limpiarFiltroNewsletter() {
    this.filtroEmailNewsletter = '';
    this.aplicarFiltroNewsletter();
  }

  /**
   * ☑️ Toggle selección de un suscriptor
   */
  toggleSuscriptorSeleccion(suscriptorId: string) {
    if (this.suscriptoresSeleccionados.has(suscriptorId)) {
      this.suscriptoresSeleccionados.delete(suscriptorId);
    } else {
      this.suscriptoresSeleccionados.add(suscriptorId);
    }
    
    // Actualizar estado de "seleccionar todos"
    this.seleccionarTodos = this.suscriptoresSeleccionados.size === this.suscriptoresFiltrados.length;
  }

  /**
   * ☑️ Toggle seleccionar todos los suscriptores
   */
  toggleSeleccionarTodos() {
    this.seleccionarTodos = !this.seleccionarTodos;
    
    if (this.seleccionarTodos) {
      this.suscriptoresSeleccionados.clear();
      this.suscriptoresFiltrados.forEach(s => this.suscriptoresSeleccionados.add(s.id));
    } else {
      this.suscriptoresSeleccionados.clear();
    }
  }

  /**
   * 🗑️ Eliminar suscriptor con confirmación
   */
  async eliminarSuscriptor(id: string) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar suscriptor?',
      message: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: async () => {
            try {
              const docRef = doc(this.firestore, `newsletter/${id}`);
              await deleteDoc(docRef);
              await this.mostrarToast('🗑️ Suscriptor eliminado', 'danger');
            } catch (error) {
              console.error('Error eliminando suscriptor:', error);
              await this.mostrarToast('❌ Error al eliminar', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
 * 📧 Abrir modal para enviar newsletter
 */
abrirModalEnviarNewsletter() {
  if (this.suscriptores.length === 0) {
    this.mostrarToast('⚠️ No hay suscriptores registrados', 'warning');
    return;
  }

  this.mostrarModalEnviarNewsletter = true;

  // ✅ Resetea solo campos del modal
  this.asuntoNewsletter = '';
  this.mensajeNewsletter = '';

  // ❌ NO limpiar selección aquí
  // this.suscriptoresSeleccionados.clear();
  // this.seleccionarTodos = false;
}

/**
 * ❌ Cerrar modal de enviar newsletter
 */
cerrarModalEnviarNewsletter() {
  this.mostrarModalEnviarNewsletter = false;

  // ✅ Resetea campos del modal
  this.asuntoNewsletter = '';
  this.mensajeNewsletter = '';

  // ✅ Aquí sí limpiamos la selección
  this.suscriptoresSeleccionados.clear();
  this.seleccionarTodos = false;
}

  /**
   * 📨 Enviar newsletter (con confirmación)
   */
  async enviarNewsletter() {
    // Validaciones
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

    // Confirmar envío
    const alert = await this.alertCtrl.create({
      header: 'Confirmar envío',
      message: `¿Enviar newsletter a ${this.suscriptoresSeleccionados.size} suscriptor(es)?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          role: 'confirm',
          handler: async () => {
            await this.procesarEnvioNewsletter();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * 📬 Procesar envío masivo de newsletter
   */
  async procesarEnvioNewsletter() {
    this.enviandoNewsletter = true;

    try {
      let exitosos = 0;
      let fallidos = 0;

      // Obtener suscriptores seleccionados
      const suscriptoresAEnviar = this.suscriptores.filter(s => 
        this.suscriptoresSeleccionados.has(s.id)
      );

      console.log(`📧 Enviando newsletter a ${suscriptoresAEnviar.length} suscriptores...`);

      // Enviar correos con EmailJS
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
          
          // Pequeña pausa para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`❌ Error enviando a ${suscriptor.email}:`, error);
          fallidos++;
        }
      }

      // Mostrar resultado
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