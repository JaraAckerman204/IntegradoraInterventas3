import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  getAuth, 
  updateProfile, 
  updateEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  deleteUser,
  verifyBeforeUpdateEmail
} from 'firebase/auth';

// ✅ IMPORTAR FIRESTORE
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { inject } from '@angular/core';

// ✅ IMPORTAR TOAST SERVICE
import { ToastService } from '../services/toast.service';

// Componentes compartidos
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// Ionic Components
import {
  IonContent,
  IonInput,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';

// Iconos
import { addIcons } from 'ionicons';
import {
  personOutline,
  personCircleOutline,
  mailOutline,
  createOutline,
  checkmarkOutline,
  eyeOutline,
  eyeOffOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  shieldCheckmarkOutline,
  keyOutline,
  trashOutline,
  chevronForwardOutline,
  calendarOutline,
  warningOutline,
  closeOutline,
  sendOutline,
  lockClosedOutline,
  settingsOutline,
  refreshOutline,
  logInOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    IonContent,
    IonInput,
    IonSpinner,
    IonIcon
  ],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  // ✅ INYECTAR SERVICIOS
  private firestore = inject(Firestore);
  private toastService = inject(ToastService);

  // Datos del usuario
  displayName: string = '';
  email: string = '';
  currentPassword: string = '';
  
  // ✅ DATOS ADICIONALES DE FIRESTORE
  userId: string = '';
  userRole: string = 'usuario';
  fechaCreacion: string = '';
  
  // ✅ NUEVO: Email pendiente de verificación
  emailPendiente: string | null = null;
  mostrarBannerVerificacion: boolean = false;
  
  // ✅ NUEVO: Estado de éxito
  cambioExitoso: boolean = false;
  
  // Estados de carga
  savingName: boolean = false;
  savingEmail: boolean = false;
  showPreloader: boolean = false;
  verificandoEmail: boolean = false;
  
  // ✅ ESTADOS DE MODALES
  mostrarModalCambiarPassword: boolean = false;
  mostrarModalEliminarCuenta: boolean = false;
  mostrarModalConfirmarPassword: boolean = false;
  mostrarModalEditarNombre: boolean = false;
  mostrarModalEditarEmail: boolean = false;
  
  // Variables temporales para modales
  tempDisplayName: string = '';
  tempEmail: string = '';
  passwordEliminacion: string = '';
  
  // Visibilidad de contraseñas en modales
  showDeletePassword: boolean = false;
  showEmailPassword: boolean = false;

  constructor(private router: Router) {
    // Registrar iconos
    addIcons({
      personOutline,
      personCircleOutline,
      mailOutline,
      createOutline,
      checkmarkOutline,
      eyeOutline,
      eyeOffOutline,
      informationCircleOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      shieldCheckmarkOutline,
      keyOutline,
      trashOutline,
      chevronForwardOutline,
      calendarOutline,
      warningOutline,
      closeOutline,
      sendOutline,
      lockClosedOutline,
      settingsOutline,
      refreshOutline,
      logInOutline
    });
  }

  async ngOnInit() {
    await this.loadUserData();
    
    // ✅ Verificar si el usuario verificó su email
    const auth = getAuth();
    if (auth.currentUser) {
      await this.verificarCambioEmail();
    }
    
    // 🐛 DEBUG: Ver el usuario actual
    console.log('👤 Usuario actual:', {
      uid: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      displayName: auth.currentUser?.displayName
    });
  }

  // ========================================
  // 📥 CARGAR DATOS DEL USUARIO
  // ========================================

  async loadUserData() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      this.email = user.email || '';
      this.userId = user.uid;
      
      console.log('🔍 UID del usuario actual:', user.uid);
      console.log('📧 Email del usuario actual:', user.email);
      
      // ✅ OBTENER DATOS DESDE FIRESTORE
      await this.obtenerDatosFirestore(user.uid);
    } else {
      // Si no hay usuario, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  async obtenerDatosFirestore(uid: string) {
    try {
      const auth = getAuth();
      const userEmail = auth.currentUser?.email;
      
      if (!userEmail) {
        console.error('❌ No se pudo obtener el email del usuario');
        return;
      }
      
      console.log('🔍 Buscando usuario por email:', userEmail);
      
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        
        // ✅ Asignar los datos
        this.displayName = userData['nombre'] || '';
        this.userRole = userData['rol'] || 'usuario';
        this.fechaCreacion = userData['fechaCreacion'] || '';
        
        // ✅ VERIFICAR SI HAY EMAIL PENDIENTE
        this.emailPendiente = userData['emailPendiente'] || null;
        this.mostrarBannerVerificacion = !!this.emailPendiente;
        
        console.log('✅ Datos cargados desde Firestore:');
        console.log('   - Nombre:', this.displayName);
        console.log('   - Rol:', this.userRole);
        console.log('   - Fecha:', this.fechaCreacion);
        
        if (this.emailPendiente) {
          console.log('⚡️ Email pendiente de verificación:', this.emailPendiente);
          await this.toastService.show('⚡️ Tienes un cambio de email pendiente. Verifica tu nuevo correo.');
        }
        
      } else {
        console.warn('⚠️ Usuario no encontrado en Firestore');
        const auth = getAuth();
        this.displayName = auth.currentUser?.displayName || '';
        this.fechaCreacion = 'Enero 2025';
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos de Firestore:', error);
      const auth = getAuth();
      this.displayName = auth.currentUser?.displayName || '';
      this.fechaCreacion = 'Enero 2025';
    }
  }

  // ========================================
  // ✏️ MODAL EDITAR NOMBRE
  // ========================================

  abrirModalEditarNombre() {
    this.tempDisplayName = this.displayName;
    this.mostrarModalEditarNombre = true;
  }

  cerrarModalEditarNombre() {
    this.mostrarModalEditarNombre = false;
    this.tempDisplayName = '';
  }

  async guardarNombre() {
    if (!this.tempDisplayName?.trim()) {
      await this.toastService.show('⚠️ El nombre no puede estar vacío');
      return;
    }

    if (this.tempDisplayName.trim().length < 3) {
      await this.toastService.show('⚠️ El nombre debe tener al menos 3 caracteres');
      return;
    }

    this.savingName = true;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        await this.toastService.show('❌ No se pudo obtener el usuario actual');
        this.savingName = false;
        return;
      }

      // 1. Actualizar en Firebase Auth
      await updateProfile(user, {
        displayName: this.tempDisplayName.trim()
      });

      console.log('✅ Nombre actualizado en Firebase Auth');

      // 2. Actualizar en Firestore
      await this.actualizarNombreFirestore(user.uid, this.tempDisplayName.trim());

      // 3. Actualizar variable local
      this.displayName = this.tempDisplayName.trim();
      
      this.savingName = false;
      this.cerrarModalEditarNombre();
      await this.toastService.show('✅ Nombre actualizado correctamente');
    } catch (error: any) {
      console.error('❌ Error al actualizar nombre:', error);
      this.savingName = false;
      await this.toastService.show('❌ Error al actualizar el nombre');
    }
  }

  async actualizarNombreFirestore(uid: string, nuevoNombre: string): Promise<boolean> {
    try {
      const auth = getAuth();
      const userEmail = auth.currentUser?.email;
      
      if (!userEmail) {
        console.error('❌ No se pudo obtener el email del usuario');
        return false;
      }
      
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
        await updateDoc(userDocRef, { nombre: nuevoNombre });
        console.log('✅ Nombre actualizado en Firestore correctamente');
        return true;
      } else {
        console.error('❌ No se encontró el documento del usuario en Firestore');
        return false;
      }
    } catch (error) {
      console.error('❌ Error actualizando nombre en Firestore:', error);
      return false;
    }
  }

  // ========================================
  // 📧 MODAL EDITAR EMAIL
  // ========================================

  abrirModalEditarEmail() {
    this.tempEmail = this.email;
    this.currentPassword = '';
    this.showEmailPassword = false;
    this.mostrarModalEditarEmail = true;
  }

  cerrarModalEditarEmail() {
    this.mostrarModalEditarEmail = false;
    this.tempEmail = '';
    this.currentPassword = '';
    this.showEmailPassword = false;
  }

  async guardarEmail() {
    if (!this.tempEmail?.trim()) {
      await this.toastService.show('⚠️ El correo no puede estar vacío');
      return;
    }

    if (!this.currentPassword) {
      await this.toastService.show('⚠️ Debes ingresar tu contraseña actual');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.tempEmail)) {
      await this.toastService.show('⚠️ Formato de correo inválido');
      return;
    }

    this.savingEmail = true;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        await this.toastService.show('❌ No se pudo obtener el usuario actual');
        this.savingEmail = false;
        return;
      }

      // ✅ GUARDAR EMAIL ANTERIOR
      const emailAnterior = user.email;
      console.log('📧 Email anterior:', emailAnterior);
      console.log('📧 Email nuevo:', this.tempEmail.trim());

      // ✅ 1. REAUTENTICAR USUARIO PRIMERO
      const credential = EmailAuthProvider.credential(emailAnterior, this.currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log('✅ Usuario reautenticado');

      // ✅ 2. ENVIAR EMAIL DE VERIFICACIÓN
      await verifyBeforeUpdateEmail(user, this.tempEmail.trim());
      console.log('✅ Email de verificación enviado');

      // ✅ 3. ACTUALIZAR EN FIRESTORE (con estado pendiente)
      await this.actualizarEmailFirestorePendiente(emailAnterior, this.tempEmail.trim());

      // ✅ 4. ACTUALIZAR VARIABLE LOCAL Y MOSTRAR BANNER
      this.emailPendiente = this.tempEmail.trim();
      this.mostrarBannerVerificacion = true;

      this.savingEmail = false;
      this.cerrarModalEditarEmail();
      await this.toastService.show('📧 Se ha enviado un correo de verificación. Verifica tu nuevo correo para completar el cambio.');
      
    } catch (error: any) {
      console.error('❌ Error al actualizar email:', error);
      this.savingEmail = false;

      if (error.code === 'auth/wrong-password') {
        await this.toastService.show('❌ Contraseña incorrecta');
      } else if (error.code === 'auth/email-already-in-use') {
        await this.toastService.show('❌ Este correo ya está en uso');
      } else if (error.code === 'auth/requires-recent-login') {
        await this.toastService.show('⚠️ Por seguridad, inicia sesión nuevamente');
      } else if (error.code === 'auth/invalid-email') {
        await this.toastService.show('❌ Formato de correo inválido');
      } else if (error.code === 'auth/operation-not-allowed') {
        await this.toastService.show('⚠️ Verifica tu nuevo correo antes de continuar');
      } else {
        await this.toastService.show('❌ Error al actualizar el correo');
      }
    }
  }

  async actualizarEmailFirestorePendiente(emailAnterior: string, nuevoEmail: string): Promise<boolean> {
    try {
      if (!emailAnterior) {
        console.error('❌ No se proporcionó el email anterior');
        return false;
      }

      console.log('🔍 Buscando documento con email:', emailAnterior);
      
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', emailAnterior));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        console.log('📄 Documento encontrado:', userDocId);
        
        const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
        
        // Guardar email pendiente de verificación
        await updateDoc(userDocRef, { 
          emailPendiente: nuevoEmail,
          emailPendienteDesde: new Date().toISOString(),
          ultimaActualizacion: new Date().toISOString()
        });
        
        console.log('✅ Email pendiente guardado en Firestore');
        console.log('   Email actual:', emailAnterior);
        console.log('   Email pendiente:', nuevoEmail);
        return true;
      } else {
        console.error('❌ No se encontró el documento del usuario en Firestore');
        console.error('   Email buscado:', emailAnterior);
        return false;
      }
    } catch (error) {
      console.error('❌ Error guardando email pendiente en Firestore:', error);
      return false;
    }
  }

  // ========================================
  // ✅ VERIFICAR CAMBIO DE EMAIL
  // ========================================

  /**
   * ✅ NUEVA FUNCIÓN: Verificar si el usuario completó el cambio de email
   * Se ejecuta automáticamente al cargar la página
   */
  async verificarCambioEmail() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('❌ No hay usuario autenticado');
        return;
      }

      // Recargar datos del usuario desde Auth
      await user.reload();
      
      const emailActual = user.email;
      
      if (!emailActual) {
        console.error('❌ No se pudo obtener el email actual');
        return;
      }

      console.log('🔍 Verificando email actual:', emailActual);
      console.log('🔍 Email pendiente:', this.emailPendiente);

      // Buscar documento con emailPendiente que coincida con el email actual
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('emailPendiente', '==', emailActual));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ Se detectó cambio de email verificado');
        
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
        
        // Actualizar email definitivamente en Firestore
        await updateDoc(userDocRef, { 
          email: emailActual,
          emailPendiente: null,
          emailPendienteDesde: null,
          emailVerificadoEl: new Date().toISOString(),
          ultimaActualizacion: new Date().toISOString()
        });
        
        // Actualizar variables locales
        this.email = emailActual;
        this.emailPendiente = null;
        this.mostrarBannerVerificacion = false;
        
        console.log('✅ Cambio de email completado en Firestore');
        await this.toastService.show('✅ ¡Email verificado correctamente! Tu correo ha sido actualizado.');
      } else {
        console.log('ℹ️ No hay cambios de email pendientes de verificar');
      }
    } catch (error) {
      console.error('❌ Error verificando cambio de email:', error);
    }
  }

