import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  reload,
  User,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // ✅ CORREGIDO: Sin await en el constructor
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Sincronizar sin bloquear
        this.sincronizarEstadoVerificacion(user).catch(err => {
          console.error('Error en sincronización automática:', err);
        });
      }
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

      // ✅ Actualizar emailVerificado en Firestore
      await this.actualizarEstadoVerificacion(user.uid, true);

      this.currentUserSubject.next(user);
      return user;
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      throw error;
    }
  }

  /** 🧾 Registrar usuario */
  async register(email: string, password: string, nombre: string) {
    try {
      console.log('🔵 Iniciando registro:', { email, nombre });
      
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('🟢 Usuario creado en Auth:', user.uid);
      
      await updateProfile(user, {
        displayName: nombre
      });

      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      const userData = {
        nombre: nombre,
        email: email,
        rol: 'usuario',
        fechaCreacion: new Date().toISOString(),
        emailVerificado: false
      };
      
      console.log('🔵 Guardando en Firestore:', userData);
      await setDoc(userRef, userData);
      console.log('🟢 Guardado exitosamente');

      await sendEmailVerification(user);
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      
      return user;
    } catch (error: any) {
      console.error('❌ Error al registrar:', error);
      throw error;
    }
  }

  /** ✅ Actualizar estado de verificación en Firestore */
  private async actualizarEstadoVerificacion(uid: string, verificado: boolean) {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(userRef, {
        emailVerificado: verificado
      });
      console.log(`✅ Estado de verificación actualizado: ${verificado}`);
    } catch (error) {
      console.error('❌ Error al actualizar verificación:', error);
    }
  }

  /** 🔄 Sincronizar estado de verificación */
  private async sincronizarEstadoVerificacion(user: User) {
    try {
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        const verificadoEnFirestore = data['emailVerificado'] || false;
        const verificadoEnAuth = user.emailVerified;

        if (verificadoEnAuth && !verificadoEnFirestore) {
          await updateDoc(userRef, {
            emailVerificado: true
          });
          console.log('🔄 Sincronizado: emailVerificado actualizado a true');
        }
      }
    } catch (error) {
      console.error('Error en sincronización:', error);
    }
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

  /** 🔐 Restablecer contraseña */
  async sendPasswordReset(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }

  /** 📝 Obtener datos completos del usuario */
  async getUserData(uid: string) {
    const docRef = doc(this.firestore, `usuarios/${uid}`);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  }
}