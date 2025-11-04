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
  doc
} from '@angular/fire/firestore';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage {
  router = inject(Router);
  auth = inject(AuthService);
  firestore = inject(Firestore);

  // ✅ Campos del producto
  producto = {
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
  };

  // ✅ Lista reactiva de productos (Observable)
  productos$: Observable<any[]>;

  constructor() {
    // Cargar productos desde Firestore en tiempo real
    const productosRef = collection(this.firestore, 'productos');
    this.productos$ = collectionData(productosRef, { idField: 'id' }) as Observable<any[]>;
  }

  /** 🚪 Cerrar sesión */
  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  /** 💾 Guardar producto */
  async guardarProducto() {
    const { nombre, precio, descripcion, imagen } = this.producto;

    if (!nombre || !precio || !descripcion) {
      alert('Completa todos los campos antes de guardar');
      return;
    }

    try {
      const productosRef = collection(this.firestore, 'productos');
      await addDoc(productosRef, { nombre, precio, descripcion, imagen });
      alert('✅ Producto guardado correctamente');
      this.producto = { nombre: '', precio: '', descripcion: '', imagen: '' };
    } catch (error) {
      console.error('❌ Error al guardar producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  }

  /** 🗑️ Eliminar producto */
  async eliminarProducto(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      await deleteDoc(doc(this.firestore, `productos/${id}`));
      alert('🗑️ Producto eliminado correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto');
    }
  }
}