/**
 * ✅ NUEVA FUNCIÓN: Verificar manualmente desde el banner
 */
async verificarEmailManualmente() {
  this.verificandoEmail = true;
  window.location.reload();
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      await this.toastService.show('❌ No hay usuario autenticado');
      this.verificandoEmail = false;
      return;
    }

    // Recargar datos del usuario desde Auth
    await user.reload();
    
    const emailActual = user.email;
    
    if (!emailActual) {
      await this.toastService.show('❌ No se pudo obtener el email actual');
      this.verificandoEmail = false;
      return;
    }

    console.log('🔍 Email actual en Auth:', emailActual);
    console.log('🔍 Email pendiente:', this.emailPendiente);

    // Verificar si el email actual coincide con el pendiente
    if (emailActual === this.emailPendiente) {
      // ✅ ¡Email verificado!
      console.log('✅ Email verificado exitosamente');
      
      // Buscar y actualizar en Firestore
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('emailPendiente', '==', emailActual));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
        
        // Actualizar email definitivamente en Firestore
        await updateDoc(userDocRef, { 
          email: emailActual,
          emailPendiente: null,
          emailPendienteDesde: null,
          emailVerificadoEl: new Date().toISOString(),
          ultimaActualizacion: new Date().toISOString()
        });
        
        console.log('✅ Email actualizado en Firestore');
        
        await this.toastService.show('✅ ¡Email verificado correctamente!');
        
        // ✅ RECARGAR LA PÁGINA
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Espera 1 segundo para que el usuario vea el toast
        
      } else {
        await this.toastService.show('❌ Error al actualizar en Firestore');
        this.verificandoEmail = false;
      }
    } else {
      // ❌ Email no verificado aún
      await this.toastService.show('⚠️ Aún no has verificado tu nuevo correo. Revisa tu bandeja de entrada.');
      this.verificandoEmail = false;
    }
  } catch (error) {
    console.error('❌ Error verificando email:', error);
    await this.toastService.show('❌ Error al verificar el email');
    this.verificandoEmail = false;
  }
}

  /**
   * ✅ NUEVA FUNCIÓN: Cancelar cambio de email pendiente
   */
  async cancelarCambioEmail() {
    try {
      const auth = getAuth();
      const userEmail = auth.currentUser?.email;
      
      if (!userEmail) {
        await this.toastService.show('❌ No se pudo obtener el email del usuario');
        return;
      }
      
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDocId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
        
        await updateDoc(userDocRef, { 
          emailPendiente: null,
          emailPendienteDesde: null,
          ultimaActualizacion: new Date().toISOString()
        });
        
        this.emailPendiente = null;
        this.mostrarBannerVerificacion = false;
        
        await this.toastService.show('✅ Cambio de email cancelado');
      }
    } catch (error) {
      console.error('❌ Error cancelando cambio de email:', error);
      await this.toastService.show('❌ Error al cancelar el cambio de email');
    }
  }

  /**
   * ✅ NUEVA FUNCIÓN: Cerrar sesión y redirigir al login
   */
  async irAlLogin() {
    try {
      const auth = getAuth();
      
      // Mostrar mensaje
      await this.toastService.show('👋 Cerrando sesión...');
      
      // Cerrar sesión en Firebase
      await auth.signOut();
      
      // Redirigir al login
      this.router.navigate(['/login']);
      
      console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      await this.toastService.show('❌ Error al cerrar sesión');
    }
  }

  // ========================================
  // 🔑 MODAL CAMBIAR CONTRASEÑA
  // ========================================

  changePassword() {
    this.mostrarModalCambiarPassword = true;
  }

  cerrarModalCambiarPassword() {
    this.mostrarModalCambiarPassword = false;
  }

  async confirmarCambioPassword() {
    this.cerrarModalCambiarPassword();
    await this.sendPasswordResetEmail();
  }

  async sendPasswordResetEmail() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      await this.toastService.show('❌ No se pudo obtener el correo del usuario');
      return;
    }

    this.showPreloader = true;
    await this.toastService.show('📧 Enviando correo de recuperación...');

    try {
      await sendPasswordResetEmail(auth, user.email);
      
      setTimeout(async () => {
        this.showPreloader = false;
        await this.toastService.show('✅ Se ha enviado un correo para restablecer tu contraseña');
      }, 1500);
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error);
      this.showPreloader = false;
      await this.toastService.show('❌ Error al enviar el correo de recuperación');
    }
  }

  // ========================================
  // 🗑️ MODAL ELIMINAR CUENTA
  // ========================================

  confirmDeleteAccount() {
    this.mostrarModalEliminarCuenta = true;
  }

  cerrarModalEliminarCuenta() {
    this.mostrarModalEliminarCuenta = false;
  }

  solicitarPasswordEliminacion() {
    this.cerrarModalEliminarCuenta();
    this.passwordEliminacion = '';
    this.showDeletePassword = false;
    this.mostrarModalConfirmarPassword = true;
  }

  cerrarModalConfirmarPassword() {
    this.mostrarModalConfirmarPassword = false;
    this.passwordEliminacion = '';
    this.showDeletePassword = false;
  }

