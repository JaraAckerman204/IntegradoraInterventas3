// ==========================================
// 📄 informacion.page.ts - CÓDIGO COMPLETO
// ==========================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonIcon
} from '@ionic/angular/standalone';

import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

import { addIcons } from 'ionicons';
import { 
  businessOutline,
  peopleOutline,
  rocketOutline, 
  eyeOutline, 
  bulbOutline,
  shieldCheckmarkOutline,
  calendarOutline,
  ribbonOutline,
  timeOutline,
  starOutline,
  checkmarkCircle,
  heartOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonIcon,
    CommonModule, 
    FormsModule
  ]
})
export class InformacionPage implements OnInit {

  constructor() {
    // Registrar los iconos de Ionicons
    addIcons({
      'business-outline': businessOutline,
      'people-outline': peopleOutline,
      'rocket-outline': rocketOutline,
      'eye-outline': eyeOutline,
      'bulb-outline': bulbOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'calendar-outline': calendarOutline,
      'ribbon-outline': ribbonOutline,
      'time-outline': timeOutline,
      'star-outline': starOutline,
      'checkmark-circle': checkmarkCircle,
      'heart-outline': heartOutline
    });
  }

  ngOnInit() {
    console.log('✅ Página de información inicializada');
  }

}