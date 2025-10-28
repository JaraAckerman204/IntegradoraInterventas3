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
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 👇 undefined = aún cargando, null = sin sesión, User = sesión activa
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // 🔥 Escuchar cambios en la sesión (Firebase maneja persistencia)
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  /** 🔑 Iniciar sesión */
  async login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      await reload(user);

      if (!user.emailVerified) {
        await signOut(this.auth);
        throw new Error('Debes verificar tu correo antes de iniciar sesión.');
      }

      this.currentUserSubject.next(user); // ✅ sincroniza el estado
      return user;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  /** 🧾 Registrar usuario */
  async register(email: string, password: string) {
    const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(user);

    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    await setDoc(userRef, { email, rol: 'cliente' });

    await signOut(this.auth);
    this.currentUserSubject.next(null);
    return user;
  }

  /** 🚪 Cerrar sesión */
  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  /** 🧠 Obtener rol del usuario */
  async getUserRole(uid: string): Promise<string | null> {
    const docRef = doc(this.firestore, `usuarios/${uid}`);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as any;
      return data.rol;
    }
    return null;
  }

  /** 🔍 Usuario actual */
  getCurrentUser() {
    return this.auth.currentUser;
  }

    /** 📧 Reenviar correo de verificación */
  async resendVerificationEmail() {
    const user = this.auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No hay usuario autenticado para reenviar el correo.');
    }
  }


}

