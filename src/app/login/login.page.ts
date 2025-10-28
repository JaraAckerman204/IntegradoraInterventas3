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

  constructor(private auth: AuthService, private router: Router) {}

  /** 🔐 Iniciar sesión */
  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.auth.login(this.email, this.password);

      if (user) {
        const rol = await this.auth.getUserRole(user.uid);
        console.log('ROL DEL USUARIO:', rol);

        if (rol === 'admin') {
          this.router.navigateByUrl('/admin', { replaceUrl: true });
        } else {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      this.errorMessage = 'Correo o contraseña incorrectos.';
    } finally {
      this.loading = false;
    }
  }

  /** 🧾 Redirigir a registro */
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
