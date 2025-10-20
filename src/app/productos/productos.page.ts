import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    IonSpinner
  ],
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss']
})
export class ProductosPage implements OnInit {
  productos: any[] = [];
  form = { nombre: '', correo: '', mensaje: '' };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('📦 Productos obtenidos:', this.productos);
      },
      error: (err) => console.error('❌ Error al obtener productos:', err)
    });
  }

  enviarMensaje() {
    // Aquí puedes integrar envío real (API) o dejarlo como demo
    console.log('✉ Mensaje enviado:', this.form);
    alert('Gracias por contactarnos. Te responderemos pronto.');
    this.form = { nombre: '', correo: '', mensaje: '' };
  }
}