async ejecutarEliminacionCuenta() {
  if (!this.passwordEliminacion) {
    await this.toastService.show('⚠️ Debes ingresar tu contraseña');
    return;
  }
  
  // ✅ GUARDAR la contraseña ANTES de cerrar el modal
  const password = this.passwordEliminacion;
  
  this.cerrarModalConfirmarPassword();
  await this.deleteAccount(password);
}

async deleteAccount(password: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    await this.toastService.show('❌ No se pudo obtener el usuario actual');
    return;
  }

  this.showPreloader = true;
  
  try {
    console.log('🔐 PASO 1: Reautenticando usuario...');
    
    // ✅ Reautenticar usuario
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    console.log('✅ PASO 1: Usuario reautenticado correctamente');
    
    // 🔍 PASO 2: Buscar en Firestore
    console.log('🔍 PASO 2: Buscando en Firestore...');
    const usuariosRef = collection(this.firestore, 'usuarios');
    const q = query(usuariosRef, where('email', '==', user.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // 🗑️ PASO 3: Eliminar de Firestore
      const userDocId = querySnapshot.docs[0].id;
      const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
      await deleteDoc(userDocRef);
      console.log('✅ PASO 3: Eliminado de Firestore');
    }
    
    // 🗑️ PASO 4: Eliminar de Firebase Auth (¡IMPORTANTE!)
    console.log('🗑️ PASO 4: Eliminando de Auth...');
    await deleteUser(user);
    console.log('✅ PASO 4: Eliminado de Auth correctamente');
    
    // ✅ Todo correcto
    this.showPreloader = false;
    await this.toastService.show('✅ Cuenta eliminada correctamente');
    this.router.navigate(['/login']);
    
  } catch (error: any) {
    console.error('❌ ERROR EN ELIMINACIÓN:', error);
    console.error('   Código:', error.code);
    console.error('   Mensaje:', error.message);
    this.showPreloader = false;
    
    if (error.code === 'auth/wrong-password') {
      await this.toastService.show('❌ Contraseña incorrecta');
    } else if (error.code === 'auth/requires-recent-login') {
      await this.toastService.show('⚠️ Por seguridad, inicia sesión nuevamente');
    } else {
      await this.toastService.show(`❌ Error: ${error.message}`);
    }
  }
}

 async eliminarUsuarioFirestore(uid: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const userEmail = auth.currentUser?.email;
    
    if (!userEmail) {
      console.error('❌ No se pudo obtener el email del usuario');
      await this.toastService.show('❌ Error: No se pudo obtener el email del usuario');
      return false;
    }
    
    console.log('🔍 Buscando usuario con email:', userEmail);
    
    const usuariosRef = collection(this.firestore, 'usuarios');
    const q = query(usuariosRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    console.log('📊 Documentos encontrados:', querySnapshot.size);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDocId = userDoc.id;
      const userData = userDoc.data();
      
      console.log('📄 Documento encontrado:');
      console.log('   - ID:', userDocId);
      console.log('   - Email:', userData['email']);
      console.log('   - Nombre:', userData['nombre']);
      
      const userDocRef = doc(this.firestore, `usuarios/${userDocId}`);
      await deleteDoc(userDocRef);
      
      console.log('✅ Usuario eliminado de Firestore correctamente');
      return true;
    } else {
      console.error('❌ No se encontró el documento del usuario en Firestore');
      console.error('   Email buscado:', userEmail);
      
      // 🔍 DEBUG: Listar todos los usuarios para ver qué hay
      const todosSnapshot = await getDocs(usuariosRef);
      console.log('📋 Total usuarios en Firestore:', todosSnapshot.size);
      todosSnapshot.forEach(doc => {
        console.log('   Usuario:', {
          id: doc.id,
          email: doc.data()['email'],
          nombre: doc.data()['nombre']
        });
      });
      
      await this.toastService.show('❌ No se encontró tu usuario en la base de datos');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error eliminando usuario de Firestore:', error);
    console.error('   Código de error:', error.code);
    console.error('   Mensaje:', error.message);
    await this.toastService.show(`❌ Error al eliminar: ${error.message}`);
    return false;
  }
}

  // ========================================
  // 🛠️ UTILIDADES
  // ========================================

  obtenerTextoRol(): string {
    return this.userRole === 'admin' ? 'Administrador' : 'Usuario';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      const date = new Date(fecha);
      
      if (isNaN(date.getTime())) {
        return fecha;
      }
      
      return date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return fecha;
    }
  }
}