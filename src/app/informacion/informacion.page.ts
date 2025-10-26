import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';

import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

import { addIcons } from 'ionicons';
import { 
  rocketOutline, 
  eyeOutline, 
  bulbOutline,
  shieldCheckmarkOutline 
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    CommonModule, 
    FormsModule
  ]
})
export class InformacionPage implements OnInit {

  constructor() {
    // Registrar los iconos de Ionicons
    addIcons({
      'rocket-outline': rocketOutline,
      'eye-outline': eyeOutline,
      'bulb-outline': bulbOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline
    });
  }

  ngOnInit() {
  }

}