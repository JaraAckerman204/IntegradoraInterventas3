import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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

  producto = {
    nombre: '',
    precio: '',
  };

  constructor() {}

  /** 🚪 Cerrar sesión */
  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  /** 💾 Guardar producto (ejemplo de acción admin) */
  guardarProducto() {
    if (this.producto.nombre && this.producto.precio) {
      console.log('Producto guardado:', this.producto);
      alert('Producto guardado correctamente (ejemplo)');
      this.producto = { nombre: '', precio: '' };
    } else {
      alert('Completa todos los campos');
    }
  }
}
