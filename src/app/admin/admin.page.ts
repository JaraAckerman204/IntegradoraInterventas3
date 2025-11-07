import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
  closeCircle
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
  // 🔧 SERVICIOS
  // =============================
  firestore = inject(Firestore);
  authService = inject(AuthService);
  router = inject(Router);
  toastCtrl = inject(ToastController);

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
      closeCircle
    });

    this.obtenerProductos();
    this.obtenerUsuarios();
    this.obtenerMensajes();
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
      duration: 2000,
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
  // 🚪 SESIÓN
  // =============================
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}