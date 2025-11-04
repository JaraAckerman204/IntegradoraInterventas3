// ==========================================
// 📄 contacto.page.ts - CON FIRESTORE + EMAILJS
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

// ✅ Firestore imports
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

// ✅ EmailJS
import emailjs from '@emailjs/browser';

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

  formData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  isSending = false;

  constructor(
    private toastController: ToastController,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    console.log('✅ Página de contacto inicializada');
  }

  async sendMessage(event: Event) {
    event.preventDefault();

    if (!this.formData.name.trim() || !this.formData.email.trim() || !this.formData.message.trim()) {
      await this.showToast('Por favor completa los campos requeridos (*)', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      await this.showToast('Correo inválido', 'warning');
      return;
    }

    this.isSending = true;

    try {
      // ✅ Guardar en Firestore
      const messagesRef = collection(this.firestore, 'contactMessages');
      await addDoc(messagesRef, {
        ...this.formData,
        date: new Date().toISOString()
      });

   // ✅ Enviar email con EmailJS
await emailjs.send(
  'service_i4xbqss',
  'template_ecmfpdo',
  {
    nombre: this.formData.name,
    email: this.formData.email,
    phone: this.formData.phone,
    company: this.formData.company,
    mensaje: this.formData.message
  },
  'eSh72EoK4k2SontZF'
);


      await this.showToast('✅ ¡Mensaje enviado y correo confirmado!', 'success');

      this.formData = {
        name: '', email: '', phone: '', company: '', message: ''
      };

    } catch (error) {
      console.error(error);
      await this.showToast('❌ Error enviando mensaje', 'danger');
    }

    this.isSending = false;
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3500,
      position: 'top',
      color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
