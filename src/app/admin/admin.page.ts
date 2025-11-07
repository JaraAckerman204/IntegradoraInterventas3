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
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HeaderComponent, FooterComponent],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {
  // Productos
  producto: any = {};
  productos: any[] = [];
  modoEdicion: boolean = false;
  idEditando: string = '';

  // Usuarios
  usuarios: any[] = [];
  usuarioEditando: any = null;
  usuarioEditandoId: string = '';

  // Mensajes de contacto
  mensajes: any[] = [];

  // Servicios
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
      personOutline
    });

    this.obtenerProductos();
    this.obtenerUsuarios();
    this.obtenerMensajes(); // 👈 Nuevo
  }

  // =============================
  // 🧾 PRODUCTOS
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

  obtenerProductos() {
    const ref = collection(this.firestore, 'productos');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.productos = data;
    });
  }

  async guardarProducto() {
    try {
      if (this.modoEdicion) {
        // Actualizar producto existente
        const docRef = doc(this.firestore, `productos/${this.idEditando}`);
        const { id, ...productoSinId } = this.producto;
        await updateDoc(docRef, productoSinId);
        this.mostrarToast('✅ Producto actualizado');
        this.modoEdicion = false;
        this.idEditando = '';
      } else {
        // Agregar nuevo producto
        if (this.producto.id && this.producto.id.trim() !== '') {
          // Si se especificó un ID, usar setDoc
          const docRef = doc(this.firestore, `productos/${this.producto.id}`);
          const { id, ...productoSinId } = this.producto;
          await setDoc(docRef, productoSinId);
          this.mostrarToast('✅ Producto agregado con ID: ' + this.producto.id);
        } else {
          // Si no se especificó ID, generar uno automático
          const ref = collection(this.firestore, 'productos');
          await addDoc(ref, this.producto);
          this.mostrarToast('✅ Producto agregado');
        }
      }
      this.producto = {};
    } catch (error) {
      console.error('Error al guardar producto:', error);
      this.mostrarToast('❌ Error al guardar el producto', 'danger');
    }
  }

  editarProducto(p: any) {
    this.modoEdicion = true;
    this.idEditando = p.id;
    // Copiar el producto sin el id para evitar confusiones
    this.producto = { 
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion,
      imagen: p.imagen
    };
    console.log('Editando producto:', this.producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async eliminarProducto(id: string) {
    const docRef = doc(this.firestore, `productos/${id}`);
    await deleteDoc(docRef);
    this.mostrarToast('🗑️ Producto eliminado', 'danger');
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

  async eliminarUsuario(id: string) {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    await deleteDoc(docRef);
    this.mostrarToast('🧹 Usuario eliminado', 'danger');
  }

  editarUsuario(usuario: any) {
    // Habilitar edición inline
    this.usuarioEditandoId = usuario.id;
    this.usuarioEditando = { 
      id: usuario.id,
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      rol: usuario.rol || 'usuario'
    };
    console.log('Editando usuario:', this.usuarioEditando);
  }

  cancelarEdicion() {
    console.log('Cancelando edición');
    this.usuarioEditandoId = '';
    this.usuarioEditando = null;
  }

  responderMensaje(email: string, mensajeOriginal: string) {
  if (!email) return;

  const subject = encodeURIComponent('Respuesta a tu mensaje en Interventas');
  const body = encodeURIComponent(
    `Hola ${email.split('@')[0]},\n\nGracias por contactarte con nosotros. A continuación te respondemos:\n\n\n---\nMensaje original:\n${mensajeOriginal}\n---`
  );

  // 👉 Esto abrirá directamente Gmail en una nueva pestaña
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');
}




  async guardarUsuarioEditado(id: string) {
    try {
      if (!this.usuarioEditando) {
        this.mostrarToast('❌ No hay datos para guardar', 'danger');
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
      
      this.mostrarToast('✅ Usuario actualizado correctamente');
      this.usuarioEditandoId = '';
      this.usuarioEditando = null;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      this.mostrarToast('❌ Error al actualizar el usuario: ' + error, 'danger');
    }
  }

  // =============================
  // 📩 MENSAJES DE CONTACTO
  // =============================

  obtenerMensajes() {
    const ref = collection(this.firestore, 'contactMessages');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      // Ordenar por fecha (más recientes primero)
      this.mensajes = data.sort((a: any, b: any) => b.date.localeCompare(a.date));
    });
  }

  async eliminarMensaje(id: string) {
    const docRef = doc(this.firestore, `contactMessages/${id}`);
    await deleteDoc(docRef);
    this.mostrarToast('🗑️ Mensaje eliminado', 'danger');
  }

  // =============================
  // 🚪 SESIÓN
  // =============================

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}