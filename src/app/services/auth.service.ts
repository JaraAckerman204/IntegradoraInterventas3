import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  reload,
  User
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 👤 Observable que guarda el usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    // 🔥 Escucha el estado de autenticación en tiempo real
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // 🔑 Iniciar sesión
  async login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      await reload(user); // actualiza estado de verificación

      if (!user.emailVerified) {
        // Si el correo no está verificado, cerrar sesión
        await signOut(this.auth);
        throw new Error('Debes verificar tu correo antes de iniciar sesión.');
      }

      return user;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // 🧾 Registrar usuario
  async register(email: string, password: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);

      // Enviar correo de verificación
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado a:', user.email);

      // Opcional: cerrar sesión hasta que verifique
      await signOut(this.auth);
      return user;
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  // 📩 Reenviar correo de verificación
  async resendVerificationEmail() {
    const user = this.auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      console.log('Correo de verificación reenviado a:', user.email);
    } else {
      console.warn('El usuario ya está verificado o no ha iniciado sesión.');
    }
  }

  // 🚪 Cerrar sesión
  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  // 🔍 Obtener usuario actual directamente
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
