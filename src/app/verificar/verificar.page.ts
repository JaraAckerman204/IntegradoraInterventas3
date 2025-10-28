import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';

// 🧩 Importar componentes
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  refreshOutline, 
  arrowBackOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.page.html',
  styleUrls: ['./verificar.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonText,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule,
  ],
})
export class VerificarPage {
  reenviando = false; // 🔄 para desactivar el botón temporalmente
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {
    // Registrar los iconos de Ionicons
    addIcons({
      'mail-outline': mailOutline,
      'refresh-outline': refreshOutline,
      'arrow-back-outline': arrowBackOutline
    });
  }

  async reenviarVerificacion() {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.reenviando = true;
      this.mensaje = '';

      try {
        await sendEmailVerification(user);
        this.mensaje = '✅ Correo de verificación reenviado. Revisa tu bandeja de entrada.';
      } catch (error) {
        console.error(error);
        this.mensaje = '❌ Hubo un error al reenviar el correo. Intenta de nuevo más tarde.';
      } finally {
        // Desactivar el botón por 10 segundos
        setTimeout(() => {
          this.reenviando = false;
        }, 10000);
      }
    } else {
      this.mensaje = '⚠️ No hay usuario activo. Inicia sesión primero.';
    }
  }

  // 👇 Este método permite volver al login
  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}