import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  informationCircleOutline, 
  shieldCheckmarkOutline, 
  documentTextOutline,
  checkmarkCircle,
  cafeOutline,
  leafOutline,
  bagOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor() {
    addIcons({
      'information-circle-outline': informationCircleOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'document-text-outline': documentTextOutline,
      'checkmark-circle': checkmarkCircle,
      'cafe-outline': cafeOutline,
      'leaf-outline': leafOutline,
      'bag-outline': bagOutline
    });
  }
}