import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🧩 Importar el componente de header
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
  IonLabel
} from '@ionic/angular/standalone';

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
    IonLabel
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  
  // 🎨 Variables para el efecto de borde degradado
  emailFocused = false;
  passwordFocused = false;

  constructor(private auth: AuthService, private router: Router) {}

  /** 🔐 Iniciar sesión */
  async login() {
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      console.error('Error de login:', error);
      this.errorMessage = 'Correo o contraseña incorrectos.';
    } finally {
      this.loading = false;
    }
  }

  /** 🧾 Redirigir a la página de registro */
  goToRegister() {
    this.router.navigate(['/register']);
  }
}