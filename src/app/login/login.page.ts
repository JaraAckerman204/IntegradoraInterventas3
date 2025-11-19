import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🧩 Componentes compartidos
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// 🧱 Ionic Components
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSpinner,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

// 👁️ Importar iconos necesarios
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonSpinner,
    IonLabel,
    IonIcon
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPreloader = false; // Controla la visibilidad del preloader
  
  // 👁️ Variable para controlar la visibilidad de la contraseña
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    // 👁️ Registrar iconos de ojo
    addIcons({ eyeOutline, eyeOffOutline });
  }

  // 👁️ Función para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /** 🔐 Iniciar sesión con animación */
  async login() {
    // Validación básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.login(this.email, this.password);

      if (user) {
        const rol = await this.auth.getUserRole(user.uid);
        console.log('ROL DEL USUARIO:', rol);

        // ✨ Activar preloader con animación
        this.loading = false;
        this.showPreloader = true;

        // ⏱️ Esperar 2.5 segundos para que la animación de onda se aprecie
        setTimeout(() => {
          // Redirigir según el rol
          if (rol === 'admin') {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          }
          
          // Ocultar preloader después de navegar
          setTimeout(() => {
            this.showPreloader = false;
          }, 300);
        }, 2500);
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      this.errorMessage = 'Correo o contraseña incorrectos.';
      this.loading = false;
      this.showPreloader = false;
    }
  }

  async recoverPassword() {
    if (!this.email) {
      this.errorMessage = 'Ingresa tu correo electrónico para recuperar la contraseña.';
      return;
    }

    try {
      await this.auth.sendPasswordReset(this.email);
      alert('Se ha enviado un enlace de recuperación a tu correo.');
    } catch (error: any) {
      console.error('Error al recuperar contraseña:', error);
      this.errorMessage = 'Hubo un problema enviando el correo de recuperación.';
    }
  }

  /** 🧾 Redirigir a registro */
  goToRegister() {
    this.router.navigate(['/register']);
  }
}