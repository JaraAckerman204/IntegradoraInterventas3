import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

// ✅ IMPORTAR TOAST SERVICE
import { ToastService } from '../services/toast.service';

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
export class LoginPage implements OnInit {
  // ✅ INYECTAR TOAST SERVICE
  private toastService = inject(ToastService);

  email = '';
  password = '';
  loading = false;
  showPreloader = false;
  
  // 👁️ Variable para controlar la visibilidad de la contraseña
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    // 👁️ Registrar iconos de ojo
    addIcons({ eyeOutline, eyeOffOutline });
  }

async ngOnInit() {
  console.log('🎬 ngOnInit ejecutándose...');
  
  // ✅ Verificar si viene de cambio de email exitoso
  const emailCambiadoExito = localStorage.getItem('emailCambiadoExito');
  const nuevoEmail = localStorage.getItem('nuevoEmail');
  
  console.log('📦 localStorage emailCambiadoExito:', emailCambiadoExito);
  console.log('📦 localStorage nuevoEmail:', nuevoEmail);
  
  if (emailCambiadoExito === 'true' && nuevoEmail) {
    console.log('✅ Condición cumplida, preparando toast...');
    
    // Pre-llenar el campo de email con el nuevo correo PRIMERO
    this.email = nuevoEmail;
    console.log('📧 Email pre-llenado:', this.email);
    
    // Limpiar localStorage ANTES del toast
    localStorage.removeItem('emailCambiadoExito');
    localStorage.removeItem('nuevoEmail');
    console.log('🗑️ localStorage limpiado');
    
    // Esperar 1 segundo para asegurar que la página está completamente cargada
    setTimeout(() => {
      console.log('🎯 Intentando mostrar toast...');
      this.toastService.show('✅ ¡Email cambiado correctamente! Inicia sesión con tu nuevo correo', 5000);
      console.log('📢 Toast llamado con duración 5000ms');
    }, 1000);
  } else {
    console.log('❌ Condición NO cumplida');
  }
}

  // ========================================
  // 👁️ MOSTRAR/OCULTAR CONTRASEÑA
  // ========================================
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // ========================================
  // 🔐 INICIAR SESIÓN
  // ========================================
  async login() {
    // Validación básica
    if (!this.email || !this.password) {
      await this.toastService.show('⚠️ Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.toastService.show('⚠️ Por favor ingresa un correo electrónico válido');
      return;
    }

    this.loading = true;

    try {
      const user = await this.auth.login(this.email, this.password);

      if (user) {
        const rol = await this.auth.getUserRole(user.uid);
        console.log('✅ ROL DEL USUARIO:', rol);

        // ✨ Activar preloader con animación
        this.loading = false;
        this.showPreloader = true;
        
        await this.toastService.show('✅ ¡Bienvenido! Iniciando sesión...');

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
      console.error('❌ Error de login:', error);
      this.loading = false;
      this.showPreloader = false;

      // Mensajes de error más específicos
      if (error.code === 'auth/user-not-found') {
        await this.toastService.show('❌ No existe una cuenta con este correo');
      } else if (error.code === 'auth/wrong-password') {
        await this.toastService.show('❌ Contraseña incorrecta');
      } else if (error.code === 'auth/invalid-email') {
        await this.toastService.show('❌ Formato de correo inválido');
      } else if (error.code === 'auth/user-disabled') {
        await this.toastService.show('❌ Esta cuenta ha sido deshabilitada');
      } else if (error.code === 'auth/too-many-requests') {
        await this.toastService.show('⚠️ Demasiados intentos. Intenta más tarde');
      } else if (error.code === 'auth/invalid-credential') {
        await this.toastService.show('❌ Correo o contraseña incorrectos');
      } else {
        await this.toastService.show('❌ Error al iniciar sesión. Verifica tus credenciales');
      }
    }
  }

  // ========================================
  // 🔑 RECUPERAR CONTRASEÑA
  // ========================================
  async recoverPassword() {
    if (!this.email) {
      await this.toastService.show('⚠️ Ingresa tu correo electrónico para recuperar la contraseña');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      await this.toastService.show('⚠️ Por favor ingresa un correo electrónico válido');
      return;
    }

    try {
      await this.auth.sendPasswordReset(this.email);
      await this.toastService.show('✅ Se ha enviado un enlace de recuperación a tu correo');
    } catch (error: any) {
      console.error('❌ Error al recuperar contraseña:', error);
      
      if (error.code === 'auth/user-not-found') {
        await this.toastService.show('❌ No existe una cuenta con este correo');
      } else if (error.code === 'auth/invalid-email') {
        await this.toastService.show('❌ Formato de correo inválido');
      } else {
        await this.toastService.show('❌ Hubo un problema enviando el correo de recuperación');
      }
    }
  }

  // ========================================
  // 🧾 REDIRIGIR A REGISTRO
  // ========================================
  goToRegister() {
    this.router.navigate(['/register']);
  }
}