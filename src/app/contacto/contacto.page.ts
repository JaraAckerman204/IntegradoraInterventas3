// ==========================================
// 📄 contacto.page.ts - CON FIRESTORE + EMAILJS + TOAST SERVICE
// ==========================================

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { 
  chatbubblesOutline,
  personOutline,
  mailOutline,
  callOutline,
  businessOutline,
  chatboxOutline,
  sendOutline,
  call,
  mail,
  locationOutline,
  location,
  timeOutline,
  time,
  shieldCheckmarkOutline,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// ✅ Firestore imports
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

// ✅ EmailJS
import emailjs from '@emailjs/browser';

// ✅ Toast Service
import { ToastService } from '../services/toast.service';

// Registrar Iconos
addIcons({
  'chatbubbles-outline': chatbubblesOutline,
  'person-outline': personOutline,
  'mail-outline': mailOutline,
  'call-outline': callOutline,
  'business-outline': businessOutline,
  'chatbox-outline': chatboxOutline,
  'send-outline': sendOutline,
  'call': call,
  'mail': mail,
  'location-outline': locationOutline,
  'location': location,
  'time-outline': timeOutline,
  'time': time,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'logo-facebook': logoFacebook,
  'logo-instagram': logoInstagram,
  'logo-whatsapp': logoWhatsapp
});

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonIcon,
    IonSpinner,
    HeaderComponent,
    FooterComponent
  ]
})
export class ContactoPage implements OnInit {

  // =============================
  // 🔧 SERVICIOS INYECTADOS
  // =============================
  private firestore = inject(Firestore);
  private toastService = inject(ToastService);

  // =============================
  // 📝 DATOS DEL FORMULARIO
  // =============================
  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  isSending = false;

  // =============================
  // 🎬 CONSTRUCTOR E INICIALIZACIÓN
  // =============================
  constructor() {
    this.inicializarEmailJS();
  }

  ngOnInit() {
    console.log('✅ Página de contacto inicializada');
  }

  // =============================
  // 🔧 INICIALIZACIÓN DE EMAILJS
  // =============================
  private inicializarEmailJS() {
    emailjs.init({ publicKey: 'eSh72EoK4k2SontZF' });
  }

  // =============================
  // 💬 UTILIDAD - TOAST
  // =============================
  async mostrarToast(mensaje: string) {
    await this.toastService.show(mensaje);
  }

  // =============================
  // 📤 ENVÍO DE MENSAJE
  // =============================
  async sendMessage(event: Event) {
    event.preventDefault();

    // Validación de campos requeridos
    if (!this.validarFormulario()) {
      return;
    }

    this.isSending = true;
    await this.mostrarToast('📨 Enviando tu mensaje...');

    try {
      // ✅ Guardar en Firestore
      await this.guardarEnFirestore();

      // ✅ Enviar email con EmailJS
      await this.enviarEmail();

      // ✅ Mostrar mensaje de éxito
      await this.mostrarToast('✅ ¡Mensaje enviado correctamente! Te contactaremos pronto');

      // ✅ Limpiar formulario
      this.limpiarFormulario();

    } catch (error) {
      console.error('Error en envío:', error);
      await this.mostrarToast('❌ Error al enviar el mensaje. Por favor intenta de nuevo');
    } finally {
      this.isSending = false;
    }
  }

  // =============================
  // ✅ VALIDACIÓN DEL FORMULARIO
  // =============================
  private validarFormulario(): boolean {
    // Validar campos requeridos
    if (!this.formData.name.trim()) {
      this.mostrarToast('⚠️ Por favor ingresa tu nombre');
      return false;
    }

    if (!this.formData.email.trim()) {
      this.mostrarToast('⚠️ Por favor ingresa tu correo electrónico');
      return false;
    }

    if (!this.formData.message.trim()) {
      this.mostrarToast('⚠️ Por favor escribe tu mensaje');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.mostrarToast('⚠️ Por favor ingresa un correo electrónico válido');
      return false;
    }

    // Validar teléfono si fue ingresado
    if (this.formData.phone.trim() && !this.validarTelefono(this.formData.phone)) {
      this.mostrarToast('⚠️ Por favor ingresa un número de teléfono válido');
      return false;
    }

    // Validar longitud mínima del mensaje
    if (this.formData.message.trim().length < 10) {
      this.mostrarToast('⚠️ El mensaje debe tener al menos 10 caracteres');
      return false;
    }

    return true;
  }

