import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { sendEmailVerification, reload } from '@angular/fire/auth';
import { Router } from '@angular/router';

// 🔥 Importar Firestore
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

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
export class VerificarPage implements OnInit, OnDestroy {
  reenviando = false;
  mensaje = '';
  
  private verificacionInterval: any; // ⭐ Para la verificación automática

  constructor(
    private authService: AuthService, 
    private router: Router,
    private firestore: Firestore // ⭐ Inyectar Firestore
  ) {
    addIcons({
      'mail-outline': mailOutline,
      'refresh-outline': refreshOutline,
      'arrow-back-outline': arrowBackOutline
    });
  }

  ngOnInit() {
    // ⭐ Iniciar verificación automática cada 5 segundos
    this.iniciarVerificacionAutomatica();
  }

  ngOnDestroy() {
    // ⭐ Limpiar el intervalo al salir
    this.detenerVerificacionAutomatica();
  }

  /** 🔄 Verificar automáticamente cada 5 segundos */
  iniciarVerificacionAutomatica() {
    this.verificacionInterval = setInterval(async () => {
      await this.verificarYActualizarEstado();
    }, 5000); // Cada 5 segundos
  }

  /** 🛑 Detener verificación automática */
  detenerVerificacionAutomatica() {
    if (this.verificacionInterval) {
      clearInterval(this.verificacionInterval);
      this.verificacionInterval = null;
    }
  }

  /** ✅ Verificar si el email fue verificado y actualizar Firestore */
  async verificarYActualizarEstado() {
    const user = this.authService.getCurrentUser();

    if (!user) return;

    try {
      // 1️⃣ Recargar datos del usuario desde Firebase Auth
      await reload(user);

      // 2️⃣ Si el email está verificado
      if (user.emailVerified) {
        console.log('✅ Email verificado, actualizando Firestore...');
        
        // 3️⃣ Actualizar emailVerificado a true en Firestore
        const userRef = doc(this.firestore, `usuarios/${user.uid}`);
        await updateDoc(userRef, {
          emailVerificado: true
        });

        console.log('✅ Firestore actualizado: emailVerificado = true');
        
        // 4️⃣ Detener verificación y redirigir
        this.detenerVerificacionAutomatica();
        this.mensaje = '🎉 ¡Email verificado exitosamente! Redirigiendo...';
        
        setTimeout(() => {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Error al verificar estado:', error);
    }
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

  goToLogin() {
    this.detenerVerificacionAutomatica(); // ⭐ Detener verificación al salir
    this.router.navigateByUrl('/login');
  }
}