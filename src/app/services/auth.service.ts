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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // 🔥 Escuchar cambios de sesión
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

      return user;
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      throw error;
    }
  }

  /** 🧾 Registrar usuario */
  async register(email: string, password: string) {
    const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(user);

    // 📝 Crear documento con rol "cliente"
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    await setDoc(userRef, { email, rol: 'cliente' });

    await signOut(this.auth);
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
}
