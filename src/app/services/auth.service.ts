import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
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
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🧾 Registrar usuario
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  // 🚪 Cerrar sesión
  async logout() {
    await signOut(this.auth);
  }

  // 🔍 Obtener usuario actual directamente
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
