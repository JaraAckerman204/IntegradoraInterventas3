import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline,
  personOutline,
  cogOutline,
  cubeOutline,
  shareSocialOutline,
  lockClosedOutline,
  timeOutline,
  documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-privacidad',
  templateUrl: './privacidad.page.html',
  styleUrls: ['./privacidad.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class PrivacidadPage implements OnInit, AfterViewInit {
  @ViewChildren('reveal', { read: ElementRef }) reveals!: QueryList<ElementRef>;

  constructor() {
    // Registrar los iconos usados en esta vista para que <ion-icon name="..."> funcione
    addIcons({
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'person-outline': personOutline,
      'cog-outline': cogOutline,
      'cube-outline': cubeOutline,
      'share-social-outline': shareSocialOutline,
      'lock-closed-outline': lockClosedOutline,
      'time-outline': timeOutline,
      'document-text-outline': documentTextOutline
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const options = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('in-view');
        }
      });
    }, options);

    // Observe each reveal element
    this.reveals.forEach((q) => {
      if (q && q.nativeElement) observer.observe(q.nativeElement);
    });
  }

}
