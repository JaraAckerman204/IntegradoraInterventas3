import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🧩 Componentes personalizados
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// 🧱 Componentes de Ionic
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';

// 👁️ Importar iconos necesarios
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;

  // 👁️ Variables para controlar la visibilidad de las contraseñas
  showPassword = false;
  showConfirmPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    // 👁️ Registrar iconos de ojo
    addIcons({ eyeOutline, eyeOffOutline });
  }

  // 👁️ Función para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // 👁️ Función para mostrar/ocultar confirmar contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    // 🧹 Limpiar espacios
    this.nombre = this.nombre.trim();
    this.email = this.email.trim();

    // ✅ Validaciones
    if (!this.nombre) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (this.nombre.length < 3) {
      this.errorMessage = 'El nombre debe tener al menos 3 caracteres';
      return;
    }

    if (!this.email) {
      this.errorMessage = 'El email es obligatorio';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      // ✅ Registrar usuario (el servicio maneja todo)
      await this.auth.register(this.email, this.password, this.nombre);

      console.log('✅ Registro exitoso. Redirigiendo a verificación...');
      
      // ✅ Redirigir a página de verificación
      this.router.navigateByUrl('/verificar', { replaceUrl: true });

    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      
      // Mensajes de error más amigables
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'Contraseña muy débil';
      } else {
        this.errorMessage = error.message || 'Error al registrar usuario';
      }
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}