  // =============================
  // 📞 VALIDACIÓN DE TELÉFONO
  // =============================
  private validarTelefono(telefono: string): boolean {
    // Remover espacios, guiones y paréntesis
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');
    
    // Validar que solo contenga números y tenga longitud apropiada (10-15 dígitos)
    const telefonoRegex = /^\d{10,15}$/;
    return telefonoRegex.test(telefonoLimpio);
  }

  // =============================
  // 💾 GUARDAR EN FIRESTORE
  // =============================
  private async guardarEnFirestore(): Promise<void> {
    try {
      const messagesRef = collection(this.firestore, 'contactMessages');
      await addDoc(messagesRef, {
        ...this.formData,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        leido: false
      });
      console.log('✅ Mensaje guardado en Firestore');
    } catch (error) {
      console.error('❌ Error guardando en Firestore:', error);
      throw new Error('Error al guardar el mensaje');
    }
  }

  // =============================
  // 📧 ENVIAR EMAIL CON EMAILJS
  // =============================
  private async enviarEmail(): Promise<void> {
    try {
      await emailjs.send(
        'service_i4xbqss',
        'template_ecmfpdo',
        {
          nombre: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone || 'No proporcionado',
          company: this.formData.company || 'No proporcionada',
          mensaje: this.formData.message
        }
      );
      console.log('✅ Email enviado correctamente');
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      // No lanzamos error aquí para que el mensaje se guarde en Firestore aunque falle el email
      await this.mostrarToast('⚠️ Mensaje guardado pero hubo un problema al enviar la notificación por email');
    }
  }

  // =============================
  // 🧹 LIMPIAR FORMULARIO
  // =============================
  private limpiarFormulario(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    };
  }

  // =============================
  // 📋 VALIDACIÓN EN TIEMPO REAL (OPCIONAL)
  // =============================
  onNombreChange() {
    if (this.formData.name.trim() && this.formData.name.length < 3) {
      this.mostrarToast('⚠️ El nombre debe tener al menos 3 caracteres');
    }
  }

  onEmailChange() {
    if (this.formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        // Solo mostrar cuando tenga cierta longitud para no molestar al inicio
        if (this.formData.email.length > 5) {
          this.mostrarToast('⚠️ Formato de email inválido');
        }
      }
    }
  }

  onTelefonoChange() {
    if (this.formData.phone.trim() && this.formData.phone.length > 7) {
      if (!this.validarTelefono(this.formData.phone)) {
        this.mostrarToast('⚠️ Formato de teléfono inválido');
      }
    }
  }

  // =============================
  // 📱 ACCIONES RÁPIDAS
  // =============================
  llamarTelefono(numero: string) {
    window.location.href = `tel:${numero}`;
    this.mostrarToast('📞 Abriendo aplicación de llamadas...');
  }

  enviarWhatsApp(numero: string) {
    const mensaje = encodeURIComponent('Hola, me gustaría obtener más información sobre sus productos.');
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
    this.mostrarToast('💬 Abriendo WhatsApp...');
  }

  enviarCorreo(email: string) {
    window.location.href = `mailto:${email}`;
    this.mostrarToast('📧 Abriendo aplicación de correo...');
  }

  abrirMapa() {
    const direccion = encodeURIComponent('Interventas, Torreón, Coahuila, México');
    window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
    this.mostrarToast('🗺️ Abriendo Google Maps...');
  }

  abrirRedSocial(red: string) {
    const urls: { [key: string]: string } = {
      facebook: 'https://facebook.com/interventas',
      instagram: 'https://instagram.com/interventas',
      whatsapp: 'https://wa.me/528711234567'
    };
    
    if (urls[red]) {
      window.open(urls[red], '_blank');
      this.mostrarToast(`🌐 Abriendo ${red.charAt(0).toUpperCase() + red.slice(1)}...`);
    }
  }

  // =============================
  // 📋 COPIAR AL PORTAPAPELES
  // =============================
  async copiarAlPortapapeles(texto: string, tipo: string) {
    try {
      await navigator.clipboard.writeText(texto);
      this.mostrarToast(`✅ ${tipo} copiado al portapapeles`);
    } catch (error) {
      console.error('Error copiando al portapapeles:', error);
      this.mostrarToast('❌ No se pudo copiar al portapapeles');
    }
  }
}