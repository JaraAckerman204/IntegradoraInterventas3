// ==========================================
// 📄 contacto.page.ts - CÓDIGO COMPLETO
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon,
  IonSpinner,
  ToastController 
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

// Registrar todos los iconos
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

  // 📋 Datos del formulario
  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  // 🔄 Estado de envío
  isSending = false;

  constructor(
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('✅ Página de contacto inicializada');
  }

  // 📧 FUNCIÓN PARA ENVIAR MENSAJE
  async sendMessage(event: Event) {
    event.preventDefault();
    
    // Validación básica
    if (!this.formData.name.trim() || !this.formData.email.trim() || !this.formData.message.trim()) {
      await this.showToast('Por favor completa todos los campos requeridos (*)' , 'warning');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      await this.showToast('Por favor ingresa un correo válido', 'warning');
      return;
    }
    
    this.isSending = true;
    
    // Simular envío de mensaje
    setTimeout(async () => {
      // Log para desarrollo
      console.log('✅ Mensaje enviado:', {
        nombre: this.formData.name.trim(),
        email: this.formData.email.trim(),
        telefono: this.formData.phone.trim(),
        empresa: this.formData.company.trim(),
        mensaje: this.formData.message.trim(),
        fecha: new Date().toISOString()
      });
      
      // Mostrar mensaje de éxito
      await this.showToast('¡Mensaje enviado con éxito! Te contactaremos pronto', 'success');
      
      // Limpiar formulario
      this.formData = {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      };
      
      this.isSending = false;
    }, 2000);
  }

  // 🍞 Toast Helper
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

}